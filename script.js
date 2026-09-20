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
   مراحل بازی
   ========================================================= */

const stages = [

  /* =====================================================
     مرحله 1
     ===================================================== */
  {
    type: "color",
    pattern: ["green", "green", "red"],
    blanks: [15, 16, 17, 18, 19, 20],
    instruction:
      "الگوی تکرارشونده را ادامه بده. سپس الگویی را که پیدا کردی، یک بار در پایین رسم کن."
  },


  /* =====================================================
     مرحله 2
     ===================================================== */
  {
    type: "color",
    pattern: ["blue", "yellow"],
    blanks: [13, 14, 15, 16, 17, 18, 19, 20],
    instruction:
      "الگوی تکرارشونده را ادامه بده. سپس الگویی را که پیدا کردی، یک بار در پایین رسم کن."
  },


  /* =====================================================
     مرحله 3
     ===================================================== */
  {
    type: "color",
    pattern: ["green", "red", "red"],
    blanks: [14, 15, 16, 17, 18, 19, 20],
    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده. سپس الگو را یک بار در پایین رسم کن."
  },


  /* =====================================================
     مرحله 4
     ===================================================== */
  {
    type: "color",
    pattern: ["yellow", "blue", "green"],
    blanks: [14, 15, 16, 17, 18, 19, 20],
    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده. سپس الگو را یک بار در پایین رسم کن."
  },


  /* =====================================================
     مرحله 5
     ===================================================== */
  {
    type: "color",
    pattern: ["red", "red", "yellow"],
    blanks: [14, 15, 16, 17, 18, 19, 20],
    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده. سپس الگو را یک بار در پایین رسم کن."
  },


  /* =====================================================
     مرحله 6
     ===================================================== */
  {
    type: "color",
    pattern: ["green", "blue", "blue"],
    blanks: [14, 15, 16, 17, 18, 19, 20],
    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده. سپس الگو را یک بار در پایین رسم کن."
  },


  /* =====================================================
     مرحله 7
     اصلاح شد:
     صورتی، صورتی، زرد
     ===================================================== */
  {
    type: "color",
    pattern: ["pink", "pink", "yellow"],
    blanks: [14, 15, 16, 17, 18, 19, 20],
    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده. سپس الگو را یک بار در پایین رسم کن."
  },


  /* =====================================================
     مرحله 8 قبلی حذف شد
     ===================================================== */


  /* =====================================================
     مرحله 8 جدید
     قبلاً مرحله 9 بود
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
    blanks: [13, 14, 15, 16, 17, 18, 19, 20],
    instruction:
      "الگوی تکرارشونده را پیدا کن و الگو را ادامه بده."
  },


  /* =====================================================
     مرحله 9 جدید
     قبلاً مرحله 10 بود
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
     مرحله 10 جدید
     قبلاً مرحله 11 بود
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
    blanks: [13, 14, 15, 16, 17, 18, 19, 20],
    instruction:
      "الگوی تکرارشونده را پیدا کن و الگو را ادامه بده."
  },


  /* =====================================================
     مرحله 11 جدید
     قبلاً مرحله 12 بود
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
     الگوهای 13، 14، 15 و 16 قبلی
     همه در یک سؤال
     ===================================================== */
  {
    type: "multiChecker",

    rows: [

      /* الگوی 13 */
      {
        pattern: ["green", "white"],
        blanks: [
          14, 15, 16, 17, 18, 19, 20
        ]
      },

      /* الگوی 14 */
      {
        pattern: [
          "white",
          "green",
          "white",
          "red"
        ],
        blanks: [
          14, 15, 16, 17, 18, 19, 20
        ]
      },

      /* الگوی 15 */
      {
        pattern: ["green", "white"],
        blanks: [
          14, 15, 16, 17, 18, 19, 20
        ]
      },

      /* الگوی 16 */
      {
        pattern: [
          "green",
          "white",
          "red",
          "white"
        ],
        blanks: [
          14, 15, 16, 17, 18, 19, 20
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
  document.getElementById("startScreen");

const gameScreen =
  document.getElementById("gameScreen");

const finishScreen =
  document.getElementById("finishScreen");

const studentNameInput =
  document.getElementById("studentName");

const startBtn =
  document.getElementById("startBtn");

const prevBtn =
  document.getElementById("prevBtn");

const nextBtn =
  document.getElementById("nextBtn");

const stageCounter =
  document.getElementById("stageCounter");

const instruction =
  document.getElementById("instruction");

const taskArea =
  document.getElementById("taskArea");

const repeatBox =
  document.getElementById("repeatBox");

const repeatArea =
  document.getElementById("repeatArea");

const paletteBox =
  document.getElementById("paletteBox");

const palette =
  document.getElementById("palette");

const checkBtn =
  document.getElementById("checkBtn");

const clearBtn =
  document.getElementById("clearBtn");

const feedback =
  document.getElementById("feedback");

const restartBtn =
  document.getElementById("restartBtn");

const finishText =
  document.getElementById("finishText");

const finalScore =
  document.getElementById("finalScore");


/* =========================================================
   صدا
   ========================================================= */

function initAudio() {

  if (!audioContext) {

    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (AudioCtx) {
      audioContext = new AudioCtx();
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

    if (!audioContext) return;

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

    oscillator.type = type;
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
    gain.connect(audioContext.destination);

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

  }, 100);

  setTimeout(() => {

    playTone(
      784,
      0.18,
      "sine",
      0.05
    );

  }, 210);
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

  }, 120);
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

 
