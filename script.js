/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   نسخه نهایی
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     عناصر صفحه
     ========================================================= */

  const startScreen = document.getElementById("startScreen");
  const gameScreen = document.getElementById("gameScreen");
  const finishScreen = document.getElementById("finishScreen");

  const studentNameInput = document.getElementById("studentName");
  const startBtn = document.getElementById("startBtn");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const stageCounter = document.getElementById("stageCounter");
  const instruction = document.getElementById("instruction");

  const taskArea = document.getElementById("taskArea");

  const repeatBox = document.getElementById("repeatBox");
  const repeatArea = document.getElementById("repeatArea");

  const paletteBox = document.getElementById("paletteBox");
  const palette = document.getElementById("palette");

  const checkBtn = document.getElementById("checkBtn");
  const clearBtn = document.getElementById("clearBtn");

  const feedback = document.getElementById("feedback");

  const restartBtn = document.getElementById("restartBtn");

  const finishText = document.getElementById("finishText");
  const finalScore = document.getElementById("finalScore");


  /* =========================================================
     متغیرهای بازی
     ========================================================= */

  let studentName = "";
  let currentStage = 0;
  let score = 0;

  let selectedTool = null;

  let currentCells = [];
  let repeatCells = [];

  let selectedShapeAnswer = null;

  let audioContext = null;

  const completedStages = new Set();


  /* =========================================================
     رنگ‌ها
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
     شکل‌ها
     ========================================================= */

  const shapeInfo = {
    circle: {
      symbol: "●",
      label: "دایره"
    },

    square: {
      symbol: "■",
      label: "مربع"
    },

    triangle: {
      symbol: "▲",
      label: "مثلث"
    },

    star: {
      symbol: "★",
      label: "ستاره"
    },

    heart: {
      symbol: "♥",
      label: "قلب"
    },

    diamond: {
      symbol: "◆",
      label: "لوزی"
    }
  };


  /* =========================================================
     مراحل بازی
     ========================================================= */

  const stages = [

    /* مرحله ۱ */
    {
      type: "color",
      pattern: ["green", "green", "red"],
      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },

    /* مرحله ۲ */
    {
      type: "color",
      pattern: ["blue", "yellow"],
      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },

    /* مرحله ۳ */
    {
      type: "color",
      pattern: ["green", "red", "red"],
      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },

    /* مرحله ۴ */
    {
      type: "color",
      pattern: ["yellow", "blue", "green"],
      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },

    /* مرحله ۵ */
    {
      type: "color",
      pattern: ["red", "red", "yellow"],
      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },

    /* مرحله ۶ */
    {
      type: "color",
      pattern: ["green", "blue", "blue"],
      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },

    /* مرحله ۷ */
    {
      type: "color",
      pattern: ["pink", "pink", "yellow"],
      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },

    /* مرحله ۸ */
    {
      type: "shape",
      pattern: ["circle", "circle", "triangle"],

      totalCells: 15,
      readyCells: 6,

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },

    /* مرحله ۹ */
    {
      type: "remove",

      shapes: [
        "circle",
        "circle",
        "square",
        "triangle",
        "circle",
        "circle",
        "square"
      ],

      answer: 3,

      instruction:
        "🔍 شکل اشتباه را پیدا کن و حذفش کن تا الگو درست شود."
    },

    /* مرحله ۱۰ */
    {
      type: "shape",

      pattern: ["star", "star", "heart"],

      totalCells: 12,
      readyCells: 6,

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },

    /* مرحله ۱۱ */
    {
      type: "remove",

      shapes: [
        "triangle",
        "triangle",
        "circle",
        "triangle",
        "square",
        "triangle",
        "circle",
        "triangle",
        "triangle"
      ],

      answer: 4,

      instruction:
        "🔍 شکل اشتباه را پیدا کن و حذفش کن تا الگو درست شود."
    },

    /* مرحله ۱۲ */
    {
      type: "combinedChecker",

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده.",

      rows: [

        {
          pattern: [
            "green",
            "white"
          ]
        },

        {
          pattern: [
            "white",
            "green",
            "white",
            "red"
          ]
        },

        {
          pattern: [
            "green",
            "white"
          ]
        }

      ]
    }

  ];


  /* =========================================================
     تبدیل عدد به رقم فارسی
     ========================================================= */

  function persianNumber(number) {

    return String(number).replace(
      /[0-9]/g,
      digit => "۰۱۲۳۴۵۶۷۸۹"[digit]
    );
  }


  /* =========================================================
     سیستم صدا
     ========================================================= */

  function initAudio() {

    try {

      if (!audioContext) {

        const AudioCtx =
          window.AudioContext ||
          window.webkitAudioContext;

        if (AudioCtx) {
          audioContext = new AudioCtx();
        }
      }

      if (
        audioContext &&
        audioContext.state === "suspended"
      ) {

        audioContext.resume();
      }

    } catch (error) {

      console.log("Audio unavailable");
    }
  }


  function playTone(
    frequency,
    duration = 0.12,
    type = "sine",
    volume = 0.045
  ) {

    if (!audioContext) return;

    try {

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
        audioContext.currentTime + duration
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();

      oscillator.stop(
        audioContext.currentTime + duration
      );

    } catch (error) {

      console.log("Tone error");
    }
  }


  function playClickSound() {
    playTone(520, 0.07, "sine", 0.035);
  }


  function playColorSound() {
    playTone(620, 0.09, "sine", 0.04);
  }


  function playShapeSound() {
    playTone(720, 0.09, "triangle", 0.04);
  }


  function playCorrectSound() {

    if (!audioContext) return;

    playTone(660, 0.10, "sine", 0.05);

    setTimeout(() => {

      playTone(
        880,
        0.14,
        "sine",
        0.05
      );

    }, 90);
  }


  function playWrongSound() {

    if (!audioContext) return;

    playTone(
      220,
      0.16,
      "sawtooth",
      0.035
    );

    setTimeout(() => {

      playTone(
        170,
        0.20,
        "sawtooth",
        0.03
      );

    }, 110);
  }


  /* =========================================================
     شروع بازی
     ========================================================= */

  startBtn.addEventListener(
    "click",
    () => {

      initAudio();

      studentName =
        studentNameInput.value.trim();

      if (!studentName) {
        studentName = "شکوفه‌ی عزیز";
      }

      playClickSound();

      currentStage = 0;
      score = 0;

      completedStages.clear();

      startScreen.classList.add("hidden");

      finishScreen.classList.add("hidden");

      gameScreen.classList.remove("hidden");

      renderStage();
    }
  );


  /* =========================================================
     جدول رنگی اصلی
     ========================================================= */

  function createMainColorGrid(stage) {

    currentCells = [];

    const grid =
      document.createElement("div");

    grid.className =
      "pattern-grid";

    const pattern =
      stage.pattern;

    const total =
      pattern.length * 4;

    const readyCount =
      pattern.length * 2;

    grid.style.gridTemplateColumns =
      `repeat(${total}, minmax(0, 1fr))`;

    for (let i = 0; i < total; i++) {

      const cell =
        document.createElement("div");

      cell.className =
        "pattern-cell";

      const expected =
        pattern[
          i % pattern.length
        ];

      cell.dataset.expected =
        expected;

      if (i < readyCount) {

        cell.classList.add(
          `cell-${expected}`
        );

      } else {

        cell.classList.add(
          "editable"
        );

        cell.addEventListener(
          "click",
          () => {

            initAudio();

            if (!selectedTool) {

              playClickSound();

              return;
            }

            if (
              selectedTool === "eraser"
            ) {

              clearCellColor(cell);

            } else {

              setCellColor(
                cell,
                selectedTool
              );

              playColorSound();
            }

          }
        );

        currentCells.push(cell);
      }

      grid.appendChild(cell);
    }

    taskArea.appendChild(grid);
  }


  /* =========================================================
     رنگ‌آمیزی خانه اصلی
     ========================================================= */

  function setCellColor(
    cell,
    color
  ) {

    Object.keys(COLORS).forEach(
      name => {

        cell.classList.remove(
          `cell-${name}`
        );

      }
    );

    cell.classList.add(
      `cell-${color}`
    );

    cell.dataset.selected =
      color;
  }


  function clearCellColor(cell) {

    Object.keys(COLORS).forEach(
      name => {

        cell.classList.remove(
          `cell-${name}`
        );

      }
    );

    delete cell.dataset.selected;

    cell.classList.add(
      "editable"
    );

    playClickSound();
  }


  /* =========================================================
     جدول پایین مراحل ۱ تا ۷
     =================================================
