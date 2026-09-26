/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   نسخه مهندسی‌شده
   ۱۲ مرحله
   بدون اسکرول افقی جدول‌ها
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =========================================================
     تنظیمات اصلی
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
     تبدیل عدد انگلیسی به فارسی
     ========================================================= */

  function toPersianNumber(number) {

    return String(number).replace(
      /\d/g,
      function (digit) {
        return "۰۱۲۳۴۵۶۷۸۹"[digit];
      }
    );

  }


  /* =========================================================
     مراحل
     
     اصل طراحی:
     
     الگوی هر مرحله:
     ۲ بار نمایش داده می‌شود
     +
     ۲ بار دانش‌آموز ادامه می‌دهد
     
     یعنی:
     pattern × 4
     
     نیمه اول = آماده
     نیمه دوم = خالی
     ========================================================= */

  const stages = [

    /* =========================
       مرحله ۱
       سبز سبز قرمز
       دو بار آماده + دو بار خالی
    ========================= */

    {
      type: "color",

      pattern: [
        "green",
        "green",
        "red"
      ],

      instruction:
        "الگو را بخوان و سپس دو بار دیگر ادامه بده."
    },


    /* =========================
       مرحله ۲
       آبی زرد
    ========================= */

    {
      type: "color",

      pattern: [
        "blue",
        "yellow"
      ],

      instruction:
        "الگو را بخوان و سپس دو بار دیگر ادامه بده."
    },


    /* =========================
       مرحله ۳
       سبز قرمز قرمز
    ========================= */

    {
      type: "color",

      pattern: [
        "green",
        "red",
        "red"
      ],

      instruction:
        "الگو را بخوان و سپس دو بار دیگر ادامه بده."
    },


    /* =========================
       مرحله ۴
       زرد آبی سبز
    ========================= */

    {
      type: "color",

      pattern: [
        "yellow",
        "blue",
        "green"
      ],

      instruction:
        "الگو را بخوان و سپس دو بار دیگر ادامه بده."
    },


    /* =========================
       مرحله ۵
       قرمز قرمز زرد
    ========================= */

    {
      type: "color",

      pattern: [
        "red",
        "red",
        "yellow"
      ],

      instruction:
        "الگو را بخوان و سپس دو بار دیگر ادامه بده."
    },


    /* =========================
       مرحله ۶
       سبز آبی آبی
    ========================= */

    {
      type: "color",

      pattern: [
        "green",
        "blue",
        "blue"
      ],

      instruction:
        "الگو را بخوان و سپس دو بار دیگر ادامه بده."
    },


    /* =========================
       مرحله ۷
       صورتی صورتی زرد
    ========================= */

    {
      type: "color",

      pattern: [
        "pink",
        "pink",
        "yellow"
      ],

      instruction:
        "الگو را بخوان و سپس دو بار دیگر ادامه بده."
    },


    /* =========================
       مرحله ۸
       دایره دایره مثلث
       ۶ آماده + ۶ خالی
    ========================= */

    {
      type: "shape",

      pattern: [
        "circle",
        "circle",
        "triangle"
      ],

      instruction:
        "الگو را بخوان و سپس دو بار دیگر ادامه بده."
    },


    /* =========================
       مرحله ۹
       دو بار الگو + یک شکل اشتباه
    ========================= */

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
        "الگو را بخوان. سپس شکل اشتباه را پیدا و حذف کن."
    },


    /* =========================
       مرحله ۱۰
       ستاره ستاره قلب
       ۶ آماده + ۶ خالی
    ========================= */

    {
      type: "shape",

      pattern: [
        "star",
        "star",
        "heart"
      ],

      instruction:
        "الگو را بخوان و سپس دو بار دیگر ادامه بده."
    },


    /* =========================
       مرحله ۱۱
       دو مثلث قرمز + دایره
       یک شکل اشتباه
    ========================= */

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
        "الگو را بخوان. سپس شکل اشتباه را پیدا و حذف کن."
    },


    /* =========================
       مرحله ۱۲
       
       ردیف ۱:
       سبز سفید | سبز سفید | ادامه | ادامه

       ردیف ۲:
       سفید سبز سفید قرمز
       دو بار | دو بار

       ردیف ۳:
       سبز سفید | سبز سفید | ادامه | ادامه
    ========================= */

    {
      type: "combinedChecker",

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
     سیستم صدا
     ========================================================= */

  function initAudio() {

    if (audioContext) {

      if (
        audioContext.state === "suspended"
      ) {

        audioContext
          .resume()
          .catch(() => {});

      }

      return;
    }

    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioCtx) return;

    try {

      audioContext =
        new AudioCtx();

    } catch (error) {

      audioContext = null;

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
      gain.connect(
        audioContext.destination
      );

      oscillator.start();

      oscillator.stop(
        audioContext.currentTime +
        duration
      );

    } catch (error) {
      /* صدا اختیاری است */
    }

  }


  /* صدای کلیک */

  function playClick() {

    playTone(
      620,
      0.07,
      "sine",
      0.045
    );

  }


  /* صدای انتخاب */

  function playSelect() {

    playTone(
      760,
      0.065,
      "sine",
      0.045
    );

    setTimeout(
      function () {

        playTone(
          920,
          0.07,
          "sine",
          0.035
        );

      },
      55
    );

  }


  /* صدای درست */

  function playCorrect() {

    playTone(
      523,
      0.10,
      "sine",
      0.055
    );

    setTimeout(
      function () {

        playTone(
          659,
          0.10,
          "sine",
          0.055
        );

      },
      100
    );

    setTimeout(
      function () {

        playTone(
          784,
          0.18,
          "sine",
          0.055
        );

      },
      210
    );

  }


  /* صدای غلط */

  function playWrong() {

    playTone(
      180,
      0.18,
      "sawtooth",
      0.045
    );

    setTimeout(
      function () {

        playTone(
          120,
          0.20,
          "sawtooth",
          0.04
        );

      },
      130
    );

  }


  /* =========================================================
     خانه رنگی
     ========================================================= */

  function createColorCell(
    color,
    editable,
    index
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
      function () {

        if (!editable) return;
        if (!selectedTool) return;

        playSelect();

        if (
          selectedTool === "eraser"
        ) {

          cell.dataset.color =
            "";

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
     ساخت پالت رنگ
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
      function (color) {

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
              .forEach(
                function (x) {

                  x.classList.remove(
                    "selected"
                  );

                }
              );

            item.classList.add(
              "selected"
            );

            playSelect();

          }
        );

        palette.appendChild(item);

      }
    );


    createEraserButton();

  }


  /* =========================================================
     ساخت پالت شکل
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
      function (shape) {

        const item =
          document.createElement("button");

        item.type = "button";

        item.className =
          "palette-item";

        item.innerHTML =
          `<span style="
            color:${shapeInfo[shape].color};
            font-size:28px;
            line-height:1;
          ">${shapeInfo[shape].symbol}</span>`;

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
              .forEach(
                function (x) {

                  x.classList.remove(
                    "selected"
                  );

                }
              );

            item.classList.add(
              "selected"
            );

            playSelect();

          }
        );

        palette.appendChild(item);

      }
    );


    createEraserButton();

  }


  /* =========================================================
     دکمه پاک‌کن
     ========================================================= */

  function createEraserButton() {

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
          .forEach(
            function (x) {

              x.classList.remove(
                "selected"
              );

            }
          );

        eraser.classList.add(
          "selected"
        );

        playSelect();

      }
    );

    palette.appendChild(
      eraser
    );

  }


  /* =========================================================
     ساخت جدول اصلی رنگ
     
     مثال الگوی سه‌تایی:
     
     سبز سبز قرمز | سبز سبز قرمز |
     خالی خالی خالی | خالی خالی خالی
     
     یعنی دو بار خوانده شود
     و دو بار دانش‌آموز ادامه دهد.
     ========================================================= */

  function createMainColorGrid(stage) {

    taskArea.innerHTML = "";

    repeatBox.classList.remove(
      "hidden"
    );

    paletteBox.classList.remove(
      "hidden"
    );

    currentCells = [];
    repeatCells = [];

    const total =
      stage.pattern.length * 4;

    const readyCount =
      stage.pattern.length * 2;

    const grid =
      document.createElement("div");

    grid.className =
      "pattern-grid";

    grid.style.gridTemplateColumns =
      `repeat(${total}, minmax(0, 1fr))`;

    for (
      let i = 0;
      i < total;
      i++
    ) {

      const ready =
        i < readyCount;

      const color =
        ready
          ? stage.pattern[
              i %
              stage.pattern.length
            ]
          : null;

      const cell =
        createColorCell(
          color,
          !ready,
          i
        );

      grid.appendChild(cell);

      currentCells.push(cell);

    }

    taskArea.appendChild(grid);

    createRepeatGrid(
      stage.pattern
    );

    createColorPalette();

  }


  /* =========================================================
     جدول تکرار
     
     دقیقاً یک بار طول الگو
     ========================================================= */

  function createRepeatGrid(
    pattern
  ) {

    repeatArea.innerHTML = "";

    repeatCells = [];

    repeatArea.style.gridTemplateColumns =
      `repeat(${pattern.length}, minmax(0, 1fr))`;

    pattern.forEach(
      function () {

        const cell =
          document.createElement("div");

        cell.className =
          "repeat-cell cell-white";

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

        repeatArea.appendChild(
          cell
        );

        repeatCells.push(
          cell
        );

      }
    );

  }


  /* =========================================================
     ساخت مرحله شکل
     
     الگو دو بار آماده
     دو بار خالی
     
     برای الگوی ۳تایی = ۱۲ خانه
     ========================================================= */

  function createShapeGrid(stage) {

    taskArea.innerHTML = "";

    repeatBox.classList.add(
      "hidden"
    );

    paletteBox.classList.remove(
      "hidden"
    );

    currentCells = [];

    const total =
      stage.pattern.length * 4;

    const readyCount =
      stage.pattern.length * 2;

    const grid =
      document.createElement("div");

    grid.className =
      "shape-grid";

    grid.style.gridTemplateColumns =
      `repeat(${total}, minmax(0, 1fr))`;

    for (
      let i = 0;
      i < total;
      i++
    ) {

      const ready =
        i < readyCount;

      const cell =
        document.createElement("div");

      cell.className =
        "shape-cell " +
        (
          ready
            ? "locked"
            : "editable"
        );

      cell.dataset.index =
        i;

      cell.dataset.shape =
        "";

      if (ready) {

        const shape =
          stage.pattern[
            i %
            stage.pattern.length
          ];

        cell.dataset.shape =
          shape;

        cell.innerHTML =
          `<span
             class="shape-symbol"
             style="color:${shapeInfo[shape].color}"
           >${shapeInfo[shape].symbol}</span>`;

      } else {

        cell.addEventListener(
          "click",
          function () {

            if (!selectedTool)
              return;

            playSelect();

            if (
              selectedTool === "eraser"
            ) {

              cell.dataset.shape =
                "";

              cell.innerHTML =
                "";

            } else if (
              shapeInfo[selectedTool]
            ) {

              const shape =
                selectedTool;

              cell.dataset.shape =
                shape;

              cell.innerHTML =
                `<span
                   class="shape-symbol"
                   style="color:${shapeInfo[shape].color}"
                 >${shapeInfo[shape].symbol}</span>`;

            }

          }
        );

      }

      grid.appendChild(cell);

      currentCells.push(
        cell
      );

    }

    taskArea.appendChild(
      grid
    );

    createShapePalette();

  }


  /* =========================================================
     مرحله حذف شکل
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

    const row =
      document.createElement("div");

    row.className =
      "shape-row";

    row.style.gridTemplateColumns =
      `repeat(${stage.shapes.length}, minmax(0, 1fr))`;

    stage.shapes.forEach(
      function (shape, index) {

        const option =
          document.createElement("div");

        option.className =
          "shape-option";

        option.dataset.index =
          index;

        option.innerHTML =
          `<span
             class="remove-shape-symbol"
             style="color:${shapeInfo[shape].color}"
           >${shapeInfo[shape].symbol}</span>`;

        option.addEventListener(
          "click",
          function () {

            initAudio();

            document
              .querySelectorAll(
                ".shape-option"
              )
              .forEach(
                function (x) {

                  x.classList.remove(
                    "selected"
                  );

                }
              );

            option.classList.add(
              "selected"
            );

            selectedShapeAnswer =
              index;

            playSelect();

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
     
     هر ردیف:
     دو بار الگو آماده
     دو بار الگو خالی
     
     سپس پایین:
     یک بار همان الگو برای هر ردیف
     ========================================================= */

  function createCombinedCheckerStage(
    stage
  ) {

    taskArea.innerHTML = "";

    repeatBox.classList.add(
      "hidden"
    );

    paletteBox.classList.remove(
      "hidden"
    );

    currentCells = [];
    repeatCells = [];


    const mainBox =
      document.createElement("div");

    mainBox.className =
      "combined-pattern-box";


    stage.rows.forEach(
      function (rowData, rowIndex) {

        const total =
          rowData.pattern.length * 4;

        const readyCount =
          rowData.pattern.length * 2;

        const row =
          document.createElement("div");

        row.className =
          "combined-row-box";

        row.style.gridTemplateColumns =
          `repeat(${total}, minmax(0, 1fr))`;


        for (
          let i = 0;
          i < total;
          i++
        ) {

          const ready =
            i < readyCount;

          const color =
            ready
              ? rowData.pattern[
                  i %
                  rowData.pattern.length
                ]
              : null;

          const cell =
            createColorCell(
              color,
              !ready,
              i
            );

          cell.dataset.row =
            rowIndex;

          cell.dataset.expected =
            rowData.pattern[
              i %
              rowData.pattern.length
            ];

          row.appendChild(
            cell
          );

          currentCells.push({
            cell: cell,
            rowIndex: rowIndex,
            expected:
              cell.dataset.expected
          });

        }

        mainBox.appendChild(
          row
        );

      }
    );


    taskArea.appendChild(
      mainBox
    );


    /* =========================
       جدول پایین
    ========================= */

    const wrapper =
      document.createElement("div");

    wrapper.className =
      "combined-repeat-box";


    const title =
      document.createElement("div");

    title.className =
      "combined-repeat-title";

    title.textContent =
      "✨ حالا الگوی هر ردیف را یک بار در پایین تکرار کن.";

    wrapper.appendChild(
      title
    );


    stage.rows.forEach(
      function (rowData) {

        const repeatRow =
          document.createElement("div");

        repeatRow.className =
          "combined-repeat-row";

        repeatRow.style.gridTemplateColumns =
          `repeat(${rowData.pattern.length}, minmax(0, 1fr))`;


        rowData.pattern.forEach(
          function () {

            const cell =
              document.createElement("div");

            cell.className =
              "repeat-cell cell-white";

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

            repeatRow.appendChild(
              cell
            );

            repeatCells.push(
              cell
            );

          }
        );


        wrapper.appendChild(
          repeatRow
        );

      }
    );


    taskArea.appendChild(
      wrapper
    );


    createColorPalette();

  }


  /* =========================================================
     پاک کردن
     ========================================================= */

  function clearCurrentAnswer() {

    playClick();

    const stage =
      stages[currentStage];


    /* حذف شکل */

    if (
      stage.type === "remove"
    ) {

      selectedShapeAnswer =
        null;

      document
        .querySelectorAll(
          ".shape-option"
        )
        .forEach(
          function (x) {

            x.classList.remove(
              "selected"
            );

          }
        );

      feedback.textContent =
        "";

      return;
    }


    /* مرحله ۱۲ */

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


    /* مراحل معمولی */

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

      }
    );


    feedback.textContent =
      "";

  }


  /* =========================================================
     بررسی مرحله رنگ
     ========================================================= */

  function checkColorStage(stage) {

    let correct = true;


    currentCells.forEach(
      function (cell) {

        if (
          !cell.classList.contains(
            "editable"
          )
        ) return;

        const index =
          Number(
            cell.dataset.index
          );

        const expected =
          stage.pattern[
            index %
            stage.pattern.length
          ];

        if (
          cell.dataset.color !==
          expected
        ) {

          correct = false;

        }

      }
    );


    /* جدول پایین */

    stage.pattern.forEach(
      function (expected, index) {

        const cell =
          repeatCells[index];

        if (!cell) {

          correct = false;
          return;

        }

        if (
          cell.dataset.value !==
          expected
        ) {

          correct = false;

        }

      }
    );


    return correct;

  }


  /* =========================================================
     بررسی شکل
     ========================================================= */

  function checkShapeStage(stage) {

    let correct = true;


    currentCells.forEach(
      function (cell) {

        if (
          !cell.classList.contains(
            "editable"
          )
        ) return;

        const index =
          Number(
            cell.dataset.index
          );

        const expected =
          stage.pattern[
            index %
            stage.pattern.length
          ];

        if (
          cell.dataset.shape !==
          expected
        ) {

          correct = false;

        }

      }
    );


    return correct;

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

  function checkCombinedCheckerStage(
    stage
  ) {

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


    /* جدول‌های پایین */

    let repeatIndex = 0;


    stage.rows.forEach(
      function (rowData) {

        rowData.pattern.forEach(
          function (expected) {

            const cell =
              repeatCells[
                repeatIndex
              ];

            if (!cell) {

              correct = false;

            } else if (
              cell.dataset.value !==
              expected
            ) {

              correct = false;

            }

            repeatIndex++;

          }
        );

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
        checkColorStage(
          stage
        );

    } else if (
      stage.type === "shape"
    ) {

      correct =
        checkShapeStage(
          stage
        );

    } else if (
      stage.type === "remove"
    ) {

      correct =
        checkRemoveStage(
          stage
        );

    } else if (
      stage.type === "combinedChecker"
    ) {

      correct =
        checkCombinedCheckerStage(
          stage
        );

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

      const safeName =
        studentName ||
        "قهرمان کوچولو";

      feedback.textContent =
        `👏🏻 آفرین ${safeName}! خیلی خوب الگو را پیدا کردی!`;

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

      feedback.textContent =
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

    currentCells = [];
    repeatCells = [];


    if (
      stage.type === "color"
    ) {

      createMainColorGrid(
        stage
      );

    } else if (
      stage.type === "shape"
    ) {

      createShapeGrid(
        stage
      );

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


    stageCounter.textContent =
      `مرحله ${toPersianNumber(currentStage + 1)} از ${toPersianNumber(stages.length)}`;


    prevBtn.disabled =
      currentStage === 0;

    nextBtn.disabled =
      currentStage ===
      stages.length - 1;

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

    const safeName =
      studentName ||
      "قهرمان کوچولو";

    finishText.textContent =
      `خیلی خوب پیش رفتی، ${safeName}!`;

    finalScore.textContent =
      `امتیاز: ${toPersianNumber(score)} از ${toPersianNumber(stages.length)} 🌟`;

  }


  /* =========================================================
     شروع بازی
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
    startGame
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

      playClick();

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
    restartGame
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
