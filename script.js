/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   ========================================================= */
const shapes = {
  circle: {
    type: "circle",
    color: "blue",
    label: "دایره آبی"
  },
  square: {
    type: "square",
    color: "yellow",
    label: "مربع زرد"
  },
  triangle: {
    type: "triangle",
    color: "green",
    label: "مثلث سبز"
  },
  star: {
    type: "star",
    color: "yellow",
    label: "ستاره زرد"
  },
  heart: {
    type: "heart",
    color: "pink",
    label: "قلب صورتی"
  }
};
/* =========================================================
   مرحله‌ها
   از ساده به دشوار
   ========================================================= */
const levels = [
  /* ---------------------------------------------------------
     1 ـ نمونه
     --------------------------------------------------------- */
  {
    type: "sample",
    badge: "نمونه",
    question: "اول با هم یک نمونه ببینیم 🌸",
    instruction: "",
    pattern: [
      shapes.circle,
      shapes.square,
      shapes.circle,
      shapes.square,
      shapes.circle,
      shapes.square
    ]
  },
  /* ---------------------------------------------------------
     2 ـ الگوی دو شکلی
     --------------------------------------------------------- */
  {
    type: "missing",
    badge: "جای خالی",
    question: "فکر می‌کنی بعدش چی میاد؟ 🤔",
    instruction: "",
    pattern: [
      shapes.circle,
      shapes.square,
      shapes.circle,
      shapes.square,
      shapes.circle,
      null
    ],
    choices: [
      shapes.circle,
      shapes.square,
      shapes.triangle
    ],
    answer: 1
  },
  /* ---------------------------------------------------------
     3
     --------------------------------------------------------- */
  {
    type: "missing",
    badge: "جای خالی",
    question: "چی باید اینجا باشه؟ 👀",
    instruction: "",
    pattern: [
      shapes.star,
      shapes.circle,
      shapes.star,
      null,
      shapes.star,
      shapes.circle
    ],
    choices: [
      shapes.star,
      shapes.circle,
      shapes.heart
    ],
    answer: 1
  },
  /* ---------------------------------------------------------
     4
     --------------------------------------------------------- */
  {
    type: "missing",
    badge: "جای خالی",
    question: "حالا نوبت توئه! 🌟",
    instruction: "",
    pattern: [
      shapes.square,
      shapes.triangle,
      shapes.square,
      shapes.triangle,
      shapes.square,
      null
    ],
    choices: [
      shapes.circle,
      shapes.triangle,
      shapes.square
    ],
    answer: 1
  },
  /* ---------------------------------------------------------
     5 ـ الگوی سه‌تایی
     --------------------------------------------------------- */
  {
    type: "missing",
    badge: "الگوی سه‌تایی",
    question: "الگو چه می‌گوید؟ 🧩",
    instruction: "",
    pattern: [
      shapes.circle,
      shapes.square,
      shapes.triangle,
      shapes.circle,
      shapes.square,
      null
    ],
    choices: [
      shapes.triangle,
      shapes.circle,
      shapes.square
    ],
    answer: 0
  },
  /* ---------------------------------------------------------
     6
     --------------------------------------------------------- */
  {
    type: "missing",
    badge: "جای خالی",
    question: "یک شکل گم شده! پیداش کن 🔍",
    instruction: "",
    pattern: [
      shapes.star,
      shapes.circle,
      shapes.heart,
      shapes.star,
      null,
      shapes.heart
    ],
    choices: [
      shapes.circle,
      shapes.star,
      shapes.heart
    ],
    answer: 0
  },
  /* ---------------------------------------------------------
     7 ـ مرتب کردن
     --------------------------------------------------------- */
  {
    type: "reorder",
    badge: "مرتب‌سازی",
    question: "این شکل‌ها قاطی شده‌اند! 😄",
    instruction: "",
    pieces: [
      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.star
    ],
    target: [
      shapes.circle,
      shapes.star,
      shapes.circle,
      shapes.star
    ]
  },
  /* ---------------------------------------------------------
     8 ـ AAB
     --------------------------------------------------------- */
  {
    type: "reorder",
    badge: "مرتب‌سازی",
    question: "می‌توانی نظمشان را پیدا کنی؟ 🧠",
    instruction: "",
    pieces: [
      shapes.star,
      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.circle,
      shapes.circle
    ],
    target: [
      shapes.circle,
      shapes.circle,
      shapes.star,
      shapes.circle,
      shapes.circle,
      shapes.star
    ]
  },
  /* ---------------------------------------------------------
     9 ـ ABC
     
     در این مرحله جواب فقط یک ترتیب مشخص نیست.
     هر ۶ ترتیب ممکن، اگر سه‌تایی و منظم تکرار شوند،
     پاسخ درست هستند.
     --------------------------------------------------------- */
  {
    type: "reorder",
    badge: "چالش",
    question: "حالا یکم سخت‌تر! 😉",
    instruction: "",
    pieces: [
      shapes.triangle,
      shapes.circle,
      shapes.square,
      shapes.square,
      shapes.triangle,
      shapes.circle
    ],
    flexiblePattern: true
  },
  /* ---------------------------------------------------------
     10 ـ جای خالی سه‌تایی
     --------------------------------------------------------- */
  {
    type: "missing",
    badge: "چالش",
    question: "با دقت نگاه کن... 👀",
    instruction: "",
    pattern: [
      shapes.circle,
      shapes.square,
      shapes.triangle,
      null,
      shapes.square,
      shapes.triangle
    ],
    choices: [
      shapes.circle,
      shapes.square,
      shapes.heart
    ],
    answer: 0
  },
  /* ---------------------------------------------------------
     11 ـ شکل اضافه
     --------------------------------------------------------- */
  {
    type: "remove",
    badge: "شکل اضافه",
    question: "یک شکل اضافه است! 🔍",
    instruction: "",
    pattern: [
      shapes.circle,
      shapes.star,
      shapes.circle,
      shapes.star,
      shapes.circle,
      shapes.circle,
      shapes.star
    ],
    removeIndex: 5
  },
  /* ---------------------------------------------------------
     12 ـ شکل اضافه در الگوی سه‌تایی
     --------------------------------------------------------- */
  {
    type: "remove",
    badge: "چالش",
    question: "کدام شکل نظم را به‌هم زده؟ 🤔",
    instruction: "",
    pattern: [
      shapes.circle,
      shapes.square,
      shapes.triangle,
      shapes.circle,
      shapes.heart,
      shapes.square,
      shapes.triangle
    ],
    removeIndex: 4
  },
  /* ---------------------------------------------------------
     13 ـ دو جای خالی
     --------------------------------------------------------- */
  {
    type: "place",
    badge: "مرحله نهایی",
    question: "دو شکل گم شده‌اند! 🌟",
    instruction: "",
    pattern: [
      shapes.heart,
      shapes.star,
      shapes.circle,
      null,
      shapes.heart,
      shapes.star,
      shapes.circle,
      null
    ],
    choices: [
      shapes.heart,
      shapes.circle,
      shapes.star
    ],
    answers: [0, 0]
  }
   /* =========================================================
   الگوهای شطرنجی | ریاضی پایه اول
========================================================= */

.grid-pattern-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: 8px 2px 14px;
}

.grid-pattern {
  display: grid;
  gap: clamp(4px, 1vw, 8px);
  width: min(620px, 100%);
  direction: ltr;
}

.grid-cell {
  aspect-ratio: 1 / 1;
  min-width: 0;
  border: 3px solid #eadff4;
  border-radius: 12px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  touch-action: none;
  transition: .18s ease;
}

.grid-cell.missing {
  border: 3px dashed var(--purple);
  background: #faf5ff;
  color: var(--purple);
  font-size: clamp(22px, 5vw, 34px);
  font-weight: 900;
}

.grid-cell.over {
  transform: scale(1.06);
  border-color: var(--purple);
  background: #f3ebff;
}

.grid-cell.correct {
  border-color: var(--green);
  background: #edfff2;
}

.grid-cell.wrong {
  border-color: var(--red);
  background: #fff0f0;
  animation: shake .25s ease;
}

.grid-cell .shape {
  width: 70%;
  height: 70%;
}

@media (max-width: 600px) {

  .grid-pattern-wrap {
    padding-left: 0;
    padding-right: 0;
  }

  .grid-cell {
    border-width: 2px;
    border-radius: 9px;
  }

}
];
/* =========================================================
   وضعیت بازی
   ========================================================= */
let level = 0;
let score = 0;
let studentName = "";
let audioContext = null;
const stageStates = {};
let activeDrag = null;
let activeReorder = null;
/* =========================================================
   عناصر صفحه
   ========================================================= */
const cover =
  document.getElementById("cover");
const game =
  document.getElementById("game");
const finish =
  document.getElementById("finish");
const startBtn =
  document.getElementById("startBtn");
const restartBtn =
  document.getElementById("restartBtn");
const studentNameInput =
  document.getElementById("studentName");
const levelLabel =
  document.getElementById("levelLabel");
const scoreLabel =
  document.getElementById("scoreLabel");
const progressBar =
  document.getElementById("progressBar");
const typeBadge =
  document.getElementById("typeBadge");
const questionText =
  document.getElementById("questionText");
const instruction =
  document.getElementById("instruction");
const patternArea =
  document.getElementById("patternArea");
const choices =
  document.getElementById("choices");
const choicesTitle =
  document.getElementById("choicesTitle");
const feedback =
  document.getElementById("feedback");
const exitBtn =
  document.getElementById("exitBtn");
const prevBtn =
  document.getElementById("prevBtn");
const nextBtn =
  document.getElementById("nextBtn");
const finalScore =
  document.getElementById("finalScore");
const finishMessage =
  document.getElementById("finishMessage");
/* =========================================================
   ابزارهای عمومی
   ========================================================= */
function samePiece(a, b) {
  if (!a || !b) {
    return false;
  }
  return (
    a.type === b.type &&
    a.color === b.color
  );
}
function clonePiece(piece) {
  if (!piece) {
    return null;
  }
  return {
    type: piece.type,
    color: piece.color,
    label: piece.label
  };
}
/* =========================================================
   ساخت شکل
   ========================================================= */
function shapeHTML(piece) {
  if (!piece) {
    return "";
  }
  if (piece.type === "star") {
    return `
      <div class="shape star ${piece.color}">
        ★
      </div>
    `;
  }
  if (piece.type === "heart") {
    return `
      <div class="shape heart ${piece.color}">
        ♥
      </div>
    `;
  }
  if (piece.type === "triangle") {
    return `
      <div class="shape triangle ${piece.color}">
      </div>
    `;
  }
  return `
    <div class="shape ${piece.type} ${piece.color}">
    </div>
  `;
}
/* =========================================================
   نمایش صفحه
   ========================================================= */
function showScreen(screen) {
  [cover, game, finish].forEach(item => {
    item.classList.remove("active");
  });
  screen.classList.add("active");
}
/* =========================================================
   شروع بازی
   ========================================================= */
function startGame() {
  studentName =
    studentNameInput.value.trim();
  if (!studentName) {
    studentNameInput.focus();
    studentNameInput.style.borderColor =
      "#ef6262";
    setTimeout(() => {
      studentNameInput.style.borderColor =
        "";
    }, 900);
    return;
  }
  level = 0;
  score = 0;
  Object.keys(stageStates).forEach(key => {
    delete stageStates[key];
  });
  showScreen(game);
  renderLevel();

}
}
/* =========================================================
   صدای افکت
   فقط افکت ساده
   ========================================================= */
function getAudioContext() {
  if (!audioContext) {
    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;
    if (!AudioCtx) {
      return null;
    }
    audioContext =
      new AudioCtx();
  }
  if (
    audioContext.state ===
    "suspended"
  ) {
    audioContext.resume();
  }
  return audioContext;
}
function playTone(
  frequency,
  duration,
  type = "sine",
  volume = 0.04
) {
  const ctx =
    getAudioContext();
  if (!ctx) {
    return;
  }
  const oscillator =
    ctx.createOscillator();
  const gain =
    ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value =
    frequency;
  gain.gain.setValueAtTime(
    volume,
    ctx.currentTime
  );
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + duration
  );
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(
    ctx.currentTime + duration
  );
}
function correctSound() {
  playTone(
    660,
    0.12,
    "sine",
    0.05
  );
  setTimeout(() => {
    playTone(
      880,
      0.18,
      "sine",
      0.05
    );
  }, 90);
  setTimeout(() => {
    playTone(
      1100,
      0.2,
      "sine",
      0.04
    );
  }, 180);
}
function wrongSound() {
  playTone(
    220,
    0.12,
    "triangle",
    0.035
  );
}
/* =========================================================
   فشفشه‌باران 🎉
   ========================================================= */
function fireworks() {
  const container =
    document.createElement("div");
  container.className =
    "fireworks-layer";
  container.style.position =
    "fixed";
  container.style.inset =
    "0";
  container.style.pointerEvents =
    "none";
  container.style.zIndex =
    "9999";
  container.style.overflow =
    "hidden";
  document.body.appendChild(
    container
  );
  const symbols = [
    "🎉",
    "🎊",
    "✨",
    "⭐",
    "🌟",
    "💜",
    "🌸"
  ];
  for (let i = 0; i < 34; i++) {
    const item =
      document.createElement("div");
    item.textContent =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];
    item.style.position =
      "absolute";
    item.style.left =
      Math.random() * 100 + "%";
    item.style.top =
      (-10 - Math.random() * 20) + "%";
    item.style.fontSize =
      (18 + Math.random() * 18) + "px";
    item.style.transform =
      `rotate(${Math.random() * 360}deg)`;
    item.style.transition =
      "transform 1.4s ease, top 1.4s ease, opacity 1.4s ease";
    item.style.opacity = "1";
    container.appendChild(item);
    requestAnimationFrame(() => {
      item.style.top =
        (70 + Math.random() * 35) + "%";
      item.style.transform =
        `translateX(${
          -80 + Math.random() * 160
        }px)
         rotate(${
          Math.random() * 720
        }deg)`;
      item.style.opacity = "0";
    });
  }
  setTimeout(() => {
    container.remove();
  }, 1800);
}
/* =========================================================
   بازخورد
   ========================================================= */
function showFeedback(
  message,
  good = true
) {
  feedback.textContent =
    message;
  feedback.className =
    "feedback " +
    (good ? "ok" : "no");
  if (good) {
    feedback.classList.add(
      "success-animation"
    );
  }
}
/* =========================================================
   امتیاز
   ========================================================= */
function updateScore() {
  scoreLabel.textContent =
    `امتیاز: ${score}`;
}
/* =========================================================
   نمایش مرحله
   ========================================================= */
function renderLevel() {
  const current =
    levels[level];
  levelLabel.textContent =
    `مرحله ${level + 1} از ${levels.length}`;
  progressBar.style.width =
    `${((level + 1) / levels.length) * 100}%`;
  typeBadge.textContent =
    current.badge || "";
  questionText.textContent =
    current.question || "";
  instruction.textContent =
    current.instruction || "";
  feedback.textContent = "";
  feedback.className =
    "feedback";
  patternArea.innerHTML = "";
  choices.innerHTML = "";
  choicesTitle.classList.add(
    "hidden"
  );
  prevBtn.disabled =
    level === 0;
  nextBtn.disabled =
    false;
  activeDrag = null;
  activeReorder = null;
  if (current.type === "sample") {
    renderSample(current);
  }
  else if (
    current.type === "missing"
  ) {
    renderMissing(current);
  }
  else if (
    current.type === "reorder"
  ) {
    renderReorder(current);
  }
  else if (
    current.type === "remove"
  ) {
    renderRemove(current);
  }
  else if (
    current.type === "place"
  ) {
    renderPlace(current);
  }
   else if (data.type === "grid"
           ) 
   {

  renderGrid(data);

}
  updateScore();
}
/* =========================================================
   ردیف الگو
   ========================================================= */
function buildPatternRow(
  pattern
) {
  const row =
    document.createElement("div");
  row.className =
    "pattern-row";
  pattern.forEach(
    (piece, index) => {
      const slot =
        document.createElement("div");
      slot.className =
        "slot";
      slot.dataset.index =
        index;
      if (piece) {
        slot.innerHTML =
          shapeHTML(piece);
      }
      else {
        slot.classList.add(
          "missing"
        );
        slot.innerHTML = "?";
      }
      row.appendChild(slot);
    }
  );
  return row;
}
/* =========================================================
   نمونه
   ========================================================= */
function renderSample(data) {
  const row =
    buildPatternRow(
      data.pattern
    );
  patternArea.appendChild(
    row
  );
  showFeedback(
    "حالا خودت امتحان کن 🌸",
    true
  );
}
/* =========================================================
   جای خالی
   ========================================================= */
function renderMissing(data) {
  const row =
    buildPatternRow(
      data.pattern
    );
  patternArea.appendChild(
    row
  );
  choicesTitle.classList.remove(
    "hidden"
  );
  renderChoices(data);
  attachMissingDrop(
    row,
    data
  );
}
/* =========================================================
   گزینه‌ها
   ========================================================= */
function renderChoices(data) {
  choices.innerHTML = "";
  data.choices.forEach(
    (piece, index) => {
      const choice =
        document.createElement("div");
      choice.className =
        "choice";
      choice.dataset.index =
        index;
      choice.innerHTML =
        shapeHTML(piece);
      choice.setAttribute(
        "draggable",
        "true"
      );
      choices.appendChild(
        choice
      );
      attachDrag(
        choice,
        data
      );
    }
  );
}
/* =========================================================
   Drag گزینه
   ========================================================= */
function attachDrag(
  choice,
  data
) {
  choice.addEventListener(
    "dragstart",
    event => {
      activeDrag = {
        index: Number(
          choice.dataset.index
        ),
        data
      };
      choice.classList.add(
        "dragging"
      );
    }
  );
  choice.addEventListener(
    "dragend",
    () => {
      choice.classList.remove(
        "dragging"
      );
    }
  );
  /* موبایل */
  choice.addEventListener(
    "pointerdown",
    event => {
      activeDrag = {
        index: Number(
          choice.dataset.index
        ),
        data
      };
      choice.classList.add(
        "dragging"
      );
      choice.setPointerCapture(
        event.pointerId
      );
    }
  );
  choice.addEventListener(
    "pointerup",
    event => {
      choice.classList.remove(
        "dragging"
      );
      const target =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );
      const slot =
        target?.closest(
          ".slot.missing"
        );
      if (slot) {
        handleDrop(
          Number(
            slot.dataset.index
          ),
          data
        );
      }
      activeDrag = null;
    }
  );
}
/* =========================================================
   محل جای خالی
   ========================================================= */
function attachMissingDrop(
  row,
  data
) {
  row.querySelectorAll(
    ".slot.missing"
  ).forEach(slot => {
    slot.addEventListener(
      "dragover",
      event => {
        event.preventDefault();
        slot.classList.add(
          "over"
        );
      }
    );
    slot.addEventListener(
      "dragleave",
      () => {
        slot.classList.remove(
          "over"
        );
      }
    );
    slot.addEventListener(
      "drop",
      event => {
        event.preventDefault();
        slot.classList.remove(
          "over"
        );
        handleDrop(
          Number(
            slot.dataset.index
          ),
          data
        );
      }
    );
  });
}
/* =========================================================
   پاسخ جای خالی
   ========================================================= */
function handleDrop(
  slotIndex,
  data
) {
  if (!activeDrag) {
    return;
  }
  const chosenIndex =
    activeDrag.index;
  if (
    chosenIndex ===
    data.answer
  ) {
    const correctPiece =
      data.choices[
        data.answer
      ];
    const slot =
      patternArea.querySelector(
        `.slot[data-index="${slotIndex}"]`
      );
    if (slot) {
      slot.classList.remove(
        "missing"
      );
      slot.classList.add(
        "correct"
      );
      slot.innerHTML =
        shapeHTML(
          correctPiece
        );
    }
    score += 10;
    updateScore();
    showFeedback(
      "آفرین! درست پیدا کردی 🌟",
      true
    );
    correctSound();
    fireworks();
    disableChoices();
  }
  else {
    wrongSlot();
  }
  activeDrag = null;
}
/* =========================================================
   اشتباه
   ========================================================= */
function wrongSlot() {
  const missing =
    patternArea.querySelector(
      ".slot.missing"
    );
  if (missing) {
    missing.classList.add(
      "wrong"
    );
    setTimeout(() => {
      missing.classList.remove(
        "wrong"
      );
    }, 350);
  }
  showFeedback(
    "یک بار دیگر با دقت نگاه کن 👀",
    false
  );
  wrongSound();
}
/* =========================================================
   غیرفعال کردن گزینه‌ها
   ========================================================= */
function disableChoices() {
  choices
    .querySelectorAll(
      ".choice"
    )
    .forEach(choice => {
      choice.style.pointerEvents =
        "none";
      choice.style.opacity =
        ".55";
    });
}
/* =========================================================
   مرتب‌سازی
   ========================================================= */
function renderReorder(
  data
) {
  const stateKey =
    level;
  if (!stageStates[stateKey]) {
    stageStates[stateKey] = {
      pieces:
        data.pieces.map(
          clonePiece
        ),
      solved: false
    };
  }
  const state =
    stageStates[stateKey];
  const row =
    document.createElement("div");
  row.className =
    "pattern-row";
  state.pieces.forEach(
    (piece, index) => {
      const slot =
        document.createElement("div");
      slot.className =
        "slot reorder-slot";
      slot.dataset.index =
        index;
      slot.innerHTML =
        shapeHTML(piece);
      slot.draggable =
        true;
      row.appendChild(
        slot
      );
    }
  );
  patternArea.appendChild(
    row
  );
  attachReorderDrag(
    row,
    data
  );
}
/* =========================================================
   جابه‌جایی
   ========================================================= */
function attachReorderDrag(
  row,
  data
) {
  row.querySelectorAll(
    ".reorder-slot"
  ).forEach(slot => {
    /* کامپیوتر */
    slot.addEventListener(
      "dragstart",
      () => {
        activeReorder =
          Number(
            slot.dataset.index
          );
        slot.classList.add(
          "dragging"
        );
      }
    );
    slot.addEventListener(
      "dragend",
      () => {
        slot.classList.remove(
          "dragging"
        );
        activeReorder =
          null;
      }
    );
    slot.addEventListener(
      "dragover",
      event => {
        event.preventDefault();
      }
    );
    slot.addEventListener(
      "drop",
      event => {
        event.preventDefault();
        if (
          activeReorder === null ||
          activeReorder ===
          Number(
            slot.dataset.index
          )
        ) {
          return;
        }
        swapReorder(
          activeReorder,
          Number(
            slot.dataset.index
          ),
          data
        );
      }
    );
    /* موبایل */
    slot.addEventListener(
      "pointerdown",
      event => {
        activeReorder =
          Number(
            slot.dataset.index
          );
        slot.setPointerCapture(
          event.pointerId
        );
      }
    );
    slot.addEventListener(
      "pointerup",
      event => {
        const target =
          document.elementFromPoint(
            event.clientX,
            event.clientY
          );
        const targetSlot =
          target?.closest(
            ".reorder-slot"
          );
        if (targetSlot) {
          const targetIndex =
            Number(
              targetSlot.dataset.index
            );
          if (
            activeReorder !== null &&
            activeReorder !==
            targetIndex
          ) {
            swapReorder(
              activeReorder,
              targetIndex,
              data
            );
          }
        }
        activeReorder =
          null;
      }
    );
  });
}
/* =========================================================
   تعویض دو شکل
   ========================================================= */
function swapReorder(
  from,
  to,
  data
) {
  const state =
    stageStates[level];
  const temp =
    state.pieces[from];
  state.pieces[from] =
    state.pieces[to];
  state.pieces[to] =
    temp;
  renderLevelWithoutReset();
  checkReorder(data);
}
/* =========================================================
   رندر مجدد بدون پاک کردن وضعیت
   ========================================================= */
function renderLevelWithoutReset() {
  const current =
    levels[level];
  patternArea.innerHTML = "";
  if (
    current.type ===
    "reorder"
  ) {
    renderReorder(
      current
    );
  }
}
/* =========================================================
   بررسی مرتب‌سازی
   ========================================================= */
function checkReorder(
  data
) {
  const state =
    stageStates[level];
  let correct =
    false;
  /* ---------------------------------------------------------
     مرحله ۹:
     هر ترتیب سه‌تایی منظم با سه شکل متفاوت درست است.
     --------------------------------------------------------- */
  if (
    data.flexiblePattern
  ) {
    const pieces =
      state.pieces;
    if (
      pieces.length === 6
    ) {
      const firstGroup =
        pieces.slice(0, 3);
      const secondGroup =
        pieces.slice(3, 6);
      /* سه شکل اول باید متفاوت باشند */
      const uniqueShapes =
        new Set(
          firstGroup.map(
            piece =>
              `${piece.type}-${piece.color}`
          )
        );
      const threeDifferent =
        uniqueShapes.size === 3;
      /* سه شکل دوم باید همان ترتیب
         سه شکل اول را تکرار کنند */
      const repeated =
        samePiece(
          firstGroup[0],
          secondGroup[0]
        ) &&
        samePiece(
          firstGroup[1],
          secondGroup[1]
        ) &&
        samePiece(
          firstGroup[2],
          secondGroup[2]
        );
      correct =
        threeDifferent &&
        repeated;
    }
  }
  /* ---------------------------------------------------------
     سایر مرحله‌های مرتب‌سازی
     --------------------------------------------------------- */
  else {
    correct =
      Array.isArray(
        data.target
      ) &&
      state.pieces.length ===
        data.target.length &&
      state.pieces.every(
        (piece, index) =>
          samePiece(
            piece,
            data.target[index]
          )
      );
  }
  if (!correct) {
    return;
  }
  if (state.solved) {
    return;
  }
  state.solved =
    true;
  score += 10;
  updateScore();
  showFeedback(
    "عالیه! یک الگوی منظم ساختی 🎉",
    true
  );
  correctSound();
  fireworks();
  patternArea
    .querySelectorAll(
      ".slot"
    )
    .forEach(slot => {
      slot.classList.add(
        "correct"
      );
    });
}
/* =========================================================
   حذف شکل اضافه
   ========================================================= */
function renderRemove(
  data
) {
  const row =
    document.createElement("div");
  row.className =
    "pattern-row";
  data.pattern.forEach(
    (piece, index) => {
      const slot =
        document.createElement("div");
      slot.className =
        "slot";
      slot.dataset.index =
        index;
      slot.innerHTML =
        shapeHTML(piece);
      slot.style.cursor =
        "pointer";
      slot.addEventListener(
        "click",
        () => {
          if (
            stageStates[level]?.solved
          ) {
            return;
          }
          if (
            index ===
            data.removeIndex
          ) {
            stageStates[level] = {
              solved: true
            };
            slot.style.transform =
              "scale(0)";
            slot.style.opacity =
              "0";
            setTimeout(() => {
              slot.remove();
            }, 250);
            score += 10;
            updateScore();
            showFeedback(
              "آفرین! شکل اضافه را پیدا کردی 🎉",
              true
            );
            correctSound();
            fireworks();
          }
          else {
            slot.classList.add(
              "wrong"
            );
            setTimeout(() => {
              slot.classList.remove(
                "wrong"
              );
            }, 350);
            showFeedback(
              "نه، دوباره با دقت نگاه کن 👀",
              false
            );
            wrongSound();
          }
        }
      );
      row.appendChild(
        slot
      );
    }
  );
  patternArea.appendChild(
    row
  );
}
/* =========================================================
   دو جای خالی
   ========================================================= */
function renderPlace(
  data
) {
  const stateKey =
    level;
  if (!stageStates[stateKey]) {
    stageStates[stateKey] = {
      answers: [],
      solved: false
    };
  }
  const state =
    stageStates[stateKey];
  const row =
    buildPatternRow(
      data.pattern
    );
  patternArea.appendChild(
    row
  );
  choicesTitle.classList.remove(
    "hidden"
  );
  choices.innerHTML = "";
  data.choices.forEach(
    (piece, index) => {
      const choice =
        document.createElement("div");
      choice.className =
        "choice";
      choice.dataset.index =
        index;
      choice.innerHTML =
        shapeHTML(piece);
      choice.setAttribute(
        "draggable",
        "true"
      );
      choices.appendChild(
        choice
      );
      attachPlaceChoice(
        choice,
        data
      );
    }
  );
}
/* =========================================================
   انتخاب برای دو جای خالی
   ========================================================= */
function attachPlaceChoice(
  choice,
  data
) {
  /* کامپیوتر */
  choice.addEventListener(
    "dragstart",
    () => {
      activeDrag = {
        index: Number(
          choice.dataset.index
        ),
        data
      };
      choice.classList.add(
        "dragging"
      );
    }
  );
  choice.addEventListener(
    "dragend",
    () => {
      choice.classList.remove(
        "dragging"
      );
    }
  );
  /* موبایل */
  choice.addEventListener(
    "pointerdown",
    event => {
      activeDrag = {
        index: Number(
          choice.dataset.index
        ),
        data
      };
      choice.classList.add(
        "dragging"
      );
      choice.setPointerCapture(
        event.pointerId
      );
    }
  );
  choice.addEventListener(
    "pointerup",
    event => {
      choice.classList.remove(
        "dragging"
      );
      const target =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );
      const slot =
        target?.closest(
          ".slot.missing"
        );
      if (slot) {
        placeAnswer(
          Number(
            slot.dataset.index
          ),
          data
        );
      }
      activeDrag =
        null;
    }
  );
}
/* =========================================================
   دراپ برای دو جای خالی
   ========================================================= */
function placeAnswer(
  slotIndex,
  data
) {
  if (!activeDrag) {
    return;
  }
  const chosen =
    activeDrag.index;
  const state =
    stageStates[level];
  const missingIndexes =
    data.pattern
      .map(
        (piece, index) =>
          piece === null
            ? index
            : -1
      )
      .filter(
        index => index !== -1
      );
  const placeNumber =
    missingIndexes.indexOf(
      slotIndex
    );
  if (
    placeNumber === -1
  ) {
    activeDrag = null;
    return;
  }
  /* اگر این جای خالی قبلاً پر شده،
     دوباره امتیاز نده */
  if (
    state.answers[
      placeNumber
    ] !== undefined
  ) {
    activeDrag = null;
    return;
  }
  const correct =
    data.answers[
      placeNumber
    ];
  if (
    chosen === correct
  ) {
    state.answers[
      placeNumber
    ] = chosen;
    const slot =
      patternArea.querySelector(
        `.slot[data-index="${slotIndex}"]`
      );
    if (slot) {
      slot.classList.remove(
        "missing"
      );
      slot.classList.add(
        "correct"
      );
      slot.innerHTML =
        shapeHTML(
          data.choices[
            chosen
          ]
        );
    }
    correctSound();
    /* بررسی واقعی کامل شدن
       هر دو جای خالی */
    const allCorrect =
      data.answers.every(
        (answer, index) =>
          state.answers[index] ===
          answer
      );
    if (
      allCorrect &&
      !state.solved
    ) {
      state.solved =
        true;
      score += 20;
      updateScore();
      showFeedback(
        "وااای! هر دو شکل را درست پیدا کردی! 🎉🌟",
        true
      );
      correctSound();
      fireworks();
      disableChoices();
    }
    else {
      showFeedback(
        "آفرین! یکی را درست پیدا کردی 🌟",
        true
      );
    }
  }
  else {
    wrongSlot();
  }
  activeDrag = null;
}
/* =========================================================
   دکمه مرحله بعد
   ========================================================= */
function goNext() {
  if (
    level <
    levels.length - 1
  ) {
    level++;
    renderLevel();
  }
  else {
    finishGame();
  }
}
/* =========================================================
   دکمه مرحله قبل
   ========================================================= */
function goPrevious() {
  if (level > 0) {
    level--;
    renderLevel();
  }
}
/* =========================================================
   خروج
   ========================================================= */
function exitGame() {
  showScreen(
    cover
  );
  feedback.textContent =
    "";
  choices.innerHTML =
    "";
  patternArea.innerHTML =
    "";
  activeDrag =
    null;
  activeReorder =
    null;
}
/* =========================================================
   پایان بازی
   ========================================================= */
function finishGame() {
  showScreen(
    finish
  );
  finalScore.textContent =
    `${studentName} عزیز، امتیازت شد: ${score} 🌟`;
  finishMessage.textContent =
    "تو با دقت و فکر کردن، الگوهای منظم را پیدا کردی!";
  fireworks();
}
/* =========================================================
   شروع دوباره
   ========================================================= */
function restartGame() {
  level = 0;
  score = 0;
  Object.keys(
    stageStates
  ).forEach(key => {
    delete stageStates[key];
  });
  activeDrag =
    null;
  activeReorder =
    null;
  showScreen(
    game
  );
  renderLevel();
}
/* =========================================================
   دکمه‌ها
   ========================================================= */
startBtn.addEventListener(
  "click",
  startGame
);
restartBtn.addEventListener(
  "click",
  restartGame
);
exitBtn.addEventListener(
  "click",
  exitGame
);
prevBtn.addEventListener(
  "click",
  goPrevious
);
nextBtn.addEventListener(
  "click",
  goNext
);
/* =========================================================
   ورود با Enter
   ========================================================= */
studentNameInput.addEventListener(
  "keydown",
  event => {
    if (
      event.key ===
      "Enter"
    ) {
      startGame();
    }
  }
);
/* =========================================================
   جلوگیری از رفتار ناخواسته لمس
   ========================================================= */
document.addEventListener(
  "touchmove",
  event => {
    if (
      activeDrag ||
      activeReorder !== null
    ) {
      event.preventDefault();
    }
  },
  {
    passive: false
  }
);
/* =========================================================
   پایان
   ========================================================= */
