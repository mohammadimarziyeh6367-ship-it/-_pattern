"use strict";

/* ==========================================
   بازی الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
========================================== */

const $ = id => document.getElementById(id);


/* ---------- رنگ‌ها ---------- */

const COLORS = {
  red: "#ef5350",
  blue: "#42a5f5",
  green: "#43b96b",
  yellow: "#ffd54f",
  purple: "#ab70df",
  orange: "#ff9f43"
};


/* ---------- شکل‌ها ---------- */

const SHAPES = {
  C: { shape: "circle", color: "red", label: "دایره قرمز" },
  S: { shape: "square", color: "blue", label: "مربع آبی" },
  T: { shape: "triangle", color: "green", label: "مثلث سبز" },
  Y: { shape: "star", color: "yellow", label: "ستاره زرد" }
};


/* ---------- رنگ‌های تمرین ---------- */

const COLOR_ITEMS = {
  P: { color: "purple", label: "بنفش" },
  O: { color: "orange", label: "نارنجی" },
  G: { color: "green", label: "سبز" },
  R: { color: "red", label: "قرمز" },
  B: { color: "blue", label: "آبی" },
  Y: { color: "yellow", label: "زرد" }
};


/* ---------- مراحل بازی ---------- */

const STAGES = [
  {
    id: 1,
    type: "shape",
    title: "الگوی دوشکلی",
    instruction: "الگوی اصلی را دو بار دیگر در جدول بالا ادامه بده.",
    pattern: ["C", "S"],
    columns: 12,
    fixedCount: 4,
    copyColumns: 6,
    palette: ["C", "S"]
  },

  {
    id: 2,
    type: "color",
    title: "الگوی مربع‌های سبز و قرمز",
    instruction: "الگو را ادامه بده و در جدول پایین یک بار الگوی رئیس را تکرار کن.",
    pattern: ["G", "G", "R", "R", "R"],
    columns: 15,
    fixedCount: 8,
    copyColumns: 10,
    palette: ["G", "R"]
  },

  {
    id: 3,
    type: "line",
    title: "الگوی خطی رنگی",
    instruction: "رنگ‌ها را به ترتیب الگوی اصلی ادامه بده.",
    pattern: ["R", "B"],
    columns: 12,
    fixedCount: 4,
    copyColumns: 6,
    palette: ["R", "B"]
  },

  {
    id: 4,
    type: "diagonal",
    title: "الگوی خط‌های مورب",
    instruction: "الگوی خط‌های مورب را ادامه بده و در جدول پایین یک بار الگوی رئیس را تکرار کن.",
    pattern: ["Y", "G"],
    columns: 12,
    fixedCount: 4,
    copyColumns: 4,
    palette: ["R", "G", "Y", "B"]
  },

  {
    id: 5,
    type: "edgePattern",
    title: "الگوی خط‌های مرزی",
    instruction: "الگو را کشف کن، با انگشت یا قلم مسیر خط‌ها را رسم کن و در جدول پایین یک بار الگوی رئیس را تکرار کن.",
    pattern: ["TOP_RIGHT", "BOTTOM", null],
    columns: 12,
    fixedCount: 6,
    copyColumns: 3,
    palette: []
  },

  {
    id: 6,
    type: "line",
    title: "الگوی خطی",
    instruction: "سه خط زرد را مطابق الگو ادامه بده و در جدول پایین یک بار الگوی رئیس را تکرار کن.",
    pattern: [null, "YELLOW_U", null, "YELLOW_U"],
    columns: 16,
    fixedCount: 4,
    copyColumns: 8,
    palette: ["YELLOW_U"]
  },

  {
    id: 7,
    type: "mouse",
    title: "موش کوچولو",
    instruction: "شکل ناهماهنگ را پیدا کن و روی آن بزن.",
    pattern: ["C", "S"],
    columns: 10,
    fixedCount: 0,
    copyColumns: 6,
    palette: ["C", "S"],
    wrongIndex: 5
  },

  {
    id: 8,
    type: "mouse",
    title: "موش و الگوی سه‌شکلی",
    instruction: "شکلی را که با الگو هماهنگ نیست پیدا کن.",
    pattern: ["T", "S", "C"],
    columns: 12,
    fixedCount: 0,
    copyColumns: 6,
    palette: ["T", "S", "C"],
    wrongIndex: 7
  },

  {
    id: 9,
    type: "color",
    title: "الگوی رنگی",
    instruction: "رنگ‌های الگو را به ترتیب ادامه بده.",
    pattern: ["P", "O"],
    columns: 12,
    fixedCount: 4,
    copyColumns: 6,
    palette: ["P", "O"]
  },

  {
    id: 10,
    type: "color",
    title: "الگوی رنگی سه‌تایی",
    instruction: "الگوی رنگی را به‌درستی کامل کن.",
    pattern: ["O", "O", "P"],
    columns: 12,
    fixedCount: 6,
    copyColumns: 6,
    palette: ["O", "P"]
  },

  {
    id: 11,
    type: "color",
    title: "سه رنگ زیبا",
    instruction: "ترتیب رنگ‌ها را حفظ کن و الگو را ادامه بده.",
    pattern: ["P", "O", "G"],
    columns: 12,
    fixedCount: 6,
    copyColumns: 6,
    palette: ["P", "O", "G"]
  },

  {
    id: 12,
    type: "color",
    title: "الگوی چهاررنگی",
    instruction: "چهار رنگ را به ترتیب درست در جدول‌ها قرار بده.",
    pattern: ["P", "O", "Y", "G"],
    columns: 16,
    fixedCount: 8,
    copyColumns: 8,
    palette: ["P", "O", "Y", "G"]
  },

  {
    id: 13,
    type: "flower",
    title: "الگوی سه‌ردیفی گل",
    instruction: "خانه‌های خالی را با دقت کامل کن و الگوی رئیس را هم تکرار کن.",
    columns: 21,
    rows: 3,
    fixedColumns: 8,
    copyColumns: 6,
    palette: ["G", "R"]
  }
];


/* ---------- وضعیت بازی ---------- */

let currentStage = 0;
let studentName = "";
let selectedItem = null;
let eraseMode = false;
let stageChecked = false;
let mouseEaten = false;

let mainAnswers = [];
let copyAnswers = [];

let flowerMainAnswers = [];
let flowerCopyAnswers = [];

let edgeMainDrawings = [null, null];
let edgeCopyDrawings = [null];

let audioContext = null;
let fireworksTimer = null;

/* نگهداری پاسخ هر مرحله */
const savedStages = {};


/* ---------- صداها ---------- */

function playTone(frequency = 440, duration = 0.09) {
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

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(
      0.0001,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.12,
      audioContext.currentTime + 0.015
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);

  } catch (error) {
    // بازی بدون صدا هم اجرا می‌شود.
  }
}

function playPlaceSound() {
  playTone(520, 0.07);
}

function playCorrectSound() {
  playTone(660, 0.1);

  setTimeout(() => {
    playTone(880, 0.13);
  }, 100);
}

function playWrongSound() {
  playTone(220, 0.16);
}


/* ---------- ابزارهای کمکی ---------- */

function getStage() {
  return STAGES[currentStage];
}

function repeatPattern(pattern, count) {
  const result = [];

  for (let i = 0; i < count; i++) {
    result.push(...pattern);
  }

  return result;
}

function patternValue(pattern, index) {
  return pattern[index % pattern.length];
}

function isCorrectArray(actual, expected) {
  if (actual.length !== expected.length) {
    return false;
  }

  return expected.every(
    (value, index) => actual[index] === value
  );
}

function setFeedback(message = "", type = "") {
  const feedback = $("feedback");

  if (!feedback) return;

  feedback.textContent = message;
  feedback.className = "feedback";

  if (type) {
    feedback.classList.add(type);
  }
}


/* ---------- ذخیره پاسخ مرحله ---------- */

function saveCurrentStage() {
  savedStages[currentStage] = {
    mainAnswers: [...mainAnswers],
    copyAnswers: [...copyAnswers],

    flowerMainAnswers: [...flowerMainAnswers],
    flowerCopyAnswers: [...flowerCopyAnswers],

    edgeMainDrawings: edgeMainDrawings.map(
      drawing => drawing
        ? drawing.map(point => ({ ...point }))
        : null
    ),

    edgeCopyDrawings: edgeCopyDrawings.map(
      drawing => drawing
        ? drawing.map(point => ({ ...point }))
        : null
    ),

    mouseEaten,
    stageChecked
  };
}

function loadStageAnswers() {
  const saved = savedStages[currentStage];

  mainAnswers = saved
    ? [...saved.mainAnswers]
    : [];

  copyAnswers = saved
    ? [...saved.copyAnswers]
    : [];

  flowerMainAnswers = saved
    ? [...saved.flowerMainAnswers]
    : [];

  flowerCopyAnswers = saved
    ? [...saved.flowerCopyAnswers]
    : [];

  edgeMainDrawings = saved
    ? saved.edgeMainDrawings.map(
        drawing => drawing
          ? drawing.map(point => ({ ...point }))
          : null
      )
    : [null, null];

  edgeCopyDrawings = saved
    ? saved.edgeCopyDrawings.map(
        drawing => drawing
          ? drawing.map(point => ({ ...point }))
          : null
      )
    : [null];

  mouseEaten = saved ? saved.mouseEaten : false;
  stageChecked = saved ? saved.stageChecked : false;
}


/* ---------- نمایش شکل ---------- */

function makeShapeHTML(id) {
  const item = SHAPES[id];

  if (!item) return "";

  if (item.shape === "star") {
    return `
      <span
        class="shape star"
        style="--shape-color:${COLORS[item.color]}"
        aria-hidden="true"
      >★</span>
    `;
  }

  return `
    <span
      class="shape ${item.shape}"
      style="--shape-color:${COLORS[item.color]}"
      aria-hidden="true"
    ></span>
  `;
}


/* ---------- نمایش رنگ ---------- */

function makeColorHTML(id) {
  const item = COLOR_ITEMS[id];

  if (!item) return "";

  return `
    <span
      class="color-dot"
      style="--dot-color:${COLORS[item.color]}"
      aria-hidden="true"
    ></span>
  `;
}


/* ---------- محتوای خانه ---------- */

function cellContent(id, type) {
  if (!id) return "";

  if (type === "shape" || type === "mouse") {
    return makeShapeHTML(id);
  }

  if (type === "line" && id === "YELLOW_U") {
    return `
      <span class="edge-mark edge-top"
        aria-hidden="true"
        style="border-color:#ffd54f;"></span>

      <span class="edge-mark edge-right"
        aria-hidden="true"
        style="border-color:#ffd54f;"></span>

      <span class="edge-mark edge-bottom"
        aria-hidden="true"
        style="border-color:#ffd54f;"></span>
    `;
  }

  if (type === "line") {
    const color = COLOR_ITEMS[id]?.color;

    if (!color || !COLORS[color]) return "";

    return `
      <span
        class="line-mark"
        style="--line-color:${COLORS[color]}"
        aria-hidden="true"
      ></span>
    `;
  }

  if (type === "diagonal") {
    const item = COLOR_ITEMS[id];
    const color = item?.color;

    if (!color || !COLORS[color]) return "";

    const direction =
      color === "yellow" ? "down" : "up";

    return `
      <span
        class="diagonal-mark diagonal-${direction}"
        style="--line-color:${COLORS[color]}"
        aria-hidden="true"
      ></span>
    `;
  }

  if (type === "edgePattern") {
    if (id === "TOP_RIGHT") {
      return `
        <span class="edge-mark edge-top" aria-hidden="true"></span>
        <span class="edge-mark edge-right" aria-hidden="true"></span>
      `;
    }

    if (id === "BOTTOM") {
      return `
        <span class="edge-mark edge-bottom" aria-hidden="true"></span>
      `;
    }

    return "";
  }

  return makeColorHTML(id);
}


/* ---------- ساخت خانه ---------- */

function createCell({
  value = null,
  type = "shape",
  fixed = false,
  answer = null,
  onClick = null,
  extraClass = ""
} = {}) {

  const cell = document.createElement("button");

  cell.type = "button";
  cell.className = "cell";

  if (extraClass) {
    cell.classList.add(extraClass);
  }

  if (fixed) {
    cell.classList.add("fixed-cell");
    cell.disabled = true;

    cell.setAttribute(
      "aria-label",
      "بخش نمایش‌داده‌شدهٔ الگو"
    );

    cell.innerHTML = cellContent(value, type);

  } else {
    cell.classList.add("answer-cell");

    if (answer) {
      cell.classList.add("has-answer");
      cell.innerHTML = cellContent(answer, type);
    } else {
      cell.classList.add("empty-cell");
      cell.innerHTML = "";
    }

    cell.setAttribute(
      "aria-label",
      answer
        ? "خانهٔ پاسخ پرشده"
        : "خانهٔ خالی برای پاسخ"
    );

    if (onClick) {
      cell.addEventListener("click", onClick);
    }
  }

  return cell;
}


/* ---------- تنظیم جدول ---------- */

function setupBoard(board, columns, rows = 1) {
  board.replaceChildren();

  board.style.setProperty("--columns", columns);
  board.style.setProperty("--rows", rows);

  board.style.gridTemplateColumns =
    `repeat(${columns}, minmax(0, 1fr))`;

  board.style.gridTemplateRows =
    `repeat(${rows}, auto)`;
}


/* ---------- پالت رنگ و شکل ---------- */

function renderPalette() {
  const stage = getStage();
  const palette = $("palette");

  palette.replaceChildren();

  if (stage.type === "edgePattern") {
    return;
  }

  stage.palette.forEach(id => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-item";

    let label = id;

    if (
      stage.type === "shape" ||
      stage.type === "mouse"
    ) {
      button.innerHTML = makeShapeHTML(id);
      label = SHAPES[id]?.label || id;

    } else if (
      stage.type === "line" ||
      stage.type === "diagonal"
    ) {

      if (
        id === "YELLOW_U" &&
        stage.type === "line"
      ) {
        button.innerHTML = `
          <span class="edge-mark edge-top"
            style="border-color:#ffd54f;"
            aria-hidden="true"></span>

          <span class="edge-mark edge-right"
            style="border-color:#ffd54f;"
            aria-hidden="true"></span>

          <span class="edge-mark edge-bottom"
            style="border-color:#ffd54f;"
            aria-hidden="true"></span>
        `;

        label = "سه خط زرد";

      } else {
        const item = COLOR_ITEMS[id];
        const color = item?.color;

        if (!item || !color || !COLORS[color]) {
          return;
        }

        button.innerHTML = `
          <span
            class="palette-line ${
              stage.type === "diagonal"
                ? "palette-diagonal"
                : ""
            }"
            style="--line-color:${COLORS[color]}"
            aria-hidden="true"
          ></span>
        `;

        label = item.label;
      }

    } else {
      button.innerHTML = makeColorHTML(id);
      label = COLOR_ITEMS[id]?.label || id;
    }

    button.setAttribute("aria-label", label);
    button.title = label;

    if (selectedItem === id && !eraseMode) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      selectedItem = id;
      eraseMode = false;

      $("eraserButton").classList.remove("active");

      $("eraserButton").setAttribute(
        "aria-pressed",
        "false"
      );

      renderPalette();

      setFeedback("شکل یا رنگ انتخاب شد.", "");
      playPlaceSound();
    });

    palette.appendChild(button);
  });
}


/* ---------- جدول تمرین‌های معمولی ---------- */

function renderRegularBoards() {
  const stage = getStage();

  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");

  const mainLength = stage.columns;
  const fixedCount = stage.fixedCount || 0;
  const pattern = stage.pattern;

  const isStage6 = currentStage === 5;

  setupBoard(mainBoard, mainLength, 1);

  if (mainAnswers.length !== mainLength) {
    mainAnswers = Array(mainLength).fill(null);
  }

  for (let col = 0; col < mainLength; col++) {
    const expected = patternValue(pattern, col);

    const isFixed = isStage6
      ? col < 4
      : col < fixedCount;

    const cell = createCell({
      value: isFixed ? expected : null,
      type: stage.type,
      fixed: isFixed,
      answer: isFixed ? null : mainAnswers[col],

      onClick: isFixed
        ? null
        : () => putAnswer("main", col)
    });

    mainBoard.appendChild(cell);
  }

  setupBoard(copyBoard, stage.copyColumns, 1);

  if (copyAnswers.length !== stage.copyColumns) {
    copyAnswers = Array(stage.copyColumns).fill(null);
  }

  for (let col = 0; col < stage.copyColumns; col++) {
    const cell = createCell({
      type: stage.type,
      answer: copyAnswers[col],
      onClick: () => putAnswer("copy", col)
    });

    copyBoard.appendChild(cell);
  }
}


/* ---------- تمرین موش ---------- */

function renderMouseBoards() {
  const stage = getStage();

  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");

  setupBoard(mainBoard, stage.columns, 1);

  for (let col = 0; col < stage.columns; col++) {
    const expected = patternValue(stage.pattern, col);
    const isWrong = col === stage.wrongIndex;

    const shownValue = isWrong
      ? stage.pattern[
          (col + 1) % stage.pattern.length
        ]
      : expected;

    const cell = createCell({
      value: mouseEaten && isWrong
        ? null
        : shownValue,

      type: stage.type,
      fixed: !isWrong,
      extraClass: isWrong ? "mouse-target" : ""
    });

    if (isWrong) {
      cell.disabled = mouseEaten;

      if (mouseEaten) {
        cell.innerHTML =
          '<span class="mouse-emoji">🐭</span>';

        cell.classList.add("mouse-found");

      } else {
        cell.addEventListener("click", () => {
          mouseEaten = true;

          playCorrectSound();

          saveCurrentStage();

          renderMouseBoards();

          setFeedback("", "");
        });
      }
    }

    mainBoard.appendChild(cell);
  }

  setupBoard(copyBoard, stage.copyColumns, 1);

  if (copyAnswers.length !== stage.copyColumns) {
    copyAnswers = Array(stage.copyColumns).fill(null);
  }

  for (let col = 0; col < stage.copyColumns; col++) {
    const cell = createCell({
      type: stage.type,
      answer: copyAnswers[col],
      onClick: () => putAnswer("copy", col)
    });

    copyBoard.appendChild(cell);
  }
}


/* ---------- الگوی گل ---------- */

function expectedFlowerValue(row, col) {
  if (row === 0 || row === 2) {
    return col % 2 === 0 ? "G" : null;
  }

  const middlePattern = [null, "G", null, "R"];

  return middlePattern[col % middlePattern.length];
}

function renderFlowerBoards() {
  const stage = getStage();

  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");

  setupBoard(mainBoard, stage.columns, stage.rows);

  const totalMainCells =
    stage.columns * stage.rows;

  if (flowerMainAnswers.length !== totalMainCells) {
    flowerMainAnswers =
      Array(totalMainCells).fill(null);
  }

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.columns; col++) {
      const index = row * stage.columns + col;

      const isFixed = col < stage.fixedColumns;
      const expected = expectedFlowerValue(row, col);

      const cell = createCell({
        value: isFixed ? expected : null,
        type: "color",
        fixed: isFixed,
        answer: isFixed
          ? null
          : flowerMainAnswers[index],

        extraClass: expected === null
          ? "expected-blank"
          : "",

        onClick: isFixed || expected === null
          ? null
          : () => putFlowerAnswer("main", index)
      });

      mainBoard.appendChild(cell);
    }
  }

  setupBoard(
    copyBoard,
    stage.copyColumns,
    stage.rows
  );

  const totalCopyCells =
    stage.copyColumns * stage.rows;

  if (flowerCopyAnswers.length !== totalCopyCells) {
    flowerCopyAnswers =
      Array(totalCopyCells).fill(null);
  }

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.copyColumns; col++) {
      const index = row * stage.copyColumns + col;
      const expected = expectedFlowerValue(row, col);

      const cell = createCell({
        type: "color",
        answer: flowerCopyAnswers[index],

        extraClass: expected === null
          ? "expected-blank"
          : "",

        onClick: expected === null
          ? null
          : () => putFlowerAnswer("copy", index)
      });

      copyBoard.appendChild(cell);
    }
  }
}


/* ==========================================
   تمرین پنجم: رسم با انگشت یا قلم
========================================== */

function renderEdgePatternBoards() {
  const stage = getStage();

  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");

  setupBoard(mainBoard, stage.columns, 1);

  if (edgeMainDrawings.length !== 2) {
    edgeMainDrawings = [null, null];
  }

  for (let col = 0; col < stage.columns; col++) {
    const fixed = col < stage.fixedCount;

    const value = fixed
      ? stage.pattern[col % stage.pattern.length]
      : null;

    mainBoard.appendChild(createCell({
      value,
      type: "edgePattern",
      fixed,
      answer: null
    }));
  }

  setupBoard(copyBoard, stage.copyColumns, 1);

  if (edgeCopyDrawings.length !== 1) {
    edgeCopyDrawings = [null];
  }

  for (let col = 0; col < stage.copyColumns; col++) {
    copyBoard.appendChild(createCell({
      type: "edgePattern",
      fixed: false,
      answer: null
    }));
  }

  createEdgeDrawingLayer(mainBoard, "main");
  createEdgeDrawingLayer(copyBoard, "copy");
}


/* ---------- لایه رسم مسیر ---------- */

function createEdgeDrawingLayer(board, boardType) {
  const isMain = boardType === "main";
  const columns = isMain ? 12 : 3;

  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  svg.classList.add("edge-drawing-layer");

  svg.setAttribute(
    "viewBox",
    `0 0 ${columns} 1`
  );

  svg.setAttribute("preserveAspectRatio", "none");

  svg.style.touchAction = "none";
  svg.style.pointerEvents = "auto";

  const hitArea = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  hitArea.setAttribute("x", isMain ? "6" : "0");
  hitArea.setAttribute("y", "0");
  hitArea.setAttribute("width", isMain ? "6" : "3");
  hitArea.setAttribute("height", "1");
  hitArea.setAttribute("fill", "transparent");

  hitArea.style.pointerEvents = "all";

  svg.appendChild(hitArea);
  board.appendChild(svg);

  let activeGroup = null;
  let activePoints = [];
  let activePointerId = null;

  function getDrawings() {
    return isMain
      ? edgeMainDrawings
      : edgeCopyDrawings;
  }

  function getPosition(event) {
    const rect = svg.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return { x: 0, y: 0 };
    }

    const x =
      ((event.clientX - rect.left) / rect.width) *
      columns;

    const y =
      (event.clientY - rect.top) /
      rect.height;

    return {
      x: Math.max(0, Math.min(columns, x)),
      y: Math.max(0, Math.min(1, y))
    };
  }

  function getGroupIndex(position) {
    if (isMain) {
      if (position.x < 6 || position.x > 12) {
        return null;
      }

      const groupStart =
        Math.floor((position.x - 6) / 3) * 3 + 6;

      if (groupStart !== 6 && groupStart !== 9) {
        return null;
      }

      return (groupStart - 6) / 3;
    }

    if (position.x < 0 || position.x > 3) {
      return null;
    }

    return 0;
  }

  function getGroupStart(index) {
    return isMain ? 6 + index * 3 : 0;
  }

  function drawAll() {
    svg.querySelectorAll(
      ".student-edge-line"
    ).forEach(line => line.remove());

    const drawings = getDrawings();

    drawings.forEach((points, index) => {
      if (!points || points.length < 2) return;

      const groupStart = getGroupStart(index);

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );

      line.classList.add("student-edge-line");

      line.setAttribute(
        "points",
        points.map(point =>
          `${point.x + groupStart},${point.y}`
        ).join(" ")
      );

      svg.appendChild(line);
    });

    if (
      activeGroup !== null &&
      activePoints.length > 1
    ) {
      const groupStart = getGroupStart(activeGroup);

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );

      line.classList.add("student-edge-line");

      line.setAttribute(
        "points",
        activePoints.map(point =>
          `${point.x + groupStart},${point.y}`
        ).join(" ")
      );

      svg.appendChild(line);
    }
  }

  function eraseGroup(groupIndex) {
    getDrawings()[groupIndex] = null;

    saveCurrentStage();
    drawAll();

    playPlaceSound();
  }

  hitArea.addEventListener("pointerdown", event => {
    event.preventDefault();

    if (stageChecked) return;

    const position = getPosition(event);
    const groupIndex = getGroupIndex(position);

    if (groupIndex === null) return;

    if (eraseMode) {
      eraseGroup(groupIndex);
      return;
    }

    activeGroup = groupIndex;

    const groupStart = getGroupStart(groupIndex);

    activePoints = [{
      x: position.x - groupStart,
      y: position.y
    }];

    activePointerId = event.pointerId;

    try {
      svg.setPointerCapture(event.pointerId);
    } catch (error) {
      // در مرورگرهای فاقد پشتیبانی، رسم ادامه می‌یابد.
    }

    drawAll();
  });

  svg.addEventListener("pointermove", event => {
    if (activeGroup === null) return;

    if (event.pointerId !== activePointerId) return;

    event.preventDefault();

    const position = getPosition(event);
    const groupStart = getGroupStart(activeGroup);

    const localX = Math.max(
      0,
      Math.min(3, position.x - groupStart)
    );

    const localY = Math.max(
      0,
      Math.min(1, position.y)
    );

    const previous =
      activePoints[activePoints.length - 1];

    if (
      !previous ||
      Math.abs(previous.x - localX) > 0.003 ||
      Math.abs(previous.y - localY) > 0.003
    ) {
      activePoints.push({
        x: localX,
        y: localY
      });
    }

    drawAll();
  });

  function finishDrawing(event) {
    if (activeGroup === null) return;

    if (
      event &&
      activePointerId !== null &&
      event.pointerId !== activePointerId
    ) {
      return;
    }

    /* ثبت آخرین نقطه هنگام برداشتن انگشت */
    if (event && event.type === "pointerup") {
      const position = getPosition(event);
      const groupStart = getGroupStart(activeGroup);

      const finalPoint = {
        x: Math.max(
          0,
          Math.min(3, position.x - groupStart)
        ),
        y: Math.max(
          0,
          Math.min(1, position.y)
        )
      };

      const previous =
        activePoints[activePoints.length - 1];

      if (
        !previous ||
        Math.abs(previous.x - finalPoint.x) > 0.003 ||
        Math.abs(previous.y - finalPoint.y) > 0.003
      ) {
        activePoints.push(finalPoint);
      }
    }

    const drawings = getDrawings();

    drawings[activeGroup] =
      activePoints.length >= 2
        ? activePoints.map(point => ({ ...point }))
        : null;

    activeGroup = null;
    activePoints = [];
    activePointerId = null;

    saveCurrentStage();
    drawAll();

    playPlaceSound();
  }

  svg.addEventListener("pointerup", finishDrawing);
  svg.addEventListener("pointercancel", finishDrawing);
  svg.addEventListener("lostpointercapture", finishDrawing);

  drawAll();
}


/* ---------- بررسی مسیر رسم‌شده ---------- */

function isCorrectEdgeDrawing(points) {
  if (!points || points.length < 4) {
    return false;
  }

  const targets = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 3, y: 1 }
  ];

  let lastIndex = -1;

  for (const target of targets) {
    let found = false;

    for (
      let i = lastIndex + 1;
      i < points.length;
      i++
    ) {
      const dx = points[i].x - target.x;
      const dy = points[i].y - target.y;

      const distance = Math.sqrt(
        dx * dx + dy * dy
      );

      if (distance <= 0.35) {
        lastIndex = i;
        found = true;
        break;
      }
    }

    if (!found) return false;
  }

  return true;
}

function checkEdgePatternStage() {
  return (
    isCorrectEdgeDrawing(edgeMainDrawings[0]) &&
    isCorrectEdgeDrawing(edgeMainDrawings[1]) &&
    isCorrectEdgeDrawing(edgeCopyDrawings[0])
  );
}


/* ---------- رسم مرحله ---------- */

function renderStage() {
  const stage = getStage();

  if (!stage) return;

  loadStageAnswers();

  $("stageTitle").textContent = stage.title;
  $("stageInstruction").textContent = stage.instruction;

  $("stageLabel").textContent =
    `تمرین ${currentStage + 1} از ${STAGES.length}`;

  const progress =
    ((currentStage + 1) / STAGES.length) * 100;

  $("progressBar").style.width = `${progress}%`;

  $("progressTrack").setAttribute(
    "aria-valuenow",
    String(currentStage + 1)
  );

  $("prevButton").disabled = currentStage === 0;

  $("nextButton").textContent =
    currentStage === STAGES.length - 1
      ? "پایان بازی"
      : "مرحله بعدی";

  selectedItem = null;
  eraseMode = false;

  $("eraserButton").classList.remove("active");

  $("eraserButton").setAttribute(
    "aria-pressed",
    "false"
  );

  $("checkButton").disabled = stageChecked;

  setFeedback("", "");

  renderPalette();

  if (stage.type === "flower") {
    renderFlowerBoards();

  } else if (stage.type === "mouse") {
    renderMouseBoards();

  } else if (stage.type === "edgePattern") {
    renderEdgePatternBoards();

  } else {
    renderRegularBoards();
  }
}


/* ---------- قرار دادن پاسخ ---------- */

function putAnswer(boardType, index) {
  if (stageChecked) return;

  const stage = getStage();
  const isStage6 = currentStage === 5;

  const answers =
    boardType === "main"
      ? mainAnswers
      : copyAnswers;

  if (
    isStage6 &&
    boardType === "copy" &&
    index !== 1
  ) {
    return;
  }

  const patternIndex =
    index % stage.pattern.length;

  if (
    isStage6 &&
    boardType === "main" &&
    stage.pattern[patternIndex] === null
  ) {
    return;
  }

  if (eraseMode) {
    answers[index] = null;

    playPlaceSound();

    saveCurrentStage();
    renderStagePreservingAnswers();

    return;
  }

  if (!selectedItem) {
    setFeedback(
      "ابتدا شکل یا رنگ موردنظر را انتخاب کن.",
      "warning"
    );

    return;
  }

  answers[index] = selectedItem;

  playPlaceSound();

  saveCurrentStage();
  renderStagePreservingAnswers();
}


/* ---------- نمایش دوباره بدون حذف پاسخ ---------- */

function renderStagePreservingAnswers() {
  const stage = getStage();

  renderPalette();

  if (stage.type === "flower") {
    renderFlowerBoards();

  } else if (stage.type === "mouse") {
    renderMouseBoards();

  } else if (stage.type === "edgePattern") {
    renderEdgePatternBoards();

  } else {
    renderRegularBoards();
  }
}


/* ---------- پاسخ تمرین گل ---------- */

function putFlowerAnswer(boardType, index) {
  if (stageChecked) return;

  const stage = getStage();

  const answers =
    boardType === "main"
      ? flowerMainAnswers
      : flowerCopyAnswers;

  const columns =
    boardType === "main"
      ? stage.columns
      : stage.copyColumns;

  const row = Math.floor(index / columns);
  const col = index % columns;

  if (expectedFlowerValue(row, col) === null) {
    return;
  }

  if (eraseMode) {
    answers[index] = null;

    playPlaceSound();

    saveCurrentStage();
    renderStagePreservingAnswers();

    return;
  }

  if (!selectedItem) {
    setFeedback(
      "ابتدا رنگ موردنظر را انتخاب کن.",
      "warning"
    );

    return;
  }

  answers[index] = selectedItem;

  playPlaceSound();

  saveCurrentStage();
  renderStagePreservingAnswers();
}


/* ---------- پاک‌کن ---------- */

function toggleEraser() {
  if (stageChecked) return;

  eraseMode = !eraseMode;

  $("eraserButton").classList.toggle(
    "active",
    eraseMode
  );

  $("eraserButton").setAttribute(
    "aria-pressed",
    String(eraseMode)
  );

  if (eraseMode) {
    selectedItem = null;

    setFeedback(
      "روی خانه یا مسیری بزن که می‌خواهی پاک شود.",
      ""
    );

  } else {
    setFeedback("", "");
  }

  renderPalette();
}


/* ---------- پاک‌کردن پاسخ‌ها ---------- */

function clearAnswers() {
  if (stageChecked) return;

  const stage = getStage();

  if (stage.type === "edgePattern") {
    edgeMainDrawings = [null, null];
    edgeCopyDrawings = [null];

    saveCurrentStage();

    setFeedback("", "");
    renderStagePreservingAnswers();

    return;
  }

  if (stage.type === "flower") {
    flowerMainAnswers = Array(
      stage.columns * stage.rows
    ).fill(null);

    flowerCopyAnswers = Array(
      stage.copyColumns * stage.rows
    ).fill(null);

  } else {
    mainAnswers = Array(stage.columns).fill(null);
    copyAnswers = Array(stage.copyColumns).fill(null);
  }

  mouseEaten = false;

  saveCurrentStage();

  setFeedback("", "");
  renderStagePreservingAnswers();
}


/* ---------- بررسی تمرین‌های معمولی ---------- */

function checkRegularStage() {
  const stage = getStage();
  const isStage6 = currentStage === 5;

  const expectedMain = [];

  for (let col = 0; col < stage.columns; col++) {
    expectedMain.push(
      patternValue(stage.pattern, col)
    );
  }

  const mainIsCorrect =
    mainAnswers.length === stage.columns &&
    mainAnswers.every((answer, index) => {

      if (isStage6) {
        if (index < 4) return true;

        const expected = expectedMain[index];

        if (expected === null) {
          return answer === null;
        }

        return answer === expected;
      }

      if (index < stage.fixedCount) {
        return true;
      }

      return answer === expectedMain[index];
    });

  const expectedCopy =
    Array(stage.copyColumns).fill(null);

  if (isStage6) {
    expectedCopy[1] = "YELLOW_U";

  } else {
    for (
      let col = 0;
      col < Math.min(
        stage.pattern.length,
        stage.copyColumns
      );
      col++
    ) {
      expectedCopy[col] = stage.pattern[col];
    }
  }

  const copyIsCorrect =
    copyAnswers.length === expectedCopy.length &&
    expectedCopy.every(
      (expected, index) =>
        copyAnswers[index] === expected
    );

  return mainIsCorrect && copyIsCorrect;
}


/* ---------- بررسی تمرین موش ---------- */

function checkMouseStage() {
  const stage = getStage();

  const expectedCopy =
    Array(stage.copyColumns).fill(null);

  for (
    let col = 0;
    col < Math.min(
      stage.pattern.length,
      stage.copyColumns
    );
    col++
  ) {
    expectedCopy[col] = stage.pattern[col];
  }

  return (
    mouseEaten &&
    isCorrectArray(copyAnswers, expectedCopy)
  );
}


/* ---------- بررسی تمرین گل ---------- */

function checkFlowerStage() {
  const stage = getStage();

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.columns; col++) {
      const index =
        row * stage.columns + col;

      if (col < stage.fixedColumns) {
        continue;
      }

      if (
        flowerMainAnswers[index] !==
        expectedFlowerValue(row, col)
      ) {
        return false;
      }
    }
  }

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.copyColumns; col++) {
      const index =
        row * stage.copyColumns + col;

      if (
        flowerCopyAnswers[index] !==
        expectedFlowerValue(row, col)
      ) {
        return false;
      }
    }
  }

  return true;
}


/* ---------- بررسی پاسخ‌ها ---------- */

function checkAnswers() {
  if (stageChecked) return;

  const stage = getStage();

  let correct = false;

  if (stage.type === "flower") {
    correct = checkFlowerStage();

  } else if (stage.type === "mouse") {
    correct = checkMouseStage();

  } else if (stage.type === "edgePattern") {
    correct = checkEdgePatternStage();

  } else {
    correct = checkRegularStage();
  }

  if (!correct) {
    playWrongSound();

    setFeedback(
      "هنوز چند خانه نیاز به بررسی دارد. دوباره تلاش کن.",
      "warning"
    );

    return;
  }

  stageChecked = true;

  saveCurrentStage();

  $("checkButton").disabled = true;

  playCorrectSound();

  setFeedback("", "");

  showFireworks();
}


/* ---------- فشفشه ---------- */

function showFireworks() {
  const container = $("fireworks");

  container.replaceChildren();

  if (fireworksTimer) {
    clearTimeout(fireworksTimer);
    fireworksTimer = null;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const particleCount = reducedMotion ? 12 : 65;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");

    particle.className = "firework-particle";

    const colors = Object.values(COLORS);

    particle.style.setProperty(
      "--particle-color",
      colors[i % colors.length]
    );

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${20 + Math.random() * 50}%`;

    particle.style.setProperty(
      "--dx",
      `${(Math.random() - 0.5) * 260}px`
    );

    particle.style.setProperty(
      "--dy",
      `${(Math.random() - 0.5) * 260}px`
    );

    particle.style.animationDelay =
      `${Math.random() * 0.35}s`;

    container.appendChild(particle);
  }

  container.classList.add("active");

  fireworksTimer = setTimeout(() => {
    container.classList.remove("active");
    container.replaceChildren();
    fireworksTimer = null;
  }, 2200);
}


/* ---------- شروع بازی ---------- */

function startGame() {
  const nameInput = $("studentName");

  if (!nameInput) return;

  const name = nameInput.value.trim();

  studentName = name || "دانش‌آموز عزیز";

  $("studentGreeting").textContent =
    `سلام ${studentName}، آماده‌ای الگوها را کامل کنی؟`;

  currentStage = 0;

  Object.keys(savedStages).forEach(
    key => delete savedStages[key]
  );

  selectedItem = null;
  eraseMode = false;
  stageChecked = false;
  mouseEaten = false;

  $("welcome").hidden = true;
  $("finish").hidden = true;
  $("game").hidden = false;

  renderStage();

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });
}


/* ---------- مرحله بعد ---------- */

function nextStage() {
  saveCurrentStage();

  if (currentStage < STAGES.length - 1) {
    currentStage++;

    renderStage();

    return;
  }

  showFinish();
}


/* ---------- مرحله قبل ---------- */

function previousStage() {
  if (currentStage <= 0) return;

  saveCurrentStage();

  currentStage--;

  renderStage();
}


/* ---------- پایان بازی ---------- */

function showFinish() {
  $("game").hidden = true;
  $("welcome").hidden = true;
  $("finish").hidden = false;

  $("finishMessage").textContent =
    `بازی برای ${studentName} به پایان رسید.`;

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });
}


/* ---------- خروج ---------- */

function exitGame() {
  const confirmed = window.confirm(
    "آیا می‌خواهی از بازی خارج شوی؟"
  );

  if (!confirmed) return;

  $("game").hidden = true;
  $("finish").hidden = true;
  $("welcome").hidden = false;

  if (fireworksTimer) {
    clearTimeout(fireworksTimer);
    fireworksTimer = null;
  }

  $("fireworks").classList.remove("active");
  $("fireworks").replaceChildren();
}


/* ---------- شروع دوباره ---------- */

function restartGame() {
  currentStage = 0;
  studentName = "";

  mainAnswers = [];
  copyAnswers = [];

  flowerMainAnswers = [];
  flowerCopyAnswers = [];

  edgeMainDrawings = [null, null];
  edgeCopyDrawings = [null];

  selectedItem = null;
  eraseMode = false;
  stageChecked = false;
  mouseEaten = false;

  Object.keys(savedStages).forEach(
    key => delete savedStages[key]
  );

  $("studentName").value = "";

  $("finish").hidden = true;
  $("welcome").hidden = false;
  $("game").hidden = true;

  if (fireworksTimer) {
    clearTimeout(fireworksTimer);
    fireworksTimer = null;
  }

  $("fireworks").classList.remove("active");
  $("fireworks").replaceChildren();

  setFeedback("", "");
}


/* ---------- اتصال دکمه‌ها ---------- */

function attachEvents() {
  const startButton = $("startButton");

  if (!startButton) {
    console.error("دکمه شروع با شناسه startButton پیدا نشد.");
    return;
  }

  startButton.addEventListener("click", startGame);

  $("studentName").addEventListener(
    "keydown",
    event => {
      if (event.key === "Enter") {
        startGame();
      }
    }
  );

  $("checkButton").addEventListener(
    "click",
    checkAnswers
  );

  $("prevButton").addEventListener(
    "click",
    previousStage
  );

  $("nextButton").addEventListener(
    "click",
    nextStage
  );

  $("exitButton").addEventListener(
    "click",
    exitGame
  );

  $("restartButton").addEventListener(
    "click",
    restartGame
  );

  $("eraserButton").addEventListener(
    "click",
    toggleEraser
  );

  $("clearButton").addEventListener(
    "click",
    clearAnswers
  );
}


/* ---------- آماده‌سازی صفحه ---------- */

function initializeGame() {
  $("welcome").hidden = false;
  $("game").hidden = true;
  $("finish").hidden = true;

  attachEvents();
}

/*
  اگر صفحه هنوز بارگذاری نشده باشد،
  منتظر DOMContentLoaded می‌مانیم.
  اگر بارگذاری تمام شده باشد،
  بلافاصله دکمه‌ها را فعال می‌کنیم.
*/

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeGame,
    { once: true }
  );
} else {
  initializeGame();
}
