const $ = id => document.getElementById(id);


/* ==========================================
   شکل‌های بازی
========================================== */

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


/* ==========================================
   مراحل بازی
   از ساده به دشوار
========================================== */

const levels = [

  /* -----------------------------------------
     نمونه
  ----------------------------------------- */

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


  /* -----------------------------------------
     مرحله ۱
     انتخاب شکل
  ----------------------------------------- */

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


  /* -----------------------------------------
     مرحله ۲
     انتخاب شکل
  ----------------------------------------- */

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


  /* -----------------------------------------
     مرحله ۳
     الگوی سه‌تایی
  ----------------------------------------- */

  {
    type: "missing",

    text:
      "الگو را پیدا کن و شکل گمشده را انتخاب کن.",

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


  /* -----------------------------------------
     مرحله ۴
     AAB
  ----------------------------------------- */

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


  /* -----------------------------------------
     مرحله ۵
     جای خالی وسط
  ----------------------------------------- */

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


  /* =========================================
     بخش دوم:
     جابه‌جایی شکل‌ها
  ========================================== */

  /* -----------------------------------------
     مرحله ۶
  ----------------------------------------- */

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


  /* -----------------------------------------
     مرحله ۷
     الگوی سه‌تایی
  ----------------------------------------- */

  {
    type: "reorder",

    text:
      "شکل‌ها را جابه‌جا کن تا الگوی منظم ساخته شود.",

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


  /* -----------------------------------------
     مرحله ۸
     جابه‌جایی الگوی AAB
  ----------------------------------------- */

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


  /* =========================================
     بخش سوم:
     حذف شکل
  ========================================== */

  /* -----------------------------------------
     مرحله ۹
  ----------------------------------------- */

  {
    type: "remove",

    text:
      "کدام شکل را حذف کنیم تا الگو منظم شود؟",

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


  /* -----------------------------------------
     مرحله ۱۰
     حذف شکل اضافی در الگوی سه‌تایی
  ----------------------------------------- */

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


  /* =========================================
     بخش چهارم:
     انتخاب شکل و قرار دادن در جای خالی
  ========================================== */

  /* -----------------------------------------
     مرحله ۱۱
  ----------------------------------------- */

  {
    type: "place",

    text:
      "از شکل‌های پایین یکی را انتخاب کن و در جای خالی بگذار.",

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


  /* -----------------------------------------
     مرحله ۱۲
  ----------------------------------------- */

  {
    type: "place",

    text:
      "شکل‌های مناسب را از پایین انتخاب کن و الگو را کامل کن.",

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
  },


  /* -----------------------------------------
     مرحله ۱۳
     چالش نهایی
  ----------------------------------------- */

  {
    type: "place",

    text:
      "الگوی منظم را پیدا کن و همهٔ جای خالی‌ها را کامل کن.",

    pattern: [
      ["circle", "purple"],
      ["circle", "purple"],
      ["triangle", "green"],
      null,

      ["circle", "purple"],
      ["circle", "purple"],
      ["triangle", "green"],
      null
    ],

    options: [
      ["circle", "purple"],
      ["triangle", "green"],
      ["star", "yellow"]
    ],

    answers: [2, 2]
  }

];


/* ==========================================
   متغیرهای بازی
========================================== */

let level = 0;

let score = 0;

let selected = null;

let currentPieces = [];

let placedAnswers = {};


/* ==========================================
   تغییر صفحه
========================================== */

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.remove("active");

    });

  $(id).classList.add("active");
}


/* ==========================================
   ساخت شکل
========================================== */

function makeShape(item) {

  if (!item) {

    return `
      <span class="slot missing">
        ؟
      </span>
    `;

  }

  return shapes[item[0]](item[1]);
}


/* ==========================================
   ساخت خانه الگو
========================================== */

function slotHTML(item, index, draggable = false) {

  if (!item) {

    return `
      <div
        class="slot missing"
        data-index="${index}">
        ؟
      </div>
    `;

  }

  return `
    <div
      class="slot ${draggable ? "draggable" : ""}"
      data-index="${index}">

      ${makeShape(item)}

    </div>
  `;
}


/* ==========================================
   نمایش مرحله
========================================== */

function render() {

  selected = null;

  currentPieces = [];

  placedAnswers = {};

  const L = levels[level];


  $("levelLabel").textContent =
    `مرحله ${level + 1} از ${levels.length}`;


  $("scoreLabel").textContent =
    `امتیاز: ${score}`;


  $("progressBar").style.width =
    `${((level + 1) / levels.length) * 100}%`;


  $("feedback").textContent = "";

  $("feedback").className =
    "feedback";


  $("checkBtn").classList.add("hidden");

  $("nextBtn").classList.add("hidden");

  $("choices").innerHTML = "";

  $("choicesTitle").classList.add("hidden");


  /* نوع سؤال */

  const badges = {

    sample: "نمونهٔ آموزشی",

    missing: "جای خالی",

    reorder: "جابه‌جایی شکل‌ها",

    remove: "حذف شکل اضافی",

    place: "انتخاب و قرار دادن"

  };


  $("typeBadge").textContent =
    badges[L.type] || "الگوی منظم";


  $("questionText").textContent =
    L.text;


  $("instruction").textContent =
    L.type === "reorder"
      ? "با لمس و کشیدن، شکل‌ها را جابه‌جا کن."
      : L.type === "remove"
        ? "شکل اضافی را پیدا کن."
        : L.type === "place"
          ? "ابتدا جای خالی را لمس کن، سپس شکل مناسب را از پایین انتخاب کن."
          : "با دقت به تکرار شکل‌ها نگاه کن.";


  /* ==========================================
     نمونه
  ========================================== */

  if (L.type === "sample") {

    $("patternArea").innerHTML = `

      <div class="pattern-row">

        ${L.pattern
          .map((item, index) =>
            slotHTML(item, index))
          .join("")}

      </div>

    `;


    $("feedback").className =
      "feedback ok";


    $("feedback").textContent =
      "در این نمونه، شکل‌ها به ترتیب تکرار می‌شوند. حالا نوبت توست! 🌸";


    $("nextBtn").textContent =
      "شروع مرحله‌ها ←";


    $("nextBtn").classList.remove("hidden");

    return;
  }


  /* ==========================================
     سؤال جای خالی
  ========================================== */

  if (L.type === "missing") {

    $("patternArea").innerHTML = `

      <div class="pattern-row">

        ${L.pattern
          .map((item, index) =>
            slotHTML(item, index))
          .join("")}

      </div>

    `;


    $("choicesTitle").classList.remove("hidden");


    createChoices(L.options);

  }


  /* ==========================================
     جابه‌جایی
  ========================================== */

  if (L.type === "reorder") {

    currentPieces =
      L.pieces.map((item, index) => ({
        item,
        id: index
      }));


    renderPieces();

  }


  /* ==========================================
     حذف
  ========================================== */

  if (L.type === "remove") {

    renderRemove(L);

  }


  /* ==========================================
     انتخاب و قرار دادن
  ========================================== */

  if (L.type === "place") {

    renderPlace(L);

  }

}


/* ==========================================
   گزینه‌ها
========================================== */

function createChoices(options) {

  options.forEach((item, index) => {

    const button =
      document.createElement("button");


    button.className =
      "choice";


    button.innerHTML =
      makeShape(item);


    button.onclick = () => {

      document
        .querySelectorAll(".choice")
        .forEach(c =>
          c.classList.remove("selected")
        );


      button.classList.add("selected");


      selected = index;


      $("checkBtn")
        .classList
        .remove("hidden");

    };


    $("choices")
      .appendChild(button);

  });

}


/* ==========================================
   جابه‌جایی شکل‌ها
========================================== */

function renderPieces() {

  $("patternArea").innerHTML = `

    <div
      id="dragRow"
      class="drag-row">

      ${currentPieces
        .map((piece, index) => `

          <div
            class="slot draggable"
            data-pos="${index}">

            ${makeShape(piece.item)}

          </div>

        `)
        .join("")}

    </div>

  `;


  const row =
    $("dragRow");


  let from = null;


  row
    .querySelectorAll(".draggable")
    .forEach(element => {

      element.addEventListener(
        "pointerdown",
        event => {

          from =
            Number(
              element.dataset.pos
            );


          element.classList.add("dragging");


          element.setPointerCapture(
            event.pointerId
          );

        }
      );


      element.addEventListener(
        "pointerup",
        event => {

          element.classList.remove("dragging");


          if (from === null)
            return;


          const elements =
            [
              ...row.querySelectorAll(
                ".draggable"
              )
            ];


          let best = null;

          let bestDistance =
            Infinity;


          elements.forEach(target => {

            if (target === element)
              return;


            const rect =
              target.getBoundingClientRect();


            const center =
              rect.left +
              rect.width / 2;


            const distance =
              Math.abs(
                event.clientX - center
              );


            if (
              distance <
              bestDistance
            ) {

              bestDistance =
                distance;

              best =
                Number(
                  target.dataset.pos
                );

            }

          });


          if (
            best !== null &&
            best !== from
          ) {

            const temp =
              currentPieces[from];


            currentPieces[from] =
              currentPieces[best];


            currentPieces[best] =
              temp;


            renderPieces();

          }


          from = null;


          $("checkBtn")
            .classList
            .remove("hidden");

        }
      );

    });

}


/* ==========================================
   سؤال حذف شکل
========================================== */

function renderRemove(L) {

  $("patternArea").innerHTML = `

    <div class="pattern-row">

      ${L.pattern
        .map((item, index) => `

          <button
            class="choice remove-choice"
            data-index="${index}">

            ${makeShape(item)}

          </button>

        `)
        .join("")}

    </div>

  `;


  document
    .querySelectorAll(".remove-choice")
    .forEach(button => {

      button.onclick = () => {

        document
          .querySelectorAll(".remove-choice")
          .forEach(b =>
            b.classList.remove("selected")
          );


        button.classList.add("selected");


        selected =
          Number(
            button.dataset.index
          );


        $("checkBtn")
          .classList
          .remove("hidden");

      };

    });

}


/* ==========================================
   سؤال انتخاب و قرار دادن
========================================== */

function renderPlace(L) {

  $("patternArea").innerHTML = `

    <div
      id="placeRow"
      class="pattern-row">

      ${L.pattern
        .map((item, index) => `

          <button
            class="slot place-slot ${item ? "" : "missing"}"
            data-index="${index}">

            ${
              item
                ? makeShape(item)
                : "؟"
            }

          </button>

        `)
        .join("")}

    </div>

  `;


  $("choicesTitle")
    .classList
    .remove("hidden");


  createPlaceChoices(L);


  document
    .querySelectorAll(".place-slot")
    .forEach(slot => {

      slot.onclick = () => {

        if (!L.pattern[
          Number(slot.dataset.index)
        ]) {

          document
            .querySelectorAll(".place-slot")
            .forEach(s =>
              s.classList.remove("selected")
            );


          slot.classList.add("selected");


          selected =
            Number(
              slot.dataset.index
            );

        }

      };

    });

}


/* ==========================================
   گزینه‌های سؤال قرار دادن
========================================== */

function createPlaceChoices(L) {

  L.options.forEach((item, index) => {

    const button =
      document.createElement("button");


    button.className =
      "choice";


    button.innerHTML =
      makeShape(item);


    button.onclick = () => {

      const target =
        document.querySelector(
          ".place-slot.selected"
        );


      if (!target) {

        $("feedback").className =
          "feedback no";

        $("feedback").textContent =
          "اول جای خالی را لمس کن، بعد شکل مناسب را انتخاب کن. 🌷";

        return;

      }


      const targetIndex =
        Number(target.dataset.index);


      placedAnswers[targetIndex] =
        index;


      target.innerHTML =
        makeShape(item);


      target.classList.remove("missing");

      target.classList.remove("selected");


      checkPlaceComplete(L);

    };


    $("choices")
      .appendChild(button);

  });

}


/* ==========================================
   بررسی سؤال قرار دادن
========================================== */

function checkPlaceComplete(L) {

  const missingIndexes =
    L.pattern
      .map((item, index) =>
        item ? null : index
      )
      .filter(index =>
        index !== null
      );


  const allPlaced =
    missingIndexes.every(index =>
      placedAnswers[index] !== undefined
    );


  if (!allPlaced)
    return;


  let correct = true;


  missingIndexes.forEach(
    (patternIndex, answerIndex) => {

      if (
        placedAnswers[patternIndex] !==
        L.answers[answerIndex]
      ) {

        correct = false;

      }

    }
  );


  $("checkBtn")
    .classList
    .remove("hidden");


  if (correct) {

    success();

  } else {

    $("feedback").className =
      "feedback no";

    $("feedback").textContent =
      "هنوز یک شکل درست انتخاب نشده است. دوباره الگو را نگاه کن. 🌷";

  }

}


/* ==========================================
   بررسی پاسخ
========================================== */

function check() {

  const L =
    levels[level];


  /* -----------------------------------------
     جای خالی
  ----------------------------------------- */

  if (L.type === "missing") {

    if (selected === null)
      return;


    if (selected === L.answer) {

      success();

    } else {

      fail(
        "دوباره به تکرار شکل‌ها نگاه کن. 🌷"
      );

    }

    return;
  }


  /* -----------------------------------------
     حذف
  ----------------------------------------- */

  if (L.type === "remove") {

    if (selected === null)
      return;


    if (selected === L.removeIndex) {

      success();

    } else {

      fail(
        "به بخش‌های تکرارشونده الگو دقت کن. این شکل اضافی نیست."
      );

    }

    return;
  }


  /* -----------------------------------------
     جابه‌جایی
  ----------------------------------------- */

  if (L.type === "reorder") {

    const got =
      currentPieces.map(
        piece =>
          `${piece.item[0]}-${piece.item[1]}`
      );


    const wanted =
      L.target.map(
        item =>
          `${item[0]}-${item[1]}`
      );


    if (
      JSON.stringify(got) ===
      JSON.stringify(wanted)
    ) {

      success();

    } else {

      fail(
        "یک بار دیگر شکل‌ها را جابه‌جا کن تا بخش‌های الگو مثل هم تکرار شوند."
      );

    }

  }

}


/* ==========================================
   پاسخ درست
========================================== */

function success() {

  score += 10;


  $("scoreLabel").textContent =
    `امتیاز: ${score}`;


  $("feedback").className =
    "feedback ok";


  $("feedback").textContent =
    "آفرین! الگو را درست پیدا کردی. ⭐";


  $("checkBtn")
    .classList
    .add("hidden");


  $("nextBtn")
    .classList
    .remove("hidden");


  $("nextBtn").textContent =
    level === levels.length - 1
      ? "پایان بازی 🎉"
      : "مرحله بعد ←";

}


/* ==========================================
   پاسخ اشتباه
========================================== */

function fail(message) {

  $("feedback").className =
    "feedback no";


  $("feedback").textContent =
    "💡 " + message;

}


/* ==========================================
   شروع بازی
========================================== */

$("startBtn").onclick = () => {

  level = 0;

  score = 0;

  showScreen("game");

  render();

};


/* ==========================================
   بررسی
========================================== */

$("checkBtn").onclick =
  check;


/* ==========================================
   مرحله بعد
========================================== */

$("nextBtn").onclick = () => {

  if (
    level ===
    levels.length - 1
  ) {

    $("finalScore").textContent =
      `امتیاز تو: ${score} از ${levels.length * 10}`;


    showScreen("finish");

  } else {

    level++;

    render();

  }

};


/* ==========================================
   شروع دوباره
========================================== */

$("restartBtn").onclick = () => {

  level = 0;

  score = 0;

  showScreen("game");

  render();

};
