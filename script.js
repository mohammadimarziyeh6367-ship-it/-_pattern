"use strict";

/* ========================================
   الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
======================================== */

const $ = id => document.getElementById(id);

const COLORS = {
  red: "#ef5350",
  blue: "#42a5f5",
  green: "#58c86b",
  yellow: "#ffd84d",
  purple: "#ab78e8"
};

const ITEMS = [
  { shape: "circle", color: COLORS.red, name: "دایره قرمز" },
  { shape: "square", color: COLORS.blue, name: "مربع آبی" },
  { shape: "triangle", color: COLORS.green, name: "مثلث سبز" },
  { shape: "star", color: COLORS.yellow, name: "ستاره زرد" },
  { shape: "circle", color: COLORS.purple, name: "دایره بنفش" },
  { shape: "square", color: COLORS.red, name: "مربع قرمز" },
  { shape: "triangle", color: COLORS.blue, name: "مثلث آبی" },
  { shape: "star", color: COLORS.green, name: "ستاره سبز" }
];

function item(shape, color) {
  return ITEMS.find(x =>
    x.shape === shape && x.color === color
  );
}

const C = ITEMS[0];
const S = ITEMS[1];
const T = ITEMS[2];
const Y = ITEMS[3];
const P = ITEMS[4];
const R = ITEMS[5];
const B = ITEMS[6];
const G = ITEMS[7];

/* ========================================
   الگوهای تمرین سیزدهم
======================================== */

// null یعنی خانه باید کاملاً خالی باشد.
const FLOWER_EXPECTED = [
  Array.from(
    { length: 21 },
    (_, col) => col % 2 === 0 ? "green" : null
  ),

  Array.from(
    { length: 21 },
    (_, col) => [null, "green", null, "red"][col % 4]
  ),

  Array.from(
    { length: 21 },
    (_, col) => col % 2 === 0 ? "green" : null
  )
];

const FLOWER_COPY_EXPECTED = [
  ["green", null, "green", null, "green", null],
  [null, "green", null, "red", null, "green"],
  ["green", null, "green", null, "green", null]
];

/* ========================================
   فهرست مراحل
======================================== */

const STAGES = [
  {
    title: "الگوی دو شکلی",
    pattern: [C, S],
    repeats: 3
  },
  {
    title: "الگوی رنگی",
    pattern: [T, T, Y, Y],
    repeats: 2
  },
  {
    title: "الگوی سه شکلی",
    pattern: [P, S, T],
    repeats: 2
  },
  {
    title: "الگوی تکراری",
    pattern: [Y, Y, C],
    repeats: 2
  },
  {
    title: "الگوی شکل و رنگ",
    pattern: [S, C, S, C],
    repeats: 2
  },
  {
    title: "الگوی سبز",
    pattern: [G, T, G, T],
    repeats: 2
  },
  {
    title: "الگوی ستاره‌ها",
    pattern: [Y, C, Y, C],
    repeats: 2
  },
  {
    title: "الگوی چهار شکلی",
    pattern: [S, C, T, Y],
    repeats: 2
  },
  {
    title: "الگوی ترکیبی",
    pattern: [P, P, B],
    repeats: 3
  },
  {
    title: "الگوی قرمز و آبی",
    pattern: [R, B, R, B],
    repeats: 2
  },
  {
    title: "الگوی سه رنگ",
    pattern: [C, T, Y],
    repeats: 3
  },
  {
    title: "الگوی پایانی",
    pattern: [G, S, P, Y],
    repeats: 2
  },
  {
    title: "الگوی سه‌ردیفی گل",
    type: "flower"
  }
];

/* ========================================
   وضعیت بازی
======================================== */

let stageIndex = 0;
let selectedItem = ITEMS[0];
let selectedFlowerColor = COLORS.green;
let eraseMode = false;

let mainAnswers = [];
let copyAnswers = [];

let flowerMainAnswers = Array(39).fill(null);
let flowerCopyAnswers = Array(18).fill(null);

let fireworksTimer = null;
let audioContext = null;

/* ========================================
   ابزارهای عمومی
======================================== */

function cloneItem(value) {
  return value ? { ...value } : null;
}

function sameItem(a, b) {
  return Boolean(a && b) &&
    a.shape === b.shape &&
    a.color === b.color;
}

function repeatedPattern(pattern, count) {
  const result = [];

  for (let i = 0; i < count; i++) {
    pattern.forEach(value => {
      result.push(cloneItem(value));
    });
  }

  return result;
}

function shapeHTML(value) {
  if (!value) return "";

  if (value.shape === "star") {
    return `<span class="shape star"
      style="--shape-color:${value.color};color:${value.color}">★</span>`;
  }

  if (value.shape === "triangle") {
    return `<span class="shape triangle"
      style="--shape-color:${value.color};
      border-bottom-color:${value.color}"></span>`;
  }

  return `<span class="shape ${value.shape}"
    style="background:${value.color};
    --shape-color:${value.color}"></span>`;
}

function playTone(frequency = 660, duration = 0.12) {
  try {
    audioContext ||= new (
      window.AudioContext || window.webkitAudioContext
    )();

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.08;

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration
    );

    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    // بازی بدون صدا هم اجرا می‌شود.
  }
}

/* ========================================
   انتخاب شکل‌ها در تمرین‌های معمولی
======================================== */

function renderPalette() {
  const palette = $("palette");
  palette.innerHTML = "";

  ITEMS.forEach(value => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-button";

    button.classList.toggle(
      "selected",
      !eraseMode && sameItem(selectedItem, value)
    );

    button.setAttribute("aria-label", value.name);
    button.title = value.name;
    button.innerHTML = shapeHTML(value);

    button.addEventListener("click", () => {
      selectedItem = value;
      eraseMode = false;

      $("eraserButton").textContent = "پاک‌کن 🧽";

      renderPalette();
      playTone(520, 0.07);
    });

    palette.appendChild(button);
  });
}

/* ========================================
   انتخاب رنگ در تمرین سیزدهم
======================================== */

function renderFlowerPalette() {
  const palette = $("palette");
  palette.innerHTML = "";

  const options = [
    { name: "سبز", color: COLORS.green },
    { name: "قرمز", color: COLORS.red }
  ];

  options.forEach(option => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-button flower-color-button";

    button.classList.toggle(
      "selected",
      !eraseMode &&
      selectedFlowerColor === option.color
    );

    button.setAttribute(
      "aria-label",
      `رنگ ${option.name}`
    );

    button.title = option.name;

    button.innerHTML = `
      <span class="flower-color-swatch"
        style="background:${option.color}"></span>
      <span>${option.name}</span>
    `;

    button.addEventListener("click", () => {
      selectedFlowerColor = option.color;
      eraseMode = false;

      $("eraserButton").textContent = "پاک‌کن 🧽";

      renderFlowerPalette();
      playTone(520, 0.07);
    });

    palette.appendChild(button);
  });
}

/* ========================================
   ساخت خانه‌های تمرین‌های معمولی
======================================== */

function makeCell(value, index, fixed, boardName) {
  const cell = document.createElement("button");

  cell.type = "button";
  cell.className = "cell";

  if (fixed) {
    cell.classList.add("fixed-cell");
    cell.disabled = true;
  } else {
    cell.classList.add("answer-cell");

    cell.setAttribute(
      "aria-label",
      `خانه ${index + 1}`
    );

    cell.addEventListener("click", () => {
      if (eraseMode) {
        if (boardName === "main") {
          mainAnswers[index] = null;
        } else {
          copyAnswers[index] = null;
        }
      } else {
        if (boardName === "main") {
          mainAnswers[index] = cloneItem(selectedItem);
        } else {
          copyAnswers[index] = cloneItem(selectedItem);
        }

        playTone(590, 0.06);
      }

      renderBoards();
    });
  }

  cell.innerHTML = shapeHTML(value);

  return cell;
}

function renderBoard(container, values, fixedCount, boardName) {
  container.innerHTML = "";

  container.style.setProperty(
    "--columns",
    values.length
  );

  values.forEach((value, index) => {
    container.appendChild(
      makeCell(
        value,
        index,
        index < fixedCount,
        boardName
      )
    );
  });
}

function renderBoards() {
  const stage = STAGES[stageIndex];

  if (!stage || stage.type === "flower") return;

  const fixedMain = repeatedPattern(
    stage.pattern,
    stage.repeats
  );

  const fullMain = [
    ...fixedMain,
    ...mainAnswers.map(cloneItem)
  ];

  renderBoard(
    $("mainBoard"),
    fullMain,
    fixedMain.length,
    "main"
  );

  renderBoard(
    $("copyBoard"),
    copyAnswers.map(cloneItem),
    0,
    "copy"
  );
}

/* ========================================
   مقداردهی اولیهٔ پاسخ‌ها
======================================== */

function initialiseAnswers() {
  const stage = STAGES[stageIndex];

  if (stage.type === "flower") {
    flowerMainAnswers = Array(39).fill(null);
    flowerCopyAnswers = Array(18).fill(null);

    mainAnswers = [];
    copyAnswers = [];

    return;
  }

  mainAnswers = Array(stage.pattern.length).fill(null);
  copyAnswers = Array(stage.pattern.length).fill(null);

  flowerMainAnswers = Array(39).fill(null);
  flowerCopyAnswers = Array(18).fill(null);
}

/* ========================================
   خانه‌های رنگی تمرین سیزدهم
======================================== */

function createFlowerCell(row, col, boardName) {
  const cell = document.createElement("button");

  cell.type = "button";
  cell.className = "cell flower-cell";

  let expected;
  let answerIndex;
  let fixed = false;
  let actual = null;

  if (boardName === "main") {
    expected = FLOWER_EXPECTED[row][col];

    if (col < 8) {
      fixed = true;
      actual = expected;
    } else {
      answerIndex = row * 13 + (col - 8);
      actual = flowerMainAnswers[answerIndex];
    }
  } else {
    expected = FLOWER_COPY_EXPECTED[row][col];
    answerIndex = row * 6 + col;
    actual = flowerCopyAnswers[answerIndex];
  }

  if (fixed) {
    cell.classList.add("fixed-cell");
    cell.disabled = true;
  } else {
    cell.classList.add("answer-cell");

    cell.setAttribute(
      "aria-label",
      `ردیف ${row + 1}، ستون ${col + 1}`
    );

    cell.addEventListener("click", () => {
      if (eraseMode) {
        if (boardName === "main") {
          flowerMainAnswers[answerIndex] = null;
        } else {
          flowerCopyAnswers[answerIndex] = null;
        }
      } else {
        if (boardName === "main") {
          flowerMainAnswers[answerIndex] =
            selectedFlowerColor;
        } else {
          flowerCopyAnswers[answerIndex] =
            selectedFlowerColor;
        }

        playTone(590, 0.06);
      }

      renderFlowerStage();
    });
  }

  if (actual) {
    cell.style.backgroundColor =
      typeof actual === "string" &&
      actual.startsWith("#")
        ? actual
        : COLORS[actual];
  } else {
    cell.style.backgroundColor = "#ffffff";
  }

  return cell;
}

/* ========================================
   رسم جدول اصلی و جدول تکرار گل
======================================== */

function renderFlowerStage() {
  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");

  mainBoard.innerHTML = "";
  copyBoard.innerHTML = "";

  mainBoard.classList.add("flower-main");
  copyBoard.classList.add("flower-copy");

  mainBoard.style.setProperty("--columns", 21);
  copyBoard.style.setProperty("--columns", 6);

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 21; col++) {
      mainBoard.appendChild(
        createFlowerCell(row, col, "main")
      );
    }
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      copyBoard.appendChild(
        createFlowerCell(row, col, "copy")
      );
    }
  }
}

/* ========================================
   نمایش مرحله
======================================== */

function renderStage() {
  const stage = STAGES[stageIndex];

  $("stageLabel").textContent =
    `تمرین ${stageIndex + 1} از ${STAGES.length}`;

  $("stageTitle").textContent = stage.title;

  $("stageInstruction").textContent = "";
  $("patternLegend").textContent = "";

  $("mainLabel").textContent =
    stage.type === "flower"
      ? "الگو را در خانه‌های بعدی ادامه بده."
      : "نام دانش‌آموز: الگو را ادامه بده.";

  $("copyLabel").textContent =
    stage.type === "flower"
      ? "الگوی رئیس را در جدول پایین یک بار تکرار کن."
      : "یک بار الگوی رئیس را تکرار کن";

  $("prevButton").disabled = stageIndex === 0;

  $("nextButton").textContent =
    stageIndex === STAGES.length - 1
      ? "پایان بازی 🏆"
      : "مرحلهٔ بعد ▶";

  $("feedback").textContent = "";

  $("mainBoard").classList.remove(
    "flower-main"
  );

  $("copyBoard").classList.remove(
    "flower-copy"
  );

  if (stage.type === "flower") {
    renderFlowerPalette();
    renderFlowerStage();
  } else {
    renderPalette();
    renderBoards();
  }
}

/* ========================================
   شروع بازی
======================================== */

function startGame() {
  const name = $("studentName").value.trim();

  if (!name) {
    $("studentName").focus();

    $("studentName").setCustomValidity(
      "لطفاً نام دانش‌آموز را بنویس."
    );

    $("studentName").reportValidity();
    $("studentName").setCustomValidity("");

    return;
  }

  stageIndex = 0;
  selectedItem = ITEMS[0];
  selectedFlowerColor = COLORS.green;
  eraseMode = false;

  $("eraserButton").textContent = "پاک‌کن 🧽";

  initialiseAnswers();

  $("welcome").classList.add("hidden");
  $("finish").classList.add("hidden");
  $("game").classList.remove("hidden");

  renderStage();
}

/* ========================================
   بررسی پاسخ‌ها
======================================== */

function isFlowerCorrect() {
  // بررسی ۳۹ خانهٔ قابل پاسخ در جدول اصلی
  for (let row = 0; row < 3; row++) {
    for (let col = 8; col < 21; col++) {
      const answerIndex = row * 13 + (col - 8);
      const expected = FLOWER_EXPECTED[row][col];
      const actual = flowerMainAnswers[answerIndex];

      if (expected === null) {
        if (actual !== null) return false;
      } else {
        if (actual !== COLORS[expected]) return false;
      }
    }
  }

  // بررسی همهٔ ۱۸ خانهٔ جدول پایین
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      const answerIndex = row * 6 + col;
      const expected = FLOWER_COPY_EXPECTED[row][col];
      const actual = flowerCopyAnswers[answerIndex];

      if (expected === null) {
        if (actual !== null) return false;
      } else {
        if (actual !== COLORS[expected]) return false;
      }
    }
  }

  return true;
}

function isCorrect() {
  const stage = STAGES[stageIndex];

  if (stage.type === "flower") {
    return isFlowerCorrect();
  }

  const expectedMain = stage.pattern;
  const expectedCopy = stage.pattern;

  const mainCorrect =
    mainAnswers.length === expectedMain.length &&
    mainAnswers.every((value, index) =>
      sameItem(value, expectedMain[index])
    );

  const copyCorrect =
    copyAnswers.length === expectedCopy.length &&
    copyAnswers.every((value, index) =>
      sameItem(value, expectedCopy[index])
    );

  return mainCorrect && copyCorrect;
}

/* ========================================
   فشفشهٔ رنگی
======================================== */

function showFireworks() {
  const container = $("fireworks");

  container.innerHTML = "";
  container.classList.remove("hidden");

  const colors = [
    "#ef5350",
    "#42a5f5",
    "#58c86b",
    "#ffd84d",
    "#ab78e8",
    "#ff75b5"
  ];

  for (let burst = 0; burst < 5; burst++) {
    const centerX = 12 + Math.random() * 76;
    const centerY = 15 + Math.random() * 65;

    for (let i = 0; i < 24; i++) {
      const particle = document.createElement("span");

      const angle = Math.PI * 2 * i / 24;
      const distance = 70 + Math.random() * 150;

      particle.className = "firework-particle";

      particle.style.left = `${centerX}%`;
      particle.style.top = `${centerY}%`;

      particle.style.background =
        colors[
          Math.floor(Math.random() * colors.length)
        ];

      particle.style.setProperty(
        "--dx",
        `${Math.cos(angle) * distance}px`
      );

      particle.style.setProperty(
        "--dy",
        `${Math.sin(angle) * distance}px`
      );

      particle.style.animationDelay =
        `${burst * 0.16}s`;

      container.appendChild(particle);
    }
  }

  clearTimeout(fireworksTimer);

  fireworksTimer = setTimeout(() => {
    container.classList.add("hidden");
    container.innerHTML = "";
  }, 2600);

  playTone(660, 0.12);

  setTimeout(() => playTone(830, 0.14), 130);
  setTimeout(() => playTone(990, 0.18), 270);
}

function checkAnswers() {
  if (isCorrect()) {
    $("feedback").textContent = "آفرین! همهٔ پاسخ‌ها درست هستند. 🌟";
    showFireworks();
  } else {
    $("feedback").textContent =
      "یک بار دیگر با دقت الگو را بررسی کن. 💚";

    playTone(220, 0.12);
  }
}

/* ========================================
   پاک کردن پاسخ‌ها
======================================== */

function clearAnswers() {
  initialiseAnswers();

  $("feedback").textContent = "";

  const stage = STAGES[stageIndex];

  if (stage.type === "flower") {
    renderFlowerStage();
  } else {
    renderBoards();
  }
}

/* ========================================
   جابه‌جایی میان مراحل
======================================== */

function nextStage() {
  if (stageIndex < STAGES.length - 1) {
    stageIndex++;

    initialiseAnswers();
    renderStage();

    return;
  }

  finishGame();
}

function previousStage() {
  if (stageIndex > 0) {
    stageIndex--;

    initialiseAnswers();
    renderStage();
  }
}

/* ========================================
   پایان و شروع دوباره
======================================== */

function finishGame() {
  $("game").classList.add("hidden");
  $("finish").classList.remove("hidden");

  const name = $("studentName").value.trim();

  $("finishMessage").textContent =
    `${name} جان، به پایان ${STAGES.length} تمرین رسیدی!`;
}

function restartGame() {
  $("finish").classList.add("hidden");
  $("welcome").classList.remove("hidden");

  $("stageLabel").textContent = "آمادهٔ شروع";
}

/* ========================================
   رویدادهای دکمه‌ها
======================================== */

$("startButton").addEventListener(
  "click",
  startGame
);

$("studentName").addEventListener(
  "keydown",
  event => {
    if (event.key === "Enter") {
      startGame();
    }
  }
);

$("eraserButton").addEventListener(
  "click",
  () => {
    eraseMode = !eraseMode;

    $("eraserButton").textContent =
      eraseMode
        ? "پاک‌کن فعال است ✓"
        : "پاک‌کن 🧽";

    const stage = STAGES[stageIndex];

    if (stage && stage.type === "flower") {
      renderFlowerPalette();
    } else {
      renderPalette();
    }
  }
);

$("clearButton").addEventListener(
  "click",
  clearAnswers
);

$("checkButton").addEventListener(
  "click",
  checkAnswers
);

$("nextButton").addEventListener(
  "click",
  nextStage
);

$("prevButton").addEventListener(
  "click",
  previousStage
);

$("restartButton").addEventListener(
  "click",
  restartGame
);

renderPalette();
