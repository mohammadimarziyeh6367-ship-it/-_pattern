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
        "🎨 الگو را بخوان و سپس خانه‌های خالی را کامل کن."
    },

    /* مرحله ۲ */
    {
      type: "color",
      pattern: ["blue", "yellow"],
      instruction:
        "🎨 الگو را بخوان و سپس خانه‌های خالی را کامل کن."
    },

    /* مرحله ۳ */
    {
      type: "color",
      pattern: ["green", "red", "red"],
      instruction:
        "🎨 الگو را بخوان و سپس خانه‌های خالی را کامل کن."
    },

    /* مرحله ۴ */
    {
      type: "color",
      pattern: ["yellow", "blue", "green"],
      instruction:
        "🎨 الگو را بخوان و سپس خانه‌های خالی را کامل کن."
    },

    /* مرحله ۵ */
    {
      type: "color",
      pattern: ["red", "red", "yellow"],
      instruction:
        "🎨 الگو را بخوان و سپس خانه‌های خالی را کامل کن."
    },

    /* مرحله ۶ */
    {
      type: "color",
      pattern: ["green", "blue", "blue"],
      instruction:
        "🎨 الگو را بخوان و سپس خانه‌های خالی را کامل کن."
    },

    /* مرحله ۷ */
    {
      type: "color",
      pattern: ["pink", "pink", "yellow"],
      instruction:
        "🎨 الگو را بخوان و سپس خانه‌های خالی را کامل کن."
    },

    /* مرحله ۸ */
    {
      type: "shape",
      pattern: ["circle", "circle", "triangle"],

      totalCells: 15,
      readyCells: 6,

      instruction:
        "🔷 الگو را بخوان و سپس آن را ادامه بده."
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
        "🔷 الگو را بخوان و سپس آن را ادامه بده."
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
        "🌈 الگو را پیدا کن و سپس ادامه بده.",

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
     
     ۶ خانه دارد اما فقط یک بار الگو
     باید از سمت چپ در آن نوشته شود.
     
     خانه‌های باقی‌مانده باید خالی بمانند.
     ========================================================= */

  function createRepeatGrid(pattern) {

    repeatCells = [];

    repeatBox.classList.remove(
      "hidden"
    );

    repeatArea.innerHTML = "";

    repeatArea.style.gridTemplateColumns =
      "repeat(6, minmax(0, 1fr))";

    for (let i = 0; i < 6; i++) {

      const cell =
        document.createElement("div");

      cell.className =
        "repeat-cell";

      /*
       * فقط به اندازه طول الگو
       * خانه دارای پاسخ است.
       *
       * مثال:
       * الگوی ۳تایی:
       * 🟩 🟩 🟥 ⬜ ⬜ ⬜
       *
       * الگوی ۲تایی:
       * 🟦 🟨 ⬜ ⬜ ⬜ ⬜
       */

      if (i < pattern.length) {

        cell.dataset.expected =
          pattern[i];

      } else {

        cell.dataset.expected =
          "";
      }

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

            clearRepeatCell(cell);

          } else {

            setRepeatCellColor(
              cell,
              selectedTool
            );

            playColorSound();
          }

        }
      );

      repeatArea.appendChild(cell);

      repeatCells.push(cell);
    }
  }


  function setRepeatCellColor(
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


  function clearRepeatCell(cell) {

    Object.keys(COLORS).forEach(
      name => {

        cell.classList.remove(
          `cell-${name}`
        );

      }
    );

    delete cell.dataset.selected;

    playClickSound();
  }


  /* =========================================================
     پالت رنگ
     ========================================================= */

  function createColorPalette() {

    paletteBox.classList.remove(
      "hidden"
    );

    palette.innerHTML = "";

    selectedTool = null;

    const colorNames = [
      "green",
      "blue",
      "yellow",
      "red",
      "pink",
      "purple",
      "white"
    ];

    colorNames.forEach(
      color => {

        const item =
          document.createElement("button");

        item.type = "button";

        item.className =
          "palette-item";

        item.dataset.color =
          color;

        item.style.background =
          COLORS[color];

        if (color === "white") {

          item.style.border =
            "3px solid #3d3151";
        }

        item.addEventListener(
          "click",
          () => {

            initAudio();

            selectedTool =
              color;

            document
              .querySelectorAll(
                ".palette-item"
              )
              .forEach(
                button => {

                  button.classList.remove(
                    "selected"
                  );

                }
              );

            item.classList.add(
              "selected"
            );

            playColorSound();
          }
        );

        palette.appendChild(item);
      }
    );


    /* پاک‌کن */

    const eraser =
      document.createElement("button");

    eraser.type = "button";

    eraser.className =
      "palette-item eraser";

    eraser.textContent =
      "⌫";

    eraser.title =
      "پاک‌کن";

    eraser.addEventListener(
      "click",
      () => {

        initAudio();

        selectedTool =
          "eraser";

        document
          .querySelectorAll(
            ".palette-item"
          )
          .forEach(
            button => {

              button.classList.remove(
                "selected"
              );

            }
          );

        eraser.classList.add(
          "selected"
        );

        playClickSound();
      }
    );

    palette.appendChild(
      eraser
    );
  }


  /* =========================================================
     ساخت مرحله شکل
     ========================================================= */

  function createShapeGrid(stage) {

    currentCells = [];

    const grid =
      document.createElement("div");

    grid.className =
      "shape-grid";

    const total =
      stage.totalCells;

    const readyCount =
      stage.readyCells;

    grid.style.gridTemplateColumns =
      `repeat(${total}, minmax(0, 1fr))`;

    grid.style.justifyContent =
      "start";

    for (let i = 0; i < total; i++) {

      const cell =
        document.createElement("div");

      cell.className =
        "shape-cell";

      if (i < readyCount) {

        const shape =
          stage.pattern[
            i % stage.pattern.length
          ];

        const symbol =
          document.createElement("span");

        symbol.className =
          "shape-symbol";

        symbol.textContent =
          shapeInfo[shape].symbol;

        symbol.title =
          shapeInfo[shape].label;

        cell.appendChild(
          symbol
        );

      } else {

        cell.classList.add(
          "editable"
        );

        cell.dataset.expected =
          stage.pattern[
            i % stage.pattern.length
          ];

        cell.addEventListener(
          "click",
          () => {

            initAudio();

            const shape =
              selectedTool;

            if (
              !shape ||
              !shapeInfo[shape]
            ) {

              playClickSound();

              return;
            }

            cell.innerHTML = "";

            const symbol =
              document.createElement("span");

            symbol.className =
              "shape-symbol";

            symbol.textContent =
              shapeInfo[shape].symbol;

            cell.appendChild(
              symbol
            );

            cell.dataset.selected =
              shape;

            playShapeSound();
          }
        );

        currentCells.push(
          cell
        );
      }

      grid.appendChild(
        cell
      );
    }

    taskArea.appendChild(
      grid
    );
  }


  /* =========================================================
     پالت شکل‌ها
     ========================================================= */

  function createShapePalette() {

    paletteBox.classList.remove(
      "hidden"
    );

    palette.innerHTML = "";

    selectedTool = null;

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
          document.createElement("button");

        item.type = "button";

        item.className =
          "palette-item";

        const symbol =
          document.createElement("span");

        symbol.className =
          "shape-symbol";

        symbol.textContent =
          shapeInfo[shape].symbol;

        item.appendChild(
          symbol
        );

        item.title =
          shapeInfo[shape].label;

        item.addEventListener(
          "click",
          () => {

            initAudio();

            selectedTool =
              shape;

            document
              .querySelectorAll(
                ".palette-item"
              )
              .forEach(
                button => {

                  button.classList.remove(
                    "selected"
                  );

                }
              );

            item.classList.add(
              "selected"
            );

            playShapeSound();
          }
        );

        palette.appendChild(
          item
        );
      }
    );
  }


  /* =========================================================
     مرحله حذف شکل
     ========================================================= */

  function createRemoveStage(stage) {

    selectedShapeAnswer = null;

    paletteBox.classList.add(
      "hidden"
    );

    repeatBox.classList.add(
      "hidden"
    );

    const row =
      document.createElement("div");

    row.className =
      "shape-row";

    row.style.gridTemplateColumns =
      `repeat(${stage.shapes.length}, minmax(0, 1fr))`;

    row.style.justifyContent =
      "start";

    row.style.direction =
      "ltr";

    stage.shapes.forEach(
      (shape, index) => {

        const option =
          document.createElement("button");

        option.type = "button";

        option.className =
          "shape-option";

        option.dataset.index =
          index;

        const symbol =
          document.createElement("span");

        symbol.className =
          "remove-shape-symbol";

        symbol.textContent =
          shapeInfo[shape].symbol;

        option.appendChild(
          symbol
        );

        option.addEventListener(
          "click",
          () => {

            initAudio();

            selectedShapeAnswer =
              index;

            document
              .querySelectorAll(
                ".shape-option"
              )
              .forEach(
                item => {

                  item.classList.remove(
                    "selected"
                  );

                }
              );

            option.classList.add(
              "selected"
            );

            playShapeSound();
          }
        );

        row.appendChild(
          option
        );
      }
    );

    taskArea.appendChild(
      row
    );
  }


  /* =========================================================
     مرحله ۱۲
     ========================================================= */

  function createCombinedCheckerStage(stage) {

    currentCells = [];
    repeatCells = [];

    repeatBox.classList.add(
      "hidden"
    );

    paletteBox.classList.remove(
      "hidden"
    );

    palette.innerHTML = "";

    selectedTool = null;

    const mainBox =
      document.createElement("div");

    mainBox.className =
      "combined-pattern-box";


    /* =======================================================
       جدول اصلی سه ردیف × ۲۱ خانه
       ======================================================= */

    stage.rows.forEach(
      rowData => {

        const row =
          document.createElement("div");

        row.className =
          "combined-row-box";

        row.style.gridTemplateColumns =
          "repeat(21, minmax(0, 1fr))";


        for (let i = 0; i < 21; i++) {

          const cell =
            document.createElement("div");

          cell.className =
            "pattern-cell";

          const expected =
            rowData.pattern[
              i % rowData.pattern.length
            ];

          cell.dataset.expected =
            expected;


          /*
           * ۱۴ خانه اول آماده هستند.
           * ۷ خانه آخر را دانش‌آموز ادامه می‌دهد.
           */

          if (i < 14) {

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
                  selectedTool ===
                  "eraser"
                ) {

                  clearCellColor(
                    cell
                  );

                } else {

                  setCellColor(
                    cell,
                    selectedTool
                  );

                  playColorSound();
                }
              }
            );

            currentCells.push(
              cell
            );
          }

          row.appendChild(
            cell
          );
        }

        mainBox.appendChild(
          row
        );
      }
    );

    taskArea.appendChild(
      mainBox
    );


    /* =======================================================
       جدول پایین مرحله ۱۲
       سه ردیف × ۶ خانه
       
       دانش‌آموز فقط یک بار الگو را
       از سمت چپ تکرار می‌کند.
       
       خانه آخر باید خالی بماند.
       ======================================================= */

    const lowerBox =
      document.createElement("div");

    lowerBox.className =
      "combined-repeat-box";


    const title =
      document.createElement("div");

    title.className =
      "combined-repeat-title";

    title.textContent =
      "🔁 الگوی هر ردیف را یک بار در پایین تکرار کن.";

    lowerBox.appendChild(
      title
    );


    stage.rows.forEach(
      rowData => {

        const repeatRow =
          document.createElement("div");

        repeatRow.className =
          "combined-repeat-row";

        repeatRow.style.gridTemplateColumns =
          "repeat(6, minmax(0, 1fr))";


        for (let i = 0; i < 6; i++) {

          const cell =
            document.createElement("div");

          cell.className =
            "repeat-cell";


          /*
           * در مرحله ۱۲:
           *
           * فقط پنج خانه اول
           * متعلق به یک بار تکرار الگو هستند.
           *
           * خانه ششم باید خالی بماند.
           *
           * مثال ردیف اول:
           * سبز | خالی | سبز | خالی | سبز | خالی
           *
           * ردیف دوم:
           * خالی | سبز | خالی | قرمز | خالی | خالی
           *
           * ردیف سوم:
           * سبز | خالی | سبز | خالی | سبز | خالی
           */

          if (i < 5) {

            cell.dataset.expected =
              rowData.pattern[
                i % rowData.pattern.length
              ];

          } else {

            cell.dataset.expected =
              "";
          }


          cell.addEventListener(
            "click",
            () => {

              initAudio();

              if (!selectedTool) {

                playClickSound();

                return;
              }

              if (
                selectedTool ===
                "eraser"
              ) {

                clearRepeatCell(
                  cell
                );

              } else {

                setRepeatCellColor(
                  cell,
                  selectedTool
                );

                playColorSound();
              }

            }
          );


          repeatRow.appendChild(
            cell
          );

          repeatCells.push(
            cell
          );
        }

        lowerBox.appendChild(
          repeatRow
        );
      }
    );


    taskArea.appendChild(
      lowerBox
    );


    createCombinedPalette();
  }


  /* =========================================================
     بررسی مراحل ۱ تا ۷
     
     مهم:
     جدول پایین ۶ خانه دارد اما فقط یک بار
     الگو باید از سمت چپ در آن تکرار شود.
     
     خانه‌های باقی‌مانده باید خالی باشند.
     ========================================================= */

  function checkColorStage(stage) {

    let correct = true;


    /* =======================================================
       بررسی خانه‌های اصلی
       ======================================================= */

    currentCells.forEach(
      cell => {

        const selected =
          cell.dataset.selected;

        const expected =
          cell.dataset.expected;

        if (
          !selected ||
          selected !== expected
        ) {

          correct = false;
        }
      }
    );


    /* =======================================================
       بررسی جدول پایین
       ======================================================= */

    repeatCells.forEach(
      (cell, index) => {

        const selected =
          cell.dataset.selected;

        const expected =
          cell.dataset.expected;


        /*
         * خانه‌های مربوط به یک بار الگو
         * باید دقیقاً رنگ درست داشته باشند.
         */

        if (index < stage.pattern.length) {

          if (
            !selected ||
            selected !== expected
          ) {

            correct = false;
          }

        } else {

          /*
           * خانه‌های باقی‌مانده باید کاملاً خالی باشند.
           */

          if (selected) {

            correct = false;
          }
        }
      }
    );


    showCheckResult(
      correct
    );
  }


  /* =========================================================
     بررسی مرحله شکل
     ========================================================= */

  function checkShapeStage(stage) {

    let correct = true;

    currentCells.forEach(
      cell => {

        const selected =
          cell.dataset.selected;

        const expected =
          cell.dataset.expected;

        if (
          !selected ||
          selected !== expected
        ) {

          correct = false;
        }
      }
    );

    showCheckResult(
      correct
    );
  }


  /* =========================================================
     بررسی حذف شکل
     ========================================================= */

  function checkRemoveStage(stage) {

    if (
      selectedShapeAnswer === null
    ) {

      feedback.textContent =
        "🌸 اول شکل اشتباه را انتخاب کن.";

      feedback.style.color =
        "#e85b91";

      playClickSound();

      return;
    }


    const correct =
      selectedShapeAnswer ===
      stage.answer;

    showCheckResult(
      correct
    );
  }


  /* =========================================================
     پالت مخصوص مرحله ۱۲
     سفید در پالت نیست.
     سفید یعنی خانه خالی.
     ========================================================= */

  function createCombinedPalette() {

    paletteBox.classList.remove(
      "hidden"
    );

    palette.innerHTML = "";

    selectedTool = null;

    const colorNames = [
      "green",
      "blue",
      "yellow",
      "red",
      "pink",
      "purple"
    ];


    colorNames.forEach(
      color => {

        const item =
          document.createElement("button");

        item.type = "button";

        item.className =
          "palette-item";

        item.dataset.color =
          color;

        item.style.background =
          COLORS[color];

        item.addEventListener(
          "click",
          () => {

            initAudio();

            selectedTool =
              color;

            document
              .querySelectorAll(
                ".palette-item"
              )
              .forEach(
                button => {

                  button.classList.remove(
                    "selected"
                  );

                }
              );

            item.classList.add(
              "selected"
            );

            playColorSound();
          }
        );

        palette.appendChild(
          item
        );
      }
    );


    /* پاک‌کن */

    const eraser =
      document.createElement("button");

    eraser.type = "button";

    eraser.className =
      "palette-item eraser";

    eraser.textContent =
      "⌫";

    eraser.title =
      "پاک‌کن";

    eraser.addEventListener(
      "click",
      () => {

        initAudio();

        selectedTool =
          "eraser";

        document
          .querySelectorAll(
            ".palette-item"
          )
          .forEach(
            button => {

              button.classList.remove(
                "selected"
              );

            }
          );

        eraser.classList.add(
          "selected"
        );

        playClickSound();
      }
    );

    palette.appendChild(
      eraser
    );
  }


  /* =========================================================
     بررسی مرحله ۱۲
     
     سفید = خالی
     خانه ششم جدول پایین = خالی
     ========================================================= */

  function checkCombinedCheckerStage(stage) {

    let correct = true;


    /* =======================================================
       جدول اصلی
       ======================================================= */

    currentCells.forEach(
      cell => {

        const selected =
          cell.dataset.selected;

        const expected =
          cell.dataset.expected;


        if (
          expected === "white"
        ) {

          /*
           * سفید یعنی خانه نباید رنگ شود.
           */

          if (selected) {

            correct = false;
          }

        } else {

          if (
            !selected ||
            selected !== expected
          ) {

            correct = false;
          }
        }
      }
    );


    /* =======================================================
       جدول پایین
       ======================================================= */

    repeatCells.forEach(
      cell => {

        const selected =
          cell.dataset.selected;

        const expected =
          cell.dataset.expected;


        if (
          expected === ""
        ) {

          /*
           * خانه‌ای که پایان یک بار
           * تکرار الگوست باید خالی بماند.
           */

          if (selected) {

            correct = false;
          }

        } else if (
          expected === "white"
        ) {

          /*
           * سفید یعنی خالی.
           */

          if (selected) {

            correct = false;
          }

        } else {

          if (
            !selected ||
            selected !== expected
          ) {

            correct = false;
          }
        }
      }
    );


    showCheckResult(
      correct
    );
  }


  /* =========================================================
     نمایش نتیجه
     ========================================================= */

  function showCheckResult(correct) {

    if (correct) {

      playCorrectSound();

      if (
        !completedStages.has(
          currentStage
        )
      ) {

        score++;

        completedStages.add(
          currentStage
        );
      }

      feedback.textContent =
        "🎉 آفرین! الگو را درست پیدا کردی.";

      feedback.style.color =
        "#35a854";

      feedback.classList.remove(
        "success-animation"
      );

      void feedback.offsetWidth;

      feedback.classList.add(
        "success-animation"
      );

    } else {

      playWrongSound();

      feedback.textContent =
        "🌷 یک بار دیگر با دقت الگو را نگاه کن.";

      feedback.style.color =
        "#e85b91";
    }
  }


  /* =========================================================
     دکمه بررسی
     ========================================================= */

  checkBtn.addEventListener(
    "click",
    () => {

      initAudio();

      playClickSound();

      const stage =
        stages[currentStage];


      if (
        stage.type === "color"
      ) {

        checkColorStage(
          stage
        );

      } else if (
        stage.type === "shape"
      ) {

        checkShapeStage(
          stage
        );

      } else if (
        stage.type === "remove"
      ) {

        checkRemoveStage(
          stage
        );

      } else if (
        stage.type === "combinedChecker"
      ) {

        checkCombinedCheckerStage(
          stage
        );
      }
    }
  );


  /* =========================================================
     پاک کردن پاسخ
     ========================================================= */

  function clearCurrentAnswer() {

    initAudio();

    playClickSound();


    currentCells.forEach(
      cell => {

        if (
          cell.classList.contains(
            "editable"
          )
        ) {

          Object.keys(COLORS)
            .forEach(
              color => {

                cell.classList.remove(
                  `cell-${color}`
                );

              }
            );

          delete cell.dataset.selected;

          cell.innerHTML = "";
        }
      }
    );


    repeatCells.forEach(
      cell => {

        Object.keys(COLORS)
          .forEach(
            color => {

              cell.classList.remove(
                `cell-${color}`
              );

            }
          );

        delete cell.dataset.selected;
      }
    );


    selectedShapeAnswer =
      null;


    document
      .querySelectorAll(
        ".shape-option"
      )
      .forEach(
        option => {

          option.classList.remove(
            "selected"
          );

        }
      );


    feedback.textContent = "";

    feedback.classList.remove(
      "success-animation"
    );
  }


  clearBtn.addEventListener(
    "click",
    clearCurrentAnswer
  );


  /* =========================================================
     نمایش مرحله
     ========================================================= */

  function renderStage() {

    const stage =
      stages[currentStage];


    currentCells = [];
    repeatCells = [];

    selectedShapeAnswer =
      null;

    selectedTool =
      null;


    taskArea.innerHTML = "";

    repeatArea.innerHTML = "";

    palette.innerHTML = "";


    repeatBox.classList.add(
      "hidden"
    );

    paletteBox.classList.add(
      "hidden"
    );


    feedback.textContent = "";

    feedback.classList.remove(
      "success-animation"
    );


    /* شماره مرحله */

    stageCounter.textContent =
      `مرحله ${persianNumber(
        currentStage + 1
      )} از ${persianNumber(
        stages.length
      )}`;


    instruction.textContent =
      stage.instruction;


    /* دکمه قبلی */

    prevBtn.disabled =
      currentStage === 0;


    /* دکمه بعدی */

    nextBtn.disabled = false;


    if (
      currentStage ===
      stages.length - 1
    ) {

      nextBtn.textContent =
        "🏁 پایان";

    } else {

      nextBtn.textContent =
        "بعدی ➡️";
    }


    /* ساخت مرحله */

    if (
      stage.type === "color"
    ) {

      createMainColorGrid(
        stage
      );

      createRepeatGrid(
        stage.pattern
      );

      createColorPalette();

    } else if (
      stage.type === "shape"
    ) {

      createShapeGrid(
        stage
      );

      createShapePalette();

    } else if (
      stage.type === "remove"
    ) {

      createRemoveStage(
        stage
      );

    } else if (
      stage.type === "combinedChecker"
    ) {

      createCombinedCheckerStage(
        stage
      );
    }
  }


  /* =========================================================
     مرحله قبل
     ========================================================= */

  prevBtn.addEventListener(
    "click",
    () => {

      initAudio();

      playClickSound();

      if (
        currentStage > 0
      ) {

        currentStage--;

        renderStage();
      }
    }
  );


  /* =========================================================
     مرحله بعد / پایان
     ========================================================= */

  nextBtn.addEventListener(
    "click",
    () => {

      initAudio();

      playClickSound();

      if (
        currentStage <
        stages.length - 1
      ) {

        currentStage++;

        renderStage();

      } else {

        showFinish();
      }
    }
  );


  /* =========================================================
     صفحه پایان
     ========================================================= */

  function showFinish() {

    gameScreen.classList.add(
      "hidden"
    );

    finishScreen.classList.remove(
      "hidden"
    );


    finishText.textContent =
      `آفرین ${studentName}! تو با دقت الگوها را پیدا کردی. 🌸`;


    finalScore.textContent =
      `امتیاز تو: ${persianNumber(
        score
      )} از ${persianNumber(
        stages.length
      )}`;


    playCorrectSound();
  }


  /* =========================================================
     شروع دوباره
     ========================================================= */

  restartBtn.addEventListener(
    "click",
    () => {

      initAudio();

      playClickSound();

      currentStage = 0;

      score = 0;

      studentName = "";

      completedStages.clear();

      studentNameInput.value = "";

      finishScreen.classList.add(
        "hidden"
      );

      gameScreen.classList.add(
        "hidden"
      );

      startScreen.classList.remove(
        "hidden"
      );
    }
  );

});
