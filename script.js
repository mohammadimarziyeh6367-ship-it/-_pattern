"use strict";

/* =========================================
   الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
========================================= */

const $ = id => document.getElementById(id);

const COLORS = {
  green: "#45bf66",
  red: "#f05262",
  blue: "#4399f2",
  yellow: "#ffd84d",
  white: "#ffffff",
  pink: "#ff82b2",
  purple: "#a77be8"
};

const SHAPES = {
  circle: "دایره",
  square: "مربع",
  triangle: "مثلث",
  diamond: "لوزی"
};

const PALETTE_ITEMS = [
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" },
  { shape: "diamond", color: "yellow" },
  { shape: "circle", color: "green" },
  { shape: "square", color: "red" }
];

const state = {
  stage: 0,
  name: "",
  score: 0,
  completed: new Set(),
  selected: { ...PALETTE_ITEMS[0] },
  eraser: false,
  mouseArmed: false,
  dragging: false,
  dragStage: null,
  audio: null
};

const cloneItem = item => item ? { ...item } : null;

const repeatPattern = (pattern, count) =>
  Array.from({ length: count }, (_, i) =>
    cloneItem(pattern[i % pattern.length])
  );

function sameItem(a, b) {
  return (!a && !b) ||
    !!(a && b && a.shape === b.shape && a.color === b.color);
}

function toPersianNumber(n) {
  return String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function colorItem(color) {
  return { shape: "square", color };
}

/* مرحله اول */

const patternSix = [
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" },
  { shape: "circle", color: "red" },
  { shape: "square", color: "blue" },
  { shape: "triangle", color: "green" }
];

const copyState = {
  top: [],
  bottom: []
};

/* سؤال‌های موش */

function makePatternQuestion(pattern, columns, wrongIndex, wrongItem) {
  const expected = repeatPattern(pattern, columns);
  const cells = expected.map(cloneItem);
  cells[wrongIndex] = cloneItem(wrongItem);

  return {
    columns,
    cells,
    expected,
    wrongIndex,
    wrongItem: cloneItem(wrongItem),
    eaten: false
  };
}

const mouseQuestions = [
  makePatternQuestion(
    [
      { shape: "circle", color: "green" },
      { shape: "square", color: "yellow" },
      { shape: "circle", color: "green" },
      { shape: "square", color: "yellow" }
    ],
    12,
    6,
    { shape: "triangle", color: "red" }
  ),
  makePatternQuestion(
    [
      { shape: "triangle", color: "blue" },
      { shape: "diamond", color: "pink" },
      { shape: "triangle", color: "blue" },
      { shape: "diamond", color: "pink" }
    ],
    12,
    7,
    { shape: "circle", color: "red" }
  )
];

/* جدول سه‌ردیفی */

const greenWhite = Array.from(
  { length: 21 },
  (_, i) => i % 2 === 0 ? "green" : "white"
);

const whiteGreenRed = Array.from(
  { length: 21 },
  (_, i) => ["white", "green", "white", "red"][i % 4]
);

const threeRowExpected = [
  greenWhite,
  whiteGreenRed,
  [...greenWhite]
];

const threeRowsState = {
  top: [],
  bottom: Array(18).fill(null)
};

/* جدول خطی */

const lineState = {
  marks: Array(30).fill(null)
};

function seedLineMarks() {
  lineState.marks = Array(30).fill(null);
  lineState.marks[1] = "red";
  lineState.marks[3] = "red";
  lineState.marks[12] = "blue";
  lineState.marks[14] = "blue";
}

/* مراحل */

const stages = [
  {
    type: "copy",
    title: "الگو را ادامه بده",
    description: "شکل مناسب را انتخاب کن و خانه‌های خالی را کامل کن. سپس الگو را در جدول پایین تکرار کن."
  },
  {
    type: "mouse",
    title: "موش کدام شکل را بخورد؟",
    description: "موش را روی شکلی ببر که نظم الگو را به هم زده است."
  },
  {
    type: "mouse",
    title: "این بار با دقت نگاه کن!",
    description: "شکل اشتباه را پیدا کن تا الگو دوباره منظم شود."
  },
  {
    type: "threeRows",
    title: "الگوی سه‌ردیفی را کامل کن",
    description: "الگوی سه ردیف را ادامه بده و سپس آن را در جدول پایین یک بار تکرار کن."
  },
  {
    type: "lines",
    title: "الگوی خطی را ادامه بده",
    description: "رنگ قرمز یا آبی را انتخاب کن و خط‌ها را در جای درست ادامه بده."
  }
];

/* صدا */

function playTone(frequency = 660, duration = 0.12) {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!state.audio) {
      state.audio = new AudioContextClass();
    }

    if (state.audio.state === "suspended") {
      state.audio.resume();
    }

    const oscillator = state.audio.createOscillator();
    const gain = state.audio.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.12, state.audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      state.audio.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(state.audio.destination);

    oscillator.start();
    oscillator.stop(state.audio.currentTime + duration);
  } catch (error) {
    // بازی بدون صدا هم اجرا می‌شود.
  }
}

function playClick() {
  playTone(520, 0.06);
}

function playSuccess() {
  playTone(660, 0.12);
  setTimeout(() => playTone(830, 0.15), 120);
  setTimeout(() => playTone(990, 0.2), 250);
}

/* آتش‌بازی */

let fireworksParticles = [];
let fireworksFrame = null;

function launchFireworks() {
  const canvas = $("fireworks");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (fireworksFrame) {
    cancelAnimationFrame(fireworksFrame);
  }

  fireworksParticles = [];

  const colors = [
    "#ff4d8d",
    "#ffd84d",
    "#45bf66",
    "#4399f2",
    "#a77be8",
    "#ff944d"
  ];

  for (let burst = 0; burst < 3; burst++) {
    const centerX = window.innerWidth * (0.25 + burst * 0.25);
    const centerY = window.innerHeight * (0.24 + (burst % 2) * 0.15);

    for (let i = 0; i < 38; i++) {
      const angle = (Math.PI * 2 * i) / 38;
      const speed = 1.5 + Math.random() * 3.2;

      fireworksParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 55 + Math.random() * 25,
        size: 2 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    fireworksParticles = fireworksParticles.filter(p => p.life > 0);

    fireworksParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.035;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.life--;

      ctx.globalAlpha = Math.min(1, p.life / 18);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;

    if (fireworksParticles.length > 0) {
      fireworksFrame = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      fireworksFrame = null;
    }
  }

  animate();
}

/* شکل‌ها */

function shapeElement(item) {
  if (!item) return "";

  const color = COLORS[item.color] || COLORS.white;

  if (item.shape === "triangle") {
    return `
      <span class="shape triangle"
        style="color:${color};border-bottom-color:${color}">
      </span>
    `;
  }

  return `
    <span class="shape ${item.shape}"
      style="background:${color}">
    </span>
  `;
}

function cellElement(item, index, boardName = "main") {
  return `
    <div class="cell ${item ? "filled" : "empty-cell"}"
      data-index="${index}"
      data-board="${boardName}"
      role="button"
      aria-label="خانه ${toPersianNumber(index + 1)}">
      ${shapeElement(item)}
    </div>
  `;
}

/* ساخت جدول */

function makeBoard(container, rows, columns, cells, options = {}) {
  container.innerHTML = "";
  container.className =
    `board rows-${rows} ${options.className || ""}`.trim();

  container.style.gridTemplateColumns =
    `repeat(${columns}, minmax(0, 1fr))`;

  for (let i = 0; i < rows * columns; i++) {
    container.insertAdjacentHTML(
      "beforeend",
      cellElement(cells[i] || null, i, options.board || "main")
    );

    const cell = container.lastElementChild;

    if (options.onCell) {
      cell.addEventListener("click", event => {
        event.preventDefault();
        options.onCell(
          i,
          Math.floor(i / columns),
          i % columns,
          cell
        );
      });
    }
  }

  container.dataset.rows = rows;
  container.dataset.columns = columns;
}

/* انتخاب شکل و رنگ */

function renderPalette(items = PALETTE_ITEMS) {
  const palette = $("palette");
  if (!palette) return;

  palette.innerHTML = "";

  items.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-button";

    if (!state.eraser && sameItem(item, state.selected)) {
      button.classList.add("selected");
    }

    button.innerHTML = shapeElement(item);
    button.setAttribute(
      "aria-label",
      `${SHAPES[item.shape]} ${item.color}`
    );

    button.addEventListener("click", () => {
      state.selected = cloneItem(item);
      state.eraser = false;
      renderPalette(items);
      playClick();
    });

    palette.appendChild(button);
  });

  addEraserButton(palette, () => renderPalette(items));
}

function
