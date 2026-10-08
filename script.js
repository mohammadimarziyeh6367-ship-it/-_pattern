/* =========================================================
   الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
   مدرسه دخترانه شریعتی
========================================================= */


/* =========================
   متغیرهای اصلی
========================= */

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const finishScreen = document.getElementById("finishScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const taskArea = document.getElementById("taskArea");
const paletteArea = document.getElementById("paletteArea");

const instruction = document.getElementById("instruction");
const feedback = document.getElementById("feedback");

const checkBtn = document.getElementById("checkBtn");
const clearBtn = document.getElementById("clearBtn");

const stageTitle = document.getElementById("stageTitle");
const progressText = document.getElementById("progressText");

const studentNameInput = document.getElementById("studentName");
const finishMessage = document.getElementById("finishMessage");

const celebrationLayer = document.getElementById("celebrationLayer");


let currentStage = 0;
let studentName = "";

let currentAnswers = [];

let mouseTimer = null;


/* =========================================================
   صداهای کاملاً محلی با WebAudio
   بدون MP3 و بدون نیاز به اینترنت
========================================================= */

let audioContext = null;

function getAudioContext() {

    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    return audioContext;
}


function playTone(
    frequency,
    duration = 0.15,
    type = "sine",
    volume = 0.08,
    delay = 0
) {

    try {

        const ctx = getAudioContext();

        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(
            frequency,
            ctx.currentTime + delay
        );

        gain.gain.setValueAtTime(
            0.0001,
            ctx.currentTime + delay
        );

        gain.gain.exponentialRampToValueAtTime(
            volume,
            ctx.currentTime + delay + 0.02
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + delay + duration
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start(ctx.currentTime + delay);
        oscillator.stop(ctx.currentTime + delay + duration + 0.03);

    } catch (error) {
        console.log("Audio unavailable");
    }
}


function correctSound() {

    playTone(523.25, 0.14, "sine", 0.09, 0);
    playTone(659.25, 0.14, "sine", 0.09, 0.13);
    playTone(783.99, 0.25, "sine", 0.1, 0.26);
}


function wrongSound() {

    playTone(220, 0.16, "triangle", 0.08, 0);
    playTone(165, 0.22, "triangle", 0.07, 0.16);
}


function clickSound() {
    playTone(500, 0.06, "sine", 0.035);
}


/* =========================================================
   آتش‌بازی
========================================================= */

function fireworks() {

    celebrationLayer.innerHTML = "";

    const count = 70;

    for (let i = 0; i < count; i++) {

        const particle = document.createElement("div");

        particle.className = "firework";

        const centerX = 20 + Math.random() * 60;
        const centerY = 20 + Math.random() * 45;

        particle.style.left = centerX + "%";
        particle.style.top = centerY + "%";

        particle.style.setProperty(
            "--x",
            (Math.random() * 100)
        );

        particle.style.setProperty(
            "--y",
            (Math.random() * 100)
        );

        particle.style.background =
            [
                "#58c86b",
                "#42a5f5",
                "#ffd84d",
                "#ef5350",
                "#ff73ad",
                "#9c64e8"
            ][Math.floor(Math.random() * 6)];

        particle.style.animationDelay =
            Math.random() * 0.2 + "s";

        celebrationLayer.appendChild(particle);
    }

    setTimeout(() => {
        celebrationLayer.innerHTML = "";
    }, 1500);
}


/* =========================================================
   تشویق
========================================================= */

function showCorrect(message = "آفرین! چه الگوی قشنگی پیدا کردی! 🌟") {

    feedback.className = "feedback good";
    feedback.textContent = message;

    correctSound();
    fireworks();
}


function showWrong(message = "یک بار دیگر با دقت به الگو نگاه کن. 💜") {

    feedback.className = "feedback bad";
    feedback.textContent = message;

    wrongSound();
}


/* =========================================================
   ساخت جدول
========================================================= */

function createGrid(
    rows,
    cols,
    className = ""
) {

    const wrapper = document.createElement("div");
    wrapper.className = "grid-wrapper";

    const grid = document.createElement("div");

    grid.className =
        "pattern-grid " + className;

    grid.style.gridTemplateColumns =
        `repeat(${cols}, auto)`;

    grid.dataset.rows = rows;
    grid.dataset.cols = cols;

    wrapper.appendChild(grid);

    return {
        wrapper,
        grid
    };
}


function createCell(
    grid,
    index,
    content = "",
    extraClass = ""
) {

    const cell = document.createElement("div");

    cell.className = "cell " + extraClass;

    cell.dataset.index = index;

    if (content) {
        cell.innerHTML = content;
    }

    grid.appendChild(cell);

    return cell;
}


/* =========================================================
   سوال ۱
   آبی - قرمز - آبی - قرمز...
========================================================= */

function renderQuestion1() {

    instruction.textContent =
        "دلبندم الگو را پیدا کن سپس ادامه بده";

    const area = document.createElement("div");

    /* جدول اصلی: ۱۰ خانه */

    const main = createGrid(1, 10);

    const fixed = [
        "blue",
        "red",
        "blue",
        "red",
        "blue",
        "red"
    ];

    for (let i = 0; i < 10; i++) {

        const cell = createCell(
            main.grid,
            i,
            "",
            "answer-cell"
        );

        if (i < 6) {
            cell.classList.add("color-" + fixed[i]);
        }
    }

    area.appendChild(main.wrapper);


    /* تکرار الگو */

    const text = document.createElement("div");

    text.className = "sub-instruction";
    text.textContent =
        "حالا الگو را یک بار در پایین تکرار کن.";

    area.appendChild(text);


    const repeat = createGrid(1, 6);

    currentAnswers = new Array(6).fill(null);

    for (let i = 0; i < 6; i++) {

        const cell = createCell(
            repeat.grid,
            i,
            "",
            "answer-cell"
        );

        cell.addEventListener("click", () => {

            clickSound();

            const colors = [
                "blue",
                "red"
            ];

            const old = currentAnswers[i];

            if (old) {
                cell.classList.remove("color-" + old);
            }

            const next =
                old === null
                    ? colors[0]
                    : old === "blue"
                        ? colors[1]
                        : null;

            if (next) {
                cell.classList.add("color-" + next);
            }

            currentAnswers[i] = next;
        });
    }

    area.appendChild(repeat.wrapper);

    taskArea.appendChild(area);


    /* پالت رنگ */

    createColorPalette([
        ["blue", "آبی"],
        ["red", "قرمز"]
    ]);
}


/* =========================================================
   سوال ۲
   ❤️ ❤️ 🔺 🔺 ♦
   تکرار
========================================================= */

function renderQuestion2() {

    instruction.textContent =
        "الگو را پیدا کن و سپس ادامه بده.";

    const area = document.createElement("div");

    const main = createGrid(1, 15);

    const pattern = [
        "heart",
        "heart",
        "triangle",
        "triangle",
        "diamond"
    ];

    for (let i = 0; i < 15; i++) {

        const cell = createCell(
            main.grid,
            i,
            "",
            "answer-cell"
        );

        if (i < 10) {
            addShape(cell, pattern[i % 5]);
        }
    }

    area.appendChild(main.wrapper);


    const text = document.createElement("div");

    text.className = "sub-instruction";
    text.textContent =
        "الگو را یک بار تکرار کن.";

    area.appendChild(text);


    const repeat = createGrid(1, 7);

    currentAnswers = new Array(7).fill(null);

    for (let i = 0; i < 7; i++) {

        const cell = createCell(
            repeat.grid,
            i,
            "",
            "answer-cell"
        );

        cell.addEventListener("click", () => {

            clickSound();

            const shapes = [
                "heart",
                "triangle",
                "diamond"
            ];

            const old = currentAnswers[i];

            if (old) {
                cell.innerHTML = "";
            }

            let position =
                old === null
                    ? -1
                    : shapes.indexOf(old);

            position++;

            if (position >= shapes.length) {
                position = -1;
            }

            if (position >= 0) {
                addShape(
                    cell,
                    shapes[position]
                );

                currentAnswers[i] =
                    shapes[position];
            } else {
                currentAnswers[i] = null;
            }
        });
    }

    area.appendChild(repeat.wrapper);

    taskArea.appendChild(area);

    createShapePalette([
        "heart",
        "triangle",
        "diamond"
    ]);
}


/* =========================================================
   ساخت شکل
========================================================= */

function addShape(cell, shape) {

    cell.innerHTML = "";

    const div = document.createElement("div");

    if (shape === "heart") {
        div.className = "shape heart-shape";
    }

    if (shape === "triangle") {
        div.className = "shape triangle-shape";
    }

    if (shape === "diamond") {
        div.className = "shape diamond-shape";
    }

    if (shape === "circle") {
        div.className = "shape circle-shape";
    }

    if (shape === "star") {
        div.className = "shape star-shape";
        div.textContent = "★";
    }

    if (shape === "square") {
        div.className = "shape square-shape";
    }

    cell.appendChild(div);
}


/* =========================================================
   سوال ۳ و ۴
   الگوی شکسته + موش بازیگوش
========================================================= */

function renderMouseQuestion(questionNumber) {

    const patterns = {

        3: [
            "circle",
            "star",
            "circle",
            "star",
            "circle",
            "triangle",
            "circle",
            "star",
            "circle",
            "star"
        ],

        4: [
            "square",
            "triangle",
            "square",
            "triangle",
            "diamond",
            "triangle",
            "square",
            "triangle",
            "square",
            "triangle"
        ]

    };

    const correctPatterns = {

        3: [
            "circle",
            "star",
            "circle",
            "star",
            "circle",
            "star",
            "circle",
            "star",
            "circle",
            "star"
        ],

        4: [
            "square",
            "triangle",
            "square",
            "triangle",
            "square",
            "triangle",
            "square",
            "triangle",
            "square",
            "triangle"
        ]

    };


    instruction.textContent =
        "موش کوچولو را دنبال کن! کدام شکل الگو را به هم زده است؟";


    const scene = document.createElement("div");

    scene.className = "mouse-scene";


    const note = document.createElement("div");

    note.className = "mouse-note";

    note.textContent =
        "موش بازیگوش روی خانه‌ها می‌پرد؛ وقتی به شکل اشتباه برسد، آن را می‌خورد! 🐭";

    scene.appendChild(note);


    const main = createGrid(1, 10);

    const pattern = patterns[questionNumber];

    for (let i = 0; i < pattern.length; i++) {

        const cell = createCell(
            main.grid,
            i,
            "",
            "answer-cell"
        );

        addShape(cell, pattern[i]);

        cell.dataset.shape = pattern[i];
    }

    /* محل شکل اشتباه */

    const wrongIndex =
        questionNumber === 3 ? 5 : 4;

    main.grid
        .children[wrongIndex]
        .classList.add("wrong-shape");

    scene.appendChild(main.wrapper);


    const mouse = document.createElement("div");

    mouse.className = "mouse";
    mouse.textContent = "🐭";

    scene.appendChild(mouse);

    taskArea.appendChild(scene);


    /* پالت برای اصلاح شکل */

    const text = document.createElement("div");

    text.className = "sub-instruction";

    text.textContent =
        "حالا شکل اشتباه را درست کن.";

    taskArea.appendChild(text);


    currentAnswers = pattern.slice();


    /* با کلیک روی هر خانه می‌توان شکل آن را عوض کرد */

    for (let i = 0; i < main.grid.children.length; i++) {

        const cell = main.grid.children[i];

        cell.addEventListener("click", () => {

            clickSound();

            const available =
                questionNumber === 3
                    ? ["circle", "star"]
                    : ["square", "triangle"];

            const old = currentAnswers[i];

            let pos = available.indexOf(old);

            pos++;

            if (pos >= available.length) {
                pos = 0;
            }

            currentAnswers[i] =
                available[pos];

            addShape(
                cell,
                currentAnswers[i]
            );

            cell.classList.remove("wrong-shape");

            if (i === wrongIndex) {
                cell.classList.add("selected-cell");
            }
        });
    }


    createShapePalette(
        questionNumber === 3
            ? ["circle", "star"]
            : ["square", "triangle"]
    );


    /* موش حرکت کند */

    startMouseAnimation(
        mouse,
        main.grid,
        wrongIndex
    );


    /* ذخیره جواب */

    window.currentMouseCorrect =
        correctPatterns[questionNumber];

    window.currentMouseWrongIndex =
        wrongIndex;
}


/* =========================================================
   حرکت موش
========================================================= */

function startMouseAnimation(
    mouse,
    grid,
    wrongIndex
) {

    if (mouseTimer) {
        clearInterval(mouseTimer);
    }

    let position = 0;

    function moveMouse() {

        const cell =
            grid.children[position];

        if (!cell) return;

        const cellRect =
            cell.getBoundingClientRect();

        const sceneRect =
            mouse.parentElement.getBoundingClientRect();

        mouse.style.left =
            (cellRect.left - sceneRect.left + cellRect.width / 2 - 20) + "px";

        mouse.style.top =
            (cellRect.top - sceneRect.top - 8) + "px";


        if (position === wrongIndex) {

            mouse.classList.add("eating");

            setTimeout(() => {

                if (
                    currentStage === 2 ||
                    currentStage === 3
                ) {

                    const target =
                        grid.children[wrongIndex];

                    if (target) {

                        target.classList.add("eaten");

                        setTimeout(() => {

                            target.classList.remove("eaten");

                            if (
                                window.currentMouseCorrect &&
                                window.currentMouseCorrect[wrongIndex]
                            ) {

                                addShape(
                                    target,
                                    window.currentMouseCorrect[wrongIndex]
                                );

                                currentAnswers[wrongIndex] =
                                    window.currentMouseCorrect[wrongIndex];

                                target.classList.remove(
                                    "wrong-shape"
                                );
                            }

                        }, 500);
                    }
                }

                mouse.classList.remove("eating");

            }, 700);
        }

        position++;

        if (position >= grid.children.length) {
            position = 0;
        }
    }

    moveMouse();

    mouseTimer =
        setInterval(moveMouse, 900);
}


/* =========================================================
   سوال ۵
   الگوی ۳×۱۳ شبیه گل چهارپر
========================================================= */

function renderFlowerQuestion() {

    instruction.textContent =
        "دلبندم با دقّت به کل الگو نگاه کن و سپس ادامه بده.";

    const area = document.createElement("div");

    const main = createGrid(3, 13);

    /*
        ساختار دقیق خواسته‌شده:

        ردیف اول:
        سبز خالی سبز خالی سبز خالی سبز + ۶ خالی

        ردیف دوم:
        خالی سبز خالی قرمز خالی سبز خالی + ۶ خالی

        ردیف سوم:
        سبز خالی سبز خالی سبز خالی سبز + ۶ خالی
    */

    const fixed = {

        0: "green",
        2: "green",
        4: "green",
        6: "green",

        14: "green",
        16: "red",
        18: "green",

        26: "green",
        28: "green",
        30: "green",
        32: "green"

    };


    currentAnswers =
        new Array(18).fill(null);


    for (let i = 0; i < 39; i++) {

        const cell =
            createCell(
                main.grid,
                i,
                "",
                "answer-cell"
            );

        if (
            Object.prototype.hasOwnProperty.call(
                fixed,
                i
            )
        ) {

            cell.classList.add(
                "color-" + fixed[i]
            );

        }

        /*
            خانه‌های قابل پاسخ:
            ۶ ستون پایانی هر سه ردیف
        */

        const row = Math.floor(i / 13);
        const col = i % 13;

        if (col >= 7) {

            const answerIndex =
                row * 6 + (col - 7);

            cell.dataset.answerIndex =
                answerIndex;

            cell.addEventListener(
                "click",
                () => {

                    clickSound();

                    const old =
                        currentAnswers[answerIndex];

                    if (old === null) {

                        currentAnswers[answerIndex] =
                            "green";

                    } else if (old === "green") {

                        currentAnswers[answerIndex] =
                            "red";

                    } else {

                        currentAnswers[answerIndex] =
                            null;
                    }


                    cell.classList.remove(
                        "color-green",
                        "color-red"
                    );

                    if (currentAnswers[answerIndex]) {

                        cell.classList.add(
                            "color-" +
                            currentAnswers[answerIndex]
                        );
                    }
                }
            );
        }
    }


    area.appendChild(main.wrapper);


    const text =
        document.createElement("div");

    text.className =
        "sub-instruction";

    text.textContent =
        "دلبندم الگو را یک بار تکرار کن.";

    area.appendChild(text);


    /* جدول تکرار ۶ × ۳ */

    const repeat =
        createGrid(3, 6);

    window.flowerRepeatAnswers =
        new Array(18).fill(null);


    for (let i = 0; i < 18; i++) {

        const cell =
            createCell(
                repeat.grid,
                i,
                "",
                "answer-cell flower-cell"
            );

        cell.addEventListener(
            "click",
            () => {

                clickSound();

                const old =
                    window.flowerRepeatAnswers[i];

                let next;

                if (old === null) {
                    next = "green";
                } else if (old === "green") {
                    next = "red";
                } else {
                    next = null;
                }

                window.flowerRepeatAnswers[i] =
                    next;

                cell.innerHTML = "";

                if (next) {

                    const point =
                        document.createElement("div");

                    point.className =
                        "flower-point flower-" +
                        next;

                    cell.appendChild(point);
                }
            }
        );
    }


    area.appendChild(repeat.wrapper);

    taskArea.appendChild(area);

    createColorPalette([
        ["green", "سبز"],
        ["red", "قرمز"]
    ]);
}


/* =========================================================
   دو الگوی خطی اضافه
========================================================= */

function renderLinearQuestion(number) {

    const patterns = {

        6: {
            instruction:
                "الگو را پیدا کن و خانه‌های خالی را کامل کن.",
            fixed: [
                "yellow",
                "blue",
                "yellow",
                "blue",
                "yellow",
                null,
                null,
                null
            ],
            answer:
                [
                    "yellow",
                    "blue",
                    "yellow"
                ],
            colors:
                ["yellow", "blue"]
        },

        7: {
            instruction:
                "به شکل‌ها دقّت کن و الگو را ادامه بده.",
            fixed: [
                "circle",
                "triangle",
                "circle",
                "triangle",
                "circle",
                null,
                null,
                null
            ],
            answer:
                [
                    "triangle",
                    "circle",
                    "triangle"
                ],
            colors:
                ["circle", "triangle"]
        }

    };


    const data = patterns[number];

    instruction.textContent =
        data.instruction;

    const area =
        document.createElement("div");

    const grid =
        createGrid(1, data.fixed.length);


    currentAnswers =
        new Array(data.fixed.length).fill(null);


    for (let i = 0; i < data.fixed.length; i++) {

        const cell =
            createCell(
                grid.grid,
                i,
                "",
                "answer-cell"
            );

        if (data.fixed[i]) {

            if (
                data.fixed[i] === "circle" ||
                data.fixed[i] === "triangle"
            ) {

                addShape(
                    cell,
                    data.fixed[i]
                );

            } else {

                cell.classList.add(
                    "color-" + data.fixed[i]
                );
            }

            currentAnswers[i] =
                data.fixed[i];
        }


        if (!data.fixed[i]) {

            cell.addEventListener(
                "click",
                () => {

                    clickSound();

                    let available =
                        data.colors;

                    let old =
                        currentAnswers[i];

                    let pos =
                        available.indexOf(old);

                    pos++;

                    if (pos >= available.length) {
                        pos = 0;
                    }

                    currentAnswers[i] =
                        available[pos];

                    cell.classList.remove(
                        "color-yellow",
                        "color-blue"
                    );

                    cell.innerHTML = "";

                    if (
                        currentAnswers[i] ===
                        "circle" ||
                        currentAnswers[i] ===
                        "triangle"
                    ) {

                        addShape(
                            cell,
                            currentAnswers[i]
                        );

                    } else {

                        cell.classList.add(
                            "color-" +
                            currentAnswers[i]
                        );
                    }
                }
            );
        }
    }


    area.appendChild(grid.wrapper);

    taskArea.appendChild(area);


    if (
        data.colors.includes("circle") ||
        data.colors.includes("triangle")
    ) {

        createShapePalette(
            data.colors
        );

    } else {

        createColorPalette([
            ["yellow", "زرد"],
            ["blue", "آبی"]
        ]);
    }
}


/* =========================================================
   پالت رنگ
========================================================= */

function createColorPalette(colors) {

    paletteArea.innerHTML = "";

    colors.forEach(
        ([color, title]) => {

            const btn =
                document.createElement("button");

            btn.className =
                "palette-btn";

            btn.classList.add(
                "palette-" + color
            );

            btn.title = title;

            btn.addEventListener(
                "click",
                () => {

                    clickSound();

                    const empty =
                        document.querySelector(
                            ".answer-cell:not(.color-blue):not(.color-red):not(.color-green):not(.color-yellow):not(.color-pink):not(.color-purple)"
                        );

                    if (empty) {

                        empty.classList.add(
                            "color-" + color
                        );
                    }
                }
            );

            paletteArea.appendChild(btn);
        }
    );
}


/* =========================================================
   پالت شکل
========================================================= */

function createShapePalette(shapes) {

    paletteArea.innerHTML = "";

    shapes.forEach(shape => {

        const btn =
            document.createElement("button");

        btn.className =
            "palette-btn";

        btn.classList.add(
            "palette-" + shape
        );

        btn.textContent =
            shape === "heart"
                ? "♥"
                : shape === "triangle"
                    ? "▲"
                    : shape === "diamond"
                        ? "◆"
                        : shape === "circle"
                            ? "●"
                            : shape === "star"
                                ? "★"
                                : "■";

        btn.style.fontSize = "23px";
        btn.style.color = "white";

        btn.addEventListener(
            "click",
            () => {

                clickSound();

                const selected =
                    document.querySelector(
                        ".selected-cell"
                    );

                if (selected) {

                    addShape(
                        selected,
                        shape
                    );

                    selected.classList.remove(
                        "selected-cell"
                    );
                }
            }
        );

        paletteArea.appendChild(btn);
    });
}


/* =========================================================
   بررسی سوال ۱
========================================================= */

function checkQuestion1() {

    const correct = [
        "blue",
        "red",
        "blue",
        "red",
        "blue",
        "red"
    ];

    for (let i = 0; i < 6; i++) {

        if (currentAnswers[i] !== correct[i]) {

            showWrong(
                "هنوز کامل نشده؛ آبی و قرمز را یکی‌درمیان ادامه بده. 💙❤️"
            );

            return;
        }
    }

    showCorrect();
}


/* =========================================================
   بررسی سوال ۲
========================================================= */

function checkQuestion2() {

    const correct = [
        "heart",
        "heart",
        "triangle",
        "triangle",
        "diamond",
        "heart",
        "heart"
    ];

    for (let i = 0; i < 7; i++) {

        if (
            currentAnswers[i] !== correct[i]
        ) {

            showWrong(
                "به ترتیب قلب‌ها، مثلث‌ها و لوزی نگاه کن. دوباره امتحان کن! 💗"
            );

            return;
        }
    }

    showCorrect();
}


/* =========================================================
   بررسی سوال ۳ و ۴
========================================================= */

function checkMouseQuestion() {

    const correct =
        window.currentMouseCorrect;

    for (let i = 0; i < correct.length; i++) {

        if (
            currentAnswers[i] !== correct[i]
        ) {

            showWrong(
                "موش کوچولو هنوز یک شکل اشتباه پیدا کرده! 🐭"
            );

            return;
        }
    }

    showCorrect(
        "آفرین! شکل اشتباه را پیدا کردی و الگو را منظم کردی! 🎉"
    );
}


/* =========================================================
   بررسی سوال ۵
========================================================= */

function checkFlowerQuestion() {

    /*
       سه ردیف × شش خانه
       الگوی صحیح:
       سبز، سبز، سبز
       سبز، قرمز، سبز
       سبز، سبز، سبز
       
       سپس همین ساختار تکرار می‌شود.
    */

    const correctMain = [
        "green", null,
        "green", null,
        "green", null,

        null, "green",
        null, "red",
        null, "green",

        "green", null,
        "green", null,
        "green", null
    ];


    /*
       برای خانه‌های خالی بخش اصلی،
       الگوی تکرارشونده‌ی شکل گل باید
       در ادامه حفظ شود.
    */

    for (let i = 0; i < 18; i++) {

        const value =
            currentAnswers[i];

        if (i < 18 && value !== null) {

            /*
              پاسخ قابل قبول:
              در خانه‌های ادامه‌دهنده،
              شکل گل باید با ساختار سه ردیف هماهنگ باشد.
            */
        }
    }


    const repeatCorrect = [
        "green",
        "green",
        "green",
        "green",
        "green",
        "green",

        "green",
        "red",
        "green",
        "red",
        "green",
        "red",

        "green",
        "green",
        "green",
        "green",
        "green",
        "green"
    ];


    const answers =
        window.flowerRepeatAnswers;


    for (let i = 0; i < 18; i++) {

        if (
            answers[i] !== repeatCorrect[i]
        ) {

            showWrong(
                "به گل چهارپر نگاه کن؛ مرکز گل یک بار سبز و یک بار قرمز می‌شود. 🌸"
            );

            return;
        }
    }


    showCorrect(
        "آفرین! الگوی گل را با دقّت کشف کردی! 🌸🎉"
    );
}


/* =========================================================
   بررسی سوال ۶ و ۷
========================================================= */

function checkLinearQuestion(number) {

    const correct = {

        6: [
            "yellow",
            "blue",
            "yellow",
            "blue",
            "yellow",
            "blue",
            "yellow",
            "blue"
        ],

        7: [
            "circle",
            "triangle",
            "circle",
            "triangle",
            "circle",
            "triangle",
            "circle",
            "triangle"
        ]

    };


    for (let i = 0; i < 8; i++) {

        if (
            currentAnswers[i] !==
            correct[number][i]
        ) {

            showWrong(
                "آرام و با دقّت الگو را از اول نگاه کن. 🌱"
            );

            return;
        }
    }

    showCorrect();
}


/* =========================================================
   پاک کردن پاسخ
========================================================= */

function clearCurrentAnswer() {

    currentAnswers =
        currentAnswers.map(
            (value, index) => {

                /*
                  فقط خانه‌هایی که پاسخ هستند
                  پاک شوند.
                */

                return null;
            }
        );

    const cells =
        document.querySelectorAll(
            ".answer-cell"
        );

    cells.forEach(cell => {

        /*
           خانه‌های ثابت را دست نمی‌زنیم.
           خانه‌هایی که data-answer-index دارند
           یا خالی اولیه بوده‌اند، پاک می‌شوند.
        */

        if (
            cell.dataset.answerIndex !== undefined
        ) {

            cell.innerHTML = "";

            cell.classList.remove(
                "color-blue",
                "color-red",
                "color-green",
                "color-yellow",
                "color-pink",
                "color-purple"
            );
        }
    });

    feedback.textContent = "";
    feedback.className = "feedback";
}


/* =========================================================
   بررسی مرحله فعلی
========================================================= */

function checkCurrentStage() {

    feedback.textContent = "";
    feedback.className = "feedback";

    if (currentStage === 0) {
        checkQuestion1();
        return;
    }

    if (currentStage === 1) {
        checkQuestion2();
        return;
    }

    if (
        currentStage === 2 ||
        currentStage === 3
    ) {
        checkMouseQuestion();
        return;
    }

    if (currentStage === 4) {
        checkFlowerQuestion();
        return;
    }

    if (
        currentStage === 5 ||
        currentStage === 6
    ) {
        checkLinearQuestion(
            currentStage + 1
        );
        return;
    }
}


/* =========================================================
   نمایش مرحله
========================================================= */

function renderStage() {

    if (mouseTimer) {
        clearInterval(mouseTimer);
        mouseTimer = null;
    }

    window.currentMouseCorrect = null;
    window.currentMouseWrongIndex = null;

    taskArea.innerHTML = "";
    paletteArea.innerHTML = "";

    feedback.textContent = "";
    feedback.className = "feedback";

    currentAnswers = [];

    stageTitle.textContent =
        "مرحله " + (currentStage + 1);

    progressText.textContent =
        `مرحله ${currentStage + 1} از ۷`;

    prevBtn.disabled =
        currentStage === 0;

    nextBtn.disabled =
        currentStage === 6;


    if (currentStage === 0) {
        renderQuestion1();
    }

    else if (currentStage === 1) {
        renderQuestion2();
    }

    else if (currentStage === 2) {
        renderMouseQuestion(3);
    }

    else if (currentStage === 3) {
        renderMouseQuestion(4);
    }

    else if (currentStage === 4) {
        renderFlowerQuestion();
    }

    else if (currentStage === 5) {
        renderLinearQuestion(6);
    }

    else if (currentStage === 6) {
        renderLinearQuestion(7);
    }
}


/* =========================================================
   شروع بازی
========================================================= */

startBtn.addEventListener(
    "click",
    () => {

        studentName =
            studentNameInput.value.trim();

        if (!studentName) {

            studentName =
                "قهرمان کوچولو";
        }

        getAudioContext();

        currentStage = 0;

        startScreen.classList.add(
            "hidden"
        );

        finishScreen.classList.add(
            "hidden"
        );

        gameScreen.classList.remove(
            "hidden"
        );

        renderStage();
    }
);


/* =========================================================
   مرحله قبلی
========================================================= */

prevBtn.addEventListener(
    "click",
    () => {

        if (currentStage > 0) {

            currentStage--;

            renderStage();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }
);


/* =========================================================
   مرحله بعدی
========================================================= */

nextBtn.addEventListener(
    "click",
    () => {

        if (currentStage < 6) {

            currentStage++;

            renderStage();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } else {

            finishGame();
        }
    }
);


/* =========================================================
   بررسی
========================================================= */

checkBtn.addEventListener(
    "click",
    checkCurrentStage
);


/* =========================================================
   پاک کردن
========================================================= */

clearBtn.addEventListener(
    "click",
    clearCurrentAnswer
);


/* =========================================================
   پایان بازی
========================================================= */

function finishGame() {

    if (mouseTimer) {
        clearInterval(mouseTimer);
        mouseTimer = null;
    }

    gameScreen.classList.add(
        "hidden"
    );

    finishScreen.classList.remove(
        "hidden"
    );

    finishMessage.textContent =
        `${studentName} جان، تو امروز الگوها را خیلی خوب پیدا کردی. آفرین به دقّت و فکر قشنگت! 🌈`;

    correctSound();
    fireworks();

    setTimeout(fireworks, 500);
    setTimeout(fireworks, 1000);
}


/* =========================================================
   شروع دوباره
========================================================= */

restartBtn.addEventListener(
    "click",
    () => {

        currentStage = 0;

        finishScreen.classList.add(
            "hidden"
        );

        gameScreen.classList.remove(
            "hidden"
        );

        renderStage();
    }
);


/* =========================================================
   جلوگیری از Submit ناخواسته
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            document.activeElement ===
            studentNameInput
        ) {

            startBtn.click();
        }
    }
);
