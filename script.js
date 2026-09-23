/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   ========================================================= */

const TOTAL_COLUMNS = 21;

let studentName = "";
let currentStage = 0;
let score = 0;

let selectedTool = null;
let currentCells = [];
let repeatCells = [];
let selectedShapeAnswer = null;
let audioContext = null;


/* =========================================================
   رنگ ها
   ========================================================= */

const COLORS = {
  green: "#58c86b",
  blue: "#42a5f5",
  yellow: "#ffd84d",
  red: "#ef5350",
  pink: "#ff73ad",
  purple: "#9c64e8",
  white: "#ffffff"
};


/* =========================================================
   مراحل
   ========================================================= */

const stages = [

  /* =====================================================
     مرحله 1
     ===================================================== */

  {
    type: "color",

    pattern: [
      "green",
      "green",
      "red"
    ],

    blanks: [
      15,16,17,18,19,20
    ],

    instruction:
      "الگوی تکرارشونده را ادامه بده."
  },


  /* =====================================================
     مرحله 2
     ===================================================== */

  {
    type: "color",

    pattern: [
      "blue",
      "yellow"
    ],

    blanks: [
      13,14,15,16,
      17,18,19,20
    ],

    instruction:
      "الگوی تکرارشونده را ادامه بده."
  },


  /* =====================================================
     مرحله 3
     ===================================================== */

  {
    type: "color",

    pattern: [
      "green",
      "red",
      "red"
    ],

    blanks: [
      14,15,16,17,
      18,19,20
    ],

    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده."
  },


  /* =====================================================
     مرحله 4
     ===================================================== */

  {
    type: "color",

    pattern: [
      "yellow",
      "blue",
      "green"
    ],

    blanks: [
      14,15,16,17,
      18,19,20
    ],

    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده."
  },


  /* =====================================================
     مرحله 5
     ===================================================== */

  {
    type: "color",

    pattern: [
      "red",
      "red",
      "yellow"
    ],

    blanks: [
      14,15,16,17,
      18,19,20
    ],

    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده."
  },


  /* =====================================================
     مرحله 6
     ===================================================== */

  {
    type: "color",

    pattern: [
      "green",
      "blue",
      "blue"
    ],

    blanks: [
      14,15,16,17,
      18,19,20
    ],

    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده."
  },


  /* =====================================================
     مرحله 7
     صورتی - صورتی - زرد
     ===================================================== */

  {
    type: "color",

    pattern: [
      "pink",
      "pink",
      "yellow"
    ],

    blanks: [
      14,15,16,17,
      18,19,20
    ],

    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده."
  },


  /* =====================================================
     مرحله 8
     ===================================================== */

  {
    type: "shape",

    pattern: [
      "circle",
      "circle",
      "triangle",
      "circle",
      "circle",
      "triangle"
    ],

    blanks: [
      13,14,15,16,
      17,18,19,20
    ],

    instruction:
      "الگوی تکرارشونده را پیدا کن و الگو را ادامه بده."
  },


  /* =====================================================
     مرحله 9
     ===================================================== */

  {
    type: "remove",

    shapes: [
      "circle",
      "circle",
      "square",
      "circle",
      "circle",
      "triangle",
      "circle"
    ],

    answer: 5,

    instruction:
      "کدام شکل را حذف کنیم تا الگو منظم شود؟"
  },


  /* =====================================================
     مرحله 10
     ===================================================== */

  {
    type: "shape",

    pattern: [
      "star",
      "star",
      "heart",
      "star",
      "star",
      "heart"
    ],

    blanks: [
      13,14,15,16,
      17,18,19,20
    ],

    instruction:
      "الگوی تکرارشونده را پیدا کن و الگو را ادامه بده."
  },


  /* =====================================================
     مرحله 11
     ===================================================== */

  {
    type: "remove",

    shapes: [
      "triangle",
      "triangle",
      "circle",
      "triangle",
      "triangle",
      "square",
      "triangle"
    ],

    answer: 5,

    instruction:
      "کدام شکل را حذف کنیم تا الگو منظم شود؟"
  },


  /* =====================================================
     مرحله 12
     
     فقط سه ردیف الگو
     ردیف چهارم کاملاً حذف شده است.
     ===================================================== */

  {
    type: "combinedChecker",

    rows: [

      /* -------------------------------------------------
         الگوی اول
         ------------------------------------------------- */

      {
        pattern: [
          "green",
          "white"
        ],

        blanks: [
          14,15,16,17,
          18,19,20
        ]
      },


      /* -------------------------------------------------
         الگوی دوم
         ------------------------------------------------- */

      {
        pattern: [
          "white",
          "green",
          "white",
          "red"
        ],

        blanks: [
          14,15,16,17,
          18,19,20
        ]
      },


      /* -------------------------------------------------
         الگوی سوم
         ------------------------------------------------- */

      {
        pattern: [
          "green",
          "white"
        ],

        blanks: [
          14,15,16,17,
          18,19,20
        ]
      }

    ],

    instruction:
      "الگو را پیدا کن و سپس ادامه بده."
  }

];


/* =========================================================
   ابزارهای صفحه
   ========================================================= */

const startScreen =
  document.getElementById(
    "startScreen"
  );

const gameScreen =
  document.getElementById(
    "gameScreen"
  );

const finishScreen =
  document.getElementById(
    "finishScreen"
  );

const studentNameInput =
  document.getElementById(
    "studentName"
  );

const startBtn =
  document.getElementById(
    "startBtn"
  );

const prevBtn =
  document.getElementById(
    "prevBtn"
  );

const nextBtn =
  document.getElementById(
    "nextBtn"
  );

const stageCounter =
  document.getElementById(
    "stageCounter"
  );

const instruction =
  document.getElementById(
    "instruction"
  );

const taskArea =
  document.getElementById(
    "taskArea"
  );

const repeatBox =
  document.getElementById(
    "repeatBox"
  );

const repeatArea =
  document.getElementById(
    "repeatArea"
  );

const paletteBox =
  document.getElementById(
    "paletteBox"
  );

const palette =
  document.getElementById(
    "palette"
  );

const checkBtn =
  document.getElementById(
    "checkBtn"
  );

const clearBtn =
  document.getElementById(
    "clearBtn"
  );

const feedback =
  document.getElementById(
    "feedback"
  );

const restartBtn =
  document.getElementById(
    "restartBtn"
  );

const finishText =
  document.getElementById(
    "finishText"
  );

const finalScore =
  document.getElementById(
    "finalScore"
  );


/* =========================================================
   صدا
   ========================================================= */

function initAudio() {

  if (!audioContext) {

    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (AudioCtx) {
      audioContext =
        new AudioCtx();
    }
  }
}


function playTone(
  frequency = 500,
  duration = 0.09,
  type = "sine",
  volume = 0.045
) {

  try {

    initAudio();

    if (!audioContext)
      return;

    if (
      audioContext.state ===
      "suspended"
    ) {
      audioContext.resume();
    }

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type =
      type;

    oscillator.frequency.value =
      frequency;

    gain.gain.setValueAtTime(
      volume,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime +
      duration
    );

    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime +
      duration
    );

  } catch (e) {}
}


function playClick() {

  playTone(
    620,
    0.07,
    "sine",
    0.035
  );
}


function playCorrect() {

  playTone(
    523,
    0.10,
    "sine",
    0.05
  );

  setTimeout(() => {

    playTone(
      659,
      0.10,
      "sine",
      0.05
    );

  },100);

  setTimeout(() => {

    playTone(
      784,
      0.18,
      "sine",
      0.05
    );

  },210);
}


function playWrong() {

  playTone(
    190,
    0.15,
    "sawtooth",
    0.035
  );

  setTimeout(() => {

    playTone(
      140,
      0.13,
      "sawtooth",
      0.03
    );

  },120);
}


/* =========================================================
   شکل ها
   ========================================================= */

const shapeInfo = {

  circle: {
    symbol: "●",
    color: "#42a5f5"
  },

  square: {
    symbol: "■",
    color: "#ffd84d"
  },

  triangle: {
    symbol: "▲",
    color: "#ef5350"
  },

  star: {
    symbol: "★",
    color: "#ffb52e"
  },

  heart: {
    symbol: "♥",
    color: "#ff73ad"
  },

  diamond: {
    symbol: "◆",
    color: "#58c86b"
  }

};


/* =========================================================
   خانه رنگی
   ========================================================= */

function createColorCell(
  color,
  editable,
  index,
  containerType = "main"
) {

  const cell =
    document.createElement(
      "div"
    );

  cell.className =
    "pattern-cell " +
    (
      editable
        ? "editable"
        : "locked"
    );

  cell.dataset.index =
    index;

  cell.dataset.container =
    containerType;

  if (color) {

    cell.classList.add(
      "cell-" + color
    );

    cell.dataset.color =
      color;

  } else {

    cell.classList.add(
      "cell-white"
    );

    cell.dataset.color =
      "";

  }

  cell.addEventListener(
    "click",
    () => {

      if (!editable)
        return;

      if (!selectedTool)
        return;

      playClick();

      if (
        selectedTool ===
        "eraser"
      ) {

        cell.dataset.color =
          "";

        cell.className =
          "pattern-cell editable cell-white";

      } else {

        cell.dataset.color =
          selectedTool;

        cell.className =
          "pattern-cell editable cell-" +
          selectedTool;

      }

    }
  );

  return cell;
}


/* =========================================================
   پالت رنگ
   ========================================================= */

function createColorPalette() {

  palette.innerHTML = "";

  const colors = [
    "green",
    "red",
    "blue",
    "yellow",
    "pink",
    "purple"
  ];

  colors.forEach(
    color => {

      const item =
        document.createElement(
          "button"
        );

      item.type = "button";

      item.className =
        "palette-item";

      item.style.background =
        COLORS[color];

      item.dataset.tool =
        color;

      item.addEventListener(
        "click",
        () => {

          selectedTool =
            color;

          document
            .querySelectorAll(
              ".palette-item"
            )
            .forEach(x =>
              x.classList.remove(
                "selected"
              )
            );

          item.classList.add(
            "selected"
          );

          playClick();

        }
      );

      palette.appendChild(
        item
      );

    }
  );


  const eraser =
    document.createElement(
      "button"
    );

  eraser.type = "button";

  eraser.className =
    "palette-item eraser";

  eraser.textContent =
    "⌫";

  eraser.addEventListener(
    "click",
    () => {

      selectedTool =
        "eraser";

      document
        .querySelectorAll(
          ".palette-item"
        )
        .forEach(x =>
          x.classList.remove(
            "selected"
          )
        );

      eraser.classList.add(
        "selected"
      );

      playClick();

    }
  );

  palette.appendChild(
    eraser
  );
}


/* =========================================================
   پالت شکل
   ========================================================= */

function createShapePalette() {

  palette.innerHTML = "";

  const shapes = [
    "circle",
    "square",
    "triangle",
    "star",
    "heart",
    "diamond"
  ];

  shapes.forEach(
    shape => {

      const item =
        document.createElement(
          "button"
        );

      item.type = "button";

      item.className =
        "palette-item";

      item.style.background =
        "#fff";

      item.innerHTML =
        `<span style="
          color:${shapeInfo[shape].color};
          font-size:25px;
        ">${shapeInfo[shape].symbol}</span>`;

      item.dataset.tool =
        shape;

      item.addEventListener(
        "click",
        () => {

          selectedTool =
            shape;

          document
            .querySelectorAll(
              ".palette-item"
            )
            .forEach(x =>
              x.classList.remove(
                "selected"
              )
            );

          item.classList.add(
            "selected"
          );

          playClick();

        }
      );

      palette.appendChild(
        item
      );

    }
  );


  const eraser =
    document.createElement(
      "button"
    );

  eraser.type = "button";

  eraser.className =
    "palette-item eraser";

  eraser.textContent =
    "⌫";

  eraser.addEventListener(
    "click",
    () => {

      selectedTool =
        "eraser";

      document
        .querySelectorAll(
          ".palette-item"
        )
        .forEach(x =>
          x.classList.remove(
            "selected"
          )
        );

      eraser.classList.add(
        "selected"
      );

      playClick();

    }
  );

  palette.appendChild(
    eraser
  );
}


/* =========================================================
   جدول رنگی
   ========================================================= */

function createMainColorGrid(stage) {

  taskArea.innerHTML = "";

  const wrap =
    document.createElement(
      "div"
    );

  wrap.className =
    "task-wrap";

  const grid =
    document.createElement(
      "div"
    );

  grid.className =
    "pattern-grid";

  currentCells = [];

  for (
    let i = 0;
    i < TOTAL_COLUMNS;
    i++
  ) {

    const patternIndex =
      i %
      stage.pattern.length;

    const shouldBeBlank =
      stage.blanks.includes(i);

    let color = null;

    if (!shouldBeBlank) {

      color =
        stage.pattern[
          patternIndex
        ];

    }

    const cell =
      createColorCell(
        color,
        shouldBeBlank,
        i,
        "main"
      );

    grid.appendChild(
      cell
    );

    currentCells.push(
      cell
    );

  }

  wrap.appendChild(
    grid
  );

  taskArea.appendChild(
    wrap
  );

  createColorPalette();

  createRepeatGrid(
    stage.pattern
  );
}


/* =========================================================
   جدول شکل
   ========================================================= */

function createShapeGrid(stage) {

  taskArea.innerHTML = "";

  const wrap =
    document.createElement(
      "div"
    );

  wrap.className =
    "task-wrap";

  const grid =
    document.createElement(
      "div"
    );

  grid.className =
    "pattern-grid";

  currentCells = [];

  for (
    let i = 0;
    i < TOTAL_COLUMNS;
    i++
  ) {

    const patternIndex =
      i %
      stage.pattern.length;

    const shouldBeBlank =
      stage.blanks.includes(i);

    const cell =
      document.createElement(
        "div"
      );

    cell.className =
      "pattern-cell " +
      (
        shouldBeBlank
          ? "editable"
          : "locked"
      );

    cell.dataset.index =
      i;

    if (!shouldBeBlank) {

      const shape =
        stage.pattern[
          patternIndex
        ];

      cell.dataset.shape =
        shape;

      cell.innerHTML =
        `<span style="
          color:${shapeInfo[shape].color};
          font-size:clamp(12px,3vw,38px);
          line-height:1;
        ">${shapeInfo[shape].symbol}</span>`;

    } else {

      cell.dataset.shape =
        "";

      cell.classList.add(
        "cell-white"
      );

      cell.addEventListener(
        "click",
        () => {

          if (!selectedTool)
            return;

          playClick();

          if (
            selectedTool ===
            "eraser"
          ) {

            cell.innerHTML =
              "";

            cell.dataset.shape =
              "";

          } else {

            const shape =
              selectedTool;

            cell.dataset.shape =
              shape;

            cell.innerHTML =
              `<span style="
                color:${shapeInfo[shape].color};
                font-size:clamp(12px,3vw,38px);
                line-height:1;
              ">${shapeInfo[shape].symbol}</span>`;

          }

        }
      );

    }

    grid.appendChild(
      cell
    );

    currentCells.push(
      cell
    );

  }

  wrap.appendChild(
    grid
  );

  taskArea.appendChild(
    wrap
  );

  createShapePalette();

  repeatBox.classList.add(
