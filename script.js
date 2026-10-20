"use strict";

/* ========================================
   الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
======================================== */

const $ = id => document.getElementById(id);

const COLORS = {
  red: "#ef5350",
  blue: "#42a5f5",
  green: "#43b96b",
  yellow: "#ffd54f"
};

const ITEMS = [
  { id: "redCircle", color: "red", shape: "circle" },
  { id: "blueSquare", color: "blue", shape: "square" },
  { id: "greenTriangle", color: "green", shape: "triangle" },
  { id: "yellowStar", color: "yellow", shape: "star" }
];

const C = ITEMS[0];
const S = ITEMS[1];
const T = ITEMS[2];
const Y = ITEMS[3];

const FLOWER_STAGE = {
  id: "flower",
  title: "الگوی سه‌ردیفی گل",
  instruction: "خانه‌های خالی را با دقت کامل کن و الگوی رئیس را هم تکرار کن.",
  type: "flower",
  columns: 21,
  rows: 3,
  fixedColumns: 8
};

/*
  دوازده تمرین اصلی و تمرین سیزدهم.
  در تمرین اول، ۱۲ خانه در جدول اصلی داریم:
  ۴ خانهٔ ثابت و ۸ خانه برای ادامهٔ الگو.
*/

const STAGES = [
  {
    title: "الگوی دوشکلی",
    instruction: "الگوی قرمز و آبی را ادامه بده.",
    pattern: [C, S],
    type: "twoShape",
    columns: 12,
    fixed: [C, S, C, S],
    mainAnswersCount: 8,
    copyColumns: 6
  },
  {
    title: "الگوی تکراری",
    instruction: "الگو را بخوان و ادامه بده.",
    pattern: [T, T, Y, Y],
    repeats: 2
  },
  {
    title: "الگوی سه‌شکلی",
    instruction: "ترتیب شکل‌ها را پیدا کن.",
    pattern: [T, S, C],
    repeats: 2
  },
  {
    title: "الگوی رنگی",
    instruction: "الگوی رنگ‌ها را ادامه بده.",
    pattern: [Y, Y, C],
    repeats: 2
  },
  {
    title: "الگوی یکی‌درمیان",
    instruction: "شکل‌ها را به ترتیب تکرار کن.",
    pattern: [S, C, S, C],
    repeats: 2
  },
  {
    title: "الگوی سبز و آبی",
    instruction: "الگو را پیدا کن و ادامه بده.",
    pattern: [T, S, T, S],
    repeats: 2
  },
  {
    title: "الگوی قرمز و زرد",
    instruction: "الگوی منظم را کامل کن.",
    pattern: [Y, C, Y, C],
    repeats: 2
  },
  {
    title: "الگوی چهارشکلی",
    instruction: "به ترتیب شکل‌ها توجه کن.",
    pattern: [S, C, T, Y],
    repeats: 2
  },
  {
    title: "الگوی تکرار سه‌تایی",
    instruction: "بخش تکرارشونده را پیدا کن.",
    pattern: [Y, Y, S],
    repeats: 3
  },
  {
    title: "الگوی قرمز و آبی",
    instruction: "الگو را بدون اشتباه ادامه بده.",
    pattern: [C, S, C, S],
    repeats: 2
  },
  {
    title: "الگوی سه‌تایی",
    instruction: "سه شکل را به ترتیب تکرار کن.",
    pattern: [C, T, Y],
    repeats: 3
  },
  {
    title: "الگوی چهاررنگی",
    instruction: "ترتیب رنگ‌ها را ادامه بده.",
    pattern: [T, S, C, Y],
    repeats: 2
  },

  FLOWER_STAGE
];

let currentStage = 0;
let studentName = "";
let selectedItem = null;
let eraseMode = false;
let mainAnswers = [];
let copyAnswers = [];
let flowerMainAnswers = [];
let flowerCopyAnswers = [];
let audioContext = null;
let fireworksTimer = null;

/* ---------- ابزارهای عمومی ---------- */

function cloneItem(item) {
  return item ? { ...item } : null;
}

function sameItem(a, b) {
  if (!a || !b) {
    return !a && !b;
  }

  return a.id === b.id;
}

function repeatPattern(pattern, count) {
  const result = [];

  for (let i = 0; i < count; i++) {
    pattern.forEach(item => result.push(cloneItem(item)));
  }

  return result;
}

function cyclePattern(pattern, count) {
  return Array.from(
    { length: count },
    (_, index) => cloneItem(pattern[index % pattern.length])
  );
}

function setVisible(id, visible) {
  const element = $(id);
  if (!element) return;

  element.classList.toggle("hidden", !visible);
}

/* ---------- صدا ---------- */

function playTone(frequency = 600, duration = 0.12) {
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
    // در صورت پشتیبانی‌نشدن صدا، بازی همچنان اجرا می‌شود.
  }
}

/* ---------- ساخت شکل ---------- */

function shapeHTML(item) {
  if (!item) return "";

  const color = COLORS[item.color] || "#999";

  return `
    <span
      class="shape ${item.shape}"
      style="--shape-color:${color}; background-color:${color}"
      aria-hidden="true"
    ></span>
  `;
}

/* ---------- انتخاب شکل ---------- */

function renderPalette() {
  const palette = $("palette");
  palette.innerHTML = "";

  ITEMS.forEach(item => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-item";
    button.dataset.item = item.id;
    button.setAttribute("aria-label", item.id);
    button.setAttribute("aria-pressed", "false");

    button.innerHTML = shapeHTML(item);

    button.addEventListener("click", () => {
      selectedItem = item;
      eraseMode = false;

      $("eraserButton").classList.remove("active");
      $("eraserButton").setAttribute("aria-pressed", "false");

      document.querySelectorAll(".palette-item").forEach(el => {
        const selected = el.dataset.item === item.id;

        el.classList.toggle("selected", selected);
        el.setAttribute("aria-pressed", String(selected));
      });

      playTone(550, 0.07);
    });

    palette.appendChild(button);
  });
}

/* ---------- ساخت خانه ---------- */

function makeCell(item, options = {}) {
  const cell = document.createElement("button");

  cell.type = "button";
  cell.className = "cell";

  if (options.fixed) {
    cell.classList.add("fixed");
    cell.disabled = true;
  } else {
    cell.classList.add("answer-cell");
  }

  cell.innerHTML = shapeHTML(item);

  if (options.label) {
    cell.setAttribute("aria-label", options.label);
  }

  if (options.onClick) {
    cell.addEventListener("click", options.onClick);
  }

  return cell;
}

function setupBoard(board, columns, rows = 1) {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${columns}, var(--cell-size, 42px))`;
  board.style.gridTemplateRows = `repeat(${rows}, var(--cell-size, 42px))`;
}

/* ---------- جدول تمرین‌های معمولی ---------- */

function getRegularData(stage) {
  if (stage.type === "twoShape") {
    return {
      fixed: stage.fixed.map(cloneItem),
      columns: stage.columns,
      answerCount: stage.mainAnswersCount,
      copyColumns: stage.copyColumns
    };
  }

  const fixed = repeatPattern(stage.pattern, stage.repeats);

  return {
    fixed,
    columns: fixed.length + stage.pattern.length,
    answerCount: stage.pattern.length,
    copyColumns: 6
  };
}

function renderRegularBoards(stage) {
  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");

  const data = getRegularData(stage);

  setupBoard(mainBoard, data.columns, 1);

  data.fixed.forEach((item, index) => {
    mainBoard.appendChild(
      makeCell(item, {
        fixed: true,
        label: `خانهٔ ثابت ${index + 1}`
      })
    );
  });

  for (let i = 0; i < data.answerCount; i++) {
    const index = i;

    mainBoard.appendChild(
      makeCell(mainAnswers[index], {
        label: `خانهٔ پاسخ ${index + 1}`,
        onClick: () => {
          putAnswer("main", index);
        }
      })
    );
  }

  setupBoard(copyBoard, data.copyColumns, 1);

  for (let i = 0; i < data.copyColumns; i++) {
    const index = i;

    copyBoard.appendChild(
      makeCell(copyAnswers[index], {
        label: `خانهٔ الگوی رئیس ${index + 1}`,
        onClick: () => {
          putAnswer("copy", index);
        }
      })
    );
  }

  $("mainLabel").textContent =
    stage.type === "twoShape"
      ? "الگوی اصلی را ادامه بده"
      : "الگو را ادامه بده";

  $("copyLabel").textContent =
    "الگوی رئیس را یک بار تکرار کن";
}

/* ---------- الگوی سه‌ردیفی گل ---------- */

function getFlowerExpectedMain(row, column) {
  if (row === 1) {
    return column % 2 === 0 ? T : null;
  }

  if (row === 0 || row === 2) {
    return column % 2 === 0 ? T : null;
  }

  return null;
}

/*
  در جدول گل:
  ردیف اول و سوم: سبز، خالی، سبز، خالی، ...
  ردیف دوم: خالی، سبز، خالی، قرمز، ...
  خانه‌های خالی باید واقعاً خالی بمانند.
*/

function expectedFlowerItem(row, column) {
  if (row === 0 || row === 2) {
    return column % 2 === 0 ? T : null;
  }

  const sequence = [null, T, null, C];
  return sequence[column % sequence.length];
}

function renderFlowerBoards() {
  const mainBoard = $("mainBoard");
  const copyBoard = $("copyBoard");

  const stage = FLOWER_STAGE;
  const columns = stage.columns;
  const rows = stage.rows;
  const fixedColumns = stage.fixedColumns;

  setupBoard(mainBoard, columns, rows);

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const index = row * columns + column;
      const expected = expectedFlowerItem(row, column);

      if (column < fixedColumns) {
        mainBoard.appendChild(
          makeCell(expected, {
            fixed: true,
            label: `ردیف ${row + 1} خانه ${column + 1}`
          })
        );
      } else {
        const answerIndex =
          row * (columns - fixedColumns) + (column - fixedColumns);

        mainBoard.appendChild(
          makeCell(flowerMainAnswers[answerIndex], {
            label: `ردیف ${row + 1} خانه ${column + 1}`,
            onClick: () => putAnswer("flowerMain", answerIndex)
          })
        );
      }
    }
  }

  setupBoard(copyBoard, 6, 3);

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 6; column++) {
      const index = row * 6 + column;

      copyBoard.appendChild(
        makeCell(flowerCopyAnswers[index], {
          label: `الگوی رئیس ردیف ${row + 1} خانه ${column + 1}`,
          onClick: () => putAnswer("flowerCopy", index)
        })
      );
    }
  }

  $("mainLabel").textContent = "الگوی سه‌ردیفی را کامل کن";
  $("copyLabel").textContent = "الگوی رئیس را در هر سه ردیف تکرار کن";
}

/* ---------- آماده‌سازی پاسخ‌ها ---------- */

function initialiseAnswers() {
  const stage = STAGES[currentStage];

  mainAnswers = [];
  copyAnswers = [];
  flowerMainAnswers = [];
  flowerCopyAnswers = [];

  if (stage.type === "flower") {
    const answerCount =
      (stage.columns - stage.fixedColumns) * stage.rows;

    flowerMainAnswers = Array(answerCount).fill(null);
    flowerCopyAnswers = Array(18).fill(null);
  } else {
    const data = getRegularData(stage);

    mainAnswers = Array(data.answerCount).fill(null);
    copyAnswers = Array(data.copyColumns).fill(null);
  }
}

/* ---------- نمایش تمرین ---------- */

function renderStage() {
  const stage = STAGES[currentStage];

  $("stageLabel").textContent =
    `تمرین ${currentStage + 1} از ${STAGES.length}`;

  $("stageTitle").textContent = stage.title;
  $("stageInstruction").textContent = stage.instruction;

  $("progressBar").style.width =
    `${((currentStage + 1) / STAGES.length) * 100}%`;

  $("prevButton").disabled = currentStage === 0;

  $("nextButton").textContent =
    currentStage === STAGES.length - 1
      ? "پایان بازی"
      : "مرحله بعدی";

  $("feedback").textContent = "";
  $("feedback").className = "feedback";

  if (stage.type === "flower") {
    renderFlowerBoards();
  } else {
    renderRegularBoards(stage);
  }

  renderPalette();
}

/* ---------- شروع بازی ---------- */

function startGame() {
  studentName = $("studentName").value.trim();

  if (!studentName) {
    $("studentName").focus();
    $("studentName").placeholder = "اول نامت را بنویس!";
    return;
  }

  currentStage = 0;

  $("studentGreeting").textContent =
    `موفق باشی، ${studentName}!`;

  setVisible("welcome", false);
  setVisible("finish", false);
  setVisible("game", true);

  initialiseAnswers();
  renderStage();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- قرار دادن پاسخ ---------- */

function putAnswer(boardType, index) {
  let target;

  if (boardType === "main") {
    target = mainAnswers;
  } else if (boardType === "copy") {
    target = copyAnswers;
  } else if (boardType === "flowerMain") {
    target = flowerMainAnswers;
  } else if (boardType === "flowerCopy") {
    target = flowerCopyAnswers;
  } else {
    return;
  }

  if (eraseMode) {
    target[index] = null;
  } else if (selectedItem) {
    target[index] = cloneItem(selectedItem);
  } else {
    $("feedback").textContent =
      "اول شکل یا رنگ موردنظرت را انتخاب کن.";
    $("feedback").className = "feedback error";
    playTone(260, 0.12);
    return;
  }

  $("feedback").textContent = "";
  $("feedback").className = "feedback";

  playTone(450, 0.06);

  const stage = STAGES[currentStage];

  if (stage.type === "flower") {
    renderFlowerBoards();
  } else {
    renderRegularBoards(stage);
  }
}

/* ---------- پاسخ درست ---------- */

function regularAnswersCorrect(stage) {
  const data = getRegularData(stage);

  for (let i = 0; i < mainAnswers.length; i++) {
    const expected =
      stage.pattern[i % stage.pattern.length];

    if (!sameItem(mainAnswers[i], expected)) {
      return false;
    }
  }

  for (let i = 0; i < copyAnswers.length; i++) {
    const expected =
      stage.pattern[i % stage.pattern.length];

    if (!sameItem(copyAnswers[i], expected)) {
      return false;
    }
  }

  return (
    mainAnswers.length === data.answerCount &&
    copyAnswers.length === data.copyColumns
  );
}

function flowerAnswersCorrect() {
  const stage = FLOWER_STAGE;
  const answerColumns = stage.columns - stage.fixedColumns;

  for (let row = 0; row < stage.rows; row++) {
    for (let column = stage.fixedColumns;
         column < stage.columns;
         column++) {

      const index =
        row * answerColumns + (column - stage.fixedColumns);

      const expected = expectedFlowerItem(row, column);

      if (!sameItem(flowerMainAnswers[index], expected)) {
        return false;
      }
    }
  }

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 6; column++) {
      const index = row * 6 + column;
      const expected = expectedFlowerItem(row, column);

      if (!sameItem(flowerCopyAnswers[index], expected)) {
        return false;
      }
    }
  }

  return true;
}

function isCorrect() {
  const stage = STAGES[currentStage];

  if (stage.type === "flower") {
    return flowerAnswersCorrect();
  }

  return regularAnswersCorrect(stage);
}

/* ---------- فشفشه ---------- */

function showFireworks() {
  const container = $("fireworks");

  if (fireworksTimer) {
    clearTimeout(fireworksTimer);
  }

  container.innerHTML = "";
  container.classList.remove("hidden");

  const colors = [
    "#ef5350",
    "#42a5f5",
    "#43b96b",
    "#ffd54f",
    "#ab78df"
  ];

  for (let burst = 0; burst < 7; burst++) {
    const centerX = 10 + Math.random() * 80;
    const centerY = 15 + Math.random() * 60;

    for (let i = 0; i < 18; i++) {
      const particle = document.createElement("span");
      const angle = (Math.PI * 2 * i) / 18;
      const distance = 45 + Math.random() * 100;

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

      container.appendChild(particle);
    }
  }

  playTone(660, 0.18);
  setTimeout(() => playTone(880, 0.2), 150);

  fireworksTimer = setTimeout(() => {
    container.classList.add("hidden");
    container.innerHTML = "";
  }, 1500);
}

/* ---------- بررسی پاسخ ---------- */

function checkAnswers() {
  if (isCorrect()) {
    $("feedback").textContent =
      `آفرین ${studentName}! همهٔ پاسخ‌ها درست هستند! 🎉`;

    $("feedback").className = "feedback success";

    showFireworks();
  } else {
    $("feedback").textContent =
      "هنوز همهٔ پاسخ‌ها درست نیستند. الگو را دوباره با دقت بخوان. 🌱";

    $("feedback").className = "feedback error";

    playTone(280, 0.18);
  }
}

/* ---------- پاک‌کردن پاسخ‌ها ---------- */

function clearAnswers() {
  initialiseAnswers();
  selectedItem = null;
  eraseMode = false;

  $("eraserButton").classList.remove("active");
  $("eraserButton").setAttribute("aria-pressed", "false");

  $("feedback").textContent = "";
  $("feedback").className = "feedback";

  renderStage();
}

/* ---------- رفتن به مرحله بعد ---------- */

function nextStage() {
  if (currentStage < STAGES.length - 1) {
    currentStage++;
    initialiseAnswers();
    renderStage();

    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    finishGame();
  }
}

/* ---------- رفتن به مرحله قبل ---------- */

function previousStage() {
  if (currentStage > 0) {
    currentStage--;
    initialiseAnswers();
    renderStage();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* ---------- پایان بازی ---------- */

function finishGame() {
  setVisible("game", false);
  setVisible("welcome", false);
  setVisible("finish", true);

  $("finishMessage").textContent =
    `آفرین ${studentName}! تو همهٔ ${STAGES.length} تمرین را پشت سر گذاشتی.`;

  showFireworks();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- خروج از بازی ---------- */

function exitGame() {
  const confirmed = window.confirm(
    "می‌خواهی از بازی خارج شوی و به صفحهٔ شروع برگردی؟"
  );

  if (!confirmed) return;

  if (fireworksTimer) {
    clearTimeout(fireworksTimer);
    fireworksTimer = null;
  }

  $("fireworks").classList.add("hidden");
  $("fireworks").innerHTML = "";

  setVisible("game", false);
  setVisible("finish", false);
  setVisible("welcome", true);

  selectedItem = null;
  eraseMode = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- راه‌اندازی ---------- */

$("startButton").addEventListener("click", startGame);

$("studentName").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    startGame();
  }
});

$("checkButton").addEventListener("click", checkAnswers);

$("clearButton").addEventListener("click", clearAnswers);

$("nextButton").addEventListener("click", nextStage);

$("prevButton").addEventListener("click", previousStage);

$("exitButton").addEventListener("click", exitGame);

$("restartButton").addEventListener("click", () => {
  currentStage = 0;
  selectedItem = null;
  eraseMode = false;

  setVisible("finish", false);
  setVisible("game", false);
  setVisible("welcome", true);

  $("studentName").value = "";

  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("eraserButton").addEventListener("click", () => {
  eraseMode = !eraseMode;
  selectedItem = null;

  $("eraserButton").classList.toggle("active", eraseMode);
  $("eraserButton").setAttribute(
    "aria-pressed",
    String(eraseMode)
  );

  document.querySelectorAll(".palette-item").forEach(button => {
    button.classList.remove("selected");
    button.setAttribute("aria-pressed", "false");
  });
});
