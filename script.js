"use strict";

const $ = id => document.getElementById(id);

const COLORS = {
  red: "#e53935",
  blue: "#159ed0",
  green: "#55ad48",
  yellow: "#f4c62f",
  orange: "#e9782c",
  black: "#242424"
};

const PENCILS = [
  ["red", "قرمز"],
  ["blue", "آبی"],
  ["green", "سبز"],
  ["yellow", "زرد"],
  ["orange", "نارنجی"],
  ["black", "مشکی"]
];


/*
هر مرحله یک فعالیت مستقل است.

در جدول اصلی فقط بخش آغازین الگو رنگ شده؛
ادامه آن خالی است.

جدول تکرار از ابتدا کاملاً خالی است.
*/


const STAGES = [

  {
    title: "خط پله‌ای قرمز",
    kind: "line",
    color: "red",
    cols: 14,
    rows: 4,
    fixed: 6,
    copyCols: 8,
    points: [2,3,2,3,2,3,2,3,2]
  },

  {
    title: "خط پله‌ای سبز",
    kind: "line",
    color: "green",
    cols: 14,
    rows: 4,
    fixed: 6,
    copyCols: 8,
    points: [3,2,2,3,3,2,2,3,3]
  },

  {
    title: "خط پله‌ای مشکی",
    kind: "line",
    color: "black",
    cols: 14,
    rows: 4,
    fixed: 6,
    copyCols: 8,
    points: [2,3,3,3,2,2,2,3,3]
  },

  {
    title: "خط پله‌ای زرد",
    kind: "line",
    color: "yellow",
    cols: 14,
    rows: 4,
    fixed: 6,
    copyCols: 8,
    points: [3,2,2,3,3,2,2,3,3]
  },

  {
    title: "گل سبز با مرکز قرمز",
    kind: "cells",
    cols: 12,
    rows: 3,
    fixedCols: 6,
    repeatCols: 3,

    motif: [
      [0,0,"green"],
      [0,2,"green"],
      [1,0,"green"],
      [1,1,"red"],
      [1,2,"green"],
      [2,1,"green"]
    ]
  },

  {
    title: "الگوی سبز پله‌ای",
    kind: "cells",
    cols: 16,
    rows: 3,
    fixedCols: 12,
    repeatCols: 4,

    motif: [
      [0,0,"green"],
      [0,2,"green"],
      [1,1,"green"],
      [1,3,"green"],
      [2,0,"green"],
      [2,2,"green"]
    ]
  },

  {
    title: "الگوی آبی و قرمز",
    kind: "cells",
    cols: 12,
    rows: 2,
    fixedCols: 8,
    repeatCols: 4,

    motif: [
      [0,0,"blue"],
      [0,1,"red"],
      [0,2,"blue"],
      [0,3,"red"],

      [1,0,"red"],
      [1,1,"blue"],
      [1,2,"red"],
      [1,3,"blue"]
    ]
  },

  {
    title: "الگوی آبی، قرمز، سبز و زرد",
    kind: "cells",
    cols: 16,
    rows: 1,
    fixedCols: 8,
    repeatCols: 4,

    motif: [
      [0,0,"blue"],
      [0,1,"red"],
      [0,2,"green"],
      [0,3,"yellow"]
    ]
  }

];


let stageIndex = 0;

let studentName = "";

let selectedColor = "red";

let activeTool = "pencil";

let answers = {};

let savedStages = {};

let audioContext = null;

let fireworksFrame = null;

let celebratedStages = new Set();



function key(board,index) {
  return board + ":" + index;
}


function getAnswer(board,index) {
  return answers[key(board,index)] || null;
}


function setAnswer(board,index,value) {

  if(value) {
    answers[key(board,index)] = value;
  } else {
    delete answers[key(board,index)];
  }

}


function saveStage() {

  savedStages[stageIndex] = {
    answers: {...answers}
  };

}


function loadStage() {

  const saved = savedStages[stageIndex];

  answers = saved ? {...saved.answers} : {};

}



/* صداهای کوتاه بازی */

function sound(freq = 520,duration = .08) {

  try {

    const AC = window.AudioContext || window.webkitAudioContext;

    if(!AC) return;

    audioContext = audioContext || new AC();

    if(audioContext.state === "suspended") {
      audioContext.resume();
    }

    const osc = audioContext.createOscillator();

    const gain = audioContext.createGain();

    osc.frequency.value = freq;

    osc.connect(gain);

    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(
      .08,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      .001,
      audioContext.currentTime + duration
    );

    osc.start();

    osc.stop(
      audioContext.currentTime + duration
    );

  } catch(e) {}

}



/* پیام‌های بازی */

function feedback(message = "",type = "") {

  $("feedback").textContent = message;

  $("feedback").className = "feedback " + type;

}



/* نمایش مدادهای رنگی */

function palette() {

  const root = $("palette");

  root.replaceChildren();

  PENCILS.forEach(([id,label]) => {

    const btn = document.createElement("button");

    btn.type = "button";

    btn.className =
      "pencil-choice" +
      (selectedColor === id ? " selected" : "");

    btn.title = "مداد " + label;

    btn.setAttribute(
      "aria-label",
      "مداد " + label
    );

    btn.innerHTML =
      '<span class="pencil" style="--pencil:' +
      COLORS[id] +
      '"><i></i></span>';

    btn.addEventListener("click",() => {

      selectedColor = id;

      activeTool = "pencil";

      palette();

      sound(540);

      feedback("مداد " + label + " انتخاب شد.");

    });

    root.append(btn);

  });


  $("eraserButton").classList.toggle(
    "hidden",
    STAGES[stageIndex].kind === "line"
  );

  $("eraserButton").classList.toggle(
    "active",
    activeTool === "eraser"
  );

  $("eraserButton").setAttribute(
    "aria-pressed",
    String(activeTool === "eraser")
  );

}



/* ساخت جدول */

function makeBoard(id,cols,rows,small = false,line = false) {

  const root = $(id);

  root.replaceChildren();

  root.style.setProperty("--cols",cols);

  root.style.setProperty("--rows",rows);

  root.classList.toggle("small-board",small);

  root.classList.toggle("line-board",line);

  return root;

}



/* ساخت خانه‌های رنگی */

function makeCell(boardName,index,value,locked = false) {

  const cell = document.createElement("button");

  cell.type = "button";

  cell.className =
    "grid-cell " +
    (locked ? "locked" : "answer-cell");

  if(value) {

    cell.innerHTML =
      '<span class="paint-fill" style="--fill:' +
      COLORS[value] +
      '"></span>';

  }


  if(!locked) {

    cell.addEventListener("click",() => {

      setAnswer(
        boardName,
        index,
        activeTool === "eraser" ? null : selectedColor
      );

      if(activeTool !== "eraser") {
        sound(490);
      } else {
        sound(260,.06);
      }

      renderCurrentBoards();

      saveStage();

    });

  }

  return cell;

}



/* الگوی تکرارشونده */

function motifMap(stage) {

  const map = new Map();

  stage.motif.forEach(([r,c,color]) => {

    map.set(r + ":" + c,color);

  });

  return map;

}



/* ساخت جدول‌های رنگی */

function renderCellStage(stage) {

  const main = makeBoard(
    "mainBoard",
    stage.cols,
    stage.rows
  );

  const copy = makeBoard(
    "copyBoard",
    stage.repeatCols,
    stage.rows,
    true
  );

  const motif = motifMap(stage);

  const fixedPatternWidth = stage.fixedCols;


  for(let r = 0; r < stage.rows; r++) {

    for(let c = 0; c < stage.cols; c++) {

      const index = r * stage.cols + c;

      const locked = c < fixedPatternWidth;

      const expected =
        motif.get(r + ":" + (c % stage.repeatCols)) || null;

      const value = locked
        ? expected
        : getAnswer("main",index);

      main.append(
        makeCell(
          "main",
          index,
          value,
          locked
        )
      );

    }

  }


  // همه خانه‌های جدول تکرار در شروع خالی هستند.

  for(let r = 0; r < stage.rows; r++) {

    for(let c = 0; c < stage.repeatCols; c++) {

      copy.append(
        makeCell(
          "copy",
          r * stage.repeatCols + c,
          getAnswer(
            "copy",
            r * stage.repeatCols + c
          ),
          false
        )
      );

    }

  }

}



/* محاسبه مسیر خط */

function pathY(stage,x) {

  const p = stage.points;

  const period = p.length - 1;

  const wrapped =
    ((x % period) + period) % period;

  const segment = Math.floor(wrapped);

  const fraction = wrapped - segment;

  const a = p[segment];

  const b = p[segment + 1];

  return a + (b - a) * fraction;

}



/* ساخت خانه‌های جدول خطی */

function addGridCells(
  board,
  cols,
  rows,
  lockedColumns = 0
) {

  for(let r = 0; r < rows; r++) {

    for(let c = 0; c < cols; c++) {

      const cell = document.createElement("div");

      cell.className =
        "grid-cell" +
        (c < lockedColumns ? " locked" : "");

      board.append(cell);

    }

  }

}



/* ساخت مرحله‌های خطی */

function renderLineStage(stage) {

  const main = makeBoard(
    "mainBoard",
    stage.cols,
    stage.rows,
    false,
    true
  );

  const copy = makeBoard(
    "copyBoard",
    stage.copyCols,
    stage.rows,
    true,
    true
  );

  addGridCells(
    main,
    stage.cols,
    stage.rows,
    stage.fixed
  );

  addGridCells(
    copy,
    stage.copyCols,
    stage.rows,
    0
  );

  addLineGuide(
    main,
    stage,
    0,
    stage.fixed,
    stage.cols
  );

  setupLineDrawing(
    main,
    "main",
    stage,
    stage.fixed,
    stage.cols - stage.fixed,
    false
  );

  setupLineDrawing(
    copy,
    "copy",
    stage,
    0,
    stage.copyCols,
    true
  );

}



/* ساخت SVG */

function svgElement(name) {

  return document.createElementNS(
    "http://www.w3.org/2000/svg",
    name
  );

}



/* رسم خط راهنما */

function addLineGuide(
  board,
  stage,
  start,
  end,
  totalCols
) {

  const svg = svgElement("svg");

  svg.classList.add(
    "line-svg",
    "line-guide"
  );

  svg.setAttribute(
    "viewBox",
    "0 0 " + totalCols + " " + stage.rows
  );

  svg.setAttribute(
    "preserveAspectRatio",
    "none"
  );

  const points = [];

  for(let x = start; x <= end; x++) {

    points.push(
      x + "," + pathY(stage,x)
    );

  }

  const line = svgElement("polyline");

  line.setAttribute(
    "points",
    points.join(" ")
  );

  line.setAttribute("fill","none");

  line.setAttribute(
    "stroke",
    COLORS[stage.color]
  );

  line.setAttribute(
    "stroke-width",
    ".075"
  );

  line.setAttribute(
    "stroke-linecap",
    "square"
  );

  line.setAttribute(
    "stroke-linejoin",
    "miter"
  );

  svg.append(line);

  board.append(svg);

}



/* رسم با کشیدن انگشت روی جدول */

function setupLineDrawing(
  board,
  boardName,
  stage,
  xOffset,
  drawWidth,
  isCopy
) {

  const svg = svgElement("svg");

  svg.classList.add(
    "line-svg",
    "line-draw"
  );

  svg.setAttribute(
    "viewBox",
    "0 0 " +
    (isCopy ? stage.copyCols : stage.cols) +
    " " +
    stage.rows
  );

  svg.setAttribute(
    "preserveAspectRatio",
    "none"
  );

  board.append(svg);


  let drawing = false;

  let path = null;

  let strokeColor = selectedColor;

  const previous = answers[key(boardName,"line")];

  let visited = new Set(
    previous?.bins || []
  );


  function point(event) {

    const rect = board.getBoundingClientRect();

    const total = isCopy
      ? stage.copyCols
      : stage.cols;

    return {

      x:
        (event.clientX - rect.left) /
        rect.width *
        total,

      y:
        (event.clientY - rect.top) /
        rect.height *
        stage.rows

    };

  }


  let previousLocalX = null;


  function markCoverage(x) {

    const local = Math.max(
      0,
      Math.min(
        drawWidth - .001,
        x - (isCopy ? 0 : xOffset)
      )
    );

    const currentBin = Math.floor(local * 4);

    if(previousLocalX === null) {

      visited.add(currentBin);

    } else {

      const previousBin =
        Math.floor(previousLocalX * 4);

      const low = Math.min(
        previousBin,
        currentBin
      );

      const high = Math.max(
        previousBin,
        currentBin
      );

      for(let bin = low; bin <= high; bin++) {

        visited.add(bin);

      }

    }

    previousLocalX = local;

  }



  svg.addEventListener("pointerdown",event => {

    if(activeTool === "eraser") return;

    event.preventDefault();

    drawing = true;

    strokeColor = selectedColor;

    svg.setPointerCapture(event.pointerId);

    const p = point(event);

    path = svgElement("polyline");

    path.setAttribute("fill","none");

    path.setAttribute(
      "stroke",
      COLORS[strokeColor]
    );

    path.setAttribute(
      "stroke-width",
      ".19"
    );

    path.setAttribute(
      "stroke-linecap",
      "round"
    );

    path.setAttribute(
      "stroke-linejoin",
      "round"
    );

    path.setAttribute(
      "points",
      p.x + "," + p.y
    );

    svg.append(path);

    markCoverage(p.x);

  });



  svg.addEventListener("pointermove",event => {

    if(!drawing || !path) return;

    event.preventDefault();

    const p = point(event);

    path.setAttribute(
      "points",
      path.getAttribute("points") +
      " " +
      p.x +
      "," +
      p.y
    );

    markCoverage(p.x);

  });



  function stop() {

    if(!drawing) return;

    drawing = false;

    path = null;

    const required = Math.ceil(
      drawWidth * 4
    );

    const all = visited.size >= required;

    const answerKey = key(
      boardName,
      "line"
    );

    answers[answerKey] = {

      color: strokeColor,

      bins: [...visited],

      covered: visited.size,

      required: required,

      complete: all

    };

    saveStage();

    sound(460);

  }


  svg.addEventListener("pointerup",stop);

  svg.addEventListener("pointercancel",stop);


  board._lineState = {

    get complete() {
      return !!answers[key(boardName,"line")]?.complete;
    },

    get color() {
      return answers[key(boardName,"line")]?.color || null;
    }

  };

}



/* نمایش جدول مناسب هر مرحله */

function renderCurrentBoards() {

  const stage = STAGES[stageIndex];

  if(stage.kind === "line") {

    renderLineStage(stage);

  } else {

    renderCellStage(stage);

  }

}



/* نمایش مرحله */

function renderStage() {

  loadStage();

  selectedColor = "red";

  activeTool = "pencil";

  const stage = STAGES[stageIndex];


  $("stageCounter").textContent =
    (stageIndex + 1) +
    " از " +
    STAGES.length;


  $("progressBar").style.width =
    ((stageIndex + 1) / STAGES.length * 100) +
    "%";


  $("questionTitle").textContent =
    stage.title;


  $("questionText").textContent =
    stage.kind === "line"

    ? "مداد هم‌رنگ الگو را انتخاب کن و خط را روی خطوط خانه‌ها ادامه بده. سپس همین الگو را یک بار در جدول خالی پایین بکش."

    : "با مدادهای رنگی، الگوی اصلی را کامل کن و یک بار همان الگو را در جدول خالی پایین بساز.";


  $("boardLabel").textContent =
    "الگوی اصلی";


  $("copyLabel").textContent =
    "یک بار الگوی تکرارشونده را در جدول خالی تکرار کن";


  $("prevButton").disabled =
    stageIndex === 0;


  $("nextButton").disabled =
    stageIndex === STAGES.length - 1;


  palette();

  renderCurrentBoards();

  feedback("");

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });

}



/* بررسی پاسخ جدول‌های رنگی */

function checkCellStage(stage) {

  const motif = motifMap(stage);

  for(let r = 0; r < stage.rows; r++) {

    for(
      let c = stage.fixedCols;
      c < stage.cols;
      c++
    ) {

      const expected =
        motif.get(
          r + ":" + (c % stage.repeatCols)
        ) || null;

      if(
        getAnswer(
          "main",
          r * stage.cols + c
        ) !== expected
      ) {

        return false;

      }

    }


    for(
      let c = 0;
      c < stage.repeatCols;
      c++
    ) {

      const expected =
        motif.get(r + ":" + c) || null;

      if(
        getAnswer(
          "copy",
          r * stage.repeatCols + c
        ) !== expected
      ) {

        return false;

      }

    }

  }

  return true;

}



/* بررسی پاسخ جدول‌های خطی */

function checkLineStage(stage) {

  const main = answers[
    key("main","line")
  ];

  const copy = answers[
    key("copy","line")
  ];

  return (
    !!main?.complete &&
    !!copy?.complete &&
    main.color === stage.color &&
    copy.color === stage.color
  );

}



/* بررسی نهایی پاسخ */

function checkAnswers() {

  const stage = STAGES[stageIndex];

  const correct =
    stage.kind === "line"
      ? checkLineStage(stage)
      : checkCellStage(stage);


  if(correct) {

    sound(660);

    setTimeout(() => {
      sound(880,.12);
    },110);

    feedback(
      "آفرین! عالی بود! الگو را درست کامل کردی. 🌟",
      "correct"
    );

    saveStage();


    if(!celebratedStages.has(stageIndex)) {

      celebratedStages.add(stageIndex);

      showFireworks();

    }


    if(stageIndex === STAGES.length - 1) {

      setTimeout(() => {

        $("game").classList.add("hidden");

        $("finish").classList.remove("hidden");

        $("finishMessage").textContent =
          studentName +
          "، همهٔ الگوها را با موفقیت کامل کردی!";

      },2600);

    }

  } else {

    sound(230,.14);

    feedback(
      "هنوز بخشی از الگو کامل نشده یا رنگی درست انتخاب نشده است. دوباره بررسی کن.",
      "wrong"
    );

  }

}



/* پاک کردن پاسخ‌ها */

function clearAnswers() {

  answers = {};

  saveStage();

  renderCurrentBoards();

  feedback(
    "پاسخ‌های این صفحه پاک شدند."
  );

}



/* فعال کردن پاک‌کن */

function toggleEraser() {

  activeTool =
    activeTool === "eraser"
      ? "pencil"
      : "eraser";

  palette();

  feedback(
    activeTool === "eraser"
      ? "پاک‌کن انتخاب شد."
      : "مداد رنگی انتخاب شد."
  );

}



/* رفتن به مرحله بعد */

function nextStage() {

  saveStage();

  if(stageIndex < STAGES.length - 1) {

    stageIndex++;

    renderStage();

  }

}



/* برگشت به مرحله قبل */

function previousStage() {

  saveStage();

  if(stageIndex > 0) {

    stageIndex--;

    renderStage();

  }

}



/* شروع بازی */

function startGame() {

  studentName =
    $("studentName").value.trim() ||
    "دانش‌آموز عزیز";

  stageIndex = 0;

  answers = {};

  savedStages = {};

  celebratedStages.clear();

  $("studentGreeting").textContent =
    "سلام " + studentName;

  $("welcome").classList.add("hidden");

  $("finish").classList.add("hidden");

  $("game").classList.remove("hidden");

  renderStage();

}



/* خروج از بازی */

function exitGame() {

  if(!confirm("از بازی خارج می‌شوی؟")) {
    return;
  }

  $("game").classList.add("hidden");

  $("welcome").classList.remove("hidden");

}



/* فشفشه‌های تشویقی */

function showFireworks() {

  const canvas = $("fireworksCanvas");

  const ctx = canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;

  canvas.width = innerWidth * dpr;

  canvas.height = innerHeight * dpr;

  canvas.style.display = "block";

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );


  const particles = [];

  const colors = [
    "#f3c969",
    "#8fc9b5",
    "#a99bd5",
    "#ef9d91",
    "#8ebbd8",
    "#f0b6cf"
  ];


  const bursts = [

    {
      x: innerWidth * .22,
      y: innerHeight * .28
    },

    {
      x: innerWidth * .50,
      y: innerHeight * .20
    },

    {
      x: innerWidth * .78,
      y: innerHeight * .30
    }

  ];


  bursts.forEach((burst,burstIndex) => {

    for(let i = 0; i < 42; i++) {

      const angle =
        (Math.PI * 2 * i) / 42 +
        (Math.random() - .5) * .12;

      const speed =
        1.5 + Math.random() * 3.1;

      particles.push({

        x: burst.x,

        y: burst.y,

        vx: Math.cos(angle) * speed,

        vy: Math.sin(angle) * speed,

        gravity: .035 + Math.random() * .025,

        life: 65 + Math.random() * 25,

        size: 3 + Math.random() * 3,

        color: colors[
          (i + burstIndex) % colors.length
        ],

        rotation: Math.random() * Math.PI,

        spin: (Math.random() - .5) * .16

      });

    }

  });


  let frame = 0;


  function draw() {

    ctx.clearRect(
      0,
      0,
      innerWidth,
      innerHeight
    );


    particles.forEach(p => {

      if(p.life <= 0) return;

      p.x += p.vx;

      p.y += p.vy;

      p.vy += p.gravity;

      p.rotation += p.spin;

      p.life--;


      ctx.save();

      ctx.globalAlpha =
        Math.min(1,p.life / 22);

      ctx.translate(p.x,p.y);

      ctx.rotate(p.rotation);

      ctx.fillStyle = p.color;

      ctx.fillRect(
        -p.size / 2,
        -p.size / 2,
        p.size,
        p.size * 1.45
      );

      ctx.restore();

    });


    frame++;


    if(frame < 100) {

      fireworksFrame =
        requestAnimationFrame(draw);

    } else {

      ctx.clearRect(
        0,
        0,
        innerWidth,
        innerHeight
      );

      canvas.style.display = "none";

      fireworksFrame = null;

    }

  }


  draw();

}



/* شروع دوباره */

function restartGame() {

  if(fireworksFrame) {

    cancelAnimationFrame(fireworksFrame);

  }

  celebratedStages.clear();

  $("finish").classList.add("hidden");

  $("welcome").classList.remove("hidden");

  $("studentName").value = "";

}



/* اتصال دکمه‌ها */

$("startButton").addEventListener(
  "click",
  startGame
);

$("studentName").addEventListener(
  "keydown",
  e => {
    if(e.key === "Enter") {
      startGame();
    }
  }
);

$("prevButton").addEventListener(
  "click",
  previousStage
);

$("nextButton").addEventListener(
  "click",
  nextStage
);

$("checkButton").addEventListener(
  "click",
  checkAnswers
);

$("clearButton").addEventListener(
  "click",
  clearAnswers
);

$("eraserButton").addEventListener(
  "click",
  toggleEraser
);

$("exitButton").addEventListener(
  "click",
  exitGame
);

$("restartButton").addEventListener(
  "click",
  restartGame
);


$("welcome").classList.remove("hidden");

$("game").classList.add("hidden");

$("finish").classList.add("hidden");
