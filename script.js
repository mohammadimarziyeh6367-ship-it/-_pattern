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
  yellow: "#ffd84d"
};

/* فقط چهار رنگ و چهار شکل انتخابی */
const ITEMS = [
  { shape: "circle", color: COLORS.red, name: "دایره قرمز" },
  { shape: "square", color: COLORS.blue, name: "مربع آبی" },
  { shape: "triangle", color: COLORS.green, name: "مثلث سبز" },
  { shape: "star", color: COLORS.yellow, name: "ستاره زرد" }
];

const C = ITEMS[0];
const S = ITEMS[1];
const T = ITEMS[2];
const Y = ITEMS[3];

/* ========================================
   تمرین سه‌ردیفی گل
======================================== */

const FLOWER_EXPECTED = [
  Array.from({ length: 21 }, (_, c) =>
    c % 2 === 0 ? "green" : null
  ),
  Array.from({ length: 21 }, (_, c) =>
    [null, "green", null, "red"][c % 4]
  ),
  Array.from({ length: 21 }, (_, c) =>
    c % 2 === 0 ? "green" : null
  )
];

const FLOWER_COPY_EXPECTED = [
  ["green", null, "green", null, "green", null],
  [null, "green", null, "red", null, "green"],
  ["green", null, "green", null, "green", null]
];

/* ========================================
   فهرست تمرین‌ها
======================================== */

const STAGES = [
  {
    title: "الگوی دوشکلی",
    pattern: [C, S],
    repeats: 2,
    mainColumns: 12,
    fixedItems: [C, S, C, S],
    copyColumns: 6
  },
  {
    title: "الگوی رنگی",
    pattern: [T, T, Y, Y],
    repeats: 2
  },
  {
    title: "الگوی سه‌شکلی",
    pattern: [C, S, T],
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
    pattern: [T, C, T, C],
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
    pattern: [C, C, S],
    repeats: 3
  },
  {
    title: "الگوی قرمز و آبی",
    pattern: [C, S, C, S],
    repeats: 2
  },
  {
    title: "الگوی سه رنگ",
    pattern: [C, T, Y],
    repeats: 3
  },
  {
    title: "الگوی پایانی",
    pattern: [T, S, C, Y],
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

let audioContext = null;
let fireworksTimer = null;

/* ========================================
   ابزارهای کمکی
======================================== */

function cloneItem(value) {
  return value ? { ...value } : null;
}

function sameItem(a, b) {
  return Boolean(a && b) &&
    a.shape === b.shape &&
    a.color === b.color;
}

function shapeHTML(value) {
  if (!value) return "";

  if (value.shape === "star") {
    return `<span class="shape star"
      style="color:${value.color}">★</span>`;
  }

  if (value.shape === "triangle") {
    return `<span class="shape triangle"
      style="border-bottom-color:${value.color}"></span>`;
  }

  return `<span class="shape ${value.shape}"
      style="background:${value.color}"></span>`;
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
    // بازی بدون صدا نیز اجرا می‌شود.
  }
}

/* ========================================
   انتخاب شکل‌ها
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

    button.title = value.name;
    button.setAttribute("aria-label", value.name);
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

function renderFlowerPalette() {
  const palette = $("palette");
  palette.innerHTML = "";

  [
    { name: "سبز", color: COLORS.green },
    { name: "قرمز", color: COLORS.red }
  ].forEach(option => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-button flower-color-button";

    button.classList.toggle(
      "selected",
      !eraseMode && selectedFlowerColor === option.color
    );

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
   تمرین‌های معمولی
======================================== */

function getMainPattern(stage) {
  if (stage.fixedItems) {
    return stage.fixedItems.map(cloneItem);
  }

  const result = [];

  for (let i = 0; i < stage.repeats; i++) {
    stage.pattern.forEach(value => {
      result.push(cloneItem(value));
    });
  }

  return result;
}

function initialiseAnswers() {
  const stage = STAGES[stageIndex];

  if (stage.type === "flower") {
    flowerMainAnswers = Array(39).fill(null);
    flowerCopyAnswers = Array(18).fill(null);
    mainAnswers = [];
    copyAnswers = [];
    return;
  }

  const mainPattern = getMainPattern(stage);

  const mainCount = stage.mainColumns || mainPattern.length + 6;
  const copyCount = stage.copyColumns || 6;

  mainAnswers = Array(
    Math.max(0, mainCount - mainPattern.length)
  ).fill(null);

  copyAnswers = Array(copyCount).fill(null);

  flowerMainAnswers = Array(39).fill(null);
  flowerCopyAnswers = Array(18).fill(null);
}

function createRegularCell(value, index, fixed, boardName) {
  const cell = document.createElement("button");

  cell.type = "button";
  cell.className = "cell";

  if (fixed) {
    cell.classList.add("fixed-cell");
    cell.disabled = true;
  } else {
    cell.classList.add("answer-cell");

    cell.addEventListener("click", () => {
      const answers =
        boardName === "main" ? mainAnswers : copyAnswers;

      if (eraseMode) {
        answers[index] = null;
      } else {
        answers[index] = cloneItem(selectedItem);
        playTone(590, 0.06);
      }

      renderBoards();
    });
  }

  cell.innerHTML = shapeHTML(value);
  return cell;
}

function renderRegularBoard(container, values, fixedCount, boardName) {
  container.innerHTML = "";
  container.style.setProperty("--columns", values.length);

  values.forEach((value, index) => {
    container.appendChild(
      createRegularCell(
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

  if (stage.type === "flower") return;

  const fixedMain = getMainPattern(stage);

  const fullMain = [
    ...fixedMain,
    ...mainAnswers.map(cloneItem)
  ];

  renderRegularBoard(
    $("mainBoard"),
    fullMain,
    fixedMain.length,
    "main"
  );

  renderRegularBoard(
    $("copyBoard"),
    copyAnswers.map(cloneItem),
    0,
    "copy"
  );
}

/* ========================================
   تمرین سیزدهم: جدول سه‌ردیفی
======================================== */

function createFlowerCell(row, col, boardName) {
  const cell = document.createElement("button");

  cell.type = "button";
  cell.className = "cell flower-cell";

  let expected;
  let actual;
  let fixed = false;
  let answerIndex;

  if (boardName === "main") {
    expected = FLOWER_EXPECTED[row][col];

    if (col < 8) {
      fixed = true;
      actual = expected;
    } else {
      answerIndex = row * 13 + col - 8;
      actual = flowerMainAnswers[answerIndex];
    }
  } else {
    expected = FLOWER_COPY_EXPECTED[row][col];
    answerIndex = row * 6 + col;
    actual = flowerCopyAnswers[answerIndex];
  }

  if (fixed) {
    cell.disabled = true;
    cell.classList.add("fixed-cell");
  } else {
    cell.classList.add("answer-cell");

    cell.addEventListener("click", () => {
      const answers =
        boardName === "main"
          ? flowerMainAnswers
          : flowerCopyAnswers;

      answers[answerIndex] = eraseMode
        ? null
        : selectedFlowerColor;

      if (!eraseMode) playTone(590, 0.06);

      renderFlowerStage();
    });
  }

  if (actual) {
    cell.style.backgroundColor =
      actual.startsWith("#") ? actual : COLORS[actual];
  } else {
    cell.style.backgroundColor = "#ffffff";
  }

  return cell;
}

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
      : "الگوی اصلی را ادامه بده.";

  $("copyLabel").textContent =
    stage.type === "flower"
      ? "الگوی رئیس را در جدول پایین یک بار تکرار کن."
      : "الگوی رئیس را یک بار تکرار کن.";

  $("prevButton").disabled = stageIndex === 0;

  $("nextButton").textContent =
    stageIndex === STAGES.length - 1
      ? "پایان بازی 🏆"
      : "مرحلهٔ بعد ▶";

  $("feedback").textContent = "";

  $("mainBoard").classList.remove("flower-main");
  $("copyBoard").classList.remove("flower-copy");

  if (stage.type === "flower") {
    renderFlowerPalette();
    renderFlowerStage();
  } else {
    renderPalette();
    renderBoards();
  }
}

/* ========================================
   بررسی پاسخ‌ها
======================================== */

function isFlowerCorrect() {
  for (let row = 0; row < 3; row++) {
    for (let col = 8; col < 21; col++) {
      const index = row * 13 + col - 8;
      const expected = FLOWER_EXPECTED[row][col];
      const actual = flowerMainAnswers[index];

      if (expected === null) {
        if (actual !== null) return false;
      } else if (actual !== COLORS[expected]) {
        return false;
      }
    }
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      const index = row * 6 + col;
      const expected = FLOWER_COPY_EXPECTED[row][col];
      const actual = flowerCopyAnswers[index];

      if (expected === null) {
        if (actual !== null) return false;
      } else if (actual !== COLORS[expected]) {
        return false;
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
   فشفشه
======================================== */

function showFireworks() {
  const container = $("fireworks");

  container.innerHTML = "";
  container.classList.remove("hidden");

  const colors = [
    COLORS.red,
    COLORS.blue,
    COLORS.green,
    COLORS.yellow
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
        colors[Math.floor(Math.random() * colors.length)];

      particle.style.setProperty(
        "--dx",
        `${Math.cos(angle) * distance}px`
      );

      particle.style.setProperty(
        "--dy",
        `${Math.sin(angle) * distance}px`
      );

      particle.style.animationDelay = `${burst * 0.16}s`;

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
    $("feedback").textContent =
      "آفرین! همهٔ پاسخ‌ها درست هستند. 🌟";

    showFireworks();
  } else {
    $("feedback").textContent =
      "دوباره تلاش کن و الگو را با دقت ادامه بده. 💚";

    playTone(220, 0.12);
  }
}

/* ========================================
   پاک کردن و جابه‌جایی
======================================== */

function clearAnswers() {
  initialiseAnswers();
  $("feedback").textContent = "";

  if (STAGES[stageIndex].type === "flower") {
    renderFlowerStage();
  } else {
    renderBoards();
  }
}

function nextStage() {
  if (stageIndex < STAGES.length - 1) {
    stageIndex++;
    initialiseAnswers();
    renderStage();
  } else {
    finishGame();
  }
}

function previousStage() {
  if (stageIndex > 0) {
    stageIndex--;
    initialiseAnswers();
    renderStage();
  }
}

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

function finishGame() {
  $("game").classList.add("hidden");
  $("finish").classList.remove("hidden");

  $("finishMessage").textContent =
    `${$("studentName").value.trim()} جان، به پایان ${STAGES.length} تمرین رسیدی!`;
}

function restartGame() {
  $("finish").classList.add("hidden");
  $("welcome").classList.remove("hidden");

  $("stageLabel").textContent = "آمادهٔ شروع";
}

/* ========================================
   دکمه‌ها
======================================== */

$("startButton").addEventListener("click", startGame);

$("studentName").addEventListener("keydown", event => {
  if (event.key === "Enter") startGame();
});

$("eraserButton").addEventListener("click", () => {
  eraseMode = !eraseMode;

  $("eraserButton").textContent =
    eraseMode ? "پاک‌کن فعال است ✓" : "پاک‌کن 🧽";

  if (STAGES[stageIndex].type === "flower") {
    renderFlowerPalette();
  } else {
    renderPalette();
  }
});

$("clearButton").addEventListener("click", clearAnswers);
$("checkButton").addEventListener("click", checkAnswers);
$("nextButton").addEventListener("click", nextStage);
$("prevButton").addEventListener("click", previousStage);
$("restartButton").addEventListener("click", restartGame);

renderPalette();
