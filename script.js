"use strict";

/* =====================================================
   الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
   ===================================================== */

const $ = (id) => document.getElementById(id);

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
  selected: PALETTE_ITEMS[0],
  mouseArmed: false,
  dragging: false,
  dragStage: null,
  audio: null
};

const patternSix = [
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" },
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" }
];

function cloneItem(item) {
  return item ? { ...item } : null;
}

function repeatPattern(pattern, count) {
  return Array.from(
    { length: count },
    (_, i) => cloneItem(pattern[i % pattern.length])
  );
}

function makePatternQuestion(pattern, columns, wrongIndex, wrongItem) {
  const cells = repeatPattern(pattern, columns);

  if (wrongIndex >= 0 && wrongIndex < cells.length) {
    cells[wrongIndex] = cloneItem(wrongItem);
  }

  return {
    columns,
    rows: 1,
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
    description: "الگوی رنگی را بخوان، بالای جدول ادامه بده و پایین آن یک بار الگوی اصلی را تکرار کن."
  },
  {
    type: "mouse",
    title: "موش کدام شکل را بخورد؟",
    description: "موش را از خانهٔ اول بردار و روی شکلی ببر که نظم الگو را به هم زده است."
  },
  {
    type: "mouse",
    title: "این بار با دقت نگاه کن!",
    description: "موش را روی شکل اشتباه ببر تا الگو دوباره منظم شود."
  },
  {
    type: "threeRows",
    title: "الگوی سه‌ردیفی را کامل کن",
    description: "به هر سه ردیف نگاه کن و در جدول پایین الگوی اصلی را یک بار تکرار کن."
  },
  {
    type: "lines",
    title: "الگوی خطی را ادامه بده",
    description: "به خط‌های پایین خانه‌ها دقت کن. خط‌های قرمز و آبی را در جای درست ادامه بده."
  }
];

/* ---------- صداهای بازی ---------- */

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
    // در صورت پشتیبانی‌نشدن صدا، بازی بدون صدا ادامه می‌یابد.
  }
}

function playSuccess() {
  playTone(660, 0.12);
  setTimeout(() => playTone(830, 0.15), 120);
  setTimeout(() => playTone(990, 0.2), 250);
}

function playClick() {
  playTone(520, 0.06);
}

/* ---------- ابزارهای عمومی ---------- */

function toPersianNumber(number) {
  return String(number).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[digit]);
}

function sameItem(a, b) {
  if (!a || !b) return !a && !b;

  return a.shape === b.shape && a.color === b.color;
}

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
  if (options.empty) classes.push("empty-cell");
  if (options.line) classes.push("line-cell");

  const line = options.line
    ? `<span class="line-mark ${options.line}"></span>`
    : "";

  const content = options.line
    ? line
    : shapeElement(item);

  return `
    <div class="${classes.join(" ")}"
         data-index="${index}"
         data-board="${options.board || "main"}"
         ${options.row !== undefined ? `data-row="${options.row}"` : ""}
         role="button"
         aria-label="خانه ${toPersianNumber(index + 1)}">
      ${content}
    </div>`;
}

function makeBoard(container, rows, columns, cells, options = {}) {
  container.innerHTML = "";
  container.className = `board rows-${rows} ${options.className || ""}`.trim();
  container.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;

  const total = rows * columns;

  for (let i = 0; i < total; i++) {
    const item = cells[i] || null;
    const row = Math.floor(i / columns);
    const col = i % columns;

    let line = null;

    if (options.lineMode) {
      line = item;
    }

    const html = cellElement(item, i, {
      board: options.board || "main",
      empty: !item,
      line,
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

/* ---------- صفحهٔ شروع و پایان ---------- */

$("startButton").addEventListener("click", startGame);

$("studentName").addEventListener("keydown", event => {
  if (event.key === "Enter") startGame();
});

function startGame() {
  state.name = $("studentName").value.trim() || "دانش‌آموز عزیز";
  state.stage = 0;
  state.score = 0;
  state.completed.clear();
  state.mouseArmed = false;

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

  playSuccess();
}

$("restartButton").addEventListener("click", () => {
  startGame();
});

/* ---------- نمایش سؤال ---------- */

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

function renderPalette(items = PALETTE_ITEMS) {
  const palette = $("palette");
  palette.innerHTML = "";

  items.forEach((item, index) => {
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
      playClick();
    });

    palette.appendChild(button);
  });
}

/* ---------- سؤال اول: ادامه و تکرار الگو ---------- */

const copyState = {
  top: [],
  bottom: []
};

function renderCopyStage() {
  renderPalette();

  const top = [
    ...repeatPattern(patternSix, 2),
    ...Array.from({ length: 6 }, () => null)
  ];

  copyState.top = top;
  copyState.bottom = Array.from({ length: 6 }, () => null);

  $("boardLabel").textContent = "الگوی اصلی را ادامه بده";

  makeBoard(
    $("mainBoard"),
    1,
    18,
    copyState.top,
    {
      className: "pattern-18",
      onCell: (index) => {
        if (index >= 12) {
          copyState.top[index] = cloneItem(state.selected);
          renderCopyStage();
          playClick();
        }
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
      onCell: (index) => {
        copyState.bottom[index] = cloneItem(state.selected);
        renderCopyStage();
        playClick();
      }
    }
  );
}

/* ---------- سؤال دوم و سوم: موش ---------- */

function renderMouseStage() {
  const questionIndex = state.stage - 1;
  const question = mouseQuestions[questionIndex];

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
      onCell: (index) => {
        if (state.mouseArmed) {
          eatShape(index);
        }
      }
    }
  );

  addMouseToFirstCell();
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
      "حالا روی شکلی که الگو را خراب کرده بزن یا موش را بکش.";
    playClick();
  });

  mouse.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      state.mouseArmed = true;
      $("feedback").textContent =
        "حالا خانهٔ دارای شکل اشتباه را انتخاب کن.";
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

    if (stageAtStart !== state.stage) return;

    const target = document.elementFromPoint(
      endEvent.clientX,
      endEvent.clientY
    );

    const cell = target && target.closest(
      '#mainBoard .cell'
    );

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

  const cell = $("mainBoard").querySelector(
    `.cell[data-index="${index}"]`
  );

  if (cell) {
    cell.innerHTML = "😋";
    cell.style.background = "#fff3c4";
  }

  $("feedback").textContent = "موش شکل اشتباه را خورد! 🐭";
  playSuccess();

  setTimeout(() => {
    if (state.stage !== state.dragStage && state.dragStage !== null) {
      // تغییر مرحله نباید روی سؤال بعدی اثر بگذارد.
    }

    if (state.stage === 1 || state.stage === 2) {
      renderMouseStage();
      $("feedback").textContent =
        "آفرین! حالا الگو دوباره منظم شد.";
    }
  }, 650);
}

/* ---------- سؤال چهارم: سه ردیف و ۲۱ ستون ---------- */

const threeRowsState = {
  bottom: Array.from({ length: 18 }, () => null)
};

function colorItem(color) {
  return {
    shape: "square",
    color
  };
}

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

    button.addEventListener("click", () => {
      state.selected = cloneItem(item);
      renderColorPalette();
      playClick();
    });

    palette.appendChild(button);
  });
}

function renderThreeRowsStage() {
  renderColorPalette();

  const cells = threeRowExpected.flat().map(colorItem);

  makeBoard(
    $("mainBoard"),
    3,
    21,
    cells,
    {
      className: "pattern-21"
    }
  );

  $("copyLabel").classList.remove("hidden");
  $("copyBoard").classList.remove("hidden");
  $("copyLabel").textContent =
    "الگوی بالا را در این جدول یک بار تکرار کن";

  makeBoard(
    $("copyBoard"),
    3,
    6,
    threeRowsState.bottom,
    {
      className: "pattern-21",
      board: "copy",
      onCell: (index) => {
        threeRowsState.bottom[index] = cloneItem(state.selected);
        renderThreeRowsStage();
        playClick();
      }
    }
  );
}

/* ---------- سؤال پنجم: خط‌های رنگی ---------- */

const lineState = {
  marks: Array.from({ length: 30 }, () => null)
};

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

    if (state.selected && state.selected.color === color) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      state.selected = { shape: "line", color };
      renderLinePalette();
      playClick();
    });

    palette.appendChild(button);
  });
}

function renderLineStage() {
  renderLinePalette();

  lineState.marks = Array.from({ length: 30 }, (_, index) => {
    const row = Math.floor(index / 10);
    const col = index % 10;

    if (row === 0 && [1, 3].includes(col)) return "red";
    if (row === 1 && [2, 4].includes(col)) return "blue";

    return null;
  });

  const container = $("mainBoard");
  container.innerHTML = "";
  container.className = "board rows-3 line-board";
  container.style.gridTemplateColumns = "repeat(10, minmax(0, 1fr))";

  for (let i = 0; i < 30; i++) {
    const cell = document.createElement("div");
    cell.className = "cell line-cell";
    cell.dataset.index = i;

    if (lineState.marks[i]) {
      const mark = document.createElement("span");
      mark.className = `line-mark ${lineState.marks[i]}`;
      cell.appendChild(mark);
    }

    cell.addEventListener("click", () => {
      const row = Math.floor(i / 10);
      const col = i % 10;

      // خط‌های نمونهٔ سؤال تغییر نمی‌کنند.
      const fixed =
        (row === 0 && [1, 3].includes(col)) ||
        (row === 1 && [2, 4].includes(col));

      if (fixed) return;

      if (state.selected.shape !== "line") {
        $("feedback").textContent =
          "اول رنگ خط را انتخاب کن.";
        return;
      }

      lineState.marks[i] =
        lineState.marks[i] === state.selected.color
          ? null
          : state.selected.color;

      renderLineStage();
      playClick();
    });

    container.appendChild(cell);
  }
}

/* ---------- بررسی پاسخ‌ها ---------- */

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

  if (!state.completed.has(state.stage)) {
    state.completed.add(state.stage);
    state.score = state.completed.size;
  }

  $("feedback").textContent = "آفرین! پاسخ تو درست است. 🌟";
  playSuccess();

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
  return threeRowsState.bottom.every((item, index) => {
    const row = Math.floor(index / 6);
    const col = index % 6;
    const expectedColor = threeRowExpected[row][col];

    return item && item.color === expectedColor;
  });
}

function checkLineAnswer() {
  return lineState.marks.every((mark, index) => {
    return mark === lineExpected[index];
  });
}

/* ---------- جابه‌جایی بین سؤال‌ها ---------- */

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
