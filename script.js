/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   نسخه کامل و اصلاح‌شده
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

/* برای جلوگیری از امتیاز دوباره */
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
   اطلاعات شکل‌ها
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
   مراحل بازی
   ========================================================= */

const stages = [

  /* مرحله ۱ */
  {
    type: "color",
    pattern: ["green", "green", "red"],
    blanks: [15, 16, 17, 18, 19, 20],
    instruction: "الگوی تکرارشونده را ادامه بده."
  },

  /* مرحله ۲ */
  {
    type: "color",
    pattern: ["blue", "yellow"],
    blanks: [13, 14, 15, 16, 17, 18, 19, 20],
    instruction: "الگوی تکرارشونده را ادامه بده."
  },

  /* مرحله ۳ */
  {
    type: "color",
    pattern: ["green", "red", "red"],
    blanks: [14, 15, 16, 17, 18, 19, 20],
    instruction: "الگوی تکرارشونده را پیدا کن و ادامه بده."
  },

  /* مرحله ۴ */
  {
    type: "color",
    pattern: ["yellow", "blue", "green"],
    blanks: [14, 15, 16, 17, 18, 19, 20],
    instruction: "الگوی تکرارشونده را پیدا کن و ادامه بده."
  },

  /* مرحله ۵ */
  {
    type: "color",
    pattern: ["red", "red", "yellow"],
    blanks: [14, 15, 16, 17, 18, 19, 20],
    instruction: "الگوی تکرارشونده را پیدا کن و ادامه بده."
  },

  /* مرحله ۶ */
  {
    type: "color",
    pattern: ["green", "blue", "blue"],
    blanks: [14, 15, 16, 17, 18, 19, 20],
    instruction: "الگوی تکرارشونده را پیدا کن و ادامه بده."
  },

  /* مرحله ۷ */
  {
    type: "color",
    pattern: ["pink", "pink", "yellow"],
    blanks: [14, 15, 16, 17, 18, 19, 20],
    instruction: "الگوی تکرارشونده را پیدا کن و ادامه بده."
  },

  /* مرحله ۸ */
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
    instruction: "الگوی تکرارشونده را پیدا کن و الگو را ادامه بده."
  },

  /* مرحله ۹ */
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
    instruction: "کدام شکل را حذف کنیم تا الگو منظم شود؟"
  },

  /* مرحله ۱۰ */
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
    instruction: "الگوی تکرارشونده را پیدا کن و الگو را ادامه بده."
  },

  /* مرحله ۱۱ */
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
    instruction: "کدام شکل را حذف کنیم تا الگو منظم شود؟"
  },

  /* =====================================================
     مرحله ۱۲
     فقط سه ردیف
     ===================================================== */

  {
    type: "combinedChecker",

    rows: [

      {
        pattern: ["green", "white"],
        blanks: [14, 15, 16, 17, 18, 19, 20]
      },

      {
        pattern: ["white", "green", "white", "red"],
        blanks: [14, 15, 16, 17, 18, 19, 20]
      },

      {
        pattern: ["green", "white"],
        blanks: [14, 15, 16, 17, 18, 19, 20]
      }

    ],

    instruction: "الگو را پیدا کن و سپس ادامه بده."
  }

];


/* =========================================================
   عناصر صفحه
   ========================================================= */

let startScreen;
let gameScreen;
let finishScreen;

let studentNameInput;
let startBtn;

let prevBtn;
let nextBtn;

let stageCounter;
let instruction;

let taskArea;

let repeatBox;
let repeatArea;

let paletteBox;
let palette;

let checkBtn;
let clearBtn;

let feedback;

let restartBtn;

let finishText;
let finalScore;


/* =========================================================
   پیدا کردن عناصر صفحه
   ========================================================= */

function getPageElements() {

  startScreen = document.getElementById("startScreen");
  gameScreen = document.getElementById("gameScreen");
  finishScreen = document.getElementById("finishScreen");

  studentNameInput =
    document.getElementById("studentName");

  startBtn =
    document.getElementById("startBtn");

  prevBtn =
    document.getElementById("prevBtn");

  nextBtn =
    document.getElementById("nextBtn");

  stageCounter =
    document.getElementById("stageCounter");

  instruction =
    document.getElementById("instruction");

  taskArea =
    document.getElementById("taskArea");

  repeatBox =
    document.getElementById("repeatBox");

  repeatArea =
    document.getElementById("repeatArea");

  paletteBox =
    document.getElementById("paletteBox");

  palette =
    document.getElementById("palette");

  checkBtn =
    document.getElementById("checkBtn");

  clearBtn =
    document.getElementById("clearBtn");

  feedback =
    document.getElementById("feedback");

  restartBtn =
    document.getElementById("restartBtn");

  finishText =
    document.getElementById("finishText");

  finalScore =
    document.getElementById("finalScore");
}


/* =========================================================
   صدا
   ========================================================= */

function initAudio() {

  try {

    if (audioContext) return;

    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (AudioCtx) {
      audioContext = new AudioCtx();
    }

  } catch (error) {}
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

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

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

  } catch (error) {}
}


function playClick() {
  playTone(620, 0.07, "sine", 0.035);
}


function playCorrect() {

  playTone(523, 0.10, "sine", 0.05);

  setTimeout(() => {
    playTone(659, 0.10, "sine", 0.05);
  }, 100);

  setTimeout(() => {
    playTone(784, 0.18, "sine", 0.05);
  }, 210);
}


function playWrong() {

  playTone(190, 0.15, "sawtooth", 0.035);

  setTimeout(() => {
    playTone(140, 0.13, "sawtooth", 0.03);
  }, 120);
}


/* =========================================================
   ساخت خانه رنگی
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
    (editable ? "editable" : "locked");

  cell.dataset.index = index;
  cell.dataset.container = containerType;

  if (color) {

    cell.classList.add(
      "cell-" + color
    );

    cell.dataset.color = color;

  } else {

    cell.classList.add("cell-white");

    cell.dataset.color = "";
  }


  if (editable) {

    cell.addEventListener("click", () => {

      if (!selectedTool) return;

      playClick();

      if (selectedTool === "eraser") {

        cell.dataset.color = "";

        cell.className =
          "pattern-cell editable cell-white";

      } else {

        cell.dataset.color =
          selectedTool;

        cell.className =
          "pattern-cell editable cell-" +
          selectedTool;
      }

    });

  }

  return cell;
}


/* =========================================================
   پالت رنگ
   ========================================================= */

function createColorPalette() {

  if (!palette) return;

  palette.innerHTML = "";

  const colors = [
    "green",
    "red",
    "blue",
    "yellow",
    "pink",
    "purple"
  ];

  colors.forEach(color => {

    const item =
      document.createElement("button");

    item.type = "button";

    item.className =
      "palette-item";

    item.style.background =
      COLORS[color];

    item.dataset.tool =
      color;

    item.addEventListener("click", () => {

      selectedTool = color;

      document
        .querySelectorAll(".palette-item")
        .forEach(x =>
          x.classList.remove("selected")
        );

      item.classList.add("selected");

      playClick();
    });

    palette.appendChild(item);

  });


  createEraserButton();
}


/* =========================================================
   پالت شکل
   ========================================================= */

function createShapePalette() {

  if (!palette) return;

  palette.innerHTML = "";

  const shapes = [
    "circle",
    "square",
    "triangle",
    "star",
    "heart",
    "diamond"
  ];

  shapes.forEach(shape => {

    const item =
      document.createElement("button");

    item.type = "button";

    item.className =
      "palette-item";

    item.style.background =
      "#ffffff";

    item.innerHTML =
      `<span style="
        color:${shapeInfo[shape].color};
        font-size:25px;
        line-height:1;
      ">${shapeInfo[shape].symbol}</span>`;

    item.dataset.tool =
      shape;

    item.addEventListener("click", () => {

      selectedTool = shape;

      document
        .querySelectorAll(".palette-item")
        .forEach(x =>
          x.classList.remove("selected")
        );

      item.classList.add("selected");

      playClick();
    });

    palette.appendChild(item);

  });


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

  eraser.textContent = "⌫";

  eraser.addEventListener("click", () => {

    selectedTool = "eraser";

    document
      .querySelectorAll(".palette-item")
      .forEach(x =>
        x.classList.remove("selected")
      );

    eraser.classList.add("selected");

    playClick();
  });

  palette.appendChild(eraser);
}


/* =========================================================
   جدول رنگی اصلی
   ========================================================= */

function createMainColorGrid(stage) {

  taskArea.innerHTML = "";

  const wrap =
    document.createElement("div");

  wrap.className =
    "task-wrap";

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

  wrap.appendChild(grid);

  taskArea.appendChild(wrap);

  createColorPalette();

  createRepeatGrid(stage.pattern);
}


/* =========================================================
   جدول شکل اصلی
   ========================================================= */

function createShapeGrid(stage) {

  taskArea.innerHTML = "";

  const wrap =
    document.createElement("div");

  wrap.className =
    "task-wrap";

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

    const cell =
      document.createElement("div");

    cell.className =
      "pattern-cell " +
      (
        shouldBeBlank
          ? "editable"
          : "locked"
      );

    cell.dataset.index = i;

    if (!shouldBeBlank) {

      const shape =
        stage.pattern[patternIndex];

      cell.dataset.shape =
        shape;

      cell.innerHTML =
        `<span style="
          color:${shapeInfo[shape].color};
          font-size:clamp(12px,3vw,38px);
          line-height:1;
        ">${shapeInfo[shape].symbol}</span>`;

    } else {

      cell.dataset.shape = "";

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

            cell.innerHTML = "";

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

    grid.appendChild(cell);

    currentCells.push(cell);
  }

  wrap.appendChild(grid);

  taskArea.appendChild(wrap);

  createShapePalette();

  createShapeRepeatGrid(
    stage.pattern
  );
}


/* =========================================================
   تکرار الگوی رنگی
   ========================================================= */

function createRepeatGrid(pattern) {

  if (repeatBox) {
    repeatBox.classList.remove(
      "hidden"
    );
  }

  if (!repeatArea) return;

  repeatArea.innerHTML = "";

  repeatCells = [];

  const grid =
    document.createElement("div");

  grid.className =
    "repeat-grid";

  pattern.forEach(
    (color, index) => {

      const cell =
        createColorCell(
          null,
          true,
          index,
          "repeat"
        );

      cell.classList.add(
        "repeat-cell"
      );

      cell.dataset.expectedColor =
        color;

      grid.appendChild(cell);

      repeatCells.push(cell);
    }
  );

  repeatArea.appendChild(grid);
}


/* =========================================================
   تکرار الگوی شکل
   ========================================================= */

function createShapeRepeatGrid(
  pattern
) {

  if (repeatBox) {
    repeatBox.classList.remove(
      "hidden"
    );
  }

  if (!repeatArea) return;

  repeatArea.innerHTML = "";

  repeatCells = [];

  const grid =
    document.createElement("div");

  grid.className =
    "repeat-grid";

  pattern.forEach(
    (shape, index) => {

      const cell =
        document.createElement("div");

      cell.className =
        "pattern-cell editable cell-white repeat-cell";

      cell.dataset.index =
        index;

      cell.dataset.container =
        "repeat";

      cell.dataset.shape =
        "";

      cell.dataset.expectedShape =
        shape;

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

            cell.innerHTML = "";

            cell.dataset.shape =
              "";

          } else {

            cell.dataset.shape =
              selectedTool;

            cell.innerHTML =
              `<span style="
                color:${shapeInfo[selectedTool].color};
                font-size:25px;
                line-height:1;
              ">${shapeInfo[selectedTool].symbol}</span>`;
          }

        }
      );

      grid.appendChild(cell);

      repeatCells.push(cell);
    }
  );

  repeatArea.appendChild(grid);
}


/* =========================================================
   مرحله سؤال ترکیبی سه ردیفه
   ========================================================= */

function createCombinedCheckerStage(
  stage
) {

  taskArea.innerHTML = "";

  if (repeatBox) {
    repeatBox.classList.add(
      "hidden"
    );
  }

  if (paletteBox) {
    paletteBox.classList.remove(
      "hidden"
    );
  }

  currentCells = [];
  repeatCells = [];


  /* -------------------------------------------------------
     بخش اصلی سه ردیف
     ------------------------------------------------------- */

  const combinedBox =
    document.createElement("div");

  combinedBox.className =
    "combined-checker-box";


  stage.rows.forEach(
    (rowData, rowIndex) => {

      const rowWrap =
        document.createElement("div");

      rowWrap.className =
        "combined-row";

      rowWrap.dataset.row =
        rowIndex;


      const grid =
        document.createElement("div");

      grid.className =
        "pattern-grid";


      for (
        let i = 0;
        i < TOTAL_COLUMNS;
        i++
      ) {

        const patternIndex =
          i %
          rowData.pattern.length;

        const shouldBeBlank =
          rowData.blanks.includes(i);

        let color = null;

        if (!shouldBeBlank) {

          color =
            rowData.pattern[
              patternIndex
            ];
        }


        const cell =
          createColorCell(
            color,
            shouldBeBlank,
            i,
            "combined-main"
          );

        cell.dataset.row =
          rowIndex;

        grid.appendChild(cell);

        currentCells.push(cell);
      }


      rowWrap.appendChild(grid);

      combinedBox.appendChild(
        rowWrap
      );
    }
  );


  taskArea.appendChild(
    combinedBox
  );


  /* -------------------------------------------------------
     پالت رنگ
     ------------------------------------------------------- */

  createColorPalette();


  /* =======================================================
     قسمت پایین:
     هر الگو فقط یک بار
     ======================================================= */

  const repeatWrapper =
    document.createElement("div");

  repeatWrapper.className =
    "combined-repeat-wrapper";


  const repeatTitle =
    document.createElement("div");

  repeatTitle.className =
    "combined-repeat-title";

  repeatTitle.textContent =
    "✨ الگوی تکرارشونده را برای هر ردیف، یک بار در پایین تکرار کن.";


  repeatWrapper.appendChild(
    repeatTitle
  );


  /* دقیقاً سه ردیف */
  stage.rows.forEach(
    (rowData, rowIndex) => {

      const repeatRow =
        createCombinedRepeatRow(
          rowData.pattern,
          rowIndex
        );

      repeatWrapper.appendChild(
        repeatRow
      );
    }
  );


  taskArea.appendChild(
    repeatWrapper
  );
}


/* =========================================================
   ردیف پایین تکرار الگو
   ========================================================= */

function createCombinedRepeatRow(
  pattern,
  rowIndex
) {

  const row =
    document.createElement("div");

  row.className =
    "combined-repeat-row";

  row.dataset.row =
    rowIndex;


  /* عنوان ردیف */
  const label =
    document.createElement("div");

  label.className =
    "repeat-row-label";

  label.textContent =
    `ردیف ${rowIndex + 1}`;


  row.appendChild(label);


  /* فقط یک بار از خود الگو */
  pattern.forEach(
    (color, index) => {

      const cell =
        document.createElement("div");

      cell.className =
        "pattern-cell editable cell-white";


      cell.dataset.container =
        "combined-repeat";

      cell.dataset.row =
        rowIndex;

      cell.dataset.index =
        index;

      cell.dataset.color =
        "";

      cell.dataset.expectedColor =
        color;


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


      row.appendChild(cell);

      repeatCells.push(cell);
    }
  );


  return row;
}


/* =========================================================
   مرحله حذف شکل
   ========================================================= */

function createRemoveStage(
  stage
) {

  taskArea.innerHTML = "";

  if (repeatBox) {
    repeatBox.classList.add(
      "hidden"
    );
  }

  if (paletteBox) {
    paletteBox.classList.add(
      "hidden"
    );
  }

  selectedShapeAnswer = null;


  const box =
    document.createElement("div");

  box.className =
    "remove-stage";


  const shapeRow =
    document.createElement("div");

  shapeRow.className =
    "remove-shape-row";


  stage.shapes.forEach(
    (shape, index) => {

      const item =
        document.createElement("button");

      item.type = "button";

      item.className =
        "remove-shape";

      item.dataset.index =
        index;

      item.innerHTML =
        `<span style="
          color:${shapeInfo[shape].color};
          font-size:clamp(28px,7vw,55px);
          line-height:1;
        ">${shapeInfo[shape].symbol}</span>`;


      item.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".remove-shape"
            )
            .forEach(x =>
              x.classList.remove(
                "selected"
              )
            );

          item.classList.add(
            "selected"
          );

          selectedShapeAnswer =
            index;

          playClick();
        }
      );


      shapeRow.appendChild(item);
    }
  );


  box.appendChild(shapeRow);

  taskArea.appendChild(box);
}


/* =========================================================
   پاک کردن پاسخ
   ========================================================= */

function clearCurrentAnswer() {

  const stage =
    stages[currentStage];

  selectedTool = null;

  selectedShapeAnswer =
    null;


  document
    .querySelectorAll(
      ".palette-item"
    )
    .forEach(x =>
      x.classList.remove(
        "selected"
      )
    );


  /* رنگ و شکل */
  if (
    stage.type === "color" ||
    stage.type === "shape"
  ) {

    currentCells.forEach(
      cell => {

        if (
          !cell.classList.contains(
            "editable"
          )
        ) {
          return;
        }


        if (
          stage.type ===
          "color"
        ) {

          cell.dataset.color =
            "";

          cell.className =
            "pattern-cell editable cell-white";

        } else {

          cell.dataset.shape =
            "";

          cell.innerHTML =
            "";

          cell.className =
            "pattern-cell editable cell-white";
        }

      }
    );


    repeatCells.forEach(
      cell => {

        if (
          stage.type ===
          "color"
        ) {

          cell.dataset.color =
            "";

          cell.className =
            "pattern-cell editable cell-white";

        } else {

          cell.dataset.shape =
            "";

          cell.innerHTML =
            "";

          cell.className =
            "pattern-cell editable cell-white";
        }

      }
    );
  }


  /* سؤال ترکیبی */
  if (
    stage.type ===
    "combinedChecker"
  ) {

    currentCells.forEach(
      cell => {

        cell.dataset.color =
          "";

        cell.className =
          "pattern-cell editable cell-white";
      }
    );


    repeatCells.forEach(
      cell => {

        cell.dataset.color =
          "";

        cell.className =
          "pattern-cell editable cell-white";
      }
    );
  }


  document
    .querySelectorAll(
      ".remove-shape"
    )
    .forEach(x =>
      x.classList.remove(
        "selected"
      )
    );


  if (feedback) {
    feedback.textContent = "";
  }
}


/* =========================================================
   بررسی مرحله رنگی
   ========================================================= */

function checkColorStage(stage) {

  for (
    const cell of currentCells
  ) {

    const index =
      Number(cell.dataset.index);

    if (
      !stage.blanks.includes(
        index
      )
    ) {
      continue;
    }


    const expected =
      stage.pattern[
        index %
        stage.pattern.length
      ];

    const actual =
      cell.dataset.color ||
      "";


    if (actual !== expected) {

      playWrong();

      feedback.textContent =
        "🌸 هنوز یک یا چند خانه نیاز به اصلاح دارد.";

      return false;
    }
  }

  return true;
}


/* =========================================================
   بررسی مرحله شکل
   ========================================================= */

function checkShapeStage(stage) {

  for (
    const cell of currentCells
  ) {

    const index =
      Number(cell.dataset.index);

    if (
      !stage.blanks.includes(
        index
      )
    ) {
      continue;
    }


    const expected =
      stage.pattern[
        index %
        stage.pattern.length
      ];

    const actual =
      cell.dataset.shape ||
      "";


    if (actual !== expected) {

      playWrong();

      feedback.textContent =
        "🌸 هنوز یک یا چند شکل درست انتخاب نشده است.";

      return false;
    }
  }

  return true;
}


/* =========================================================
   بررسی مرحله حذف
   ========================================================= */

function checkRemoveStage(stage) {

  if (
    selectedShapeAnswer ===
      null ||
    selectedShapeAnswer ===
      undefined
  ) {

    playWrong();

    feedback.textContent =
      "🌸 اول یکی از شکل‌ها را انتخاب کن.";

    return false;
  }


  if (
    selectedShapeAnswer !==
    stage.answer
  ) {

    playWrong();

    feedback.textContent =
      "🌸 دوباره الگو را با دقت نگاه کن.";

    return false;
  }


  return true;
}


/* =========================================================
   بررسی سؤال ترکیبی
   ========================================================= */

function checkCombinedCheckerStage(
  stage
) {

  /* -------------------------------------------------------
     بررسی سه ردیف اصلی
     ------------------------------------------------------- */

  for (
    let rowIndex = 0;
    rowIndex < stage.rows.length;
    rowIndex++
  ) {

    const row =
      stage.rows[rowIndex];


    const rowCells =
      currentCells.filter(
        cell =>
          Number(
            cell.dataset.row
          ) === rowIndex
      );


    for (
      const cell of rowCells
    ) {

      const index =
        Number(cell.dataset.index);


      if (
        !row.blanks.includes(
          index
        )
      ) {
        continue;
      }


      const expected =
        row.pattern[
          index %
          row.pattern.length
        ];


      const actual =
        cell.dataset.color ||
        "";


      if (actual !== expected) {

        playWrong();

        feedback.textContent =
          "🌸 اول الگوی هر سه ردیف را با دقت کامل کن.";

        return false;
      }
    }
  }


  /* -------------------------------------------------------
     بررسی خانه‌های پایین
     ------------------------------------------------------- */

  for (
    const cell of repeatCells
  ) {

    const expected =
      cell.dataset.expectedColor ||
      "";

    const actual =
      cell.dataset.color ||
      "";


    if (actual !== expected) {

      playWrong();

      feedback.textContent =
        "🌸 الگوی تکرارشونده‌ی یکی از ردیف‌ها کامل نیست.";

      return false;
    }
  }


  return true;
}


/* =========================================================
   بررسی پاسخ
   ========================================================= */

function checkAnswer() {

  const stage =
    stages[currentStage];

  let correct = false;


  if (
    stage.type ===
    "color"
  ) {

    correct =
      checkColorStage(stage);

  } else if (
    stage.type ===
    "shape"
  ) {

    correct =
      checkShapeStage(stage);

  } else if (
    stage.type ===
    "remove"
  ) {

    correct =
      checkRemoveStage(stage);

  } else if (
    stage.type ===
    "combinedChecker"
  ) {

    correct =
      checkCombinedCheckerStage(
        stage
      );
  }


  if (!correct) {
    return false;
  }


  /* امتیاز فقط یک بار */
  if (
    !completedStages.has(
      currentStage
    )
  ) {

    completedStages.add(
      currentStage
    );

    score++;
  }


  playCorrect();


  feedback.textContent =
    "🎉 آفرین! پاسخ تو کاملاً درست است.";


  setTimeout(
    () => {

      if (
        currentStage <
        stages.length - 1
      ) {

        currentStage++;

        renderStage();

      } else {

        finishGame();
      }

    },
    900
  );


  return true;
}


/* =========================================================
   نمایش مرحله
   ========================================================= */

function renderStage() {

  const stage =
    stages[currentStage];


  selectedTool = null;

  selectedShapeAnswer =
    null;

  currentCells = [];

  repeatCells = [];


  if (feedback) {
    feedback.textContent = "";
  }


  if (instruction) {
    instruction.textContent =
      stage.instruction;
  }


  if (stageCounter) {

    stageCounter.textContent =
      `مرحله ${
        currentStage + 1
      } از ${
        stages.length
      }`;
  }


  if (prevBtn) {

    prevBtn.disabled =
      currentStage === 0;
  }


  if (nextBtn) {

    if (
      currentStage ===
      stages.length - 1
    ) {

      nextBtn.textContent =
        "پایان بازی";

    } else {

      nextBtn.textContent =
        "مرحله بعدی ➜";
    }
  }


  if (paletteBox) {
    paletteBox.classList.add(
      "hidden"
    );
  }


  if (repeatBox) {
    repeatBox.classList.add(
      "hidden"
    );
  }


  if (stage.type === "color") {

    if (paletteBox) {
      paletteBox.classList.remove(
        "hidden"
      );
    }

    createMainColorGrid(stage);

  } else if (
    stage.type === "shape"
  ) {

    if (paletteBox) {
      paletteBox.classList.remove(
        "hidden"
      );
    }

    createShapeGrid(stage);

  } else if (
    stage.type === "remove"
  ) {

    createRemoveStage(stage);

  } else if (
    stage.type ===
    "combinedChecker"
  ) {

    if (paletteBox) {
      paletteBox.classList.remove(
        "hidden"
      );
    }

    createCombinedCheckerStage(
      stage
    );
  }
}


/* =========================================================
   شروع بازی
   ========================================================= */

function startGame() {

  initAudio();


  studentName =
    studentNameInput
      ? studentNameInput.value.trim()
      : "";


  /*
    اگر نام خالی باشد،
    بازی متوقف نمی‌شود.
  */

  if (!studentName) {
    studentName = "دانش‌آموز";
  }


  score = 0;

  currentStage = 0;

  selectedTool = null;

  selectedShapeAnswer =
    null;

  completedStages.clear();


  if (startScreen) {
    startScreen.classList.add(
      "hidden"
    );
  }


  if (finishScreen) {
    finishScreen.classList.add(
      "hidden"
    );
  }


  if (gameScreen) {
    gameScreen.classList.remove(
      "hidden"
    );
  }


  renderStage();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   مرحله قبل
   ========================================================= */

function previousStage() {

  if (currentStage <= 0) {
    return;
  }


  currentStage--;

  renderStage();

  playClick();
}


/* =========================================================
   مرحله بعد
   ========================================================= */

function nextStage() {

  /*
    مرحله بعد مستقیماً رد نمی‌شود.
    ابتدا پاسخ بررسی می‌شود.
  */

  checkAnswer();
}


/* =========================================================
   پایان بازی
   ========================================================= */

function finishGame() {

  if (gameScreen) {
    gameScreen.classList.add(
      "hidden"
    );
  }


  if (finishScreen) {
    finishScreen.classList.remove(
      "hidden"
    );
  }


  if (finalScore) {

    finalScore.textContent =
      `${score} از ${stages.length}`;
  }


  if (finishText) {

    finishText.textContent =
      `آفرین ${studentName}! تو الگوها را با دقت پیدا کردی 🌸`;
  }


  createConfetti();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   شروع دوباره
   ========================================================= */

function restartGame() {

  score = 0;

  currentStage = 0;

  selectedTool = null;

  selectedShapeAnswer =
    null;

  completedStages.clear();


  if (finishScreen) {
    finishScreen.classList.add(
      "hidden"
    );
  }


  if (startScreen) {
    startScreen.classList.remove(
      "hidden"
    );
  }


  if (gameScreen) {
    gameScreen.classList.add(
      "hidden"
    );
  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  playClick();
}


/* =========================================================
   جشن پایان
   ========================================================= */

function createConfetti() {

  const old =
    document.querySelector(
      ".game-confetti"
    );

  if (old) {
    old.remove();
  }


  const container =
    document.createElement("div");

  container.className =
    "game-confetti";


  container.style.position =
    "fixed";

  container.style.inset =
    "0";

  container.style.pointerEvents =
    "none";

  container.style.overflow =
    "hidden";

  container.style.zIndex =
    "9999";


  const confettiColors = [
    "#58c86b",
    "#42a5f5",
    "#ffd84d",
    "#ef5350",
    "#ff73ad",
    "#9c64e8"
  ];


  for (
    let i = 0;
    i < 45;
    i++
  ) {

    const piece =
      document.createElement(
        "span"
      );


    piece.style.position =
      "absolute";

    piece.style.left =
      Math.random() * 100 + "%";

    piece.style.top =
      "-20px";

    piece.style.width =
      "9px";

    piece.style.height =
      "14px";

    piece.style.background =
      confettiColors[
        Math.floor(
          Math.random() *
          confettiColors.length
        )
      ];

    piece.style.borderRadius =
      "3px";

    piece.style.animation =
      `confettiFall ${
        1.8 +
        Math.random() * 2
      }s linear forwards`;

    piece.style.animationDelay =
      Math.random() * 0.8 +
      "s";


    container.appendChild(
      piece
    );
  }


  document.body.appendChild(
    container
  );


  setTimeout(() => {

    if (container) {
      container.remove();
    }

  }, 5000);
}


/* =========================================================
   CSS انیمیشن‌های کوچک
   ========================================================= */

function addGameAnimations() {

  if (
    document.getElementById(
      "pattern-game-extra-style"
    )
  ) {
    return;
  }


  const style =
    document.createElement(
      "style"
    );

  style.id =
    "pattern-game-extra-style";


  style.textContent = `

    @keyframes confettiFall {

      0% {
        transform:
          translateY(-30px)
          rotate(0deg);
        opacity: 1;
      }

      100% {
        transform:
          translateY(110vh)
          rotate(720deg);
        opacity: 0;
      }

    }


    @keyframes shake {

      0%, 100% {
        transform:
          translateX(0);
      }

      25% {
        transform:
          translateX(-6px);
      }

      75% {
        transform:
          translateX(6px);
      }

    }


    /* ==============================================
       قسمت تکرار سؤال آخر
       هر ردیف کاملاً افقی و منظم
       ============================================== */

    .combined-repeat-wrapper {
      width: 100%;
      box-sizing: border-box;
      margin-top: 18px;
      padding: 12px;
      background: #ffffff;
      border-radius: 18px;
      overflow-x: auto;
    }


    .combined-repeat-title {
      width: 100%;
      text-align: center;
      font-weight: bold;
      margin-bottom: 14px;
      font-size: 18px;
    }


    .combined-repeat-row {
      width: 100%;
      min-height: 52px;

      display: flex;
      flex-direction: row;

      align-items: center;
      justify-content: center;

      flex-wrap: nowrap;

      gap: 0;

      margin: 8px 0;

      direction: ltr;

      box-sizing: border-box;
    }


    .repeat-row-label {
      flex: 0 0 65px;

      width: 65px;

      text-align: center;

      font-size: 14px;

      font-weight: bold;

      direction: rtl;

      margin-left: 8px;

      box-sizing: border-box;
    }


    .combined-repeat-row
    .repeat-cell,
    .combined-repeat-row
    .pattern-cell {

      flex: 0 0 42px;

      width: 42px;

      min-width: 42px;

      max-width: 42px;

      height: 42px;

      min-height: 42px;

      max-height: 42px;

      box-sizing: border-box;

      border-radius: 0;
    }


    @media (max-width: 600px) {

      .combined-repeat-wrapper {
        padding: 8px;
      }

      .combined-repeat-title {
        font-size: 15px;
      }

      .repeat-row-label {
        flex: 0 0 55px;
        width: 55px;
        font-size: 12px;
      }

      .combined-repeat-row
      .pattern-cell {

        flex: 0 0 34px;

        width: 34px;

        min-width: 34px;

        max-width: 34px;

        height: 34px;

        min-height: 34px;

        max-height: 34px;
      }
    }

  `;


  document.head.appendChild(
    style
  );
}


/* =========================================================
   رویدادهای بازی
   ========================================================= */

function bindEvents() {

  /* شروع */
  if (startBtn) {

    startBtn.addEventListener(
      "click",
      event => {

        event.preventDefault();

        startGame();
      }
    );
  }


  /* قبلی */
  if (prevBtn) {

    prevBtn.addEventListener(
      "click",
      event => {

        event.preventDefault();

        previousStage();
      }
    );
  }


  /* بعدی */
  if (nextBtn) {

    nextBtn.addEventListener(
      "click",
      event => {

        event.preventDefault();

        nextStage();
      }
    );
  }


  /* بررسی */
  if (checkBtn) {

    checkBtn.addEventListener(
      "click",
      event => {

        event.preventDefault();

        checkAnswer();
      }
    );
  }


  /* پاک کردن */
  if (clearBtn) {

    clearBtn.addEventListener(
      "click",
      event => {

        event.preventDefault();

        clearCurrentAnswer();
      }
    );
  }


  /* شروع دوباره */
  if (restartBtn) {

    restartBtn.addEventListener(
      "click",
      event => {

        event.preventDefault();

        restartGame();
      }
    );
  }


  /* Enter */
  if (studentNameInput) {

    studentNameInput.addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
          "Enter"
        ) {

          event.preventDefault();

          startGame();
        }
      }
    );
  }
}


/* =========================================================
   آماده‌سازی اولیه
   ========================================================= */

function initGame() {

  getPageElements();

  addGameAnimations();

  bindEvents();


  if (gameScreen) {
    gameScreen.classList.add(
      "hidden"
    );
  }


  if (finishScreen) {
    finishScreen.classList.add(
      "hidden"
    );
  }


  if (paletteBox) {
    paletteBox.classList.add(
      "hidden"
    );
  }


  if (repeatBox) {
    repeatBox.classList.add(
      "hidden"
    );
  }


  /*
    مرحله شمارنده از همان ابتدا
    مقدار درست داشته باشد.
  */

  if (stageCounter) {

    stageCounter.textContent =
      "مرحله ۱ از ۱۲";
  }
}


/* =========================================================
   اجرای برنامه بعد از آماده‌شدن کامل صفحه
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initGame
  );

} else {

  initGame();
}
