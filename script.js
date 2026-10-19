"use strict";

/* =========================================
   الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
========================================= */

const $ = id => document.getElementById(id);

const COLORS = {
  green: "#45bf66",
  red: "#f05262",
  blue: "#4399f2",
  yellow: "#ffd84d",
  white: "#ffffff",
  pink: "#ff82b2",
  purple: "#a77be8"
};

const SHAPES = {
  circle: "دایره",
  square: "مربع",
  triangle: "مثلث",
  diamond: "لوزی"
};

const PALETTE_ITEMS = [
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" },
  { shape: "diamond", color: "yellow" },
  { shape: "circle", color: "green" },
  { shape: "square", color: "red" }
];

const state = {
  stage: 0,
  name: "",
  score: 0,
  completed: new Set(),
  selected: { ...PALETTE_ITEMS[0] },
  eraser: false,
  mouseArmed: false,
  dragging: false,
  dragStage: null,
  audio: null
};

const cloneItem = item => item ? { ...item } : null;

const repeatPattern = (pattern, count) =>
  Array.from(
    { length: count },
    (_, i) => cloneItem(pattern[i % pattern.length])
  );

function sameItem(a, b) {
  return (!a && !b) ||
    !!(a && b && a.shape === b.shape && a.color === b.color);
}

function toPersianNumber(n) {
  return String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function colorItem(color) {
  return { shape: "square", color };
}

/* الگوی مرحله اول */

const patternSix = [
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" },
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" }
];

const copyState = {
  top: [],
  bottom: []
};

/* سؤال‌های موش */

function makePatternQuestion(pattern, columns, wrongIndex, wrongItem) {
  const expected = repeatPattern(pattern, columns);
  const cells = expected.map(cloneItem);

  cells[wrongIndex] = cloneItem(wrongItem);

  return {
    columns,
    cells,
    expected,
    wrongIndex,
    wrongItem: cloneItem(wrongItem),
    eaten: false
  };
}

const mouseQuestions = [
  makePatternQuestion(
    [
      { shape: "circle", color: "green" },
      { shape: "square", color: "yellow" },
      { shape: "circle", color: "green" },
      { shape: "square", color: "yellow" }
    ],
    12,
    6,
    { shape: "triangle", color: "red" }
  ),

  makePatternQuestion(
    [
      { shape: "triangle", color: "blue" },
      { shape: "diamond", color: "pink" },
      { shape: "triangle", color: "blue" },
      { shape: "diamond", color: "pink" }
    ],
    12,
    7,
    { shape: "circle", color: "red" }
  )
];

/* الگوی سه‌ردیفی */

const greenWhite = Array.from(
  { length: 21 },
  (_, i) => i % 2 === 0 ? "green" : "white"
);

const whiteGreenRed = Array.from(
  { length: 21 },
  (_, i) => ["white", "green", "white", "red"][i % 4]
);

const threeRowExpected = [
  greenWhite,
  whiteGreenRed,
  [...greenWhite]
];

const threeRowsState = {
  top: [],
  bottom: Array(18).fill(null)
};

/* الگوی خطی */

const lineState = {
  marks: Array(30).fill(null)
};

function seedLineMarks() {
  lineState.marks = Array(30).fill(null);

  lineState.marks[1] = "red";
  lineState.marks[3] = "red";

  lineState.marks[12] = "blue";
  lineState.marks[14] = "blue";
}

/* مراحل بازی */

const stages = [
  {
    type: "copy",
    title: "الگو را ادامه بده",
    description:
      "شکل مناسب را انتخاب کن و خانه‌های خالی را کامل کن. سپس الگو را در جدول پایین تکرار کن."
  },
  {
    type: "mouse",
    title: "موش کدام شکل را بخورد؟",
    description:
      "موش را روی شکلی ببر که نظم الگو را به هم زده است."
  },
  {
    type: "mouse",
    title: "این بار با دقت نگاه کن!",
    description:
      "شکل اشتباه را پیدا کن تا الگو دوباره منظم شود."
  },
  {
    type: "threeRows",
    title: "الگوی سه‌ردیفی را کامل کن",
    description:
      "الگوی سه ردیف را ادامه بده و سپس آن را در جدول پایین یک بار تکرار کن."
  },
  {
    type: "lines",
    title: "الگوی خطی را ادامه بده",
    description:
      "رنگ قرمز یا آبی را انتخاب کن و خط‌ها را در جای درست ادامه بده."
  }
];

/* صداها */

function playTone(frequency = 660, duration = 0.12) {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!state.audio) {
      state.audio = new AudioContextClass();
    }

    if (state.audio.state === "suspended") {
      state.audio.resume();
    }

    const oscillator = state.audio.createOscillator();
    const gain = state.audio.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.12, state.audio.currentTime);

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      state.audio.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(state.audio.destination);

    oscillator.start();
    oscillator.stop(state.audio.currentTime + duration);
  } catch (error) {
    // بازی بدون صدا هم باید کار کند.
  }
}

function playClick() {
  playTone(520, 0.06);
}

function playSuccess() {
  playTone(660, 0.12);

  setTimeout(() => playTone(830, 0.15), 120);
  setTimeout(() => playTone(990, 0.2), 250);
}

/* آتش‌بازی */

let fireworksParticles = [];
let fireworksFrame = null;

function launchFireworks() {
  const canvas = $("fireworks");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (fireworksFrame) {
    cancelAnimationFrame(fireworksFrame);
  }

  fireworksParticles = [];

  const colors = [
    "#ff4d8d",
    "#ffd84d",
    "#45bf66",
    "#4399f2",
    "#a77be8",
    "#ff944d"
  ];

  for (let burst = 0; burst < 3; burst++) {
    const centerX = window.innerWidth * (0.25 + burst * 0.25);
    const centerY =
      window.innerHeight * (0.24 + (burst % 2) * 0.15);

    for (let i = 0; i < 38; i++) {
      const angle = (Math.PI * 2 * i) / 38;
      const speed = 1.5 + Math.random() * 3.2;

      fireworksParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 55 + Math.random() * 25,
        size: 2 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    fireworksParticles = fireworksParticles.filter(p => p.life > 0);

    fireworksParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.035;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.life--;

      ctx.globalAlpha = Math.min(1, p.life / 18);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;

    if (fireworksParticles.length > 0) {
      fireworksFrame = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      fireworksFrame = null;
    }
  }

  animate();
}

/* ساخت شکل */

function shapeElement(item) {
  if (!item) return "";

  const color = COLORS[item.color] || COLORS.white;

  if (item.shape === "triangle") {
    return `
      <span
        class="shape triangle"
        style="color:${color};border-bottom-color:${color}"
      ></span>
    `;
  }

  return `
    <span
      class="shape ${item.shape}"
      style="background:${color}"
    ></span>
  `;
}

function cellElement(item, index, boardName = "main") {
  return `
    <div
      class="cell ${item ? "filled" : "empty-cell"}"
      data-index="${index}"
      data-board="${boardName}"
      role="button"
      tabindex="0"
      aria-label="خانه ${toPersianNumber(index + 1)}"
    >
      ${shapeElement(item)}
    </div>
  `;
}

/* ساخت جدول */

function makeBoard(container, rows, columns, cells, options = {}) {
  container.innerHTML = "";

  container.className =
    `board rows-${rows} ${options.className || ""}`.trim();

  container.style.gridTemplateColumns =
    `repeat(${columns}, minmax(0, 1fr))`;

  for (let i = 0; i < rows * columns; i++) {
    const item = cells[i] || null;

    container.insertAdjacentHTML(
      "beforeend",
      cellElement(item, i, options.board || "main")
    );

    const cell = container.lastElementChild;

    if (options.onCell) {
      const activate = event => {
        event.preventDefault();
        options.onCell(i, cell);
      };

      cell.addEventListener("click", activate);

      cell.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          activate(event);
        }
      });
    }
  }

  container.dataset.rows = rows;
  container.dataset.columns = columns;
}

/* انتخاب شکل‌ها */

function renderPalette(items = PALETTE_ITEMS) {
  const palette = $("palette");

  if (!palette) return;

  palette.innerHTML = "";

  items.forEach(item => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-button";

    if (!state.eraser && sameItem(item, state.selected)) {
      button.classList.add("selected");
    }

    button.innerHTML = shapeElement(item);

    button.setAttribute(
      "aria-label",
      `${SHAPES[item.shape]} ${item.color}`
    );

    button.setAttribute(
      "aria-pressed",
      String(!state.eraser && sameItem(item, state.selected))
    );

    button.addEventListener("click", event => {
      event.preventDefault();

      state.selected = cloneItem(item);
      state.eraser = false;

      updateEraserButton();
      renderPalette(items);

      playClick();
    });

    palette.appendChild(button);
  });

  updateEraserButton();
}

/* انتخاب رنگ‌ها برای جدول سه‌ردیفی */

function renderColorPalette() {
  const items = [
    colorItem("green"),
    colorItem("white"),
    colorItem("red")
  ];

  const palette = $("palette");

  if (!palette) return;

  palette.innerHTML = "";

  items.forEach(item => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-button";

    if (!state.eraser && state.selected.color === item.color) {
      button.classList.add("selected");
    }

    button.innerHTML = `
      <span
        style="
          display:block;
          width:25px;
          height:25px;
          border-radius:3px;
          background:${COLORS[item.color]};
          border:1px solid #6d5d7d;
        "
      ></span>
    `;

    button.setAttribute("aria-label", `رنگ ${item.color}`);

    button.addEventListener("click", () => {
      state.selected = cloneItem(item);
      state.eraser = false;

      updateEraserButton();
      renderColorPalette();

      playClick();
    });

    palette.appendChild(button);
  });

  updateEraserButton();
}

/* انتخاب رنگ خط */

function renderLinePalette() {
  const palette = $("palette");

  if (!palette) return;

  palette.innerHTML = "";

  ["red", "blue"].forEach(color => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-button";

    if (
      !state.eraser &&
      state.selected.shape === "line" &&
      state.selected.color === color
    ) {
      button.classList.add("selected");
    }

    button.innerHTML = `
      <span
        style="
          display:block;
          width:27px;
          height:6px;
          background:${COLORS[color]};
          border-radius:5px;
        "
      ></span>
    `;

    button.setAttribute("aria-label", `خط ${color}`);

    button.addEventListener("click", () => {
      state.selected = { shape: "line", color };
      state.eraser = false;

      updateEraserButton();
      renderLinePalette();

      playClick();
    });

    palette.appendChild(button);
  });

  updateEraserButton();
}

/* پاک‌کن پایین صفحه */

function updateEraserButton() {
  const button = $("eraserButton");

  if (!button) return;

  button.classList.toggle("eraser-active", state.eraser);

  button.setAttribute(
    "aria-pressed",
    String(state.eraser)
  );
}

function addEraserButton() {
  // پاک‌کن از قبل در HTML قرار گرفته است.
  // این تابع فقط وضعیت ظاهری آن را به‌روز می‌کند.
  updateEraserButton();
}

$("eraserButton").addEventListener("click", () => {
  state.eraser = !state.eraser;

  updateEraserButton();

  if (stages[state.stage].type === "copy") {
    renderPalette();
  } else if (stages[state.stage].type === "threeRows") {
    renderColorPalette();
  } else if (stages[state.stage].type === "lines") {
    renderLinePalette();
  } else {
    renderPalette();
  }

  playClick();
});

/* ثبت شکل انتخاب‌شده */

function applySelectedItem(currentItem) {
  if (state.eraser) {
    return null;
  }

  return cloneItem(state.selected);
}

/* شروع و راه‌اندازی مجدد */

$("startButton").addEventListener("click", startGame);
$("restartButton").addEventListener("click", startGame);

$("studentName").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    startGame();
  }
});

function resetGameData() {
  copyState.top = [
    ...repeatPattern(patternSix, 2),
    ...Array(6).fill(null)
  ];

  copyState.bottom = Array(6).fill(null);

  threeRowsState.top = threeRowExpected.map(row =>
    row.map(() => null)
  );

  threeRowsState.top = threeRowExpected.map(row =>
    row.map((color, colIndex) => {
      if (colIndex < 8) {
        return colorItem(color);
      }

      return null;
    })
  );

  threeRowsState.bottom = Array(18).fill(null);

  seedLineMarks();

  mouseQuestions.forEach(question => {
    question.cells = question.expected.map(cloneItem);
    question.cells[question.wrongIndex] =
      cloneItem(question.wrongItem);

    question.eaten = false;
  });

  state.selected = cloneItem(PALETTE_ITEMS[0]);
  state.eraser = false;
  state.dragging = false;
  state.dragStage = null;
  state.mouseArmed = false;

  $("dragMouse").classList.add("hidden");

  updateEraserButton();
}

function startGame() {
  state.name =
    $("studentName").value.trim() || "دانش‌آموز عزیز";

  state.stage = 0;
  state.score = 0;
  state.completed.clear();

  resetGameData();

  $("welcome").classList.add("hidden");
  $("finish").classList.add("hidden");
  $("game").classList.remove("hidden");

  $("studentGreeting").textContent =
    `${state.name} جان، آماده‌ای؟`;

  renderStage();

  playClick();
}

function finishGame() {
  $("game").classList.add("hidden");
  $("finish").classList.remove("hidden");

  $("finishTitle").textContent =
    `آفرین ${state.name} جان!`;

  $("finishMessage").textContent =
    "با دقت الگوها را پیدا کردی و ادامه دادی.";

  $("finalScore").textContent =
    `امتیاز تو: ${toPersianNumber(state.score)} از ${toPersianNumber(stages.length)}`;

  playSuccess();
  launchFireworks();
}

/* نمایش مرحله */

function renderStage() {
  state.mouseArmed = false;

  const stage = stages[state.stage];

  $("stageCounter").textContent =
    `${toPersianNumber(state.stage + 1)} از ${toPersianNumber(stages.length)}`;

  $("progressBar").style.width =
    `${((state.stage + 1) / stages.length) * 100}%`;

  $("questionTitle").textContent = stage.title;

  $("questionText").textContent =
    `${state.name} جان، ${stage.description}`;

  $("feedback").textContent = "";

  $("mainBoard").innerHTML = "";
  $("copyBoard").innerHTML = "";

  $("copyLabel").classList.add("hidden");
  $("copyBoard").classList.add("hidden");

  $("boardLabel").textContent = "الگوی اصلی";

  $("checkButton").disabled = false;
  $("prevButton").disabled = state.stage === 0;

  updateEraserButton();

  if (stage.type === "copy") {
    renderCopyStage();
  } else if (stage.type === "mouse") {
    renderMouseStage();
  } else if (stage.type === "threeRows") {
    renderThreeRowsStage();
  } else {
    renderLineStage();
  }
}

/* مرحله اول: ادامه و تکرار الگو */

function renderCopyStage() {
  renderPalette();

  if (copyState.top.length !== 18) {
    copyState.top = [
      ...repeatPattern(patternSix, 2),
      ...Array(6).fill(null)
    ];
  }

  if (copyState.bottom.length !== 6) {
    copyState.bottom = Array(6).fill(null);
  }

  $("boardLabel").textContent = "الگوی اصلی را ادامه بده";

  makeBoard(
    $("mainBoard"),
    1,
    18,
    copyState.top,
    {
      className: "pattern-18",
      onCell: index => {
        if (state.eraser) {
          copyState.top[index] = null;
        } else {
          copyState.top[index] = cloneItem(state.selected);
        }

        renderCopyStage();
        playClick();
      }
    }
  );

  $("copyLabel").classList.remove("hidden");
  $("copyBoard").classList.remove("hidden");

  makeBoard(
    $("copyBoard"),
    1,
    6,
    copyState.bottom,
    {
      className: "pattern-6",
      board: "copy",
      onCell: index => {
        if (state.eraser) {
          copyState.bottom[index] = null;
        } else {
          copyState.bottom[index] = cloneItem(state.selected);
        }

        renderCopyStage();
        playClick();
      }
    }
  );
}

/* مراحل موش */

function renderMouseStage() {
  const question = mouseQuestions[state.stage - 1];

  renderPalette();

  $("boardLabel").textContent =
    "موش را روی شکل اشتباه ببر";

  makeBoard(
    $("mainBoard"),
    1,
    question.columns,
    question.cells,
    {
      className: "pattern-12",

      onCell: index => {
        if (state.mouseArmed) {
          eatShape(index);
        }
      }
    }
  );

  addMouseToFirstCell();
}

function addMouseToFirstCell() {
  const firstCell =
    $("mainBoard").querySelector(".cell");

  if (!firstCell) return;

  const mouse = document.createElement("span");

  mouse.className = "mouse-start";
  mouse.textContent = "🐭";
  mouse.setAttribute("role", "button");
  mouse.setAttribute("aria-label", "موش را بکش");
  mouse.setAttribute("tabindex", "0");

  firstCell.appendChild(mouse);

  mouse.addEventListener("click", event => {
    event.stopPropagation();

    state.mouseArmed = true;

    $("feedback").textContent =
      "حالا روی شکل اشتباه بزن یا موش را بکش.";

    playClick();
  });

  mouse.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      state.mouseArmed = true;
    }
  });

  mouse.addEventListener("pointerdown", startMouseDrag);
}

function startMouseDrag(event) {
  if (state.dragging) return;

  event.preventDefault();

  state.dragging = true;
  state.dragStage = state.stage;
  state.mouseArmed = true;

  const dragMouse = $("dragMouse");

  dragMouse.classList.remove("hidden");

  dragMouse.style.left = `${event.clientX}px`;
  dragMouse.style.top = `${event.clientY}px`;

  const move = e => {
    dragMouse.style.left = `${e.clientX}px`;
    dragMouse.style.top = `${e.clientY}px`;
  };

  const end = e => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", end);
    document.removeEventListener("pointercancel", end);

    dragMouse.classList.add("hidden");

    const startedStage = state.dragStage;

    state.dragging = false;
    state.dragStage = null;

    if (startedStage !== state.stage) return;

    const target =
      document.elementFromPoint(e.clientX, e.clientY);

    const cell =
      target && target.closest("#mainBoard .cell");

    if (cell) {
      eatShape(Number(cell.dataset.index));
    }
  };

  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", end);
  document.addEventListener("pointercancel", end);
}

function eatShape(index) {
  if (state.stage !== 1 && state.stage !== 2) return;

  const question = mouseQuestions[state.stage - 1];

  if (question.eaten) return;

  if (index !== question.wrongIndex) {
    $("feedback").textContent =
      "یک بار دیگر الگو را با دقت بخوان. 🧐";

    playTone(240, 0.12);

    return;
  }

  question.eaten = true;

  question.cells[index] =
    cloneItem(question.expected[index]);

  state.mouseArmed = false;

  completeStage();

  renderMouseStage();

  $("feedback").textContent =
    "آفرین! حالا الگو دوباره منظم شد.";

  playSuccess();
  launchFireworks();
}

/* مرحله چهارم: جدول سه‌ردیفی */

function renderThreeRowsStage() {
  renderColorPalette();

  $("boardLabel").textContent =
    "جدول اصلی: خانه‌های خالی را کامل کن";

  const visibleTop = threeRowsState.top.flat();

  makeBoard(
    $("mainBoard"),
    3,
    21,
    visibleTop,
    {
      className: "pattern-21",

      onCell: index => {
        const row = Math.floor(index / 21);
        const col = index % 21;

        // هشت خانه اول هر ردیف ثابت هستند.
        if (col < 8) return;

        threeRowsState.top[row][col] =
          state.eraser
            ? null
            : colorItem(state.selected.color);

        renderThreeRowsStage();

        playClick();
      }
    }
  );

  $("copyLabel").classList.remove("hidden");
  $("copyBoard").classList.remove("hidden");

  $("copyLabel").textContent =
    "الگوی بالا را در جدول پایین یک بار تکرار کن";

  makeBoard(
    $("copyBoard"),
    3,
    6,
    threeRowsState.bottom,
    {
      className: "pattern-21",
      board: "copy",

      onCell: index => {
        threeRowsState.bottom[index] =
          state.eraser
            ? null
            : colorItem(state.selected.color);

        renderThreeRowsStage();

        playClick();
      }
    }
  );

  updateEraserButton();
}

/* مرحله پنجم: خط‌های رنگی */

function renderLineStage() {
  renderLinePalette();

  const board = $("mainBoard");

  board.innerHTML = "";
  board.className = "board rows-3 line-board";

  board.style.gridTemplateColumns =
    "repeat(10, minmax(0, 1fr))";

  for (let i = 0; i < 30; i++) {
    const cell = document.createElement("div");

    cell.className = "cell line-cell";
    cell.dataset.index = i;

    if (lineState.marks[i]) {
      const mark = document.createElement("span");

      mark.className =
        `line-mark ${lineState.marks[i]}`;

      cell.appendChild(mark);
    }

    cell.addEventListener("click", () => {
      const row = Math.floor(i / 10);
      const col = i % 10;

      // خط‌های نمونه قابل تغییر نیستند.
      const fixed =
        (row === 0 && [1, 3].includes(col)) ||
        (row === 1 && [2, 4].includes(col));

      if (fixed) return;

      if (state.eraser) {
        lineState.marks[i] = null;
      } else if (state.selected.shape === "line") {
        lineState.marks[i] = state.selected.color;
      } else {
        $("feedback").textContent =
          "اول رنگ خط قرمز یا آبی را انتخاب کن.";

        return;
      }

      renderLineStage();

      playClick();
    });

    board.appendChild(cell);
  }

  updateEraserButton();
}

/* بررسی پاسخ‌ها */

$("checkButton").addEventListener("click", checkAnswer);

function checkAnswer() {
  const type = stages[state.stage].type;

  let correct = false;

  if (type === "copy") {
    correct = checkCopyAnswer();
  } else if (type === "mouse") {
    correct = mouseQuestions[state.stage - 1].eaten;
  } else if (type === "threeRows") {
    correct = checkThreeRowsAnswer();
  } else {
    correct = checkLineAnswer();
  }

  if (!correct) {
    $("feedback").textContent =
      "هنوز پاسخ کامل نیست. خانه‌های خالی را بررسی کن. 💜";

    playTone(260, 0.12);

    return;
  }

  if (!state.completed.has(state.stage)) {
    completeStage();

    playSuccess();
    launchFireworks();
  } else {
    $("feedback").textContent =
      "آفرین! پاسخ این مرحله درست است. 🌟";
  }

  $("checkButton").disabled = true;
}

function completeStage() {
  if (!state.completed.has(state.stage)) {
    state.completed.add(state.stage);
    state.score = state.completed.size;
  }

  $("feedback").textContent =
    "آفرین! پاسخ تو درست است. 🌟";
}

/* پاسخ مرحله اول */

function checkCopyAnswer() {
  const topOK = copyState.top.every((item, index) =>
    sameItem(item, patternSix[index % 6])
  );

  const bottomOK = copyState.bottom.every((item, index) =>
    sameItem(item, patternSix[index])
  );

  return topOK && bottomOK;
}

/* پاسخ مرحله چهارم */

function checkThreeRowsAnswer() {
  const topOK = threeRowsState.top.every((row, rowIndex) =>
    row.every((item, colIndex) =>
      !!item &&
      item.color === threeRowExpected[rowIndex][colIndex]
    )
  );

  const bottomOK = threeRowsState.bottom.every((item, index) => {
    const row = Math.floor(index / 6);
    const col = index % 6;

    return !!item &&
      item.color === threeRowExpected[row][col];
  });

  return topOK && bottomOK;
}

/* پاسخ مرحله پنجم */

function checkLineAnswer() {
  const expected = Array(30).fill(null);

  for (const col of [1, 3, 5, 7, 9]) {
    expected[col] = "red";
  }

  for (const col of [2, 4, 6, 8]) {
    expected[10 + col] = "blue";
  }

  return lineState.marks.every((mark, index) =>
    mark === expected[index]
  );
}

/* دکمه‌های حرکت بین مراحل */

$("prevButton").addEventListener("click", () => {
  if (state.stage <= 0) return;

  state.stage--;

  renderStage();

  playClick();
});

$("nextButton").addEventListener("click", () => {
  if (state.stage < stages.length - 1) {
    state.stage++;

    renderStage();

    playClick();
  } else {
    finishGame();
  }
});

$("exitButton").addEventListener("click", () => {
  $("game").classList.add("hidden");
  $("finish").classList.add("hidden");
  $("welcome").classList.remove("hidden");

  playClick();
});
