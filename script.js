/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   نسخه نهایی و سازگار با آیفون / Safari
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

    /* =====================================================
       مرحله ۱
       ===================================================== */

    {
      type: "color",

      pattern: [
        "green",
        "green",
        "red"
      ],

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },


    /* =====================================================
       مرحله ۲
       ===================================================== */

    {
      type: "color",

      pattern: [
        "blue",
        "yellow"
      ],

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },


    /* =====================================================
       مرحله ۳
       ===================================================== */

    {
      type: "color",

      pattern: [
        "green",
        "red",
        "red"
      ],

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },


    /* =====================================================
       مرحله ۴
       ===================================================== */

    {
      type: "color",

      pattern: [
        "yellow",
        "blue",
        "green"
      ],

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },


    /* =====================================================
       مرحله ۵
       ===================================================== */

    {
      type: "color",

      pattern: [
        "red",
        "red",
        "yellow"
      ],

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },


    /* =====================================================
       مرحله ۶
       ===================================================== */

    {
      type: "color",

      pattern: [
        "green",
        "blue",
        "blue"
      ],

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },


    /* =====================================================
       مرحله ۷
       ===================================================== */

    {
      type: "color",

      pattern: [
        "pink",
        "pink",
        "yellow"
      ],

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },


    /* =====================================================
       مرحله ۸
       دایره آبی
       مثلث قرمز
       ===================================================== */

    {
      type: "shape",

      pattern: [
        "circle",
        "circle",
        "triangle"
      ],

      totalCells: 15,

      readyCells: 6,

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },


    /* =====================================================
       مرحله ۹
       شکل اشتباه
       ===================================================== */

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
        "شکل اشتباه را پیدا کن و حذفش کن تا الگو درست شود."
    },


    /* =====================================================
       مرحله ۱۰
       ستاره زرد
       قلب صورتی
       ===================================================== */

    {
      type: "shape",

      pattern: [
        "star",
        "star",
        "heart"
      ],

      totalCells: 12,

      readyCells: 6,

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },


    /* =====================================================
       مرحله ۱۱
       دو مثلث → دایره → مثلث → مربع اشتباه
       ===================================================== */

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
        "triangle",
        "circle"
      ],

      answer: 4,

      instruction:
        "شکل اشتباه را پیدا کن و حذفش کن تا الگو درست شود."
    },


    /* =====================================================
       مرحله ۱۲
       الگوی ترکیبی
       ===================================================== */

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
     مهم:
     هیچ صدایی نباید مانع اجرای بازی شود.
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

        audioContext.resume().catch(() => {});

      }

    } catch (error) {

      console.log("Audio unavailable");

    }

  }


  /* =========================================================
     پخش صدای ساده
     ========================================================= */

  function playTone(
    frequency,
    duration = 0.12,
    type = "sine",
    volume = 0.045,
    startDelay = 0
  ) {

    if (!audioContext) return;

    try {

      const now =
        audioContext.currentTime + startDelay;

      const oscillator =
        audioContext.createOscillator();

      const gain =
        audioContext.createGain();

      oscillator.type = type;

      oscillator.frequency.setValueAtTime(
        frequency,
        now
      );

      gain.gain.setValueAtTime(
        volume,
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + duration
      );

      oscillator.connect(gain);

      gain.connect(
        audioContext.destination
      );

      oscillator.start(now);

      oscillator.stop(
        now + duration
      );

    } catch (error) {

      console.log("Tone error");

    }

  }


  /* =========================================================
     صدای کلیک
     ========================================================= */

  function playClickSound() {

    initAudio();

    playTone(
      480,
      0.06,
      "sine",
      0.035
    );

  }


  /* =========================================================
     صدای انتخاب رنگ
     ========================================================= */

  function playColorSound() {

    initAudio();

    playTone(
      560,
      0.07,
      "sine",
      0.035
    );

    playTone(
      720,
      0.08,
      "sine",
      0.03,
      0.055
    );

  }


  /* =========================================================
     صدای انتخاب شکل
     ========================================================= */

  function playShapeSound() {

    initAudio();

    playTone(
      420,
      0.07,
      "triangle",
      0.035
    );

    playTone(
      650,
      0.08,
      "triangle",
      0.03,
      0.055
    );

  }


  /* =========================================================
     صدای پاسخ درست
     ========================================================= */

  function playCorrectSound() {

    initAudio();

    const notes = [
      523,
      659,
      784,
      1046
    ];

    notes.forEach(
      (frequency, index) => {

        playTone(
          frequency,
          0.12,
          "sine",
          0.045,
          index * 0.09
        );

      }
    );

  }


  /* =========================================================
     صدای پاسخ غلط
     ========================================================= */

  function playWrongSound() {

    initAudio();

    const notes = [
      330,
      277,
      220
    ];

    notes.forEach(
      (frequency, index) => {

        playTone(
          frequency,
          0.14,
          "triangle",
          0.035,
          index * 0.10
        );

      }
    );

  }


  /* =========================================================
     صدای پایان بازی
     ========================================================= */

  function playFinishSound() {

    initAudio();

    const notes = [
      523,
      659,
      784,
      1046,
      1318
    ];

    notes.forEach(
      (frequency, index) => {

        playTone(
          frequency,
          0.14,
          "sine",
          0.045,
          index * 0.10
        );

      }
    );

  }


  /* =========================================================
     نمایش یک رنگ
     ========================================================= */

  function getColorValue(colorName) {

    return COLORS[colorName] || COLORS.white;

  }


  /* =========================================================
     ساخت خانه رنگی
     ========================================================= */

  function createColorCell(colorName) {

    const cell =
      document.createElement("div");

    cell.className = "pattern-cell";

    cell.dataset.value = colorName;

    cell.style.backgroundColor =
      getColorValue(colorName);

    return cell;

  }


  /* =========================================================
     ساخت خانه شکل
     ========================================================= */

  function createShapeCell(
    shapeName,
    index
  ) {

    const cell =
      document.createElement("div");

    cell.className = "shape-cell";

    cell.dataset.shape = shapeName;

    const shape =
      document.createElement("span");

    shape.className =
      "shape-symbol";

    shape.textContent =
      shapeInfo[shapeName].symbol;

    /*
      مرحله ۸:
      دایره آبی
      مثلث قرمز

      مرحله ۱۰:
      ستاره زرد
      قلب صورتی
    */

    if (currentStage === 7) {

      if (shapeName === "circle") {
        shape.style.color = COLORS.blue;
      }

      if (shapeName === "triangle") {
        shape.style.color = COLORS.red;
      }

    }

    if (currentStage === 9) {

      if (shapeName === "star") {
        shape.style.color = COLORS.yellow;
      }

      if (shapeName === "heart") {
        shape.style.color = COLORS.pink;
      }

    }

    /*
      رنگ‌های پیش‌فرض برای سایر مراحل
    */

    if (
      !shape.style.color ||
      shape.style.color === ""
    ) {

      const defaultShapeColors = {
        circle: COLORS.blue,
        square: COLORS.purple,
        triangle: COLORS.red,
        star: COLORS.yellow,
        heart: COLORS.pink,
        diamond: COLORS.green
      };

      shape.style.color =
        defaultShapeColors[shapeName] ||
        COLORS.purple;

    }

    cell.appendChild(shape);

    if (typeof index === "number") {
      cell.dataset.index = index;
    }

    return cell;

  }


  /* =========================================================
     ساخت پالت رنگ
     ========================================================= */

  function createColorPalette() {

    palette.innerHTML = "";

    const colors = [
      "green",
      "blue",
      "yellow",
      "red",
      "pink",
      "purple"
    ];

    colors.forEach(
      colorName => {

        const button =
          document.createElement("button");

        button.className =
          "palette-color";

        button.type = "button";

        button.dataset.color =
          colorName;

        button.style.backgroundColor =
          getColorValue(colorName);

        button.addEventListener(
          "click",
          () => {

            selectedTool =
              colorName;

            document
              .querySelectorAll(".palette-color")
              .forEach(
                item =>
                  item.classList.remove(
                    "selected"
                  )
              );

            button.classList.add(
              "selected"
            );

            playColorSound();

          }
        );

        palette.appendChild(button);

      }
    );

  }


  /* =========================================================
     ساخت پالت شکل
     ========================================================= */

  function createShapePalette() {

    palette.innerHTML = "";

    let shapes = [];

    if (currentStage === 7) {

      shapes = [
        "circle",
        "triangle"
      ];

    } else if (currentStage === 9) {

      shapes = [
        "star",
        "heart"
      ];

    } else {

      shapes = [
        "circle",
        "square",
        "triangle",
        "star",
        "heart",
        "diamond"
      ];

    }

    shapes.forEach(
      shapeName => {

        const button =
          document.createElement("button");

        button.type = "button";

        button.className =
          "palette-shape";

        button.dataset.shape =
          shapeName;

        const symbol =
          document.createElement("span");

        symbol.textContent =
          shapeInfo[shapeName].symbol;

        symbol.style.fontSize =
          "30px";

        if (currentStage === 7) {

          if (shapeName === "circle") {
            symbol.style.color =
              COLORS.blue;
          }

          if (shapeName === "triangle") {
            symbol.style.color =
              COLORS.red;
          }

        }

        if (currentStage === 9) {

          if (shapeName === "star") {
            symbol.style.color =
              COLORS.yellow;
          }

          if (shapeName === "heart") {
            symbol.style.color =
              COLORS.pink;
          }

        }

        if (!symbol.style.color) {

          const shapeColors = {
            circle: COLORS.blue,
            square: COLORS.purple,
            triangle: COLORS.red,
            star: COLORS.yellow,
            heart: COLORS.pink,
            diamond: COLORS.green
          };

          symbol.style.color =
            shapeColors[shapeName];

        }

        button.appendChild(symbol);

        button.addEventListener(
          "click",
          () => {

            selectedTool =
              shapeName;

            document
              .querySelectorAll(
                ".palette-shape"
              )
              .forEach(
                item =>
                  item.classList.remove(
                    "selected"
                  )
              );

            button.classList.add(
              "selected"
            );

            playShapeSound();

          }
        );

        palette.appendChild(button);

      }
    );

  }


  /* =========================================================
     ساخت شبکه رنگی
     ========================================================= */

  function createMainColorGrid(stage) {

    taskArea.innerHTML = "";

    currentCells = [];

    const grid =
      document.createElement("div");

    grid.className =
      "pattern-grid";

    const pattern =
      stage.pattern;

    const patternLength =
      pattern.length;

    const totalCells = 21;

    for (
      let i = 0;
      i < totalCells;
      i++
    ) {

      const cell =
        document.createElement("div");

      cell.className =
        "pattern-cell";

      if (i < 7) {

        const colorName =
          pattern[i % patternLength];

        cell.style.backgroundColor =
          getColorValue(colorName);

        cell.dataset.locked =
          "true";

      } else {

        cell.classList.add(
          "answer-cell"
        );

        cell.dataset.index =
          i;

        cell.addEventListener(
          "click",
          () => {

            if (!selectedTool) return;

            cell.style.backgroundColor =
              getColorValue(selectedTool);

            cell.dataset.value =
              selectedTool;

            playColorSound();

          }
        );

      }

      grid.appendChild(cell);

      currentCells.push(cell);

    }

    taskArea.appendChild(grid);

  }


  /* =========================================================
     ساخت شبکه شکل
     ========================================================= */

  function createMainShapeGrid(stage) {

    taskArea.innerHTML = "";

    currentCells = [];

    const grid =
      document.createElement("div");

    grid.className =
      "shape-grid";

    const pattern =
      stage.pattern;

    const totalCells =
      stage.totalCells;

    const readyCells =
      stage.readyCells;

    for (
      let i = 0;
      i < totalCells;
      i++
    ) {

      const cell =
        document.createElement("div");

      cell.className =
        "shape-cell";

      if (i < readyCells) {

        const shapeName =
          pattern[
            i % pattern.length
          ];

        const readyCell =
          createShapeCell(
            shapeName,
            i
          );

        cell.replaceWith(
          readyCell
        );

        currentCells.push(
          readyCell
        );

        continue;

      }

      cell.classList.add(
        "answer-cell"
      );

      cell.dataset.index =
        i;

      cell.addEventListener(
        "click",
        () => {

          if (!selectedTool) return;

          const newCell =
            createShapeCell(
              selectedTool,
              i
            );

          newCell.classList.add(
            "answer-cell"
          );

          newCell.addEventListener(
            "click",
            () => {

              if (!selectedTool) return;

              const replacement =
                createShapeCell(
                  selectedTool,
                  i
                );

              replacement.classList.add(
                "answer-cell"
              );

              replacement.addEventListener(
                "click",
                () => {

                  if (!selectedTool) return;

                  const again =
                    createShapeCell(
                      selectedTool,
                      i
                    );

                  again.classList.add(
                    "answer-cell"
                  );

                  currentCells[i] =
                    again;

                  grid.replaceChild(
                    again,
                    currentCells[i]
                  );

                }
              );

              currentCells[i] =
                replacement;

            }
          );

          currentCells[i] =
            newCell;

          grid.replaceChild(
            newCell,
            cell
          );

          playShapeSound();

        }
      );

      grid.appendChild(cell);

      currentCells.push(cell);

    }

    taskArea.appendChild(grid);

  }


  /* =========================================================
     شبکه تکرار شونده
     فقط یک بار نمایش داده می‌شود
     ========================================================= */

  function createRepeatGrid(stage) {

    repeatArea.innerHTML = "";

    repeatCells = [];

    if (
      stage.type !== "color" &&
      stage.type !== "shape"
    ) {

      repeatBox.classList.add(
        "hidden"
      );

      return;

    }

    repeatBox.classList.remove(
      "hidden"
    );

    const title =
      document.createElement("div");

    title.className =
      "repeat-title";

    title.textContent =
      "الگوی تکرارشونده را فقط یک بار بنویس.";

    repeatArea.appendChild(
      title
    );

    const grid =
      document.createElement("div");

    grid.className =
      stage.type === "color"
        ? "repeat-grid"
        : "repeat-shape-grid";

    const count =
      stage.pattern.length;

    for (
      let i = 0;
      i < count;
      i++
    ) {

      const cell =
        document.createElement("div");

      cell.className =
        "repeat-answer-cell";

      cell.dataset.index =
        i;

      cell.addEventListener(
        "click",
        () => {

          if (!selectedTool) return;

          if (stage.type === "color") {

            cell.style.backgroundColor =
              getColorValue(
                selectedTool
              );

            cell.dataset.value =
              selectedTool;

            playColorSound();

          } else {

            const newCell =
              createShapeCell(
                selectedTool,
                i
              );

            newCell.classList.add(
              "repeat-answer-cell"
            );

            newCell.addEventListener(
              "click",
              () => {

                if (!selectedTool) return;

                const replacement =
                  createShapeCell(
                    selectedTool,
                    i
                  );

                replacement.classList.add(
                  "repeat-answer-cell"
                );

                repeatCells[i] =
                  replacement;

                grid.replaceChild(
                  replacement,
                  repeatCells[i]
                );

                playShapeSound();

              }
            );

            repeatCells[i] =
              newCell;

            grid.replaceChild(
              newCell,
              cell
            );

            playShapeSound();

          }

        }
      );

      grid.appendChild(cell);

      repeatCells.push(cell);

    }

    repeatArea.appendChild(grid);

  }


  /* =========================================================
     مرحله حذف شکل اشتباه
     ========================================================= */

  function createRemoveStage(stage) {

    taskArea.innerHTML = "";

    repeatBox.classList.add(
      "hidden"
    );

    paletteBox.classList.add(
      "hidden"
    );

    const grid =
      document.createElement("div");

    grid.className =
      "remove-grid";

    stage.shapes.forEach(
      (shapeName, index) => {

        const cell =
          createShapeCell(
            shapeName,
            index
          );

        cell.classList.add(
          "removable-shape"
        );

        cell.addEventListener(
          "click",
          () => {

            selectedShapeAnswer =
              index;

            document
              .querySelectorAll(
                ".removable-shape"
              )
              .forEach(
                item =>
                  item.classList.remove(
                    "selected-remove"
                  )
              );

            cell.classList.add(
              "selected-remove"
            );

            playShapeSound();

          }
        );

        grid.appendChild(cell);

      }
    );

    taskArea.appendChild(
      grid
    );

  }


  /* =========================================================
     مرحله ۱۲
     ========================================================= */

  function createCombinedChecker(stage) {

    taskArea.innerHTML = "";

    repeatBox.classList.add(
      "hidden"
    );

    paletteBox.classList.add(
      "hidden"
    );

    const wrapper =
      document.createElement("div");

    wrapper.className =
      "combined-checker";

    stage.rows.forEach(
      row => {

        const rowElement =
          document.createElement("div");

        rowElement.className =
          "checker-row";

        row.pattern.forEach(
          colorName => {

            const cell =
              document.createElement("div");

            cell.className =
              "checker-cell";

            cell.style.backgroundColor =
              getColorValue(colorName);

            rowElement.appendChild(
              cell
            );

          }
        );

        wrapper.appendChild(
          rowElement
        );

      }
    );

    taskArea.appendChild(
      wrapper
    );

  }


  /* =========================================================
     نمایش مرحله
     ========================================================= */

  function renderStage() {

    const stage =
      stages[currentStage];

    selectedTool = null;

    selectedShapeAnswer = null;

    currentCells = [];

    repeatCells = [];

    feedback.textContent = "";

    feedback.className =
      "feedback";

    stageCounter.textContent =
      `مرحله ${persianNumber(currentStage + 1)} از ${persianNumber(stages.length)}`;

    instruction.textContent =
      stage.instruction;


    /* دکمه‌ها */

    if (prevBtn) {

      prevBtn.disabled =
        currentStage === 0;

    }

    if (nextBtn) {

      nextBtn.disabled =
        currentStage ===
        stages.length - 1;

    }


    /* نوع مرحله */

    if (stage.type === "color") {

      paletteBox.classList.remove(
        "hidden"
      );

      createColorPalette();

      createMainColorGrid(
        stage
      );

      createRepeatGrid(
        stage
      );

    }


    else if (stage.type === "shape") {

      paletteBox.classList.remove(
        "hidden"
      );

      createShapePalette();

      createMainShapeGrid(
        stage
      );

      createRepeatGrid(
        stage
      );

    }


    else if (stage.type === "remove") {

      createRemoveStage(
        stage
      );

    }


    else if (
      stage.type === "combinedChecker"
    ) {

      createCombinedChecker(
        stage
      );

    }

  }


  /* =========================================================
     بررسی مرحله
     ========================================================= */

  function checkCurrentStage() {

    const stage =
      stages[currentStage];

    let correct = false;


    /* =====================================================
       مراحل رنگی
       ===================================================== */

    if (stage.type === "color") {

      correct = true;

      const pattern =
        stage.pattern;

      const patternLength =
        pattern.length;

      currentCells.forEach(
        (cell, index) => {

          if (index < 7) return;

          const expected =
            pattern[
              index % patternLength
            ];

          const actual =
            cell.dataset.value;

          if (
            actual !== expected
          ) {

            correct = false;

          }

        }
      );

      /*
        بررسی الگوی تکرارشونده
      */

      if (correct) {

        repeatCells.forEach(
          (cell, index) => {

            const expected =
              pattern[index];

            const actual =
              cell.dataset.value;

            if (
              actual !== expected
            ) {

              correct = false;

            }

          }
        );

      }

    }


    /* =====================================================
       مراحل شکلی
       ===================================================== */

    else if (stage.type === "shape") {

      correct = true;

      const pattern =
        stage.pattern;

      const patternLength =
        pattern.length;

      currentCells.forEach(
        (cell, index) => {

          if (index < stage.readyCells) {
            return;
          }

          const expected =
            pattern[
              index % patternLength
            ];

          const actual =
            cell.dataset.shape;

          if (
            actual !== expected
          ) {

            correct = false;

          }

        }
      );

      if (correct) {

        repeatCells.forEach(
          (cell, index) => {

            const expected =
              pattern[index];

            const actual =
              cell.dataset.shape;

            if (
              actual !== expected
            ) {

              correct = false;

            }

          }
        );

      }

    }


    /* =====================================================
       مرحله حذف
       ===================================================== */

    else if (stage.type === "remove") {

      correct =
        selectedShapeAnswer ===
        stage.answer;

    }


    /* =====================================================
       نمایش نتیجه
       ===================================================== */

    if (correct) {

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
        "آفرین! پاسخ درست است 🌟";

      feedback.classList.add(
        "correct"
      );

      playCorrectSound();

    }

    else {

      feedback.textContent =
        "اشتباه است؛ دوباره تلاش کن 🌱";

      feedback.classList.add(
        "wrong"
      );

      playWrongSound();

    }


    /*
      مرحله ۱۲ یا آخرین مرحله:
      اگر درست باشد، امکان پایان
    */

    if (
      correct &&
      currentStage ===
      stages.length - 1
    ) {

      setTimeout(
        showFinish,
        900
      );

    }

  }


  /* =========================================================
     نمایش پایان
     ========================================================= */

  function showFinish() {

    gameScreen.classList.add(
      "hidden"
    );

    finishScreen.classList.remove(
      "hidden"
    );

    finalScore.textContent =
      `${persianNumber(score)} از ${persianNumber(stages.length)}`;

    finishText.textContent =
      `${studentName} عزیز، بازی را به پایان رساندی!`;

    playFinishSound();

    /*
      امتیاز ۹ تا ۱۲
      آتش‌بازی
    */

    if (score >= 9) {

      launchFireworks();

    }

  }


  /* =========================================================
     آتش‌بازی
     ========================================================= */

  function launchFireworks() {

    let fireworks =
      document.getElementById(
        "fireworks"
      );

    if (!fireworks) {

      fireworks =
        document.createElement("div");

      fireworks.id =
        "fireworks";

      fireworks.style.position =
        "fixed";

      fireworks.style.inset =
        "0";

      fireworks.style.pointerEvents =
        "none";

      fireworks.style.zIndex =
        "99999";

      fireworks.style.overflow =
        "hidden";

      document.body.appendChild(
        fireworks
      );

    }

    fireworks.innerHTML = "";

    const colors = [
      "#58c86b",
      "#42a5f5",
      "#ffd84d",
      "#ef5350",
      "#ff73ad",
      "#9c64e8"
    ];

    for (
      let i = 0;
      i < 90;
      i++
    ) {

      const particle =
        document.createElement("div");

      particle.style.position =
        "absolute";

      particle.style.width =
        "8px";

      particle.style.height =
        "8px";

      particle.style.borderRadius =
        "50%";

      particle.style.background =
        colors[
          Math.floor(
            Math.random() *
            colors.length
          )
        ];

      particle.style.left =
        Math.random() * 100 + "%";

      particle.style.top =
        Math.random() * 65 + "%";

      particle.style.boxShadow =
        "0 0 10px rgba(255,255,255,.8)";

      const duration =
        1.5 + Math.random() * 2;

      particle.animate(
        [
          {
            transform:
              "translateY(0) scale(1)",
            opacity: 1
          },

          {
            transform:
              `translate(
                ${(Math.random() - 0.5) * 300}px,
                ${150 + Math.random() * 350}px
              ) scale(0.2)`,
            opacity: 0
          }

        ],
        {
          duration:
            duration * 1000,

          easing:
            "cubic-bezier(.2,.7,.3,1)",

          fill:
            "forwards"
        }
      );

      fireworks.appendChild(
        particle
      );

    }

    setTimeout(
      () => {

        if (fireworks) {
          fireworks.innerHTML = "";
        }

      },
      4000
    );

  }


  /* =========================================================
     دکمه شروع بازی
     مهم:
     این قسمت عمداً async نیست.
     بنابراین صدا نمی‌تواند جلوی شروع بازی را بگیرد.
     ========================================================= */

  if (startBtn) {

    startBtn.addEventListener(
      "click",
      () => {

        studentName =
          studentNameInput
            ? studentNameInput.value.trim()
            : "";

        if (!studentName) {

          studentName =
            "شکوفه‌ی عزیز";

        }

        currentStage = 0;

        score = 0;

        completedStages.clear();

        startScreen.classList.add(
          "hidden"
        );

        finishScreen.classList.add(
          "hidden"
        );

        gameScreen.classList.remove(
          "hidden"
        );

        /*
          اول صفحه بازی نمایش داده شود
          سپس صدا فعال شود.
        */

        renderStage();

        initAudio();

        setTimeout(
          () => {
            playClickSound();
          },
          80
        );

      }
    );

  }


  /* =========================================================
     دکمه مرحله قبل
     ========================================================= */

  if (prevBtn) {

    prevBtn.addEventListener(
      "click",
      () => {

        if (
          currentStage <= 0
        ) {
          return;
        }

        currentStage--;

        playClickSound();

        renderStage();

      }
    );

  }


  /* =========================================================
     دکمه مرحله بعد
     ========================================================= */

  if (nextBtn) {

    nextBtn.addEventListener(
      "click",
      () => {

        if (
          currentStage >=
          stages.length - 1
        ) {
          return;
        }

        currentStage++;

        playClickSound();

        renderStage();

      }
    );

  }


  /* =========================================================
     دکمه بررسی پاسخ
     ========================================================= */

  if (checkBtn) {

    checkBtn.addEventListener(
      "click",
      () => {

        checkCurrentStage();

      }
    );

  }


  /* =========================================================
     پاک کردن پاسخ
     ========================================================= */

  if (clearBtn) {

    clearBtn.addEventListener(
      "click",
      () => {

        playClickSound();

        selectedTool = null;

        selectedShapeAnswer = null;

        renderStage();

      }
    );

  }


  /* =========================================================
     شروع دوباره
     ========================================================= */

  if (restartBtn) {

    restartBtn.addEventListener(
      "click",
      () => {

        playClickSound();

        currentStage = 0;

        score = 0;

        completedStages.clear();

        selectedTool = null;

        selectedShapeAnswer = null;

        finishScreen.classList.add(
          "hidden"
        );

        gameScreen.classList.add(
          "hidden"
        );

        startScreen.classList.remove(
          "hidden"
        );

        if (studentNameInput) {

          studentNameInput.value =
            "";

          setTimeout(
            () => {
              studentNameInput.focus();
            },
            100
          );

        }

      }
    );

  }


  /* =========================================================
     وضعیت اولیه
     ========================================================= */

  gameScreen.classList.add(
    "hidden"
  );

  finishScreen.classList.add(
    "hidden"
  );

  /*
    در شروع، بازی آماده است
    ولی صفحه بازی نمایش داده نمی‌شود.
  */

});
