"use strict";

const COLORS = {
  green: "#58c86b",
  blue: "#42a5f5",
  yellow: "#ffd84d",
  red: "#ef5350",
  pink: "#ff73ad",
  purple: "#9c64e8"
};

const faDigits = n =>
  String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

const levels = [
  {
    instruction: "الگو را پیدا کن و جای خالی را کامل کن.",
    pattern: [
      ["color", "green"], ["color", "blue"],
      ["color", "green"], ["color", "blue"], null,
      ["color", "blue"], ["color", "green"],
      ["color", "blue"], ["color", "green"]
    ],
    choices: [
      ["color", "green"],
      ["color", "blue"],
      ["color", "yellow"]
    ],
    answer: 0,
    cols: 9
  },
  {
    instruction: "الگو را پیدا کن و سپس ادامه بده.",
    pattern: [
      ["shape", "circle", "pink"],
      ["shape", "square", "yellow"],
      ["shape", "circle", "pink"],
      ["shape", "square", "yellow"],
      null,
      ["shape", "square", "yellow"],
      ["shape", "circle", "pink"]
    ],
    choices: [
      ["shape", "circle", "pink"],
      ["shape", "square", "yellow"],
      ["shape", "triangle", "blue"]
    ],
    answer: 0,
    cols: 7
  },
  {
    instruction: "کدام شکل باید در جای خالی باشد؟",
    pattern: [
      ["shape", "triangle", "blue"],
      ["shape", "triangle", "yellow"],
      ["shape", "triangle", "blue"],
      null,
      ["shape", "triangle", "blue"],
      ["shape", "triangle", "yellow"]
    ],
    choices: [
      ["shape", "triangle", "yellow"],
      ["shape", "triangle", "blue"],
      ["shape", "circle", "pink"]
    ],
    answer: 0,
    cols: 6
  },
  {
    instruction: "الگوی سه‌تایی را پیدا کن و ادامه بده.",
    pattern: [
      ["color", "red"], ["color", "yellow"], ["color", "green"],
      ["color", "red"], ["color", "yellow"], null,
      ["color", "red"], ["color", "yellow"], ["color", "green"]
    ],
    choices: [
      ["color", "green"],
      ["color", "blue"],
      ["color", "red"]
    ],
    answer: 0,
    cols: 9,
    repeat: [
      ["color", "red"],
      ["color", "yellow"],
      ["color", "green"]
    ]
  },
  {
    instruction: "به ترتیب شکل‌ها دقت کن؛ کدام گزینه کم است؟",
    pattern: [
      ["shape", "circle", "blue"],
      ["shape", "star", "yellow"],
      ["shape", "heart", "pink"],
      ["shape", "circle", "blue"],
      null,
      ["shape", "heart", "pink"],
      ["shape", "circle", "blue"],
      ["shape", "star", "yellow"],
      ["shape", "heart", "pink"]
    ],
    choices: [
      ["shape", "star", "yellow"],
      ["shape", "heart", "pink"],
      ["shape", "circle", "blue"]
    ],
    answer: 0,
    cols: 9
  },
  {
    instruction: "الگو را پیدا کن و جای خالی را کامل کن.",
    pattern: [
      ["color", "purple"], ["color", "purple"], ["color", "green"],
      ["color", "purple"], ["color", "purple"], null,
      ["color", "purple"], ["color", "purple"], ["color", "green"]
    ],
    choices: [
      ["color", "green"],
      ["color", "purple"],
      ["color", "blue"]
    ],
    answer: 0,
    cols: 9
  },
  {
    instruction: "الگوی رنگی را پیدا کن.",
    pattern: [
      ["color", "pink"], ["color", "yellow"], null,
      ["color", "pink"], ["color", "yellow"],
      ["color", "pink"], ["color", "yellow"]
    ],
    choices: [
      ["color", "pink"],
      ["color", "yellow"],
      ["color", "purple"]
    ],
    answer: 0,
    cols: 7,
    repeat: [
      ["color", "pink"],
      ["color", "yellow"],
      ["color", "pink"]
    ]
  },
  {
    instruction: "کدام شکل باید بیاید؟",
    pattern: [
      ["shape", "heart", "pink"],
      ["shape", "circle", "blue"],
      ["shape", "star", "yellow"],
      null,
      ["shape", "circle", "blue"],
      ["shape", "star", "yellow"],
      ["shape", "heart", "pink"]
    ],
    choices: [
      ["shape", "heart", "pink"],
      ["shape", "circle", "blue"],
      ["shape", "triangle", "green"]
    ],
    answer: 0,
    cols: 7
  },
  {
    instruction: "الگو را پیدا کن و سپس ادامه بده.",
    pattern: [
      ["shape", "circle", "green"],
      ["shape", "star", "red"],
      ["shape", "triangle", "blue"],
      ["shape", "circle", "green"],
      null,
      ["shape", "triangle", "blue"],
      ["shape", "circle", "green"],
      ["shape", "star", "red"],
      ["shape", "triangle", "blue"]
    ],
    choices: [
      ["shape", "star", "red"],
      ["shape", "circle", "green"],
      ["shape", "triangle", "blue"]
    ],
    answer: 0,
    cols: 9
  },
  {
    instruction: "شکل‌های رنگی را با دقت نگاه کن؛ جای خالی را کامل کن.",
    pattern: [
      ["shape", "heart", "pink"],
      ["shape", "circle", "yellow"],
      ["shape", "star", "purple"],
      null,
      ["shape", "circle", "yellow"],
      ["shape", "star", "purple"],
      ["shape", "heart", "pink"],
      ["shape", "circle", "yellow"],
      ["shape", "star", "purple"]
    ],
    choices: [
      ["shape", "heart", "pink"],
      ["shape", "circle", "yellow"],
      ["shape", "triangle", "blue"]
    ],
    answer: 0,
    cols: 9
  },
  {
    instruction: "کدام شکل اضافه است؟ الگوی منظم را پیدا کن.",
    pattern: [
      ["shape", "circle", "blue"],
      ["shape", "square", "green"],
      ["shape", "triangle", "yellow"],
      ["shape", "star", "red"],
      ["shape", "circle", "blue"],
      ["shape", "square", "green"],
      ["shape", "triangle", "yellow"]
    ],
    choices: [
      ["shape", "star", "red"],
      ["shape", "circle", "blue"],
      ["shape", "triangle", "yellow"]
    ],
    answer: 0,
    cols: 7
  },
  {
    instruction: "الگو را پیدا کن و سپس ادامه بده.",
    pattern: [
      ["color", "red"], ["color", "blue"],
      ["color", "yellow"], ["color", "green"],
      ["color", "red"], ["color", "blue"],
      ["color", "yellow"], null,
      ["color", "red"], ["color", "blue"],
      ["color", "yellow"], ["color", "green"]
    ],
    choices: [
      ["color", "green"],
      ["color", "red"],
      ["color", "blue"]
    ],
    answer: 0,
    cols: 12,
    repeat: [
      ["color", "red"],
      ["color", "blue"],
      ["color", "yellow"],
      ["color", "green"]
    ]
  },
  {
    instruction: "الگوی بزرگ را پیدا کن و جای خالی را کامل کن.",
    pattern: [
      ["shape", "circle", "pink"],
      ["shape", "square", "blue"],
      ["shape", "triangle", "yellow"],
      ["shape", "star", "red"],
      ["shape", "circle", "pink"],
      ["shape", "square", "blue"],
      null,
      ["shape", "star", "red"],
      ["shape", "circle", "pink"],
      ["shape", "square", "blue"],
      ["shape", "triangle", "yellow"],
      ["shape", "star", "red"]
    ],
    choices: [
      ["shape", "triangle", "yellow"],
      ["shape", "star", "red"],
      ["shape", "circle", "pink"]
    ],
    answer: 0,
    cols: 12,
    repeat: [
      ["shape", "circle", "pink"],
      ["shape", "square", "blue"],
      ["shape", "triangle", "yellow"],
      ["shape", "star", "red"]
    ]
  }
];

let levelIndex = 0;
let score = 0;
let playerName = "دوست من";
let selected = null;
let solved = new Array(levels.length).fill(false);
let audioCtx = null;

const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  $(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" });
}

function speak(text) {
  try {
    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fa-IR";
    utterance.rate = 0.88;
    utterance.pitch = 1.05;

    speechSynthesis.speak(utterance);
  } catch (error) {}
}

function beep(ok = true) {
  try {
    audioCtx = audioCtx ||
      new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = ok ? 660 : 180;

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.12,
      audioCtx.currentTime + 0.015
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtx.currentTime + (ok ? 0.22 : 0.18)
    );

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + (ok ? 0.24 : 0.2));
  } catch (error) {}
}

function shapeHTML(item) {
  if (!item) return "";

  const [kind, type, color] = item;

  if (kind === "color") {
    return `<span class="shape circle" style="background:${COLORS[type]}"></span>`;
  }

  if (type === "triangle") {
    return `<span class="shape triangle" style="color:${COLORS[color]}"></span>`;
  }

  return `<span class="shape ${type}" style="background:${COLORS[color]}"></span>`;
}

function cellHTML(item, missing = false) {
  return `<div class="cell${missing ? " missing" : ""}">${shapeHTML(item)}</div>`;
}

function renderLevel() {
  selected = null;

  const level = levels[levelIndex];

  $("levelNo").textContent = faDigits(levelIndex + 1);
  $("levelTotal").textContent = faDigits(levels.length);
  $("score").textContent = faDigits(score);

  $("progressBar").style.width =
    ((levelIndex + 1) / levels.length * 100) + "%";

  $("instruction").textContent = level.instruction;

  const area = $("patternArea");
  area.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "pattern-grid";
  grid.style.setProperty("--cols", level.cols);

  level.pattern.forEach(item => {
    grid.insertAdjacentHTML("beforeend", cellHTML(item, !item));
  });

  area.appendChild(grid);

  const answers = $("answerArea");
  answers.innerHTML = "";

  level.choices.forEach((item, index) => {
    const button = document.createElement("button");

    button.className = "choice";
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = shapeHTML(item);

    button.addEventListener("click", () => selectChoice(index));

    answers.appendChild(button);
  });

  const repeatUnit = $("repeatUnit");

  if (level.repeat) {
    repeatUnit.classList.remove("hidden");
    repeatUnit.innerHTML = `
      <div class="repeat-label">واحد تکرار الگو</div>
      <div class="repeat-row">
        ${level.repeat.map(item => cellHTML(item)).join("")}
      </div>
    `;
  } else {
    repeatUnit.classList.add("hidden");
    repeatUnit.innerHTML = "";
  }

  $("feedback").textContent = "";
  $("feedback").className = "feedback";

  $("prevBtn").disabled = levelIndex === 0;
  $("nextBtn").disabled =
    !solved[levelIndex] && levelIndex === levels.length - 1;

  // اگر مرحله قبلاً حل شده، پاسخ صحیح مشخص می‌ماند.
  if (solved[levelIndex]) {
    const buttons = $("answerArea").querySelectorAll(".choice");

    if (buttons[level.answer]) {
      buttons[level.answer].classList.add("selected");
      buttons[level.answer].setAttribute("aria-pressed", "true");
      selected = level.answer;
    }
  }

  if (levelIndex === 0) {
    speak(level.instruction);
  }
}

/*
  اصلاح انتخاب گزینه:
  با هر بار لمس گزینه جدید، انتخاب قبلی پاک می‌شود.
  بنابراین فقط یک گزینه در هر لحظه انتخاب‌شده می‌ماند.
*/
function selectChoice(index) {
  const answerArea = $("answerArea");
  const buttons = answerArea.querySelectorAll(".choice");

  // پاک کردن انتخاب قبلی از تمام گزینه‌ها
  buttons.forEach(button => {
    button.classList.remove("selected");
    button.setAttribute("aria-pressed", "false");
  });

  // ثبت گزینه جدید
  selected = index;

  const chosenButton = buttons[index];

  if (chosenButton) {
    chosenButton.classList.add("selected");
    chosenButton.setAttribute("aria-pressed", "true");
  }

  $("feedback").textContent = "";
  $("feedback").className = "feedback";

  beep(true);
}

function clearChoice() {
  selected = null;

  $("answerArea").querySelectorAll(".choice").forEach(button => {
    button.classList.remove("selected");
    button.setAttribute("aria-pressed", "false");
  });

  $("feedback").textContent = "";
  $("feedback").className = "feedback";
}

function checkAnswer() {
  if (selected === null) {
    $("feedback").textContent = "یک گزینه را انتخاب کن 🌸";
    $("feedback").className = "feedback bad";
    beep(false);
    return;
  }

  const level = levels[levelIndex];

  if (selected === level.answer) {
    if (!solved[levelIndex]) {
      solved[levelIndex] = true;
      score += 10;
    }

    $("score").textContent = faDigits(score);

    $("feedback").textContent =
      levelIndex === levels.length - 1
        ? "آفرین! همهٔ مراحل را انجام دادی 🏆"
        : "آفرین! پاسخ درست است 🌟";

    $("feedback").className = "feedback ok";

    beep(true);
    speak("آفرین! پاسخ درست است.");
    confetti();

    if (levelIndex === levels.length - 1) {
      setTimeout(showEnd, 650);
    }
  } else {
    $("feedback").textContent =
      "یک بار دیگر با دقت به الگو نگاه کن 💜";

    $("feedback").className = "feedback bad";

    beep(false);
    speak("دوباره با دقت نگاه کن.");
  }
}

function nextLevel() {
  if (levelIndex >= levels.length - 1) {
    if (solved[levelIndex]) {
      showEnd();
    } else {
      checkAnswer();
    }

    return;
  }

  levelIndex++;
  renderLevel();
}

function prevLevel() {
  if (levelIndex > 0) {
    levelIndex--;
    renderLevel();
  }
}

function startGame() {
  playerName =
    ($("studentName").value || "دوست من").trim() || "دوست من";

  $("playerName").textContent = playerName;

  levelIndex = 0;
  score = 0;
  selected = null;
  solved = new Array(levels.length).fill(false);

  showScreen("gameScreen");
  renderLevel();
}

function showEnd() {
  $("endName").textContent = playerName;
  $("finalScore").textContent = faDigits(score);

  showScreen("endScreen");

  speak(`آفرین ${playerName}! بازی را تمام کردی.`);
  confetti();
}

function restart() {
  levelIndex = 0;
  score = 0;
  selected = null;
  solved = new Array(levels.length).fill(false);

  showScreen("gameScreen");
  renderLevel();
}

function goHome() {
  showScreen("startScreen");
}

function confetti() {
  const box = $("confetti");
  box.innerHTML = "";

  const colors = Object.values(COLORS);

  for (let i = 0; i < 34; i++) {
    const piece = document.createElement("i");

    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.top = (-Math.random() * 20) + "%";
    piece.style.background = colors[i % colors.length];
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    piece.style.animationDelay = (Math.random() * 0.15) + "s";

    box.appendChild(piece);
  }

  setTimeout(() => {
    box.innerHTML = "";
  }, 1500);
}

// اتصال دکمه‌ها
$("startBtn").addEventListener("click", startGame);

$("studentName").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    startGame();
  }
});

$("checkBtn").addEventListener("click", checkAnswer);
$("clearBtn").addEventListener("click", clearChoice);
$("nextBtn").addEventListener("click", nextLevel);
$("prevBtn").addEventListener("click", prevLevel);
$("homeBtn").addEventListener("click", goHome);
$("restartBtn").addEventListener("click", restart);
$("endHomeBtn").addEventListener("click", goHome);

$("studentName").focus();
