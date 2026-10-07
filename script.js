/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   نسخه نهایی با افکت‌های صوتی متفاوت
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

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

      pattern: [
        "green",
        "green",
        "red"
      ],

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },


    /* مرحله ۲ */
    {
      type: "color",

      pattern: [
        "blue",
        "yellow"
      ],

      instruction:
        "ابتدا الگو را پیدا کن و سپس ادامه بده."
    },


    /* مرحله ۳ */
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


    /* مرحله ۴ */
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


    /* مرحله ۵ */
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


    /* مرحله ۶ */
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


    /* مرحله ۷ */
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


    /* مرحله ۸ */
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
        "شکل اشتباه را پیدا کن و حذفش کن تا الگو درست شود."
    },


    /* مرحله ۱۰ */
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
        "triangle",
        "circle"
      ],

      answer: 4,

      instruction:
        "شکل اشتباه را پیدا کن و حذفش کن تا الگو درست شود."
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

  async function initAudio() {

    try {

      if (!audioContext) {

        const AudioCtx =
          window.AudioContext ||
          window.webkitAudioContext;

        if (AudioCtx) {

          audioContext =
            new AudioCtx();

        }

      }

      if (
        audioContext &&
        audioContext.state === "suspended"
      ) {

        await audioContext.resume();

      }

    } catch (error) {

      console.log("Audio unavailable");

    }

  }


  /* =========================================================
     صدای پایه
     ========================================================= */

  function playTone(
    frequency,
    duration = 0.12,
    type = "sine",
    volume = 0.04,
    startTime = 0
  ) {

    if (!audioContext) return;

    try {

      const now =
        audioContext.currentTime + startTime;

      const oscillator =
        audioContext.createOscillator();

      const gain =
        audioContext.createGain();

      oscillator.type =
        type;

      oscillator.frequency.setValueAtTime(
        frequency,
        now
      );

      gain.gain.setValueAtTime(
        0.001,
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        volume,
        now + 0.015
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
        now + duration + 0.02
      );

    } catch (error) {

      console.log("Tone error");

    }

  }


  /* =========================================================
     صدای کلیک معمولی
     ========================================================= */

  function playClickSound() {

    playTone(
      480,
      0.055,
      "sine",
      0.025
    );

  }


  /* =========================================================
     صدای انتخاب رنگ
     ========================================================= */

  function playColorSound() {

    playTone(
      560,
      0.07,
      "sine",
      0.032
    );

    playTone(
      720,
      0.055,
      "sine",
      0.022,
      0.045
    );

  }


  /* =========================================================
     صدای انتخاب شکل
     ========================================================= */

  function playShapeSound() {

    playTone(
      420,
      0.07,
      "triangle",
      0.032
    );

    playTone(
      650,
      0.08,
      "triangle",
      0.028,
      0.055
    );

  }


  /* =========================================================
     صدای پاسخ صحیح
     ========================================================= */

  function playCorrectSound() {

    if (!audioContext) return;

    playTone(
      523.25,
      0.12,
      "sine",
      0.045,
      0
    );

    playTone(
      659.25,
      0.12,
      "sine",
      0.05,
      0.10
    );

    playTone(
      783.99,
      0.15,
      "sine",
      0.055,
      0.20
    );

    playTone(
      1046.50,
      0.22,
      "sine",
      0.05,
      0.31
    );

  }


  /* =========================================================
     صدای پاسخ غلط
     ========================================================= */

  function playWrongSound() {

    if (!audioContext) return;

    playTone(
      330,
      0.13,
      "triangle",
      0.035,
      0
    );

    playTone(
      277,
      0.15,
      "triangle",
      0.032,
      0.11
    );

    playTone(
      220,
      0.20,
      "triangle",
      0.028,
      0.23
    );

  }


  /* =========================================================
     صدای پایان بازی
     ========================================================= */

  function playFinishSound() {

    if (!audioContext) return;

    playTone(
      523.25,
      0.12,
      "sine",
      0.04,
      0
    );

    playTone(
      659.25,
      0.12,
      "sine",
      0.045,
      0.10
    );

    playTone(
      783.99,
      0.12,
      "sine",
      0.05,
      0.20
    );

    playTone(
      1046.50,
      0.18,
      "sine",
      0.055,
      0.30
    );

    playTone(
      1318.51,
      0.28,
      "sine",
      0.045,
      0.44
    );

  }


  /* =========================================================
     شروع بازی
     ========================================================= */

  startBtn.addEventListener(
    "click",
    async () => {

      await initAudio();

      studentName =
        studentNameInput.value.trim();

      if (!studentName) {

        studentName =
          "شکوفه‌ی عزیز";

      }

      playClickSound();

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


    for (
      let i = 0;
      i < total;
      i++
    ) {

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
          async () => {

            await initAudio();

            if (!selectedTool) {

              playClickSound();

              return;

            }


            if (
              selectedTool === "eraser"
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

      grid.appendChild(
        cell
      );

    }

    taskArea.appendChild(
      grid
    );

  }


  /* =========================================================
     رنگ‌آمیزی خانه اصلی
     ========================================================= */

  function setCellColor(
    cell,
    color
  ) {

    Object.keys(
      COLORS
    ).forEach(
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


  function clearCellColor(
    cell
  ) {

    Object.keys(
      COLORS
    ).forEach(
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
     ========================================================= */

  function createRepeatGrid(
    pattern
  ) {

    repeatCells = [];

    repeatBox.classList.remove(
      "hidden"
    );

    repeatArea.innerHTML = "";

    repeatArea.style.gridTemplateColumns =
      "repeat(6, minmax(0, 1fr))";


    const repeatTitle =
      repeatBox.querySelector(
        ".repeat-title"
      );

    if (repeatTitle) {

      repeatTitle.textContent =
        "الگوی تکرارشونده را فقط یک بار بنویس.";

    }


    for (
      let i = 0;
      i < 6;
      i++
    ) {

      const cell =
        document.createElement("div");

      cell.className =
        "repeat-cell";


      if (
        i < pattern.length
      ) {

        cell.dataset.expected =
          pattern[i];

      } else {

        cell.dataset.expected =
          "";

      }


      cell.addEventListener(
        "click",
        async () => {

          await initAudio();

          if (!selectedTool) {

            playClickSound();

            return;

          }


          if (
            selectedTool === "eraser"
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


      repeatArea.appendChild(
        cell
      );

      repeatCells.push(
        cell
      );

    }

  }


  function setRepeatCellColor(
    cell,
    color
  ) {

    Object.keys(
      COLORS
    ).forEach(
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


  function clearRepeatCell(
    cell
  ) {

    Object.keys(
      COLORS
    ).forEach(
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
          document.createElement(
            "button"
          );

        item.type = "button";

        item.className =
          "palette-item";

        item.dataset.color =
          color;

        item.style.background =
          COLORS[color];


        if (
          color === "white"
        ) {

          item.style.border =
            "3px solid #3d3151";

        }


        item.addEventListener(
          "click",
          async () => {

            await initAudio();

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
      document.createElement(
        "button"
      );

    eraser.type = "button";

    eraser.className =
      "palette-item eraser";

    eraser.textContent =
      "⌫";

    eraser.title =
      "پاک‌کن";


    eraser.addEventListener(
      "click",
      async () => {

        await initAudio();

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

  function createShapeGrid(
    stage
  ) {

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


    /* رنگ شکل‌های مرحله ۸ و ۱۰ */

    const shapeColors = {

      circle:
        COLORS.blue,

      triangle:
        COLORS.red,

      star:
        COLORS.yellow,

      heart:
        COLORS.pink

    };


    for (
      let i = 0;
      i < total;
      i++
    ) {

      const cell =
        document.createElement(
          "div"
        );

      cell.className =
        "shape-cell";


      if (
        i < readyCount
      ) {

        const shape =
          stage.pattern[
            i %
            stage.pattern.length
          ];


        const symbol =
          document.createElement(
            "span"
          );

        symbol.className =
          "shape-symbol";

        symbol.textContent =
          shapeInfo[
            shape
          ].symbol;

        symbol.title =
          shapeInfo[
            shape
          ].label;


        if (
          (
            currentStage === 7 ||
            currentStage === 9
          ) &&
          shapeColors[shape]
        ) {

          symbol.style.color =
            shapeColors[shape];

        }


        cell.appendChild(
          symbol
        );


      } else {

        cell.classList.add(
          "editable"
        );

        cell.dataset.expected =
          stage.pattern[
            i %
            stage.pattern.length
          ];


        cell.addEventListener(
          "click",
          async () => {

            await initAudio();

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
              document.createElement(
                "span"
              );

            symbol.className =
              "shape-symbol";

            symbol.textContent =
              shapeInfo[
                shape
              ].symbol;


            if (
              (
                currentStage === 7 ||
                currentStage === 9
              ) &&
              shapeColors[shape]
            ) {

              symbol.style.color =
                shapeColors[shape];

            }


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


    const shapeColors = {

      circle:
        COLORS.blue,

      triangle:
        COLORS.red,

      star:
        COLORS.yellow,

      heart:
        COLORS.pink

    };


    shapes.forEach(
      shape => {

        const item =
          document.createElement(
            "button"
          );

        item.type = "button";

        item.className =
          "palette-item";


        const symbol =
          document.createElement(
            "span"
          );

        symbol.className =
          "shape-symbol";

        symbol.textContent =
          shapeInfo[
            shape
          ].symbol;


        if (
          (
            currentStage === 7 ||
            currentStage === 9
          ) &&
          shapeColors[shape]
        ) {

          symbol.style.color =
            shapeColors[shape];

        }


        item.appendChild(
          symbol
        );


        item.title =
          shapeInfo[
            shape
          ].label;


        item.addEventListener(
          "click",
          async () => {

            await initAudio();

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

  function createRemoveStage(
    stage
  ) {

    selectedShapeAnswer =
      null;


    paletteBox.classList.add(
      "hidden"
    );

    repeatBox.classList.add(
      "hidden"
    );


    const row =
      document.createElement(
        "div"
      );

    row.className =
      "shape-row";


    row.style.gridTemplateColumns =
      `repeat(${stage.shapes.length}, minmax(0, 1fr))`;

    row.style.justifyContent =
      "start";

    row.style.direction =
      "ltr";


    stage.shapes.forEach(
      (
        shape,
        index
      ) => {

        const option =
          document.createElement(
            "button"
          );

        option.type = "button";

        option.className =
          "shape-option";

        option.dataset.index =
          index;


        const symbol =
          document.createElement(
            "span"
          );

        symbol.className =
          "remove-shape-symbol";

        symbol.textContent =
          shapeInfo[
            shape
          ].symbol;


        option.appendChild(
          symbol
        );


        option.addEventListener(
          "click",
          async () => {

            await initAudio();

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

  function createCombinedCheckerStage(
    stage
  ) {

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
      document.createElement(
        "div"
      );

    mainBox.className =
      "combined-pattern-box";


    /* جدول اصلی */

    stage.rows.forEach(
      rowData => {

        const row =
          document.createElement(
            "div"
          );

        row.className =
          "combined-row-box";

        row.style.gridTemplateColumns =
          "repeat(21, minmax(0, 1fr))";


        for (
          let i = 0;
          i < 21;
          i++
        ) {

          const cell =
            document.createElement(
              "div"
            );

          cell.className =
            "pattern-cell";


          const expected =
            rowData.pattern[
              i %
              rowData.pattern.length
            ];


          cell.dataset.expected =
            expected;


          if (
            i < 14
          ) {

            cell.classList.add(
              `cell-${expected}`
            );

          } else {

            cell.classList.add(
              "editable"
            );


            cell.addEventListener(
              "click",
              async () => {

                await initAudio();


                if (
                  !selectedTool
                ) {

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


    /* جدول پایین */

    const lowerBox =
      document.createElement(
        "div"
      );

    lowerBox.className =
      "combined-repeat-box";


    const title =
      document.createElement(
        "div"
      );

    title.className =
      "combined-repeat-title";

    title.textContent =
      "الگوی تکرارشونده را فقط یک بار بنویس.";


    lowerBox.appendChild(
      title
    );


    stage.rows.forEach(
      rowData => {

        const repeatRow =
          document.createElement(
            "div"
          );

        repeatRow.className =
          "combined-repeat-row";


        repeatRow.style.gridTemplateColumns =
          "repeat(6, minmax(0, 1fr))";


        for (
          let i = 0;
          i < 6;
          i++
        ) {

          const cell =
            document.createElement(
              "div"
            );

          cell.className =
            "repeat-cell";


          if (
            i < 5
          ) {
