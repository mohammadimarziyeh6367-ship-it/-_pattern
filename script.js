/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   آموزگار: مرضیه محمدی

   ویژگی‌ها:
   - هر مرحله یک الگوی مستقل
   - جدول اصلی ۲۱ ستون
   - جدول سمت راست ۶ ستون
   - فقط یک واحد الگو در جدول سمت راست
   - امکان پاک کردن پاسخ اشتباه
   - مرحله حذف شکل
   - مرحله الگوی شکلی
   - مرحله چندردیفی
   - صدای صحیح/غلط بدون فایل صوتی
   ========================================================= */


/* =========================================================
   عناصر صفحه
   ========================================================= */

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const finishScreen = document.getElementById("finishScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const studentNameInput =
    document.getElementById("studentName");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const stageNumber =
    document.getElementById("stageNumber");

const scoreText =
    document.getElementById("scoreText");

const gameTitle =
    document.getElementById("gameTitle");

const instruction =
    document.getElementById("instruction");

const mainArea =
    document.getElementById("mainArea");

const paletteArea =
    document.getElementById("paletteArea");

const repeatSection =
    document.getElementById("repeatSection");

const repeatArea =
    document.getElementById("repeatArea");

const message =
    document.getElementById("message");

const checkBtn =
    document.getElementById("checkBtn");

const finalScore =
    document.getElementById("finalScore");

const finishMessage =
    document.getElementById("finishMessage");


/* =========================================================
   وضعیت بازی
   ========================================================= */

let studentName = "";

let currentStage = 0;

let score = 0;

let selectedColor = "blue";

let selectedShape = "circle";

let mainState = [];

let repeatState = [];

let multiState = [];

let selectedRemoveIndex = null;

let answeredStages = {};


/* =========================================================
   رنگ‌ها
   ========================================================= */

const colors = {

    blue: {
        className: "cell-blue",
        label: "آبی"
    },

    orange: {
        className: "cell-orange",
        label: "نارنجی"
    },

    red: {
        className: "cell-red",
        label: "قرمز"
    },

    green: {
        className: "cell-green",
        label: "سبز"
    },

    yellow: {
        className: "cell-yellow",
        label: "زرد"
    },

    purple: {
        className: "cell-purple",
        label: "بنفش"
    }

};


/* =========================================================
   شکل‌ها
   ========================================================= */

const shapes = {

    circle: {
        symbol: "●",
        className: "shape-circle",
        label: "دایره"
    },

    square: {
        symbol: "■",
        className: "shape-square",
        label: "مربع"
    },

    triangle: {
        symbol: "▲",
        className: "shape-triangle",
        label: "مثلث"
    },

    star: {
        symbol: "★",
        className: "shape-star",
        label: "ستاره"
    }

};


/* =========================================================
   مراحل بازی
   ========================================================= */

const stages = [

    /* =====================================================
       مرحله ۱
       آبی، نارنجی
       ===================================================== */

    {
        type: "color",

        title: "الگوی آبی و نارنجی",

        instruction:
            "الگوی تکرارشونده را ادامه بده؛ سپس یک بار الگویی را که پیدا کردی، در سمت راست رسم کن.",

        pattern: [
            "blue", "orange",
            "blue", "orange",
            "blue", "orange",
            "blue", "orange",
            "blue", "orange",
            "blue", "orange",
            "blue", "orange",

            null, null, null, null, null, null, null
        ],

        answer: [
            "blue", "orange",
            "blue", "orange",
            "blue", "orange",
            "blue", "orange",
            "blue", "orange",
            "blue", "orange",
            "blue", "orange",
            "blue", "orange",
            "blue", "orange",
            "blue"
        ],

        repeat: [
            "blue",
            "orange"
        ]
    },


    /* =====================================================
       مرحله ۲
       دو قرمز، یک سبز
       ===================================================== */

    {
        type: "color",

        title: "الگوی قرمز و سبز",

        instruction:
            "به تعداد شکل‌های هر بخش دقت کن و الگو را تا پایان جدول ادامه بده.",

        pattern: [
            "red", "red", "green",
            "red", "red", "green",
            "red", "red", "green",
            "red", "red", "green",
            "red", "red",

            null, null, null, null, null, null
        ],

        answer: [
            "red", "red", "green",
            "red", "red", "green",
            "red", "red", "green",
            "red", "red", "green",
            "red", "red", "green",
            "red", "red", "green",
            "red", "red"
        ],

        repeat: [
            "red",
            "red",
            "green"
        ]
    },


    /* =====================================================
       مرحله ۳
       سه نارنجی، یک سبز
       ===================================================== */

    {
        type: "color",

        title: "سه نارنجی و یک سبز",

        instruction:
            "الگو را بخوان. بعد خانه‌های خالی را کامل کن.",

        pattern: [
            "orange", "orange", "orange", "green",
            "orange", "orange", "orange", "green",
            "orange", "orange", "orange", "green",
            "orange", "orange", "orange",

            null, null, null, null, null, null
        ],

        answer: [
            "orange", "orange", "orange", "green",
            "orange", "orange", "orange", "green",
            "orange", "orange", "orange", "green",
            "orange", "orange", "orange", "green",
            "orange", "orange", "orange", "green",
            "orange"
        ],

        repeat: [
            "orange",
            "orange",
            "orange",
            "green"
        ]
    },


    /* =====================================================
       مرحله ۴
       دو آبی، دو قرمز
       ===================================================== */

    {
        type: "color",

        title: "الگوی دو به دو",

        instruction:
            "دو رنگ را به صورت دو تا دو تا تکرار کن.",

        pattern: [
            "blue", "blue", "red", "red",
            "blue", "blue", "red", "red",
            "blue", "blue", "red", "red",
            "blue", "blue", "red",

            null, null, null, null, null, null
        ],

        answer: [
            "blue", "blue", "red", "red",
            "blue", "blue", "red", "red",
            "blue", "blue", "red", "red",
            "blue", "blue", "red", "red",
            "blue", "blue", "red", "red",
            "blue"
        ],

        repeat: [
            "blue",
            "blue",
            "red",
            "red"
        ]
    },


    /* =====================================================
       مرحله ۵
       حذف شکل اضافه
       ===================================================== */

    {
        type: "removeShape",

        title: "کدام شکل اضافه است؟",

        instruction:
            "یک شکل با الگو جور نیست. آن شکل را پیدا کن و روی آن بزن.",

        sequence: [
            "circle",
            "square",
            "triangle",

            "circle",
            "square",
            "triangle",

            "circle",
            "star",
            "triangle",

            "circle",
            "square",
            "triangle"
        ],

        wrongIndex: 7
    },


    /* =====================================================
       مرحله ۶
       چند بار الگو آمده و بعد خانه‌های خالی
       ===================================================== */

    {
        type: "color",

        title: "خودت ادامه بده",

        instruction:
            "الگو تا اینجا ادامه پیدا کرده است. حالا از خانه‌ی خالی به بعد، خودت آن را ادامه بده.",

        pattern: [
            "green", "green", "green", "orange",
            "green", "green", "green", "orange",

            null, null, null, null, null,
            null, null, null, null, null,
            null
        ],

        answer: [
            "green", "green", "green", "orange",
            "green", "green", "green", "orange",
            "green", "green", "green", "orange",
            "green", "green", "green", "orange",
            "green", "green", "green", "orange",
            "green"
        ],

        repeat: [
            "green",
            "green",
            "green",
            "orange"
        ]
    },


    /* =====================================================
       مرحله ۷
       سه قرمز، دو زرد
       ===================================================== */

    {
        type: "color",

        title: "الگوی قرمز و زرد",

        instruction:
            "تعداد رنگ‌های قرمز و زرد را بشمار و الگو را کامل کن.",

        pattern: [
            "red", "red", "red",
            "yellow", "yellow",

            "red", "red", "red",
            "yellow", "yellow",

            "red", "red", "red",

            null, null, null, null, null, null, null, null
        ],

        answer: [
            "red", "red", "red",
            "yellow", "yellow",

            "red", "red", "red",
            "yellow", "yellow",

            "red", "red", "red",
            "yellow", "yellow",

            "red", "red", "red",
            "yellow", "yellow",

            "red"
        ],

        repeat: [
            "red",
            "red",
            "red",
            "yellow",
            "yellow"
        ]
    },


    /* =====================================================
       مرحله ۸
       سه سبز، دو نارنجی
       ===================================================== */

    {
        type: "color",

        title: "الگوی سبز و نارنجی",

        instruction:
            "الگو را بخوان و تا انتهای جدول ادامه بده.",

        pattern: [
            "green", "green", "green",
            "orange", "orange",

            "green", "green", "green",
            "orange", "orange",

            "green", "green", "green",
            "orange", "orange",

            null, null, null, null, null, null
        ],

        answer: [
            "green", "green", "green",
            "orange", "orange",

            "green", "green", "green",
            "orange", "orange",

            "green", "green", "green",
            "orange", "orange",

            "green", "green", "green",
            "orange", "orange",

            "green"
        ],

        repeat: [
            "green",
            "green",
            "green",
            "orange",
            "orange"
        ]
    },


    /* =====================================================
       مرحله ۹
       یکی درمیان سبز
       ===================================================== */

    {
        type: "color",

        title: "الگوی یکی درمیان",

        instruction:
            "به جایگاه خانه‌های سبز دقت کن و الگو را ادامه بده.",

        pattern: [
            "green", null,
            "green", null,
            "green", null,
            "green", null,
            "green", null,
            "green", null,
            "green", null,

            null, null, null, null, null, null, null
        ],

        answer: [
            "green", null,
            "green", null,
            "green", null,
            "green", null,
            "green", null,
            "green", null,
            "green", null,
            "green", null,
            "green", null,
            "green"
        ],

        repeat: [
            "green",
            null
        ]
    },


    /* =====================================================
       مرحله ۱۰
       سه ردیف دقیقاً مطابق توضیح کاربر
       ===================================================== */

    {
        type: "multiColor",

        title: "الگوی سه ردیفی",

        instruction:
            "هر سه ردیف را با دقت نگاه کن و الگوی هر ردیف را کامل کن.",

        rows: 3,

        cols: 8,

        pattern: [

            [
                "green", null,
                "green", null,
                "green", null,
                "green", null
            ],

            [
                null, "green",
                null, "red",
                null, "green",
                null, "red"
            ],

            [
                "green", null,
                "green", null,
                "green", null,
                "green", null
            ]

        ],

        answer: [

            [
                "green", null,
                "green", null,
                "green", null,
                "green", null
            ],

            [
                null, "green",
                null, "red",
                null, "green",
                null, "red"
            ],

            [
                "green", null,
                "green", null,
                "green", null,
                "green", null
            ]

        ],

        repeat2D: [

            [
                "green", null
            ],

            [
                null, "green"
            ],

            [
                "green", null
            ]

        ]
    },


    /* =====================================================
       مرحله ۱۱
       الگوی شکلی
       ===================================================== */

    {
        type: "shapePattern",

        title: "الگوی شکلی",

        instruction:
            "شکل‌ها را بخوان و الگوی تکرارشونده را کامل کن.",

        pattern: [
            "circle",
            "square",
            "triangle",

            "circle",
            "square",
            "triangle",

            "circle",
            "square",

            null, null, null,
            null, null, null,
            null, null, null,
            null, null, null,
            null
        ],

        answer: [
            "circle",
            "square",
            "triangle",

            "circle",
            "square",
            "triangle",

            "circle",
            "square",
            "triangle",

            "circle",
            "square",
            "triangle",

            "circle",
            "square",
            "triangle",

            "circle",
            "square",
            "triangle",

            "circle",
            "square",
            "triangle"
        ],

        repeat: [
            "circle",
            "square",
            "triangle"
        ]
    },


    /* =====================================================
       مرحله ۱۲
       حذف شکل اضافه
       ===================================================== */

    {
        type: "removeShape",

        title: "آخرین چالش",

        instruction:
            "شکلی را پیدا کن که نظم الگو را به هم زده است.",

        sequence: [

            "circle",
            "triangle",
            "square",

            "circle",
            "triangle",
            "square",

            "circle",
            "star",
            "square",

            "circle",
            "triangle",
            "square"

        ],

        wrongIndex: 7
    }

];


/* =========================================================
   تبدیل عدد به فارسی
   ========================================================= */

function faNumber(number) {

    return String(number)
        .replace(/0/g, "۰")
        .replace(/1/g, "۱")
        .replace(/2/g, "۲")
        .replace(/3/g, "۳")
        .replace(/4/g, "۴")
        .replace(/5/g, "۵")
        .replace(/6/g, "۶")
        .replace(/7/g, "۷")
        .replace(/8/g, "۸")
        .replace(/9/g, "۹");
}


/* =========================================================
   صدا
   ========================================================= */

function playTone(type) {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) return;

        const ctx =
            new AudioContext();

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        oscillator.connect(gain);
        gain.connect(ctx.destination);


        if (type === "correct") {

            oscillator.frequency.setValueAtTime(
                600,
                ctx.currentTime
            );

            oscillator.frequency.exponentialRampToValueAtTime(
                900,
                ctx.currentTime + 0.13
            );

        } else {

            oscillator.frequency.setValueAtTime(
                220,
                ctx.currentTime
            );

            oscillator.frequency.exponentialRampToValueAtTime(
                140,
                ctx.currentTime + 0.15
            );
        }


        gain.gain.setValueAtTime(
            0.0001,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.13,
            ctx.currentTime + 0.02
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.2
        );


        oscillator.start();

        oscillator.stop(
            ctx.currentTime + 0.21
        );

    } catch (error) {

        console.log(
            "Audio unavailable"
        );
    }
}


/* =========================================================
   نمایش صفحه
   ========================================================= */

function showScreen(screen) {

    startScreen.classList.remove("active");

    gameScreen.classList.remove("active");

    finishScreen.classList.remove("active");

    screen.classList.add("active");
}


/* =========================================================
   شروع بازی
   ========================================================= */

startBtn.addEventListener(
    "click",
    () => {

        studentName =
            studentNameInput.value.trim()
            || "دانش‌آموز عزیز";

        score = 0;

        currentStage = 0;

        answeredStages = {};

        showScreen(gameScreen);

        renderStage();
    }
);


/* =========================================================
   شروع با Enter
   ========================================================= */

studentNameInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            startBtn.click();
        }
    }
);


/* =========================================================
   پاک کردن کلاس‌های رنگ
   ========================================================= */

function clearColorClasses(cell) {

    Object.values(colors)
        .forEach(color => {

            cell.classList.remove(
                color.className
            );
        });
}


/* =========================================================
   رنگ کردن خانه
   ========================================================= */

function paintCell(cell, color) {

    clearColorClasses(cell);

    if (!color) {

        cell.dataset.color = "";

        return;
    }


    cell.classList.add(
        colors[color].className
    );

    cell.dataset.color = color;
}


/* =========================================================
   پالت رنگ
   ========================================================= */

function createColorPalette() {

    paletteArea.innerHTML = "";


    const title =
        document.createElement("div");

    title.className =
        "palette-title";

    title.textContent =
        "رنگ مورد نظر را انتخاب کن:";

    paletteArea.appendChild(title);


    Object.keys(colors)
        .forEach(colorKey => {

            const btn =
                document.createElement("button");

            btn.className =
                "palette-btn";


            if (
                selectedColor === colorKey
            ) {

                btn.classList.add(
                    "selected"
                );
            }


            const preview =
                document.createElement("span");

            preview.className =
                `color-preview preview-${colorKey}`;

            btn.appendChild(preview);

            btn.title =
                colors[colorKey].label;


            btn.addEventListener(
                "click",
                () => {

                    selectedColor =
                        colorKey;

                    document
                        .querySelectorAll(
                            ".palette-btn"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "selected"
                            );
                        });

                    btn.classList.add(
                        "selected"
                    );
                }
            );


            paletteArea.appendChild(btn);
        });


    /* پاک‌کن */

    const eraser =
        document.createElement("button");

    eraser.className =
        "palette-btn";

    eraser.innerHTML =
        "🧽";

    eraser.title =
        "پاک‌کن";


    if (
        selectedColor === "__erase__"
    ) {

        eraser.classList.add(
            "selected"
        );
    }


    eraser.addEventListener(
        "click",
        () => {

            selectedColor =
                "__erase__";

            document
                .querySelectorAll(
                    ".palette-btn"
                )
                .forEach(item => {

                    item.classList.remove(
                        "selected"
                    );
                });

            eraser.classList.add(
                "selected"
            );
        }
    );


    paletteArea.appendChild(
        eraser
    );
}


/* =========================================================
   پالت شکل
   ========================================================= */

function createShapePalette() {

    paletteArea.innerHTML = "";


    const title =
        document.createElement("div");

    title.className =
        "palette-title";

    title.textContent =
        "شکل مورد نظر را انتخاب کن:";

    paletteArea.appendChild(title);


    ["circle", "square", "triangle"]
        .forEach(shapeKey => {

            const btn =
                document.createElement("button");

            btn.className =
                "shape-palette-btn";


            if (
                selectedShape === shapeKey
            ) {

                btn.classList.add(
                    "selected"
                );
            }


            const shape =
                shapes[shapeKey];


            btn.innerHTML =
                `<span class="shape-symbol ${shape.className}">
                    ${shape.symbol}
                </span>`;


            btn.addEventListener(
                "click",
                () => {

                    selectedShape =
                        shapeKey;

                    document
                        .querySelectorAll(
                            ".shape-palette-btn"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "selected"
                            );
                        });

                    btn.classList.add(
                        "selected"
                    );
                }
            );


            paletteArea.appendChild(btn);
        });


    const eraser =
        document.createElement("button");

    eraser.className =
        "shape-palette-btn";

    eraser.textContent =
        "🧽";

    eraser.title =
        "پاک‌کن";


    eraser.addEventListener(
        "click",
        () => {

            selectedShape =
                "__erase__";

            document
                .querySelectorAll(
                    ".shape-palette-btn"
                )
                .forEach(item => {

                    item.classList.remove(
                        "selected"
                    );
                });

            eraser.classList.add(
                "selected"
            );
        }
    );


    paletteArea.appendChild(
        eraser
    );
}


/* =========================================================
   ساخت جدول اصلی ۲۱ ستونه
   ========================================================= */

function createTextbookGrid(
    values,
    onEdit
) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "grid-scroll";


    const grid =
        document.createElement("div");

    grid.className =
        "textbook-grid cols-21";


    values.forEach(
        (value, index) => {

            const cell =
                document.createElement("div");

            cell.className =
                "grid-cell";


            if (value) {

                cell.classList.add(
                    colors[value].className
                );

                cell.dataset.color =
                    value;

                cell.classList.add(
                    "locked"
                );

            } else {

                cell.classList.add(
                    "editable"
                );


                cell.addEventListener(
                    "click",
                    () => {

                        onEdit(
                            cell,
                            index
                        );
                    }
                );
            }


            grid.appendChild(cell);
        }
    );


    wrapper.appendChild(grid);

    return wrapper;
}


/* =========================================================
   نمایش مرحله رنگی
   ========================================================= */

function renderColorStage(stage) {

    paletteArea.style.display =
        "flex";

    repeatSection.style.display =
        "block";

    checkBtn.style.display =
        "inline-block";


    createColorPalette();


    mainState =
        stage.pattern.slice();


    const mainGrid =
        createTextbookGrid(
            stage.pattern,
            (cell, index) => {

                if (
                    selectedColor ===
                    "__erase__"
                ) {

                    mainState[index] =
                        null;

                    paintCell(
                        cell,
                        null
                    );

                } else {

                    mainState[index] =
                        selectedColor;

                    paintCell(
                        cell,
                        selectedColor
                    );
                }
            }
        );


    mainArea.appendChild(
        mainGrid
    );


    /* =====================================================
       جدول سمت راست
       همیشه ۶ ستون
       ===================================================== */

    repeatState =
        Array(6).fill(null);


    const repeatGrid =
        document.createElement("div");

    repeatGrid.className =
        "repeat-grid";


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const cell =
            document.createElement("div");

        cell.className =
            "grid-cell editable";


        cell.addEventListener(
            "click",
            () => {

                if (
                    selectedColor ===
                    "__erase__"
                ) {

                    repeatState[i] =
                        null;

                    paintCell(
                        cell,
                        null
                    );

                } else {

                    repeatState[i] =
                        selectedColor;

                    paintCell(
                        cell,
                        selectedColor
                    );
                }
            }
        );


        repeatGrid.appendChild(
            cell
        );
    }


    repeatArea.appendChild(
        repeatGrid
    );
}


/* =========================================================
   مرحله حذف شکل
   ========================================================= */

function renderRemoveStage(stage) {

    paletteArea.style.display =
        "none";

    repeatSection.style.display =
        "none";

    checkBtn.style.display =
        "inline-block";


    selectedRemoveIndex = null;


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "grid-scroll";


    const grid =
        document.createElement("div");

    grid.className =
        "remove-grid";


    stage.sequence.forEach(
        (shapeKey, index) => {

            const cell =
                document.createElement("div");

            cell.className =
                "remove-cell";


            const shape =
                shapes[shapeKey];


            cell.innerHTML =
                `<span class="shape-symbol ${shape.className}">
                    ${shape.symbol}
                </span>`;


            cell.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".remove-cell"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "selected-remove"
                            );
                        });


                    cell.classList.add(
                        "selected-remove"
                    );


                    selectedRemoveIndex =
                        index;
                }
            );


            grid.appendChild(cell);
        }
    );


    wrapper.appendChild(grid);

    mainArea.appendChild(
        wrapper
    );
}


/* =========================================================
   مرحله الگوی شکلی
   ========================================================= */

function renderShapeStage(stage) {

    paletteArea.style.display =
        "flex";

    repeatSection.style.display =
        "block";

    checkBtn.style.display =
        "inline-block";


    createShapePalette();


    mainState =
        stage.pattern.slice();


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "grid-scroll";


    const grid =
        document.createElement("div");

    grid.className =
        "textbook-grid cols-21";


    stage.pattern.forEach(
        (shapeKey, index) => {

            const cell =
                document.createElement("div");

            cell.className =
                "grid-cell";


            if (shapeKey) {

                const shape =
                    shapes[shapeKey];

                cell.innerHTML =
                    `<span class="shape-symbol ${shape.className}">
                        ${shape.symbol}
                    </span>`;

                cell.dataset.shape =
                    shapeKey;

                cell.classList.add(
                    "locked"
                );

            } else {

                cell.classList.add(
                    "editable"
                );


                cell.addEventListener(
                    "click",
                    () => {

                        if (
                            selectedShape ===
                            "__erase__"
                        ) {

                            mainState[index] =
                                null;

                            cell.innerHTML = "";

                            cell.dataset.shape =
                                "";

                            return;
                        }


                        mainState[index] =
                            selectedShape;


                        const shape =
                            shapes[
                                selectedShape
                            ];


                        cell.innerHTML =
                            `<span class="shape-symbol ${shape.className}">
                                ${shape.symbol}
                            </span>`;


                        cell.dataset.shape =
                            selectedShape;
                    }
                );
            }


            grid.appendChild(cell);
        }
    );


    wrapper.appendChild(grid);

    mainArea.appendChild(wrapper);


    /* =====================================================
       جدول سمت راست - ۶ ستون
       فقط سه خانه اول برای واحد الگو
       ===================================================== */

    repeatState =
        Array(6).fill(null);


    const repeatGrid =
        document.createElement("div");

    repeatGrid.className =
        "repeat-grid";


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const cell =
            document.createElement("div");

        cell.className =
            "grid-cell editable";


        cell.addEventListener(
            "click",
            () => {

                if (
                    selectedShape ===
                    "__erase__"
                ) {

                    repeatState[i] =
                        null;

                    cell.innerHTML = "";

                    cell.dataset.shape =
                        "";

                    return;
                }


                repeatState[i] =
                    selectedShape;


                const shape =
                    shapes[
                        selectedShape
                    ];


                cell.innerHTML =
                    `<span class="shape-symbol ${shape.className}">
                        ${shape.symbol}
                    </span>`;


                cell.dataset.shape =
                    selectedShape;
            }
        );


        repeatGrid.appendChild(cell);
    }


    repeatArea.appendChild(
        repeatGrid
    );
}


/* =========================================================
   مرحله ۱۰ - سه ردیف
   ========================================================= */

function renderMultiStage(stage) {

    paletteArea.style.display =
        "flex";

    repeatSection.style.display =
        "block";

    checkBtn.style.display =
        "inline-block";


    createColorPalette();


    multiState =
        stage.pattern.map(
            row => row.slice()
        );


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "grid-scroll";


    const grid =
        document.createElement("div");

    grid.className =
        "multi-grid";


    grid.style.gridTemplateColumns =
        `repeat(${stage.cols}, 60px)`;


    for (
        let r = 0;
        r < stage.rows;
        r++
    ) {

        for (
            let c = 0;
            c < stage.cols;
            c++
        ) {

            const value =
                stage.pattern[r][c];


            const cell =
                document.createElement("div");

            cell.className =
                "multi-cell";


            if (value) {

                cell.classList.add(
                    colors[value].className
                );

                cell.classList.add(
                    "locked"
                );

            } else {

                cell.classList.add(
                    "editable"
                );


                cell.addEventListener(
                    "click",
                    () => {

                        if (
                            selectedColor ===
                            "__erase__"
                        ) {

                            multiState[r][c] =
                                null;

                            clearColorClasses(
                                cell
                            );

                        } else {

                            multiState[r][c] =
                                selectedColor;

                            clearColorClasses(
                                cell
                            );

                            cell.classList.add(
                                colors[
                                    selectedColor
                                ].className
                            );
                        }
                    }
                );
            }


            grid.appendChild(cell);
        }
    }


    wrapper.appendChild(grid);

    mainArea.appendChild(wrapper);


    /* =====================================================
       جدول سمت راست
       ۳ ردیف × ۶ ستون
       ===================================================== */

    repeatState =
        Array.from(
            { length: 3 },
            () => Array(6).fill(null)
        );


    const repeatGrid =
        document.createElement("div");

    repeatGrid.className =
        "repeat-grid";


    repeatGrid.style.gridTemplateColumns =
        "repeat(6, 52px)";


    for (
        let r = 0;
        r < 3;
        r++
    ) {

        for (
            let c = 0;
            c < 6;
            c++
        ) {

            const cell =
                document.createElement("div");

            cell.className =
                "grid-cell editable";


            cell.addEventListener(
                "click",
                () => {

                    if (
                        selectedColor ===
                        "__erase__"
                    ) {

                        repeatState[r][c] =
                            null;

                        paintCell(
                            cell,
                            null
                        );

                    } else {

                        repeatState[r][c] =
                            selectedColor;

                        paintCell(
                            cell,
                            selectedColor
                        );
                    }
                }
            );


            repeatGrid.appendChild(cell);
        }
    }


    repeatArea.appendChild(
        repeatGrid
    );
}


/* =========================================================
   رندر مرحله
   ========================================================= */

function renderStage() {

    const stage =
        stages[currentStage];


    mainArea.innerHTML = "";

    paletteArea.innerHTML = "";

    repeatArea.innerHTML = "";

    message.textContent = "";

    message.className =
        "message";


    mainState = [];

    repeatState = [];

    multiState = [];

    selectedRemoveIndex = null;


    selectedColor = "blue";

    selectedShape = "circle";


    stageNumber.textContent =
        `مرحله ${faNumber(
            currentStage + 1
        )}`;


    scoreText.textContent =
        `امتیاز: ${faNumber(score)}`;


    gameTitle.textContent =
        stage.title;


    instruction.textContent =
        stage.instruction;


    if (
        stage.type === "color"
    ) {

        renderColorStage(stage);

    }

    else if (
        stage.type === "removeShape"
    ) {

        renderRemoveStage(stage);

    }

    else if (
        stage.type === "shapePattern"
    ) {

        renderShapeStage(stage);

    }

    else if (
        stage.type === "multiColor"
    ) {

        renderMultiStage(stage);
    }


    updateNavigation();
}


/* =========================================================
   بررسی مرحله رنگی
   ========================================================= */

function checkColorStage(stage) {

    /* بررسی جدول اصلی */

    for (
        let i = 0;
        i < stage.answer.length;
        i++
    ) {

        const expected =
            stage.answer[i] || null;

        const actual =
            mainState[i] || null;


        if (expected !== actual) {

            return false;
        }
    }


    /* =====================================================
       بررسی جدول سمت راست

       فقط طول repeat بررسی می‌شود.
       بقیه خانه‌های جدول باید خالی باشند.
       ===================================================== */

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const expected =
            stage.repeat[i] || null;

        const actual =
            repeatState[i] || null;


        if (expected !== actual) {

            return false;
        }
    }


    return true;
}


/* =========================================================
   بررسی مرحله الگوی شکلی
   ========================================================= */

function checkShapeStage(stage) {

    /* جدول اصلی */

    for (
        let i = 0;
        i < stage.answer.length;
        i++
    ) {

        const expected =
            stage.answer[i] || null;

        const actual =
            mainState[i] || null;


        if (expected !== actual) {

            return false;
        }
    }


    /* جدول سمت راست */

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const expected =
            stage.repeat[i] || null;

        const actual =
            repeatState[i] || null;


        if (expected !== actual) {

            return false;
        }
    }


    return true;
}


/* =========================================================
   بررسی مرحله ۱۰
   ========================================================= */

function checkMultiStage(stage) {

    /* جدول اصلی */

    for (
        let r = 0;
        r < stage.rows;
        r++
    ) {

        for (
            let c = 0;
            c < stage.cols;
            c++
        ) {

            const expected =
                stage.answer[r][c] || null;

            const actual =
                multiState[r][c] || null;


            if (expected !== actual) {

                return false;
            }
        }
    }


    /* =====================================================
       جدول سمت راست

       واحد تکرارشونده:

       ستون ۱:
       سبز
       سفید
       سبز

       ستون ۲:
       سفید
       سبز
       سفید

       سپس ۴ ستون دیگر باید خالی بمانند.
       ===================================================== */

    for (
        let r = 0;
        r < 3;
        r++
    ) {

        for (
            let c = 0;
            c < 6;
            c++
        ) {

            const expected =
                c < 2
                    ? (
                        stage.repeat2D[r][c]
                        || null
                    )
                    : null;


            const actual =
                repeatState[r][c]
                || null;


            if (expected !== actual) {

                return false;
            }
        }
    }


    return true;
}


/* =========================================================
   بررسی مرحله حذف شکل
   ========================================================= */

function checkRemoveStage(stage) {

    return (
        selectedRemoveIndex ===
        stage.wrongIndex
    );
}


/* =========================================================
   بررسی پاسخ
   ========================================================= */

checkBtn.addEventListener(
    "click",
    () => {

        const stage =
            stages[currentStage];


        let correct = false;


        if (
            stage.type === "color"
        ) {

            correct =
                checkColorStage(stage);
        }

        else if (
            stage.type === "shapePattern"
        ) {

            correct =
                checkShapeStage(stage);
        }

        else if (
            stage.type === "multiColor"
        ) {

            correct =
                checkMultiStage(stage);
        }

        else if (
            stage.type === "removeShape"
        ) {

            correct =
                checkRemoveStage(stage);
        }


        if (correct) {

            playTone("correct");


            message.className =
                "message success";


            message.textContent =
                `آفرین ${studentName}! 🌟 الگو را درست پیدا کردی.`;


            if (
                !answeredStages[currentStage]
            ) {

                score += 10;

                answeredStages[
                    currentStage
                ] = true;
            }


            scoreText.textContent =
                `امتیاز: ${faNumber(score)}`;


        } else {

            playTone("wrong");


            message.className =
                "message error";


            message.textContent =
                "یک بار دیگر الگو را با دقت نگاه کن و دوباره تلاش کن. 🌱";
        }
    }
);


/* =========================================================
   دکمه بعدی
   ========================================================= */

nextBtn.addEventListener(
    "click",
    () => {

        if (
            currentStage <
            stages.length - 1
        ) {

            currentStage++;

            renderStage();

        } else {

            showFinish();
        }
    }
);


/* =========================================================
   دکمه قبلی
   ========================================================= */

prevBtn.addEventListener(
    "click",
    () => {

        if (currentStage > 0) {

            currentStage--;

            renderStage();
        }
    }
);


/* =========================================================
   ناوبری
   ========================================================= */

function updateNavigation() {

    prevBtn.disabled =
        currentStage === 0;


    if (
        currentStage ===
        stages.length - 1
    ) {

        nextBtn.textContent =
            "پایان 🏆";

    } else {

        nextBtn.textContent =
            "بعدی ❯";
    }
}


/* =========================================================
   پایان بازی
   ========================================================= */

function showFinish() {

    showScreen(
        finishScreen
    );


    finalScore.textContent =
        faNumber(score);


    finishMessage.innerHTML =
        `آفرین <strong>${escapeHtml(studentName)}</strong> 🌸<br>
         تو الگوها را با دقت پیدا کردی.`;
}


/* =========================================================
   شروع دوباره
   ========================================================= */

restartBtn.addEventListener(
    "click",
    () => {

        score = 0;

        currentStage = 0;

        answeredStages = {};

        studentNameInput.value = "";

        showScreen(
            startScreen
        );
    }
);


/* =========================================================
   جلوگیری از ورود HTML در نام
   ========================================================= */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


/* =========================================================
   پایان فایل
   ========================================================= */
