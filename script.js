/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   نسخه نهایی اصلاح‌شده
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const TOTAL_COLUMNS = 21;

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
     مراحل — دقیقاً ۱۲ مرحله
     ========================================================= */

  const stages = [

    /* مرحله ۱ */
    {
      type: "color",
      pattern: ["green", "green", "red"],
      blanks: [15,16,17,18,19,20],
      instruction: "الگوی تکرارشونده را ادامه بده."
    },

    /* مرحله ۲ */
    {
      type: "color",
      pattern: ["blue", "yellow"],
      blanks: [13,14,15,16,17,18,19,20],
      instruction: "الگوی تکرارشونده را ادامه بده."
    },

    /* مرحله ۳ */
    {
      type: "color",
      pattern: ["green", "red", "red"],
      blanks: [14,15,16,17,18,19,20],
      instruction: "الگوی تکرارشونده را پیدا کن و ادامه بده."
    },

    /* مرحله ۴ */
    {
      type: "color",
      pattern: ["yellow", "blue", "green"],
      blanks: [14,15,16,17,18,19,20],
      instruction: "الگوی تکرارشونده را پیدا کن و ادامه بده."
    },

    /* مرحله ۵ */
    {
      type: "color",
      pattern: ["red", "red", "yellow"],
      blanks: [14,15,16,17,18,19,20],
      instruction: "الگوی تکرارشونده را پیدا کن و ادامه بده."
    },

    /* مرحله ۶ */
    {
      type: "color",
      pattern: ["green", "blue", "blue"],
      blanks: [14,15,16,17,18,19,20],
      instruction: "الگوی تکرارشونده را پیدا کن و ادامه بده."
    },

    /* مرحله ۷ */
    {
      type: "color",
      pattern: ["pink", "pink", "yellow"],
      blanks: [14,15,16,17,18,19,20],
      instruction: "الگوی تکرارشونده را ادامه بده."
    },

    /* =====================================================
       مرحله ۸
       ۱۵ خانه
       یک ردیف
       دو بار کامل: دایره، دایره، مثلث
       ۶ خانه از قبل پر
       ۹ خانه خالی
       ===================================================== */

    {
      type: "shape",
      pattern: ["circle", "circle", "triangle"],

      length: 15,

      prefilled: 6,

      blanks: [
        6,7,8,9,10,11,12,13,14
      ],

      instruction:
        "الگوی دایره، دایره، مثلث را ادامه بده."
    },

    /* =====================================================
       مرحله ۹
       دو بار:
       🔵 🔵 🟨
       🔵 🔵 🟨
       سپس یک شکل اشتباه
       دانش‌آموز باید شکل اشتباه را حذف کند.
       ===================================================== */

    {
      type: "remove",

      shapes: [
        "circle",
        "circle",
        "square",

        "circle",
        "circle",
        "square",

        "triangle"
      ],

      answer: 6,

      instruction:
        "کدام شکل اشتباه است؟ آن را حذف کن تا الگو منظم شود."
    },

    /* =====================================================
       مرحله ۱۰
       ۱۲ خانه بزرگ
       دو بار:
       ستاره، ستاره، قلب
       ۶ خانه آماده
       ۶ خانه خالی
       ===================================================== */

    {
      type: "shape",

      pattern: [
        "star",
        "star",
        "heart"
      ],

      length: 12,

      prefilled: 6,

      blanks: [
        6,7,8,9,10,11
      ],

      instruction:
        "الگوی ستاره، ستاره، قلب را ادامه بده."
    },

    /* =====================================================
       مرحله ۱۱
       دو مثلث قرمز + دایره آبی
       دوباره دو مثلث قرمز + یک اشتباه
       دوباره دو مثلث قرمز + دایره آبی
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

        "triangle",
        "triangle",
        "circle"
      ],

      answer: 5,

      instruction:
        "کدام شکل اشتباه است؟ آن را حذف کن تا الگو منظم شود."
    },

    /* =====================================================
       مرحله ۱۲
       ===================================================== */

    {
      type: "combinedChecker",

      rows: [

        {
          pattern: ["green","white"],
          blanks: [14,15,16,17,18,19,20]
        },

        {
          pattern: ["white","green","white","red"],
          blanks: [14,15,16,17,18,19,20]
        },

        {
          pattern: ["green","white"],
          blanks: [14,15,16,17,18,19,20]
        }

      ],

      instruction:
        "الگو را پیدا کن و سپس ادامه بده."
    }

  ];


  /* =========================================================
     عناصر HTML
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

    if (audioContext) {

      if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
      }

      return;
    }

    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (AudioCtx) {
      try {
        audioContext = new AudioCtx();
      } catch (error) {
        audioContext = null;
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

      const oscillator =
        audioContext.createOscillator();

      const gain =
        audioContext.createGain();

      oscillator.type = type;

      oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
      );

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
      /* صدا اختیاری است */
    }
  }


  /* صدای همه دکمه‌ها */
  function playClick() {

    playTone(
      620,
      0.07,
      "sine",
      0.045
    );
  }


  /* صدای انتخاب رنگ / شکل */
  function playSelect() {

    playTone(
      760,
      0.065,
      "sine",
      0.045
    );

    setTimeout(() => {

      playTone(
        920,
        0.07,
        "sine",
        0.035
      );

    }, 55);
  }


  /* صدای پاسخ درست */
  function playCorrect() {

    playTone(
      523,
      0.10,
      "sine",
      0.055
    );

    setTimeout(() => {

      playTone(
        659,
        0.10,
        "sine",
        0.055
      );

    }, 100);

    setTimeout(() => {

      playTone(
        784,
        0.18,
        "sine",
        0.055
      );

    }, 210);
  }


  /* صدای پاسخ غلط — کاملاً متفاوت */
  function playWrong() {

    playTone(
      180,
      0.18,
      "sawtooth",
      0.045
    );

    setTimeout(() => {

      playTone(
        120,
        0.20,
        "sawtooth",
        0.04
      );

    }, 130);
  }


  /* =========================================================
     شکل‌ها
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
      color: "#58c96c"
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
      document.createElement("div");

    cell.className =
      "pattern-cell " +
      (
        editable
          ? "editable"
          : "locked"
      );

    cell.dataset.index = index;
    cell.dataset.container = containerType;

    if (color) {

      cell.classList.add(
        "cell-" + color
      );

      cell.dataset.color = color;

    } else {

      cell.classList.add(
        "cell-white"
      );

      cell.dataset.color = "";
    }


    cell.addEventListener(
      "click",
      function () {

        if (!editable) return;
        if (!selectedTool) return;

        playSelect();

        if (
          selectedTool === "eraser"
        ) {

          cell.dataset.color = "";

          cell.className =
            "pattern-cell editable cell-white";

        } else if (
          COLORS[selectedTool]
        ) {

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

    colors.forEach(function (color) {

      const item =
        document.createElement("button");

      item.type = "button";

      item.className =
        "palette-item";

      item.style.background =
        COLORS[color];

      item.dataset.tool =
        color;

      item.addEventListener(
        "click",
        function () {

          initAudio();

          selectedTool =
            color;

          document
            .querySelectorAll(
              ".palette-item"
            )
            .forEach(function (x) {

              x.classList.remove(
                "selected"
              );

            });

          item.classList.add(
            "selected"
          );

          /* صدای مخصوص انتخاب رنگ */
          playSelect();
        }
      );

      palette.appendChild(item);
    });


    const eraser =
      document.createElement("button");

    eraser.type = "button";

    eraser.className =
      "palette-item eraser";

    eraser.textContent =
      "⌫";

    eraser.addEventListener(
      "click",
      function () {

        initAudio();

        selectedTool =
          "eraser";

        document
          .querySelectorAll(
            ".palette-item"
          )
          .forEach(function (x) {

            x.classList.remove(
              "selected"
            );

          });

        eraser.classList.add(
          "selected"
        );

        playSelect();
      }
    );

    palette.appendChild(eraser);
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

    shapes.forEach(function (shape) {

      const item =
        document.createElement("button");

      item.type = "button";

      item.className =
        "palette-item";

      item.innerHTML =
        `<span style="
          color:${shapeInfo[shape].color};
          font-size:30px;
          line-height:1;
        ">${shapeInfo[shape].symbol}</span>`;

      item.dataset.tool =
        shape;

      item.addEventListener(
        "click",
        function () {

          initAudio();

          selectedTool =
            shape;

          document
            .querySelectorAll(
              ".palette-item"
            )
            .forEach(function (x) {

              x.classList.remove(
                "selected"
              );

            });

          item.classList.add(
            "selected"
          );

          /* صدای مخصوص انتخاب شکل */
          playSelect();
        }
      );

      palette.appendChild(item);
    });


    const eraser =
      document.createElement("button");

    eraser.type = "button";

    eraser.className =
      "palette-item eraser";

    eraser.textContent =
      "⌫";

    eraser.addEventListener(
      "click",
      function () {

        initAudio();

        selectedTool =
          "eraser";

        document
          .querySelectorAll(
            ".palette-item"
          )
          .forEach(function (x) {

            x.classList.remove(
              "selected"
            );

          });

        eraser.classList.add(
          "selected"
        );

        playSelect();
      }
    );

    palette.appendChild(eraser);
  }


  /* =========================================================
     جدول رنگی
     ========================================================= */

  function createMainColorGrid(stage) {

    taskArea.innerHTML = "";

    repeatBox.classList.add("hidden");

    const wrap =
      document.createElement("div");

    wrap.className =
      "task-wrap";

    const scroll =
      document.createElement("div");

    scroll.className =
      "grid-scroll";

    const grid =
      document.createElement("div");

    grid.className =
      "pattern-grid";

    currentCells = [];

    for (
      let i = 0;
      i < TOTAL_COLUMNS;
      i++
    ) {

      const patternIndex =
        i % stage.pattern.length;

      const shouldBeBlank =
        stage.blanks.includes(i);

      let color = null;

      if (!shouldBeBlank) {

        color =
          stage.pattern[patternIndex];
      }

      const cell =
        createColorCell(
          color,
          shouldBeBlank,
          i,
          "main"
        );

      grid.appendChild(cell);

      currentCells.push(cell);
    }

    scroll.appendChild(grid);
    wrap.appendChild(scroll);

    taskArea.appendChild(wrap);

    createColorPalette();

    createRepeatGrid(
      stage.pattern
    );
  }


  /* =========================================================
     ساخت مرحله شکل
     ========================================================= */

  function createShapeGrid(stage) {

    taskArea.innerHTML = "";

    repeatBox.classList.add("hidden");

    const scroll =
      document.createElement("div");

    scroll.className =
      "shape-grid-scroll";

    const grid =
      document.createElement("div");

    grid.className =
      "compact-shape-grid";

    grid.style.setProperty(
      "--shape-count",
      stage.length
    );

    currentCells = [];

    for (
      let i = 0;
      i < stage.length;
      i++
    ) {

      const shouldBeBlank =
        stage.blanks.includes(i);

      const cell =
        document.createElement("div");

      cell.className =
        "compact-shape-cell " +
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
            i % stage.pattern.length
          ];

        cell.dataset.shape =
          shape;

        cell.innerHTML =
          `<span style="
            color:${shapeInfo[shape].color};
            font-size:44px;
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
          function () {

            if (!selectedTool)
              return;

            playSelect();

            if (
              selectedTool === "eraser"
            ) {

              cell.innerHTML = "";
              cell.dataset.shape = "";

            } else if (
              shapeInfo[selectedTool]
            ) {

              const shape =
                selectedTool;

              cell.dataset.shape =
                shape;

              cell.innerHTML =
                `<span style="
                  color:${shapeInfo[shape].color};
                  font-size:44px;
                  line-height:1;
                ">${shapeInfo[shape].symbol}</span>`;
            }

          }
        );
      }

      grid.appendChild(cell);

      currentCells.push(cell);
    }

    scroll.appendChild(grid);

    taskArea.appendChild(scroll);

    createShapePalette();
  }


  /* =========================================================
     جدول تکرار معمولی
     ========================================================= */

  function createRepeatGrid(pattern) {

    repeatBox.classList.remove(
      "hidden"
    );

    repeatArea.innerHTML = "";

    repeatCells = [];

    for (
      let i = 0;
      i < 6;
      i++
    ) {

      const cell =
        document.createElement("div");

      cell.className =
        "repeat-cell cell-white";

      cell.dataset.index =
        i;

      cell.dataset.value =
        "";

      cell.addEventListener(
        "click",
        function () {

          if (!selectedTool)
            return;

          playSelect();

          if (
            selectedTool === "eraser"
          ) {

            cell.dataset.value =
              "";

            cell.className =
              "repeat-cell cell-white";

            cell.innerHTML =
              "";

          } else if (
            COLORS[selectedTool]
          ) {

            cell.dataset.value =
              selectedTool;

            cell.className =
              "repeat-cell cell-" +
              selectedTool;

            cell.innerHTML =
              "";
          }

        }
      );

      repeatArea.appendChild(cell);

      repeatCells.push(cell);
    }
  }


  /* =========================================================
     سؤال حذف شکل
     ========================================================= */

  function createRemoveStage(stage) {

    taskArea.innerHTML = "";

    repeatBox.classList.add(
      "hidden"
    );

    paletteBox.classList.add(
      "hidden"
    );

    selectedShapeAnswer =
      null;

    const scroll =
      document.createElement("div");

    scroll.className =
      "shape-row-scroll";

    const row =
      document.createElement("div");

    row.className =
      "shape-row";

    stage.shapes.forEach(
      function (shape,index) {

        const option =
          document.createElement("div");

        option.className =
          "shape-option";

        option.dataset.index =
          index;

        option.innerHTML =
          `<span style="
            color:${shapeInfo[shape].color};
            font-size:45px;
            line-height:1;
          ">${shapeInfo[shape].symbol}</span>`;

        option.addEventListener(
          "click",
          function () {

            initAudio();

            document
              .querySelectorAll(
                ".shape-option"
              )
              .forEach(function (x) {

                x.classList.remove(
                  "selected"
                );

              });

            option.classList.add(
              "selected"
            );

            selectedShapeAnswer =
              index;

            playSelect();
          }
        );

        row.appendChild(option);
      }
    );

    scroll.appendChild(row);

    taskArea.appendChild(scroll);
  }


  /* =========================================================
     مرحله ۱۲
     ========================================================= */

  function createCombinedCheckerStage(stage) {

    taskArea.innerHTML = "";

    repeatBox.classList.add(
      "hidden"
    );

    paletteBox.classList.remove(
      "hidden"
    );

    currentCells = [];
    repeatCells = [];


    /* جدول اصلی */

    const combinedBox =
      document.createElement("div");

    combinedBox.className =
      "combined-pattern-box";

    const mainScroll =
      document.createElement("div");

    mainScroll.className =
      "grid-scroll";

    const mainGrid =
      document.createElement("div");

    mainGrid.className =
      "combined-main-grid";


    stage.rows.forEach(
      function (rowData,rowIndex) {

        for (
          let i = 0;
          i < TOTAL_COLUMNS;
          i++
        ) {

          const shouldBeBlank =
            rowData.blanks.includes(i);

          const patternIndex =
            i % rowData.pattern.length;

          const color =
            shouldBeBlank
              ? null
              : rowData.pattern[
                  patternIndex
                ];

          const cell =
            createColorCell(
              color,
              shouldBeBlank,
              i,
              "combined"
            );

          cell.dataset.row =
            rowIndex;

          cell.dataset.expected =
            rowData.pattern[
              patternIndex
            ];

          mainGrid.appendChild(cell);

          currentCells.push({
            cell: cell,
            rowIndex: rowIndex,
            expected:
              rowData.pattern[
                patternIndex
              ]
          });
        }
      }
    );

    mainScroll.appendChild(
      mainGrid
    );

    combinedBox.appendChild(
      mainScroll
    );

    taskArea.appendChild(
      combinedBox
    );


    createColorPalette();


    /* جدول پایین ۶ × ۳ */

    const repeatWrapper =
      document.createElement("div");

    repeatWrapper.className =
      "combined-repeat-box";

    const title =
      document.createElement("div");

    title.className =
      "combined-repeat-title";

    title.textContent =
      "✨ الگوی تکرارشونده را برای هر ردیف، یک بار در پایین تکرار کن.";

    repeatWrapper.appendChild(
      title
    );


    const repeatGrid =
      document.createElement("div");

    repeatGrid.className =
      "combined-repeat-grid";


    stage.rows.forEach(
      function (rowData,rowIndex) {

        for (
          let i = 0;
          i < 6;
          i++
        ) {

          const cell =
            document.createElement("div");

          cell.className =
            "repeat-cell cell-white";

          cell.dataset.row =
            rowIndex;

          cell.dataset.index =
            i;

          cell.dataset.value =
            "";

          cell.addEventListener(
            "click",
            function () {

              if (!selectedTool)
                return;

              playSelect();

              if (
                selectedTool === "eraser"
              ) {

                cell.dataset.value =
                  "";

                cell.className =
                  "repeat-cell cell-white";

              } else if (
                COLORS[selectedTool]
              ) {

                cell.dataset.value =
                  selectedTool;

                cell.className =
                  "repeat-cell cell-" +
                  selectedTool;
              }

            }
          );

          repeatGrid.appendChild(cell);

          repeatCells.push(cell);
        }
      }
    );

    repeatWrapper.appendChild(
      repeatGrid
    );

    taskArea.appendChild(
      repeatWrapper
    );
  }


  /* =========================================================
     پاک کردن
     ========================================================= */

  function clearCurrentAnswer() {

    playClick();

    const stage =
      stages[currentStage];

    if (
      stage.type === "remove"
    ) {

      selectedShapeAnswer =
        null;

      document
        .querySelectorAll(
          ".shape-option"
        )
        .forEach(function (x) {

          x.classList.remove(
            "selected"
          );

        });

      feedback.textContent =
        "";

      return;
    }


    if (
      stage.type === "combinedChecker"
    ) {

      currentCells.forEach(
        function (item) {

          const cell =
            item.cell;

          if (
            cell.classList.contains(
              "editable"
            )
          ) {

            cell.dataset.color =
              "";

            cell.className =
              "pattern-cell editable cell-white";
          }
        }
      );

      repeatCells.forEach(
        function (cell) {

          cell.dataset.value =
            "";

          cell.className =
            "repeat-cell cell-white";
        }
      );

      feedback.textContent =
        "";

      return;
    }


    currentCells.forEach(
      function (cell) {

        if (
          !cell.classList.contains(
            "editable"
          )
        ) return;

        if (
          stage.type === "shape"
        ) {

          cell.dataset.shape =
            "";

          cell.innerHTML =
            "";

        } else {

          cell.dataset.color =
            "";

          cell.className =
            "pattern-cell editable cell-white";
        }

      }
    );

    repeatCells.forEach(
      function (cell) {

        cell.dataset.value =
          "";

        cell.className =
          "repeat-cell cell-white";

        cell.innerHTML =
          "";
      }
    );

    feedback.textContent =
      "";
  }


  /* =========================================================
     بررسی رنگ
     ========================================================= */

  function checkColorStage(stage) {

    let correct = true;

    currentCells.forEach(
      function (cell) {

        const index =
          Number(cell.dataset.index);

        if (
          !stage.blanks.includes(index)
        ) return;

        const expected =
          stage.pattern[
            index % stage.pattern.length
          ];

        if (
          cell.dataset.color !==
          expected
        ) {

          correct = false;
        }
      }
    );


    const unitLength =
      stage.pattern.length;

    for (
      let i = 0;
      i < 6;
      i++
    ) {

      const cell =
        repeatCells[i];

      if (!cell) {
        correct = false;
        continue;
      }

      const actual =
        cell.dataset.value;

      if (i < unitLength) {

        if (
          actual !==
          stage.pattern[i]
        ) {

          correct = false;
        }

      } else {

        if (actual !== "") {
          correct = false;
        }
      }
    }

    return correct;
  }


  /* =========================================================
     بررسی شکل
     ========================================================= */

  function checkShapeStage(stage) {

    for (
      const cell of currentCells
    ) {

      const index =
        Number(cell.dataset.index);

      if (
        !stage.blanks.includes(index)
      ) continue;

      const expected =
        stage.pattern[
          index % stage.pattern.length
        ];

      if (
        cell.dataset.shape !==
        expected
      ) {

        return false;
      }
    }

    return true;
  }


  /* =========================================================
     بررسی حذف
     ========================================================= */

  function checkRemoveStage(stage) {

    return (
      selectedShapeAnswer ===
      stage.answer
    );
  }


  /* =========================================================
     بررسی مرحله ۱۲
     ========================================================= */

  function checkCombinedCheckerStage(stage) {

    let correct = true;


    /* جدول اصلی */

    currentCells.forEach(
      function (item) {

        const cell =
          item.cell;

        if (
          !cell.classList.contains(
            "editable"
          )
        ) return;

        if (
          cell.dataset.color !==
          item.expected
        ) {

          correct = false;
        }
      }
    );


    /* جدول پایین */

    let cellIndex = 0;

    stage.rows.forEach(
      function (rowData) {

        for (
          let i = 0;
          i < 6;
          i++
        ) {

          const cell =
            repeatCells[cellIndex];

          if (!cell) {

            correct = false;

            cellIndex++;

            continue;
          }

          const expected =
            rowData.pattern[
              i % rowData.pattern.length
            ];

          if (
            cell.dataset.value !==
            expected
          ) {

            correct = false;
          }

          cellIndex++;
        }
      }
    );

    return correct;
  }


  /* =========================================================
     بررسی کلی
     ========================================================= */

  function checkAnswer() {

    initAudio();

    const stage =
      stages[currentStage];

    let correct = false;


    if (
      stage.type === "color"
    ) {

      correct =
        checkColorStage(stage);

    } else if (
      stage.type === "shape"
    ) {

      correct =
        checkShapeStage(stage);

    } else if (
      stage.type === "remove"
    ) {

      correct =
        checkRemoveStage(stage);

    } else if (
      stage.type === "combinedChecker"
    ) {

      correct =
        checkCombinedCheckerStage(stage);
    }


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

      playCorrect();

      feedback.innerHTML =
        `👏🏻 آفرین ${studentName || "قهرمان"}! خیلی خوب الگو را پیدا کردی!`;

      feedback.style.color =
        "#21a454";

      taskArea.classList.add(
        "success-animation"
      );

      setTimeout(
        function () {

          taskArea.classList.remove(
            "success-animation"
          );

        },
        600
      );

    } else {

      playWrong();

      feedback.innerHTML =
        "🌱 اشکالی ندارد! دوباره با دقت به تکرار الگو نگاه کن.";

      feedback.style.color =
        "#e34c86";
    }
  }


  /* =========================================================
     نمایش مرحله
     ========================================================= */

  function renderStage() {

    const stage =
      stages[currentStage];

    instruction.textContent =
      stage.instruction;

    feedback.textContent =
      "";

    feedback.style.color =
      "#7438c8";

    selectedTool =
      null;

    selectedShapeAnswer =
      null;

    repeatCells = [];
    currentCells = [];


    paletteBox.classList.remove(
      "hidden"
    );


    if (
      stage.type === "color"
    ) {

      createMainColorGrid(stage);

    } else if (
      stage.type === "shape"
    ) {

      createShapeGrid(stage);

    } else if (
      stage.type === "remove"
    ) {

      createRemoveStage(stage);

    } else if (
      stage.type === "combinedChecker"
    ) {

      createCombinedCheckerStage(
        stage
      );
    }


    stageCounter.textContent =
      `مرحله ${currentStage + 1} از ${stages.length}`;


    prevBtn.disabled =
      currentStage === 0;

    nextBtn.disabled =
      currentStage ===
      stages.length - 1;

    checkBtn.classList.remove(
      "hidden"
    );
  }


  /* =========================================================
     مرحله بعد
     ========================================================= */

  function nextStage() {

    if (
      currentStage <
      stages.length - 1
    ) {

      currentStage++;

      renderStage();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    } else {

      showFinish();
    }
  }


  /* =========================================================
     مرحله قبل
     ========================================================= */

  function previousStage() {

    if (
      currentStage > 0
    ) {

      currentStage--;

      renderStage();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }


  /* =========================================================
     پایان
     ========================================================= */

  function showFinish() {

    gameScreen.classList.add(
      "hidden"
    );

    finishScreen.classList.remove(
      "hidden"
    );

    finishText.innerHTML =
      `خیلی خوب پیش رفتی، <strong>${studentName || "قهرمان کوچولو"}</strong>!`;

    finalScore.textContent =
      `امتیاز: ${score} از ${stages.length} 🌟`;

    playCorrect();
  }


  /* =========================================================
     شروع
     ========================================================= */

  function startGame() {

    initAudio();

    playClick();

    studentName =
      studentNameInput.value.trim();

    if (!studentName) {
      studentName =
        "قهرمان کوچولو";
    }

    score = 0;

    currentStage = 0;

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

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  /* =========================================================
     شروع مجدد
     ========================================================= */

  function restartGame() {

    initAudio();

    playClick();

    score = 0;

    currentStage = 0;

    completedStages.clear();

    finishScreen.classList.add(
      "hidden"
    );

    gameScreen.classList.add(
      "hidden"
    );

    startScreen.classList.remove(
      "hidden"
    );

    studentNameInput.focus();
  }


  /* =========================================================
     رویدادها
     ========================================================= */

  startBtn.addEventListener(
    "click",
    function () {

      startGame();

    }
  );


  prevBtn.addEventListener(
    "click",
    function () {

      initAudio();

      playClick();

      previousStage();

    }
  );


  nextBtn.addEventListener(
    "click",
    function () {

      initAudio();

      playClick();

      nextStage();

    }
  );


  checkBtn.addEventListener(
    "click",
    function () {

      initAudio();

      /* صدای خود دکمه */
      playClick();

      /* سپس صدای درست یا غلط */
      setTimeout(
        function () {

          checkAnswer();

        },
        55
      );

    }
  );


  clearBtn.addEventListener(
    "click",
    function () {

      initAudio();

      clearCurrentAnswer();

    }
  );


  restartBtn.addEventListener(
    "click",
    function () {

      restartGame();

    }
  );


  studentNameInput.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Enter"
      ) {

        startGame();

      }

    }
  );


  /* =========================================================
     وضعیت اولیه
     ========================================================= */

  startScreen.classList.remove(
    "hidden"
  );

  gameScreen.classList.add(
    "hidden"
  );

  finishScreen.classList.add(
    "hidden"
  );

});
