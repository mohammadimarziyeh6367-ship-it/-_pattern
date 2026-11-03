"use strict";

/* بازی الگوی منظم | ریاضی پایه اول */

const $ = id => document.getElementById(id);

const COLORS = {
  red: "#ef5350",
  blue: "#42a5f5",
  green: "#43b96b",
  yellow: "#ffd54f",
  purple: "#ab70df",
  orange: "#ff9f43"
};

const SHAPES = {
  C: { shape: "circle", color: "red", label: "دایره قرمز" },
  S: { shape: "square", color: "blue", label: "مربع آبی" },
  T: { shape: "triangle", color: "green", label: "مثلث سبز" },
  Y: { shape: "star", color: "yellow", label: "ستاره زرد" }
};

const ITEMS = {
  P: { color: "purple", label: "بنفش" },
  O: { color: "orange", label: "نارنجی" },
  G: { color: "green", label: "سبز" },
  R: { color: "red", label: "قرمز" },
  B: { color: "blue", label: "آبی" },
  Y: { color: "yellow", label: "زرد" }
};

const STAGES = [
  {
    id: 1, type: "shape", title: "الگوی دوشکلی",
    instruction: "الگوی اصلی را ادامه بده و یک بار الگوی رئیس را در پایین تکرار کن.",
    pattern: ["C", "S"], columns: 12, fixed: 4, copy: 6,
    palette: ["C", "S"]
  },
  {
    id: 2, type: "color", title: "الگوی سبز و قرمز",
    instruction: "ترتیب مربع‌های سبز و قرمز را ادامه بده.",
    pattern: ["G", "G", "R", "R", "R"], columns: 15, fixed: 8, copy: 10,
    palette: ["G", "R"]
  },
  {
    id: 3, type: "line", title: "الگوی خط‌های رنگی",
    instruction: "رنگ مناسب را انتخاب کن و با مداد روی خانه‌ها بکش تا خط الگو ادامه پیدا کند.",
    pattern: ["R", "B"], columns: 12, fixed: 4, copy: 6,
    palette: ["R", "B"]
  },
  {
    id: 4, type: "diagonal", title: "الگوی خط‌های مورب",
    instruction: "رنگ خط مورب را انتخاب کن و با کشیدن مداد الگو را ادامه بده.",
    pattern: ["Y", "G"], columns: 12, fixed: 4, copy: 4,
    palette: ["Y", "G"]
  },
  {
    id: 5, type: "edgePattern", title: "الگوی مسیر",
    instruction: "با مداد مسیر خط را در خانه‌های خالی ادامه بده.",
    pattern: ["TOP_RIGHT", "BOTTOM", null], columns: 12, fixed: 6, copy: 3,
    palette: []
  },
  {
    id: 6, type: "line", title: "الگوی سه خط زرد",
    instruction: "جای خالی‌ها را با شکل سه‌خط زرد کامل کن.",
    pattern: [null, "YELLOW_U", null, "YELLOW_U"], columns: 16, fixed: 4, copy: 8,
    palette: ["YELLOW_U"]
  },
  {
    id: 7, type: "mouse", title: "موش کوچولو",
    instruction: "شکل ناهماهنگ را پیدا کن تا موش کوچولو آن را بخورد.",
    pattern: ["C", "S"], columns: 10, wrongIndex: 5,
    palette: []
  },
  {
    id: 8, type: "mouse", title: "موش و الگوی سه‌شکلی",
    instruction: "شکلی را که با الگو هماهنگ نیست پیدا کن.",
    pattern: ["T", "S", "C"], columns: 12, wrongIndex: 7,
    palette: []
  },
  {
    id: 9, type: "color", title: "الگوی بنفش و نارنجی",
    instruction: "رنگ‌ها را به ترتیب ادامه بده.",
    pattern: ["P", "O"], columns: 12, fixed: 4, copy: 6,
    palette: ["P", "O"]
  },
  {
    id: 10, type: "color", title: "الگوی رنگی سه‌تایی",
    instruction: "الگوی رنگی را کامل کن.",
    pattern: ["O", "O", "P"], columns: 12, fixed: 6, copy: 6,
    palette: ["O", "P"]
  },
  {
    id: 11, type: "color", title: "سه رنگ زیبا",
    instruction: "ترتیب سه رنگ را حفظ کن.",
    pattern: ["P", "O", "G"], columns: 12, fixed: 6, copy: 6,
    palette: ["P", "O", "G"]
  },
  {
    id: 12, type: "color", title: "الگوی چهاررنگی",
    instruction: "چهار رنگ را به ترتیب درست قرار بده.",
    pattern: ["P", "O", "Y", "G"], columns: 16, fixed: 8, copy: 8,
    palette: ["P", "O", "Y", "G"]
  },
  {
    id: 13, type: "flower", title: "الگوی سه‌ردیفی گل",
    instruction: "خانه‌های خالی را کامل کن؛ خانه‌های سفید باید خالی بمانند.",
    rows: 3, columns: 21, fixedColumns: 8, copy: 6,
    palette: ["G", "R"]
  }
];

let currentStage = 0;
let studentName = "";
let selectedItem = null;
let activeTool = "paint";
let mouseEaten = false;
let answers = {};
let savedStages = {};
let audioContext = null;
let fireworksAnimation = null;

/* صدا */

function playTone(frequency = 440, duration = 0.09) {
  try {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return;

    if (!audioContext) audioContext = new AudioClass();
    if (audioContext.state === "suspended") audioContext.resume();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {}
}

function playCorrectSound() {
  playTone(660, 0.1);
  setTimeout(() => playTone(880, 0.13), 100);
}

function playWrongSound() {
  playTone(220, 0.16);
}

/* وضعیت و ابزارها */

function getStage() {
  return STAGES[currentStage];
}

function answerKey(board, index) {
  return `${board}-${index}`;
}

function getAnswer(board, index) {
  return answers[answerKey(board, index)] ?? null;
}

function setAnswer(board, index, value) {
  const key = answerKey(board, index);
  if (value === null || value === undefined) {
    delete answers[key];
  } else {
    answers[key] = value;
  }
}

function saveStage() {
  savedStages[currentStage] = {
    answers: { ...answers },
    mouseEaten
  };
}

function loadStage() {
  const saved = savedStages[currentStage];
  answers = saved ? { ...saved.answers } : {};
  mouseEaten = saved ? saved.mouseEaten : false;
}

function setFeedback(message = "", type = "") {
  const feedback = $("feedback");
  feedback.textContent = message;
  feedback.className = "feedback";
  if (type) feedback.classList.add(type);
}

/* نمایش شکل‌ها */

function shapeHTML(id) {
  const item = SHAPES[id];
  if (!item) return "";

  if (item.shape === "star") {
    return `<span class="shape star" style="--shape-color:${COLORS[item.color]}">★</span>`;
  }

  return `<span class="shape ${item.shape}" style="--shape-color:${COLORS[item.color]}"></span>`;
}

function colorHTML(id) {
  const item = ITEMS[id];
  if (!item) return "";

  return `<span class="color-dot" style="--dot-color:${COLORS[item.color]}"></span>`;
}

function cellHTML(id, type) {
  if (!id) return "";

  if (type === "shape" || type === "mouse") {
    return shapeHTML(id);
  }

  if (type === "color" || type === "flower") {
    return colorHTML(id);
  }

  if (type === "line" && id === "YELLOW_U") {
    return `
      <i class="edge-mark edge-top" style="--line-color:#ffd54f"></i>
      <i class="edge-mark edge-right" style="--line-color:#ffd54f"></i>
      <i class="edge-mark edge-bottom" style="--line-color:#ffd54f"></i>
    `;
  }

  if (type === "line") {
    const color = ITEMS[id]?.color;
    if (!color) return "";
    return `<i class="line-mark" style="--line-color:${COLORS[color]}"></i>`;
  }

  if (type === "diagonal") {
    const color = ITEMS[id]?.color;
    if (!color) return "";
    const direction = id === "Y" ? "diagonal-down" : "diagonal-up";
    return `<i class="diagonal-mark ${direction}" style="--line-color:${COLORS[color]}"></i>`;
  }

  if (type === "edgePattern") {
    if (id === "TOP_RIGHT") {
      return '<i class="edge-mark edge-top"></i><i class="edge-mark edge-right"></i>';
    }
    if (id === "BOTTOM") {
      return '<i class="edge-mark edge-bottom"></i>';
    }
  }

  return "";
}

/* ساخت خانه */

function createCell(boardName, index, value, fixed, type, extraClass = "") {
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = fixed ? "cell fixed-cell" : "cell answer-cell";

  if (extraClass) cell.classList.add(extraClass);

  cell.innerHTML = cellHTML(value, type);

  if (value) cell.classList.add("has-answer");

  if (fixed) {
    cell.disabled = true;
  } else {
    cell.addEventListener("click", () => handleCellClick(boardName, index));
  }

  return cell;
}

function handleCellClick(boardName, index) {
  const stage = getStage();

  if (stage.type === "mouse") return;

  if (activeTool === "pencil" || activeTool === "erase") return;

  if (!selectedItem) {
    setFeedback("اول یک رنگ یا شکل انتخاب کن.");
    return;
  }

  setAnswer(boardName, index, selectedItem);
  playTone(520, 0.07);
  renderBoards();
}

/* پالت */

function renderPalette() {
  const stage = getStage();
  const palette = $("palette");
  palette.replaceChildren();

  (stage.palette || []).forEach(id => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-item";
    button.innerHTML = cellHTML(id, stage.type);

    button.title =
      SHAPES[id]?.label ||
      ITEMS[id]?.label ||
      "سه خط زرد";

    if (selectedItem === id) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      selectedItem = id;
      activeTool = "paint";
      updateToolButtons();
      renderPalette();
      setFeedback("انتخاب شد.");
      playTone(540);
    });

    palette.appendChild(button);
  });

  const drawingStage = ["line", "diagonal", "edgePattern"].includes(stage.type);

  $("pencilButton").classList.toggle("hidden", !drawingStage);
  $("eraserButton").classList.toggle("hidden", stage.type === "mouse");
  $("clearButton").classList.toggle("hidden", stage.type === "mouse");

  updateToolButtons();
}

function updateToolButtons() {
  $("pencilButton").classList.toggle("active", activeTool === "pencil");
  $("eraserButton").classList.toggle("active", activeTool === "erase");

  $("pencilButton").setAttribute(
    "aria-pressed",
    String(activeTool === "pencil")
  );

  $("eraserButton").setAttribute(
    "aria-pressed",
    String(activeTool === "erase")
  );
}

/* ساخت جدول معمولی */

function expectedValue(stage, index) {
  return stage.pattern[index % stage.pattern.length];
}

function renderRegularBoards(stage) {
  const main = $("mainBoard");
  const copy = $("copyBoard");

  main.replaceChildren();
  copy.replaceChildren();

  main.style.setProperty("--columns", stage.columns);
  copy.style.setProperty("--columns", stage.copy);

  for (let i = 0; i < stage.columns; i++) {
    const fixed = i < stage.fixed;
    const value = fixed
      ? expectedValue(stage, i)
      : getAnswer("main", i);

    main.appendChild(
      createCell("main", i, value, fixed, stage.type)
    );
  }

  /*
    در جدول پایین فقط یک بار الگوی اصلی نمایش داده می‌شود.
    خانه‌های بعد از الگو باید خالی بمانند.
  */
  for (let i = 0; i < stage.copy; i++) {
    const belongsToPattern = i < stage.pattern.length;
    const value = belongsToPattern
      ? getAnswer("copy", i)
      : null;

    copy.appendChild(
      createCell(
        "copy",
        i,
        value,
        false,
        stage.type,
        belongsToPattern ? "" : "expected-blank"
      )
    );
  }

  if (["line", "diagonal", "edgePattern"].includes(stage.type)) {
    setupDrawing(main, "main", stage);
    setupDrawing(copy, "copy", stage);
  }
}

/* جدول گل */

function expectedFlower(row, column) {
  if (row === 0 || row === 2) {
    return column % 2 === 0 ? "G" : null;
  }

  if (column % 4 === 1) return "G";
  if (column % 4 === 3) return "R";

  return null;
}

function renderFlower(stage) {
  const main = $("mainBoard");
  const copy = $("copyBoard");

  main.replaceChildren();
  copy.replaceChildren();

  main.style.setProperty("--columns", stage.columns);
  main.style.gridTemplateRows = "repeat(3, 51px)";

  copy.style.setProperty("--columns", stage.copy);
  copy.style.gridTemplateRows = "repeat(3, 45px)";

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < stage.columns; column++) {
      const index = row * stage.columns + column;
      const fixed = column < stage.fixedColumns;
      const expected = expectedFlower(row, column);
      const value = fixed ? expected : getAnswer("main", index);

      main.appendChild(
        createCell("main", index, value, fixed, "flower")
      );
    }
  }

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < stage.copy; column++) {
      const index = row * stage.copy + column;
      const expected = column < 4
        ? expectedFlower(row, column)
        : null;

      const value = getAnswer("copy", index);

      copy.appendChild(
        createCell(
          "copy",
          index,
          value,
          false,
          "flower",
          expected === null ? "expected-blank" : ""
        )
      );
    }
  }
}

/* ابزار مداد و رسم با انگشت */

function setupDrawing(board, boardName, stage) {
  board.classList.toggle("drawing-mode", activeTool === "pencil" || activeTool === "erase");

  let svg = board.querySelector(".board-svg");

  if (svg) {
    svg.remove();
  }

  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("board-svg");

  const width = board.scrollWidth || board.offsetWidth;
  const height = board.offsetHeight;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");

  if (activeTool === "pencil" || activeTool === "erase") {
    svg.classList.add("active");
  }

  board.appendChild(svg);

  let drawing = false;
  let currentPath = null;

  function pointFromEvent(event) {
    const rect = board.getBoundingClientRect();

    return {
      x: event.clientX - rect.left + board.scrollLeft,
      y: event.clientY - rect.top + board.scrollTop
    };
  }

  function findCell(event) {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const cell = element?.closest(".cell");

    if (!cell || !board.contains(cell)) return -1;

    return [...board.children].indexOf(cell);
  }

  function markCell(index) {
    if (index < 0) return;

    const fixedCount = boardName === "main"
      ? stage.fixed
      : 0;

    if (boardName === "main" && index < fixedCount) return;

    if (boardName === "copy" && index >= stage.pattern.length) return;

    if (activeTool === "erase") {
      setAnswer(boardName, index, null);
    } else {
      const value = stage.pattern[index % stage.pattern.length];
      setAnswer(boardName, index, value);
    }

    const cell = board.children[index];

    if (cell) {
      cell.innerHTML = cellHTML(
        getAnswer(boardName, index),
        stage.type
      );
      cell.classList.toggle("has-answer", !!getAnswer(boardName, index));
    }
  }

  svg.addEventListener("pointerdown", event => {
    if (activeTool !== "pencil" && activeTool !== "erase") return;

    event.preventDefault();
    drawing = true;
    svg.setPointerCapture(event.pointerId);

    const point = pointFromEvent(event);

    currentPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    currentPath.classList.add("student-stroke");
    currentPath.setAttribute("d", `M ${point.x} ${point.y}`);

    if (activeTool === "erase") {
      currentPath.style.stroke = "#ffffff";
      currentPath.style.strokeWidth = "13";
    } else {
      currentPath.style.stroke = "#8c55d4";
    }

    svg.appendChild(currentPath);
    markCell(findCell(event));
  });

  svg.addEventListener("pointermove", event => {
    if (!drawing || !currentPath) return;

    event.preventDefault();

    const point = pointFromEvent(event);
    const oldPath = currentPath.getAttribute("d");

    currentPath.setAttribute(
      "d",
      `${oldPath} L ${point.x} ${point.y}`
    );

    markCell(findCell(event));
  });

  function stopDrawing() {
    drawing = false;
    currentPath = null;
    saveStage();
  }

  svg.addEventListener("pointerup", stopDrawing);
  svg.addEventListener("pointercancel", stopDrawing);
}

/* مرحله موش */

function renderMouseBoard(stage) {
  const main = $("mainBoard");

  main.replaceChildren();
  main.style.setProperty("--columns", stage.columns);

  $("copyLabel").classList.add("hidden");
  $("copyBoard").classList.add("hidden");

  for (let i = 0; i < stage.columns; i++) {
    const wrong = i === stage.wrongIndex;

    const value = wrong
      ? stage.pattern[(i + 1) % stage.pattern.length]
      : expectedValue(stage, i);

    const cell = createCell(
      "main",
      i,
      wrong && mouseEaten ? null : value,
      true,
      "mouse",
      wrong ? "mouse-target" : ""
    );

    if (wrong && !mouseEaten) {
      cell.disabled = false;
      cell.addEventListener("click", animateMouse);
    }

    if (wrong && mouseEaten) {
      cell.innerHTML = '<span class="mouse-emoji">🐭</span>';
      cell.classList.add("mouse-found");
    }

    main.appendChild(cell);
  }
}

function animateMouse(event) {
  const target = event.currentTarget.getBoundingClientRect();
  const mouse = $("dragMouse");

  mouse.classList.remove("hidden");
  mouse.style.left = `${Math.max(5, target.left - 55)}px`;
  mouse.style.top = `${target.top - 8}px`;

  requestAnimationFrame(() => {
    mouse.style.left = `${target.left + target.width / 3}px`;
    mouse.style.top = `${target.top + target.height / 5}px`;
  });

  setTimeout(() => {
    mouseEaten = true;
    mouse.classList.add("hidden");

    renderBoards();
    playCorrectSound();
    saveStage();
    setFeedback("");
  }, 650);
}

/* نمایش همه جدول‌ها */

function renderBoards() {
  const stage = getStage();

  $("boardLabel").textContent = "نام دانش‌آموز: الگو را ادامه بده";
  $("copyLabel").textContent = "یک بار الگوی رئیس را تکرار کن";

  $("copyLabel").classList.remove("hidden");
  $("copyBoard").classList.remove("hidden");

  if (stage.type === "mouse") {
    renderMouseBoard(stage);
    return;
  }

  if (stage.type === "flower") {
    renderFlower(stage);
    return;
  }

  renderRegularBoards(stage);
}

/* بررسی پاسخ‌ها */

function checkRegularBoard(stage, boardName) {
  const count = boardName === "main"
    ? stage.columns
    : stage.copy;

  for (let i = 0; i < count; i++) {
    let expected;

    if (boardName === "main") {
      expected = expectedValue(stage, i);
    } else {
      expected = i < stage.pattern.length
        ? stage.pattern[i]
        : null;
    }

    if ((getAnswer(boardName, i) ?? null) !== (expected ?? null)) {
      return false;
    }
  }

  return true;
}

function checkFlowerBoard(stage, boardName) {
  const columns = boardName === "main"
    ? stage.columns
    : stage.copy;

  const fixedColumns = boardName === "main"
    ? stage.fixedColumns
    : 0;

  for (let row = 0; row < 3; row++) {
    for (let column = fixedColumns; column < columns; column++) {
      const index = row * columns + column;

      const expected = boardName === "copy" && column >= 4
        ? null
        : expectedFlower(row, column);

      if ((getAnswer(boardName, index) ?? null) !== (expected ?? null)) {
        return false;
      }
    }
  }

  return true;
}

function checkAnswers() {
  const stage = getStage();

  if (stage.type === "mouse") {
    if (mouseEaten) {
      saveStage();
      setFeedback("");
      playCorrectSound();
    } else {
      playWrongSound();
      setFeedback("شکل ناهماهنگ را پیدا کن.", "wrong");
    }
    return;
  }

  let correct;

  if (stage.type === "flower") {
    correct =
      checkFlowerBoard(stage, "main") &&
      checkFlowerBoard(stage, "copy");
  } else {
    correct =
      checkRegularBoard(stage, "main") &&
      checkRegularBoard(stage, "copy");
  }

  if (correct) {
    playCorrectSound();
    saveStage();
    setFeedback("", "correct");

    if (currentStage === STAGES.length - 1) {
      showFireworks();
    }
  } else {
    playWrongSound();
    setFeedback("هنوز چند خانه نیاز به اصلاح دارد. دوباره بررسی کن.", "wrong");
  }
}

/* پاک‌کن و پاک‌کردن پاسخ‌ها */

function clearAnswers() {
  answers = {};
  renderBoards();
  setFeedback("پاسخ‌ها پاک شدند.");
}

function togglePencil() {
  activeTool = activeTool === "pencil" ? "paint" : "pencil";
  updateToolButtons();
  renderBoards();
}

function toggleEraser() {
  activeTool = activeTool === "erase" ? "paint" : "erase";
  updateToolButtons();
  renderBoards();
}

/* آتش‌بازی */

function showFireworks() {
  const canvas = $("fireworksCanvas");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;

  context.scale(devicePixelRatio, devicePixelRatio);

  let particles = [];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * .65,
      vx: (Math.random() - .5) * 5,
      vy: Math.random() * -5 - 1,
      life: 70 + Math.random() * 40,
      hue: Math.random() * 360
    });
  }

  let frame = 0;

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += .12;
      particle.life--;

      context.fillStyle = `hsl(${particle.hue},90%,60%)`;
      context.fillRect(particle.x, particle.y, 5, 5);
    });

    particles = particles.filter(particle => particle.life > 0);

    if (particles.length && frame++ < 150) {
      fireworksAnimation = requestAnimationFrame(draw);
    } else {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      showFinish();
    }
  }

  draw();
}

/* پایان بازی */

function showFinish() {
  $("game").classList.add("hidden");
  $("finish").classList.remove("hidden");
  $("finishMessage").textContent = `${studentName}، همهٔ الگوها را کامل کردی!`;
}

/* شروع، جابه‌جایی و خروج */

function renderStage() {
  loadStage();

  const stage = getStage();

  selectedItem = null;
  activeTool = "paint";

  $("stageCounter").textContent =
    `${currentStage + 1} از ${STAGES.length}`;

  $("progressBar").style.width =
    `${((currentStage + 1) / STAGES.length) * 100}%`;

  $("questionTitle").textContent = stage.title;
  $("questionText").textContent = stage.instruction;

  $("prevButton").disabled = currentStage === 0;
  $("nextButton").disabled = currentStage === STAGES.length - 1;

  renderPalette();
  renderBoards();
  setFeedback("");

  window.scrollTo({ top: 0, behavior: "auto" });
}

function startGame() {
  studentName = $("studentName").value.trim() || "دانش‌آموز عزیز";

  currentStage = 0;
  answers = {};
  savedStages = {};
  mouseEaten = false;

  $("studentGreeting").textContent = `سلام ${studentName}`;

  $("welcome").classList.add("hidden");
  $("finish").classList.add("hidden");
  $("game").classList.remove("hidden");

  renderStage();
}

function nextStage() {
  saveStage();

  if (currentStage < STAGES.length - 1) {
    currentStage++;
    renderStage();
  }
}

function previousStage() {
  if (currentStage <= 0) return;

  saveStage();
  currentStage--;
  renderStage();
}

function exitGame() {
  if (!confirm("آیا می‌خواهی از بازی خارج شوی؟")) return;

  $("game").classList.add("hidden");
  $("finish").classList.add("hidden");
  $("welcome").classList.remove("hidden");

  if (fireworksAnimation) {
    cancelAnimationFrame(fireworksAnimation);
  }
}

function restartGame() {
  currentStage = 0;
  studentName = "";
  answers = {};
  savedStages = {};
  mouseEaten = false;
  selectedItem = null;
  activeTool = "paint";

  $("studentName").value = "";

  $("finish").classList.add("hidden");
  $("game").classList.add("hidden");
  $("welcome").classList.remove("hidden");
}

/* اتصال دکمه‌ها */

$("startButton").addEventListener("click", startGame);

$("studentName").addEventListener("keydown", event => {
  if (event.key === "Enter") startGame();
});

$("checkButton").addEventListener("click", checkAnswers);
$("prevButton").addEventListener("click", previousStage);
$("nextButton").addEventListener("click", nextStage);
$("exitButton").addEventListener("click", exitGame);
$("restartButton").addEventListener("click", restartGame);
$("clearButton").addEventListener("click", clearAnswers);
$("pencilButton").addEventListener("click", togglePencil);
$("eraserButton").addEventListener("click", toggleEraser);

/* آماده‌سازی اولیه */

$("welcome").classList.remove("hidden");
$("game").classList.add("hidden");
$("finish").classList.add("hidden");
