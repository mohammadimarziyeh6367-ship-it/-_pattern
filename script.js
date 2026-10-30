"use strict";

/* ==========================================
   بازی الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
========================================== */

const $ = id => document.getElementById(id);

const COLORS = {
  red: "#ef5350",
  blue: "#42a5f5",
  green: "#43b96b",
  yellow: "#ffd54f",
  purple: "#ab70df",
  orange: "#ff9f43"
};

const SHAPES = {
  C: { shape: "circle", color: "red", label: "دایره قرمز" },
  S: { shape: "square", color: "blue", label: "مربع آبی" },
  T: { shape: "triangle", color: "green", label: "مثلث سبز" },
  Y: { shape: "star", color: "yellow", label: "ستاره زرد" }
};

const COLOR_ITEMS = {
  P: { color: "purple", label: "بنفش" },
  O: { color: "orange", label: "نارنجی" },
  G: { color: "green", label: "سبز" },
  R: { color: "red", label: "قرمز" },
  B: { color: "blue", label: "آبی" },
  Y: { color: "yellow", label: "زرد" }
};

const STAGES = [
  {
    id: 1, type: "shape",
    title: "الگوی دوشکلی",
    instruction: "الگوی اصلی را دو بار دیگر در جدول بالا ادامه بده.",
    pattern: ["C", "S"],
    columns: 12, fixedCount: 4, copyColumns: 6,
    palette: ["C", "S"]
  },
  {
    id: 2, type: "color",
    title: "الگوی مربع‌های سبز و قرمز",
    instruction: "الگو را ادامه بده و در جدول پایین یک بار الگوی رئیس را تکرار کن.",
    pattern: ["G", "G", "R", "R", "R"],
    columns: 15, fixedCount: 8, copyColumns: 10,
    palette: ["G", "R"]
  },
  {
    id: 3, type: "line",
    title: "الگوی خطی رنگی",
    instruction: "رنگ‌ها را به ترتیب الگوی اصلی ادامه بده.",
    pattern: ["R", "B"],
    columns: 12, fixedCount: 4, copyColumns: 6,
    palette: ["R", "B"]
  },
  {
    id: 4, type: "diagonal",
    title: "الگوی خط‌های مورب",
    instruction: "الگوی خط‌های مورب را ادامه بده و در جدول پایین یک بار الگوی رئیس را تکرار کن.",
    pattern: ["Y", "G"],
    columns: 12, fixedCount: 4, copyColumns: 4,
    palette: ["R", "G", "Y", "B"]
  },
  {
    id: 5, type: "edgePattern",
    title: "الگوی خط‌های مرزی",
    instruction: "الگو را کشف کن، با کشیدن انگشت یا ماوس مسیر خط را رسم کن و در جدول پایین یک بار الگوی رئیس را تکرار کن.",
    pattern: ["TOP_RIGHT", "BOTTOM", null],
    columns: 12, fixedCount: 6, copyColumns: 3,
    palette: []
  },
  {
    id: 6, type: "line",
    title: "الگوی خطی",
    instruction: "سه خط زرد را مطابق الگو ادامه بده و در جدول پایین یک بار الگوی رئیس را تکرار کن.",
    pattern: [null, "YELLOW_U", null, "YELLOW_U"],
    columns: 16, fixedCount: 4, copyColumns: 8,
    palette: ["YELLOW_U"]
  },
  {
    id: 7, type: "mouse",
    title: "موش کوچولو",
    instruction: "شکل ناهماهنگ را پیدا کن و روی آن بزن.",
    pattern: ["C", "S"],
    columns: 10, fixedCount: 0, copyColumns: 6,
    palette: ["C", "S"], wrongIndex: 5
  },
  {
    id: 8, type: "mouse",
    title: "موش و الگوی سه‌شکلی",
    instruction: "شکلی را که با الگو هماهنگ نیست پیدا کن.",
    pattern: ["T", "S", "C"],
    columns: 12, fixedCount: 0, copyColumns: 6,
    palette: ["T", "S", "C"], wrongIndex: 7
  },
  {
    id: 9, type: "color",
    title: "الگوی رنگی",
    instruction: "رنگ‌های الگو را به ترتیب ادامه بده.",
    pattern: ["P", "O"],
    columns: 12, fixedCount: 4, copyColumns: 6,
    palette: ["P", "O"]
  },
  {
    id: 10, type: "color",
    title: "الگوی رنگی سه‌تایی",
    instruction: "الگوی رنگی را به‌درستی کامل کن.",
    pattern: ["O", "O", "P"],
    columns: 12, fixedCount: 6, copyColumns: 6,
    palette: ["O", "P"]
  },
  {
    id: 11, type: "color",
    title: "سه رنگ زیبا",
    instruction: "ترتیب رنگ‌ها را حفظ کن و الگو را ادامه بده.",
    pattern: ["P", "O", "G"],
    columns: 12, fixedCount: 6, copyColumns: 6,
    palette: ["P", "O", "G"]
  },
  {
    id: 12, type: "color",
    title: "الگوی چهاررنگی",
    instruction: "چهار رنگ را به ترتیب درست در جدول‌ها قرار بده.",
    pattern: ["P", "O", "Y", "G"],
    columns: 16, fixedCount: 8, copyColumns: 8,
    palette: ["P", "O", "Y", "G"]
  },
  {
    id: 13, type: "flower",
    title: "الگوی سه‌ردیفی گل",
    instruction: "خانه‌های خالی را با دقت کامل کن و الگوی رئیس را هم تکرار کن.",
    columns: 21, rows: 3, fixedColumns: 8,
    copyColumns: 6, palette: ["G", "R"]
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

/* نگهداری پاسخ‌های هر مرحله */
const savedStages = {};


/* ---------- صدا ---------- */

function playTone(frequency = 440, duration = 0.09) {
  try {
    const AudioClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioClass) return;

    if (!audioContext) {
      audioContext = new AudioClass();
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
    // بازی بدون صدا هم اجرا می‌شود.
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

function patternValue(pattern, index) {
  return pattern[index % pattern.length];
}

function isCorrectArray(actual, expected) {
  return actual.length === expected.length &&
    expected.every((value, index) => actual[index] === value);
}

function setFeedback(message = "", type = "") {
  const feedback = $("feedback");
  if (!feedback) return;

  feedback.textContent = message;
  feedback.className = "feedback";

  if (type) feedback.classList.add(type);
}

function saveCurrentStage() {
  savedStages[currentStage] = {
    mainAnswers: [...mainAnswers],
    copyAnswers: [...copyAnswers],
    flowerMainAnswers: [...flowerMainAnswers],
    flowerCopyAnswers: [...flowerCopyAnswers],
    edgeMainDrawings: edgeMainDrawings.map(
      drawing => drawing ? drawing.map(p => ({ ...p })) : null
    ),
    edgeCopyDrawings: edgeCopyDrawings.map(
      drawing => drawing ? drawing.map(p => ({ ...p })) : null
    ),
    mouseEaten,
    stageChecked
  };
}

function loadStageAnswers() {
  const saved = savedStages[currentStage];

  mainAnswers = saved ? [...saved.mainAnswers] : [];
  copyAnswers = saved ? [...saved.copyAnswers] : [];

  flowerMainAnswers = saved
    ? [...saved.flowerMainAnswers] : [];

  flowerCopyAnswers = saved
    ? [...saved.flowerCopyAnswers] : [];

  edgeMainDrawings = saved
    ? saved.edgeMainDrawings.map(
        drawing => drawing ? drawing.map(p => ({ ...p })) : null
      )
    : [null, null];

  edgeCopyDrawings = saved
    ? saved.edgeCopyDrawings.map(
        drawing => drawing ? drawing.map(p => ({ ...p })) : null
      )
    : [null];

  mouseEaten = saved ? saved.mouseEaten : false;
  stageChecked = saved ? saved.stageChecked : false;
}


/* ---------- نمایش شکل و رنگ ---------- */

function makeShapeHTML(id) {
  const item = SHAPES[id];
  if (!item) return "";

  if (item.shape === "star") {
    return `
      <span class="shape star"
        style="--shape-color:${COLORS[item.color]}"
        aria-hidden="true">★</span>
    `;
  }

  return `
    <span class="shape ${item.shape}"
      style="--shape-color:${COLORS[item.color]}"
      aria-hidden="true"></span>
  `;
}

function makeColorHTML(id) {
  const item = COLOR_ITEMS[id];
  if (!item) return "";

  return `
    <span class="color-dot"
      style="--dot-color:${COLORS[item.color]}"
      aria-hidden="true"></span>
  `;
}

function cellContent(id, type) {
  if (!id) return "";

  if (type === "shape" || type === "mouse") {
    return makeShapeHTML(id);
  }

  if (type === "line" && id === "YELLOW_U") {
    return `
      <span class="edge-mark edge-top"
        style="border-color:#ffd54f"></span>
      <span class="edge-mark edge-right"
        style="border-color:#ffd54f"></span>
      <span class="edge-mark edge-bottom"
        style="border-color:#ffd54f"></span>
    `;
  }

  if (type === "line") {
    const color = COLOR_ITEMS[id]?.color;
    if (!color) return "";

    return `
      <span class="line-mark"
        style="--line-color:${COLORS[color]}"></span>
    `;
  }

  if (type === "diagonal") {
    const color = COLOR_ITEMS[id]?.color;
    if (!color) return "";

    const direction = color === "yellow" ? "down" : "up";

    return `
      <span class="diagonal-mark diagonal-${direction}"
        style="--line-color:${COLORS[color]}"></span>
    `;
  }

  if (type === "edgePattern") {
    if (id === "TOP_RIGHT") {
      return `
        <span class="edge-mark edge-top"></span>
        <span class="edge-mark edge-right"></span>
      `;
    }

    if (id === "BOTTOM") {
      return `<span class="edge-mark edge-bottom"></span>`;
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

  if (extraClass) cell.classList.add(extraClass);

  if (fixed) {
    cell.classList.add("fixed-cell");
    cell.disabled = true;
    cell.innerHTML = cellContent(value, type);
    cell.setAttribute("aria-label", "بخش نمایش‌داده‌شده الگو");
  } else {
    cell.classList.add("answer-cell");

    if (answer) {
      cell.classList.add("has-answer");
      cell.innerHTML = cellContent(answer, type);
    } else {
      cell.classList.add("empty-cell");
    }

    cell.setAttribute(
      "aria-label",
      answer ? "خانه پاسخ پرشده" : "خانه خالی برای پاسخ"
    );

    if (onClick) cell.addEventListener("click", onClick);
  }

  return cell;
}

function setupBoard(board, columns, rows = 1) {
  board.replaceChildren();

  board.style.setProperty("--columns", columns);
  board.style.setProperty("--rows", rows);
  board.style.gridTemplateColumns =
    `repeat(${columns}, minmax(0, 1fr))`;
  board.style.gridTemplateRows = `repeat(${rows}, auto)`;
}


/* ---------- پالت ---------- */

function renderPalette() {
  const stage = getStage();
  const palette = $("palette");

  palette.replaceChildren();

  if (stage.type === "edgePattern") return;

  stage.palette.forEach(id => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-item";

    let label = id;

    if (stage.type === "shape" || stage.type === "mouse") {
      button.innerHTML = makeShapeHTML(id);
      label = SHAPES[id]?.label || id;
    } else if (stage.type === "line" || stage.type === "diagonal") {
      if (id === "YELLOW_U") {
        button.innerHTML = `
          <span class="edge-mark edge-top"
            style="border-color:#ffd54f"></span>
          <span class="edge-mark edge-right"
            style="border-color:#ffd54f"></span>
          <span class="edge-mark edge-bottom"
            style="border-color:#ffd54f"></span>
        `;
        label = "سه خط زرد";
      } else {
        const color = COLOR_ITEMS[id]?.color;
        if (!color) return;

        button.innerHTML = `
          <span class="palette-line ${stage.type === "diagonal" ? "palette-diagonal" : ""}"
            style="--line-color:${COLORS[color]}"></span>
        `;
        label = COLOR_ITEMS[id].label;
      }
    } else {
      button.innerHTML = makeColorHTML(id);
      label = COLOR_ITEMS[id]?.label || id;
    }

    button.title = label;
    button.setAttribute("aria-label", label);

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


/* ---------- جدول تمرین‌های معمولی ---------- */

function renderRegularBoards() {
  const stage = getStage();
  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");
  const isStage6 = currentStage === 5;

  setupBoard(mainBoard, stage.columns);

  if (mainAnswers.length !== stage.columns) {
    mainAnswers = Array(stage.columns).fill(null);
  }

  for (let col = 0; col < stage.columns; col++) {
    const expected = patternValue(stage.pattern, col);
    const fixed = isStage6
      ? col < 4
      : col < stage.fixedCount;

    const cell = createCell({
      value: fixed ? expected : null,
      type: stage.type,
      fixed,
      answer: fixed ? null : mainAnswers[col],
      onClick: fixed ? null : () => putAnswer("main", col)
    });

    mainBoard.appendChild(cell);
  }

  setupBoard(copyBoard, stage.copyColumns);

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

  setupBoard(mainBoard, stage.columns);

  for (let col = 0; col < stage.columns; col++) {
    const expected = patternValue(stage.pattern, col);
    const wrong = col === stage.wrongIndex;

    const shownValue = wrong
      ? stage.pattern[(col + 1) % stage.pattern.length]
      : expected;

    const cell = createCell({
      value: wrong && mouseEaten ? null : shownValue,
      type: stage.type,
      fixed: !wrong,
      extraClass: wrong ? "mouse-target" : ""
    });

    if (wrong) {
      cell.disabled = mouseEaten;

      if (mouseEaten) {
        cell.innerHTML = '<span class="mouse-emoji">🐭</span>';
        cell.classList.add("mouse-found");
      } else {
        cell.addEventListener("click", () => {
          mouseEaten = true;
          saveCurrentStage();
          playCorrectSound();
          renderMouseBoards();
          setFeedback("", "");
        });
      }
    }

    mainBoard.appendChild(cell);
  }

  setupBoard(copyBoard, stage.copyColumns);

  if (copyAnswers.length !== stage.copyColumns) {
    copyAnswers = Array(stage.copyColumns).fill(null);
  }

  for (let col = 0; col < stage.copyColumns; col++) {
    copyBoard.appendChild(createCell({
      type: stage.type,
      answer: copyAnswers[col],
      onClick: () => putAnswer("copy", col)
    }));
  }
}


/* ---------- تمرین گل ---------- */

function expectedFlowerValue(row, col) {
  if (row === 0 || row === 2) {
    return col % 2 === 0 ? "G" : null;
  }

  return [null, "G", null, "R"][col % 4];
}

function renderFlowerBoards() {
  const stage = getStage();
  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");

  setupBoard(mainBoard, stage.columns, stage.rows);

  const mainLength = stage.columns * stage.rows;

  if (flowerMainAnswers.length !== mainLength) {
    flowerMainAnswers = Array(mainLength).fill(null);
  }

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.columns; col++) {
      const index = row * stage.columns + col;
      const fixed = col < stage.fixedColumns;
      const expected = expectedFlowerValue(row, col);

      const cell = createCell({
        value: fixed ? expected : null,
        type: "color",
        fixed,
        answer: fixed ? null : flowerMainAnswers[index],
        extraClass: expected === null ? "expected-blank" : "",
        onClick: fixed || expected === null
          ? null
          : () => putFlowerAnswer("main", index)
      });

      mainBoard.appendChild(cell);
    }
  }

  setupBoard(copyBoard, stage.copyColumns, stage.rows);

  const copyLength = stage.copyColumns * stage.rows;

  if (flowerCopyAnswers.length !== copyLength) {
    flowerCopyAnswers = Array(copyLength).fill(null);
  }

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.copyColumns; col++) {
      const index = row * stage.copyColumns + col;
      const expected = expectedFlowerValue(row, col);

      const cell = createCell({
        type: "color",
        answer: flowerCopyAnswers[index],
        extraClass: expected === null ? "expected-blank" : "",
        onClick: expected === null
          ? null
          : () => putFlowerAnswer("copy", index)
      });

      copyBoard.appendChild(cell);
    }
  }
}


/* ==========================================
   تمرین پنجم: رسم با انگشت یا ماوس
========================================== */

function renderEdgePatternBoards() {
  const stage = getStage();
  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");

  setupBoard(mainBoard, stage.columns);

  for (let col = 0; col < stage.columns; col++) {
    const fixed = col < stage.fixedCount;
    const value = fixed
      ? stage.pattern[col % stage.pattern.length]
      : null;

    mainBoard.appendChild(createCell({
      value,
      type: "edgePattern",
      fixed
    }));
  }

  setupBoard(copyBoard, stage.copyColumns);

  for (let col = 0; col < stage.copyColumns; col++) {
    copyBoard.appendChild(createCell({
      type: "edgePattern"
    }));
  }

  createEdgeDrawingLayer(mainBoard, "main");
  createEdgeDrawingLayer(copyBoard, "copy");
}


function createEdgeDrawingLayer(board, boardType) {
  const isMain = boardType === "main";
  const columns = isMain ? 12 : 3;

  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  svg.classList.add("edge-drawing-layer");
  svg.setAttribute("viewBox", `0 0 ${columns} 1`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.style.touchAction = "none";

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
    return isMain ? edgeMainDrawings : edgeCopyDrawings;
  }

  function groupStart(index) {
    return isMain ? 6 + index * 3 : 0;
  }

  function getPosition(event) {
    const rect = svg.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return { x: 0, y: 0 };
    }

    return {
      x: Math.max(
        0,
        Math.min(
          columns,
          ((event.clientX - rect.left) / rect.width) * columns
        )
      ),
      y: Math.max(
        0,
        Math.min(1, (event.clientY - rect.top) / rect.height)
      )
    };
  }

  function getGroupIndex(position) {
    if (!isMain) return 0;

    if (position.x < 6 || position.x > 12) return null;

    const index = Math.floor((position.x - 6) / 3);

    return index === 0 || index === 1 ? index : null;
  }

  function drawAll() {
    svg.querySelectorAll(".student-edge-line").forEach(
      line => line.remove()
    );

    getDrawings().forEach((points, index) => {
      if (!points || points.length < 2) return;

      const start = groupStart(index);

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );

      line.classList.add("student-edge-line");
      line.setAttribute(
        "points",
        points.map(p => `${p.x + start},${p.y}`).join(" ")
      );

      svg.appendChild(line);
    });

    if (activeGroup !== null && activePoints.length > 1) {
      const start = groupStart(activeGroup);

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );

      line.classList.add("student-edge-line");
      line.setAttribute(
        "points",
        activePoints.map(p => `${p.x + start},${p.y}`).join(" ")
      );

      svg.appendChild(line);
    }
  }

  function eraseGroup(index) {
    getDrawings()[index] = null;
    saveCurrentStage();
    drawAll();
    playPlaceSound();
  }

  hitArea.addEventListener("pointerdown", event => {
    event.preventDefault();

    if (stageChecked) return;

    const position = getPosition(event);
    const index = getGroupIndex(position);

    if (index === null) return;

    if (eraseMode) {
      eraseGroup(index);
      return;
    }

    activeGroup = index;

    const start = groupStart(index);

    activePoints = [{
      x: position.x - start,
      y: position.y
    }];

    activePointerId = event.pointerId;

    try {
      svg.setPointerCapture(event.pointerId);
    } catch (error) {}

    drawAll();
  });

  svg.addEventListener("pointermove", event => {
    if (activeGroup === null) return;
    if (event.pointerId !== activePointerId) return;

    event.preventDefault();

    const position = getPosition(event);
    const start = groupStart(activeGroup);

    const point = {
      x: Math.max(0, Math.min(3, position.x - start)),
      y: Math.max(0, Math.min(1, position.y))
    };

    const previous = activePoints[activePoints.length - 1];

    if (
      !previous ||
      Math.abs(previous.x - point.x) > 0.003 ||
      Math.abs(previous.y - point.y) > 0.003
    ) {
      activePoints.push(point);
    }

    drawAll();
  });

  function finishDrawing(event) {
    if (activeGroup === null) return;

    if (
      event &&
      activePointerId !== null &&
      event.pointerId !== activePointerId
    ) return;

    getDrawings()[activeGroup] =
      activePoints.length >= 2
        ? activePoints.map(p => ({ ...p }))
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


/* ---------- بررسی مسیرهای تمرین پنجم ---------- */

function isCorrectEdgeDrawing(points) {
  if (!points || points.length < 4) return false;

  const targets = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 }
  ];

  let lastIndex = -1;

  for (const target of targets) {
    let found = false;

    for (let i = lastIndex + 1; i < points.length; i++) {
      const dx = points[i].x - target.x;
      const dy = points[i].y - target.y;

      if (Math.sqrt(dx * dx + dy * dy) <= 0.38) {
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


/* ---------- نمایش مرحله ---------- */

function renderStage() {
  const stage = getStage();
  if (!stage) return;

  loadStageAnswers();

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

  $("eraserButton").classList.remove("active");
  $("eraserButton").setAttribute("aria-pressed", "false");

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


/* ---------- ثبت پاسخ ---------- */

function renderStagePreservingAnswers() {
  saveCurrentStage();

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

function putAnswer(boardType, index) {
  if (stageChecked) return;

  const stage = getStage();
  const isStage6 = currentStage === 5;

  const answers = boardType === "main"
    ? mainAnswers
    : copyAnswers;

  if (isStage6 && boardType === "copy" && index !== 1) {
    return;
  }

  if (
    isStage6 &&
    boardType === "main" &&
    patternValue(stage.pattern, index) === null
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
    setFeedback("ابتدا شکل یا رنگ موردنظر را انتخاب کن.", "warning");
    return;
  }

  answers[index] = selectedItem;
  playPlaceSound();
  renderStagePreservingAnswers();
}

function putFlowerAnswer(boardType, index) {
  if (stageChecked) return;

  const answers = boardType === "main"
    ? flowerMainAnswers
    : flowerCopyAnswers;

  const stage = getStage();

  const columns = boardType === "main"
    ? stage.columns
    : stage.copyColumns;

  const row = Math.floor(index / columns);
  const col = index % columns;

  if (expectedFlowerValue(row, col) === null) return;

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
    setFeedback("روی خانه یا مسیری بزن که می‌خواهی پاک شود.", "");
  } else {
    setFeedback("", "");
  }

  renderPalette();
}


/* ---------- پاک‌کردن پاسخ‌های مرحله ---------- */

function clearAnswers() {
  if (stageChecked) return;

  const stage = getStage();

  if (stage.type === "edgePattern") {
    edgeMainDrawings = [null, null];
    edgeCopyDrawings = [null];
  } else if (stage.type === "flower") {
    flowerMainAnswers = Array(
      stage.columns * stage.rows
    ).fill(null);

    flowerCopyAnswers = Array(
      stage.copyColumns * stage.rows
    ).fill(null);
  } else {
    mainAnswers = Array(stage.columns).fill(null);
    copyAnswers = Array(stage.copyColumns).fill(null);
    mouseEaten = false;
  }

  saveCurrentStage();
  setFeedback("", "");
  renderStagePreservingAnswers();
}


/* ---------- بررسی پاسخ‌ها ---------- */

function checkRegularStage() {
  const stage = getStage();
  const isStage6 = currentStage === 5;

  if (
    mainAnswers.length !== stage.columns ||
    copyAnswers.length !== stage.copyColumns
  ) return false;

  for (let col = 0; col < stage.columns; col++) {
    if (!isStage6 && col < stage.fixedCount) continue;

    const expected = patternValue(stage.pattern, col);

    if (mainAnswers[col] !== expected) return false;
  }

  const expectedCopy = Array(stage.copyColumns).fill(null);

  if (isStage6) {
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

  return isCorrectArray(copyAnswers, expectedCopy);
}

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

  return mouseEaten && isCorrectArray(copyAnswers, expectedCopy);
}

function checkFlowerStage() {
  const stage = getStage();

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.columns; col++) {
      if (col < stage.fixedColumns) continue;

      const index = row * stage.columns + col;
      const expected = expectedFlowerValue(row, col);

      if (flowerMainAnswers[index] !== expected) return false;
    }
  }

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.copyColumns; col++) {
      const index = row * stage.copyColumns + col;
      const expected = expectedFlowerValue(row, col);

      if (flowerCopyAnswers[index] !== expected) return false;
    }
  }

  return true;
}

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

  if (fireworksTimer) clearTimeout(fireworksTimer);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const count = reducedMotion ? 12 : 65;

  for (let i = 0; i < count; i++) {
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
    fireworksTimer = null;
  }, 2200);
}


/* ---------- شروع بازی ---------- */

function startGame() {
  const input = $("studentName");
  const name = input ? input.value.trim() : "";

  studentName = name || "دانش‌آموز عزیز";

  $("studentGreeting").textContent =
    `سلام ${studentName}، آماده‌ای الگوها را کامل کنی؟`;

  currentStage = 0;

  Object.keys(savedStages).forEach(key => {
    delete savedStages[key];
  });

  mainAnswers = [];
  copyAnswers = [];
  flowerMainAnswers = [];
  flowerCopyAnswers = [];
  edgeMainDrawings = [null, null];
  edgeCopyDrawings = [null];
  mouseEaten = false;
  stageChecked = false;

  $("welcome").hidden = true;
  $("finish").hidden = true;
  $("game").hidden = false;

  renderStage();

  window.scrollTo({ top: 0, behavior: "auto" });
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

  window.scrollTo({ top: 0, behavior: "auto" });
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
  setFeedback("", "");
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

  Object.keys(savedStages).forEach(key => {
    delete savedStages[key];
  });

  if (fireworksTimer) {
    clearTimeout(fireworksTimer);
    fireworksTimer = null;
  }

  $("fireworks").classList.remove("active");
  $("fireworks").replaceChildren();

  $("studentName").value = "";
  $("game").hidden = true;
  $("finish").hidden = true;
  $("welcome").hidden = false;

  setFeedback("", "");
}


/* ---------- اتصال دکمه‌ها ---------- */

function attachEvents() {
  const startButton = $("startButton");

  if (!startButton) {
    console.error("دکمه startButton در HTML پیدا نشد.");
    return;
  }

  startButton.addEventListener("click", startGame);

  $("studentName")?.addEventListener("keydown", event => {
    if (event.key === "Enter") startGame();
  });

  $("checkButton")?.addEventListener("click", checkAnswers);
  $("prevButton")?.addEventListener("click", previousStage);
  $("nextButton")?.addEventListener("click", nextStage);
  $("exitButton")?.addEventListener("click", exitGame);
  $("restartButton")?.addEventListener("click", restartGame);
  $("eraserButton")?.addEventListener("click", toggleEraser);
  $("clearButton")?.addEventListener("click", clearAnswers);
}


/* ---------- آماده‌سازی صفحه ---------- */

/*
  این روش هم وقتی فایل با defer اجرا شود
  و هم وقتی DOM قبلاً آماده شده باشد کار می‌کند.
*/

function initializeGame() {
  $("welcome").hidden = false;
  $("game").hidden = true;
  $("finish").hidden = true;

  attachEvents();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGame, {
    once: true
  });
} else {
  initializeGame();
}
