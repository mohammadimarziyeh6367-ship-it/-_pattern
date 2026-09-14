/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   نسخه نهایی | ۲۰ مرحله
========================================================= */


/* =========================================================
   شکل‌های بازی
========================================================= */

const shapes = {

  circle: {
    type: "circle",
    color: "blue",
    label: "دایره آبی"
  },

  square: {
    type: "square",
    color: "yellow",
    label: "مربع زرد"
  },

  triangle: {
    type: "triangle",
    color: "green",
    label: "مثلث سبز"
  },

  star: {
    type: "star",
    color: "yellow",
    label: "ستاره زرد"
  },

  heart: {
    type: "heart",
    color: "pink",
    label: "قلب صورتی"
  }

};


/* =========================================================
   مرحله‌ها
   ۲۰ مرحله از ساده به دشوار
========================================================= */

const levels = [

  /* =======================================================
     ۱ ـ نمونه
  ======================================================= */

  {
    type: "sample",
    badge: "نمونه",
    question: "اول با هم یک نمونه ببینیم 🌸",
    instruction: "به تکرار شکل‌ها دقت کن.",
    pattern: [
      shapes.circle,
      shapes.square,
      shapes.circle,
      shapes.square,
      shapes.circle,
      shapes.square
    ]
  },


  /* =======================================================
     ۲ ـ الگوی دو شکلی
  ======================================================= */

  {
    type: "missing",
    badge: "جای خالی",
    question: "فکر می‌کنی بعدش چی میاد؟ 🤔",
    instruction: "شکل مناسب را بکش و در جای خالی قرار بده.",
    pattern: [
      shapes.circle,
      shapes.square,
      shapes.circle,
      shapes.square,
      shapes.circle,
      null
    ],
    choices: [
      shapes.circle,
      shapes.square,
      shapes.triangle
    ],
    answer: 1
  },


  /* =======================================================
     ۳
  ======================================================= */

  {
    type: "missing",
    badge: "جای خالی",
    question: "چی باید اینجا باشه؟ 👀",
    instruction: "الگو را پیدا کن.",
    pattern: [
      shapes.star,
      shapes.circle,
      shapes.star,
      null,
      shapes.star,
      shapes.circle
    ],
    choices: [
      shapes.star,
      shapes.circle,
      shapes.heart
    ],
    answer: 1
  },


  /* =======================================================
     ۴
  ======================================================= */

  {
    type: "missing",
    badge: "جای خالی",
    question: "حالا نوبت توئه! 🌟",
    instruction: "شکل درست را در جای خالی بگذار.",
    pattern: [
      shapes.square,
      shapes.triangle,
      shapes.square,
      shapes.triangle,
      shapes.square,
      null
    ],
    choices: [
      shapes.circle,
      shapes.triangle,
      shapes.square
    ],
    answer: 1
  },


  /* =======================================================
     ۵ ـ الگوی سه‌تایی
  ======================================================= */

  {
    type: "missing",
    badge: "الگوی سه‌تایی",
    question: "الگو چه می‌گوید؟ 🧩",
    instruction: "سه شکل را پیدا کن و الگو را ادامه بده.",
    pattern: [
      shapes.circle,
      shapes.square,
      shapes.triangle,
      shapes.circle,
      shapes.square,
      null
    ],
    choices: [
      shapes.triangle,
      shapes.circle,
      shapes.square
    ],
    answer: 0
  },


  /* =======================================================
     ۶
  ======================================================= */

  {
    type: "missing",
    badge: "جای خالی",
    question: "یک شکل گم شده! پیداش کن 🔍",
    instruction: "به شکل‌های قبل و بعد دقت کن.",
    pattern: [
      shapes.star,
      shapes.circle,
      shapes.heart,
      shapes.star,
      null,
      shapes.heart
    ],
    choices: [
      shapes.circle,
      shapes.star,
      shapes.heart
    ],
    answer: 0
  },


  /* =======================================================
     ۷ ـ مرتب کردن
  ======================================================= */

  {
    type: "reorder",
    badge: "مرتب‌سازی",
    question: "این شکل‌ها قاطی شده‌اند! 😄",
    instruction: "شکل‌ها را جابه‌جا کن تا الگو منظم شود.",
    pieces: [
      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star
    ],
    target: [
      shapes.circle,
      shapes.star,
      shapes.circle,
      shapes.star
    ]
  },


  /* =======================================================
     ۸ ـ AAB
  ======================================================= */

  {
    type: "reorder",
    badge: "مرتب‌سازی",
    question: "می‌توانی نظمشان را پیدا کنی؟ 🧠",
    instruction: "شکل‌ها را جابه‌جا کن.",
    pieces: [
      shapes.star,
      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.circle,
      shapes.circle
    ],
    target: [
      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.circle,
      shapes.circle,
      shapes.star
    ]
  },


  /* =======================================================
     ۹ ـ ABC
  ======================================================= */

  {
    type: "reorder",
    badge: "چالش",
    question: "حالا یکم سخت‌تر! 😉",
    instruction: "سه شکل متفاوت را پیدا کن و الگو را بساز.",
    pieces: [
      shapes.triangle,
      shapes.circle,
      shapes.square,
      shapes.square,
      shapes.triangle,
      shapes.circle
    ],
    flexiblePattern: true
  },


  /* =======================================================
     ۱۰ ـ جای خالی سه‌تایی
  ======================================================= */

  {
    type: "missing",
    badge: "چالش",
    question: "با دقت نگاه کن... 👀",
    instruction: "شکل گمشده را در جای خالی بگذار.",
    pattern: [
      shapes.circle,
      shapes.square,
      shapes.triangle,
      null,
      shapes.square,
      shapes.triangle
    ],
    choices: [
      shapes.circle,
      shapes.square,
      shapes.heart
    ],
    answer: 0
  },


  /* =======================================================
     ۱۱ ـ شکل اضافه
  ======================================================= */

  {
    type: "remove",
    badge: "شکل اضافه",
    question: "یک شکل اضافه است! 🔍",
    instruction: "شکل اضافی را لمس کن.",
    pattern: [
      shapes.circle,
      shapes.star,
      shapes.circle,
      shapes.star,
      shapes.circle,
      shapes.circle,
      shapes.star
    ],
    removeIndex: 5
  },


  /* =======================================================
     ۱۲ ـ شکل اضافه در الگوی سه‌تایی
  ======================================================= */

  {
    type: "remove",
    badge: "چالش",
    question: "کدام شکل نظم را به‌هم زده؟ 🤔",
    instruction: "شکل اضافی را پیدا کن.",
    pattern: [
      shapes.circle,
      shapes.square,
      shapes.triangle,
      shapes.circle,
      shapes.heart,
      shapes.square,
      shapes.triangle
    ],
    removeIndex: 4
  },


  /* =======================================================
     ۱۳ ـ دو جای خالی
  ======================================================= */

  {
    type: "place",
    badge: "مرحله نهایی",
    question: "دو شکل گم شده‌اند! 🌟",
    instruction: "هر دو جای خالی را کامل کن.",
    pattern: [
      shapes.heart,
      shapes.star,
      shapes.circle,
      null,
      shapes.heart,
      shapes.star,
      shapes.circle,
      null
    ],
    choices: [
      shapes.heart,
      shapes.circle,
      shapes.star
    ],
    answers: [0, 0]
  },


  /* =======================================================
     ۱۴ ـ الگوی شطرنجی ساده
  ======================================================= */

  {
    type: "grid",
    badge: "الگوی شطرنجی",
    question: "الگوی شطرنجی را پیدا کن و خانه‌های خالی را کامل کن.",
    instruction: "شکل مناسب را بکش و در خانهٔ خالی قرار بده.",

    rows: 4,
    cols: 6,

    pattern: [

      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star,
      shapes.circle,
      shapes.circle,

      shapes.star,
      shapes.star,
      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star,

      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star,
      shapes.circle,
      shapes.circle,

      null,
      null,
      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star

    ],

    missing: [18, 19],

    choices: [
      shapes.circle,
      shapes.star,
      shapes.square
    ],

    answers: {
      18: 0,
      19: 0
    }
  },


  /* =======================================================
     ۱۵ ـ الگوی شطرنجی ردیفی
  ======================================================= */

  {
    type: "grid",
    badge: "الگوی شطرنجی",
    question: "به ردیف‌های بالا نگاه کن و الگو را ادامه بده.",
    instruction: "خانه‌های خالی را با شکل مناسب کامل کن.",

    rows: 4,
    cols: 5,

    pattern: [

      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star,
      shapes.circle,

      shapes.star,
      shapes.star,
      shapes.circle,
      shapes.circle,
      shapes.star,

      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star,
      shapes.circle,

      shapes.star,
      shapes.star,
      null,
      null,
      shapes.star

    ],

    missing: [17, 18],

    choices: [
      shapes.circle,
      shapes.star,
      shapes.heart
    ],

    answers: {
      17: 0,
      18: 0
    }
  },


  /* =======================================================
     ۱۶ ـ الگوی شطرنجی سه شکلی
  ======================================================= */

  {
    type: "grid",
    badge: "الگوی سه‌تایی",
    question: "نظم شکل‌ها را پیدا کن و خانه‌های خالی را کامل کن.",
    instruction: "به ترتیب شکل‌ها در ردیف‌ها دقت کن.",

    rows: 4,
    cols: 6,

    pattern: [

      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star,
      shapes.triangle,
      shapes.triangle,

      shapes.star,
      shapes.star,
      shapes.triangle,
      shapes.triangle,
      shapes.circle,
      shapes.circle,

      shapes.triangle,
      shapes.triangle,
      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star,

      null,
      null,
      shapes.star,
      shapes.star,
      shapes.triangle,
      shapes.triangle

    ],

    missing: [18, 19],

    choices: [
      shapes.circle,
      shapes.star,
      shapes.triangle
    ],

    answers: {
      18: 2,
      19: 2
    }
  },


  /* =======================================================
     ۱۷ ـ چند جای خالی شطرنجی
  ======================================================= */

  {
    type: "grid",
    badge: "چالش شطرنجی",
    question: "الگو را از ردیف‌ها و ستون‌ها پیدا کن.",
    instruction: "همهٔ خانه‌های خالی را کامل کن.",

    rows: 4,
    cols: 6,

    pattern: [

      shapes.circle,
      shapes.circle,
      shapes.square,
      shapes.square,
      shapes.circle,
      shapes.circle,

      shapes.square,
      null,
      shapes.circle,
      shapes.circle,
      shapes.square,
      shapes.square,

      shapes.circle,
      shapes.circle,
      shapes.square,
      null,
      shapes.circle,
      shapes.circle,

      shapes.square,
      shapes.square,
      shapes.circle,
      shapes.circle,
      null,
      shapes.square

    ],

    missing: [7, 15, 22],

    choices: [
      shapes.circle,
      shapes.square,
      shapes.triangle
    ],

    answers: {
      7: 1,
      15: 1,
      22: 0
    }
  },


  /* =======================================================
     ۱۸ ـ شطرنجی رنگی
  ======================================================= */

  {
    type: "grid",
    badge: "الگوی رنگی",
    question: "خانه‌های رنگی را با دقت نگاه کن.",
    instruction: "الگو را ادامه بده.",

    rows: 5,
    cols: 5,

    pattern: [

      shapes.circle,
      shapes.square,
      shapes.circle,
      shapes.square,
      shapes.circle,

      shapes.square,
      shapes.circle,
      shapes.square,
      shapes.circle,
      shapes.square,

      shapes.circle,
      shapes.square,
      shapes.circle,
      shapes.square,
      shapes.circle,

      shapes.square,
      shapes.circle,
      null,
      shapes.circle,
      shapes.square,

      shapes.circle,
      shapes.square,
      shapes.circle,
      shapes.square,
      null

    ],

    missing: [17, 24],

    choices: [
      shapes.circle,
      shapes.square,
      shapes.star
    ],

    answers: {
      17: 0,
      24: 0
    }
  },


  /* =======================================================
     ۱۹ ـ شطرنجی ترکیبی
  ======================================================= */

  {
    type: "grid",
    badge: "چالش شطرنجی",
    question: "الگوی شطرنجی را کشف کن.",
    instruction: "خانه‌های خالی را کامل کن.",

    rows: 5,
    cols: 6,

    pattern: [

      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star,
      shapes.triangle,
      shapes.triangle,

      shapes.star,
      shapes.star,
      shapes.triangle,
      shapes.triangle,
      shapes.circle,
      shapes.circle,

      shapes.triangle,
      shapes.triangle,
      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star,

      shapes.circle,
      null,
      shapes.star,
      shapes.star,
      shapes.triangle,
      shapes.triangle,

      shapes.star,
      shapes.star,
      shapes.triangle,
      null,
      shapes.circle,
      shapes.circle

    ],

    missing: [19, 21],

    choices: [
      shapes.circle,
      shapes.star,
      shapes.triangle
    ],

    answers: {
      19: 0,
      21: 2
    }
  },


  /* =======================================================
     ۲۰ ـ چالش نهایی شطرنجی
  ======================================================= */

  {
    type: "grid",
    badge: "چالش نهایی 🌟",
    question: "چالش نهایی! الگوی شطرنجی را کامل کن.",
    instruction: "با دقت به ردیف‌ها و ستون‌ها نگاه کن.",

    rows: 5,
    cols: 6,

    pattern: [

      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star,
      shapes.triangle,
      shapes.triangle,

      shapes.star,
      shapes.star,
      shapes.triangle,
      shapes.triangle,
      shapes.circle,
      shapes.circle,

      shapes.triangle,
      shapes.triangle,
      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star,

      shapes.circle,
      shapes.circle,
      shapes.star,
      null,
      shapes.triangle,
      shapes.triangle,

      shapes.star,
      shapes.star,
      shapes.triangle,
      shapes.triangle,
      null,
      shapes.circle

    ],

    missing: [21, 28],

    choices: [
      shapes.circle,
      shapes.star,
      shapes.triangle
    ],

    answers: {
      21: 1,
      28: 2
    }
  }

];


/* =========================================================
   وضعیت بازی
========================================================= */

let level = 0;
let score = 0;
let studentName = "";
let audioContext = null;

const stageStates = {};

let activeDrag = null;
let activeReorder = null;


/* =========================================================
   عناصر صفحه
========================================================= */

const cover =
  document.getElementById("cover");

const game =
  document.getElementById("game");

const finish =
  document.getElementById("finish");

const startBtn =
  document.getElementById("startBtn");

const restartBtn =
  document.getElementById("restartBtn");

let studentNameInput =
  document.getElementById("studentName");

const levelLabel =
  document.getElementById("levelLabel");

const scoreLabel =
  document.getElementById("scoreLabel");

const progressBar =
  document.getElementById("progressBar");

const typeBadge =
  document.getElementById("typeBadge");

const questionText =
  document.getElementById("questionText");

const instruction =
  document.getElementById("instruction");

const patternArea =
  document.getElementById("patternArea");

const choices =
  document.getElementById("choices");

const choicesTitle =
  document.getElementById("choicesTitle");

const feedback =
  document.getElementById("feedback");

const exitBtn =
  document.getElementById("exitBtn");

const prevBtn =
  document.getElementById("prevBtn");

const nextBtn =
  document.getElementById("nextBtn");

const finalScore =
  document.getElementById("finalScore");

const finishMessage =
  document.getElementById("finishMessage");


/* =========================================================
   اگر ورودی نام دانش‌آموز در HTML نبود
   خودمان آن را ایجاد می‌کنیم.
========================================================= */

function ensureStudentNameInput() {

  if (studentNameInput) {
    return;
  }

  studentNameInput =
    document.createElement("input");

  studentNameInput.id =
    "studentName";

  studentNameInput.type =
    "text";

  studentNameInput.placeholder =
    "نام زیبایت را وارد کن 🌸";

  studentNameInput.autocomplete =
    "off";

  studentNameInput.maxLength =
    30;

  studentNameInput.style.width =
    "min(90%, 360px)";

  studentNameInput.style.display =
    "block";

  studentNameInput.style.margin =
    "12px auto";

  studentNameInput.style.padding =
    "13px 16px";

  studentNameInput.style.border =
    "2px solid #eadff4";

  studentNameInput.style.borderRadius =
    "18px";

  studentNameInput.style.textAlign =
    "center";

  studentNameInput.style.fontSize =
    "18px";

  studentNameInput.style.fontFamily =
    "inherit";

  if (startBtn) {
    startBtn.parentNode.insertBefore(
      studentNameInput,
      startBtn
    );
  }

}


/* =========================================================
   ابزارهای عمومی
========================================================= */

function samePiece(a, b) {

  if (!a || !b) {
    return false;
  }

  return (
    a.type === b.type &&
    a.color === b.color
  );
}


function clonePiece(piece) {

  if (!piece) {
    return null;
  }

  return {
    type: piece.type,
    color: piece.color,
    label: piece.label
  };

}


/* =========================================================
   ساخت شکل
========================================================= */

function shapeHTML(piece) {

  if (!piece) {
    return "";
  }

  if (piece.type === "star") {

    return `
      <div class="shape star ${piece.color}">
        ★
      </div>
    `;

  }

  if (piece.type === "heart") {

    return `
      <div class="shape heart ${piece.color}">
        ♥
      </div>
    `;

  }

  if (piece.type === "triangle") {

    return `
      <div class="shape triangle ${piece.color}"></div>
    `;

  }

  return `
    <div class="shape ${piece.type} ${piece.color}"></div>
  `;

}


/* =========================================================
   نمایش صفحه
========================================================= */

function showScreen(screen) {

  [cover, game, finish].forEach(
    item => {

      if (item) {
        item.classList.remove("active");
      }

    }
  );

  if (screen) {
    screen.classList.add("active");
  }

}


/* =========================================================
   صدای افکت
========================================================= */

function getAudioContext() {

  if (!audioContext) {

    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioCtx) {
      return null;
    }

    audioContext =
      new AudioCtx();

  }

  if (
    audioContext.state ===
    "suspended"
  ) {

    audioContext.resume()
      .catch(() => {});

  }

  return audioContext;

}


function playTone(
  frequency,
  duration,
  type = "sine",
  volume = 0.04
) {

  const ctx =
    getAudioContext();

  if (!ctx) {
    return;
  }

  try {

    const oscillator =
      ctx.createOscillator();

    const gain =
      ctx.createGain();

    oscillator.type =
      type;

    oscillator.frequency.value =
      frequency;

    gain.gain.setValueAtTime(
      volume,
      ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();

    oscillator.stop(
      ctx.currentTime + duration
    );

  }
  catch (error) {

    console.warn(
      "Audio error:",
      error
    );

  }

}


function moveSound() {

  playTone(
    520,
    0.07,
    "sine",
    0.025
  );

}


function correctSound() {

  playTone(
    660,
    0.12,
    "sine",
    0.05
  );

  setTimeout(
    () => {

      playTone(
        880,
        0.18,
        "sine",
        0.05
      );

    },
    90
  );

  setTimeout(
    () => {

      playTone(
        1100,
        0.20,
        "sine",
        0.04
      );

    },
    180
  );

}


function wrongSound() {

  playTone(
    220,
    0.12,
    "triangle",
    0.035
  );

}


/* =========================================================
   فشفشه‌باران
========================================================= */

function fireworks() {

  const container =
    document.createElement("div");

  container.className =
    "fireworks-layer";

  container.style.position =
    "fixed";

  container.style.inset =
    "0";

  container.style.pointerEvents =
    "none";

  container.style.zIndex =
    "9999";

  container.style.overflow =
    "hidden";

  document.body.appendChild(
    container
  );

  const symbols = [
    "🎉",
    "🎊",
    "✨",
    "⭐",
    "🌟",
    "💜",
    "🌸"
  ];

  for (
    let i = 0;
    i < 34;
    i++
  ) {

    const item =
      document.createElement("div");

    item.textContent =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];

    item.style.position =
      "absolute";

    item.style.left =
      Math.random() * 100 + "%";

    item.style.top =
      "-15%";

    item.style.fontSize =
      (18 + Math.random() * 18) + "px";

    item.style.transform =
      `rotate(${Math.random() * 360}deg)`;

    item.style.transition =
      "transform 1.4s ease, top 1.4s ease, opacity 1.4s ease";

    item.style.opacity =
      "1";

    container.appendChild(
      item
    );

    requestAnimationFrame(
      () => {

        item.style.top =
          (70 + Math.random() * 35) + "%";

        item.style.transform =
          `translateX(${
            -80 + Math.random() * 160
          }px)
           rotate(${
            Math.random() * 720
          }deg)`;

        item.style.opacity =
          "0";

      }
    );

  }

  setTimeout(
    () => {
      container.remove();
    },
    1800
  );

}


/* =========================================================
   بازخورد
========================================================= */

function showFeedback(
  message,
  good = true
) {

  feedback.textContent =
    message;

  feedback.className =
    "feedback " +
    (good ? "ok" : "no");

  if (good) {

    feedback.classList.add(
      "success-animation"
    );

  }

}


/* =========================================================
   امتیاز
========================================================= */

function updateScore() {

  scoreLabel.textContent =
    `امتیاز: ${score}`;

}


/* =========================================================
   شروع بازی
========================================================= */

function startGame() {

  ensureStudentNameInput();

  studentName =
    studentNameInput.value.trim();

  if (!studentName) {

    studentNameInput.focus();

    studentNameInput.style.borderColor =
      "#ef6262";

    studentNameInput.placeholder =
      "اول نام زیبایت را وارد کن 🌸";

    setTimeout(
      () => {

        studentNameInput.style.borderColor =
          "";

      },
      900
    );

    return;

  }

  getAudioContext();

  level = 0;

  score = 0;

  Object.keys(
    stageStates
  ).forEach(
    key => {
      delete stageStates[key];
    }
  );

  showScreen(game);

  renderLevel();

}


/* =========================================================
   نمایش مرحله
========================================================= */

function renderLevel() {

  const current =
    levels[level];

  if (!current) {
    return;
  }

  levelLabel.textContent =
    `مرحله ${level + 1} از ${levels.length}`;

  progressBar.style.width =
    `${((level + 1) / levels.length) * 100}%`;

  typeBadge.textContent =
    current.badge || "";

  questionText.textContent =
    current.question || "";

  instruction.textContent =
    current.instruction || "";

  feedback.textContent =
    "";

  feedback.className =
    "feedback";

  patternArea.innerHTML =
    "";

  choices.innerHTML =
    "";

  choicesTitle.classList.add(
    "hidden"
  );

  prevBtn.disabled =
    level === 0;

  nextBtn.disabled =
    false;

  activeDrag =
    null;

  activeReorder =
    null;

  if (
    current.type ===
    "sample"
  ) {

    renderSample(current);

  }

  else if (
    current.type ===
    "missing"
  ) {

    renderMissing(current);

  }

  else if (
    current.type ===
    "reorder"
  ) {

    renderReorder(current);

  }

  else if (
    current.type ===
    "remove"
  ) {

    renderRemove(current);

  }

  else if (
    current.type ===
    "place"
  ) {

    renderPlace(current);

  }

  else if (
    current.type ===
    "grid"
  ) {

    renderGrid(current);

  }

  updateScore();

}


/* =========================================================
   ردیف الگو
========================================================= */

function buildPatternRow(
  pattern
) {

  const row =
    document.createElement("div");

  row.className =
    "pattern-row";

  pattern.forEach(
    (piece, index) => {

      const slot =
        document.createElement("div");

      slot.className =
        "slot";

      slot.dataset.index =
        index;

      if (piece) {

        slot.innerHTML =
          shapeHTML(piece);

      }

      else {

        slot.classList.add(
          "missing"
        );

        slot.innerHTML =
          "?";

      }

      row.appendChild(
        slot
      );

    }
  );

  return row;

}


/* =========================================================
   نمونه
========================================================= */

function renderSample(data) {

  const row =
    buildPatternRow(
      data.pattern
    );

  patternArea.appendChild(
    row
  );

  showFeedback(
    "حالا خودت امتحان کن 🌸",
    true
  );

}


/* =========================================================
   جای خالی
========================================================= */

function renderMissing(data) {

  const state =
    getStageState(level);

  const row =
    buildPatternRow(
      data.pattern
    );

  patternArea.appendChild(
    row
  );

  choicesTitle.classList.remove(
    "hidden"
  );

  renderChoices(data);

  attachMissingDrop(
    row,
    data
  );

  if (state.solved) {

    const missingIndex =
      data.pattern.findIndex(
        piece => piece === null
      );

    const slot =
      row.querySelector(
        `.slot[data-index="${missingIndex}"]`
      );

    if (slot) {

      slot.classList.remove(
        "missing"
      );

      slot.classList.add(
        "correct"
      );

      slot.innerHTML =
        shapeHTML(
          data.choices[
            data.answer
          ]
        );

    }

    disableChoices();

    showFeedback(
      "این مرحله را درست حل کرده‌ای 🌟",
      true
    );

  }

}


/* =========================================================
   گزینه‌ها
========================================================= */

function renderChoices(data) {

  choices.innerHTML =
    "";

  data.choices.forEach(
    (piece, index) => {

      const choice =
        document.createElement("div");

      choice.className =
        "choice";

      choice.dataset.index =
        index;

      choice.innerHTML =
        shapeHTML(piece);

      choice.setAttribute(
        "draggable",
        "true"
      );

      choices.appendChild(
        choice
      );

      attachDrag(
        choice,
        data
      );

    }
  );

}


/* =========================================================
   Drag گزینه‌ها
========================================================= */

function attachDrag(
  choice,
  data
) {

  choice.addEventListener(
    "dragstart",
    event => {

      activeDrag = {
        index: Number(
          choice.dataset.index
        ),
        data
      };

      choice.classList.add(
        "dragging"
      );

      moveSound();

    }
  );


  choice.addEventListener(
    "dragend",
    () => {

      choice.classList.remove(
        "dragging"
      );

      activeDrag =
        null;

    }
  );


  choice.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      activeDrag = {
        index: Number(
          choice.dataset.index
        ),
        data
      };

      choice.classList.add(
        "dragging"
      );

      moveSound();

      try {
        choice.setPointerCapture(
          event.pointerId
        );
      }
      catch (_) {}

    }
  );


  choice.addEventListener(
    "pointermove",
    event => {

      if (
        !activeDrag ||
        activeDrag.data !== data
      ) {
        return;
      }

      const target =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );

      const slot =
        target?.closest(
          ".slot.missing"
        );

      document
        .querySelectorAll(
          ".slot.missing"
        )
        .forEach(
          item =>
            item.classList.remove(
              "over"
            )
        );

      if (slot) {

        slot.classList.add(
          "over"
        );

      }

    }
  );


  choice.addEventListener(
    "pointerup",
    event => {

      if (!activeDrag) {
        return;
      }

      event.preventDefault();

      const target =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );

      const slot =
        target?.closest(
          ".slot.missing"
        );

      choice.classList.remove(
        "dragging"
      );

      if (slot) {

        handleDrop(
          Number(
            slot.dataset.index
          ),
          data
        );

      }

      activeDrag =
        null;

    }
  );

}


/* =========================================================
   محل جای خالی
========================================================= */

function attachMissingDrop(
  row,
  data
) {

  row.querySelectorAll(
    ".slot.missing"
  ).forEach(
    slot => {

      slot.addEventListener(
        "dragover",
        event => {

          event.preventDefault();

          slot.classList.add(
            "over"
          );

        }
      );

      slot.addEventListener(
        "dragleave",
        () => {

          slot.classList.remove(
            "over"
          );

        }
      );

      slot.addEventListener(
        "drop",
        event => {

          event.preventDefault();

          slot.classList.remove(
            "over"
          );

          handleDrop(
            Number(
              slot.dataset.index
            ),
            data
          );

        }
      );

    }
  );

}


/* =========================================================
   پاسخ جای خالی
========================================================= */

function handleDrop(
  slotIndex,
  data
) {

  if (!activeDrag) {
    return;
  }

  const chosenIndex =
    activeDrag.index;

  const state =
    getStageState(level);

  if (
    chosenIndex ===
    data.answer
  ) {

    const correctPiece =
      data.choices[
        data.answer
      ];

    const slot =
      patternArea.querySelector(
        `.slot[data-index="${slotIndex}"]`
      );

    if (slot) {

      slot.classList.remove(
        "missing",
        "wrong"
      );

      slot.classList.add(
        "correct"
      );

      slot.innerHTML =
        shapeHTML(
          correctPiece
        );

    }

    if (!state.solved) {

      state.solved =
        true;

      score += 10;

      updateScore();

      showFeedback(
        "آفرین! درست پیدا کردی 🌟",
        true
      );

      correctSound();

      fireworks();

      disableChoices();

    }

  }

  else {

    wrongSlot(
      patternArea.querySelector(
        ".slot.missing"
      )
    );

  }

  activeDrag =
    null;

}


/* =========================================================
   اشتباه
========================================================= */

function wrongSlot(
  slot = null
) {

  const missing =
    slot ||
    patternArea.querySelector(
      ".slot.missing"
    );

  if (missing) {

    missing.classList.add(
      "wrong"
    );

    setTimeout(
      () => {

        missing.classList.remove(
          "wrong"
        );

      },
      350
    );

  }

  showFeedback(
    "یک بار دیگر با دقت نگاه کن 👀",
    false
  );

  wrongSound();

}


/* =========================================================
   غیرفعال کردن گزینه‌ها
========================================================= */

function disableChoices() {

  choices
    .querySelectorAll(
      ".choice"
    )
    .forEach(
      choice => {

        choice.style.pointerEvents =
          "none";

        choice.style.opacity =
          ".55";

      }
    );

}


/* =========================================================
   وضعیت هر مرحله
========================================================= */

function getStageState(index) {

  if (!stageStates[index]) {

    stageStates[index] = {

      solved: false,

      scoreAdded: false,

      pieces: null,

      answers: {},

      gridAnswers: {}

    };

  }

  return stageStates[index];

}


/* =========================================================
   مرتب‌سازی
========================================================= */

function renderReorder(
  data
) {

  const state =
    getStageState(level);

  if (!state.pieces) {

    state.pieces =
      data.pieces.map(
        clonePiece
      );

  }

  const row =
    document.createElement("div");

  row.className =
    "pattern-row";

  state.pieces.forEach(
    (piece, index) => {

      const slot =
        document.createElement("div");

      slot.className =
        "slot reorder-slot";

      slot.dataset.index =
        index;

      slot.innerHTML =
        shapeHTML(piece);

      slot.draggable =
        true;

      row.appendChild(
        slot
      );

    }
  );

  patternArea.appendChild(
    row
  );

  attachReorderDrag(
    row,
    data
  );

  if (state.solved) {

    row
      .querySelectorAll(
        ".slot"
      )
      .forEach(
        slot =>
          slot.classList.add(
            "correct"
          )
      );

  }

}


/* =========================================================
   جابه‌جایی
========================================================= */

function attachReorderDrag(
  row,
  data
) {

  row.querySelectorAll(
    ".reorder-slot"
  ).forEach(
    slot => {

      slot.addEventListener(
        "dragstart",
        () => {

          activeReorder =
            Number(
              slot.dataset.index
            );

          slot.classList.add(
            "dragging"
          );

          moveSound();

        }
      );


      slot.addEventListener(
        "dragend",
        () => {

          slot.classList.remove(
            "dragging"
          );

          activeReorder =
            null;

        }
      );


      slot.addEventListener(
        "dragover",
        event => {

          event.preventDefault();

          slot.classList.add(
            "over"
          );

        }
      );


      slot.addEventListener(
        "dragleave",
        () => {

          slot.classList.remove(
            "over"
          );

        }
      );


      slot.addEventListener(
        "drop",
        event => {

          event.preventDefault();

          slot.classList.remove(
            "over"
          );

          if (
            activeReorder ===
            null
          ) {
            return;
          }

          const targetIndex =
            Number(
              slot.dataset.index
            );

          if (
            activeReorder ===
            targetIndex
          ) {
            return;
          }

          swapReorder(
            activeReorder,
            targetIndex,
            data
          );

          activeReorder =
            null;

        }
      );


      slot.addEventListener(
        "pointerdown",
        event => {

          event.preventDefault();

          activeReorder =
            Number(
              slot.dataset.index
            );

          slot.classList.add(
            "dragging"
          );

          try {

            slot.setPointerCapture(
              event.pointerId
            );

          }
          catch (_) {}

        }
      );


      slot.addEventListener(
        "pointermove",
        event => {

          if (
            activeReorder ===
            null
          ) {
            return;
          }

          const target =
            document.elementFromPoint(
              event.clientX,
              event.clientY
            );

          row
            .querySelectorAll(
              ".reorder-slot"
            )
            .forEach(
              item =>
                item.classList.remove(
                  "over"
                )
            );

          const targetSlot =
            target?.closest(
              ".reorder-slot"
            );

          if (
            targetSlot &&
            targetSlot !== slot
          ) {

            targetSlot.classList.add(
              "over"
            );

          }

        }
      );


      slot.addEventListener(
        "pointerup",
        event => {

          if (
            activeReorder ===
            null
          ) {
            return;
          }

          event.preventDefault();

          const target =
            document.elementFromPoint(
              event.clientX,
              event.clientY
            );

          const targetSlot =
            target?.closest(
              ".reorder-slot"
            );

          const from =
            activeReorder;

          activeReorder =
            null;

          row
            .querySelectorAll(
              ".reorder-slot"
            )
            .forEach(
              item =>
                item.classList.remove(
                  "over",
                  "dragging"
                )
            );

          if (!targetSlot) {
            return;
          }

          const to =
            Number(
              targetSlot.dataset.index
            );

          if (from !== to) {

            swapReorder(
              from,
              to,
              data
            );

          }

        }
      );

    }
  );

}


/* =========================================================
   تعویض دو شکل
========================================================= */

function swapReorder(
  from,
  to,
  data
) {

  const state =
    getStageState(level);

  const temp =
    state.pieces[from];

  state.pieces[from] =
    state.pieces[to];

  state.pieces[to] =
    temp;

  moveSound();

  renderLevelWithoutReset();

  checkReorder(data);

}


/* =========================================================
   رندر مجدد reorder
========================================================= */

function renderLevelWithoutReset() {

  const current =
    levels[level];

  patternArea.innerHTML =
    "";

  if (
    current.type ===
    "reorder"
  ) {

    renderReorder(
      current
    );

  }

}


/* =========================================================
   بررسی مرتب‌سازی
========================================================= */

function checkReorder(
  data
) {

  const state =
    getStageState(level);

  let correct =
    false;


  /* -------------------------------------------------------
     مرحله ۹:
     هر ترتیب سه‌تایی منظم با سه شکل متفاوت
  ------------------------------------------------------- */

  if (
    data.flexiblePattern
  ) {

    const pieces =
      state.pieces;

    if (
      pieces.length === 6
    ) {

      const firstGroup =
        pieces.slice(0, 3);

      const secondGroup =
        pieces.slice(3, 6);

      const uniqueShapes =
        new Set(
          firstGroup.map(
            piece =>
              `${piece.type}-${piece.color}`
          )
        );

      const threeDifferent =
        uniqueShapes.size === 3;

      const repeated =
        samePiece(
          firstGroup[0],
          secondGroup[0]
        ) &&
        samePiece(
          firstGroup[1],
          secondGroup[1]
        ) &&
        samePiece(
          firstGroup[2],
          secondGroup[2]
        );

      correct =
        threeDifferent &&
        repeated;

    }

  }


  /* -------------------------------------------------------
     سایر مراحل مرتب‌سازی
  ------------------------------------------------------- */

  else {

    correct =
      Array.isArray(
        data.target
      ) &&
      state.pieces.length ===
        data.target.length &&
      state.pieces.every(
        (piece, index) =>
          samePiece(
            piece,
            data.target[index]
          )
      );

  }


  if (!correct) {

    showFeedback(
      "هنوز الگو کامل نشده است؛ دوباره تلاش کن.",
      false
    );

    return;

  }


  if (state.solved) {
    return;
  }


  state.solved =
    true;

  score += 10;

  updateScore();

  showFeedback(
    "عالیه! یک الگوی منظم ساختی 🎉",
    true
  );

  correctSound();

  fireworks();

  patternArea
    .querySelectorAll(
      ".slot"
    )
    .forEach(
      slot =>
        slot.classList.add(
          "correct"
        )
    );

}


/* =========================================================
   حذف شکل اضافه
========================================================= */

function renderRemove(
  data
) {

  const state =
    getStageState(level);

  const row =
    document.createElement("div");

  row.className =
    "pattern-row";

  data.pattern.forEach(
    (piece, index) => {

      const slot =
        document.createElement("div");

      slot.className =
        "slot";

      slot.dataset.index =
        index;

      slot.innerHTML =
        shapeHTML(piece);

      slot.style.cursor =
        "pointer";


      if (
        state.solved &&
        index === data.removeIndex
      ) {

        slot.style.opacity =
          "0.15";

      }


      slot.addEventListener(
        "click",
        () => {

          if (state.solved) {
            return;
          }

          if (
            index ===
            data.removeIndex
          ) {

            state.solved =
              true;

            slot.style.transform =
              "scale(0)";

            slot.style.opacity =
              "0";

            setTimeout(
              () => {
                slot.remove();
              },
              250
            );

            score += 10;

            updateScore();

            showFeedback(
              "آفرین! شکل اضافه را پیدا کردی 🎉",
              true
            );

            correctSound();

            fireworks();

          }

          else {

            slot.classList.add(
              "wrong"
            );

            setTimeout(
              () => {

                slot.classList.remove(
                  "wrong"
                );

              },
              350
            );

            showFeedback(
              "نه، دوباره با دقت نگاه کن 👀",
              false
            );

            wrongSound();

          }

        }
      );

      row.appendChild(
        slot
      );

    }
  );

  patternArea.appendChild(
    row
  );

}


/* =========================================================
   دو جای خالی
========================================================= */

function renderPlace(
  data
) {

  const state =
    getStageState(level);

  const row =
    buildPatternRow(
      data.pattern
    );

  patternArea.appendChild(
    row
  );

  choicesTitle.classList.remove(
    "hidden"
  );

  choices.innerHTML =
    "";

  data.choices.forEach(
    (piece, index) => {

      const choice =
        document.createElement("div");

      choice.className =
        "choice";

      choice.dataset.index =
        index;

      choice.innerHTML =
        shapeHTML(piece);

      choice.setAttribute(
        "draggable",
        "true"
      );

      choices.appendChild(
        choice
      );

      attachPlaceChoice(
        choice,
        data
      );

    }
  );


  /* بازگردانی پاسخ‌های قبلی */

  const missingIndexes =
    data.pattern
      .map(
        (piece, index) =>
          piece === null
            ? index
            : -1
      )
      .filter(
        index => index !== -1
      );


  missingIndexes.forEach(
    (patternIndex, position) => {

      if (
        state.answers[position] ===
        undefined
      ) {
        return;
      }

      const chosen =
        state.answers[position];

      const slot =
        row.querySelector(
          `.slot[data-index="${patternIndex}"]`
        );

      if (!slot) {
        return;
      }

      slot.classList.remove(
        "missing"
      );

      slot.classList.add(
        "correct"
      );

      slot.innerHTML =
        shapeHTML(
          data.choices[chosen]
        );

    }
  );


  if (state.solved) {

    disableChoices();

    showFeedback(
      "این مرحله را درست حل کرده‌ای 🌟",
      true
    );

  }

}


/* =========================================================
   انتخاب برای دو جای خالی
========================================================= */

function attachPlaceChoice(
  choice,
  data
) {

  choice.addEventListener(
    "dragstart",
    () => {

      activeDrag = {
        index: Number(
          choice.dataset.index
        ),
        data
      };

      choice.classList.add(
        "dragging"
      );

      moveSound();

    }
  );


  choice.addEventListener(
    "dragend",
    () => {

      choice.classList.remove(
        "dragging"
      );

    }
  );


  choice.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      activeDrag = {
        index: Number(
          choice.dataset.index
        ),
        data
      };

      choice.classList.add(
        "dragging"
      );

      moveSound();

      try {

        choice.setPointerCapture(
          event.pointerId
        );

      }
      catch (_) {}

    }
  );


  choice.addEventListener(
    "pointermove",
    event => {

      if (
        !activeDrag ||
        activeDrag.data !== data
      ) {
        return;
      }

      const target =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );

      document
        .querySelectorAll(
          ".slot.missing"
        )
        .forEach(
          slot =>
            slot.classList.remove(
              "over"
            )
        );

      const slot =
        target?.closest(
          ".slot.missing"
        );

      if (slot) {

        slot.classList.add(
          "over"
        );

      }

    }
  );


  choice.addEventListener(
    "pointerup",
    event => {

      if (!activeDrag) {
        return;
      }

      event.preventDefault();

      const target =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );

      const slot =
        target?.closest(
          ".slot.missing"
        );

      choice.classList.remove(
        "dragging"
      );

      if (slot) {

        placeAnswer(
          Number(
            slot.dataset.index
          ),
          data
        );

      }

      activeDrag =
        null;

    }
  );

}


/* =========================================================
   پاسخ دو جای خالی
========================================================= */

function placeAnswer(
  slotIndex,
  data
) {

  if (!activeDrag) {
    return;
  }

  const chosen =
    activeDrag.index;

  const state =
    getStageState(level);

  const missingIndexes =
    data.pattern
      .map(
        (piece, index) =>
          piece === null
            ? index
            : -1
      )
      .filter(
        index => index !== -1
      );

  const placeNumber =
    missingIndexes.indexOf(
      slotIndex
    );

  if (
    placeNumber === -1
  ) {

    activeDrag =
      null;

    return;

  }


  if (
    state.answers[
      placeNumber
    ] !== undefined
  ) {

    activeDrag =
      null;

    return;

  }


  const correct =
    data.answers[
      placeNumber
    ];


  if (
    chosen === correct
  ) {

    state.answers[
      placeNumber
    ] = chosen;

    const slot =
      patternArea.querySelector(
        `.slot[data-index="${slotIndex}"]`
      );

    if (slot) {

      slot.classList.remove(
        "missing"
      );

      slot.classList.add(
        "correct"
      );

      slot.innerHTML =
        shapeHTML(
          data.choices[
            chosen
          ]
        );

    }

    correctSound();


    const allCorrect =
      data.answers.every(
        (answer, index) =>
          state.answers[index] ===
          answer
      );


    if (
      allCorrect &&
      !state.solved
    ) {

      state.solved =
        true;

      score += 20;

      updateScore();

      showFeedback(
        "وااای! هر دو شکل را درست پیدا کردی! 🎉🌟",
        true
      );

      correctSound();

      fireworks();

      disableChoices();

    }

    else {

      showFeedback(
        "آفرین! یکی را درست پیدا کردی 🌟",
        true
      );

    }

  }

  else {

    const slot =
      patternArea.querySelector(
        `.slot[data-index="${slotIndex}"]`
      );

    wrongSlot(slot);

  }

  activeDrag =
    null;

}


/* =========================================================
   الگوهای شطرنجی
========================================================= */

function injectGridStyles() {

  if (
    document.getElementById(
      "gridPatternRuntimeStyle"
    )
  ) {
    return;
  }

  const style =
    document.createElement("style");

  style.id =
    "gridPatternRuntimeStyle";

  style.textContent = `

    .grid-pattern-wrap {
      width: 100%;
      display: flex;
      justify-content: center;
      overflow-x: auto;
      padding: 8px 2px 14px;
    }

    .grid-pattern {
      display: grid;
      gap: clamp(4px, 1vw, 8px);
      width: min(620px, 100%);
      direction: ltr;
    }

    .grid-cell {
      aspect-ratio: 1 / 1;
      min-width: 0;
      border: 3px solid #eadff4;
      border-radius: 12px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      touch-action: none;
      transition: .18s ease;
    }

    .grid-cell.missing {
      border: 3px dashed #7438c8;
      background: #faf5ff;
      color: #7438c8;
      font-size: clamp(22px, 5vw, 34px);
      font-weight: 900;
    }

    .grid-cell.over {
      transform: scale(1.06);
      border-color: #7438c8;
      background: #f3ebff;
    }

    .grid-cell.correct {
      border-color: #38a169;
      background: #edfff2;
    }

    .grid-cell.wrong {
      border-color: #ef6262;
      background: #fff0f0;
      animation: gridShake .25s ease;
    }

    .grid-cell .shape {
      width: 70%;
      height: 70%;
    }

    @keyframes gridShake {
      0%,100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-5px);
      }
      75% {
        transform: translateX(5px);
      }
    }

    @media (max-width: 600px) {

      .grid-pattern-wrap {
        padding-left: 0;
        padding-right: 0;
      }

      .grid-cell {
        border-width: 2px;
        border-radius: 9px;
      }

    }

  `;

  document.head.appendChild(
    style
  );

}


/* =========================================================
   نمایش مرحله شطرنجی
========================================================= */

function renderGrid(data) {

  const state =
    getStageState(level);

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "grid-pattern-wrap";

  const grid =
    document.createElement("div");

  grid.className =
    "grid-pattern";

  grid.style.gridTemplateColumns =
    `repeat(${data.cols}, minmax(0, 1fr))`;


  data.pattern.forEach(
    (piece, index) => {

      const cell =
        document.createElement("div");

      cell.className =
        "grid-cell";

      cell.dataset.index =
        index;


      if (
        data.missing.includes(index)
      ) {

        cell.classList.add(
          "missing",
          "drop-target"
        );

        cell.textContent =
          "?";

      }

      else {

        cell.innerHTML =
          shapeHTML(piece);

      }


      grid.appendChild(
        cell
      );

    }
  );


  wrapper.appendChild(
    grid
  );

  patternArea.appendChild(
    wrapper
  );


  choicesTitle.classList.remove(
    "hidden"
  );


  renderGridChoices(
    data
  );


  attachGridDrop(
    grid,
    data
  );


  restoreGridState(
    data
  );

}


/* =========================================================
   گزینه‌های شطرنجی
========================================================= */

function renderGridChoices(
  data
) {

  choices.innerHTML =
    "";

  data.choices.forEach(
    (piece, optionIndex) => {

      const choice =
        document.createElement("div");

      choice.className =
        "choice";

      choice.dataset.index =
        optionIndex;

      choice.innerHTML =
        shapeHTML(piece);

      choice.setAttribute(
        "draggable",
        "true"
      );

      choices.appendChild(
        choice
      );

      attachGridChoice(
        choice,
        data
      );

    }
  );

}


/* =========================================================
   کشیدن گزینه شطرنجی
========================================================= */

function attachGridChoice(
  choice,
  data
) {

  choice.addEventListener(
    "dragstart",
    () => {

      activeDrag = {
        index: Number(
          choice.dataset.index
        ),
        data,
        grid: true
      };

      choice.classList.add(
        "dragging"
      );

      moveSound();

    }
  );


  choice.addEventListener(
    "dragend",
    () => {

      choice.classList.remove(
        "dragging"
      );

      activeDrag =
        null;

    }
  );


  choice.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      activeDrag = {
        index: Number(
          choice.dataset.index
        ),
        data,
        grid: true
      };

      choice.classList.add(
        "dragging"
      );

      moveSound();

      try {

        choice.setPointerCapture(
          event.pointerId
        );

      }
      catch (_) {}

    }
  );


  choice.addEventListener(
    "pointermove",
    event => {

      if (
        !activeDrag ||
        !activeDrag.grid
      ) {
        return;
      }

      const target =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );

      document
        .querySelectorAll(
          ".grid-cell.missing"
        )
        .forEach(
          cell =>
            cell.classList.remove(
              "over"
            )
        );

      const cell =
        target?.closest(
          ".grid-cell.missing"
        );

      if (cell) {

        cell.classList.add(
          "over"
        );

      }

    }
  );


  choice.addEventListener(
    "pointerup",
    event => {

      if (
        !activeDrag ||
        !activeDrag.grid
      ) {
        return;
      }

      event.preventDefault();

      const target =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );

      const cell =
        target?.closest(
          ".grid-cell.missing"
        );

      choice.classList.remove(
        "dragging"
      );

      if (cell) {

        handleGridDrop(
          Number(
            cell.dataset.index
          ),
          data
        );

      }

      activeDrag =
        null;

    }
  );

}


/* =========================================================
   دراپ شطرنجی برای کامپیوتر
========================================================= */

function attachGridDrop(
  grid,
  data
) {

  grid.querySelectorAll(
    ".grid-cell.missing"
  ).forEach(
    cell => {

      cell.addEventListener(
        "dragover",
        event => {

          event.preventDefault();

          cell.classList.add(
            "over"
          );

        }
      );


      cell.addEventListener(
        "dragleave",
        () => {

          cell.classList.remove(
            "over"
          );

        }
      );


      cell.addEventListener(
        "drop",
        event => {

          event.preventDefault();

          cell.classList.remove(
            "over"
          );

          handleGridDrop(
            Number(
              cell.dataset.index
            ),
            data
          );

        }
      );

    }
  );

}


/* =========================================================
   پاسخ شطرنجی
========================================================= */

function handleGridDrop(
  cellIndex,
  data
) {

  if (
    !activeDrag ||
    !activeDrag.grid
  ) {
    return;
  }

  if (
    !data.missing.includes(
      cellIndex
    )
  ) {

    activeDrag =
      null;

    return;

  }


  const state =
    getStageState(level);


  /* اگر قبلاً جواب داده شده */
  if (
    state.gridAnswers[cellIndex] !==
    undefined
  ) {

    activeDrag =
      null;

    return;

  }


  const chosenIndex =
    activeDrag.index;

  const correctIndex =
    data.answers[cellIndex];


  const cell =
    patternArea.querySelector(
      `.grid-cell[data-index="${cellIndex}"]`
    );


  if (
    chosenIndex ===
    correctIndex
  ) {

    state.gridAnswers[
      cellIndex
    ] = chosenIndex;


    if (cell) {

      cell.classList.remove(
        "missing",
        "wrong",
        "over"
      );

      cell.classList.add(
        "correct"
      );

      cell.innerHTML =
        shapeHTML(
          data.choices[
            chosenIndex
          ]
        );

    }


    correctSound();


    const allCorrect =
      data.missing.every(
        index =>
          state.gridAnswers[index] !==
          undefined &&
          state.gridAnswers[index] ===
          data.answers[index]
      );


    if (
      allCorrect &&
      !state.solved
    ) {

      state.solved =
        true;

      score +=
        data.missing.length * 10;

      updateScore();

      showFeedback(
        "آفرین! الگوی شطرنجی را کامل کردی 🎉🌟",
        true
      );

      correctSound();

      fireworks();

      disableChoices();

    }

    else {

      showFeedback(
        "آفرین! این خانه درست شد 👏",
        true
      );

    }

  }

  else {

    if (cell) {

      cell.classList.add(
        "wrong"
      );

      setTimeout(
        () => {

          cell.classList.remove(
            "wrong"
          );

        },
        400
      );

    }

    showFeedback(
      "این شکل درست نیست؛ دوباره به الگو نگاه کن 👀",
      false
    );

    wrongSound();

  }


  activeDrag =
    null;

}


/* =========================================================
   بازگردانی پاسخ‌های شطرنجی
========================================================= */

function restoreGridState(
  data
) {

  const state =
    getStageState(level);


  data.missing.forEach(
    index => {

      if (
        state.gridAnswers[index] ===
        undefined
      ) {
        return;
      }


      const optionIndex =
        state.gridAnswers[index];


      const cell =
        patternArea.querySelector(
          `.grid-cell[data-index="${index}"]`
        );


      if (!cell) {
        return;
      }


      cell.classList.remove(
        "missing"
      );

      cell.classList.add(
        "correct"
      );

      cell.innerHTML =
        shapeHTML(
          data.choices[
            optionIndex
          ]
        );

    }
  );


  if (state.solved) {

    disableChoices();

    showFeedback(
      "این الگوی شطرنجی را درست کامل کرده‌ای 🌟",
      true
    );

  }

}


/* =========================================================
   مرحله بعد
========================================================= */

function goNext() {

  if (
    level <
    levels.length - 1
  ) {

    level++;

    renderLevel();

  }

  else {

    finishGame();

  }

}


/* =========================================================
   مرحله قبل
========================================================= */

function goPrevious() {

  if (level > 0) {

    level--;

    renderLevel();

  }

}


/* =========================================================
   خروج
========================================================= */

function exitGame() {

  showScreen(
    cover
  );

  feedback.textContent =
    "";

  choices.innerHTML =
    "";

  patternArea.innerHTML =
    "";

  activeDrag =
    null;

  activeReorder =
    null;

}


/* =========================================================
   پایان بازی
========================================================= */

function finishGame() {

  showScreen(
    finish
  );

  finalScore.textContent =
    `${studentName} عزیز، امتیازت شد: ${score} 🌟`;

  finishMessage.textContent =
    "تو با دقت و فکر کردن، الگوهای منظم را پیدا کردی!";

  fireworks();

}


/* =========================================================
   شروع دوباره
========================================================= */

function restartGame() {

  level = 0;

  score = 0;

  Object.keys(
    stageStates
  ).forEach(
    key => {
      delete stageStates[key];
    }
  );

  activeDrag =
    null;

  activeReorder =
    null;

  showScreen(
    game
  );

  renderLevel();

}


/* =========================================================
   دکمه‌ها
========================================================= */

if (startBtn) {

  startBtn.addEventListener(
    "click",
    startGame
  );

}


if (restartBtn) {

  restartBtn.addEventListener(
    "click",
    restartGame
  );

}


if (exitBtn) {

  exitBtn.addEventListener(
    "click",
    exitGame
  );

}


if (prevBtn) {

  prevBtn.addEventListener(
    "click",
    goPrevious
  );

}


if (nextBtn) {

  nextBtn.addEventListener(
    "click",
    goNext
  );

}


/* =========================================================
   ورود با Enter
========================================================= */

ensureStudentNameInput();

if (studentNameInput) {

  studentNameInput.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Enter"
      ) {

        startGame();

      }

    }
  );

}


/* =========================================================
   جلوگیری از رفتار ناخواسته لمس
========================================================= */

document.addEventListener(
  "touchmove",
  event => {

    if (
      activeDrag ||
      activeReorder !== null
    ) {

      event.preventDefault();

    }

  },
  {
    passive: false
  }
);


/* =========================================================
   فعال‌سازی CSS شطرنجی
========================================================= */

injectGridStyles();


/* =========================================================
   پایان
========================================================= */
