const $ = id =>
  document.getElementById(id);


/* شکل‌های بازی */

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


/*
-----------------------------------
مراحل بازی
از ساده به دشوار
-----------------------------------
*/

const levels = [

  /* ==================================
     نمونه
     ================================== */

  {
    type: "sample",

    text:
      "الگو را پیدا کن و سپس الگو را ادامه بده.",

    pattern: [
      ["circle", "blue"],
      ["circle", "yellow"],
      ["circle", "blue"],
      ["circle", "yellow"],
      ["circle", "blue"],
      ["circle", "yellow"]
    ]
  },


  /* ==================================
     مرحله ۱
     الگوی ساده دو شکلی
     ================================== */

  {
    type: "missing",

    text:
      "الگو را پیدا کن و سپس الگو را ادامه بده.",

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
      ["circle", "yellow"]
    ],

    answer: 1
  },


  /* ==================================
     مرحله ۲
     ================================== */

  {
    type: "missing",

    text:
      "الگو را پیدا کن و سپس الگو را ادامه بده.",

    pattern: [
      ["square", "green"],
      ["triangle", "purple"],
      ["square", "green"],
      ["triangle", "purple"],
      ["square", "green"],
      null
    ],

    options: [
      ["triangle", "purple"],
      ["square", "green"]
    ],

    answer: 0
  },


  /* ==================================
     مرحله ۳
     دو شکل با شکل‌های متفاوت
     ================================== */

  {
    type: "missing",

    text:
      "الگو را پیدا کن و سپس الگو را ادامه بده.",

    pattern: [
      ["heart", "pink"],
      ["star", "yellow"],
      ["heart", "pink"],
      ["star", "yellow"],
      ["heart", "pink"],
      null
    ],

    options: [
      ["heart", "pink"],
      ["star", "yellow"]
    ],

    answer: 1
  },


  /* ==================================
     مرحله ۴
     الگوی AAB
     ================================== */

  {
    type: "missing",

    text:
      "الگو را پیدا کن و سپس الگو را ادامه بده.",

    pattern: [
      ["circle", "blue"],
      ["circle", "blue"],
      ["square", "yellow"],

      ["circle", "blue"],
      ["circle", "blue"],
      ["square", "yellow"],

      ["circle", "blue"],
      null
    ],

    options: [
      ["square", "yellow"],
      ["circle", "blue"],
      ["triangle", "green"]
    ],

    answer: 1
  },


  /* ==================================
     مرحله ۵
     الگوی ABB
     ================================== */

  {
    type: "missing",

    text:
      "الگو را پیدا کن و سپس الگو را ادامه بده.",

    pattern: [
      ["triangle", "purple"],
      ["circle", "yellow"],
      ["circle", "yellow"],

      ["triangle", "purple"],
      ["circle", "yellow"],
      ["circle", "yellow"],

      ["triangle", "purple"],
      null
    ],

    options: [
      ["triangle", "purple"],
      ["circle", "yellow"],
      ["square", "green"]
    ],

    answer: 1
  },


  /* ==================================
     مرحله ۶
     الگوی ABC
     ================================== */

  {
    type: "missing",

    text:
      "الگو را پیدا کن و سپس الگو را ادامه بده.",

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


  /* ==================================
     مرحله ۷
     جای خالی در وسط الگو
     ================================== */

  {
    type: "missing",

    text:
      "الگو را پیدا کن و شکل گمشده را پیدا کن.",

    pattern: [
      ["circle", "blue"],
      ["star", "yellow"],
      ["circle", "blue"],
      null,
      ["circle", "blue"],
      ["star", "yellow"]
    ],

    options: [
      ["circle", "blue"],
      ["star", "yellow"],
      ["heart", "pink"]
    ],

    answer: 1
  },


  /* ==================================
     مرحله ۸
     الگوی AAB با جای خالی
     ================================== */

  {
    type: "missing",

    text:
      "الگو را پیدا کن و سپس الگو را ادامه بده.",

    pattern: [
      ["heart", "pink"],
      ["heart", "pink"],
      ["circle", "blue"],

      ["heart", "pink"],
      ["heart", "pink"],
      ["circle", "blue"],

      ["heart", "pink"],
      ["heart", "pink"],
      null
    ],

    options: [
      ["heart", "pink"],
      ["circle", "blue"],
      ["star", "yellow"]
    ],

    answer: 1
  },


  /* ==================================
     مرحله ۹
     جابه‌جایی چهار شکل
     ================================== */

  {
    type: "reorder",

    text:
      "شکل‌ها را جابه‌جا کن تا الگوی منظم درست شود.",

    pieces: [
      ["circle", "blue"],
      ["triangle", "yellow"],
      ["circle", "blue"],
      ["triangle", "yellow"]
    ],

    target: [
      ["circle", "blue"],
      ["triangle", "yellow"],
      ["circle", "blue"],
      ["triangle", "yellow"]
    ]
  },


  /* ==================================
     مرحله ۱۰
     جابه‌جایی الگوی سه‌تایی
     ================================== */

  {
    type: "reorder",

    text:
      "شکل‌ها را جابه‌جا کن تا الگو منظم شود.",

    pieces: [
      ["circle", "red"],
      ["triangle", "green"],
      ["square", "yellow"],

      ["square", "yellow"],
      ["circle", "red"],
      ["triangle", "green"]
    ],

    target: [
      ["circle", "red"],
      ["triangle", "green"],
      ["square", "yellow"],

      ["circle", "red"],
      ["triangle", "green"],
      ["square", "yellow"]
    ]
  },


  /* ==================================
     مرحله ۱۱
     حذف شکل اضافه
     ================================== */

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

    options: [
      ["star", "pink"],
      ["circle", "blue"],
      ["triangle", "yellow"]
    ],

    answer: 0
  },


  /* ==================================
     مرحله ۱۲
     چالش پایانی
     ================================== */

  {
    type: "missing",

    text:
      "الگوی منظم را پیدا کن و آن را کامل کن.",

    pattern: [
      ["circle", "purple"],
      ["circle", "purple"],
      ["triangle", "green"],

      ["star", "yellow"],
      ["circle", "purple"],
      ["circle", "purple"],

      ["triangle", "green"],
      ["star", "yellow"],
      ["circle", "purple"],

      null
    ],

    options: [
      ["circle", "purple"],
      ["triangle", "green"],
      ["star", "yellow"]
    ],

    answer: 1
  }

];

/* تغییر صفحه */

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen =>
      screen.classList.remove("active")
    );

  $(id).classList.add("active");
}


/* ساخت شکل */

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


/* ساخت خانه */

function slotHTML(item, index) {

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
      class="slot"
      data-index="${index}">

      ${makeShape(item)}

    </div>
  `;
}


/* نمایش مرحله */

function render() {

  selected = null;

  currentPieces = [];


  const L =
    levels[level];


  $("levelLabel").textContent =
    `مرحله ${level + 1} از ${levels.length}`;


  $("scoreLabel").textContent =
    `امتیاز: ${score}`;


  $("progressBar").style.width =
    `${((level + 1) / levels.length) * 100}%`;


  $("feedback").textContent = "";

  $("feedback").className =
    "feedback";


  $("sampleBadge")
    .classList
    .toggle(
      "hidden",
      L.type !== "sample"
    );


  $("instruction").textContent =
    L.type === "reorder"
      ? "شکل‌ها را با لمس و کشیدن جابه‌جا کن."
      : "با دقت به تکرار شکل‌ها نگاه کن.";


  $("questionText").textContent =
    L.text;


  $("checkBtn")
    .classList
    .add("hidden");


  $("nextBtn")
    .classList
    .add("hidden");


  $("choices").innerHTML = "";


  /* نمونه */

  if (L.type === "sample") {

    $("patternArea").innerHTML = `

      <div class="pattern-row">

        ${L.pattern
          .map((x, i) =>
            slotHTML(x, i))
          .join("")}

      </div>

    `;


    $("feedback").className =
      "feedback ok";


    $("feedback").textContent =
      "آفرین! در این نمونه، الگو «دایره، قلب» است؛ پس شکل بعدی هم قلب است. حالا خودت حل کن! 🌸";


    $("nextBtn").textContent =
      "شروع مرحله‌های بازی ←";


    $("nextBtn")
      .classList
      .remove("hidden");


    return;
  }


  /* سؤال انتخابی */

  if (
    L.type === "missing" ||
    L.type === "remove"
  ) {

    $("patternArea").innerHTML = `

      <div class="pattern-row">

        ${L.pattern
          .map((x, i) =>
            slotHTML(x, i))
          .join("")}

      </div>

    `;


    L.options.forEach(
      (item, i) => {

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


          button.classList.add(
            "selected"
          );


          selected = i;


          $("checkBtn")
            .classList
            .remove("hidden");

        };


        $("choices")
          .appendChild(button);

      }
    );

  }


  /* جابه‌جایی */

  if (L.type === "reorder") {

    currentPieces =
      L.pieces.map(
        (item, i) => ({
          item,
          id: i
        })
      );


    renderPieces();

  }

}


/* نمایش شکل‌های قابل جابه‌جایی */

function renderPieces() {

  $("patternArea").innerHTML = `

    <div
      id="dragRow"
      class="drag-row">

      ${currentPieces
        .map(
          (piece, i) => `

          <div
            class="slot draggable"
            data-pos="${i}">

            ${makeShape(piece.item)}

          </div>

        `
        )
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


          element.classList.add(
            "dragging"
          );


          element.setPointerCapture(
            event.pointerId
          );

        }
      );


      element.addEventListener(
        "pointerup",
        event => {

          element.classList.remove(
            "dragging"
          );


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


          elements.forEach(
            target => {

              if (target === element)
                return;


              const rect =
                target.getBoundingClientRect();


              const center =
                rect.left +
                rect.width / 2;


              const distance =
                Math.abs(
                  event.clientX -
                  center
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

            }
          );


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


/* بررسی جواب */

function check() {

  const L =
    levels[level];


  /* سؤال انتخابی */

  if (
    L.type === "missing" ||
    L.type === "remove"
  ) {

    if (selected === null)
      return;


    if (
      selected === L.answer
    ) {

      success();

    } else {

      fail(
        "هنوز الگو منظم نشده. دوباره به تکرار شکل‌ها نگاه کن. 🌷"
      );

    }

  }


  /* سؤال جابه‌جایی */

  else if (
    L.type === "reorder"
  ) {

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
        "یک بار دیگر جای شکل‌ها را نگاه کن؛ هر بخش الگو باید مثل بخش قبلی تکرار شود."
      );

    }

  }

}


/* پاسخ درست */

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


/* پاسخ اشتباه */

function fail(message) {

  $("feedback").className =
    "feedback no";


  $("feedback").textContent =
    "💡 " + message;

}


/* شروع */

$("startBtn").onclick = () => {

  level = 0;

  score = 0;

  showScreen("game");

  render();

};


/* بررسی */

$("checkBtn").onclick =
  check;


/* مرحله بعد */

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


/* شروع دوباره */

$("restartBtn").onclick = () => {

  level = 0;

  score = 0;

  showScreen("game");

  render();

};
