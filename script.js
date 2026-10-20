"use strict";

/* =====================================================
   الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
   نسخه بازسازی‌شده
===================================================== */

const $ = (id) => document.getElementById(id);

const COLORS = {
  red: "#ef5350",
  blue: "#42a5f5",
  green: "#43b96b",
  yellow: "#ffd54f",
  purple: "#9565cf",
  orange: "#ff963d"
};

const ITEMS = {
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
    id: 1, type: "shape", title: "الگوی دوشکلی",
    instruction: "الگو را بخوان و آن را ادامه بده.",
    pattern: ["C", "S"], columns: 12, fixedCount: 4,
    copyColumns: 6, palette: ["C", "S"]
  },
  {
    id: 2, type: "shape", title: "الگوی چهارشکلی",
    instruction: "به ترتیب شکل‌ها دقت کن و الگو را ادامه بده.",
    pattern: ["T", "Y", "S", "C"], columns: 16, fixedCount: 8,
    copyColumns: 8, palette: ["C", "S", "T", "Y"]
  },
  {
    id: 3, type: "line", title: "الگوی خط‌های افقی",
    instruction: "رنگ خط‌ها را انتخاب کن و الگو را ادامه بده.",
    pattern: ["red", "blue"], orientation: "horizontal",
    columns: 12, fixedCount: 4, copyColumns: 6
  },
  {
    id: 4, type: "line", title: "الگوی خط‌های عمودی",
    instruction: "خط‌های عمودی را با رنگ درست ادامه بده.",
    pattern: ["blue", "red"], orientation: "vertical",
    columns: 12, fixedCount: 4, copyColumns: 6
  },
  {
    id: 5, type: "line", title: "الگوی خطی سه‌مرحله‌ای",
    instruction: "ترتیب رنگ خط‌ها را پیدا کن.",
    pattern: ["red", "red", "blue"], orientation: "horizontal",
    columns: 12, fixedCount: 6, copyColumns: 6
  },
  {
    id: 6, type: "line", title: "الگوی خط شکسته",
    instruction: "خط‌های روی مرز خانه‌ها را با رنگ مناسب کامل کن.",
    pattern: ["blue", "red", "blue", "red"], orientation: "broken",
    columns: 12, fixedCount: 4, copyColumns: 8
  },
  {
    id: 7, type: "mouse", title: "موش کدام شکل را بخورد؟",
    instruction: "شکل اشتباه را پیدا کن و روی آن بزن تا موش آن را بخورد.",
    pattern: ["C", "S"], wrongIndex: 5,
    columns: 10, copyColumns: 6, palette: ["C", "S"]
  },
  {
    id: 8, type: "mouse", title: "موش و الگوی سه‌شکلی",
    instruction: "شکلی را که نظم الگو را به هم زده پیدا کن.",
    pattern: ["T", "S", "C"], wrongIndex: 7,
    columns: 12, copyColumns: 6, palette: ["C", "S", "T"]
  },
  {
    id: 9, type: "color", title: "الگوی رنگی دورنگ",
    instruction: "خانه‌ها را با رنگ‌های درست کامل کن.",
    pattern: ["P", "O"], columns: 12, fixedCount: 4,
    copyColumns: 6, palette: ["P", "O"]
  },
  {
    id: 10, type: "color", title: "الگوی رنگی سه‌خانه‌ای",
    instruction: "به تکرار رنگ‌ها دقت کن.",
    pattern: ["O", "O", "P"], columns: 12, fixedCount: 6,
    copyColumns: 6, palette: ["P", "O"]
  },
  {
    id: 11, type: "color", title: "الگوی سه‌رنگی",
    instruction: "خانه‌ها را با توجه به ترتیب رنگ‌ها کامل کن.",
    pattern: ["P", "O", "G"], columns: 12, fixedCount: 6,
    copyColumns: 6, palette: ["P", "O", "G"]
  },
  {
    id: 12, type: "color", title: "الگوی چهاررنگی",
    instruction: "چهار رنگ را به ترتیب دنبال کن.",
    pattern: ["P", "O", "Y", "G"], columns: 16, fixedCount: 8,
    copyColumns: 8, palette: ["P", "O", "Y", "G"]
  },
  {
    id: 13, type: "flower", title: "الگوی سه‌ردیفی گل",
    instruction: "خانه‌های خالی را کامل کن و الگوی رئیس را هم تکرار کن.",
    columns: 21, rows: 3, fixedColumns: 8,
    copyColumns: 6, palette: ["G", "R"]
  }
];

/* وضعیت بازی */

let currentStage = 0;
let studentName = "";
let selectedItem = null;
let eraseMode = false;
let mainAnswers = [];
let copyAnswers = [];
let mouseEaten = false;
let flowerMainAnswers = [];
let flowerCopyAnswers = [];
let audioContext = null;
let fireworksTimer = null;
let stageChecked = false;

/* ابزارهای عمومی */

function setVisible(id, visible) {
  const element = $(id);
  if (element) element.classList.toggle("hidden", !visible);
}

function setFeedback(message, type = "info") {
  const element = $("feedback");
  if (!element) return;
  element.textContent = message;
  element.className = "feedback";
  if (message) element.classList.add(type);
}

function cycle(pattern, length) {
  return Array.from(
    { length },
    (_, index) => pattern[index % pattern.length]
  );
}

function expectedFlowerValue(row, column) {
  if (row === 0 || row === 2) {
    return column % 2 === 0 ? "G" : null;
  }

  return [null, "G", null, "R"][column % 4];
}

/* صدا */

function playTone(frequency = 600, duration = 0.12) {
  try {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return;

    if (!audioContext) audioContext = new AudioClass();

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.1,
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
    console.warn("صدا در این دستگاه در دسترس نیست.", error);
  }
}

function playCorrectSound() {
  playTone(660, 0.13);
  setTimeout(() => playTone(880, 0.14), 110);
  setTimeout(() => playTone(1040, 0.16), 220);
}

function playWrongSound() {
  playTone(260, 0.17);
}

/* نمایش شکل‌ها و رنگ‌ها */

function shapeHTML(key) {
  const item = ITEMS[key];
  if (!item) return "";

  if (item.shape === "star") {
    return '<span class="shape star" aria-label="ستاره زرد">⭐</span>';
  }

  return `<span class="shape ${item.shape} ${item.color}" aria-label="${item.label}"></span>`;
}

function colorHTML(key) {
  const item = COLOR_ITEMS[key];
  if (!item) return "";
  return `<span class="color-swatch" style="background-color:${COLORS[item.color]}" aria-label="${item.label}"></span>`;
}

function clearSelection() {
  selectedItem = null;
  eraseMode = false;

  document.querySelectorAll(".palette-item").forEach((button) => {
    button.classList.remove("selected");
  });

  const eraser = $("eraserButton");
  if (eraser) {
    eraser.classList.remove("active");
    eraser.setAttribute("aria-pressed", "false");
  }
}

function renderPalette() {
  const palette = $("palette");
  if (!palette) return;

  palette.innerHTML = "";
  clearSelection();

  const stage = STAGES[currentStage];
  let choices = [];

  if (stage.type === "shape" || stage.type === "mouse") {
    choices = stage.palette.map((key) => ({ key, type: "shape" }));
  } else if (stage.type === "color" || stage.type === "flower") {
    choices = stage.palette.map((key) => ({ key, type: "color" }));
  } else {
    choices = ["red", "blue"].map((key) => ({ key, type: "line" }));
  }

  choices.forEach(({ key, type }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-item";
    button.dataset.key = key;
    button.dataset.type = type;

    if (type === "shape") {
      button.innerHTML = shapeHTML(key);
      button.setAttribute("aria-label", ITEMS[key].label);
    } else if (type === "color") {
      button.innerHTML = colorHTML(key);
      button.setAttribute("aria-label", COLOR_ITEMS[key].label);
    } else {
      const preview = document.createElement("span");
      preview.className = "line-preview";
      preview.style.backgroundColor = COLORS[key];
      button.appendChild(preview);
      button.setAttribute(
        "aria-label",
        key === "red" ? "خط قرمز" : "خط آبی"
      );
    }

    button.addEventListener("click", () => {
      selectedItem = { key, type };
      eraseMode = false;

      document.querySelectorAll(".palette-item").forEach((item) => {
        item.classList.toggle("selected", item === button);
      });

      const eraser = $("eraserButton");
      if (eraser) {
        eraser.classList.remove("active");
        eraser.setAttribute("aria-pressed", "false");
      }

      setFeedback("ابزار انتخاب شد. خانه‌ها را کامل کن.", "info");
      playTone(520, 0.07);
    });

    palette.appendChild(button);
  });
}

/* جدول‌ها */

function setupBoard(board, columns, rows = 1) {
  if (!board) return;

  board.innerHTML = "";
  board.style.gridTemplateColumns =
    `repeat(${columns}, var(--cell-size, 43px))`;
  board.style.gridTemplateRows =
    `repeat(${rows}, var(--cell-size, 43px))`;
}

function addLine(cell, color, orientation, index) {
  const segment = document.createElement("span");
  segment.classList.add("line-segment", color);

  if (orientation === "vertical") {
    segment.classList.add("vertical", "right");
  } else if (orientation === "broken" && index % 2 === 1) {
    segment.classList.add("vertical", "right");
  } else {
    segment.classList.add("horizontal", "bottom");
  }

  cell.appendChild(segment);
}

function makeCell({
  value = null,
  index = 0,
  row = 0,
  kind = "shape",
  fixed = false,
  boardName = "main",
  onClick = null
} = {}) {
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = "cell";
  cell.classList.add(fixed ? "fixed" : "answer");
  cell.dataset.index = String(index);
  cell.dataset.row = String(row);
  cell.dataset.board = boardName;

  if (fixed) cell.disabled = true;

  if (kind === "shape" || kind === "mouse") {
    cell.innerHTML = value ? shapeHTML(value) : "";
    if (!value) cell.classList.add("blank");
  } else if (kind === "color" || kind === "flower") {
    cell.classList.add("color-cell");

    if (value && COLOR_ITEMS[value]) {
      cell.style.setProperty(
        "--cell-color",
        COLORS[COLOR_ITEMS[value].color]
      );
    } else {
      cell.classList.add("blank");
    }
  } else if (kind === "line") {
    cell.classList.add("line-cell");

    if (value) {
      addLine(cell, value, STAGES[currentStage].orientation, index);
    } else {
      const placeholder = document.createElement("span");
      placeholder.className = "line-placeholder";
      cell.appendChild(placeholder);
    }
  }

  if (!fixed && onClick) {
    cell.addEventListener("click", () => onClick(index, row, cell));
  }

  return cell;
}

/* مقداردهی پاسخ‌ها */

function initializeStage() {
  const stage = STAGES[currentStage];

  mainAnswers = Array(stage.columns).fill(null);
  copyAnswers = Array(stage.copyColumns).fill(null);
  flowerMainAnswers = Array(stage.columns * (stage.rows || 1)).fill(null);
  flowerCopyAnswers = Array(stage.copyColumns * (stage.rows || 1)).fill(null);

  mouseEaten = false;
  stageChecked = false;
  clearFireworks();
}

/* تمرین‌های شکلی، رنگی و موش */

function wrongMouseValue(stage, index) {
  const expected = stage.pattern[index % stage.pattern.length];

  if (stage.id === 7) return expected === "C" ? "T" : "C";

  if (expected === "T") return "Y";
  if (expected === "S") return "C";
  return "T";
}

function renderRegularBoards() {
  const stage = STAGES[currentStage];
  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");
  if (!mainBoard || !copyBoard) return;

  const kind = stage.type === "color" ? "color" : "shape";

  setupBoard(mainBoard, stage.columns);
  setupBoard(copyBoard, stage.copyColumns);

  const expected = cycle(stage.pattern, stage.columns);

  for (let i = 0; i < stage.columns; i++) {
    const fixed = stage.type === "mouse"
      ? false
      : i < (stage.fixedCount || 0);

    let value;

    if (stage.type === "mouse") {
      value = mouseEaten && i === stage.wrongIndex
        ? null
        : i === stage.wrongIndex
          ? wrongMouseValue(stage, i)
          : expected[i];
    } else {
      value = fixed ? expected[i] : mainAnswers[i];
    }

    const cell = makeCell({
      value,
      index: i,
      kind: stage.type === "mouse" ? "mouse" : kind,
      fixed,
      boardName: "main",
      onClick: (index, row, clickedCell) => {
        if (stage.type === "mouse") {
          handleMouseClick(index);
        } else {
          putAnswer("main", index);
        }
      }
    });

    if (stage.type === "mouse" && i === stage.wrongIndex && !mouseEaten) {
      cell.classList.add("mouse-target");
      cell.title = "شکل اشتباه";
    }

    if (stage.type === "mouse" && i === stage.wrongIndex && mouseEaten) {
      cell.classList.add("mouse-eaten");
      cell.innerHTML = '<span aria-hidden="true">🐭</span>';
      cell.disabled = true;
    }

    mainBoard.appendChild(cell);
  }

  for (let i = 0; i < stage.copyColumns; i++) {
    const cell = makeCell({
      value: copyAnswers[i],
      index: i,
      kind,
      boardName: "copy",
      onClick: (index) => putAnswer("copy", index)
    });

    copyBoard.appendChild(cell);
  }
}

function handleMouseClick(index) {
  const stage = STAGES[currentStage];

  if (mouseEaten) return;

  if (index !== stage.wrongIndex) {
    setFeedback("این شکل با الگو هماهنگ است. دوباره دقت کن.", "error");
    playWrongSound();
    return;
  }

  mouseEaten = true;
  playCorrectSound();
  setFeedback("آفرین! موش شکل اشتباه را خورد. حالا جدول پایین را کامل کن.", "success");
  renderRegularBoards();
}

/* تمرین‌های خطی */

function renderLineBoards() {
  const stage = STAGES[currentStage];
  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");
  if (!mainBoard || !copyBoard) return;

  setupBoard(mainBoard, stage.columns);
  setupBoard(copyBoard, stage.copyColumns);

  for (let i = 0; i < stage.columns; i++) {
    const fixed = i < stage.fixedCount;
    const value = fixed
      ? stage.pattern[i % stage.pattern.length]
      : mainAnswers[i];

    mainBoard.appendChild(makeCell({
      value,
      index: i,
      kind: "line",
      fixed,
      boardName: "main",
      onClick: (index) => putAnswer("main", index)
    }));
  }

  for (let i = 0; i < stage.copyColumns; i++) {
    copyBoard.appendChild(makeCell({
      value: copyAnswers[i],
      index: i,
      kind: "line",
      boardName: "copy",
      onClick: (index) => putAnswer("copy", index)
    }));
  }
}

/* تمرین سیزدهم: الگوی گل */

function renderFlowerBoards() {
  const stage = STAGES[currentStage];
  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");
  if (!mainBoard || !copyBoard) return;

  setupBoard(mainBoard, stage.columns, stage.rows);
  setupBoard(copyBoard, stage.copyColumns, stage.rows);

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.columns; col++) {
      const index = row * stage.columns + col;
      const expected = expectedFlowerValue(row, col);
      const fixed = col < stage.fixedColumns;
      const value = fixed ? expected : flowerMainAnswers[index];

      mainBoard.appendChild(makeCell({
        value,
        index: col,
        row,
        kind: "flower",
        fixed,
        boardName: "main",
        onClick: (cellIndex, cellRow) => {
          putFlowerAnswer("main", cellIndex, cellRow);
        }
      }));
    }
  }

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.copyColumns; col++) {
      const index = row * stage.copyColumns + col;

      copyBoard.appendChild(makeCell({
        value: flowerCopyAnswers[index],
        index: col,
        row,
        kind: "flower",
        boardName: "copy",
        onClick: (cellIndex, cellRow) => {
          putFlowerAnswer("copy", cellIndex, cellRow);
        }
      }));
    }
  }
}

/* قرار دادن پاسخ‌ها */

function putAnswer(boardName, index) {
  if (stageChecked) {
    setFeedback("برای تغییر پاسخ‌ها، ابتدا مرحله را دوباره بررسی کن یا پاسخ‌ها را پاک کن.", "info");
    return;
  }

  const stage = STAGES[currentStage];
  const answers = boardName === "main" ? mainAnswers : copyAnswers;

  if (eraseMode) {
    answers[index] = null;
    playTone(300, 0.05);
    renderCurrentBoards();
    return;
  }

  if (!selectedItem) {
    setFeedback("اول شکل، رنگ یا خط موردنظرت را انتخاب کن.", "info");
    return;
  }

  if (stage.type === "line" && selectedItem.type !== "line") {
    setFeedback("برای این تمرین، یکی از رنگ‌های خط را انتخاب کن.", "info");
    return;
  }

  if (stage.type !== "line" && selectedItem.type !== "shape" && selectedItem.type !== "color") {
    setFeedback("ابزار مناسبی انتخاب کن.", "info");
    return;
  }

  answers[index] = selectedItem.key;
  playTone(500, 0.05);
  renderCurrentBoards();
}

function putFlowerAnswer(boardName, column, row) {
  if (stageChecked) return;

  const stage = STAGES[currentStage];
  const index = row * (boardName === "main" ? stage.columns : stage.copyColumns) + column;
  const answers = boardName === "main" ? flowerMainAnswers : flowerCopyAnswers;

  if (eraseMode) {
    answers[index] = null;
    renderFlowerBoards();
    return;
  }

  if (!selectedItem || selectedItem.type !== "color") {
    setFeedback("ابتدا رنگ سبز یا قرمز را انتخاب کن.", "info");
    return;
  }

  answers[index] = selectedItem.key;
  playTone(500, 0.05);
  renderFlowerBoards();
}

function renderCurrentBoards() {
  const stage = STAGES[currentStage];

  if (stage.type === "shape" || stage.type === "color" || stage.type === "mouse") {
    renderRegularBoards();
  } else if (stage.type === "line") {
    renderLineBoards();
  } else if (stage.type === "flower") {
    renderFlowerBoards();
  }
}

/* بررسی پاسخ‌ها */

function arraysCorrect(actual, expected) {
  return actual.length === expected.length &&
    actual.every((value, index) => value === expected[index]);
}

function checkRegularStage() {
  const stage = STAGES[currentStage];

  if (stage.type === "mouse" && !mouseEaten) {
    setFeedback("اول شکل اشتباه را پیدا کن تا موش آن را بخورد.", "error");
    playWrongSound();
    return false;
  }

  const expectedMain = cycle(stage.pattern, stage.columns);
  const fixedCount = stage.type === "mouse" ? 0 : stage.fixedCount || 0;

  for (let i = fixedCount; i < stage.columns; i++) {
    if (stage.type === "mouse") continue;

    if (mainAnswers[i] !== expectedMain[i]) {
      setFeedback("هنوز همهٔ خانه‌های جدول اصلی درست نیستند. دوباره دقت کن.", "error");
      playWrongSound();
      return false;
    }
  }

  const expectedCopy = cycle(stage.pattern, stage.copyColumns);

  if (!arraysCorrect(copyAnswers, expectedCopy)) {
    setFeedback("جدول پایین را هم کامل کن؛ الگوی رئیس باید یک بار تکرار شود.", "error");
    playWrongSound();
    return false;
  }

  return true;
}

function checkLineStage() {
  const stage = STAGES[currentStage];
  const expectedMain = cycle(stage.pattern, stage.columns);
  const expectedCopy = cycle(stage.pattern, stage.copyColumns);

  for (let i = stage.fixedCount; i < stage.columns; i++) {
    if (mainAnswers[i] !== expectedMain[i]) {
      setFeedback("رنگ یا ترتیب یکی از خط‌ها درست نیست.", "error");
      playWrongSound();
      return false;
    }
  }

  if (!arraysCorrect(copyAnswers, expectedCopy)) {
    setFeedback("الگوی خطی جدول پایین را هم کامل کن.", "error");
    playWrongSound();
    return false;
  }

  return true;
}

function checkFlowerStage() {
  const stage = STAGES[currentStage];

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.columns; col++) {
      if (col < stage.fixedColumns) continue;

      const index = row * stage.columns + col;
      const expected = expectedFlowerValue(row, col);

      if (flowerMainAnswers[index] !== expected) {
        setFeedback("الگوی سه‌ردیفی هنوز کامل نیست. خانه‌های سبز، قرمز و خالی را با دقت بررسی کن.", "error");
        playWrongSound();
        return false;
      }
    }
  }

  for (let row = 0; row < stage.rows; row++) {
    for (let col = 0; col < stage.copyColumns; col++) {
      const index = row * stage.copyColumns + col;
      const expected = expectedFlowerValue(row, col);

      if (flowerCopyAnswers[index] !== expected) {
        setFeedback("جدول پایین را هم مثل الگوی رئیس کامل کن؛ بعضی خانه‌ها باید خالی بمانند.", "error");
        playWrongSound();
        return false;
      }
    }
  }

  return true;
}

function checkAnswers() {
  const stage = STAGES[currentStage];

  const correct = stage.type === "line"
    ? checkLineStage()
    : stage.type === "flower"
      ? checkFlowerStage()
      : checkRegularStage();

  if (!correct) return;

  stageChecked = true;
  playCorrectSound();
  setFeedback("آفرین! همهٔ پاسخ‌ها درست است! 🌟", "success");
  showFireworks();

  const next = $("nextButton");
  if (next) {
    next.textContent = currentStage === STAGES.length - 1
      ? "پایان بازی 🎉"
      : "مرحله بعدی";
  }
}

/* پاک‌کردن پاسخ‌ها */

function clearAnswers() {
  const stage = STAGES[currentStage];

  stageChecked = false;
  mouseEaten = false;
  mainAnswers.fill(null);
  copyAnswers.fill(null);
  flowerMainAnswers.fill(null);
  flowerCopyAnswers.fill(null);

  clearSelection();
  clearFireworks();
  setFeedback("پاسخ‌های واردشده پاک شدند.", "info");
  renderCurrentBoards();
}

/* پاک‌کن */

function toggleEraser() {
  eraseMode = !eraseMode;
  selectedItem = null;

  document.querySelectorAll(".palette-item").forEach((button) => {
    button.classList.remove("selected");
  });

  const eraser = $("eraserButton");
  if (eraser) {
    eraser.classList.toggle("active", eraseMode);
    eraser.setAttribute("aria-pressed", String(eraseMode));
  }

  setFeedback(
    eraseMode ? "پاک‌کن فعال شد؛ روی خانه‌ای که می‌خواهی پاک شود بزن." : "پاک‌کن غیرفعال شد.",
    "info"
  );
}

/* فشفشه */

function clearFireworks() {
  const container = $("fireworks");
  if (container) {
    container.innerHTML = "";
    container.classList.add("hidden");
  }

  if (fireworksTimer) {
    clearTimeout(fireworksTimer);
    fireworksTimer = null;
  }
}

function showFireworks() {
  const container = $("fireworks");
  if (!container) return;

  clearFireworks();
  container.classList.remove("hidden");

  for (let burst = 0; burst < 5; burst++) {
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("span");
      particle.className = "firework-particle";
      particle.style.left = `${10 + Math.random() * 80}%`;
      particle.style.top = `${10 + Math.random() * 65}%`;
      particle.style.backgroundColor = [
        COLORS.red,
        COLORS.blue,
        COLORS.green,
        COLORS.yellow,
        COLORS.purple,
        COLORS.orange
      ][Math.floor(Math.random() * 6)];

      particle.style.setProperty("--dx", `${(Math.random() - 0.5) * 180}px`);
      particle.style.setProperty("--dy", `${(Math.random() - 0.5) * 180}px`);
      container.appendChild(particle);
    }
  }

  fireworksTimer = setTimeout(clearFireworks, 2400);
}

/* نمایش تمرین */

function renderStage() {
  const stage = STAGES[currentStage];
  if (!stage) return;

  initializeStage();

  setVisible("welcome", false);
  setVisible("finish", false);
  setVisible("game", true);

  if ($("stageLabel")) {
    $("stageLabel").textContent = `تمرین ${currentStage + 1} از ${STAGES.length}`;
  }

  if ($("stageTitle")) $("stageTitle").textContent = stage.title;
  if ($("stageInstruction")) $("stageInstruction").textContent = stage.instruction;

  if ($("mainLabel")) {
    $("mainLabel").textContent = stage.mainLabel ||
      (stage.type === "mouse" ? "شکل اشتباه را پیدا کن" : "الگوی اصلی را ادامه بده");
  }

  if ($("copyLabel")) {
    $("copyLabel").textContent = stage.copyLabel ||
      "الگوی رئیس را یک بار تکرار کن";
  }

  const progress = $("progressBar");
  if (progress) {
    progress.style.width = `${(currentStage / STAGES.length) * 100}%`;
  }

  const progressTrack = document.querySelector('[role="progressbar"]');
  if (progressTrack) {
    progressTrack.setAttribute("aria-valuenow", String(currentStage));
  }

  const next = $("nextButton");
  if (next) {
    next.textContent = currentStage === STAGES.length - 1
      ? "پایان بازی 🎉"
      : "مرحله بعدی";
  }

  const prev = $("prevButton");
  if (prev) prev.disabled = currentStage === 0;

  renderPalette();
  renderCurrentBoards();
  setFeedback("برای شروع، ابزار مناسب را انتخاب کن.", "info");
}

/* شروع، جابه‌جایی و پایان */

function startGame() {
  const input = $("studentName");
  studentName = input ? input.value.trim() : "";

  if ($("studentGreeting")) {
    $("studentGreeting").textContent = studentName
      ? `آفرین ${studentName} جان! آماده‌ای؟ 🌈`
      : "آفرین قهرمان! آماده‌ای؟ 🌈";
  }

  currentStage = 0;
  renderStage();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startGameFix() {
  startGame();
}

function previousStage() {
  if (currentStage <= 0) return;
  currentStage--;
  renderStage();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextStage() {
  if (currentStage < STAGES.length - 1) {
    currentStage++;
    renderStage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    finishGame();
  }
}

function finishGame() {
  clearFireworks();
  setVisible("game", false);
  setVisible("welcome", false);
  setVisible("finish", true);

  if ($("finishMessage")) {
    $("finishMessage").textContent = studentName
      ? `آفرین ${studentName} جان! به پایان ۱۳ تمرین رسیدی.`
      : "آفرین قهرمان! به پایان ۱۳ تمرین رسیدی.";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function exitGame() {
  clearFireworks();
  setVisible("game", false);
  setVisible("finish", false);
  setVisible("welcome", true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function restartGame() {
  currentStage = 0;
  startGame();
}

/* اتصال دکمه‌ها */

function attachEvents() {
  $("startButton")?.addEventListener("click", startGame);
  $("checkButton")?.addEventListener("click", checkAnswers);
  $("prevButton")?.addEventListener("click", previousStage);
  $("nextButton")?.addEventListener("click", nextStage);
  $("exitButton")?.addEventListener("click", exitGame);
  $("restartButton")?.addEventListener("click", restartGame);
  $("clearButton")?.addEventListener("click", clearAnswers);
  $("eraserButton")?.addEventListener("click", toggleEraser);

  $("studentName")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") startGame();
  });
}

/* راه‌اندازی */

document.addEventListener("DOMContentLoaded", () => {
  attachEvents();

  setVisible("welcome", true);
  setVisible("game", false);
  setVisible("finish", false);
});
