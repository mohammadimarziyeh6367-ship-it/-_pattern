/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   آموزگار: مرضیه محمدی
   AI based educational content creator: ENG Marziyeh Mohammadi
   ========================================================= */


/* =========================================================
   SHAPES
========================================================= */

const shapes = {

  circle: {
    type: "circle",
    color: "blue",
    symbol: "●",
    label: "دایره"
  },

  square: {
    type: "square",
    color: "yellow",
    symbol: "■",
    label: "مربع"
  },

  triangle: {
    type: "triangle",
    color: "orange",
    symbol: "▲",
    label: "مثلث"
  },

  star: {
    type: "star",
    color: "purple",
    symbol: "★",
    label: "ستاره"
  },

  heart: {
    type: "heart",
    color: "pink",
    symbol: "♥",
    label: "قلب"
  }

};


/* =========================================================
   GAME DATA
========================================================= */

let questions = [

  /* -------------------------------------------------------
     سؤال ۱
     تشخیص و ادامه الگوی سه شکلی
  ------------------------------------------------------- */

  {
    type: "continue",

    title: "الگو را پیدا کن",

    text:
      "به الگو نگاه کن. کدام شکل‌ها باید بعد از آن بیایند؟",

    pattern: [
      "circle",
      "square",
      "triangle",
      "circle",
      "square",
      "triangle",
      "circle"
    ],

    answers: [
      "square",
      "triangle",
      "circle"
    ],

    slots: 3
  },


  /* -------------------------------------------------------
     سؤال ۲
     الگوی دو شکلی
  ------------------------------------------------------- */

  {
    type: "continue",

    title: "الگوی منظم",

    text:
      "الگو را پیدا کن و سه شکل بعدی را ادامه بده.",

    pattern: [
      "circle",
      "square",
      "circle",
      "square",
      "circle"
    ],

    answers: [
      "square",
      "circle",
      "square"
    ],

    slots: 3
  },


  /* -------------------------------------------------------
     سؤال ۳
     الگوی سه شکلی سخت‌تر
  ------------------------------------------------------- */

  {
    type: "continue",

    title: "کمی دقت بیشتر! 👀",

    text:
      "قانون الگو را پیدا کن و جای خالی‌ها را کامل کن.",

    pattern: [
      "circle",
      "circle",
      "triangle",
      "circle",
      "circle",
      "triangle"
    ],

    answers: [
      "circle",
      "circle",
      "triangle"
    ],

    slots: 3
  },


  /* -------------------------------------------------------
     سؤال ۴
     شطرنجی
  ------------------------------------------------------- */

  {
    type: "grid",

    title: "الگوی شطرنجی",

    text:
      "در خانه‌ی خالی چه شکلی باید قرار بگیرد؟",

    grid: [
      "circle",
      "square",
      "circle",
      "square",
      "circle",
      "square",

      "square",
      "circle",
      "square",
      "circle",
      "square",
      "circle",

      "circle",
      "square",
      "circle",
      "missing",
      "circle",
      "square"
    ],

    answer: "square"
  },


  /* -------------------------------------------------------
     سؤال ۵
     شطرنجی سخت‌تر
  ------------------------------------------------------- */

  {
    type: "grid",

    title: "خانه‌های شگفت‌انگیز",

    text:
      "الگو را پیدا کن. شکل درست را در خانه‌ی خالی بگذار.",

    grid: [
      "triangle",
      "circle",
      "square",
      "triangle",
      "circle",
      "square",

      "circle",
      "square",
      "triangle",
      "circle",
      "square",
      "triangle",

      "square",
      "triangle",
      "circle",
      "square",
      "missing",
      "circle"
    ],

    answer: "triangle"
  },


  /* -------------------------------------------------------
     سؤال ۶
     پیدا کردن شکل اضافه
  ------------------------------------------------------- */

  {
    type: "remove",

    title: "شکل مزاحم را پیدا کن",

    text:
      "کدام شکل نظم الگو را بر هم زده است؟ آن را حذف کن.",

    pattern: [
      "circle",
      "square",
      "triangle",
      "circle",
      "square",
      "star",
      "triangle",
      "circle",
      "square",
      "triangle"
    ],

    answer: 5
  },


  /* -------------------------------------------------------
     سؤال ۷
     پیدا کردن شکل اضافه
  ------------------------------------------------------- */

  {
    type: "remove",

    title: "یک شکل اضافه شده! 🔎",

    text:
      "شکل اضافی را پیدا کن و روی آن بزن.",

    pattern: [
      "circle",
      "square",
      "circle",
      "square",
      "heart",
      "circle",
      "square",
      "circle",
      "square"
    ],

    answer: 4
  },


  /* -------------------------------------------------------
     سؤال ۸
     حذف شکل اضافه در الگوی سه‌تایی
  ------------------------------------------------------- */

  {
    type: "remove",

    title: "کارآگاه الگوها 🕵️",

    text:
      "کدام شکل نظم الگو را به هم زده است؟",

    pattern: [
      "triangle",
      "circle",
      "square",
      "triangle",
      "circle",
      "square",
      "triangle",
      "heart",
      "square"
    ],

    answer: 7
  },


  /* -------------------------------------------------------
     سؤال ۹
     ادامه الگوی سخت‌تر
  ------------------------------------------------------- */

  {
    type: "continue",

    title: "حالا کمی سخت‌تر! 🌟",

    text:
      "قانون الگو را پیدا کن و آن را ادامه بده.",

    pattern: [
      "circle",
      "triangle",
      "square",
      "circle",
      "triangle",
      "square",
      "circle"
    ],

    answers: [
      "triangle",
      "square",
      "circle"
    ],

    slots: 3
  },


  /* -------------------------------------------------------
     سؤال ۱۰
     شطرنجی
  ------------------------------------------------------- */

  {
    type: "grid",

    title: "الگوی خانه‌خانه",

    text:
      "کدام شکل جای خانه‌ی خالی قرار می‌گیرد؟",

    grid: [
      "circle",
      "triangle",
      "circle",
      "triangle",
      "circle",
      "triangle",

      "triangle",
      "circle",
      "triangle",
      "circle",
      "triangle",
      "circle",

      "circle",
      "triangle",
      "circle",
      "missing",
      "circle",
      "triangle"
    ],

    answer: "triangle"
  },


  /* -------------------------------------------------------
     سؤال ۱۱
     ادامه الگوی چهار شکلی
  ------------------------------------------------------- */

  {
    type: "continue",

    title: "قهرمان الگوها! 🏆",

    text:
      "این الگو چهار شکلی است. ادامه‌ی آن را پیدا کن.",

    pattern: [
      "circle",
      "square",
      "triangle",
      "star",
      "circle",
      "square",
      "triangle"
    ],

    answers: [
      "star",
      "circle",
      "square"
    ],

    slots: 3
  },


  /* -------------------------------------------------------
     سؤال ۱۲
     حذف شکل اضافه نهایی
  ------------------------------------------------------- */

  {
    type: "remove",

    title: "آخرین مأموریت! 🚀",

    text:
      "شکلی که نظم الگو را بر هم زده پیدا کن و حذفش کن.",

    pattern: [
      "circle",
      "square",
      "triangle",
      "circle",
      "square",
      "triangle",
      "circle",
      "square",
      "heart",
      "triangle"
    ],

    answer: 8
  }

];


/* =========================================================
   VARIABLES
========================================================= */

let currentQuestion = 0;

let score = 0;

let studentName = "";

let answered = [];

let audioContext = null;


/* =========================================================
   ELEMENTS
========================================================= */

const startScreen =
  document.getElementById("startScreen");

const gameScreen =
  document.getElementById("gameScreen");

const endScreen =
  document.getElementById("endScreen");

const studentNameInput =
  document.getElementById("studentName");

const startButton =
  document.getElementById("startButton");

const restartButton =
  document.getElementById("restartButton");

const displayName =
  document.getElementById("displayName");

const scoreElement =
  document.getElementById("score");

const questionNumber =
  document.getElementById("questionNumber");

const totalQuestions =
  document.getElementById("totalQuestions");

const questionType =
  document.getElementById("questionType");

const questionText =
  document.getElementById("questionText");

const questionContent =
  document.getElementById("questionContent");

const message =
  document.getElementById("message");

const prevButton =
  document.getElementById("prevButton");

const nextButton =
  document.getElementById("nextButton");

const finalScore =
  document.getElementById("finalScore");

const finalMessage =
  document.getElementById("finalMessage");


totalQuestions.textContent =
  questions.length;


/* =========================================================
   AUDIO
========================================================= */

function initAudio() {

  if (!audioContext) {

    audioContext =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

  }

}


function playSound(type) {

  try {

    initAudio();

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.connect(gain);

    gain.connect(audioContext.destination);

    const now =
      audioContext.currentTime;


    if (type === "correct") {

      oscillator.frequency.setValueAtTime(
        660,
        now
      );

      oscillator.frequency.setValueAtTime(
        880,
        now + 0.12
      );

      gain.gain.setValueAtTime(
        0.0001,
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        0.18,
        now + 0.02
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.35
      );

    }


    if (type === "wrong") {

      oscillator.frequency.setValueAtTime(
        250,
        now
      );

      oscillator.frequency.setValueAtTime(
        180,
        now + 0.15
      );

      gain.gain.setValueAtTime(
        0.0001,
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        0.15,
        now + 0.02
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.3
      );

    }


    oscillator.start(now);

    oscillator.stop(now + 0.4);

  } catch (error) {

    console.log("Audio error:", error);

  }

}


/* =========================================================
   SPEECH
========================================================= */

function speak(text) {

  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang = "fa-IR";

  utterance.rate = 0.9;

  utterance.pitch = 1.05;

  utterance.volume = 1;

  window.speechSynthesis.speak(
    utterance
  );

}


/* =========================================================
   CREATE SHAPE
========================================================= */

function createShape(
  shapeName,
  extraClass = ""
) {

  const data =
    shapes[shapeName];

  const div =
    document.createElement("div");

  div.className =
    `shape ${data.type} ${data.color} ${extraClass}`;

  div.dataset.shape =
    shapeName;

  div.title =
    data.label;

  div.textContent =
    data.symbol;

  return div;
}


/* =========================================================
   START GAME
========================================================= */

startButton.addEventListener(
  "click",
  startGame
);


function startGame() {

  studentName =
    studentNameInput.value.trim();

  if (!studentName) {

    studentName =
      "قهرمان کوچک";

  }

  displayName.textContent =
    studentName;

  currentQuestion = 0;

  score = 0;

  answered =
    new Array(
      questions.length
    ).fill(null);

  scoreElement.textContent =
    score;

  startScreen.classList.add(
    "hidden"
  );

  endScreen.classList.add(
    "hidden"
  );

  gameScreen.classList.remove(
    "hidden"
  );

  loadQuestion();

}


/* =========================================================
   LOAD QUESTION
========================================================= */

function loadQuestion() {

  const q =
    questions[currentQuestion];

  questionNumber.textContent =
    currentQuestion + 1;

  questionType.textContent =
    q.title;

  questionText.textContent =
    q.text;

  questionContent.innerHTML = "";

  message.innerHTML = "";

  if (q.type === "continue") {

    renderContinueQuestion(q);

  }

  else if (q.type === "grid") {

    renderGridQuestion(q);

  }

  else if (q.type === "remove") {

    renderRemoveQuestion(q);

  }


  prevButton.disabled =
    false;

  nextButton.disabled =
    false;

}


/* =========================================================
   CONTINUE QUESTION
========================================================= */

function renderContinueQuestion(q) {

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "pattern-row";


  q.pattern.forEach(
    shapeName => {

      wrapper.appendChild(
        createShape(shapeName)
      );

    }
  );


  for (
    let i = 0;
    i < q.slots;
    i++
  ) {

    const placeholder =
      document.createElement("div");

    placeholder.className =
      "pattern-placeholder";

    placeholder.textContent =
      "?";

    placeholder.dataset.slot =
      i;

    wrapper.appendChild(
      placeholder
    );

  }


  questionContent.appendChild(
    wrapper
  );


  const options =
    document.createElement("div");

  options.className =
    "options";


  const uniqueAnswers =
    [...new Set(q.answers)];


  uniqueAnswers.forEach(
    shapeName => {

      const optionWrapper =
        document.createElement(
          "div"
        );

      optionWrapper.className =
        "shape-option-wrapper";


      const shape =
        createShape(
          shapeName,
          "option-shape"
        );

      shape.draggable = true;


      shape.addEventListener(
        "dragstart",
        event => {

          event.dataTransfer.setData(
            "shape",
            shapeName
          );

        }
      );


      shape.addEventListener(
        "click",
        () => {

          placeShape(
            shapeName
          );

        }
      );


      const label =
        document.createElement("div");

      label.className =
        "option-label";

      label.textContent =
        shapes[shapeName].label;


      optionWrapper.appendChild(
        shape
      );

      optionWrapper.appendChild(
        label
      );

      options.appendChild(
        optionWrapper
      );

    }
  );


  questionContent.appendChild(
    options
  );


  const placeholders =
    document.querySelectorAll(
      ".pattern-placeholder"
    );


  placeholders.forEach(
    placeholder => {

      placeholder.addEventListener(
        "dragover",
        event => {

          event.preventDefault();

        }
      );


      placeholder.addEventListener(
        "drop",
        event => {

          event.preventDefault();

          const shapeName =
            event.dataTransfer.getData(
              "shape"
            );

          placeShape(
            shapeName
          );

        }
      );

    }
  );

}


/* =========================================================
   PLACE SHAPE
========================================================= */

function placeShape(
  shapeName
) {

  const q =
    questions[currentQuestion];

  const placeholders =
    document.querySelectorAll(
      ".pattern-placeholder"
    );


  let emptyPlaceholder =
    [...placeholders]
      .find(
        p =>
          !p.dataset.filled
      );


  if (!emptyPlaceholder) {

    return;

  }


  const slotIndex =
    Number(
      emptyPlaceholder.dataset.slot
    );


  emptyPlaceholder.innerHTML =
    "";


  const shape =
    createShape(
      shapeName
    );


  emptyPlaceholder.appendChild(
    shape
  );

  emptyPlaceholder.dataset.filled =
    shapeName;


  if (!answered[currentQuestion]) {

    answered[currentQuestion] = {

      selected: []

    };

  }


  answered[currentQuestion]
    .selected[slotIndex] =
      shapeName;


  checkContinueAnswer();

}


/* =========================================================
   CHECK CONTINUE
========================================================= */

function checkContinueAnswer() {

  const q =
    questions[currentQuestion];

  const state =
    answered[currentQuestion];


  if (
    !state ||
    !state.selected
  ) {

    return;

  }


  if (
    state.selected.length <
    q.answers.length
  ) {

    return;

  }


  const correct =
    q.answers.every(
      (answer, index) =>
        state.selected[index] ===
        answer
    );


  if (correct) {

    markCorrect();

  } else {

    markWrong();

  }

}


/* =========================================================
   GRID QUESTION
========================================================= */

function renderGridQuestion(q) {

  const board =
    document.createElement("div");

  board.className =
    "checkerboard";


  q.grid.forEach(
    (shapeName, index) => {

      const cell =
        document.createElement("div");

      cell.className =
        "checker-cell";


      if (
        shapeName === "missing"
      ) {

        cell.classList.add(
          "missing"
        );

        cell.textContent =
          "?";

        cell.addEventListener(
          "click",
          () => {

            showGridOptions(
              cell,
              q
            );

          }
        );

      } else {

        const shape =
          createShape(shapeName);

        cell.appendChild(
          shape
        );

      }


      board.appendChild(
        cell
      );

    }
  );


  questionContent.appendChild(
    board
  );


  showGridOptions(
    null,
    q
  );

}


/* =========================================================
   GRID OPTIONS
========================================================= */

function showGridOptions(
  cell,
  q
) {

  let oldOptions =
    document.querySelector(
      ".grid-options"
    );

  if (oldOptions) {

    oldOptions.remove();

  }


  const options =
    document.createElement(
      "div"
    );

  options.className =
    "options grid-options";


  const choices = [
    "circle",
    "square",
    "triangle"
  ];


  choices.forEach(
    shapeName => {

      const shape =
        createShape(
          shapeName,
          "option-shape"
        );


      shape.addEventListener(
        "click",
        () => {

          if (!cell) {

            const missingCell =
              document.querySelector(
                ".checker-cell.missing"
              );

            if (missingCell) {

              placeGridShape(
                missingCell,
                shapeName,
                q
              );

            }

          } else {

            placeGridShape(
              cell,
              shapeName,
              q
            );

          }

        }
      );


      options.appendChild(
        shape
      );

    }
  );


  questionContent.appendChild(
    options
  );

}


/* =========================================================
   PLACE GRID SHAPE
========================================================= */

function placeGridShape(
  cell,
  shapeName,
  q
) {

  cell.innerHTML = "";

  const shape =
    createShape(
      shapeName
    );

  cell.appendChild(
    shape
  );


  if (
    shapeName ===
    q.answer
  ) {

    cell.classList.remove(
      "missing"
    );

    answered[currentQuestion] =
      true;

    markCorrect();

  } else {

    answered[currentQuestion] =
      false;

    markWrong();

  }

}


/* =========================================================
   REMOVE QUESTION
========================================================= */

function renderRemoveQuestion(q) {

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "remove-pattern";


  q.pattern.forEach(
    (shapeName, index) => {

      const shape =
        createShape(
          shapeName,
          "removable-shape"
        );

      shape.dataset.index =
        index;


      shape.addEventListener(
        "click",
        () => {

          selectWrongShape(
            index,
            shape
          );

        }
      );


      wrapper.appendChild(
        shape
      );

    }
  );


  questionContent.appendChild(
    wrapper
  );

}


/* =========================================================
   SELECT WRONG SHAPE
========================================================= */

function selectWrongShape(
  index,
  element
) {

  const q =
    questions[currentQuestion];


  if (
    answered[currentQuestion] ===
    true
  ) {

    return;

  }


  if (
    index === q.answer
  ) {

    element.style.opacity =
      "0";

    element.style.transform =
      "scale(0)";


    answered[currentQuestion] =
      true;


    markCorrect();


  } else {

    element.classList.add(
      "selected"
    );

    markWrong();

  }

}


/* =========================================================
   CORRECT
========================================================= */

function markCorrect() {

  if (
    answered[currentQuestion] ===
    "completed"
  ) {

    return;

  }


  answered[currentQuestion] =
    "completed";


  score += 10;

  scoreElement.textContent =
    score;


  message.className =
    "correct";

  message.textContent =
    "آفرین! 👏 پاسخ درست است 🌟";


  playSound(
    "correct"
  );


  speak(
    "آفرین! پاسخ درست است."
  );


  createConfetti();

}


/* =========================================================
   WRONG
========================================================= */

function markWrong() {

  message.className =
    "wrong";

  message.textContent =
    "دوباره با دقت نگاه کن و الگو را پیدا کن. 💪";


  playSound(
    "wrong"
  );


  speak(
    "دوباره با دقت نگاه کن."
  );

}


/* =========================================================
   NEXT
========================================================= */

nextButton.addEventListener(
  "click",
  () => {

    if (
      currentQuestion <
      questions.length - 1
    ) {

      currentQuestion++;

      loadQuestion();

    } else {

      finishGame();

    }

  }
);


/* =========================================================
   PREVIOUS
========================================================= */

prevButton.addEventListener(
  "click",
  () => {

    if (
      currentQuestion > 0
    ) {

      currentQuestion--;

      loadQuestion();

    }

  }
);


/* =========================================================
   FINISH
========================================================= */

function finishGame() {

  gameScreen.classList.add(
    "hidden"
  );

  endScreen.classList.remove(
    "hidden"
  );


  finalScore.textContent =
    score;


  let text = "";

  if (score >= 100) {

    text =
      `آفرین ${studentName}! تو یک قهرمان واقعی الگوها هستی! 🌟`;

  }

  else if (score >= 70) {

    text =
      `خیلی خوب بود ${studentName}! با کمی دقت بیشتر فوق‌العاده می‌شوی. 🌸`;

  }

  else {

    text =
      `آفرین ${studentName}! دوباره بازی کن و الگوها را بهتر کشف کن. 💜`;

  }


  finalMessage.textContent =
    text;


  speak(
    `آفرین ${studentName}! بازی تمام شد. امتیاز تو ${score} است.`
  );


  createConfetti(
    80
  );

}


/* =========================================================
   RESTART
========================================================= */

restartButton.addEventListener(
  "click",
  () => {

    endScreen.classList.add(
      "hidden"
    );

    startScreen.classList.remove(
      "hidden"
    );

    studentNameInput.value =
      studentName;

  }
);


/* =========================================================
   CONFETTI
========================================================= */

function createConfetti(
  amount = 30
) {

  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const confetti =
      document.createElement(
        "div"
      );

    confetti.textContent =
      ["⭐", "🎉", "✨", "💜", "🌸"]
      [
        Math.floor(
          Math.random() * 5
        )
      ];


    confetti.style.position =
      "fixed";

    confetti.style.left =
      Math.random() * 100 + "%";

    confetti.style.top =
      "-30px";

    confetti.style.fontSize =
      (18 + Math.random() * 20)
      + "px";

    confetti.style.zIndex =
      "9999";

    confetti.style.pointerEvents =
      "none";


    document.body.appendChild(
      confetti
    );


    const duration =
      1000 +
      Math.random() * 1800;


    const start =
      performance.now();


    function animate(
      time
    ) {

      const progress =
        Math.min(
          (time - start) /
          duration,
          1
        );


      confetti.style.top =
        (
          progress * 110
        ) + "vh";


      confetti.style.transform =
        `
          rotate(${progress * 720}deg)
          translateX(${Math.sin(progress * 10) * 50}px)
        `;


      if (
        progress < 1
      ) {

        requestAnimationFrame(
          animate
        );

      } else {

        confetti.remove();

      }

    }


    requestAnimationFrame(
      animate
    );

  }

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      gameScreen.classList.contains(
        "hidden"
      )
    ) {

      return;

    }


    if (
      event.key === "ArrowRight"
    ) {

      nextButton.click();

    }


    if (
      event.key === "ArrowLeft"
    ) {

      prevButton.click();

    }

  }
);
