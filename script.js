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
    instruction: "الگو را کشف کن، مداد را بردار و با کشیدن انگشت یا ماوس مسیر خط را رسم کن؛ سپس الگو را در جدول پایین تکرار کن.",
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

/* وضعیت بازی */

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

const savedStages = {};

/* صدا */

function playTone(frequency = 440, duration = 0.09) {
  try {
    const AudioClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioClass) return;

    if (!audioContext) audioContext = new AudioClass();

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
  } catch (error) {}
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

/* ابزارهای کمکی */

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

function cloneDrawings(drawings) {
  return drawings.map(drawing =>
    drawing ? drawing.map(point => ({ ...point })) : null
  );
}

function saveCurrentStage() {
  savedStages[currentStage] = {
    mainAnswers: [...mainAnswers],
    copyAnswers: [...copyAnswers],
    flowerMainAnswers: [...flowerMainAnswers],
    flowerCopyAnswers: [...flowerCopyAnswers],
    edgeMainDrawings: cloneDrawings(edgeMainDrawings),
    edgeCopyDrawings: cloneDrawings(edgeCopyDrawings),
    mouseEaten,
    stageChecked
  };
}

function loadStageAnswers() {
  const saved = savedStages[currentStage];

  mainAnswers = saved ? [...saved.mainAnswers] : [];
  copyAnswers = saved ? [...saved.copyAnswers] : [];

  flowerMainAnswers = saved
    ? [...saved.flowerMainAnswers]
    : [];

  flowerCopyAnswers = saved
    ? [...saved.flowerCopyAnswers]
    : [];

  edgeMainDrawings = saved
    ? cloneDrawings(saved.edgeMainDrawings)
    : [null, null];

  edgeCopyDrawings = saved
    ? cloneDrawings(saved.edgeCopyDrawings)
    : [null];

  mouseEaten = saved ? saved.mouseEaten : false;
  stageChecked = saved ? saved.stageChecked : false;
}

/* نمایش شکل و رنگ */

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

/* ساخت خانه */

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

/* پالت */

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
    } else if (
      stage.type === "line" ||
      stage.type === "diagonal"
    ) {
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
          <span class="palette-line ${
            stage.type === "diagonal" ? "palette-diagonal" : ""
          }"
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

/* جدول تمرین‌های معمولی */

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

    mainBoard.appendChild(createCell({
      value: fixed ? expected : null,
      type: stage.type,
      fixed,
      answer: fixed ? null : mainAnswers[col],
      onClick: fixed ? null : () => putAnswer("main", col)
    }));
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

/* تمرین موش */

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

/* تمرین گل */

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

      mainBoard.appendChild(createCell({
        value: fixed ? expected : null,
        type: "color",
        fixed,
        answer: fixed ? null : flowerMainAnswers[index],
        extraClass: expected === null ? "expected-blank" : "",
        onClick: fixed || expected === null
          ? null
          : () => putFlowerAnswer("main", index)
      }));
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

      copyBoard.appendChild(createCell({
        type: "color",
        answer: flowerCopyAnswers[index],
        extraClass: expected === null ? "expected-blank" : "",
        onClick: expected === null
          ? null
          : () => putFlowerAnswer("copy", index)
      }));
    }
  }
}

/* ==========================================
   تمرین پنجم: رسم مسیر با مداد قابل‌مشاهده
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
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");

  svg.classList.add("edge-drawing-layer");
  svg.setAttribute("viewBox", `0 0 ${columns} 1`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.style.touchAction = "none";
  svg.style.overflow = "visible";

  const hitArea = document.createElementNS(svgNS, "rect");

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
  let pencil = null;

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

    if (position.x < 6 || position.x > 12) {
      return null;
    }

    const index = Math.floor((position.x - 6) / 3);

    return index === 0 || index === 1 ? index : null;
  }

  function ensurePencil() {
    if (pencil) return pencil;

    pencil = document.createElement("div");
    pencil.className = "drawing-pencil";
    pencil.textContent = "✏️";
    pencil.setAttribute("aria-hidden", "true");

    pencil.style.position = "fixed";
    pencil.style.zIndex = "99999";
    pencil.style.pointerEvents = "none";
    pencil.style.fontSize = "30px";
    pencil.style.lineHeight = "1";
    pencil.style.transform = "translate(-8px, -28px) rotate(-35deg)";
    pencil.style.filter = "drop-shadow(0 2px 2px rgba(0,0,0,.25))";
    pencil.style.display = "none";

    document.body.appendChild(pencil);

    return pencil;
  }

  function movePencil(event) {
    const pen = ensurePencil();

    pen.style.left = `${event.clientX}px`;
    pen.style.top = `${event.clientY}px`;
    pen.style.display = "block";
  }

  function hidePencil() {
    if (pencil) {
      pencil.style.display = "none";
    }
  }

  function drawAll() {
    svg.querySelectorAll(
      ".student-edge-line, .student-edge-dot"
    ).forEach(node => node.remove());

    getDrawings().forEach((points, index) => {
      if (!points || points.length < 2) return;

      const start = groupStart(index);

      const line = document.createElementNS(svgNS, "polyline");

      line.classList.add("student-edge-line");
      line.setAttribute(
        "points",
        points.map(p => `${p.x + start},${p.y}`).join(" ")
      );
      line.setAttribute("fill", "none");
      line.setAttribute("stroke", "#7851b8");
      line.setAttribute("stroke-width", "0.075");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("stroke-linejoin", "round");

      svg.appendChild(line);

      const dot = document.createElementNS(svgNS, "circle");

      dot.classList.add("student-edge-dot");
      dot.setAttribute("cx", points[0].x + start);
      dot.setAttribute("cy", points[0].y);
      dot.setAttribute("r", "0.09");
      dot.setAttribute("fill", "#7851b8");

      svg.appendChild(dot);
    });

    if (activeGroup !== null && activePoints.length > 1) {
      const start = groupStart(activeGroup);

      const line = document.createElementNS(svgNS, "polyline");

      line.classList.add("student-edge-line");
      line.setAttribute(
        "points",
        activePoints.map(p => `${p.x + start},${p.y}`).join(" ")
      );
      line.setAttribute("fill", "none");
      line.setAttribute("stroke", "#7851b8");
      line.setAttribute("stroke-width", "0.075");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("stroke-linejoin", "round");

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

    movePencil(event);

    try {
      svg.setPointerCapture(event.pointerId);
    } catch (error) {}

    drawAll();
  });

  svg.addEventListener("pointermove", event => {
    if (activeGroup === null) return;
    if (event.pointerId !== activePointerId) return;

    event.preventDefault();
    movePencil(event);

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
    ) {
      return;
    }

    getDrawings()[activeGroup] =
      activePoints.length >= 2
        ? activePoints.map(point => ({ ...point }))
        : null;

    activeGroup = null;
    activePoints = [];
    activePointerId = null;

    hidePencil();
    saveCurrentStage();
    drawAll();
    playPlaceSound();
  }

  svg.addEventListener("pointerup", finishDrawing);
  svg.addEventListener("pointercancel", finishDrawing);
  svg.addEventListener("lostpointercapture", finishDrawing);

  drawAll();
}

/* بررسی مسیرهای تمرین پنجم */

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
