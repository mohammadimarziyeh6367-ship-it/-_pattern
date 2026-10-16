"use strict";

/* =====================================================
   الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
   ===================================================== */

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
  mouseArmed: false,
  dragging: false,
  dragStage: null,
  audio: null,
  fireworksTimer: null
};

function cloneItem(item) {
  return item ? { ...item } : null;
}

function repeatPattern(pattern, count) {
  return Array.from(
    { length: count },
    (_, index) => cloneItem(pattern[index % pattern.length])
  );
}

function toPersianNumber(number) {
  return String(number).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[digit]);
}

function sameItem(a, b) {
  if (!a || !b) return !a && !b;
  return a.shape === b.shape && a.color === b.color;
}

function colorItem(color) {
  return { shape: "square", color };
}

/* ---------- الگوهای اصلی ---------- */

const patternSix = [
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" },
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" }
];

function makePatternQuestion(pattern, columns, wrongIndex, wrongItem) {
  const cells = repeatPattern(pattern, columns);

  if (wrongIndex >= 0 && wrongIndex < cells.length) {
    cells[wrongIndex] = cloneItem(wrongItem);
  }

  return {
    columns,
    cells,
    expected: repeatPattern(pattern, columns),
    wrongIndex,
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

/*
  مرحله چهارم:
  ردیف اول: سبز، سفید، سبز، سفید...
  ردیف دوم: سفید، سبز، سفید، قرمز...
  ردیف سوم: سبز، سفید، سبز، سفید...
*/

const threeRowExpected = [
  Array.from({ length: 21 }, (_, i) =>
    i % 2 === 0 ? "green" : "white"
  ),

  Array.from({ length: 21 }, (_, i) =>
    ["white", "green", "white", "red"][i % 4]
  ),

  Array.from({ length: 21 }, (_, i) =>
    i % 2 === 0 ? "green" : "white"
  )
];

/* فقط هشت خانه اول هر ردیف از ابتدا رنگی هستند */
const THREE_ROW_VISIBLE_COLUMNS = 8;

/* الگوی نمونه خط‌ها */
const lineExpected = Array.from({ length: 30 }, () => null);

for (const col of [1, 3, 5, 7, 9]) {
  lineExpected[col] = "red";
}

for (const col of [2, 4, 6, 8]) {
  lineExpected[10 + col] = "blue";
}

const stages = [
  {
    type: "copy",
    title: "الگو را ادامه بده",
    description:
      "الگوی رنگی را بخوان، بالای جدول ادامه بده و پایین آن یک بار الگوی اصلی را تکرار کن."
  },
  {
    type: "mouse",
    title: "موش کدام شکل را بخورد؟",
    description:
      "موش را از خانهٔ اول بردار و روی شکلی ببر که نظم الگو را به هم زده است."
  },
  {
    type: "mouse",
    title: "این بار با دقت نگاه کن!",
    description:
      "موش را روی شکل اشتباه ببر تا الگو دوباره منظم شود."
  },
  {
    type: "threeRows",
    title: "الگوی سه‌ردیفی را کامل کن",
    description:
      "الگو را بخوان، خانه‌های خالی جدول بالا را پر کن و سپس الگو را در جدول پایین تکرار کن."
  },
  {
    type: "lines",
    title: "الگوی خطی را ادامه بده",
    description:
      "رنگ خط قرمز یا آبی را انتخاب کن و خط‌ها را در جای درست ادامه بده."
  }
];

/* ---------- وضعیت سؤال‌ها ---------- */

const copyState = {
  top: [],
  bottom: []
};

const threeRowsState = {
  top: Array.from({ length: 63 }, (_, index) => {
    const row = Math.floor(index / 21);
    const col = index % 21;

    return col < THREE_ROW_VISIBLE_COLUMNS
      ? colorItem(threeRowExpected[row][col])
      : null;
  }),

  bottom: Array.from({ length: 18 }, () => null)
};

const lineState = {
  marks: Array.from({ length: 30 }, (_, index) => {
    const row = Math.floor(index / 10);
    const col = index % 10;

    if (row === 0 && [1, 3].includes(col)) return "red";
    if (row === 1 && [2, 4].includes(col)) return "blue";

    return null;
  })
};

/* ---------- صدا ---------- */

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

    gain.gain.setValueAtTime(0.13, state.audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      state.audio.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(state.audio.destination);

    oscillator.start();
    oscillator.stop(state.audio.currentTime + duration);
  } catch (error) {
    // بازی در صورت نبود پشتیبانی صدا نیز اجرا می‌شود.
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

/* ---------- فشفشه ---------- */

function launchFireworks() {
  const canvas = $("fireworks");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
  canvas.height = window.innerHeight * (window.devicePixelRatio || 1);

  ctx.setTransform(
    window.devicePixelRatio || 1,
    0,
    0,
    window.devicePixelRatio || 1,
    0,
    0
  );

  const width = window.innerWidth;
  const height = window.innerHeight;

  const particles = [];
  const colors = [
    "#ff4f81",
    "#ffd84d",
    "#45bf66",
    "#4399f2",
    "#a77be8",
    "#ff914d"
  ];

  for (let burst = 0; burst < 5; burst++) {
    const centerX = width * (0.15 + Math.random() * 0.7);
    const centerY = height * (0.15 + Math.random() * 0.45);

    for (let i = 0; i < 36; i++) {
      const angle = (Math.PI * 2 * i) / 36;
      const speed = 1.5 + Math.random() * 3;

      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 45 + Math.random() * 25,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 2
      });
    }
  }

  if (state.fireworksTimer) {
    cancelAnimationFrame(state.fireworksTimer);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    let alive = false;

    particles.forEach(particle => {
      if (particle.life <= 0) return;

      alive = true;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.035;
      particle.life--;

      ctx.globalAlpha = Math.min(1, particle.life / 18);
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

    if (alive) {
      state.fireworksTimer = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, width, height);
      state.fireworksTimer = null;
    }
  }

  animate();
}

function celebrate() {
  playSuccess();
  launchFireworks();
}

/* ---------- نمایش شکل‌ها و جدول ---------- */

function shapeElement(item) {
  if (!item) return "";

  const color = COLORS[item.color] || COLORS.white;

  if (item.shape === "triangle") {
    return `
      <span class="shape triangle"
            style="color:${color};border-bottom-color:${color}">
      </span>`;
  }

  return `
    <span class="shape ${item.shape}"
          style="background:${color}">
    </span>`;
}

function cellElement(item, index, options = {}) {
  const classes = ["cell"];

  if (item) classes.push("filled");
  if (options.line) classes.push("line-cell");

  const content = options.line
    ? `<span class="line-mark ${options.line}"></span>`
    : shapeElement(item);

  return `
    <div class="${classes.join(" ")}"
         data-index="${index}"
         data-board="${options.board || "main"}"
         data-row="${options.row ?? 0}"
         role="button"
         aria-label="خانه ${toPersianNumber(index + 1)}">
      ${content}
    </div>`;
}

function makeBoard(container, rows, columns, cells, options = {}) {
  container.innerHTML = "";
  container.className =
    `board rows-${rows} ${options.className || ""}`.trim();

  container.style.gridTemplateColumns =
    `repeat(${columns}, minmax(0, 1fr))`;

  const total = rows * columns;

  for (let i = 0; i < total; i++) {
    const item = cells[i] || null;
    const row = Math.floor(i / columns);
    const col = i % columns;

    const html = cellElement(item, i, {
      board: options.board || "main",
      row
    });

    container.insertAdjacentHTML("beforeend", html);

    const cell = container.lastElementChild;

    if (options.onCell) {
      cell.addEventListener("click", () => {
        options.onCell(i, row, col, cell);
      });
    }
  }

  container.dataset.rows = rows;
  container.dataset.columns = columns;
}

/* ---------- شروع و پایان ---------- */

$("startButton").addEventListener("click", startGame);

$("studentName").addEventListener("keydown", event => {
  if (event.key === "Enter") startGame();
});

function resetGameData() {
  copyState.top = [];
  copyState.bottom = [];

  mouseQuestions.forEach(question => {
    question.cells = repeatPattern(question.expected, question.columns);
    question.cells[question.wrongIndex] = cloneItem(
      question.wrongIndex >= 0
        ? question.wrongIndex === 6
          ? { shape: "triangle", color: "red" }
          : { shape: "circle", color: "red" }
        : null
    );
    question.eaten = false;
  });

  threeRowsState.top = Array.from({ length: 63 }, (_, index) => {
    const row = Math.floor(index / 21);
    const col = index % 21;

    return col < THREE_ROW_VISIBLE_COLUMNS
      ? colorItem(threeRowExpected[row][col])
      : null;
  });

  threeRowsState.bottom = Array.from({ length: 18 }, () => null);

  lineState.marks = Array.from({ length: 30 }, (_, index) => {
    const row = Math.floor(index / 10);
    const col = index % 10;

    if (row === 0 && [1, 3].includes(col)) return "red";
    if (row === 1 && [2, 4].includes(col)) return "blue";

    return null;
  });
}

function startGame() {
  state.name = $("studentName").value.trim() || "دانش‌آموز عزیز";
  state.stage = 0;
  state.score = 0;
  state.completed.clear();
  state.mouseArmed = false;
  state.dragging = false;
  state.dragStage = null;
  state.selected = cloneItem(PALETTE_ITEMS[0]);

  resetGameData();

  $("welcome").classList.add("hidden");
  $("finish").classList.add("hidden");
  $("game").classList.remove("hidden");

  $("studentGreeting").textContent = `${state.name} جان، آماده‌ای؟`;

  renderStage();
  playClick();
}

function finishGame() {
  $("game").classList.add("hidden");
  $("finish").classList.remove("hidden");

  $("finishTitle").textContent = `آفرین ${state.name} جان!`;
  $("finishMessage").textContent =
    "با دقت الگوها را پیدا کردی و ادامه دادی.";

  $("finalScore").textContent =
    `امتیاز تو: ${toPersianNumber(state.score)} از ۵`;

  celebrate();
}

$("restartButton").addEventListener("click", startGame);

/* ---------- نمایش مرحله ---------- */

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
  $("palette").innerHTML = "";

  $("checkButton").disabled = false;
  $("prevButton").disabled = state.stage === 0;
  $("nextButton").disabled = false;

  if (stage.type === "copy") {
    renderCopyStage();
  } else if (stage.type === "mouse") {
    renderMouseStage();
  } else if (stage.type === "threeRows") {
    renderThreeRowsStage();
  } else if (stage.type === "lines") {
    renderLineStage();
  }
}

/* ---------- پالت شکل‌ها ---------- */

function renderPalette(items = PALETTE_ITEMS) {
  const palette = $("palette");
  palette.innerHTML = "";

  items.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-button";

    if (sameItem(item, state.selected)) {
      button.classList.add("selected");
    }

    button.innerHTML = shapeElement(item);
    button.setAttribute(
      "aria-label",
      `${SHAPES[item.shape]} ${item.color}`
    );

    button.addEventListener("click", () => {
      state.selected = cloneItem(item);
      renderPalette(items);
      $("checkButton").disabled = false;
      playClick();
    });

    palette.appendChild(button);
  });
}

/* ---------- سؤال اول ---------- */

function renderCopyStage() {
  renderPalette();

  if (copyState.top.length !== 18) {
    copyState.top = [
      ...repeatPattern(patternSix, 2),
      ...Array.from({ length: 6 }, () => null)
    ];
  }

  if (copyState.bottom.length !== 6) {
    copyState.bottom = Array.from({ length: 6 }, () => null);
  }

  $("boardLabel").textContent = "الگوی اصلی را ادامه بده";

  makeBoard($("mainBoard"), 1, 18, copyState.top, {
    className: "pattern-18",
    onCell: index => {
      if (index >= 12) {
        copyState.top[index] = cloneItem(state.selected);
        renderCopyStage();
        $("checkButton").disabled = false;
        playClick();
      }
    }
  });

  $("copyLabel").classList.remove("hidden");
  $("copyBoard").classList.remove("hidden");

  makeBoard($("copyBoard"), 1, 6, copyState.bottom, {
    className: "pattern-6",
    board: "copy",
    onCell: index => {
      copyState.bottom[index] = cloneItem(state.selected);
      renderCopyStage();
      $("checkButton").disabled = false;
      playClick();
    }
  });
}

/* ---------- سؤال دوم و سوم: موش ---------- */

function renderMouseStage() {
  const question = mouseQuestions[state.stage - 1];

  renderPalette();

  $("boardLabel").textContent = "موش را روی شکل اشتباه ببر";

  makeBoard($("mainBoard"), 1, question.columns, question.cells, {
    className: "pattern-12",
    onCell: index => {
      if (state.mouseArmed) eatShape(index);
    }
  });

  if (!question.eaten) addMouseToFirstCell();
}

function addMouseToFirstCell() {
  const firstCell = $("mainBoard").querySelector(".cell");
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
      "حالا روی شکل اشتباه بزن یا موش را با انگشت بکش.";
    playClick();
  });

  mouse.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      state.mouseArmed = true;
      $("feedback").textContent = "خانهٔ دارای شکل اشتباه را انتخاب کن.";
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

  const move = moveEvent => {
    dragMouse.style.left = `${moveEvent.clientX}px`;
    dragMouse.style.top = `${moveEvent.clientY}px`;
  };

  const end = endEvent => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", end);
    document.removeEventListener("pointercancel", end);

    dragMouse.classList.add("hidden");

    const stageAtStart = state.dragStage;
    state.dragging = false;
    state.dragStage = null;

    if (stageAtStart !== state.stage) return;

    const target = document.elementFromPoint(
      endEvent.clientX,
      endEvent.clientY
    );

    const cell = target && target.closest("#mainBoard .cell");

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
  state.mouseArmed = false;

  question.cells[index] = cloneItem(question.expected[index]);

  const cell = $("mainBoard").querySelector(
    `.cell[data-index="${index}"]`
  );

  if (cell) {
    cell.innerHTML = shapeElement(question.expected[index]);
    cell.style.background = "#e8ffe9";
  }

  $("feedback").textContent = "موش شکل اشتباه را خورد! 🐭";
  playSuccess();

  setTimeout(() => {
    if (state.stage === 1 || state.stage === 2) {
      renderMouseStage();
      $("feedback").textContent =
        "آفرین! شکل اشتباه اصلاح شد.";
    }
  }, 550);
}

/* ---------- مرحله چهارم: سه ردیف ---------- */

function renderColorPalette() {
  const items = [
    colorItem("green"),
    colorItem("white"),
    colorItem("red")
  ];

  const palette = $("palette");
  palette.innerHTML = "";

  items.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-button";

    if (sameItem(item, state.selected)) {
      button.classList.add("selected");
    }

    button.innerHTML = `
      <span style="
        display:block;
        width:22px;
        height:22px;
        border-radius:3px;
        background:${COLORS[item.color]};
        border:1px solid #6d5d7d;
      "></span>`;

    button.setAttribute("aria-label", `رنگ ${item.color}`);

    button.addEventListener("click", () => {
      state.selected = cloneItem(item);
      renderColorPalette();
      $("checkButton").disabled = false;
      playClick();
    });

    palette.appendChild(button);
  });
}

function renderThreeRowsStage() {
  renderColorPalette();

  $("boardLabel").textContent =
    "ستون‌های خالی را با توجه به الگو کامل کن";

  $("copyLabel").textContent =
    "حالا الگوی سه ردیف را در جدول پایین تکرار کن";

  makeBoard(
    $("mainBoard"),
    3,
    21,
    threeRowsState.top,
    {
      className: "pattern-21",
      onCell: (index, row, col) => {
        if (col < THREE_ROW_VISIBLE_COLUMNS) return;

        threeRowsState.top[index] = colorItem(state.selected.color);
        renderThreeRowsStage();
        $("checkButton").disabled = false;
        playClick();
      }
    }
  );

  $("copyLabel").classList.remove("hidden");
  $("copyBoard").classList.remove("hidden");

  makeBoard(
    $("copyBoard"),
    3,
    6,
    threeRowsState.bottom,
    {
      className: "pattern-21",
      board: "copy",
      onCell: index => {
        threeRowsState.bottom[index] = colorItem(state.selected.color);
        renderThreeRowsStage();
        $("checkButton").disabled = false;
        playClick();
      }
    }
  );
}

/* ---------- مرحله پنجم: خط‌های رنگی ---------- */

function renderLinePalette() {
  const palette = $("palette");
  palette.innerHTML = "";

  ["red", "blue"].forEach(color => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-button";

    button.innerHTML = `
      <span style="
        width:25px;
        height:5px;
        background:${COLORS[color]};
        display:block;
        border-radius:5px;
      "></span>`;

    if (
      state.selected &&
      state.selected.shape === "line" &&
      state.selected.color === color
    ) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      state.selected = { shape: "line", color };
      renderLinePalette();
      $("checkButton").disabled = false;
      playClick();
    });

    palette.appendChild(button);
  });
}

function renderLineStage() {
  renderLinePalette();

  const container = $("mainBoard");
  container.innerHTML = "";
  container.className = "board rows-3 line-board";
  container.style.gridTemplateColumns =
    "repeat(10, minmax(0, 1fr))";

  for (let i = 0; i < 30; i++) {
    const row = Math.floor(i / 10);
    const col = i % 10;

    const cell = document.createElement("div");
    cell.className = "cell line-cell";
    cell.dataset.index = i;

    if (lineState.marks[i]) {
      const mark = document.createElement("span");
      mark.className = `line-mark ${lineState.marks[i]}`;
      cell.appendChild(mark);
    }

    cell.addEventListener("click", () => {
      const fixed =
        (row === 0 && [1, 3].includes(col)) ||
        (row === 1 && [2, 4].includes(col));

      if (fixed) return;

      if (!state.selected || state.selected.shape !== "line") {
        $("feedback").textContent = "اول رنگ خط قرمز یا آبی را انتخاب کن.";
        return;
      }

      lineState.marks[i] = state.selected.color;
      renderLineStage();
      $("checkButton").disabled = false;
      playClick();
    });

    container.appendChild(cell);
  }
}

/* ---------- بررسی پاسخ ---------- */

$("checkButton").addEventListener("click", checkAnswer);

function checkAnswer() {
  const stage = stages[state.stage];
  let correct = false;

  if (stage.type === "copy") {
    correct = checkCopyAnswer();
  } else if (stage.type === "mouse") {
    correct = mouseQuestions[state.stage - 1].eaten;
  } else if (stage.type === "threeRows") {
    correct = checkThreeRowsAnswer();
  } else if (stage.type === "lines") {
    correct = checkLineAnswer();
  }

  if (!correct) {
    $("feedback").textContent =
      "هنوز چند خانه باقی مانده است. با دقت دوباره بررسی کن. 💜";
    playTone(260, 0.12);
    return;
  }

  const wasCompleted = state.completed.has(state.stage);

  if (!wasCompleted) {
    state.completed.add(state.stage);
    state.score = state.completed.size;
    $("feedback").textContent = "آفرین! پاسخ تو درست است. 🌟";
    celebrate();
  } else {
    $("feedback").textContent = "پاسخ این مرحله قبلاً ثبت شده است. آفرین! 🌟";
  }

  $("checkButton").disabled = true;
}

function checkCopyAnswer() {
  const topOK = copyState.top.every((item, index) => {
    const expected = index < 12
      ? patternSix[index % 6]
      : patternSix[(index - 12) % 6];

    return sameItem(item, expected);
  });

  const bottomOK = copyState.bottom.every((item, index) =>
    sameItem(item, patternSix[index])
  );

  return topOK && bottomOK;
}

function checkThreeRowsAnswer() {
  const topOK = threeRowsState.top.every((item, index) => {
    const row = Math.floor(index / 21);
    const col = index % 21;

    return item &&
      item.shape === "square" &&
      item.color === threeRowExpected[row][col];
  });

  const bottomOK = threeRowsState.bottom.every((item, index) => {
    const row = Math.floor(index / 6);
    const col = index % 6;
    const expectedColor = threeRowExpected[row][col];

    return item &&
      item.shape === "square" &&
      item.color === expectedColor;
  });

  return topOK && bottomOK;
}

function checkLineAnswer() {
  return lineState.marks.every((mark, index) =>
    mark === lineExpected[index]
  );
}

/* ---------- جابه‌جایی مرحله‌ها ---------- */

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
