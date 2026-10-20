"use strict";

/* =====================================================
   الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی

   ساختار تمرین‌ها:
   1-2   : الگوهای شکلی
   3-6   : الگوهای خطی
   7-8   : پیدا کردن شکل اشتباه با موش
   9-12  : الگوهای خانه‌های رنگی
   13    : الگوی سه‌ردیفی گل

   توجه:
   این فایل با شناسه‌های HTML فعلی بازی هماهنگ شده است.
===================================================== */

const $ = (id) => document.getElementById(id);

/* =====================================================
   رنگ‌ها
===================================================== */

const COLORS = {
  red: "#ef5350",
  blue: "#42a5f5",
  green: "#43b96b",
  yellow: "#ffd54f",
  purple: "#9565cf",
  orange: "#ff963d",
  white: "#ffffff"
};

/* =====================================================
   تعریف شکل‌ها
===================================================== */

const ITEMS = {
  C: {
    id: "redCircle",
    shape: "circle",
    color: "red",
    label: "دایره قرمز"
  },

  S: {
    id: "blueSquare",
    shape: "square",
    color: "blue",
    label: "مربع آبی"
  },

  T: {
    id: "greenTriangle",
    shape: "triangle",
    color: "green",
    label: "مثلث سبز"
  },

  Y: {
    id: "yellowStar",
    shape: "star",
    color: "yellow",
    label: "ستاره زرد"
  }
};

const C = "C";
const S = "S";
const T = "T";
const Y = "Y";

/* =====================================================
   تعریف رنگ‌های خانه‌ها
===================================================== */

const CELL_COLORS = {
  P: {
    id: "purpleCell",
    color: "purple",
    label: "بنفش"
  },

  O: {
    id: "orangeCell",
    color: "orange",
    label: "نارنجی"
  },

  G: {
    id: "greenCell",
    color: "green",
    label: "سبز"
  },

  R: {
    id: "redCell",
    color: "red",
    label: "قرمز"
  },

  B: {
    id: "blueCell",
    color: "blue",
    label: "آبی"
  },

  Y: {
    id: "yellowCell",
    color: "yellow",
    label: "زرد"
  }
};

/* =====================================================
   تعریف خطوط
===================================================== */

const LINE_COLORS = {
  red: {
    id: "red",
    label: "خط قرمز",
    color: COLORS.red
  },

  blue: {
    id: "blue",
    label: "خط آبی",
    color: COLORS.blue
  }
};

/* =====================================================
   ابزارهای عمومی
===================================================== */

function cloneItem(item) {
  if (item === null || item === undefined) {
    return null;
  }

  if (typeof item === "string") {
    return item;
  }

  return JSON.parse(JSON.stringify(item));
}

function sameItem(a, b) {
  if (a === null || a === undefined) {
    return b === null || b === undefined;
  }

  if (b === null || b === undefined) {
    return false;
  }

  if (typeof a === "string" && typeof b === "string") {
    return a === b;
  }

  return a.id === b.id;
}

function repeatPattern(pattern, count) {
  const result = [];

  for (let i = 0; i < count; i++) {
    pattern.forEach((item) => {
      result.push(cloneItem(item));
    });
  }

  return result;
}

function cyclePattern(pattern, length) {
  const result = [];

  for (let i = 0; i < length; i++) {
    result.push(cloneItem(pattern[i % pattern.length]));
  }

  return result;
}

function setVisible(element, visible) {
  if (!element) {
    return;
  }

  element.classList.toggle("hidden", !visible);
}

function setFeedback(message, type = "info") {
  const feedback = $("feedback");

  if (!feedback) {
    return;
  }

  feedback.textContent = message;
  feedback.className = "feedback";

  if (message) {
    feedback.classList.add(type);
  }
}

/* =====================================================
   صدای بازی
===================================================== */

let audioContext = null;

function playTone(frequency = 600, duration = 0.12) {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
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
      audioContext.currentTime + 0.02
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
    console.warn("صدای بازی در دسترس نیست.", error);
  }
}

function playCorrectSound() {
  playTone(660, 0.13);

  window.setTimeout(() => {
    playTone(880, 0.16);
  }, 100);

  window.setTimeout(() => {
    playTone(1040, 0.18);
  }, 220);
}

function playWrongSound() {
  playTone(260, 0.18);
}

/* =====================================================
   تعریف ۱۳ تمرین
===================================================== */

const STAGES = [

  /* ---------------------------------------------------
     تمرین ۱: الگوی دوشکلی
     ۱۲ ستون
     چهار خانهٔ ثابت
     هشت خانهٔ پاسخ
     جدول تکرار شش‌خانه‌ای
  --------------------------------------------------- */

  {
    id: 1,
    type: "shape",
    title: "الگوی دوشکلی",
    instruction: "الگو را بخوان و آن را ادامه بده.",
    pattern: [C, S],
    columns: 12,
    fixedCount: 4,
    copyColumns: 6,
    palette: [C, S],
    mainLabel: "الگوی اصلی را ادامه بده",
    copyLabel: "الگوی رئیس را یک بار تکرار کن"
  },

  /* ---------------------------------------------------
     تمرین ۲: الگوی چهارشکلی
  --------------------------------------------------- */

  {
    id: 2,
    type: "shape",
    title: "الگوی چهارشکلی",
    instruction: "به ترتیب شکل‌ها دقت کن و الگو را ادامه بده.",
    pattern: [T, Y, S, C],
    columns: 16,
    fixedCount: 8,
    copyColumns: 8,
    palette: [C, S, T, Y],
    mainLabel: "الگوی اصلی را ادامه بده",
    copyLabel: "الگوی رئیس را یک بار تکرار کن"
  },

  /* ---------------------------------------------------
     تمرین ۳: خط‌های افقی
  --------------------------------------------------- */

  {
    id: 3,
    type: "line",
    title: "الگوی خط‌های افقی",
    instruction: "رنگ خط‌ها را انتخاب کن و الگو را ادامه بده.",
    pattern: ["red", "blue"],
    orientation: "horizontal",
    columns: 12,
    fixedCount: 4,
    copyColumns: 6,
    mainLabel: "الگوی خطی را کامل کن",
    copyLabel: "الگوی خطی را یک بار تکرار کن"
  },

  /* ---------------------------------------------------
     تمرین ۴: خط‌های عمودی
  --------------------------------------------------- */

  {
    id: 4,
    type: "line",
    title: "الگوی خط‌های عمودی",
    instruction: "خط‌های عمودی را با رنگ درست ادامه بده.",
    pattern: ["blue", "red"],
    orientation: "vertical",
    columns: 12,
    fixedCount: 4,
    copyColumns: 6,
    mainLabel: "الگوی خطی را کامل کن",
    copyLabel: "الگوی خطی را یک بار تکرار کن"
  },

  /* ---------------------------------------------------
     تمرین ۵: الگوی خطی سه‌مرحله‌ای
  --------------------------------------------------- */

  {
    id: 5,
    type: "line",
    title: "الگوی خطی سه‌مرحله‌ای",
    instruction: "ترتیب رنگ خط‌ها را پیدا کن.",
    pattern: ["red", "red", "blue"],
    orientation: "horizontal",
    columns: 12,
    fixedCount: 6,
    copyColumns: 6,
    mainLabel: "الگوی اصلی خط‌ها",
    copyLabel: "الگوی رئیس را یک بار تکرار کن"
  },

  /* ---------------------------------------------------
     تمرین ۶: خط‌های شکسته
  --------------------------------------------------- */

  {
    id: 6,
    type: "line",
    title: "الگوی خط شکسته",
    instruction: "خط‌های روی مرز خانه‌ها را با رنگ مناسب کامل کن.",
    pattern: ["blue", "red", "blue", "red"],
    orientation: "broken",
    columns: 12,
    fixedCount: 4,
    copyColumns: 8,
    mainLabel: "الگوی خط شکسته را ادامه بده",
    copyLabel: "الگوی خطی را یک بار تکرار کن"
  },

  /* ---------------------------------------------------
     تمرین ۷: موش و شکل اشتباه
  --------------------------------------------------- */

  {
    id: 7,
    type: "mouse",
    title: "موش کدام شکل را بخورد؟",
    instruction: "شکل اشتباه را پیدا کن و روی آن بزن تا موش آن را بخورد.",
    pattern: [C, S],
    wrongIndex: 5,
    columns: 10,
    copyColumns: 6,
    palette: [C, S],
    mainLabel: "شکل اشتباه را پیدا کن",
    copyLabel: "الگوی منظم را در جدول پایین تکرار کن"
  },

  /* ---------------------------------------------------
     تمرین ۸: موش و الگوی متفاوت
  --------------------------------------------------- */

  {
    id: 8,
    type: "mouse",
    title: "موش و الگوی سه‌شکلی",
    instruction: "شکلی را که نظم الگو را به هم زده پیدا کن.",
    pattern: [T, S, C],
    wrongIndex: 7,
    columns: 12,
    copyColumns: 6,
    palette: [C, S, T],
    mainLabel: "شکل ناهماهنگ را پیدا کن",
    copyLabel: "الگوی رئیس را یک بار تکرار کن"
  },

  /* ---------------------------------------------------
     تمرین ۹: خانه‌های بنفش و نارنجی
  --------------------------------------------------- */

  {
    id: 9,
    type: "color",
    title: "الگوی رنگی دو‌رنگ",
    instruction: "خانه‌ها را با رنگ‌های درست کامل کن.",
    pattern: ["P", "O"],
    columns: 12,
    fixedCount: 4,
    copyColumns: 6,
    palette: ["P", "O"],
    mainLabel: "الگوی رنگی را ادامه بده",
    copyLabel: "الگوی رئیس را یک بار تکرار کن"
  },

  /* ---------------------------------------------------
     تمرین ۱۰: الگوی رنگی سه‌خانه‌ای
  --------------------------------------------------- */

  {
    id: 10,
    type: "color",
    title: "الگوی رنگی سه‌خانه‌ای",
    instruction: "به تکرار رنگ‌ها دقت کن.",
    pattern: ["O", "O", "P"],
    columns: 12,
    fixedCount: 6,
    copyColumns: 6,
    palette: ["P", "O"],
    mainLabel: "الگوی رنگی را ادامه بده",
    copyLabel: "الگوی رئیس را یک بار تکرار کن"
  },

  /* ---------------------------------------------------
     تمرین ۱۱: الگوی سه‌رنگی
  --------------------------------------------------- */

  {
    id: 11,
    type: "color",
    title: "الگوی سه‌رنگی",
    instruction: "خانه‌ها را با توجه به ترتیب رنگ‌ها کامل کن.",
    pattern: ["P", "O", "G"],
    columns: 12,
    fixedCount: 6,
    copyColumns: 6,
    palette: ["P", "O", "G"],
    mainLabel: "الگوی رنگی را ادامه بده",
    copyLabel: "الگوی رئیس را یک بار تکرار کن"
  },

  /* ---------------------------------------------------
     تمرین ۱۲: الگوی چهاررنگی
  --------------------------------------------------- */

  {
    id: 12,
    type: "color",
    title: "الگوی چهاررنگی",
    instruction: "چهار رنگ را به ترتیب دنبال کن.",
    pattern: ["P", "O", "Y", "G"],
    columns: 16,
    fixedCount: 8,
    copyColumns: 8,
    palette: ["P", "O", "Y", "G"],
    mainLabel: "الگوی رنگی را ادامه بده",
    copyLabel: "الگوی رئیس را یک بار تکرار کن"
  },

  /* ---------------------------------------------------
     تمرین ۱۳: الگوی سه‌ردیفی گل
     جدول اصلی ۲۱ ستون و ۳ ردیف
     ۸ ستون اول از قبل مشخص هستند
  --------------------------------------------------- */

  {
    id: 13,
    type: "flower",
    title: "الگوی سه‌ردیفی گل",
    instruction: "خانه‌های خالی را کامل کن و الگوی رئیس را هم تکرار کن.",
    columns: 21,
    rows: 3,
    fixedColumns: 8,
    copyColumns: 6,
    palette: ["G", "R"],
    mainLabel: "الگوی سه‌ردیفی را کامل کن",
    copyLabel: "الگوی رئیس را در جدول پایین تکرار کن"
  }
];

/* =====================================================
   وضعیت بازی
===================================================== */

let currentStage = 0;
let studentName = "";

let selectedItem = null;
let eraseMode = false;

let mainAnswers = [];
let copyAnswers = [];

let lineMainAnswers = [];
let lineCopyAnswers = [];

let mouseEaten = false;

let flowerMainAnswers = [];
let flowerCopyAnswers = [];

let fireworksTimer = null;

/* =====================================================
   تبدیل شناسه به اطلاعات شکل
===================================================== */

function getShapeItem(key) {
  return ITEMS[key] || null;
}

function getColorItem(key) {
  return CELL_COLORS[key] || null;
}

function getCurrentStage() {
  return STAGES[currentStage];
}

/* =====================================================
   ساخت HTML شکل
===================================================== */

function shapeHTML(key) {
  const item = getShapeItem(key);

  if (!item) {
    return "";
  }

  if (item.shape === "star") {
    return '<span class="shape star" aria-label="' +
      item.label +
      '">⭐</span>';
  }

  return (
    '<span class="shape ' +
    item.shape +
    " " +
    item.color +
    '" aria-label="' +
    item.label +
    '"></span>'
  );
}

/* =====================================================
   ساخت HTML خانه رنگی
===================================================== */

function colorCellHTML(key) {
  const item = getColorItem(key);

  if (!item) {
    return "";
  }

  const color = COLORS[item.color];

  return (
    '<span class="color-swatch" ' +
    'style="background-color:' +
    color +
    '" aria-label="' +
    item.label +
    '"></span>'
  );
}

/* =====================================================
   ایجاد خانه جدول
===================================================== */

function makeCell({
  value = null,
  index = 0,
  kind = "shape",
  fixed = false,
  answer = false,
  board = "main",
  row = 0,
  extraClass = "",
  onClick = null
} = {}) {
  const cell = document.createElement("button");

  cell.type = "button";

  cell.className = "cell";

  cell.classList.add(
    fixed ? "fixed" : "answer"
  );

  if (answer) {
    cell.classList.add("answer");
  }

  if (extraClass) {
    extraClass
      .split(" ")
      .filter(Boolean)
      .forEach((className) => {
        cell.classList.add(className);
      });
  }

  cell.dataset.index = String(index);
  cell.dataset.board = board;
  cell.dataset.row = String(row);
  cell.dataset.kind = kind;

  if (fixed) {
    cell.disabled = true;
  }

  if (kind === "shape" || kind === "mouse") {
    if (value) {
      cell.innerHTML = shapeHTML(value);
    } else {
      cell.classList.add("blank");
    }
  }

  if (kind === "color" || kind === "flower") {
    cell.classList.add("color-cell");

    if (value) {
      const item = getColorItem(value);

      if (item) {
        cell.style.setProperty(
          "--cell-color",
          COLORS[item.color]
        );
      }
    } else {
      cell.classList.add("blank");
    }
  }

  if (kind === "line") {
    cell.classList.add("line-cell");

    if (value) {
      addLineSegment(cell, value, getCurrentStage().orientation);
    } else {
      const placeholder = document.createElement("span");
      placeholder.className = "line-placeholder";
      cell.appendChild(placeholder);
    }
  }

  if (!fixed && typeof onClick === "function") {
    cell.addEventListener("click", () => {
      onClick({
        index,
        row,
        board,
        cell
      });
    });
  }

  return cell;
}

/* =====================================================
   ساخت قطعه خطی روی مرز خانه
===================================================== */

function addLineSegment(cell, colorName, orientation) {
  const segment = document.createElement("span");

  segment.classList.add("line-segment");

  if (orientation === "vertical") {
    segment.classList.add("vertical", "right");
  } else if (orientation === "broken") {
    /*
      خط شکسته از قطعات افقی و عمودی تشکیل می‌شود.
      هر قطعه روی مرز خانه قرار می‌گیرد.
    */

    const index = Number(cell.dataset.index || 0);

    if (index % 2 === 0) {
      segment.classList.add("horizontal", "bottom");
    } else {
      segment.classList.add("vertical", "right");
    }
  } else {
    segment.classList.add("horizontal", "bottom");
  }

  segment.classList.add(colorName);

  segment.setAttribute("aria-hidden", "true");

  cell.appendChild(segment);
}

/* =====================================================
   رسم صفحه انتخاب ابزار
===================================================== */

function renderPalette() {
  const palette = $("palette");

  if (!palette) {
    return;
  }

  palette.innerHTML = "";

  selectedItem = null;
  eraseMode = false;

  const stage = getCurrentStage();

  let choices = [];

  if (stage.type === "shape" || stage.type === "mouse") {
    choices = stage.palette.map((key) => ({
      key,
      type: "shape"
    }));
  } else if (stage.type === "line") {
    choices = ["red", "blue"].map((key) => ({
      key,
      type: "line"
    }));
  } else if (stage.type === "color" || stage.type === "flower") {
    choices = stage.palette.map((key) => ({
      key,
      type: "color"
    }));
  }

  choices.forEach(({ key, type }) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-item";

    button.dataset.key = key;
    button.dataset.type = type;

    if (type === "shape") {
      button.innerHTML = shapeHTML(key);
      button.setAttribute(
        "aria-label",
        getShapeItem(key)?.label || key
      );
    }

    if (type === "color") {
      button.innerHTML = colorCellHTML(key);
      button.setAttribute(
        "aria-label",
        getColorItem(key)?.label || key
      );
    }

    if (type === "line") {
      const preview = document.createElement("span");

      preview.className = "line-preview";
      preview.style.backgroundColor = LINE_COLORS[key].color;

      button.appendChild(preview);

      button.setAttribute(
        "aria-label",
        LINE_COLORS[key].label
      );
    }

    button.addEventListener("click", () => {
      selectPaletteItem(key, type);
    });

    palette.appendChild(button);
  });

  updateToolButtons();
}

function selectPaletteItem(key, type) {
  selectedItem = {
    key,
    type
  };

  eraseMode = false;

  document
    .querySelectorAll(".palette-item")
    .forEach((button) => {
      button.classList.toggle(
        "selected",
        button.dataset.key === key &&
        button.dataset.type === type
      );
    });

  updateToolButtons();

  setFeedback("ابزار انتخاب شد. خانه‌های خالی را کامل کن.", "info");

  playTone(520, 0.07);
}

function updateToolButtons() {
  const eraser = $("eraserButton");

  if (eraser) {
    eraser.classList.toggle("active", eraseMode);
    eraser.setAttribute(
      "aria-pressed",
      eraseMode ? "true" : "false"
    );
  }
}

/* =====================================================
   ساخت جدول معمولی
===================================================== */

function setupBoard(board, columns, rows = 1) {
  if (!board) {
    return;
  }

  board.innerHTML = "";

  board.style.gridTemplateColumns =
    "repeat(" + columns + ", var(--cell-size, 43px))";

  board.style.gridTemplateRows =
    "repeat(" + rows + ", var(--cell-size, 43px))";
}

/* =====================================================
   محاسبه الگوی منظم
===================================================== */

function getRegularData(stage) {
  const fullPattern = cyclePattern(
    stage.pattern,
    stage.columns
  );

  const mainFixed = fullPattern.slice(
    0,
    stage.fixedCount
  );

  const copyPatternData = cyclePattern(
    stage.pattern,
    stage.copyColumns
  );

  return {
    fullPattern,
    mainFixed,
    copyPatternData
  };
}

/* =====================================================
   مقدار مورد انتظار خانه‌ها
===================================================== */

function expectedMainValue(stage, index) {
  return stage.pattern[index % stage.pattern.length];
}

function expectedCopyValue(stage, index) {
  return stage.pattern[index % stage.pattern.length];
}

/* =====================================================
   مقداردهی پاسخ‌ها
===================================================== */

function initialiseAnswers() {
  const stage = getCurrentStage();

  mainAnswers = [];
  copyAnswers = [];

  lineMainAnswers = [];
  lineCopyAnswers = [];

  flowerMainAnswers = [];
  flowerCopyAnswers = [];

  mouseEaten = false;

  if (stage.type === "shape") {
    mainAnswers = Array(stage.columns).fill(null);
    copyAnswers = Array(stage.copyColumns).fill(null);
  }

  if (stage.type === "line") {
    lineMainAnswers = Array(stage.columns).fill(null);
    lineCopyAnswers = Array(stage.copyColumns).fill(null);
  }

  if (stage.type === "mouse") {
    mainAnswers = Array(stage.columns).fill(null);
    copyAnswers = Array(stage.copyColumns).fill(null);
  }

  if (stage.type === "color") {
    mainAnswers = Array(stage.columns).fill(null);
    copyAnswers = Array(stage.copyColumns).fill(null);
  }

  if (stage.type === "flower") {
    flowerMainAnswers = Array(
      stage.rows * stage.columns
    ).fill(null);

    flowerCopyAnswers = Array(
      stage.rows * stage.copyColumns
    ).fill(null);
  }
}

/* =====================================================
   رسم تمرین‌های شکلی و رنگی
===================================================== */

function renderRegularBoards() {
  const stage = getCurrentStage();

  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");

  if (!mainBoard || !copyBoard) {
    return;
  }

  const isShape = stage.type === "shape";
  const isMouse = stage.type === "mouse";
  const isColor = stage.type === "color";

  const kind = isColor ? "color" : "shape";

  setupBoard(mainBoard, stage.columns, 1);
  setupBoard(copyBoard, stage.copyColumns, 1);

  const expected = cyclePattern(
    stage.pattern,
    stage.columns
  );

  const fixedCount = stage.fixedCount || 0;

  for (let i = 0; i < stage.columns; i++) {
    const fixed = i < fixedCount;

    let value = null;

    if (fixed) {
      value = expected[i];
    } else if (isMouse) {
      value = expected[i];
    } else {
      value = mainAnswers[i];
    }

    /*
      در تمرین موش یک شکل اشتباه قرار می‌دهیم.
      دانش‌آموز باید آن خانه را پیدا کند.
    */

    if (isMouse && i === stage.wrongIndex) {
      value = wrongMouseValue(stage, i);
    }

    const cell = makeCell({
      value,
      index: i,
      kind: isColor ? "color" : isMouse ? "mouse" : kind,
      fixed,
      board: "main",
      onClick: ({ index, cell: clickedCell }) => {
        if (isMouse) {
          handleMouseClick(index, clickedCell);
        } else {
          putAnswer("main", index);
        }
      }
    });

    if (isMouse && !mouseEaten && i === stage.wrongIndex) {
      cell.classList.add("mouse-target");
      cell.title = "برای خوردن شکل اشتباه کلیک کن";
    }

    if (isMouse && mouseEaten && i === stage.wrongIndex) {
      cell.classList.add("mouse-eaten");
      cell.innerHTML = '<span aria-hidden="true">🐭</span>';
      cell.disabled = true;
    }

    mainBoard.appendChild(cell);
  }

  for (let i = 0; i < stage.copyColumns; i++) {
    const value = copyAnswers[i];

    const cell = makeCell({
      value,
      index: i,
      kind: isColor ? "color" : "shape",
      fixed: false,
      board: "copy",
      onClick: ({ index }) => {
        putAnswer("copy", index);
      }
    });

    copyBoard.appendChild(cell);
  }
}

/* =====================================================
   شکل اشتباه تمرین موش
===================================================== */

function wrongMouseValue(stage, index) {
  const correct = stage.pattern[index % stage.pattern.length];

  if (stage.id === 7) {
    return correct === C ? T : C;
  }

  if (stage.id === 8) {
    if (correct === T) {
      return Y;
    }

    if (correct === S) {
      return C;
    }

    return T;
  }

  return correct;
}

/* =====================================================
   تعامل با تمرین موش
===================================================== */

function handleMouseClick(index, cell) {
  const stage = getCurrentStage();

  if (mouseEaten) {
    setFeedback("آفرین! موش شکل اشتباه را خورد.", "success");
    return;
  }

  if (index !== stage.wrongIndex) {
    setFeedback(
      "این شکل با الگو هماهنگ است. دوباره با دقت نگاه کن.",
      "error"
    );

    playWrongSound();
    return;
  }

  mouseEaten = true;

  playCorrectSound();

  setFeedback(
    "آفرین! موش شکل اشتباه را خورد. حالا جدول پایین را کامل کن.",
    "success"
  );

  renderRegularBoards();
}

/* =====================================================
   رسم تمرین‌های خطی
===================================================== */

function renderLineBoards() {
  const stage = getCurrentStage();

  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");

  setupBoard(mainBoard, stage.columns, 1);
  setupBoard(copyBoard, stage.copyColumns, 1);

  for (let i = 0; i < stage.columns; i++) {
    const fixed = i < stage.fixedCount;

    const value = fixed
      ? stage.pattern[i % stage.pattern.length]
      : lineMainAnswers[i];

    const cell = makeCell({
      value,
      index: i,
      kind: "line",
      fixed,
      board: "main",
      onClick: ({ index }) => {
        putAnswer("main", index);
      }
    });

    mainBoard.appendChild(cell);
  }

  for (let i = 0; i < stage.copyColumns; i++) {
    const cell = makeCell({
      value: lineCopyAnswers[i],
      index: i,
      kind: "line",
      fixed: false,
      board: "copy",
      onClick: ({ index }) => {
        putAnswer("copy", index);
      }
    });

    copyBoard.appendChild(cell);
  }
}

/* =====================================================
   الگوی تمرین گل
===================================================== */

function expectedFlowerValue(row, column) {
  /*
    ردیف اول:
    سبز، خالی، سبز، خالی، ...

    ردیف دوم:
    خالی، سبز، خالی، قرمز، ...

    ردیف سوم:
    سبز، خالی، سبز، خالی، ...
  */

  if (row === 0 || row === 2) {
    return column % 2 === 0 ? "G" : null;
  }

  const sequence = [
    null,
    "G",
    null,
    "R"
  ];

  return sequence[column % sequence.length];
}

function renderFlowerBoards() {
  const stage = getCurrentStage();

  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");

  setupBoard(
    mainBoard,
    stage.columns,
    stage.rows
  );

  setupBoard(
    copyBoard,
    stage.copyColumns,
    stage.rows
  );

  for (let row = 0; row < stage.rows; row++) {
    for (let column = 0; column < stage.columns; column++) {
      const index = row * stage.columns + column;

      const expected = expectedFlowerValue(row, column);

      const fixed = column < stage.fixedColumns;

      let value = null;

      if (fixed) {
        value = expected;
      } else {
        value = flower
