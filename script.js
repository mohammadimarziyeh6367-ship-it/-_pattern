"use strict";

/* =========================================
   الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
========================================= */

const $ = (id) => document.getElementById(id);

const COLORS = {
  green: "#58c86b",
  blue: "#42a5f5",
  yellow: "#ffd84d",
  red: "#ef5350",
  pink: "#ff73ad"
};

const SHAPES = {
  circle: "circle",
  square: "square",
  triangle: "triangle",
  diamond: "diamond"
};

const PALETTE_ITEMS = [
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" },
  { shape: "diamond", color: "yellow" },
  { shape: "circle", color: "green" },
  { shape: "square", color: "red" }
];

const LINE_COLORS = [
  { color: "red", label: "خط قرمز" },
  { color: "blue", label: "خط آبی" }
];

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function toPersianNumber(number) {
  return String(number).replace(/\d/g, digit => PERSIAN_DIGITS[digit]);
}

function cloneItem(item) {
  return item ? { shape: item.shape, color: item.color } : null;
}

function sameItem(first, second) {
  if (!first || !second) {
    return !first && !second;
  }

  return first.shape === second.shape &&
         first.color === second.color;
}

function colorValue(colorName) {
  return COLORS[colorName] || colorName || "#ffffff";
}

function shuffleCopy(items) {
  const copy = items.slice();

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/* =========================================
   اطلاعات مراحل
========================================= */

const stages = [
  {
    type: "copy",
    title: "الگو را ادامه بده",
    description:
      "رنگ و شکل مناسب را انتخاب کن و خانه‌های خالی را کامل کن."
  },
  {
    type: "mouse",
    title: "به موش کوچولو کمک کن",
    description:
      "موش باید به سمت شکل درست برود تا الگو منظم شود.",
    wrongIndex: 6
  },
  {
    type: "mouse",
    title: "موش کوچولو دوباره کمک می‌خواهد",
    description:
      "خانه‌ای را پیدا کن که الگو را نامنظم کرده است.",
    wrongIndex: 7
  },
  {
    type: "threeRows",
    title: "گل‌های الگو را کامل کن",
    description:
      "به ترتیب رنگ‌ها دقت کن و خانه‌های خالی را پر کن."
  },
  {
    type: "lines",
    title: "الگوی خط‌ها را ادامه بده",
    description:
      "رنگ خط را انتخاب کن و آن را در خانه‌های خالی قرار بده."
  }
];

/* =========================================
   وضعیت بازی
========================================= */

const state = {
  studentName: "",
  stageIndex: 0,
  score: 0,
  checkedStages: new Set(),

  selected: {
    shape: "circle",
    color: "red"
  },

  selectedLineColor: "red",
  eraser: false,

  copy: {
    top: [],
    bottom: []
  },

  mouse: {
    cells: [],
    wrongIndex: 6
  },

  threeRows: {
    cells: [],
    answers: []
  },

  lines: {
    cells: [],
    answers: []
  },

  mouseArmed: false,
  fireworksAnimation: null
};

/* =========================================
   صداهای ساده
========================================= */

let audioContext = null;

function playTone(frequency = 600, duration = 0.08, type = "sine") {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.12, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    // اگر صدا در دستگاه پشتیبانی نشود، بازی ادامه می‌یابد.
  }
}

function playClick() {
  playTone(520, 0.055);
}

function playCorrect() {
  playTone(660, 0.12);
  window.setTimeout(() => playTone(880, 0.16), 110);
}

function playWrong() {
  playTone(240, 0.18, "triangle");
}

/* =========================================
   شکل‌ها
========================================= */

function createShape(item) {
  if (!item) return null;

  const shape = document.createElement("span");
  shape.className = `shape ${item.shape}`;
  shape.style.backgroundColor = colorValue(item.color);
  shape.style.setProperty("--shape-color", colorValue(item.color));
  shape.setAttribute("aria-hidden", "true");

  return shape;
}

function createLine(color, orientation = "horizontal") {
  const line = document.createElement("span");
  line.className = `line-mark ${orientation}`;
  line.style.backgroundColor = colorValue(color);
  line.setAttribute("aria-hidden", "true");

  return line;
}

function createCell(item, options = {}) {
  const {
    editable = false,
    index = -1,
    onClick = null,
    questionMark = false,
    line = false,
    orientation = "horizontal"
  } = options;

  const cell = document.createElement("button");

  cell.type = "button";
  cell.className = "board-cell";

  if (editable) {
    cell.classList.add("editable-cell");
    cell.setAttribute("aria-label", `خانه ${toPersianNumber(index + 1)}`);
  } else {
    cell.tabIndex = -1;
    cell.setAttribute("aria-label", "خانه الگو");
  }

  if (line) {
    if (item) {
      cell.appendChild(createLine(item.color, orientation));
    } else if (questionMark) {
      const mark = document.createElement("span");
      mark.className = "question-mark";
      mark.textContent = "؟";
      cell.appendChild(mark);
    }
  } else if (item) {
    cell.appendChild(createShape(item));
  } else if (questionMark) {
    const mark = document.createElement("span");
    mark.className = "question-mark";
    mark.textContent = "؟";
    cell.appendChild(mark);
  }

  if (editable && typeof onClick === "function") {
    cell.addEventListener("click", () => onClick(index));
  }

  return cell;
}

function renderBoard(container, items, columns, options = {}) {
  container.innerHTML = "";
  container.style.setProperty("--cols", columns);

  const {
    editableIndexes = new Set(),
    onCellClick = null,
    questionMark = false,
    line = false,
    orientation = "horizontal"
  } = options;

  items.forEach((item, index) => {
    const editable = editableIndexes.has(index);

    container.appendChild(
      createCell(item, {
        editable,
        index,
        onClick: onCellClick,
        questionMark: questionMark && !item,
        line,
        orientation
      })
    );
  });
}

/* =========================================
   انتخاب ابزار
========================================= */

function updateEraserButton() {
  const button = $("eraserButton");
  if (!button) return;

  button.classList.toggle("selected", state.eraser);
  button.setAttribute("aria-pressed", String(state.eraser));
}

function renderPalette() {
  const palette = $("palette");
  palette.innerHTML = "";

  PALETTE_ITEMS.forEach(item => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-button";

    if (!state.eraser && sameItem(item, state.selected)) {
      button.classList.add("selected");
    }

    button.setAttribute(
      "aria-label",
      `${item.shape === "circle" ? "دایره" :
        item.shape === "square" ? "مربع" :
        item.shape === "triangle" ? "مثلث" : "لوزی"} ${item.color}`
    );

    button.appendChild(createShape(item));

    button.addEventListener("click", () => {
      state.selected = cloneItem(item);
      state.eraser = false;

      updateEraserButton();
      renderPalette();
      playClick();
    });

    palette.appendChild(button);
  });

  updateEraserButton();
}

function renderColorPalette() {
  const palette = $("palette");
  palette.innerHTML = "";

  Object.entries(COLORS).forEach(([name, color]) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-button";

    if (!state.eraser && state.selectedLineColor === name) {
      button.classList.add("selected");
    }

    const swatch = document.createElement("span");
    swatch.className = "shape circle";
    swatch.style.backgroundColor = color;

    button.appendChild(swatch);
    button.setAttribute("aria-label", `رنگ ${name}`);

    button.addEventListener("click", () => {
      state.selectedLineColor = name;
      state.eraser = false;
      updateEraserButton();
      renderColorPalette();
      playClick();
    });

    palette.appendChild(button);
  });

  updateEraserButton();
}

function renderLinePalette() {
  const palette = $("palette");
  palette.innerHTML = "";

  LINE_COLORS.forEach(item => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-button";

    if (!state.eraser && state.selectedLineColor === item.color) {
      button.classList.add("selected");
    }

    button.appendChild(createLine(item.color));
    button.setAttribute("aria-label", item.label);

    button.addEventListener("click", () => {
      state.selectedLineColor = item.color;
      state.eraser = false;
      updateEraserButton();
      renderLinePalette();
      playClick();
    });

    palette.appendChild(button);
  });

  updateEraserButton();
}

/* =========================================
   پاک‌کن
========================================= */

$("eraserButton").addEventListener("click", () => {
  state.eraser = !state.eraser;

  updateEraserButton();

  /*
    انتخاب رنگ یا شکل قبلی حفظ می‌شود.
    با غیرفعال کردن پاک‌کن، همان ابزار قبلی در دسترس است.
  */

  renderStage();
  playClick();
});

/* =========================================
   آماده‌سازی صفحه
========================================= */

function showScreen(screenId) {
  ["welcome", "game", "finish"].forEach(id => {
    $(id).classList.toggle("hidden", id !== screenId);
  });
}

function setFeedback(message = "", type = "") {
  const feedback = $("feedback");
  feedback.textContent = message;
  feedback.className = "feedback";

  if (type) {
    feedback.classList.add(type);
  }
}

function updateHeader() {
  $("stageCounter").textContent =
    `${toPersianNumber(state.stageIndex + 1)} از ${toPersianNumber(stages.length)}`;

  $("progressBar").style.width =
    `${((state.stageIndex + 1) / stages.length) * 100}%`;

  $("studentGreeting").textContent =
    state.studentName
      ? `آفرین ${state.studentName} جان!`
      : "آفرین، آماده‌ای؟";

  $("prevButton").disabled = state.stageIndex === 0;
  $("nextButton").disabled = state.stageIndex === stages.length - 1;
}

function renderStage() {
  const stage = stages[state.stageIndex];

  updateHeader();
  setFeedback();

  $("questionTitle").textContent = stage.title;
  $("questionText").textContent = stage.description;

  $("mainBoard").innerHTML = "";
  $("copyBoard").innerHTML = "";

  $("boardLabel").classList.remove("hidden");
  $("mainBoard").classList.remove("hidden");
  $("copyLabel").classList.add("hidden");
  $("copyBoard").classList.add("hidden");

  $("dragMouse").classList.add("hidden");

  state.mouseArmed = false;

  if (stage.type === "copy") {
    renderCopyStage();
  } else if (stage.type === "mouse") {
    renderMouseStage(stage);
  } else if (stage.type === "threeRows") {
    renderThreeRowsStage();
  } else if (stage.type === "lines") {
    renderLinesStage();
  }

  updateEraserButton();
}

/* =========================================
   مرحله ۱: ادامه الگو و تکرار
========================================= */

const COPY_PATTERN = [
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" },
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" }
];

function resetCopyStage() {
  state.copy.top = [];
  state.copy.bottom = [];

  for (let i = 0; i < 18; i++) {
    state.copy.top.push(i < 12 ? cloneItem(COPY_PATTERN[i % 6]) : null);
  }

  for (let i = 0; i < 6; i++) {
    state.copy.bottom.push(null);
  }
}

function renderCopyStage() {
  renderPalette();

  $("boardLabel").textContent = "الگوی اصلی";
  $("copyLabel").textContent = "الگو را اینجا تکرار کن";

  $("copyLabel").classList.remove("hidden");
  $("copyBoard").classList.remove("hidden");

  const topEditable = new Set([12, 13, 14, 15, 16, 17]);

  renderBoard(
    $("mainBoard"),
    state.copy.top,
    18,
    {
      editableIndexes: topEditable,
      questionMark: true,
      onCellClick: index => {
        if (!topEditable.has(index)) return;

        state.copy.top[index] =
          state.eraser ? null : cloneItem(state.selected);

        renderCopyStage();
        playClick();
      }
    }
  );

  renderBoard(
    $("copyBoard"),
    state.copy.bottom,
    6,
    {
      editableIndexes: new Set([0, 1, 2, 3, 4, 5]),
      questionMark: true,
      onCellClick: index => {
        state.copy.bottom[index] =
          state.eraser ? null : cloneItem(state.selected);

        renderCopyStage();
        playClick();
      }
    }
  );

  updateEraserButton();
}

/* =========================================
   مرحله‌های ۲ و ۳: موش و شکل اشتباه
========================================= */

function resetMouseStage(stage) {
  const pattern = [
    { shape: "circle", color: "red" },
    { shape: "square", color: "blue" },
    { shape: "triangle", color: "green" },
    { shape: "circle", color: "red" },
    { shape: "square", color: "blue" },
    { shape: "triangle", color: "green" },
    { shape: "circle", color: "red" },
    { shape: "square", color: "blue" },
    { shape: "triangle", color: "green" },
    { shape: "circle", color: "red" },
    { shape: "square", color: "blue" },
    { shape: "triangle", color: "green" }
  ];

  const wrongIndex = stage.wrongIndex;
  const wrongOptions = [
    { shape: "diamond", color: "yellow" },
    { shape: "circle", color: "blue" },
    { shape: "square", color: "red" }
  ];

  pattern[wrongIndex] = cloneItem(
    wrongOptions[state.stageIndex % wrongOptions.length]
  );

  state.mouse.cells = pattern;
  state.mouse.wrongIndex = wrongIndex;
}

function renderMouseStage(stage) {
  renderPalette();

  $("boardLabel").textContent = "کدام شکل الگو را نامنظم کرده است؟";
  $("copyLabel").classList.add("hidden");
  $("copyBoard").classList.add("hidden");

  renderBoard(
    $("mainBoard"),
    state.mouse.cells,
    12,
    {
      editableIndexes: new Set(state.mouse.cells.map((_, i) => i)),
      onCellClick: index => {
        if (index === state.mouse.wrongIndex) {
          setFeedback("آفرین! شکل نامنظم را پیدا کردی. 🧀", "success");
          playCorrect();
          state.mouseArmed = true;
          showMouseAtCell(index);
        } else {
          setFeedback("یک بار دیگر با دقت به الگو نگاه کن.", "error");
          playWrong();
        }
      }
    }
  );
}

function showMouseAtCell(index) {
  const board = $("mainBoard");
  const cell = board.children[index];
  const mouse = $("dragMouse");

  if (!cell) return;

  const rect = cell.getBoundingClientRect();

  mouse.classList.remove("hidden");
  mouse.style.left = `${rect.left + rect.width / 2 - 20}px`;
  mouse.style.top = `${rect.top + rect.height / 2 - 20}px`;
}

/* =========================================
   مرحله ۴: جدول سه‌ردیفی
========================================= */

function resetThreeRowsStage() {
  const rows = 3;
  const cols = 21;

  state.threeRows.cells = [];
  state.threeRows.answers = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let item = null;

      if (row === 0 || row === 2) {
        item = col % 2 === 0
          ? { shape: "circle", color: "green" }
          : null;
      } else {
        const middlePattern = [
          null,
          { shape: "circle", color: "green" },
          null,
          { shape: "circle", color: "red" }
        ];

        item = cloneItem(middlePattern[col % middlePattern.length]);
      }

      state.threeRows.cells.push(item);
      state.threeRows.answers.push(cloneItem(item));
    }
  }
}

function renderThreeRowsStage() {
  renderColorPalette();

  $("boardLabel").textContent = "جدول الگوی گل‌ها";
  $("copyLabel").textContent = "خانه‌های خالی را کامل کن";
  $("copyLabel").classList.remove("hidden");
  $("copyBoard").classList.remove("hidden");

  const cols = 21;
  const editable = new Set();

  state.threeRows.cells.forEach((item, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;

    if (
      (row === 0 || row === 2) &&
      col % 2 === 1
    ) {
      editable.add(index);
    }

    if (row === 1 && (col % 2 === 0 || col % 4 === 3)) {
      editable.add(index);
    }
  });

  renderBoard(
    $("mainBoard"),
    state.threeRows.cells,
    cols,
    {
      editableIndexes: editable,
      questionMark: true,
      onCellClick: index => {
        if (state.eraser) {
          state.threeRows.cells[index] = null;
        } else {
          state.threeRows.cells[index] = {
            shape: "circle",
            color: state.selectedLineColor
          };
        }

        renderThreeRowsStage();
        playClick();
      }
    }
  );

  const bottomItems = Array.from({ length: 6 }, () => null);

  renderBoard(
    $("copyBoard"),
    bottomItems,
    6,
    {
      editableIndexes: new Set([0, 1, 2, 3, 4, 5]),
      questionMark: true,
      onCellClick: index => {
        bottomItems[index] = state.eraser
          ? null
          : { shape: "circle", color: state.selectedLineColor };

        renderBoard(
          $("copyBoard"),
          bottomItems,
          6,
          {
            editableIndexes: new Set([0, 1, 2, 3, 4, 5]),
            questionMark: true,
            onCellClick: () => {}
          }
        );

        playClick();
      }
    }
  );

  updateEraserButton();
}

/* =========================================
   مرحله ۵: الگوی خط‌ها
========================================= */

function resetLinesStage() {
  state.lines.cells = [];
  state.lines.answers = [];

  for (let i = 0; i < 12; i++) {
    const color = i < 8
      ? (i % 2 === 0 ? "red" : "blue")
      : null;

    const item = color ? { color } : null;

    state.lines.cells.push(item);
    state.lines.answers.push(item ? { color } : null);
  }
}

function renderLinesStage() {
  renderLinePalette();

  $("boardLabel").textContent = "الگوی خط‌ها";
  $("copyLabel").classList.add("hidden");
  $("copyBoard").classList.add("hidden");

  renderBoard(
    $("mainBoard"),
    state.lines.cells,
    12,
    {
      editableIndexes: new Set([8, 9, 10, 11]),
      questionMark: true,
      line: true,
      onCellClick: index => {
        if (state.eraser) {
          state.lines.cells[index] = null;
        } else {
          state.lines.cells[index] = {
            color: state.selectedLineColor
          };
        }

        renderLinesStage();
        playClick();
      }
    }
  );

  updateEraserButton();
}

/* =========================================
   بررسی پاسخ‌ها
========================================= */

function arraysMatch(actual, expected) {
  if (actual.length !== expected.length) return false;

  return actual.every((item, index) => sameItem(item, expected[index]));
}

function checkCopyStage() {
  const topCorrect = state.copy.top.slice(12, 18).every((item, index) =>
    sameItem(item, COPY_PATTERN[index])
  );

  const bottomCorrect = arraysMatch(
    state.copy.bottom,
    COPY_PATTERN
  );

  return topCorrect && bottomCorrect;
}

function checkMouseStage() {
  return state.mouseArmed;
}

function checkThreeRowsStage() {
  const cols = 21;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      const expected = state.threeRows.answers[index];
      const actual = state.threeRows.cells[index];

      if (!sameItem(actual, expected)) {
        /*
          خانه‌هایی که در طرح اولیه خالی‌اند، باید خالی بمانند.
          خانه‌های سبز و قرمز باید مطابق الگو باشند.
        */
        return false;
      }
    }
  }

  return true;
}

function checkLinesStage() {
  const expected = [
    { color: "red" },
    { color: "blue" },
    { color: "red" },
    { color: "blue" }
  ];

  return state.lines.cells.slice(8, 12).every((item, index) =>
    item && item.color === expected[index].color
  );
}

function checkCurrentStage() {
  const stage = stages[state.stageIndex];

  let correct = false;

  if (stage.type === "copy") {
    correct = checkCopyStage();
  } else if (stage.type === "mouse") {
    correct = checkMouseStage();
  } else if (stage.type === "threeRows") {
    correct = checkThreeRowsStage();
  } else if (stage.type === "lines") {
    correct = checkLinesStage();
  }

  if (correct) {
    if (!state.checkedStages.has(state.stageIndex)) {
      state.checkedStages.add(state.stageIndex);
      state.score++;
    }

    setFeedback("آفرین قهرمان! پاسخ تو درست است. 🌟", "success");
    playCorrect();
    launchFireworks();
  } else {
    setFeedback(
      "هنوز کامل نشده است؛ با دقت دوباره امتحان کن. 💜",
      "error"
    );
    playWrong();
  }
}

/* =========================================
   آتش‌بازی
========================================= */

function launchFireworks() {
  const canvas = $("fireworks");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;

  ctx.setTransform(
    devicePixelRatio, 0, 0,
    devicePixelRatio, 0, 0
  );

  const particles = [];

  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 4;

    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 35 + Math.random() * 25,
      size: 2 + Math.random() * 3,
      color: [
        "#ff4f9a",
        "#ffd84d",
        "#42a5f5",
        "#58c86b",
        "#9a70ed"
      ][Math.floor(Math.random() * 5)]
    });
  }

  if (state.fireworksAnimation) {
    cancelAnimationFrame(state.fireworksAnimation);
  }

  let frame = 0;

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(particle => {
      if (particle.life <= 0) return;

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.035;
      particle.life--;

      ctx.globalAlpha = Math.max(0, particle.life / 55);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    frame++;

    if (frame < 65) {
      state.fireworksAnimation = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      state.fireworksAnimation = null;
    }
  }

  animate();
}

/* =========================================
   شروع، پایان و جابه‌جایی
========================================= */

function resetGameData() {
  state.stageIndex = 0;
  state.score = 0;
  state.checkedStages.clear();

  state.selected = {
    shape: "circle",
    color: "red"
  };

  state.selectedLineColor = "red";
  state.eraser = false;
  state.mouseArmed = false;

  resetCopyStage();
  resetMouseStage(stages[1]);
  resetThreeRowsStage();
  resetLinesStage();
}

function startGame() {
  state.studentName = $("studentName").value.trim();

  if (!state.studentName) {
    $("studentName").focus();
    $("studentName").placeholder = "اول نامت را بنویس 😊";
    return;
  }

  resetGameData();
  showScreen("game");
  renderStage();
  playClick();
}

function finishGame() {
  showScreen("finish");

  $("finishTitle").textContent =
    `آفرین ${state.studentName} جان!`;

  $("finishMessage").textContent =
    "تو با تلاش و دقت در بازی شرکت کردی. به خودت افتخار کن!";

  $("finalScore").textContent =
    `امتیاز تو: ${toPersianNumber(state.score)} از ${toPersianNumber(stages.length)}`;

  launchFireworks();
}

function goToStage(index) {
  if (index < 0 || index >= stages.length) return;

  state.stageIndex = index;
  renderStage();
  playClick();
}

$("startButton").addEventListener("click", startGame);

$("studentName").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    startGame();
  }
});

$("prevButton").addEventListener("click", () => {
  goToStage(state.stageIndex - 1);
});

$("nextButton").addEventListener("click", () => {
  goToStage(state.stageIndex + 1);
});

$("checkButton").addEventListener("click", checkCurrentStage);

$("exitButton").addEventListener("click", () => {
  showScreen("welcome");
  $("dragMouse").classList.add("hidden");
});

$("restartButton").addEventListener("click", () => {
  resetGameData();
  showScreen("welcome");
  $("studentName").value = state.studentName;
  playClick();
});

/* =========================================
   راه‌اندازی اولیه
========================================= */

resetGameData();
updateEraserButton();
showScreen("welcome");
