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
  instruction: "الگو را کشف کن، خط‌ها را رسم کن و در جدول پایین یک بار آن را تکرار کن.",
  pattern: ["TOP_RIGHT", "BOTTOM", null],
  columns: 12,
  fixedCount: 6,
  copyColumns: 3,
  palette: ["TOP_RIGHT", "BOTTOM"]
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

let edgeMainDrawings = [];
let edgeCopyDrawings = [];

let audioContext = null;
let fireworksTimer = null;


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

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
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
    // اگر صدا در مرورگر پشتیبانی نشود، بازی ادامه پیدا می‌کند.
  }
}

function playPlaceSound() {
  playTone(520, 0.07);
}

function playCorrectSound() {
  playTone(660, 0.1);

  setTimeout(() => playTone(880, 0.13), 100);
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
  if (actual.length !== expected.length) return false;

  return expected.every((value, index) => actual[index] === value);
}

function setFeedback(message = "", type = "") {
  const feedback = $("feedback");

  feedback.textContent = message;
  feedback.className = "feedback";

  if (type) {
    feedback.classList.add(type);
  }
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
  /* شکل‌ها و تمرین موش */
  if (type === "shape" || type === "mouse") {
    return makeShapeHTML(id);
  }
  /* تمرین ششم: سه خط زرد روی لبه‌های خانه */
  if (type === "line" && id === "YELLOW_U") {
    return `
      <span class="edge-mark edge-top" aria-hidden="true"
        style="border-color:#ffd54f;"></span>
      <span class="edge-mark edge-right" aria-hidden="true"
        style="border-color:#ffd54f;"></span>
      <span class="edge-mark edge-bottom" aria-hidden="true"
        style="border-color:#ffd54f;"></span>
    `;
  }
  /* خط افقی رنگی */
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
  /* خط مورب تمرین چهارم */
  if (type === "diagonal") {
    const item = COLOR_ITEMS[id];
    const color = item?.color;
    if (!color || !COLORS[color]) return "";
    const direction = color === "yellow" ? "down" : "up";
    return `
      <span
        class="diagonal-mark diagonal-${direction}"
        style="--line-color:${COLORS[color]}"
        aria-hidden="true"
      ></span>
    `;
  }
  /* خطوط مشکی روی لبه‌های خانه در تمرین پنجم */
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
  /* سایر تمرین‌های رنگی */
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
    cell.setAttribute("aria-label", "بخش نمایش‌داده‌شدهٔ الگو");
    cell.innerHTML = cellContent(value, type);
  } else {
    cell.classList.add("answer-cell");

    const shownValue = answer;

    if (shownValue) {
      cell.classList.add("has-answer");
      cell.innerHTML = cellContent(shownValue, type);
    } else {
      cell.classList.add("empty-cell");
      cell.innerHTML = "";
    }

    cell.setAttribute(
      "aria-label",
      shownValue ? "خانهٔ پاسخ پرشده" : "خانهٔ خالی برای پاسخ"
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


/* ---------- انتخاب شکل یا رنگ ---------- */

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

    if (stage.type === "shape" || stage.type === "mouse") {
      button.innerHTML = makeShapeHTML(id);
      label = SHAPES[id]?.label || id;

    } else if (
      stage.type === "line" ||
      stage.type === "diagonal"
    ) {
      if (id === "YELLOW_U" && stage.type === "line") {
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
              stage.type === "diagonal" ? "palette-diagonal" : ""
            }"
            style="--line-color:${COLORS[color]}"
            aria-hidden="true"
          ></span>
        `;

        label = item.label;
      }

    } else if (stage.type === "edgePattern") {
      if (id === "TOP_RIGHT") {
        button.innerHTML = `
          <span class="palette-edge-preview" aria-hidden="true">
            <span class="edge-preview-top"></span>
            <span class="edge-preview-right"></span>
          </span>
        `;

        label = "خط بالا و خط راست";

      } else if (id === "BOTTOM") {
        button.innerHTML = `
          <span class="palette-edge-preview" aria-hidden="true">
            <span class="edge-preview-bottom"></span>
          </span>
        `;

        label = "خط پایین";

      } else {
        return;
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
      $("eraserButton").setAttribute("aria-pressed", "false");

      renderPalette();

      setFeedback("شکل یا رنگ انتخاب شد.", "");
      playPlaceSound();
    });

    palette.appendChild(button);
  });
}
/* ---------- جدول اصلی تمرین‌های معمولی ---------- */
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
    if (isStage6) {
      /*
        تمرین ۶:
        خانه‌های اول تا چهارم، بخش نمایشی الگو هستند.
        خانه‌های اول و سوم عمداً خالی و غیرقابل‌انتخاب‌اند.
      */
      const isFixed = col < 4;
      const cell = createCell({
        value: expected,
        type: stage.type,
        fixed: isFixed,
        answer: isFixed ? null : mainAnswers[col],
        onClick: isFixed
          ? null
          : () => putAnswer("main", col)
      });
      mainBoard.appendChild(cell);
      continue;
    }
    const isFixed = col < fixedCount;
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
  /* جدول پایین: تعداد خانه‌ها از مشخصات مرحله گرفته می‌شود */
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
      ? stage.pattern[(col + 1) % stage.pattern.length]
      : expected;

    const cell = createCell({
      value: mouseEaten && isWrong ? null : shownValue,
      type: stage.type,
      fixed: !isWrong,
      extraClass: isWrong ? "mouse-target" : ""
    });

    if (isWrong) {
      cell.disabled = false;

      if (mouseEaten) {
        cell.innerHTML = '<span class="mouse-emoji">🐭</span>';
        cell.classList.add("mouse-found");
        cell.disabled = true;
      } else {
        cell.addEventListener("click", () => {
          mouseEaten = true;
          playCorrectSound();
          renderStage();
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


/* ---------- الگوی سه‌ردیفی گل ---------- */

/*
  مقدار مورد انتظار در هر خانه:

  ردیف اول: سبز، خالی، سبز، خالی
  ردیف دوم: خالی، سبز، خالی، قرمز
  ردیف سوم: سبز، خالی، سبز، خالی

  این الگو در هر ردیف تکرار می‌شود.
*/

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

  const totalMainCells = stage.columns * stage.rows;

  if (flowerMainAnswers.length !== totalMainCells) {
    flowerMainAnswers = Array(totalMainCells).fill(null);
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
        answer: isFixed ? null : flowerMainAnswers[index],
        extraClass: expected === null ? "expected-blank" : "",
        onClick: isFixed
          ? null
          : () => putFlowerAnswer("main", index)
      });

      mainBoard.appendChild(cell);
    }
  }

  setupBoard(copyBoard, stage.copyColumns, stage.rows);

  const totalCopyCells = stage.copyColumns * stage.rows;

  if (flowerCopyAnswers.length !== totalCopyCells) {
    flowerCopyAnswers = Array(totalCopyCells).fill(null);
  }

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.copyColumns; col++) {
      const index = row * stage.copyColumns + col;

      const cell = createCell({
        type: "color",
        answer: flowerCopyAnswers[index],
        extraClass:
          expectedFlowerValue(row, col) === null
            ? "expected-blank"
            : "",
        onClick: () => putFlowerAnswer("copy", index)
      });

      copyBoard.appendChild(cell);
    }
  }
}


/* ---------- رسم مرحله ---------- */

function renderStage() {
  const stage = getStage();

  if (!stage) return;

  $("stageTitle").textContent = stage.title;
  $("stageInstruction").textContent = stage.instruction;

  $("stageLabel").textContent =
    `تمرین ${currentStage + 1} از ${STAGES.length}`;

  const progress = ((currentStage + 1) / STAGES.length) * 100;

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
  stageChecked = false;
  mouseEaten = false;

  mainAnswers = [];
  copyAnswers = [];

  flowerMainAnswers = [];
  flowerCopyAnswers = [];

  $("eraserButton").classList.remove("active");
  $("eraserButton").setAttribute("aria-pressed", "false");

  $("checkButton").disabled = false;

  setFeedback("", "");

  renderPalette();

  if (stage.type === "flower") {
    renderFlowerBoards();
  } else if (stage.type === "mouse") {
    renderMouseBoards();
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
  /* تمرین ۶: در جدول پایین فقط خانهٔ دوم مجاز است */
  if (isStage6 && boardType === "copy" && index !== 1) {
    return;
  }
  const patternIndex = index % stage.pattern.length;
  /* خانه‌های خالی الگو در تمرین پنجم و ششم قابل پرکردن نیستند */
  if (
    (stage.type === "edgePattern" || isStage6) &&
    boardType === "main" &&
    stage.pattern[patternIndex] === null
  ) {
    return;
  }
  if (eraseMode) {
    answers[index] = null;
    playPlaceSound();
    renderStagePreservingAnswers();
    return;
  }
  if (!selectedItem) {
    setFeedback("ابتدا نوع خط را انتخاب کن.", "warning");
    return;
  }
  answers[index] = selectedItem;
  playPlaceSound();
  renderStagePreservingAnswers();
}
/* ---------- حفظ پاسخ‌ها هنگام رسم دوباره ---------- */

function renderStagePreservingAnswers() {
  const stage = getStage();

  renderPalette();

  if (stage.type === "flower") {
    renderFlowerBoards();
  } else if (stage.type === "mouse") {
    renderMouseBoards();
  } else {
    renderRegularBoards();
  }
}


/* ---------- پاسخ‌های تمرین گل ---------- */

function putFlowerAnswer(boardType, index) {
  if (stageChecked) return;

  const answers =
    boardType === "main"
      ? flowerMainAnswers
      : flowerCopyAnswers;

  if (eraseMode) {
    answers[index] = null;
    playPlaceSound();
    renderStagePreservingAnswers();
    return;
  }

  if (!selectedItem) {
    setFeedback("ابتدا رنگ موردنظر را انتخاب کن.", "warning");
    return;
  }

  answers[index] = selectedItem;

  playPlaceSound();

  renderStagePreservingAnswers();
}


/* ---------- پاک‌کن ---------- */

function toggleEraser() {
  if (stageChecked) return;

  eraseMode = !eraseMode;

  $("eraserButton").classList.toggle("active", eraseMode);

  $("eraserButton").setAttribute(
    "aria-pressed",
    String(eraseMode)
  );

  if (eraseMode) {
    selectedItem = null;
    setFeedback("حالا روی خانه‌ای بزن که می‌خواهی پاک شود.", "");
  } else {
    setFeedback("", "");
  }

  renderPalette();
}


/* ---------- پاک‌کردن پاسخ‌ها ---------- */

function clearAnswers() {
  if (stageChecked) return;

  const stage = getStage();

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

  setFeedback("", "");

  renderStagePreservingAnswers();
}


/* ---------- بررسی تمرین‌های معمولی ---------- */

function checkRegularStage() {
  const stage = getStage();
  const isStage6 = currentStage === 5;
  /* بررسی جدول اصلی */
  const expectedMain = [];
  for (let col = 0; col < stage.columns; col++) {
    expectedMain.push(patternValue(stage.pattern, col));
  }
  const mainIsCorrect =
    mainAnswers.length === stage.columns &&
    mainAnswers.every((answer, index) => {
      if (isStage6) {
        /* چهار خانهٔ اول، بخش نمایشی الگو هستند */
        if (index < 4) return true;
        const expected = expectedMain[index];
        /* خانه‌هایی که الگو برایشان خالی است باید خالی بمانند */
        if (expected === null) {
          return answer === null;
        }
        return answer === expected;
      }
      if (index < stage.fixedCount) return true;
      const expected = expectedMain[index];
      if (stage.type === "edgePattern" && expected === null) {
        return answer === null;
      }
      return answer === expected;
    });
  /* بررسی جدول پایین */
  const expectedCopy = Array(stage.copyColumns).fill(null);
  if (isStage6) {
    /* فقط خانهٔ دوم باید الگوی سه‌خطی زرد را داشته باشد */
    expectedCopy[1] = "YELLOW_U";
  } else {
    for (
      let col = 0;
      col < Math.min(stage.pattern.length, stage.copyColumns);
      col++
    ) {
      expectedCopy[col] = stage.pattern[col];
    }
  }
  const copyIsCorrect =
    copyAnswers.length === expectedCopy.length &&
    expectedCopy.every((expected, index) => {
      if (
        (stage.type === "edgePattern" || isStage6) &&
        expected === null
      ) {
        return copyAnswers[index] === null;
      }
      return copyAnswers[index] === expected;
    });
  return mainIsCorrect && copyIsCorrect;
}

/* ---------- بررسی تمرین موش ---------- */

function checkMouseStage() {
  const stage = getStage();

  const expectedCopy = Array(stage.copyColumns).fill(null);

  for (
    let col = 0;
    col < Math.min(stage.pattern.length, stage.copyColumns);
    col++
  ) {
    expectedCopy[col] = stage.pattern[col];
  }

  return mouseEaten &&
    isCorrectArray(copyAnswers, expectedCopy);
}


/* ---------- بررسی تمرین گل ---------- */

function checkFlowerStage() {
  const stage = getStage();

  /*
    جدول اصلی:
    هشت ستون نخست نمایش داده شده‌اند.
    در سایر ستون‌ها خانه‌های رنگی باید درست باشند.
    خانه‌هایی که الگوی آن‌ها خالی است نیز باید خالی بمانند.
  */

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.columns; col++) {
      const index = row * stage.columns + col;

      if (col < stage.fixedColumns) {
        continue;
      }

      const expected = expectedFlowerValue(row, col);
      const actual = flowerMainAnswers[index];

      if (actual !== expected) {
        return false;
      }
    }
  }

  /*
    جدول پایین:
    پاسخ هر ۱۸ خانه بررسی می‌شود.
    خانه‌های خالی نباید رنگ بگیرند.
  */

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.copyColumns; col++) {
      const index = row * stage.copyColumns + col;

      const expected = expectedFlowerValue(row, col);
      const actual = flowerCopyAnswers[index];

      if (actual !== expected) {
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

  $("checkButton").disabled = true;

  playCorrectSound();

  /*
    مطابق خواستهٔ آموزگار:
    پیام تبریک نمایش داده نمی‌شود؛
    فقط فشفشه‌های رنگی ظاهر می‌شوند.
  */

  setFeedback("", "");

  showFireworks();
}


/* ---------- فشفشه‌ها ---------- */

function showFireworks() {
  const container = $("fireworks");

  container.replaceChildren();

  if (fireworksTimer) {
    clearTimeout(fireworksTimer);
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

    particle.style.animationDelay = `${Math.random() * 0.35}s`;

    container.appendChild(particle);
  }

  container.classList.add("active");

  fireworksTimer = setTimeout(() => {
    container.classList.remove("active");
    container.replaceChildren();
  }, 2200);
}


/* ---------- شروع بازی ---------- */

function startGame() {
  const name = $("studentName").value.trim();

  studentName = name || "دانش‌آموز عزیز";

  $("studentGreeting").textContent =
    `سلام ${studentName}، آماده‌ای الگوها را کامل کنی؟`;

  currentStage = 0;

  $("welcome").hidden = true;
  $("finish").hidden = true;
  $("game").hidden = false;

  renderStage();

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });
}


/* ---------- رفتن به مرحله بعد ---------- */

function nextStage() {
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
  }

  $("fireworks").classList.remove("active");
  $("fireworks").replaceChildren();
}


/* ---------- شروع دوباره ---------- */

function restartGame() {
  currentStage = 0;

  mainAnswers = [];
  copyAnswers = [];

  flowerMainAnswers = [];
  flowerCopyAnswers = [];

  selectedItem = null;
  eraseMode = false;
  stageChecked = false;
  mouseEaten = false;

  $("finish").hidden = true;
  $("welcome").hidden = false;
  $("game").hidden = true;

  $("studentName").value = "";

  if (fireworksTimer) {
    clearTimeout(fireworksTimer);
  }

  $("fireworks").classList.remove("active");
  $("fireworks").replaceChildren();
}


/* ---------- رویدادها ---------- */

function attachEvents() {
  $("startButton").addEventListener("click", startGame);

  $("studentName").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      startGame();
    }
  });

  $("checkButton").addEventListener("click", checkAnswers);

  $("prevButton").addEventListener("click", previousStage);

  $("nextButton").addEventListener("click", nextStage);

  $("exitButton").addEventListener("click", exitGame);

  $("restartButton").addEventListener("click", restartGame);

  $("eraserButton").addEventListener("click", toggleEraser);

  $("clearButton").addEventListener("click", clearAnswers);
}


/* ---------- آماده‌سازی صفحه ---------- */

document.addEventListener("DOMContentLoaded", () => {
  $("welcome").hidden = false;
  $("game").hidden = true;
  $("finish").hidden = true;

  attachEvents();
});
