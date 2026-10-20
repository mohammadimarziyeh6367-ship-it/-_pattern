"use strict";

const $ = id => document.getElementById(id);

const welcome = $("welcome");
const game = $("game");
const finish = $("finish");
const studentName = $("studentName");
const startButton = $("startButton");
const restartButton = $("restartButton");
const stageLabel = $("stageLabel");
const stageTitle = $("stageTitle");
const stageInstruction = $("stageInstruction");
const mainBoard = $("mainBoard");
const copyBoard = $("copyBoard");
const palette = $("palette");
const eraserButton = $("eraserButton");
const prevButton = $("prevButton");
const clearButton = $("clearButton");
const checkButton = $("checkButton");
const nextButton = $("nextButton");
const feedback = $("feedback");
const fireworks = $("fireworks");

const COLORS = {
  red: "#e53935",
  blue: "#1e88e5",
  green: "#43a047",
  yellow: "#fbc02d",
  purple: "#8e44ad"
};

const PALETTE_ITEMS = [
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" },
  { shape: "star", color: "yellow" },
  { shape: "circle", color: "purple" },
  { shape: "square", color: "red" },
  { shape: "triangle", color: "blue" },
  { shape: "star", color: "green" }
];

/*
  این‌ها هفت تمرین نمونه هستند.
  برای تطبیق کامل با همهٔ تمرین‌های کتاب،
  الگوهای واقعی کتاب باید به این بخش اضافه شوند.
*/
const stages = [
  {
    title: "تمرین ۱: الگوی یکی‌درمیان",
    pattern: [
      { shape: "circle", color: "red" },
      { shape: "square", color: "blue" }
    ],
    repeats: 3
  },
  {
    title: "تمرین ۲: دو تا و دو تا",
    pattern: [
      { shape: "circle", color: "green" },
      { shape: "circle", color: "green" },
      { shape: "square", color: "yellow" },
      { shape: "square", color: "yellow" }
    ],
    repeats: 2
  },
  {
    title: "تمرین ۳: الگوی سه‌تایی",
    pattern: [
      { shape: "circle", color: "purple" },
      { shape: "square", color: "blue" },
      { shape: "triangle", color: "green" }
    ],
    repeats: 2
  },
  {
    title: "تمرین ۴: تکرار رنگ‌ها",
    pattern: [
      { shape: "square", color: "yellow" },
      { shape: "square", color: "yellow" },
      { shape: "circle", color: "red" }
    ],
    repeats: 2
  },
  {
    title: "تمرین ۵: الگوی سبز",
    pattern: [
      { shape: "square", color: "green" },
      { shape: "square", color: "green" },
      { shape: "circle", color: "green" }
    ],
    repeats: 2
  },
  {
    title: "تمرین ۶: قرمز و آبی",
    pattern: [
      { shape: "circle", color: "blue" },
      { shape: "circle", color: "red" }
    ],
    repeats: 3
  },
  {
    title: "تمرین ۷: چهار شکل",
    pattern: [
      { shape: "square", color: "blue" },
      { shape: "circle", color: "red" },
      { shape: "triangle", color: "green" },
      { shape: "star", color: "yellow" }
    ],
    repeats: 2
  }
];

let currentStage = 0;
let currentName = "";
let selected = { ...PALETTE_ITEMS[0] };
let eraserMode = false;
let mainAnswers = [];
let copyAnswers = [];
let fireworksTimer = null;

function cloneItem(item) {
  return item
    ? { shape: item.shape, color: item.color }
    : null;
}

function sameItem(a, b) {
  if (!a || !b) {
    return !a && !b;
  }

  return a.shape === b.shape && a.color === b.color;
}

function repeatedPattern(pattern, count) {
  return Array.from(
    { length: count },
    () => pattern.map(cloneItem)
  ).flat();
}

function shapeHTML(item) {
  if (!item) {
    return "";
  }

  const color = COLORS[item.color] || COLORS.red;

  if (item.shape === "star") {
    return `
      <span
        class="shape star"
        style="--shape-color:${color};color:${color}"
      >★</span>
    `;
  }

  if (item.shape === "triangle") {
    return `
      <span
        class="shape triangle"
        style="--shape-color:${color};border-bottom-color:${color}"
      ></span>
    `;
  }

  return `
    <span
      class="shape ${item.shape}"
      style="background-color:${color}"
    ></span>
  `;
}

function renderPalette() {
  palette.innerHTML = "";

  PALETTE_ITEMS.forEach(item => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-button";

    if (!eraserMode && sameItem(item, selected)) {
      button.classList.add("selected");
    }

    button.setAttribute(
      "aria-label",
      `${item.color} ${item.shape}`
    );

    button.innerHTML = shapeHTML(item);

    button.addEventListener("click", () => {
      selected = cloneItem(item);
      eraserMode = false;

      renderPalette();
    });

    palette.appendChild(button);
  });

  eraserButton.classList.toggle("primary", eraserMode);
}

function makeCell(item, index, onClick, fixed = false) {
  const cell = document.createElement("button");

  cell.type = "button";
  cell.className = fixed
    ? "cell fixed-cell"
    : "cell";

  cell.dataset.index = String(index);
  cell.innerHTML = shapeHTML(item);

  cell.setAttribute(
    "aria-label",
    `خانه ${index + 1}`
  );

  if (fixed) {
    cell.disabled = true;
    cell.setAttribute(
      "aria-label",
      `خانهٔ ثابت ${index + 1}`
    );
  } else {
    cell.addEventListener("click", () => {
      onClick(index);
    });
  }

  return cell;
}

function renderBoard(
  container,
  answers,
  onClick,
  fixedCount = 0
) {
  container.innerHTML = "";

  answers.forEach((item, index) => {
    const fixed = index < fixedCount;

    container.appendChild(
      makeCell(item, index, onClick, fixed)
    );
  });
}

function initialiseStageAnswers() {
  const stage = stages[currentStage];
  const pattern = stage.pattern;

  const fixedPattern = repeatedPattern(
    pattern,
    stage.repeats
  );

  mainAnswers = [
    ...fixedPattern.map(cloneItem),
    ...Array(pattern.length).fill(null)
  ];

  copyAnswers = Array(pattern.length).fill(null);
}

function renderBoards() {
  const stage = stages[currentStage];

  const fixedCount =
    stage.pattern.length * stage.repeats;

  renderBoard(
    mainBoard,
    mainAnswers,
    index => {
      mainAnswers[index] = eraserMode
        ? null
        : cloneItem(selected);

      renderBoards();
      feedback.textContent = "";
      fireworks.classList.add("hidden");
    },
    fixedCount
  );

  renderBoard(
    copyBoard,
    copyAnswers,
    index => {
      copyAnswers[index] = eraserMode
        ? null
        : cloneItem(selected);

      renderBoards();
      feedback.textContent = "";
      fireworks.classList.add("hidden");
    }
  );
}

function renderStage() {
  const stage = stages[currentStage];

  stageLabel.textContent =
    `تمرین ${currentStage + 1} از ${stages.length}`;

  stageTitle.textContent = stage.title;

  stageInstruction.textContent =
    "الگوی رئیس را ببین؛ جدول بالا را کامل کن و سپس همان الگو را یک بار در جدول پایین تکرار کن.";

  $("mainLabel").textContent =
    "الگوی اصلی را ادامه بده";

  $("copyLabel").textContent =
    "الگوی رئیس را یک بار تکرار کن";

  feedback.textContent = "";
  fireworks.classList.add("hidden");

  renderPalette();
  renderBoards();

  prevButton.disabled = currentStage === 0;

  nextButton.textContent =
    currentStage === stages.length - 1
      ? "پایان بازی 🏆"
      : "مرحلهٔ بعد";
}

function startGame() {
  currentName =
    studentName.value.trim() || "دانش‌آموز";

  currentStage = 0;
  eraserMode = false;
  selected = { ...PALETTE_ITEMS[0] };

  initialiseStageAnswers();

  welcome.classList.add("hidden");
  finish.classList.add("hidden");
  game.classList.remove("hidden");

  renderStage();
}

function isCorrect() {
  const stage = stages[currentStage];

  const expectedMain = repeatedPattern(
    stage.pattern,
    stage.repeats + 1
  );

  const expectedCopy = stage.pattern.map(cloneItem);

  const mainCorrect = expectedMain.every(
    (item, index) =>
      sameItem(mainAnswers[index], item)
  );

  const copyCorrect = expectedCopy.every(
    (item, index) =>
      sameItem(copyAnswers[index], item)
  );

  return mainCorrect && copyCorrect;
}

function showFireworks() {
  fireworks.classList.remove("hidden");
  fireworks.innerHTML = "";

  if (fireworksTimer) {
    clearTimeout(fireworksTimer);
  }

  const colors = [
    "#ff1744",
    "#ff9100",
    "#ffea00",
    "#00e676",
    "#00b0ff",
    "#d500f9",
    "#ffffff"
  ];

  for (let burst = 0; burst < 5; burst++) {
    const centerX = 10 + Math.random() * 80;
    const centerY = 15 + Math.random() * 60;

    for (let i = 0; i < 24; i++) {
      const particle = document.createElement("span");

      particle.className = "firework-particle";

      const angle = (Math.PI * 2 * i) / 24;
      const distance = 70 + Math.random() * 150;

      particle.style.left = `${centerX}%`;
      particle.style.top = `${centerY}%`;

      particle.style.backgroundColor =
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
        `${burst * 0.12}s`;

      fireworks.appendChild(particle);
    }
  }

  fireworksTimer = setTimeout(() => {
    fireworks.classList.add("hidden");
    fireworks.innerHTML = "";
  }, 2600);
}

startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", () => {
  finish.classList.add("hidden");
  welcome.classList.remove("hidden");

  studentName.value = "";
  stageLabel.textContent = "آمادهٔ شروع";
});

eraserButton.addEventListener("click", () => {
  eraserMode = !eraserMode;
  renderPalette();
});

clearButton.addEventListener("click", () => {
  const stage = stages[currentStage];

  const fixedPattern = repeatedPattern(
    stage.pattern,
    stage.repeats
  );

  mainAnswers = [
    ...fixedPattern.map(cloneItem),
    ...Array(stage.pattern.length).fill(null)
  ];

  copyAnswers = Array(stage.pattern.length).fill(null);

  feedback.textContent = "";
  fireworks.classList.add("hidden");

  renderBoards();
});

checkButton.addEventListener("click", () => {
  if (isCorrect()) {
    showFireworks();
  } else {
    fireworks.classList.add("hidden");
    feedback.textContent = "";
  }
});

prevButton.addEventListener("click", () => {
  if (currentStage > 0) {
    currentStage--;
    initialiseStageAnswers();
    renderStage();
  }
});

nextButton.addEventListener("click", () => {
  if (currentStage < stages.length - 1) {
    currentStage++;
    initialiseStageAnswers();
    renderStage();
  } else {
    game.classList.add("hidden");
    finish.classList.remove("hidden");

    $("finishMessage").textContent =
      `${currentName}، تمرین‌ها به پایان رسیدند.`;

    stageLabel.textContent = "پایان بازی";
  }
});

window.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    fireworks.classList.add("hidden");
  }
});
