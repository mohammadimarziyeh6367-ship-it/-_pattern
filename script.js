/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   نسخه اصلاح شده
========================================================= */


/* =========================================================
   عناصر صفحه
========================================================= */

const startScreen =
  document.getElementById("startScreen");

const gameScreen =
  document.getElementById("gameScreen");

const finishScreen =
  document.getElementById("finishScreen");

const studentNameInput =
  document.getElementById("studentName");

const startBtn =
  document.getElementById("startBtn");

const nextBtn =
  document.getElementById("nextBtn");

const prevBtn =
  document.getElementById("prevBtn");

const checkBtn =
  document.getElementById("checkBtn");

const restartBtn =
  document.getElementById("restartBtn");

const stageNumber =
  document.getElementById("stageNumber");

const scoreText =
  document.getElementById("scoreText");

const stageTitle =
  document.getElementById("stageTitle");

const questionText =
  document.getElementById("questionText");

const instructionText =
  document.getElementById("instructionText");

const mainGrid =
  document.getElementById("mainGrid");

const repeatGrid =
  document.getElementById("repeatGrid");

const palette =
  document.getElementById("palette");

const message =
  document.getElementById("message");

const finalScore =
  document.getElementById("finalScore");

const finishText =
  document.getElementById("finishText");


/* =========================================================
   متغیرها
========================================================= */

let currentStage = 0;
let score = 0;
let studentName = "";
let selectedColor = null;


/* =========================================================
   رنگ‌ها
========================================================= */

const colors = {

  green: "#53c878",

  red: "#f05a5a",

  blue: "#4d9cff",

  yellow: "#ffd84d",

  orange: "#ff9f43",

  pink: "#ff77a8",

  purple: "#7438c8"

};


/* =========================================================
   مراحل بازی
========================================================= */

const stages = [

  /* =====================================================
     مرحله 1
  ====================================================== */

  {
    type: "sample",

    title: "الگو را پیدا کن",

    question:
      "به الگو نگاه کن و آن را ادامه بده.",

    instruction:
      "الگو را بخوان و خانه‌های خالی را کامل کن.",

    rows: 1,
    cols: 8,

    start: [
      "blue",
      "yellow",
      "blue",
      "yellow",
      null,
      null,
      null,
      null
    ],

    answer: [
      "blue",
      "yellow",
      "blue",
      "yellow",
      "blue",
      "yellow",
      "blue",
      "yellow"
    ]
  },


  /* =====================================================
     مرحله 2
  ====================================================== */

  {
    type: "missing",

    title: "الگوی رنگی",

    question:
      "الگو را بخوان و ادامه بده.",

    instruction:
      "خانه‌های خالی را با رنگ درست کامل کن.",

    rows: 1,
    cols: 9,

    start: [
      "green",
      "green",
      "red",
      null,
      "green",
      "green",
      "red",
      null,
      null
    ],

    answer: [
      "green",
      "green",
      "red",
      "green",
      "green",
      "red",
      "green",
      "green",
      "red"
    ]
  },


  /* =====================================================
     مرحله 3
  ====================================================== */

  {
    type: "missing",

    title: "الگوی رنگی",

    question:
      "الگو را پیدا کن.",

    instruction:
      "خانه‌های خالی را با رنگ درست کامل کن.",

    rows: 1,
    cols: 8,

    start: [
      "yellow",
      "blue",
      "yellow",
      null,
      "yellow",
      "blue",
      null,
      null
    ],

    answer: [
      "yellow",
      "blue",
      "yellow",
      "blue",
      "yellow",
      "blue",
      "yellow",
      "blue"
    ]
  },


  /* =====================================================
     مرحله 4
  ====================================================== */

  {
    type: "missing",

    title: "الگو را بخوان",

    question:
      "چه رنگی بعد از سبز می‌آید؟",

    instruction:
      "با دقت الگو را بخوان و کاملش کن.",

    rows: 1,
    cols: 9,

    start: [
      "green",
      "red",
      "red",
      "green",
      null,
      "red",
      "green",
      null,
      null
    ],

    answer: [
      "green",
      "red",
      "red",
      "green",
      "red",
      "red",
      "green",
      "red",
      "red"
    ]
  },


  /* =====================================================
     مرحله 5
  ====================================================== */

  {
    type: "missing",

    title: "الگوی شاد",

    question:
      "الگو را ادامه بده.",

    instruction:
      "خانه‌های خالی را پیدا کن و رنگ درست را انتخاب کن.",

    rows: 1,
    cols: 10,

    start: [
      "blue",
      "blue",
      "yellow",
      null,
      "blue",
      "yellow",
      null,
      null,
      "yellow",
      null
    ],

    answer: [
      "blue",
      "blue",
      "yellow",
      "blue",
      "blue",
      "yellow",
      "blue",
      "blue",
      "yellow",
      "blue"
    ]
  },


  /* =====================================================
     مرحله 6
  ====================================================== */

  {
    type: "missing",

    title: "الگو را کامل کن",

    question:
      "کدام رنگ‌ها تکرار می‌شوند؟",

    instruction:
      "الگو را بخوان و خانه‌های خالی را کامل کن.",

    rows: 1,
    cols: 10,

    start: [
      "pink",
      "green",
      "pink",
      null,
      "pink",
      "green",
      null,
      null,
      "pink",
      null
    ],

    answer: [
      "pink",
      "green",
      "pink",
      "green",
      "pink",
      "green",
      "pink",
      "green",
      "pink",
      "green"
    ]
  },


  /* =====================================================
     مرحله 7
     الگو: سبز سبز قرمز
     سمت راست: دقیقاً ۶ ستون
     فقط سه خانه اول باید رنگ شوند.
  ====================================================== */

  {
    type: "textbook",

    title: "الگوی تکرارشونده",

    question:
      "الگوی تکرارشونده را ادامه بده.",

    instruction:
      "الگوی سمت چپ را کامل کن؛ سپس فقط یک مرتبه الگوی تکرارشونده را در جدول سمت راست رسم کن.",

    rows: 1,
    cols: 12,

    start: [
      "green",
      "green",
      "red",

      "green",
      "green",
      "red",

      "green",
      "green",
      null,

      null,
      null,
      null
    ],

    answer: [
      "green",
      "green",
      "red",

      "green",
      "green",
      "red",

      "green",
      "green",
      "red",

      "green",
      "green",
      "red"
    ],

    repeat: [
      "green",
      "green",
      "red"
    ],

    repeatSlots: 6
  },


  /* =====================================================
     مرحله 8
     الگو: آبی زرد
     سمت راست ۶ ستون
     فقط دو خانه اول رنگ می‌شوند.
  ====================================================== */

  {
    type: "textbook",

    title: "الگوی تکرارشونده",

    question:
      "الگوی تکرارشونده را پیدا کن.",

    instruction:
      "الگوی سمت چپ را کامل کن؛ سپس فقط یک مرتبه الگوی تکرارشونده را در سمت راست رسم کن.",

    rows: 1,
    cols: 12,

    start: [
      "blue",
      "yellow",

      "blue",
      "yellow",

      "blue",
      null,

      null,
      null,

      null,
      null,

      null,
      null
    ],

    answer: [
      "blue",
      "yellow",
      "blue",
      "yellow",
      "blue",
      "yellow",
      "blue",
      "yellow",
      "blue",
      "yellow",
      "blue",
      "yellow"
    ],

    repeat: [
      "blue",
      "yellow"
    ],

    repeatSlots: 6
  },


  /* =====================================================
     مرحله 9
     الگو: سبز قرمز قرمز
     سمت راست ۶ ستون
     فقط سه خانه اول رنگ می‌شوند.
  ====================================================== */

  {
    type: "textbook",

    title: "الگوی تکرارشونده",

    question:
      "الگو را بخوان و الگوی تکرارشونده را پیدا کن.",

    instruction:
      "اول سمت چپ را کامل کن؛ بعد فقط یک واحد کامل از الگو را در سمت راست رنگ کن.",

    rows: 1,
    cols: 12,

    start: [
      "green",
      "red",
      "red",

      "green",
      "red",
      "red",

      "green",
      null,
      null,

      null,
      null,
      null
    ],

    answer: [
      "green",
      "red",
      "red",

      "green",
      "red",
      "red",

      "green",
      "red",
      "red",

      "green",
      "red",
      "red"
    ],

    repeat: [
      "green",
      "red",
      "red"
    ],

    repeatSlots: 6
  },


  /* =====================================================
     مرحله 10
     الگوی شکل‌دار
     ===================================================== */

  {
    type: "finalFlower",

    title: "الگوی شکل‌دار",

    question:
      "الگوی خانه‌های رنگی را پیدا کن.",

    instruction:
      "خانه‌های خالی را کامل کن تا شکل با خودِ مربع‌های رنگی ساخته شود.",

    rows: 3,
    cols: 7,

    start: [

      "green", null, "green", null, "green", null, "green",

      null, "green", null, "red", null, "green", null,

      "green", null, "green", null, "green", null, "green"

    ],

    answer: [

      "green", "green", "green", "green", "green", "green", "green",

      "green", "green", "green", "red", "green", "green", "green",

      "green", "green", "green", "green", "green", "green", "green"

    ],

    /*
      سمت راست ۶ ستون و ۳ ردیف.
      فقط شکل موردنظر باید طبق الگوی تعریف‌شده
      رسم شود و خانه‌های اضافه خالی بمانند.
    */

    repeatRows: 3,
    repeatCols: 6,

    repeat: [

      "green", null, "green", null, "green", null,

      null, "green", null, "red", null, "green",

      "green", null, "green", null, "green", null

    ]
  },


  /* =====================================================
     مرحله 11
  ====================================================== */

  {
    type: "remove",

    title: "کدام شکل اضافه است؟",

    question:
      "با حذف کدام یک، الگو منظم می‌شود؟",

    instruction:
      "شکلی را که با الگو هماهنگ نیست، انتخاب کن.",

    rows: 1,
    cols: 8,

    start: [
      "blue",
      "yellow",
      "blue",
      "yellow",
      "red",
      "blue",
      "yellow",
      "blue"
    ],

    wrongIndex: 4
  },


  /* =====================================================
     مرحله 12
  ====================================================== */

  {
    type: "remove",

    title: "شکل ناهماهنگ",

    question:
      "کدام خانه با الگو هماهنگ نیست؟",

    instruction:
      "خانه‌ی ناهماهنگ را پیدا کن و روی آن بزن.",

    rows: 1,
    cols: 9,

    start: [
      "green",
      "red",
      "red",
      "green",
      "red",
      "blue",
      "green",
      "red",
      "red"
    ],

    wrongIndex: 5
  }

];


/* =========================================================
   صدا
========================================================= */

function playCorrectSound() {

  const AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!AudioContext) return;

  const ctx = new AudioContext();

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();

  const gain = ctx.createGain();

  osc1.frequency.value = 660;
  osc2.frequency.value = 880;

  osc1.type = "sine";
  osc2.type = "sine";

  osc1.connect(gain);
  osc2.connect(gain);

  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(
    0.001,
    ctx.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.18,
    ctx.currentTime + 0.03
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + 0.55
  );

  osc1.start();
  osc2.start();

  osc1.stop(ctx.currentTime + 0.55);
  osc2.stop(ctx.currentTime + 0.55);
}


function playWrongSound() {

  const AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!AudioContext) return;

  const ctx = new AudioContext();

  const osc =
    ctx.createOscillator();

  const gain =
    ctx.createGain();

  osc.type = "triangle";

  osc.frequency.value = 180;

  osc.connect(gain);

  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(
    0.001,
    ctx.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.12,
    ctx.currentTime + 0.03
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + 0.25
  );

  osc.start();

  osc.stop(
    ctx.currentTime + 0.25
  );
}


/* =========================================================
   انتخاب رنگ
========================================================= */

function createPalette() {

  palette.innerHTML = "";

  Object.keys(colors).forEach(color => {

    const btn =
      document.createElement("button");

    btn.className =
      "color-btn";

    btn.style.background =
      colors[color];

    btn.dataset.color =
      color;

    btn.title =
      "انتخاب رنگ";

    btn.addEventListener(
      "click",
      () => {

        selectedColor = color;

        document
          .querySelectorAll(
            ".color-btn, .eraser-btn"
          )
          .forEach(b =>
            b.classList.remove("active")
          );

        btn.classList.add("active");

        message.textContent = "";

        message.className =
          "message";
      }
    );

    palette.appendChild(btn);
  });


  /* =====================================================
     پاک‌کن
  ====================================================== */

  const eraser =
    document.createElement("button");

  eraser.className =
    "eraser-btn";

  eraser.textContent =
    "🧽";

  eraser.title =
    "پاک کردن رنگ";

  eraser.addEventListener(
    "click",
    () => {

      selectedColor = "eraser";

      document
        .querySelectorAll(
          ".color-btn, .eraser-btn"
        )
        .forEach(b =>
          b.classList.remove("active")
        );

      eraser.classList.add("active");

      message.textContent =
        "حالا روی خانه‌ای که می‌خواهی پاک شود بزن 🧽";

      message.className =
        "message";
    }
  );

  palette.appendChild(eraser);
}


/* =========================================================
   رنگ کردن یک خانه
========================================================= */

function applyColorToCell(cell) {

  if (!selectedColor) {

    message.textContent =
      "اول یک رنگ از پالت انتخاب کن 🌈";

    message.className =
      "message wrong";

    return;
  }


  /* پاک‌کن */

  if (selectedColor === "eraser") {

    cell.dataset.color = "";

    cell.className =
      "pattern-cell blank";

    return;
  }


  /* رنگ */

  cell.dataset.color =
    selectedColor;

  cell.className =
    `pattern-cell color-${selectedColor}`;

  cell.classList.add("selected");

  setTimeout(() => {

    cell.classList.remove("selected");

  }, 180);
}


/* =========================================================
   ساخت جدول معمولی
   فقط خانه‌های خالی قابل تغییر هستند.
========================================================= */

function createGrid(
  container,
  rows,
  cols,
  values
) {

  container.innerHTML = "";

  container.style.gridTemplateColumns =
    `repeat(${cols}, var(--cell-size))`;

  container.style.gridTemplateRows =
    `repeat(${rows}, var(--cell-size))`;

  for (
    let i = 0;
    i < rows * cols;
    i++
  ) {

    const cell =
      document.createElement("button");

    cell.className =
      "pattern-cell";

    const value =
      values ? values[i] : null;


    if (value) {

      cell.classList.add(
        `color-${value}`
      );

      cell.classList.add("locked");

      cell.dataset.color =
        value;

    }

    else {

      cell.classList.add("blank");

      cell.dataset.color =
        "";

      cell.addEventListener(
        "click",
        () => {

          applyColorToCell(cell);

        }
      );
    }


    cell.dataset.index =
      i;

    container.appendChild(cell);
  }
}


/* =========================================================
   مراحل کتابی
========================================================= */

function createTextbookStage(stage) {

  mainGrid.innerHTML = "";

  repeatGrid.innerHTML = "";


  /* =====================================================
     جدول اصلی
  ====================================================== */

  mainGrid.style.gridTemplateColumns =
    `repeat(${stage.cols}, var(--cell-size))`;

  mainGrid.style.gridTemplateRows =
    `repeat(${stage.rows}, var(--cell-size))`;


  for (
    let i = 0;
    i < stage.rows * stage.cols;
    i++
  ) {

    const cell =
      document.createElement("button");

    cell.className =
      "pattern-cell";

    const value =
      stage.start[i];


    if (value) {

      cell.classList.add(
        `color-${value}`
      );

      cell.classList.add(
        "locked"
      );

      cell.dataset.color =
        value;

    }

    else {

      cell.classList.add(
        "blank"
      );

      cell.dataset.color =
        "";

      cell.addEventListener(
        "click",
        () => {

          applyColorToCell(cell);

        }
      );
    }


    mainGrid.appendChild(cell);
  }


  /* =====================================================
     جدول سمت راست
     همیشه ۶ ستون
  ====================================================== */

  const repeatSlots =
    6;

  repeatGrid.style.gridTemplateColumns =
    `repeat(${repeatSlots}, var(--cell-size))`;

  repeatGrid.style.gridTemplateRows =
    `repeat(1, var(--cell-size))`;


  for (
    let i = 0;
    i < repeatSlots;
    i++
  ) {

    const cell =
      document.createElement("button");

    cell.className =
      "pattern-cell blank";

    cell.dataset.color =
      "";

    cell.addEventListener(
      "click",
      () => {

        applyColorToCell(cell);

      }
    );

    repeatGrid.appendChild(cell);
  }
}


/* =========================================================
   مرحله نهایی سه ردیفه
========================================================= */

function createFinalStage(stage) {

  mainGrid.innerHTML = "";

  repeatGrid.innerHTML = "";


  /* =====================================================
     جدول اصلی
  ====================================================== */

  mainGrid.style.gridTemplateColumns =
    `repeat(${stage.cols}, var(--cell-size))`;

  mainGrid.style.gridTemplateRows =
    `repeat(${stage.rows}, var(--cell-size))`;


  for (
    let i = 0;
    i < stage.rows * stage.cols;
    i++
  ) {

    const cell =
      document.createElement("button");

    cell.className =
      "pattern-cell";

    const value =
      stage.start[i];


    if (value) {

      cell.classList.add(
        `color-${value}`
      );

      cell.classList.add(
        "locked"
      );

      cell.dataset.color =
        value;

    }

    else {

      cell.classList.add(
        "blank"
      );

      cell.dataset.color =
        "";

      cell.addEventListener(
        "click",
        () => {

          applyColorToCell(cell);

        }
      );
    }


    mainGrid.appendChild(cell);
  }


  /* =====================================================
     جدول سمت راست
     ۶ ستون و ۳ ردیف
  ====================================================== */

  repeatGrid.style.gridTemplateColumns =
    `repeat(6, var(--cell-size))`;

  repeatGrid.style.gridTemplateRows =
    `repeat(3, var(--cell-size))`;


  for (
    let i = 0;
    i < 18;
    i++
  ) {

    const cell =
      document.createElement("button");

    cell.className =
      "pattern-cell blank";

    cell.dataset.color =
      "";

    cell.addEventListener(
      "click",
      () => {

        applyColorToCell(cell);

      }
    );

    repeatGrid.appendChild(cell);
  }
}


/* =========================================================
   مرحله حذف
========================================================= */

function createRemoveStage(stage) {

  mainGrid.innerHTML = "";

  repeatGrid.innerHTML = "";


  mainGrid.style.gridTemplateColumns =
    `repeat(${stage.cols}, var(--cell-size))`;

  mainGrid.style.gridTemplateRows =
    `repeat(1, var(--cell-size))`;


  for (
    let i = 0;
    i < stage.start.length;
    i++
  ) {

    const cell =
      document.createElement("button");

    cell.className =
      "pattern-cell";

    cell.classList.add(
      `color-${stage.start[i]}`
    );

    cell.dataset.index =
      i;

    cell.addEventListener(
      "click",
      () => {

        const allCells =
          [
            ...mainGrid.querySelectorAll(
              ".pattern-cell"
            )
          ];

        allCells.forEach(c => {

          c.classList.remove(
            "selected"
          );

          c.dataset.selected =
            "false";

        });

        cell.classList.add(
          "selected"
        );

        cell.dataset.selected =
          "true";
      }
    );

    mainGrid.appendChild(cell);
  }


  document.querySelector(
    ".repeat-area"
  ).style.display =
    "none";
}


/* =========================================================
   نمایش مرحله
========================================================= */

function renderStage() {

  const stage =
    stages[currentStage];

  selectedColor =
    null;

  message.textContent =
    "";

  message.className =
    "message";


  stageNumber.textContent =
    `مرحله ${toPersianNumber(currentStage + 1)} از ${toPersianNumber(stages.length)}`;

  scoreText.textContent =
    `امتیاز: ${toPersianNumber(score)}`;

  stageTitle.textContent =
    stage.title;

  questionText.textContent =
    stage.question || "";

  instructionText.textContent =
    stage.instruction || "";


  document.querySelector(
    ".repeat-area"
  ).style.display =
    "block";


  document.querySelector(
    ".palette-area"
  ).style.display =
    "block";


  /* textbook */

  if (
    stage.type === "textbook"
  ) {

    createTextbookStage(stage);

  }


  /* final */

  else if (
    stage.type === "finalFlower"
  ) {

    createFinalStage(stage);

  }


  /* remove */

  else if (
    stage.type === "remove"
  ) {

    createRemoveStage(stage);

    document.querySelector(
      ".palette-area"
    ).style.display =
      "none";

  }


  /* معمولی */

  else {

    createGrid(
      mainGrid,
      stage.rows,
      stage.cols,
      stage.start
    );

    repeatGrid.innerHTML = "";

    document.querySelector(
      ".repeat-area"
    ).style.display =
      "none";
  }


  createPalette();


  /*
    دکمه قبلی در مرحله اول غیرفعال است.
    دکمه بعدی در آخرین مرحله غیرفعال است.
  */

  prevBtn.disabled =
    currentStage === 0;

  nextBtn.disabled =
    currentStage === stages.length - 1;
}


/* =========================================================
   بررسی مراحل رنگی
========================================================= */

function checkColorStage(stage) {

  const mainCells =
    [
      ...mainGrid.querySelectorAll(
        ".pattern-cell"
      )
    ];


  /* =====================================================
     بررسی جدول اصلی
  ====================================================== */

  for (
    let i = 0;
    i < stage.answer.length;
    i++
  ) {

    const actual =
      mainCells[i]?.dataset.color || "";

    const expected =
      stage.answer[i] || "";


    if (
      actual !== expected
    ) {

      return false;
    }
  }


  /* =====================================================
     بررسی جدول سمت راست
  ====================================================== */

  if (
    stage.type === "textbook"
  ) {

    const repeatCells =
      [
        ...repeatGrid.querySelectorAll(
          ".pattern-cell"
        )
      ];


    for (
      let i = 0;
      i < repeatCells.length;
      i++
    ) {

      const actual =
        repeatCells[i].dataset.color || "";

      /*
        فقط طول repeat بررسی می‌شود.
        خانه‌های بعدی باید کاملاً خالی باشند.
      */

      const expected =
        i < stage.repeat.length
          ? stage.repeat[i]
          : "";


      if (
        actual !== expected
      ) {

        return false;
      }
    }
  }


  /* =====================================================
     مرحله شکل‌دار
  ====================================================== */

  if (
    stage.type === "finalFlower"
  ) {

    const repeatCells =
      [
        ...repeatGrid.querySelectorAll(
          ".pattern-cell"
        )
      ];


    for (
      let i = 0;
      i < repeatCells.length;
      i++
    ) {

      const actual =
        repeatCells[i].dataset.color || "";

      const expected =
        stage.repeat[i] || "";


      if (
        actual !== expected
      ) {

        return false;
      }
    }
  }


  return true;
}


/* =========================================================
   بررسی حذف
========================================================= */

function checkRemoveStage(stage) {

  const selected =
    mainGrid.querySelector(
      '.pattern-cell[data-selected="true"]'
    );


  if (!selected) {

    return false;
  }


  return (
    Number(selected.dataset.index) ===
    stage.wrongIndex
  );
}


/* =========================================================
   بررسی پاسخ
========================================================= */

function checkAnswer() {

  const stage =
    stages[currentStage];

  let correct =
    false;


  if (
    stage.type === "remove"
  ) {

    correct =
      checkRemoveStage(stage);

  }

  else {

    correct =
      checkColorStage(stage);

  }


  if (correct) {

    score += 10;


    scoreText.textContent =
      `امتیاز: ${toPersianNumber(score)}`;


    message.textContent =
      "آفرین! خیلی خوب الگو را پیدا کردی 🌟👏";


    message.className =
      "message correct";


    playCorrectSound();


    checkBtn.disabled =
      true;


    setTimeout(() => {

      checkBtn.disabled =
        false;


      if (
        currentStage <
        stages.length - 1
      ) {

        currentStage++;

        renderStage();

      }

      else {

        finishGame();

      }

    }, 1100);

  }


  else {

    message.textContent =
      "یک بار دیگر با دقت الگو را بخوان 🌷";

    message.className =
      "message wrong";

    playWrongSound();

  }
}


/* =========================================================
   شروع بازی
========================================================= */

startBtn.addEventListener(
  "click",
  () => {

    studentName =
      studentNameInput.value.trim();


    if (!studentName) {

      studentNameInput.focus();

      studentNameInput.style.borderColor =
        "#f05a5a";

      return;
    }


    score = 0;

    currentStage = 0;


    startScreen.classList.add(
      "hidden"
    );

    finishScreen.classList.add(
      "hidden"
    );

    gameScreen.classList.remove(
      "hidden"
    );


    renderStage();
  }
);


/* =========================================================
   قبلی
========================================================= */

prevBtn.addEventListener(
  "click",
  () => {

    if (
      currentStage > 0
    ) {

      currentStage--;

      renderStage();
    }
  }
);


/* =========================================================
   بعدی
========================================================= */

nextBtn.addEventListener(
  "click",
  () => {

    if (
      currentStage <
      stages.length - 1
    ) {

      currentStage++;

      renderStage();
    }
  }
);


/* =========================================================
   بررسی
========================================================= */

checkBtn.addEventListener(
  "click",
  checkAnswer
);


/* =========================================================
   پایان
========================================================= */

function finishGame() {

  gameScreen.classList.add(
    "hidden"
  );

  finishScreen.classList.remove(
    "hidden"
  );


  finalScore.textContent =
    toPersianNumber(score);


  finishText.textContent =
    `${studentName} جان، تو همه‌ی الگوها را با دقت پیدا کردی! 🌸`;
}


/* =========================================================
   شروع دوباره
========================================================= */

restartBtn.addEventListener(
  "click",
  () => {

    score = 0;

    currentStage = 0;

    finishScreen.classList.add(
      "hidden"
    );

    gameScreen.classList.add(
      "hidden"
    );

    startScreen.classList.remove(
      "hidden"
    );

    studentNameInput.value =
      "";

    message.textContent =
      "";
  }
);


/* =========================================================
   اعداد فارسی
========================================================= */

function toPersianNumber(number) {

  return String(number).replace(
    /\d/g,
    d => "۰۱۲۳۴۵۶۷۸۹"[d]
  );
}
