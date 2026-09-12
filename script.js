/* =========================================================
   ابزار اصلی
========================================================= */

const $ = id =>
  document.getElementById(id);


/* =========================================================
   شکل‌ها
========================================================= */

const shapes = {

  circle: color =>
    `<span class="shape circle ${color}"></span>`,

  square: color =>
    `<span class="shape square ${color}"></span>`,

  triangle: color =>
    `<span class="shape triangle ${color}"></span>`,

  star: color =>
    `<span class="shape star ${color}">★</span>`,

  heart: color =>
    `<span class="shape heart ${color}">♥</span>`

};


/* =========================================================
   مراحل بازی
========================================================= */

const levels = [

  /* ۱ */
  {
    type: "sample",

    text:
      "به الگو با دقت نگاه کن.",

    pattern: [

      ["circle", "blue"],
      ["circle", "yellow"],
      ["circle", "blue"],
      ["circle", "yellow"],
      ["circle", "blue"],
      ["circle", "yellow"]

    ]

  },


  /* ۲ */
  {
    type: "missing",

    text:
      "الگو را پیدا کن و شکل مناسب را در جای خالی قرار بده.",

    pattern: [

      ["circle", "blue"],
      ["circle", "yellow"],
      ["circle", "blue"],
      ["circle", "yellow"],
      ["circle", "blue"],
      null

    ],

    options: [

      ["circle", "blue"],
      ["circle", "yellow"],
      ["square", "green"]

    ],

    answer: 1

  },


  /* ۳ */
  {
    type: "missing",

    text:
      "الگو را پیدا کن و جای خالی را کامل کن.",

    pattern: [

      ["square", "green"],
      ["triangle", "purple"],
      ["square", "green"],
      ["triangle", "purple"],
      ["square", "green"],
      null

    ],

    options: [

      ["square", "green"],
      ["triangle", "purple"],
      ["circle", "red"]

    ],

    answer: 1

  },


  /* ۴ */
  {
    type: "missing",

    text:
      "الگوی سه‌تایی را پیدا کن و شکل گمشده را قرار بده.",

    pattern: [

      ["circle", "red"],
      ["square", "green"],
      ["triangle", "yellow"],

      ["circle", "red"],
      ["square", "green"],
      ["triangle", "yellow"],

      ["circle", "red"],
      ["square", "green"],
      null

    ],

    options: [

      ["circle", "red"],
      ["triangle", "yellow"],
      ["square", "green"]

    ],

    answer: 1

  },


  /* ۵ */
  {
    type: "missing",

    text:
      "الگوی منظم را پیدا کن و جای خالی را کامل کن.",

    pattern: [

      ["circle", "blue"],
      ["circle", "blue"],
      ["star", "yellow"],

      ["circle", "blue"],
      ["circle", "blue"],
      ["star", "yellow"],

      ["circle", "blue"],
      ["circle", "blue"],
      null

    ],

    options: [

      ["circle", "blue"],
      ["star", "yellow"],
      ["heart", "pink"]

    ],

    answer: 1

  },


  /* ۶ */
  {
    type: "missing",

    text:
      "به دو طرف جای خالی نگاه کن و شکل مناسب را پیدا کن.",

    pattern: [

      ["heart", "pink"],
      ["star", "yellow"],
      ["heart", "pink"],
      null,
      ["heart", "pink"],
      ["star", "yellow"]

    ],

    options: [

      ["heart", "pink"],
      ["star", "yellow"],
      ["circle", "blue"]

    ],

    answer: 1

  },


  /* ۷ */
  {
    type: "reorder",

    text:
      "شکل‌ها را جابه‌جا کن تا الگوی منظم ساخته شود.",

    pieces: [

      ["triangle", "yellow"],
      ["circle", "blue"],
      ["triangle", "yellow"],
      ["circle", "blue"]

    ],

    target: [

      ["circle", "blue"],
      ["triangle", "yellow"],
      ["circle", "blue"],
      ["triangle", "yellow"]

    ]

  },


  /* ۸ */
  {
    type: "reorder",

    text:
      "شکل‌ها را جابه‌جا کن تا الگوی سه‌تایی ساخته شود.",

    pieces: [

      ["square", "yellow"],
      ["circle", "red"],
      ["triangle", "green"],
      ["triangle", "green"],
      ["square", "yellow"],
      ["circle", "red"]

    ],

    target: [

      ["circle", "red"],
      ["square", "yellow"],
      ["triangle", "green"],
      ["circle", "red"],
      ["square", "yellow"],
      ["triangle", "green"]

    ]

  },


  /* ۹ */
  {
    type: "reorder",

    text:
      "شکل‌ها را جابه‌جا کن تا الگو منظم شود.",

    pieces: [

      ["star", "yellow"],
      ["circle", "blue"],
      ["circle", "blue"],
      ["circle", "blue"],
      ["star", "yellow"],
      ["circle", "blue"]

    ],

    target: [

      ["circle", "blue"],
      ["circle", "blue"],
      ["star", "yellow"],
      ["circle", "blue"],
      ["circle", "blue"],
      ["star", "yellow"]

    ]

  },


  /* ۱۰ */
  {
    type: "remove",

    text:
      "کدام شکل اضافی است؟ آن را انتخاب کن.",

    pattern: [

      ["circle", "blue"],
      ["triangle", "yellow"],
      ["circle", "blue"],
      ["triangle", "yellow"],
      ["circle", "blue"],
      ["star", "pink"],
      ["triangle", "yellow"]

    ],

    removeIndex: 5

  },


  /* ۱۱ */
  {
    type: "remove",

    text:
      "کدام شکل اضافی است؟ آن را انتخاب کن تا الگو منظم شود.",

    pattern: [

      ["circle", "red"],
      ["square", "green"],
      ["triangle", "yellow"],
      ["circle", "red"],
      ["heart", "pink"],
      ["square", "green"],
      ["triangle", "yellow"]

    ],

    removeIndex: 4

  },


  /* ۱۲ */
  {
    type: "place",

    text:
      "شکل مناسب را بکش و در هر جای خالی قرار بده.",

    pattern: [

      ["circle", "blue"],
      ["square", "yellow"],
      null,

      ["circle", "blue"],
      ["square", "yellow"],
      null

    ],

    options: [

      ["circle", "blue"],
      ["square", "yellow"],
      ["triangle", "green"]

    ],

    answers: [0, 0]

  },


  /* ۱۳ */
  {
    type: "place",

    text:
      "الگوی سه‌تایی را پیدا کن و جای خالی‌ها را کامل کن.",

    pattern: [

      ["heart", "pink"],
      ["star", "yellow"],
      ["circle", "blue"],
      null,

      ["heart", "pink"],
      ["star", "yellow"],
      ["circle", "blue"],
      null

    ],

    options: [

      ["heart", "pink"],
      ["star", "yellow"],
      ["circle", "blue"]

    ],

    answers: [0, 0]

  }

];


/* =========================================================
   وضعیت
========================================================= */

let level = 0;

let score = 0;

let audioContext = null;

let studentName = "";

let activeDrag = null;


let stageStates =
  levels.map(() => ({

    answered: false,

    correct: false,

    placed: {},

    pieces: null,

    scoreAdded: false

  }));


/* =========================================================
   صدا
========================================================= */

function initAudio() {

  if (!audioContext) {

    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioCtx) {
      return;
    }

    audioContext =
      new AudioCtx();

  }

  if (
    audioContext.state ===
    "suspended"
  ) {

    audioContext
      .resume()
      .catch(() => {});

  }

}


function tone(
  frequency,
  duration,
  type = "sine",
  volume = .07,
  delay = 0
) {

  if (!audioContext) {
    return;
  }

  try {

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type =
      type;

    const now =
      audioContext.currentTime;

    oscillator.frequency
      .setValueAtTime(
        frequency,
        now + delay
      );

    gain.gain.setValueAtTime(
      .0001,
      now + delay
    );

    gain.gain
      .exponentialRampToValueAtTime(
        volume,
        now + delay + .01
      );

    gain.gain
      .exponentialRampToValueAtTime(
        .0001,
        now + delay + duration
      );

    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );

    oscillator.start(
      now + delay
    );

    oscillator.stop(
      now + delay + duration + .03
    );

  } catch (_) {}

}


function playMoveSound() {

  initAudio();

  tone(
    520,
    .07,
    "sine",
    .045
  );

}


function playCorrectSound() {

  initAudio();

  tone(
    660,
    .10,
    "sine",
    .07
  );

  tone(
    880,
    .14,
    "sine",
    .065,
    .09
  );

  tone(
    1040,
    .18,
    "sine",
    .055,
    .19
  );

}


function playWrongSound() {

  initAudio();

  tone(
    180,
    .12,
    "triangle",
    .08
  );

  tone(
    130,
    .18,
    "triangle",
    .065,
    .11
  );

}


function playSuccessFinish() {

  initAudio();

  tone(
    523,
    .10,
    "sine",
    .06
  );

  tone(
    659,
    .10,
    "sine",
    .06,
    .10
  );

  tone(
    784,
    .10,
    "sine",
    .06,
    .20
  );

  tone(
    1047,
    .22,
    "sine",
    .07,
    .30
  );

}


/* =========================================================
   ابزارها
========================================================= */

function samePiece(a, b) {

  return !!a &&
         !!b &&
         a[0] === b[0] &&
         a[1] === b[1];

}


function shapeHTML(piece) {

  if (!piece) {
    return "";
  }

  const type =
    piece[0];

  const color =
    piece[1];

  return shapes[type]
    ? shapes[type](color)
    : "";

}


function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.remove(
        "active"
      );

    });

  $(id).classList.add(
    "active"
  );

}


/* =========================================================
   شروع بازی
========================================================= */

function startGame() {

  initAudio();

  const input =
    $("studentName");

  const name =
    input.value.trim();

  if (!name) {

    input.focus();

    input.style.borderColor =
      "#ef6262";

    input.placeholder =
      "اول نامت را بنویس 🌸";

    return;

  }

  input.style.borderColor =
    "#55c875";

  studentName =
    name;

  level = 0;

  score = 0;

  stageStates =
    levels.map(() => ({

      answered: false,

      correct: false,

      placed: {},

      pieces: null,

      scoreAdded: false

    }));

  showScreen("game");

  renderLevel();

}


/* =========================================================
   رندر مرحله
========================================================= */

function renderLevel() {

  const data =
    levels[level];

  $("levelLabel").textContent =
    `مرحله ${level + 1} از ${levels.length}`;

  $("scoreLabel").textContent =
    `امتیاز: ${score}`;

  $("progressBar").style.width =
    `${((level + 1) / levels.length) * 100}%`;

  $("questionText").textContent =
    data.text;

  $("feedback").textContent =
    "";

  $("feedback").className =
    "feedback";

  $("patternArea").innerHTML =
    "";

  $("choices").innerHTML =
    "";

  $("choicesTitle")
    .classList.add("hidden");

  updateNavigation();


  if (
    data.type === "sample"
  ) {

    renderSample(data);

  } else if (
    data.type === "missing"
  ) {

    renderMissing(data);

  } else if (
    data.type === "reorder"
  ) {

    renderReorder(data);

  } else if (
    data.type === "remove"
  ) {

    renderRemove(data);

  } else if (
    data.type === "place"
  ) {

    renderPlace(data);

  }

}


/* =========================================================
   نمونه
========================================================= */

function renderSample(data) {

  $("typeBadge").textContent =
    "نمونه";

  $("instruction").textContent =
    "به تکرار شکل‌ها دقت کن.";

  const row =
    document.createElement("div");

  row.className =
    "pattern-row";

  data.pattern.forEach(
    piece => {

      const slot =
        document.createElement("div");

      slot.className =
        "slot";

      slot.innerHTML =
        shapeHTML(piece);

      row.appendChild(
        slot
      );

    }
  );

  $("patternArea")
    .appendChild(row);


  const button =
    document.createElement("button");

  button.className =
    "primary-btn";

  button.textContent =
    "مرحله بعد ➜";

  button.style.marginTop =
    "10px";

  button.onclick =
    nextLevel;

  $("choices")
    .appendChild(button);

}


/* =========================================================
   ساخت الگو
========================================================= */

function buildPatternRow(
  pattern,
  missingIndexes = []
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

      if (
        missingIndexes.includes(index)
      ) {

        slot.classList.add(
          "missing",
          "drop-target"
        );

        slot.textContent =
          "?";

      } else {

        slot.innerHTML =
          shapeHTML(piece);

      }

      row.appendChild(
        slot
      );

    }
  );

  return row;

}


/* =========================================================
   مرحله جای خالی
========================================================= */

function renderMissing(data) {

  $("typeBadge").textContent =
    "جای خالی";

  $("instruction").textContent =
    "شکل مناسب را بکش و در جای خالی قرار بده.";

  const missingIndex =
    data.pattern.findIndex(
      item => item === null
    );

  const row =
    buildPatternRow(
      data.pattern,
      [missingIndex]
    );

  $("patternArea")
    .appendChild(row);

  $("choicesTitle")
    .classList.remove("hidden");

  renderChoices(
    data.options,
    missingIndex,
    false
  );

  restoreMissingState(
    data,
    missingIndex
  );

}


/* =========================================================
   گزینه‌ها
========================================================= */

function renderChoices(
  options,
  targetIndex,
  multi
) {

  $("choices").innerHTML =
    "";

  options.forEach(
    (piece, optionIndex) => {

      const choice =
        document.createElement("div");

      choice.className =
        "choice draggable";

      choice.dataset.optionIndex =
        optionIndex;

      choice.innerHTML =
        shapeHTML(piece);

      attachDrag(
        choice,
        piece,
        targetIndex,
        optionIndex,
        multi
      );

      $("choices")
        .appendChild(choice);

    }
  );

}


/* =========================================================
   Drag
========================================================= */

function attachDrag(
  element,
  piece,
  targetIndex,
  optionIndex,
  multi
) {

  element.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      initAudio();

      activeDrag = {

        element,

        piece,

        targetIndex,

        optionIndex,

        multi

      };

      element.classList.add(
        "dragging"
      );

      playMoveSound();

    }
  );


  element.addEventListener(
    "pointermove",
    event => {

      if (
        !activeDrag ||
        activeDrag.element !== element
      ) {

        return;

      }

      const target =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );

      document
        .querySelectorAll(
          ".drop-target"
        )
        .forEach(slot =>
          slot.classList.remove(
            "over"
          )
        );

      const slot =
        target?.closest(
          ".drop-target"
        );

      if (slot) {

        slot.classList.add(
          "over"
        );

      }

    }
  );


  element.addEventListener(
    "pointerup",
    event => {

      if (
        !activeDrag ||
        activeDrag.element !== element
      ) {

        return;

      }

      event.preventDefault();

      const target =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );

      const slot =
        target?.closest(
          ".drop-target"
        );

      element.classList.remove(
        "dragging"
      );

      document
        .querySelectorAll(
          ".drop-target"
        )
        .forEach(slot =>
          slot.classList.remove(
            "over"
          )
        );

      const drag =
        activeDrag;

      activeDrag =
        null;

      if (slot) {

        handleDrop(
          drag,
          slot
        );

      }

    }
  );


  element.addEventListener(
    "pointercancel",
    () => {

      element.classList.remove(
        "dragging"
      );

      activeDrag =
        null;

    }
  );

}


/* =========================================================
   پاسخ Drag
========================================================= */

function handleDrop(
  drag,
  slot
) {

  const data =
    levels[level];


  /* جای خالی */

  if (
    data.type === "missing"
  ) {

    const correct =
      drag.optionIndex ===
      data.answer;

    if (correct) {

      slot.innerHTML =
        shapeHTML(
          drag.piece
        );

      slot.classList.remove(
        "missing"
      );

      slot.classList.add(
        "correct",
        "success-animation"
      );

      stageStates[level]
        .answered = true;

      stageStates[level]
        .correct = true;

      if (
        !stageStates[level]
          .scoreAdded
      ) {

        score++;

        stageStates[level]
          .scoreAdded = true;

        updateScore();

      }

      showFeedback(
        "ok",
        "آفرین! پاسخ درست است 🌟"
      );

      playCorrectSound();

    } else {

      wrongSlot(
        slot,
        "پاسخ نادرست است؛ دوباره تلاش کن."
      );

    }

    return;

  }


  /* چند جای خالی */

  if (
    data.type === "place"
  ) {

    const patternIndex =
      Number(
        slot.dataset.index
      );

    const missingIndexes =
      data.pattern
        .map(
          (piece,index) =>
            piece === null
              ? index
              : -1
        )
        .filter(
          index => index !== -1
        );

    const answerPosition =
      missingIndexes.indexOf(
        patternIndex
      );

    if (
      answerPosition < 0
    ) {
      return;
    }

    const correctOption =
      data.answers[
        answerPosition
      ];

    if (
      drag.optionIndex ===
      correctOption
    ) {

      slot.innerHTML =
        shapeHTML(
          drag.piece
        );

      slot.classList.remove(
        "missing"
      );

      slot.classList.add(
        "correct",
        "success-animation"
      );

      stageStates[level]
        .placed[patternIndex] =
        true;

      playCorrectSound();

      const complete =
        missingIndexes.every(
          index =>
            stageStates[level]
              .placed[index]
        );

      if (complete) {

        stageStates[level]
          .answered = true;

        stageStates[level]
          .correct = true;

        if (
          !stageStates[level]
            .scoreAdded
        ) {

          score++;

          stageStates[level]
            .scoreAdded = true;

          updateScore();

        }

        showFeedback(
          "ok",
          "آفرین! همهٔ جای خالی‌ها درست کامل شدند 🌟"
        );

      } else {

        showFeedback(
          "ok",
          "آفرین! این شکل درست بود 👏"
        );

      }

    } else {

      wrongSlot(
        slot,
        "این شکل درست نیست؛ دوباره نگاه کن."
      );

    }

  }

}


/* =========================================================
   پاسخ اشتباه
========================================================= */

function wrongSlot(
  slot,
  message
) {

  slot.classList.add(
    "wrong"
  );

  showFeedback(
    "no",
    message
  );

  playWrongSound();

  setTimeout(
    () => {

      slot.classList.remove(
        "wrong"
      );

    },
    400
  );

}


/* =========================================================
   بازگردانی جای خالی
========================================================= */

function restoreMissingState(
  data,
  index
) {

  if (
    !stageStates[level]
      .answered
  ) {

    return;

  }

  const slot =
    document.querySelector(
      `.drop-target[data-index="${index}"]`
    );

  if (!slot) {
    return;
  }

  slot.innerHTML =
    shapeHTML(
      data.options[
        data.answer
      ]
    );

  slot.classList.remove(
    "missing"
  );

  slot.classList.add(
    "correct"
  );

  showFeedback(
    "ok",
    "این مرحله را درست حل کرده‌ای 🌟"
  );

}


/* =========================================================
   جابه‌جایی
========================================================= */

function renderReorder(data) {

  $("typeBadge").textContent =
    "جابه‌جایی";

  $("instruction").textContent =
    "هر شکل را بکش و روی جای شکل دیگر قرار بده.";

  const state =
    stageStates[level];

  if (!state.pieces) {

    state.pieces =
      data.pieces.map(
        piece => [...piece]
      );

  }

  const row =
    document.createElement("div");

  row.className =
    "pattern-row";

  state.pieces.forEach(
    (piece,index) => {

      const slot =
        document.createElement("div");

      slot.className =
        "slot drop-target";

      slot.dataset.index =
        index;

      slot.innerHTML =
        shapeHTML(piece);

      row.appendChild(
        slot
      );

    }
  );

  $("patternArea")
    .appendChild(row);


  row
    .querySelectorAll(".slot")
    .forEach(
      (slot,index) =>
        attachReorderDrag(
          slot,
          index
        )
    );


  if (
    state.correct
  ) {

    showFeedback(
      "ok",
      "آفرین! الگو درست ساخته شده است 🌟"
    );

  }

}


function attachReorderDrag(
  slot,
  index
) {

  slot.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      initAudio();

      activeDrag = {

        element: slot,

        reorder: true,

        index

      };

      slot.classList.add(
        "dragging"
      );

      playMoveSound();

    }
  );


  slot.addEventListener(
    "pointermove",
    event => {

      if (
        !activeDrag ||
        !activeDrag.reorder ||
        activeDrag.element !== slot
      ) {

        return;

      }

      const target =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );

      document
        .querySelectorAll(
          ".drop-target"
        )
        .forEach(
          item =>
            item.classList.remove(
              "over"
            )
        );

      const destination =
        target?.closest(
          ".drop-target"
        );

      if (
        destination &&
        destination !== slot
      ) {

        destination.classList.add(
          "over"
        );

      }

    }
  );


  slot.addEventListener(
    "pointerup",
    event => {

      if (
        !activeDrag ||
        !activeDrag.reorder ||
        activeDrag.element !== slot
      ) {

        return;

      }

      event.preventDefault();

      const target =
        document.elementFromPoint(
          event.clientX,
          event.clientY
        );

      const destination =
        target?.closest(
          ".drop-target"
        );

      const from =
        activeDrag.index;

      slot.classList.remove(
        "dragging"
      );

      document
        .querySelectorAll(
          ".drop-target"
        )
        .forEach(
          item =>
            item.classList.remove(
              "over"
            )
        );

      activeDrag =
        null;

      if (
        !destination ||
        destination === slot
      ) {

        return;

      }

      const to =
        Number(
          destination.dataset.index
        );

      const state =
        stageStates[level];

      [
        state.pieces[from],
        state.pieces[to]
      ] =
      [
        state.pieces[to],
        state.pieces[from]
      ];

      playMoveSound();

      renderLevel();

      checkReorder();

    }
  );

}


function checkReorder() {

  const data =
    levels[level];

  const state =
    stageStates[level];

  const correct =
    data.target.every(
      (piece,index) =>
        samePiece(
          piece,
          state.pieces[index]
        )
    );

  if (correct) {

    state.answered =
      true;

    state.correct =
      true;

    if (
      !state.scoreAdded
    ) {

      score++;

      state.scoreAdded =
        true;

      updateScore();

    }

    showFeedback(
      "ok",
      "آفرین! الگو را درست ساختی 🌟"
    );

    playCorrectSound();

  } else {

    state.correct =
      false;

    showFeedback(
      "no",
      "هنوز الگو کامل نشده است؛ دوباره تلاش کن."
    );

  }

}


/* =========================================================
   حذف شکل اضافی
========================================================= */

function renderRemove(data) {

  $("typeBadge").textContent =
    "شکل اضافی";

  $("instruction").textContent =
    "شکل اضافی را لمس کن.";

  const row =
    document.createElement("div");

  row.className =
    "pattern-row";

  data.pattern.forEach(
    (piece,index) => {

      const slot =
        document.createElement("div");

      slot.className =
        "slot";

      slot.innerHTML =
        shapeHTML(piece);

      slot.addEventListener(
        "click",
        () => {

          initAudio();

          if (
            index ===
            data.removeIndex
          ) {

            slot.classList.add(
              "correct",
              "success-animation"
            );

            if (
              !stageStates[level]
                .scoreAdded
            ) {

              score++;

              stageStates[level]
                .scoreAdded = true;

              updateScore();

            }

            stageStates[level]
              .answered = true;

            stageStates[level]
              .correct = true;

            showFeedback(
              "ok",
              "آفرین! شکل اضافی را پیدا کردی 🌟"
            );

            playCorrectSound();

          } else {

            wrongSlot(
              slot,
              "این شکل اضافی نیست؛ دوباره نگاه کن."
            );

          }

        }
      );

      row.appendChild(
        slot
      );

    }
  );

  $("patternArea")
    .appendChild(row);


  if (
    stageStates[level]
      .correct
  ) {

    row.children[
      data.removeIndex
    ].classList.add(
      "correct"
    );

  }

}


/* =========================================================
   چند جای خالی
========================================================= */

function renderPlace(data) {

  $("typeBadge").textContent =
    "جای خالی";

  $("instruction").textContent =
    "شکل‌های مناسب را بکش و در جای خالی‌ها قرار بده.";

  const missingIndexes =
    data.pattern
      .map(
        (piece,index) =>
          piece === null
            ? index
            : -1
      )
      .filter(
        index => index !== -1
      );

  const row =
    buildPatternRow(
      data.pattern,
      missingIndexes
    );

  $("patternArea")
    .appendChild(row);

  $("choicesTitle")
    .classList.remove("hidden");

  renderChoices(
    data.options,
    null,
    true
  );


  missingIndexes.forEach(
    index => {

      if (
        stageStates[level]
          .placed[index]
      ) {

        const answerPosition =
          missingIndexes.indexOf(
            index
          );

        const optionIndex =
          data.answers[
            answerPosition
          ];

        const slot =
          document.querySelector(
            `.drop-target[data-index="${index}"]`
          );

        if (slot) {

          slot.innerHTML =
            shapeHTML(
              data.options[
                optionIndex
              ]
            );

          slot.classList.remove(
            "missing"
          );

          slot.classList.add(
            "correct"
          );

        }

      }

    }
  );


  if (
    stageStates[level]
      .correct
  ) {

    showFeedback(
      "ok",
      "این مرحله را درست حل کرده‌ای 🌟"
    );

  }

}


/* =========================================================
   پیام
========================================================= */

function showFeedback(
  type,
  message
) {

  const feedback =
    $("feedback");

  feedback.textContent =
    message;

  feedback.className =
    `feedback ${type}`;

}


/* =========================================================
   امتیاز
========================================================= */

function updateScore() {

  $("scoreLabel").textContent =
    `امتیاز: ${score}`;

}


/* =========================================================
   کنترل‌ها
========================================================= */

function updateNavigation() {

  $("prevBtn").disabled =
    level <= 0;

  $("nextBtn").disabled =
    level >= levels.length - 1;

}


function previousLevel() {

  initAudio();

  if (
    level <= 0
  ) {

    return;

  }

  level--;

  renderLevel();

}


function nextLevel() {

  initAudio();

  if (
    level <
    levels.length - 1
  ) {

    level++;

    renderLevel();

  } else {

    finishGame();

  }

}


function exitGame() {

  initAudio();

  showScreen(
    "cover"
  );

}


function finishGame() {

  $("finalScore").textContent =
    `${studentName} عزیز، امتیاز تو: ${score} از ${levels.length}`;

  $("finishMessage").textContent =
    `آفرین ${studentName} جان! تو الگوها را با دقت پیدا کردی.`;

  showScreen(
    "finish"
  );

  playSuccessFinish();

}


function restartGame() {

  initAudio();

  level = 0;

  score = 0;

  stageStates =
    levels.map(() => ({

      answered: false,

      correct: false,

      placed: {},

      pieces: null,

      scoreAdded: false

    }));

  showScreen(
    "game"
  );

  renderLevel();

}


/* =========================================================
   رویدادها
========================================================= */

$("startBtn")
  .addEventListener(
    "click",
    startGame
  );


$("prevBtn")
  .addEventListener(
    "click",
    previousLevel
  );


$("nextBtn")
  .addEventListener(
    "click",
    nextLevel
  );


$("exitBtn")
  .addEventListener(
    "click",
    exitGame
  );


$("restartBtn")
  .addEventListener(
    "click",
    restartGame
  );


/* Enter برای شروع */

$("studentName")
  .addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        startGame();

      }

    }
  );


/* فعال‌سازی صدا */

document.addEventListener(
  "pointerdown",
  () => {

    initAudio();

  },
  {
    once: true,
    passive: true
  }
);


/* جلوگیری از منوی نگه‌داشتن */

document.addEventListener(
  "contextmenu",
  event => {

    if (
      event.target.closest(
        ".choice, .slot, .draggable"
      )
    ) {

      event.preventDefault();

    }

  }
);


/* شروع اولیه */

updateNavigation();
