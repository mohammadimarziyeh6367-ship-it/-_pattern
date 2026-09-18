/* =========================================================
   بازی «الگوی منظم | ریاضی پایه اول»
   ========================================================= */


/* =========================================================
   شکل‌ها
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
   مراحل
   ========================================================= */

const levels = [

  {
    type: "sample",

    title: "الگو را بخوان",

    question:
      "الگو را با دقت نگاه کن.",

    instruction:
      "الگو را بخوان و شکل بعدی را پیدا کن.",

    pattern: [
      { type:"circle", color:"blue" },
      { type:"square", color:"yellow" },
      { type:"circle", color:"blue" },
      { type:"square", color:"yellow" }
    ],

    answer: {
      type:"circle",
      color:"blue"
    }
  },


  {
    type: "missing",

    title: "جای خالی را پیدا کن",

    question:
      "کدام شکل باید در جای خالی قرار بگیرد؟",

    instruction:
      "الگو را بخوان و شکل درست را انتخاب کن.",

    pattern: [
      { type:"circle", color:"blue" },
      { type:"square", color:"yellow" },
      null,
      { type:"square", color:"yellow" },
      { type:"circle", color:"blue" }
    ],

    answer: {
      type:"circle",
      color:"blue"
    },

    choices: [
      { type:"circle", color:"blue" },
      { type:"triangle", color:"green" },
      { type:"star", color:"yellow" }
    ]
  },


  {
    type: "missing",

    title: "الگوی منظم",

    question:
      "جای خالی را کامل کن.",

    instruction:
      "به ترتیب شکل‌ها دقت کن.",

    pattern: [
      { type:"circle", color:"blue" },
      { type:"circle", color:"blue" },
      { type:"star", color:"yellow" },
      null,
      { type:"circle", color:"blue" },
      { type:"circle", color:"blue" }
    ],

    answer: {
      type:"star",
      color:"yellow"
    },

    choices: [
      { type:"star", color:"yellow" },
      { type:"square", color:"yellow" },
      { type:"heart", color:"pink" }
    ]
  },


  {
    type: "missing",

    title: "ادامه بده",

    question:
      "کدام شکل الگو را کامل می‌کند؟",

    instruction:
      "الگوی تکرارشونده را پیدا کن.",

    pattern: [
      { type:"triangle", color:"green" },
      { type:"square", color:"yellow" },
      { type:"triangle", color:"green" },
      null,
      { type:"triangle", color:"green" }
    ],

    answer: {
      type:"square",
      color:"yellow"
    },

    choices: [
      { type:"square", color:"yellow" },
      { type:"circle", color:"blue" },
      { type:"heart", color:"pink" }
    ]
  },


  {
    type: "missing",

    title: "دقت کن!",

    question:
      "شکل گمشده را پیدا کن.",

    instruction:
      "به دو شکل تکرارشونده توجه کن.",

    pattern: [
      { type:"heart", color:"pink" },
      { type:"circle", color:"blue" },
      { type:"heart", color:"pink" },
      null,
      { type:"heart", color:"pink" }
    ],

    answer: {
      type:"circle",
      color:"blue"
    },

    choices: [
      { type:"circle", color:"blue" },
      { type:"triangle", color:"green" },
      { type:"star", color:"yellow" }
    ]
  },


  {
    type: "missing",

    title: "الگو را کامل کن",

    question:
      "شکل مناسب را انتخاب کن.",

    instruction:
      "الگوی تکرارشونده را پیدا کن.",

    pattern: [
      { type:"star", color:"yellow" },
      { type:"triangle", color:"green" },
      { type:"star", color:"yellow" },
      { type:"triangle", color:"green" },
      null
    ],

    answer: {
      type:"star",
      color:"yellow"
    },

    choices: [
      { type:"star", color:"yellow" },
      { type:"circle", color:"blue" },
      { type:"heart", color:"pink" }
    ]
  },


  /* =======================================================
     مرحله ۷
     ======================================================= */

  {
    type: "textbook",

    title:
      "الگوی تکرارشونده",

    question:
      "الگوی تکرارشونده را ادامه بده.",

    instruction:
      "خانه‌های خالی را کامل کن؛ سپس الگویی را که پیدا کردی، یک‌مرتبه در جدول سمت راست بکش.",

    rows: 1,

    cols: 8,

    start: [
      "green",
      "green",
      "red",
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
      "green"
    ],

    repeat: [
      "green",
      "green",
      "red"
    ]
  },


  /* =======================================================
     مرحله ۸
     ======================================================= */

  {
    type: "textbook",

    title:
      "الگو را پیدا کن",

    question:
      "الگوی تکرارشونده را ادامه بده.",

    instruction:
      "رنگ درست را انتخاب کن و خانه‌های خالی را کامل کن.",

    rows: 1,

    cols: 8,

    start: [
      "blue",
      "yellow",
      "blue",
      "yellow",
      "blue",
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
    ],

    repeat: [
      "blue",
      "yellow"
    ]
  },


  /* =======================================================
     مرحله ۹
     ======================================================= */

  {
    type: "textbook",

    title:
      "الگوی منظم",

    question:
      "الگو را بخوان و ادامه بده.",

    instruction:
      "ابتدا جدول را کامل کن؛ بعد الگوی پیدا شده را در جدول سمت راست وارد کن.",

    rows: 1,

    cols: 9,

    start: [
      "green",
      "red",
      "red",
      "green",
      "red",
      "red",
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
      "red"
    ],

    repeat: [
      "green",
      "red",
      "red"
    ]
  },


  /* =======================================================
     مرحله ۱۰
     شکل پنج‌پر فقط از خود خانه‌های جدول
     ======================================================= */

  {
    type: "textbookFinal",

    title:
      "شکل را کامل کن",

    question:
      "الگوی تکرارشونده را ادامه بده و شکل را کامل کن.",

    instruction:
      "رنگ مناسب را انتخاب کن و خانه‌های خالی را کامل کن.",

    rows: 3,

    cols: 7,

    start: [

      "green",
      null,
      "green",
      null,
      "green",
      null,
      "green",

      null,
      "green",
      null,
      "red",
      null,
      "green",
      null,

      "green",
      null,
      "green",
      null,
      "green",
      null,
      "green"

    ],

    answer: [

      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",

      "green",
      "green",
      "green",
      "red",
      "green",
      "green",
      "green",

      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green"

    ],

    repeatRows: 3,

    repeatCols: 3,

    repeat: [

      "green",
      "green",
      "green",

      "green",
      "red",
      "green",

      "green",
      "green",
      "green"

    ]
  },


  /* =======================================================
     مرحله ۱۱
     ======================================================= */

  {
    type: "remove",

    title:
      "یک شکل را بردار",

    question:
      "کدام شکل باید از الگو حذف شود؟",

    instruction:
      "الگو را بررسی کن و شکل اضافی را پیدا کن.",

    pattern: [
      { type:"circle", color:"blue" },
      { type:"square", color:"yellow" },
      { type:"circle", color:"blue" },
      { type:"star", color:"yellow" },
      { type:"circle", color:"blue" }
    ],

    answerIndex: 3
  },


  /* =======================================================
     مرحله ۱۲
     ======================================================= */

  {
    type: "remove",

    title:
      "شکل اضافی را پیدا کن",

    question:
      "کدام شکل نظم الگو را به هم زده است؟",

    instruction:
      "شکل اضافی را انتخاب کن.",

    pattern: [
      { type:"triangle", color:"green" },
      { type:"circle", color:"blue" },
      { type:"triangle", color:"green" },
      { type:"heart", color:"pink" },
      { type:"triangle", color:"green" },
      { type:"circle", color:"blue" }
    ],

    answerIndex: 3
  }

];


/* =========================================================
   وضعیت بازی
   ========================================================= */

let level = 0;

let score = 0;

let studentName = "";

let stageStates = {};

let audioContext = null;


/* =========================================================
   DOM
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

const studentNameInput =
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

const feedbackBox =
  document.getElementById("feedback");

const prevBtn =
  document.getElementById("prevBtn");

const nextBtn =
  document.getElementById("nextBtn");

const exitBtn =
  document.getElementById("exitBtn");

const finishMessage =
  document.getElementById("finishMessage");

const finalScore =
  document.getElementById("finalScore");


/* =========================================================
   صدا
   ========================================================= */

function initAudio() {

  if (!audioContext) {

    audioContext =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

  }

}


function playTone(
  frequency = 600,
  duration = 0.1,
  type = "sine"
) {

  try {

    initAudio();

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type = type;

    oscillator.frequency.value =
      frequency;

    gain.gain.setValueAtTime(
      0.0001,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.12,
      audioContext.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);

    gain.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + duration
    );

  } catch (e) {}

}


function correctSound() {

  playTone(660, .10);

  setTimeout(() => {
    playTone(880, .14);
  }, 90);

}


function wrongSound() {

  playTone(220, .12, "triangle");

}


function moveSound() {

  playTone(480, .06);

}


/* =========================================================
   آتش‌بازی
   ========================================================= */

function fireworks() {

  const container =
    document.createElement("div");

  container.style.position = "fixed";

  container.style.inset = "0";

  container.style.pointerEvents = "none";

  container.style.zIndex = "9999";

  document.body.appendChild(container);


  for (let i = 0; i < 24; i++) {

    const dot =
      document.createElement("div");

    dot.textContent = "✨";

    dot.style.position = "absolute";

    dot.style.fontSize =
      `${14 + Math.random() * 16}px`;

    dot.style.left =
      `${20 + Math.random() * 60}%`;

    dot.style.top =
      `${25 + Math.random() * 45}%`;

    dot.style.transition =
      "all 900ms ease";

    container.appendChild(dot);

    requestAnimationFrame(() => {

      dot.style.transform =
        `translate(
          ${(Math.random() - .5) * 350}px,
          ${(Math.random() - .5) * 350}px
        )`;

      dot.style.opacity = "0";

    });

  }


  setTimeout(() => {
    container.remove();
  }, 1000);

}


/* =========================================================
   بازخورد
   ========================================================= */

function feedback(
  message,
  type = ""
) {

  feedbackBox.textContent =
    message;

  feedbackBox.className =
    "feedback " + type;

}


/* =========================================================
   وضعیت مرحله
   ========================================================= */

function getStageState(index) {

  if (!stageStates[index]) {

    stageStates[index] = {

      main: [],

      right: [],

      mainSolved: false,

      rightSolved: false,

      scored: false,

      solved: false,

      selectedColor: null
    };

  }

  return stageStates[index];
}


/* =========================================================
   صفحه
   ========================================================= */

function showScreen(screen) {

  [cover, game, finish]
    .forEach(x =>
      x.classList.remove("active")
    );

  screen.classList.add("active");
}


/* =========================================================
   امتیاز
   ========================================================= */

function updateScore() {

  scoreLabel.textContent =
    `امتیاز: ${score}`;

}


/* =========================================================
   ساخت شکل
   ========================================================= */

function shapeHTML(piece) {

  if (!piece) {

    return `
      <div class="slot"></div>
    `;

  }

  return `
    <div class="slot">
      <span
        class="
          shape
          ${piece.type}
          ${piece.color}
        "
      ></span>
    </div>
  `;

}


/* =========================================================
   رندر مرحله
   ========================================================= */

function renderLevel() {

  const data =
    levels[level];

  feedbackBox.textContent = "";

  feedbackBox.className =
    "feedback";

  choices.innerHTML = "";

  choicesTitle.classList.add(
    "hidden"
  );

  patternArea.innerHTML = "";


  levelLabel.textContent =
    `مرحله ${level + 1} از ${levels.length}`;


  progressBar.style.width =
    `${((level + 1) / levels.length) * 100}%`;


  questionText.textContent =
    data.question;

  instruction.textContent =
    data.instruction;


  if (
    data.type === "textbook" ||
    data.type === "textbookFinal"
  ) {

    typeBadge.textContent =
      "الگوی کتابی";

    renderTextbookLevel(data);

    return;
  }


  if (data.type === "sample") {

    typeBadge.textContent =
      "الگوخوانی";

    renderSample(data);

    return;
  }


  if (data.type === "missing") {

    typeBadge.textContent =
      "جای خالی";

    renderMissing(data);

    return;
  }


  if (data.type === "remove") {

    typeBadge.textContent =
      "شکل اضافی";

    renderRemove(data);

    return;
  }

}


/* =========================================================
   مرحله نمونه
   ========================================================= */

function renderSample(data) {

  const row =
    document.createElement("div");

  row.className =
    "pattern-row";

  data.pattern.forEach(piece => {

    row.innerHTML +=
      shapeHTML(piece);

  });

  patternArea.appendChild(row);

  choicesTitle.textContent =
    "شکل بعدی چیست؟";

  choicesTitle.classList.remove(
    "hidden"
  );


  const choiceBox =
    document.createElement("div");

  choiceBox.className =
    "choices";


  const choicesList = [
    data.answer,
    {type:"triangle", color:"green"},
    {type:"heart", color:"pink"}
  ];


  choicesList.forEach(piece => {

    const button =
      document.createElement("button");

    button.className =
      "slot";

    button.innerHTML =
      `<span class="shape ${piece.type} ${piece.color}"></span>`;

    button.addEventListener(
      "click",
      () => {

        if (
          samePiece(
            piece,
            data.answer
          )
        ) {

          correctSound();

          feedback(
            `آفرین ${studentName}! 🌟`,
            "correct"
          );

          scoreStage();

        } else {

          wrongSound();

          feedback(
            "دوباره به الگو نگاه کن 🌱",
            "wrong"
          );

        }

      }
    );

    choiceBox.appendChild(button);

  });

  choices.appendChild(choiceBox);

}


/* =========================================================
   مرحله جای خالی
   ========================================================= */

function renderMissing(data) {

  const row =
    document.createElement("div");

  row.className =
    "pattern-row";


  data.pattern.forEach(piece => {

    if (piece === null) {

      const empty =
        document.createElement("div");

      empty.className =
        "slot";

      empty.dataset.missing =
        "true";

      row.appendChild(empty);

    } else {

      row.innerHTML +=
        shapeHTML(piece);

    }

  });


  patternArea.appendChild(row);


  choicesTitle.textContent =
    "شکل درست را انتخاب کن";

  choicesTitle.classList.remove(
    "hidden"
  );


  const choiceBox =
    document.createElement("div");

  choiceBox.className =
    "choices";


  data.choices.forEach(piece => {

    const button =
      document.createElement("button");

    button.className =
      "slot";

    button.innerHTML =
      `<span class="shape ${piece.type} ${piece.color}"></span>`;


    button.addEventListener(
      "click",
      () => {

        if (
          samePiece(
            piece,
            data.answer
          )
        ) {

          const empty =
            row.querySelector(
              '[data-missing="true"]'
            );

          if (empty) {

            empty.innerHTML =
              `<span class="shape ${piece.type} ${piece.color}"></span>`;

            empty.removeAttribute(
              "data-missing"
            );

          }

          correctSound();

          feedback(
            `آفرین ${studentName}! 🌟`,
            "correct"
          );

          scoreStage();

        } else {

          wrongSound();

          feedback(
            "این شکل الگو را کامل نمی‌کند؛ دوباره فکر کن 🌱",
            "wrong"
          );

        }

      }
    );


    choiceBox.appendChild(button);

  });


  choices.appendChild(choiceBox);

}


/* =========================================================
   مرحله حذف
   ========================================================= */

function renderRemove(data) {

  const row =
    document.createElement("div");

  row.className =
    "pattern-row";


  data.pattern.forEach(
    (piece, index) => {

      const button =
        document.createElement("button");

      button.className =
        "slot";

      button.innerHTML =
        `<span class="shape ${piece.type} ${piece.color}"></span>`;


      button.addEventListener(
        "click",
        () => {

          if (
            index === data.answerIndex
          ) {

            button.style.opacity =
              "0";

            button.style.transform =
              "scale(.5)";

            correctSound();

            feedback(
              `آفرین ${studentName}! 🎉`,
              "correct"
            );

            scoreStage();

          } else {

            wrongSound();

            feedback(
              "این شکل اضافی نیست. دوباره نگاه کن 🌱",
              "wrong"
            );

          }

        }
      );


      row.appendChild(button);

    }
  );


  patternArea.appendChild(row);

}


/* =========================================================
   مقایسه شکل
   ========================================================= */

function samePiece(a, b) {

  return (
    a &&
    b &&
    a.type === b.type &&
    a.color === b.color
  );

}


/* =========================================================
   امتیازدهی مرحله
   ========================================================= */

function scoreStage() {

  const state =
    getStageState(level);

  if (state.scored) {
    return;
  }

  state.scored = true;

  score += 10;

  updateScore();

  fireworks();

}


/* =========================================================
   پالت رنگ
   ========================================================= */

function buildTextbookPalette() {

  const palette =
    document.createElement("div");

  palette.className =
    "color-palette";


  palette.innerHTML = `

    <div class="palette-title">
      اول رنگ را انتخاب کن 🌈
    </div>

    <button
      class="color-choice green"
      data-color="green"
      aria-label="سبز">
    </button>

    <button
      class="color-choice red"
      data-color="red"
      aria-label="قرمز">
    </button>

    <button
      class="color-choice blue"
      data-color="blue"
      aria-label="آبی">
    </button>

    <button
      class="color-choice yellow"
      data-color="yellow"
      aria-label="زرد">
    </button>

    <button
      class="color-choice pink"
      data-color="pink"
      aria-label="صورتی">
    </button>

  `;


  palette
    .querySelectorAll(".color-choice")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const state =
            getStageState(level);

          state.selectedColor =
            button.dataset.color;


          palette
            .querySelectorAll(".color-choice")
            .forEach(x =>
              x.classList.remove("active")
            );


          button.classList.add("active");

          playTone(
            620,
            .08,
            "sine"
          );

        }
      );

    });


  return palette;

}


/* =========================================================
   ساخت جدول
   ========================================================= */

function createTextbookGrid(
  rows,
  cols,
  initial,
  expected,
  stateArray,
  gridName,
  locked = false,
  isFinal = false
) {

  const grid =
    document.createElement("div");


  grid.className =
    "textbook-grid" +
    (
      isFinal
        ? " final-grid"
        : ""
    );


  grid.style.gridTemplateColumns =
    `repeat(${cols}, 1fr)`;


  if (locked) {

    grid.classList.add(
      "right-grid-locked"
    );

  }


  const total =
    rows * cols;


  for (
    let i = 0;
    i < total;
    i++
  ) {

    const cell =
      document.createElement("button");


    cell.type =
      "button";


    cell.className =
      "textbook-cell";


    const initialColor =
      initial?.[i] ?? null;


    const savedColor =
      stateArray?.[i] ?? null;


    const currentColor =
      savedColor ||
      initialColor;


    if (currentColor) {

      cell.classList.add(
        currentColor
      );

    }


    const isGiven =
      Boolean(initialColor);


    if (isGiven) {

      cell.classList.add(
        "prefilled"
      );

    }


    if (locked) {

      cell.disabled =
        true;

    }


    cell.addEventListener(
      "click",
      () => {

        if (
          locked ||
          isGiven
        ) {

          return;

        }


        handleTextbookCell(
          cell,
          i,
          expected[i],
          stateArray,
          gridName
        );

      }
    );


    grid.appendChild(cell);

  }


  return grid;

}


/* =========================================================
   کلیک روی خانه جدول
   ========================================================= */

function handleTextbookCell(
  cell,
  index,
  expectedColor,
  stateArray,
  gridName
) {

  const state =
    getStageState(level);


  const selectedColor =
    state.selectedColor;


  if (!selectedColor) {

    feedback(
      "اول یک رنگ انتخاب کن 🌈",
      "info"
    );

    return;

  }


  if (
    selectedColor === expectedColor
  ) {

    cell.classList.remove(
      "green",
      "red",
      "blue",
      "yellow",
      "pink"
    );


    cell.classList.add(
      selectedColor,
      "correct"
    );


    stateArray[index] =
      selectedColor;


    playTone(
      760,
      .11,
      "sine"
    );


    setTimeout(
      () => {

        cell.classList.remove(
          "correct"
        );

        checkTextbookProgress();

      },
      180
    );


  } else {

    cell.classList.add(
      "wrong"
    );


    wrongSound();


    feedback(
      "دوباره فکر کن 🌱",
      "wrong"
    );


    setTimeout(
      () => {

        cell.classList.remove(
          "wrong"
        );

      },
      320
    );

  }

}


/* =========================================================
   رندر جدول کتابی
   ========================================================= */

function renderTextbookLevel(data) {

  patternArea.innerHTML = "";


  const state =
    getStageState(level);


  const wrapper =
    document.createElement("div");


  wrapper.className =
    "textbook-wrap";


  const palette =
    buildTextbookPalette();


  wrapper.appendChild(
    palette
  );


  const pair =
    document.createElement("div");


  pair.className =
    "textbook-pair";


  /* جدول اصلی */

  const leftBox =
    document.createElement("div");


  leftBox.className =
    "textbook-table-box";


  const leftTitle =
    document.createElement("div");


  leftTitle.className =
    "textbook-table-title";


  leftTitle.textContent =
    "جدول اصلی";


  leftBox.appendChild(
    leftTitle
  );


  const mainGrid =
    createTextbookGrid(
      data.rows,
      data.cols,
      data.start,
      data.answer,
      state.main,
      "main",
      false,
      data.type === "textbookFinal"
    );


  leftBox.appendChild(
    mainGrid
  );


  /* جدول سمت راست */

  const rightBox =
    document.createElement("div");


  rightBox.className =
    "textbook-table-box";


  const rightTitle =
    document.createElement("div");


  rightTitle.className =
    "textbook-table-title";


  rightTitle.textContent =
    "الگو را یک‌بار بکش";


  rightBox.appendChild(
    rightTitle
  );


  let rightRows = 1;

  let rightCols =
    data.repeat.length;


  if (
    data.type === "textbookFinal"
  ) {

    rightRows =
      data.repeatRows;

    rightCols =
      data.repeatCols;

  }


  const rightGrid =
    createTextbookGrid(
      rightRows,
      rightCols,
      null,
      data.repeat,
      state.right,
      "right",
      !state.mainSolved,
      false
    );


  rightBox.appendChild(
    rightGrid
  );


  pair.appendChild(
    leftBox
  );

  pair.appendChild(
    rightBox
  );


  wrapper.appendChild(
    pair
  );


  patternArea.appendChild(
    wrapper
  );


  checkTextbookProgress();

}


/* =========================================================
   بررسی جدول کتابی
   ========================================================= */

function checkTextbookProgress() {

  const data =
    levels[level];


  if (
    data.type !== "textbook" &&
    data.type !== "textbookFinal"
  ) {

    return;

  }


  const state =
    getStageState(level);


  /* -----------------------------------------------
     بررسی جدول اصلی
     ----------------------------------------------- */

  const mainComplete =
    data.answer.every(
      (color, index) => {

        const initial =
          data.start?.[index];

        const current =
          state.main[index];


        return (
          initial === color ||
          current === color
        );

      }
    );


  if (
    mainComplete &&
    !state.mainSolved
  ) {

    state.mainSolved =
      true;


    feedback(
      `آفرین ${studentName}! 🌟 حالا الگو را در جدول سمت راست بکش.`,
      "correct"
    );


    correctSound();


    const right =
      document.querySelector(
        ".right-grid-locked"
      );


    if (right) {

      right.classList.remove(
        "right-grid-locked"
      );


      right.classList.add(
        "right-grid-ready"
      );


      right
        .querySelectorAll("button")
        .forEach(button => {

          button.disabled =
            false;

        });

    }


    return;

  }


  /* -----------------------------------------------
     بررسی جدول سمت راست
     ----------------------------------------------- */

  if (state.mainSolved) {

    const rightComplete =
      data.repeat.every(
        (color, index) =>
          state.right[index] === color
      );


    if (
      rightComplete &&
      !state.rightSolved
    ) {

      state.rightSolved =
        true;


      if (!state.scored) {

        state.scored =
          true;

        score += 10;

        updateScore();

        correctSound();

        fireworks();


        feedback(
          `آفرین ${studentName}! 🎉 الگو را عالی پیدا کردی.`,
          "correct"
        );

      }

    }

  }

}


/* =========================================================
   شروع بازی
   ========================================================= */

function startGame() {

  initAudio();


  studentName =
    studentNameInput.value.trim();


  if (!studentName) {

    studentName =
      "قهرمان کوچک";

  }


  level = 0;

  score = 0;

  stageStates = {};


  updateScore();

  showScreen(game);

  renderLevel();

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

    moveSound();

    renderLevel();

  } else {

    finishGame();

  }

}


/* =========================================================
   مرحله قبل
   ========================================================= */

function goPrevious() {

  if (level > 0) {

    level--;

    moveSound();

    renderLevel();

  }

}


/* =========================================================
   خروج
   ========================================================= */

function exitGame() {

  showScreen(cover);

}


/* =========================================================
   پایان
   ========================================================= */

function finishGame() {

  finishMessage.textContent =
    `آفرین ${studentName}! تو یک قهرمان الگوها هستی 🌟`;


  finalScore.textContent =
    `امتیاز نهایی: ${score}`;


  showScreen(finish);

  correctSound();

  fireworks();

}


/* =========================================================
   شروع دوباره
   ========================================================= */

function restartGame() {

  startGame();

}


/* =========================================================
   رویدادها
   ========================================================= */

startBtn.addEventListener(
  "click",
  startGame
);


restartBtn.addEventListener(
  "click",
  restartGame
);


nextBtn.addEventListener(
  "click",
  goNext
);


prevBtn.addEventListener(
  "click",
  goPrevious
);


exitBtn.addEventListener(
  "click",
  exitGame
);


/* =========================================================
   Enter برای شروع
   ========================================================= */

studentNameInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

      startGame();

    }

  }
);


/* =========================================================
   جلوگیری از زوم ناخواسته در بازی
   ========================================================= */

document.addEventListener(
  "gesturestart",
  event => {
    event.preventDefault();
  }
);
