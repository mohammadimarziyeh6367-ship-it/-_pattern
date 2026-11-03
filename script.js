// script.js
"use strict";

const $ = id => document.getElementById(id);

const COLORS = {
  R: "#ef5350",
  B: "#42a5f5",
  G: "#43b96b",
  Y: "#ffd54f",
  P: "#ab70df",
  O: "#ff9f43"
};

const SHAPES = {
  C: { cls: "circle", color: COLORS.R },
  S: { cls: "square", color: COLORS.B },
  T: { cls: "triangle", color: COLORS.G },
  Y: { cls: "star", color: COLORS.Y }
};

const YELLOW_U = "YELLOW_U";

const STAGES = [
  {
    title: "الگوی شکل‌ها",
    instruction: "الگو را با توجه به شکل‌ها ادامه بده.",
    pattern: ["C", "S"],
    columns: 12, fixed: 4, copy: 6,
    palette: ["C", "S"]
  },
  {
    title: "الگوی رنگ‌ها",
    instruction: "الگو را ادامه بده و یک بار الگوی رئیس را در پایین تکرار کن.",
    pattern: ["G", "G", "R", "R", "R"],
    columns: 15, fixed: 8, copy: 10,
    palette: ["G", "R"]
  },
  {
    title: "الگوی قرمز و آبی",
    instruction: "ترتیب رنگ‌ها را پیدا کن و ادامه بده.",
    pattern: ["R", "B"],
    columns: 12, fixed: 4, copy: 6,
    palette: ["R", "B"]
  },
  {
    title: "الگوی مورّب",
    instruction: "الگوی رنگ‌ها را کامل کن.",
    pattern: ["Y", "G"],
    columns: 12, fixed: 4, copy: 4,
    palette: ["Y", "G"],
    diagonal: true
  },
  {
    title: "مسیر الگو",
    instruction: "مسیر الگو را در خانه‌ها رسم کن.",
    type: "edge",
    columns: 12, fixed: 6, copy: 3,
    palette: []
  },
  {
    title: "الگوی زرد",
    instruction: "جای خالی‌ها را با الگوی زرد کامل کن.",
    pattern: [null, YELLOW_U, null, YELLOW_U],
    columns: 16, fixed: 4, copy: 8,
    palette: [YELLOW_U]
  },
  {
    title: "موش کوچولو",
    instruction: "موش را روی شکل ناهماهنگ ببر تا آن را بخورد.",
    type: "mouse",
    pattern: ["C", "S"],
    columns: 10, wrongIndex: 5,
    palette: []
  },
  {
    title: "الگوی بنفش و نارنجی",
    instruction: "الگو را ادامه بده و یک بار در پایین تکرار کن.",
    pattern: ["P", "O"],
    columns: 12, fixed: 4, copy: 6,
    palette: ["P", "O"]
  },
  {
    title: "الگوی دوتایی",
    instruction: "به تکرار رنگ‌ها توجه کن.",
    pattern: ["O", "O", "P"],
    columns: 12, fixed: 6, copy: 6,
    palette: ["O", "P"]
  },
  {
    title: "سه رنگ",
    instruction: "ترتیب سه رنگ را پیدا کن.",
    pattern: ["P", "O", "G"],
    columns: 12, fixed: 6, copy: 6,
    palette: ["P", "O", "G"]
  },
  {
    title: "چهار رنگ",
    instruction: "الگوی چهاررنگی را کامل کن.",
    pattern: ["P", "O", "Y", "G"],
    columns: 16, fixed: 8, copy: 8,
    palette: ["P", "O", "Y", "G"]
  },
  {
    title: "پنج سبز و یک قرمز",
    instruction: "پنج خانه سبز و سپس یک خانه قرمز؛ الگو را ادامه بده.",
    pattern: ["G", "G", "G", "G", "G", "R"],
    columns: 18, fixed: 6, copy: 6,
    palette: ["G", "R"]
  },
  {
    title: "گل رنگی",
    instruction: "خانه‌های سبز و قرمز را مانند الگو کامل کن.",
    type: "flower",
    columns: 21, rows: 3, fixed: 8, copy: 6,
    palette: ["G", "R"]
  }
];

let stageIndex = 0;
let studentName = "";
let selectedItem = null;
let eraseMode = false;
let locked = false;
let mainAnswers = [];
let copyAnswers = [];
let flowerMain = [];
let flowerCopy = [];
let mouseEaten = false;
let audioContext = null;

const welcome = $("welcome");
const game = $("game");
const finish = $("finish");
const mainBoard = $("mainBoard");
const copyBoard = $("copyBoard");
const copyCard = document.querySelector(".copy-board-card");
const palettePanel = $("palettePanel");

function stage() {
  return STAGES[stageIndex];
}

function playSound(frequency = 660) {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.frequency.value = frequency;
    gain.gain.value = 0.07;

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch (error) {}
}

function message(text, type = "") {
  $("feedback").textContent = text;
  $("feedback").className = "feedback " + type;
}

function expected(pattern, index) {
  return pattern[index % pattern.length];
}

function renderItem(item) {
  if (!item) return "";

  if (item === YELLOW_U) {
    return `<span class="line-mark" style="--line-color:${COLORS.Y}"></span>`;
  }

  if (SHAPES[item]) {
    const shape = SHAPES[item];
    return `<span class="shape ${shape.cls}"
      style="--shape-color:${shape.color};background:${shape.color}">
      ${shape.cls === "star" ? "★" : ""}
    </span>`;
  }

  if (COLORS[item]) {
    return `<span class="color-dot"
      style="--dot-color:${COLORS[item]};background:${COLORS[item]}"></span>`;
  }

  return "";
}

function resetAnswers() {
  const s = stage();
  mainAnswers = Array(s.columns).fill(null);
  copyAnswers = Array(s.copy || 0).fill(null);
  flowerMain = Array(s.columns * (s.rows || 1)).fill(null);
  flowerCopy = Array((s.copy || 0) * (s.rows || 1)).fill(null);
  mouseEaten = false;
  locked = false;
  selectedItem = null;
  eraseMode = false;
  message("");
}

function renderPalette() {
  const s = stage();
  $("palette").innerHTML = "";

  const hide = s.type === "mouse" || s.type === "edge";
  palettePanel.hidden = hide;

  if (hide) return;

  s.palette.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-item";
    button.innerHTML = renderItem(item);

    button.addEventListener("click", () => {
      selectedItem = item;
      eraseMode = false;
      $("eraserButton").classList.remove("selected");
      $("eraserButton").setAttribute("aria-pressed", "false");

      document.querySelectorAll(".palette-item")
        .forEach(b => b.classList.remove("selected"));

      button.classList.add("selected");
    });

    $("palette").appendChild(button);
  });
}

function makeCell(board, index, value, fixed, callback, extra = "") {
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = "cell " +
    (fixed ? "fixed-cell" : "answer-cell") + " " + extra;
  cell.innerHTML = renderItem(value);
  cell.disabled = fixed || locked;

  if (!fixed && callback) {
    cell.addEventListener("click", () => callback(index));
  }

  board.appendChild(cell);
  return cell;
}

function renderRegular() {
  const s = stage();

  mainBoard.innerHTML = "";
  copyBoard.innerHTML = "";

  mainBoard.style.setProperty("--columns", s.columns);
  copyBoard.style.setProperty("--columns", s.copy);

  for (let i = 0; i < s.columns; i++) {
    const fixed = i < s.fixed;
    const value = fixed ? expected(s.pattern, i) : mainAnswers[i];

    makeCell(
      mainBoard,
      i,
      value,
      fixed,
      index => {
        if (eraseMode) {
          mainAnswers[index] = null;
        } else if (selectedItem) {
          mainAnswers[index] = selectedItem;
        } else {
          message("ابتدا یک شکل یا رنگ انتخاب کن.", "warning");
          return;
        }
        renderBoards();
      },
      expected(s.pattern, i) === null ? "expected-blank" : ""
    );
  }

  for (let i = 0; i < s.copy; i++) {
    makeCell(
      copyBoard,
      i,
      copyAnswers[i],
      false,
      index => {
        if (eraseMode) {
          copyAnswers[index] = null;
        } else if (selectedItem) {
          copyAnswers[index] = selectedItem;
        } else {
          message("ابتدا یک شکل یا رنگ انتخاب کن.", "warning");
          return;
        }
        renderBoards();
      },
      i >= s.pattern.length || s.pattern[i] === null
        ? "expected-blank" : ""
    );
  }
}

function flowerExpected(row, column) {
  if (row === 1) {
    return [null, "G", null, "R"][column % 4];
  }
  return column % 2 === 0 ? "G" : null;
}

function renderFlower() {
  const s = stage();
  mainBoard.innerHTML = "";
  copyBoard.innerHTML = "";

  mainBoard.style.setProperty("--columns", s.columns);
  copyBoard.style.setProperty("--columns", s.copy);

  for (let row = 0; row < s.rows; row++) {
    for (let col = 0; col < s.columns; col++) {
      const index = row * s.columns + col;
      const exp = flowerExpected(row, col);
      const fixed = col < s.fixed;

      makeCell(
        mainBoard, index,
        fixed ? exp : flowerMain[index],
        fixed,
        i => {
          flowerMain[i] = eraseMode ? null : selectedItem;
          renderBoards();
        },
        exp === null ? "expected-blank" : ""
      );
    }
  }

  for (let row = 0; row < s.rows; row++) {
    for (let col = 0; col < s.copy; col++) {
      const index = row * s.copy + col;
      const exp = flowerExpected(row, col);

      makeCell(
        copyBoard, index, flowerCopy[index], false,
        i => {
          flowerCopy[i] = eraseMode ? null : selectedItem;
          renderBoards();
        },
        exp === null ? "expected-blank" : ""
      );
    }
  }
}

function eatMouse(cell) {
  if (mouseEaten || locked) return;

  const mouse = document.createElement("span");
  mouse.className = "mouse-emoji";
  mouse.textContent = "🐭";
  mouse.style.left = "50%";
  mouse.style.top = "50%";
  mouse.style.transform = "translate(-50%,-50%)";

  cell.appendChild(mouse);
  cell.classList.add("mouse-found");

  cell.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.15)" },
      { transform: "scale(.2)", opacity: 0 }
    ],
    { duration: 900 }
  );

  setTimeout(() => {
    mouseEaten = true;
    renderBoards();
    message("آفرین! موش شکل ناهماهنگ را خورد.");
    playSound(880);
  }, 900);
}

function renderMouse() {
  const s = stage();
  mainBoard.innerHTML = "";
  copyBoard.innerHTML = "";
  copyCard.hidden = true;
  mainBoard.style.setProperty("--columns", s.columns);

  for (let i = 0; i < s.columns; i++) {
    let value = expected(s.pattern, i);
    const wrong = i === s.wrongIndex && !mouseEaten;

    if (wrong) value = value === "C" ? "T" : "C";

    const cell = makeCell(mainBoard, i, value, true, null,
      wrong ? "mouse-target" : "");

    if (wrong) {
      cell.disabled = false;
      cell.addEventListener("click", () => eatMouse(cell));
    }
  }
}

function renderEdge() {
  const s = stage();
  mainBoard.innerHTML = "";
  copyBoard.innerHTML = "";
  mainBoard.style.setProperty("--columns", s.columns);
  copyBoard.style.setProperty("--columns", s.copy);

  for (let i = 0; i < s.columns; i++) {
    const fixed = i < s.fixed;
    const cell = makeCell(mainBoard, i, null, fixed, null);

    if (!fixed) {
      cell.addEventListener("click", () => {
        cell.innerHTML =
          '<span class="edge-mark edge-top"></span>' +
          '<span class="edge-mark edge-right"></span>';
        cell.dataset.drawn = "yes";
      });
    }
  }

  for (let i = 0; i < s.copy; i++) {
    const cell = makeCell(copyBoard, i, null, false, null);
    cell.addEventListener("click", () => {
      cell.innerHTML =
        '<span class="edge-mark edge-top"></span>' +
        '<span class="edge-mark edge-right"></span>';
      cell.dataset.drawn = "yes";
    });
  }
}

function renderBoards() {
  const s = stage();

  if (s.type === "mouse") {
    renderMouse();
    return;
  }

  copyCard.hidden = false;

  if (s.type === "flower") renderFlower();
  else if (s.type === "edge") renderEdge();
  else renderRegular();
}

function renderStage() {
  const s = stage();

  $("stageTitle").textContent = s.title;
  $("stageInstruction").textContent = s.instruction;
  $("stageLabel").textContent =
    `تمرین ${stageIndex + 1} از ${STAGES.length}`;

  $("progressBar").style.width =
    ((stageIndex + 1) / STAGES.length * 100) + "%";

  $("progressTrack").setAttribute("aria-valuemax", STAGES.length);
  $("progressTrack").setAttribute("aria-valuenow", stageIndex + 1);

  $("studentGreeting").textContent = studentName;
  $("mainLabel").textContent = `${studentName}: الگو را ادامه بده`;

  $("prevButton").disabled = stageIndex === 0;
  $("nextButton").textContent =
    stageIndex === STAGES.length - 1 ? "پایان بازی" : "مرحله بعدی";

  $("checkButton").hidden = s.type === "edge";
  copyCard.hidden = s.type === "mouse";

  renderPalette();
  renderBoards();
}

function sameArray(actual, expectedArray) {
  return actual.length === expectedArray.length &&
    expectedArray.every((value, i) => actual[i] === value);
}

function checkRegular() {
  const s = stage();

  for (let i = s.fixed; i < s.columns; i++) {
    if (mainAnswers[i] !== expected(s.pattern, i)) return false;
  }

  const expectedCopy = Array(s.copy).fill(null);

  s.pattern.forEach((value, i) => {
    if (i < s.copy) expectedCopy[i] = value;
  });

  return sameArray(copyAnswers, expectedCopy);
}

function checkFlower() {
  const s = stage();

  for (let row = 0; row < s.rows; row++) {
    for (let col = s.fixed; col < s.columns; col++) {
      const i = row * s.columns + col;
      if (flowerMain[i] !== flowerExpected(row, col)) return false;
    }
  }

  const expectedCopy = [];

  for (let row = 0; row < s.rows; row++) {
    for (let col = 0; col < s.copy; col++) {
      expectedCopy.push(flowerExpected(row, col));
    }
  }

  return sameArray(flowerCopy, expectedCopy);
}

function checkEdge() {
  const mainCells = [...mainBoard.querySelectorAll(".cell")];
  const copyCells = [...copyBoard.querySelectorAll(".cell")];

  return mainCells.slice(6).every(c => c.dataset.drawn === "yes") &&
    copyCells.every(c => c.dataset.drawn === "yes");
}

function fireworks() {
  const box = $("fireworks");
  const colors = [
    "#ff5c8a", "#ffd54f", "#55b8f4",
    "#5dcc9a", "#9b83f6", "#ff9f43"
  ];

  box.innerHTML = "";
  box.classList.remove("hidden");
  box.classList.add("active");

  for (let i = 0; i < 100; i++) {
    const particle = document.createElement("i");
    particle.className = "firework-particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 45 + "%";
    particle.style.setProperty("--particle-color", colors[i % colors.length]);
    particle.style.setProperty("--dx", (Math.random() * 300 - 150) + "px");
    particle.style.setProperty("--dy", (Math.random() * 400 + 80) + "px");
    box.appendChild(particle);
  }

  setTimeout(() => {
    box.classList.add("hidden");
    box.classList.remove("active");
  }, 1900);
}

function checkStage() {
  if (locked) return;

  const s = stage();
  let correct = false;

  if (s.type === "mouse") correct = mouseEaten;
  else if (s.type === "flower") correct = checkFlower();
  else if (s.type === "edge") correct = checkEdge();
  else correct = checkRegular();

  if (!correct) {
    message("هنوز پاسخ‌ها کامل یا درست نیستند. دوباره تلاش کن.", "warning");
    playSound(260);
    return;
  }

  locked = true;
  message("");
  renderBoards();

  playSound(660);
  setTimeout(() => playSound(880), 130);
  setTimeout(() => playSound(1040), 260);
  fireworks();
}

function clearAnswers() {
  if (locked) return;
  resetAnswers();
  renderStage();
}

function startGame() {
  studentName = $("studentName").value.trim() || "دانش‌آموز";
  $("studentGreeting").textContent = studentName;
  welcome.hidden = true;
  finish.hidden = true;
  game.hidden = false;
  stageIndex = 0;
  resetAnswers();
  renderStage();
}

function nextStage() {
  if (!locked) {
    message("ابتدا پاسخ‌ها را درست کامل و بررسی کن.", "warning");
    return;
  }

  if (stageIndex === STAGES.length - 1) {
    game.hidden = true;
    finish.hidden = false;
    $("finishMessage").textContent =
      `آفرین ${studentName}! همهٔ تمرین‌ها را به پایان رساندی.`;
    return;
  }

  stageIndex++;
  resetAnswers();
  renderStage();
}

function previousStage() {
  if (stageIndex === 0) return;
  stageIndex--;
  resetAnswers();
  renderStage();
}

$("startButton").addEventListener("click", startGame);
$("studentName").addEventListener("keydown", event => {
  if (event.key === "Enter") startGame();
});

$("prevButton").addEventListener("click", previousStage);
$("nextButton").addEventListener("click", nextStage);
$("checkButton").addEventListener("click", checkStage);
$("clearButton").addEventListener("click", clearAnswers);

$("eraserButton").addEventListener("click", () => {
  if (locked) return;

  eraseMode = !eraseMode;
  selectedItem = null;

  $("eraserButton").classList.toggle("selected", eraseMode);
  $("eraserButton").setAttribute("aria-pressed", String(eraseMode));

  document.querySelectorAll(".palette-item")
    .forEach(button => button.classList.remove("selected"));
});

$("exitButton").addEventListener("click", () => {
  game.hidden = true;
  finish.hidden = true;
  welcome.hidden = false;
});

$("restartButton").addEventListener("click", () => {
  finish.hidden = true;
  welcome.hidden = false;
  $("studentName").value = studentName;
});

game.hidden = true;
finish.hidden = true;
