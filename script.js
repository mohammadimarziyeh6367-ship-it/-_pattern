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

const cloneItem = item => item ? { ...item } : null;

const state = {
  stage: 0,
  name: "",
  score: 0,
  completed: new Set(),
  selected: cloneItem(PALETTE_ITEMS[0]),
  eraser: false,
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

function repeatPattern(pattern, count) {
  return Array.from(
    { length: count },
    (_, i) => cloneItem(pattern[i % pattern.length])
  );
}

function makePatternQuestion(pattern, columns, wrongIndex, wrongItem) {
  const expected = repeatPattern(pattern, columns);
  const cells = expected.map(cloneItem);

  cells[wrongIndex] = cloneItem(wrongItem);

  return {
    columns,
    rows: 1,
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

/* الگوی خط‌های رنگی */

const lineExpected = Array.from({ length: 30 }, () => null);

[1, 3, 5, 7].forEach(col => {
  lineExpected[col] = "red";
});

[2, 4, 6, 8].forEach(col => {
  lineExpected[10 + col] = "blue";
});

/* مراحل بازی */

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
      "به هر سه ردیف نگاه کن و در جدول پایین الگوی اصلی را یک بار تکرار کن."
  },
  {
    type: "lines",
    title: "الگوی خطی را ادامه بده",
    description:
      "به خط‌های قرمز و آبی دقت کن و الگو را کامل کن."
  },
  {
    type: "edgeLines",
    title: "الگوی خط‌های آبی",
    description:
      "خط عمودی و خط افقی آبی را مطابق الگو ادامه بده؛ سپس یک بار الگو را در جدول پایین تکرار کن."
  }
];

/* =========================================
   صدا و ابزارهای کمکی
========================================= */

function playTone(frequency = 660, duration = 0.12) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;

    if (!AC) return;

    if (!state.audio) {
      state.audio = new AC();
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
    /* در صورت پشتیبانی‌نشدن صدا، بازی ادامه می‌یابد. */
  }
}

function playClick() {
  playTone(520, 0.06);
}

function playSuccess() {
  playTone(660, 0.12);

  setTimeout(() => playTone(830, 0.15), 120);
  setTimeout(() => playTone(990, 0.2), 250);

  launchFireworks();
}

function toPersianNumber(number) {
  return String(number).replace(
    /\d/g,
    digit => "۰۱۲۳۴۵۶۷۸۹"[digit]
  );
}

function sameItem(a, b) {
  if (!a || !b) {
    return !a && !b;
  }

  return a.shape === b.shape && a.color === b.color;
}

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

function cellElement(item, index, options = {}) {
  const classes = ["cell"];

  if (item) classes.push("filled");
  if (options.empty) classes.push("empty-cell");
  if (options.line) classes.push("line-cell");

  const content = options.line
    ? `<span class="line-mark ${options.line}"></span>`
    : shapeElement(item);

  return `
    <div
      class="${classes.join(" ")}"
      data-index="${index}"
      data-board="${options.board || "main"}"
      ${options.row !== undefined ? `data-row="${options.row}"` : ""}
      role="button"
      aria-label="خانه ${toPersianNumber(index + 1)}"
    >
      ${content}
    </div>
  `;
}

function makeBoard(container, rows, columns, cells, options = {}) {
  container.innerHTML = "";

  container.className =
    `board rows-${rows} ${options.className || ""}`.trim();

  container.style.gridTemplateColumns =
    `repeat(${columns},minmax(0,1fr))`;

  for (let i = 0; i < rows * columns; i++) {
    const item = cells[i] || null;
    const row = Math.floor(i / columns);
    const col = i % columns;

    container.insertAdjacentHTML(
      "beforeend",
      cellElement(item, i, {
        board: options.board || "main",
        empty: !item,
        line: options.lineMode ? item : null,
        row
      })
    );

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

/* =========================================
   شروع و پایان بازی
========================================= */

$("startButton").addEventListener("click", startGame);

$("studentName").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    startGame();
  }
});

const copyState = {
  top: [],
  bottom: []
};

const threeRowsState = {
  top: [],
  bottom: Array(18).fill(null)
};

const lineState = {
  marks: Array(30).fill(null),
  initialized: false
};

const edgeLineState = {
  top: [],
  bottom: []
};

function resetGameData() {
  copyState.top = [];
  copyState.bottom = Array(6).fill(null);

  threeRowsState.top = [];
  threeRowsState.bottom = Array(18).fill(null);

  lineState.marks = Array(30).fill(null);
  lineState.initialized = false;

  edgeLineState.top = [];
  edgeLineState.bottom = [];

  mouseQuestions.forEach(question => {
    question.eaten = false;
    question.cells = question.expected.map(cloneItem);
    question.cells[question.wrongIndex] =
      cloneItem(question.wrongItem);
  });
}

function startGame() {
  state.name =
    $("studentName").value.trim() || "دانش‌آموز عزیز";

  state.stage = 0;
  state.score = 0;
  state.completed.clear();
  state.mouseArmed = false;
  state.eraser = false;
  state.dragging = false;
  state.selected = cloneItem(PALETTE_ITEMS[0]);

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
}

$("restartButton").addEventListener("click", startGame);

/* =========================================
   نمایش مرحله
========================================= */

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
  $("eraserArea").innerHTML = "";

  $("checkButton").disabled = false;
  $("prevButton").disabled = state.stage === 0;
  $("nextButton").disabled = false;

  $("dragMouse").classList.add("hidden");

  if (stage.type === "copy") {
    renderCopyStage();
  } else if (stage.type === "mouse") {
    renderMouseStage();
  } else if (stage.type === "threeRows") {
    renderThreeRowsStage();
  } else if (stage.type === "lines") {
    renderLineStage();
  } else if (stage.type === "edgeLines") {
    renderEdgeLinesStage();
  }
}

/* =========================================
   انتخاب شکل‌ها و پاک‌کن
========================================= */

function renderEraser() {
  const area = $("eraserArea");
  area.innerHTML = "";

  const button = document.createElement("button");

  button.type = "button";
  button.className =
    "eraser-button" + (state.eraser ? " selected" : "");

  button.innerHTML =
    '<span class="eraser-icon">🧽</span><span>پاک کن</span>';

  button.setAttribute("aria-label", "پاک کن");

  button.addEventListener("click", () => {
    state.eraser = !state.eraser;

    if (state.eraser) {
      state.selected = null;
    }

    renderStagePaletteOnly();
    playClick();
  });

  area.appendChild(button);
}

function renderStagePaletteOnly() {
  const stage = stages[state.stage];

  if (stage.type === "threeRows") {
    renderColorPalette();
  } else if (stage.type === "lines") {
    renderLinePalette();
  } else if (stage.type === "edgeLines") {
    renderEdgeLinePalette();
  } else {
    renderPalette();
  }

  renderEraser();
}

function renderPalette(items = PALETTE_ITEMS) {
  const palette = $("palette");
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

    button.addEventListener("click", () => {
      state.selected = cloneItem(item);
      state.eraser = false;

      renderPalette(items);
      renderEraser();

      playClick();
    });

    palette.appendChild(button);
  });

  renderEraser();
}

/* =========================================
   مرحله اول: ادامه الگو و تکرار آن
========================================= */

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

  $("boardLabel").textContent =
    "الگوی اصلی را ادامه بده";

  makeBoard(
    $("mainBoard"),
    1,
    18,
    copyState.top,
    {
      className: "pattern-18",

      onCell: index => {
        if (index < 12) return;

        if (state.eraser) {
          copyState.top[index] = null;
        } else if (state.selected) {
          copyState.top[index] = cloneItem(state.selected);
        } else {
          return;
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
        } else if (state.selected) {
          copyState.bottom[index] = cloneItem(state.selected);
        } else {
          return;
        }

        renderCopyStage();
        playClick();
      }
    }
  );
}

/* =========================================
   مراحل دوم و سوم: موش
========================================= */

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

  if (question.eaten) {
    const cell = $("mainBoard").querySelector(
      `.cell[data-index="${question.wrongIndex}"]`
    );

    if (cell) {
      cell.innerHTML = shapeElement(
        question.expected[question.wrongIndex]
      );

      cell.classList.add("correct-cell");
    }

    $("feedback").textContent =
      "آفرین! حالا الگو دوباره منظم شد.";

    return;
  }

  addMouseToFirstCell();
}

function addMouseToFirstCell() {
  const first = $("mainBoard").querySelector(".cell");

  if (!first) return;

  const mouse = document.createElement("span");

  mouse.className = "mouse-start";
  mouse.textContent = "🐭";
  mouse.setAttribute("role", "button");
  mouse.setAttribute("aria-label", "موش را بکش");
  mouse.setAttribute("tabindex", "0");

  first.appendChild(mouse);

  mouse.addEventListener("click", event => {
    event.stopPropagation();

    state.mouseArmed = true;

    $("feedback").textContent =
      "حالا شکل اشتباه را لمس کن یا موش را روی آن بکش.";

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
  event.stopPropagation();

  state.dragging = true;
  state.dragStage = state.stage;
  state.mouseArmed = true;

  const stageAtStart = state.stage;
  const drag = $("dragMouse");

  drag.classList.remove("hidden");
  drag.style.left = `${event.clientX}px`;
  drag.style.top = `${event.clientY}px`;

  const move = e => {
    drag.style.left = `${e.clientX}px`;
    drag.style.top = `${e.clientY}px`;
  };

  const end = e => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", end);
    document.removeEventListener("pointercancel", end);

    drag.classList.add("hidden");
    state.dragging = false;

    if (stageAtStart !== state.stage) return;

    const target = document.elementFromPoint(
      e.clientX,
      e.clientY
    );

    const cell = target && target.closest("#mainBoard .cell");

    if (cell) {
      eatShape(Number(cell.dataset.index));
    }
  };

  document.addEventListener("pointermove", move, {
    passive: false
  });

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

  $("feedback").textContent =
    "موش شکل اشتباه را خورد! 🐭";

  playSuccess();

  const stageAtEat = state.stage;

  setTimeout(() => {
    if (state.stage !== stageAtEat) return;
    renderMouseStage();
  }, 650);
}

/* =========================================
   مرحله چهارم: جدول سه‌ردیفی
========================================= */

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

    if (!state.eraser && sameItem(item, state.selected)) {
      button.classList.add("selected");
    }

    button.innerHTML = `
      <span
        style="
          display:block;
          width:22px;
          height:22px;
          border-radius:3px;
          background:${COLORS[item.color]};
          border:1px solid #6d5d7d;
        "
      ></span>
    `;

    button.setAttribute(
      "aria-label",
      `رنگ ${item.color}`
    );

    button.addEventListener("click", () => {
      state.selected = cloneItem(item);
      state.eraser = false;

      renderColorPalette();
      renderEraser();

      playClick();
    });

    palette.appendChild(button);
  });
}

function renderThreeRowsStage() {
  renderColorPalette();
  renderEraser();

  if (threeRowsState.top.length !== 63) {
    threeRowsState.top = threeRowExpected.flatMap(
      row => row.map((color, col) =>
        col < 8 ? colorItem(color) : null
      )
    );
  }

  const visibleCells = threeRowsState.top.map(item =>
    item && item.color === "white" ? null : item
  );

  makeBoard(
    $("mainBoard"),
    3,
    21,
    visibleCells,
    {
      className: "pattern-21",

      onCell: (index, row, col) => {
        if (col < 8) return;

        if (state.eraser) {
          threeRowsState.top[index] = null;
        } else if (state.selected) {
          threeRowsState.top[index] =
            cloneItem(state.selected);
        } else {
          return;
        }

        renderThreeRowsStage();
        playClick();
      }
    }
  );

  $("copyLabel").classList.remove("hidden");
  $("copyBoard").classList.remove("hidden");

  $("copyLabel").textContent =
    "الگوی بالا را در این جدول یک بار تکرار کن";

  const bottomVisual = threeRowsState.bottom.map(item =>
    item && item.color === "white" ? null : item
  );

  makeBoard(
    $("copyBoard"),
    3,
    6,
    bottomVisual,
    {
      className: "pattern-21",
      board: "copy",

      onCell: index => {
        if (state.eraser) {
          threeRowsState.bottom[index] = null;
        } else if (state.selected) {
          threeRowsState.bottom[index] =
            cloneItem(state.selected);
        } else {
          return;
        }

        renderThreeRowsStage();
        playClick();
      }
    }
  );
}

/* =========================================
   مرحله پنجم: الگوی خطی
========================================= */

function renderLinePalette() {
  const palette = $("palette");
  palette.innerHTML = "";

  ["red", "blue"].forEach(color => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-button";

    button.innerHTML = `
      <span
        style="
          width:25px;
          height:5px;
          background:${COLORS[color]};
          display:block;
          border-radius:5px;
        "
      ></span>
    `;

    if (
      !state.eraser &&
      state.selected &&
      state.selected.shape === "line" &&
      state.selected.color === color
    ) {
      button.classList.add("selected");
    }

    button.setAttribute(
      "aria-label",
      color === "red" ? "خط قرمز" : "خط آبی"
    );

    button.addEventListener("click", () => {
      state.selected = {
        shape: "line",
        color
      };

      state.eraser = false;

      renderLinePalette();
      renderEraser();

      playClick();
    });

    palette.appendChild(button);
  });
}

function renderLineStage() {
  renderLinePalette();
  renderEraser();

  if (!lineState.initialized) {
    lineState.marks = Array(30).fill(null);

    [1, 3].forEach(col => {
      lineState.marks[col] = "red";
    });

    [2, 4].forEach(col => {
      lineState.marks[10 + col] = "blue";
    });

    lineState.initialized = true;
  }

  const container = $("mainBoard");

  container.innerHTML = "";
  container.className = "board rows-3 line-board";
  container.style.gridTemplateColumns =
    "repeat(10,minmax(0,1fr))";

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

      if (state.eraser) {
        lineState.marks[i] = null;
        cell.innerHTML = "";

        playClick();
        return;
      }

      if (!state.selected || state.selected.shape !== "line") {
        $("feedback").textContent =
          "اول خط قرمز یا آبی را انتخاب کن.";

        return;
      }

      lineState.marks[i] = state.selected.color;
      cell.innerHTML = "";

      const mark = document.createElement("span");

      mark.className = `line-mark ${lineState.marks[i]}`;

      cell.appendChild(mark);

      playClick();
    });

    container.appendChild(cell);
  }
}

/* =========================================
   مرحله ششم: خط عمودی و افقی آبی
========================================= */

function edgePatternCell(v = false, h = false) {
  return { v, h };
}

function edgeExpected(cols, rows) {
  const result = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const phase = col % 3;

      result.push(
        edgePatternCell(
          phase === 1,
          phase === 1 || phase === 2
        )
      );
    }
  }

  return result;
}

function renderEdgeLinePalette() {
  const palette = $("palette");
  palette.innerHTML = "";

  const button = document.createElement("button");

  button.type = "button";
  button.className = "palette-button";

  button.innerHTML = `
    <span
      style="
        width:22px;
        height:22px;
        display:flex;
        align-items:center;
        justify-content:center;
      "
    >
      <span
        style="
          display:block;
          width:5px;
          height:20px;
          background:#4399f2;
          border-radius:5px;
          position:relative;
        "
      >
        <i
          style="
            position:absolute;
            width:20px;
            height:5px;
            left:-7px;
            bottom:0;
            background:#4399f2;
            border-radius:5px;
          "
        ></i>
      </span>
    </span>
  `;

  if (
    !state.eraser &&
    state.selected &&
    state.selected.shape === "edgeLine"
  ) {
    button.classList.add("selected");
  }

  button.setAttribute(
    "aria-label",
    "خط عمودی و افقی آبی"
  );

  button.addEventListener("click", () => {
    state.selected = {
      shape: "edgeLine",
      color: "blue"
    };

    state.eraser = false;

    renderEdgeLinePalette();
    renderEraser();

    playClick();
  });

  palette.appendChild(button);
}

function drawEdgeCell(cell, mark) {
  cell.innerHTML = "";

  if (!mark) return;

  if (mark.v) {
    const vertical = document.createElement("span");

    vertical.className = "edge-v";

    cell.appendChild(vertical);
  }

  if (mark.h) {
    const horizontal = document.createElement("span");

    horizontal.className = "edge-h";

    cell.appendChild(horizontal);
  }
}

function renderEdgeLinesStage() {
  renderEdgeLinePalette();
  renderEraser();

  const expected = edgeExpected(12, 3);

  if (edgeLineState.top.length !== 36) {
    edgeLineState.top = expected.map((mark, index) =>
      index % 12 < 6 ? { ...mark } : null
    );
  }

  const board = $("mainBoard");

  board.innerHTML = "";
  board.className = "board rows-3 pattern-lines-board";
  board.style.gridTemplateColumns =
    "repeat(12,minmax(0,1fr))";

  edgeLineState.top.forEach((mark, index) => {
    const cell = document.createElement("div");

    cell.className = "cell line-cell";

    drawEdgeCell(cell, mark);

    cell.addEventListener("click", () => {
      if (index % 12 < 6) return;

      if (state.eraser) {
        edgeLineState.top[index] = null;
      } else if (
        state.selected &&
        state.selected.shape === "edgeLine"
      ) {
        edgeLineState.top[index] = expected[index];
      } else {
        return;
      }

      drawEdgeCell(cell, edgeLineState.top[index]);

      playClick();
    });

    board.appendChild(cell);
  });

  $("copyLabel").classList.remove("hidden");
  $("copyBoard").classList.remove("hidden");

  $("copyLabel").textContent =
    "الگو را یک بار در جدول ۳ × ۳ تکرار کن";

  if (edgeLineState.bottom.length !== 9) {
    edgeLineState.bottom = Array(9).fill(null);
  }

  const bottomExpected = edgeExpected(3, 3);
  const bottom = $("copyBoard");

  bottom.innerHTML = "";
  bottom.className = "board rows-3 pattern-lines-copy";
  bottom.style.gridTemplateColumns =
    "repeat(3,minmax(0,1fr))";

  edgeLineState.bottom.forEach((mark, index) => {
    const cell = document.createElement("div");

    cell.className = "cell line-cell";

    drawEdgeCell(cell, mark);

    cell.addEventListener("click", () => {
      if (state.eraser) {
        edgeLineState.bottom[index] = null;
      } else if (
        state.selected &&
        state.selected.shape === "edgeLine"
      ) {
        edgeLineState.bottom[index] = bottomExpected[index];
      } else {
        return;
      }

      drawEdgeCell(cell, edgeLineState.bottom[index]);

      playClick();
    });

    bottom.appendChild(cell);
  });
}

/* =========================================
   بررسی پاسخ‌ها
========================================= */

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
  } else if (stage.type === "edgeLines") {
    correct = checkEdgeLinesAnswer();
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

  $("feedback").textContent =
    "آفرین! پاسخ تو درست است. 🌟";

  playSuccess();

  $("checkButton").disabled = true;
}

function checkCopyAnswer() {
  const topOK = copyState.top.every((item, index) =>
    sameItem(
      item,
      index < 12
        ? patternSix[index % 6]
        : patternSix[(index - 12) % 6]
    )
  );

  const bottomOK = copyState.bottom.every((item, index) =>
    sameItem(item, patternSix[index])
  );

  return topOK && bottomOK;
}

function checkThreeRowsAnswer() {
  const topOK =
    threeRowsState.top.length === 63 &&
    threeRowsState.top.every((item, index) =>
      item &&
      item.color ===
        threeRowExpected[Math.floor(index / 21)][index % 21]
    );

  const bottomOK = threeRowsState.bottom.every(
    (item, index) =>
      item &&
      item.color ===
        threeRowExpected[Math.floor(index / 6)][index % 6]
  );

  return topOK && bottomOK;
}

function checkLineAnswer() {
  return lineState.marks.every(
    (mark, index) => mark === lineExpected[index]
  );
}

function checkEdgeLinesAnswer() {
  const expected = edgeExpected(12, 3);
  const bottomExpected = edgeExpected(3, 3);

  const matches = (mark, wanted) => {
    if (!wanted.v && !wanted.h) {
      return !mark || (!mark.v && !mark.h);
    }

    return Boolean(mark) &&
      mark.v === wanted.v &&
      mark.h === wanted.h;
  };

  const topOK = edgeLineState.top.every((mark, index) =>
    index % 12 < 6
      ? Boolean(mark) &&
        mark.v === expected[index].v &&
        mark.h === expected[index].h
      : matches(mark, expected[index])
  );

  const bottomOK = edgeLineState.bottom.every(
    (mark, index) => matches(mark, bottomExpected[index])
  );

  return topOK && bottomOK;
}

/* =========================================
   آتش‌بازی برای پاسخ درست
========================================= */

function launchFireworks() {
  const canvas = $("fireworksCanvas");

  if (!canvas) return;

  const context = canvas.getContext("2d");

  if (!context) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);

  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";

  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  const particles = [];

  const colors = [
    "#f05262",
    "#4399f2",
    "#45bf66",
    "#ffd84d",
    "#a77be8",
    "#ff82b2"
  ];

  for (let burst = 0; burst < 3; burst++) {
    const x = innerWidth * (0.2 + Math.random() * 0.6);
    const y = innerHeight * (0.18 + Math.random() * 0.38);

    for (let i = 0; i < 38; i++) {
      const angle = Math.PI * 2 * i / 38;
      const speed = 1.5 + Math.random() * 3;

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 45 + Math.random() * 20,
        color: colors[
          Math.floor(Math.random() * colors.length)
        ],
        size: 2 + Math.random() * 2
      });
    }
  }

  let frame = 0;

  function draw() {
    context.clearRect(0, 0, innerWidth, innerHeight);

    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vy += 0.045;
      particle.vx *= 0.99;
      particle.life--;

      context.globalAlpha = Math.max(
        0,
        Math.min(1, particle.life / 22)
      );

      context.fillStyle = particle.color;

      context.beginPath();

      context.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
      );

      context.fill();
    });

    context.globalAlpha = 1;

    frame++;

    if (frame < 70) {
      requestAnimationFrame(draw);
    } else {
      context.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  draw();
}

/* =========================================
   قبلی، بعدی و خروج
========================================= */

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
    if (!state.completed.has(state.stage)) {
      checkAnswer();

      if (!state.completed.has(state.stage)) {
        return;
      }
    }

    finishGame();
  }
});

$("exitButton").addEventListener("click", () => {
  $("game").classList.add("hidden");
  $("finish").classList.add("hidden");
  $("welcome").classList.remove("hidden");

  playClick();
});
