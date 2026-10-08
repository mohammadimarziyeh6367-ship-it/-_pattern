"use strict";

/* =====================================
   الگوی منظم | ریاضی پایه اول
   نسخه بازسازی‌شده
   ===================================== */

const TOTAL_STAGES = 7;

const COLORS = {
    blue: "#42a5f5",
    red: "#ef5350",
    green: "#58c86b",
    yellow: "#ffd84d",
    pink: "#ff73ad",
    purple: "#9c64e8"
};

const SHAPES = {
    heart: "♥",
    triangle: "▲",
    diamond: "◆",
    circle: "●",
    star: "★",
    square: "■"
};

const COLOR_NAMES = {
    blue: "آبی",
    red: "قرمز",
    green: "سبز",
    yellow: "زرد",
    pink: "صورتی",
    purple: "بنفش"
};

const SHAPE_NAMES = {
    heart: "قلب",
    triangle: "مثلث",
    diamond: "لوزی",
    circle: "دایره",
    star: "ستاره",
    square: "مربع"
};

const $ = (id) => document.getElementById(id);

const startScreen = $("startScreen");
const gameScreen = $("gameScreen");
const finishScreen = $("finishScreen");

const studentNameInput = $("studentName");
const startBtn = $("startBtn");
const prevBtn = $("prevBtn");
const nextBtn = $("nextBtn");
const restartBtn = $("restartBtn");
const clearBtn = $("clearBtn");
const checkBtn = $("checkBtn");

const stageTitle = $("stageTitle");
const progressText = $("progressText");
const instruction = $("instruction");
const taskArea = $("taskArea");
const paletteArea = $("paletteArea");
const feedback = $("feedback");
const finishMessage = $("finishMessage");
const stageGoal = $("stageGoal");
const celebrationLayer = $("celebrationLayer");

let currentStage = 1;
let studentName = "";
let selectedValue = null;
let stageSolved = false;
let mousePuzzleSolved = false;
let mousePointerState = null;


/* =====================================
   ابزارهای عمومی
   ===================================== */

function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined && text !== null) {
        element.textContent = text;
    }

    return element;
}

function setFeedback(message, type = "normal") {
    feedback.textContent = message;

    if (type === "success") {
        feedback.style.color = "#16803d";
    } else if (type === "error") {
        feedback.style.color = "#d53c52";
    } else {
        feedback.style.color = "#7438c8";
    }
}

function getCellValue(cell) {
    return cell.dataset.value || "";
}

function applyValue(cell, value) {
    cell.classList.remove(
        "color-blue",
        "color-red",
        "color-green",
        "color-yellow",
        "color-pink",
        "color-purple"
    );

    cell.removeAttribute("data-shape");
    cell.textContent = "";

    cell.dataset.value = value || "";

    if (!value) {
        return;
    }

    if (Object.prototype.hasOwnProperty.call(COLORS, value)) {
        cell.classList.add("color-" + value);
        return;
    }

    if (Object.prototype.hasOwnProperty.call(SHAPES, value)) {
        cell.dataset.shape = value;
        cell.textContent = SHAPES[value];
    }
}

function resetStageState() {
    selectedValue = null;
    stageSolved = false;
    mousePuzzleSolved = false;
    mousePointerState = null;

    setFeedback("");
    paletteArea.innerHTML = "";
    taskArea.innerHTML = "";

    checkBtn.disabled = false;
    clearBtn.disabled = false;

    stageGoal.classList.toggle("hidden", currentStage !== 7);
}

function updateHeader() {
    stageTitle.textContent = "مرحله " + toPersianNumber(currentStage);
    progressText.textContent =
        "مرحله " + toPersianNumber(currentStage) +
        " از " + toPersianNumber(TOTAL_STAGES);

    prevBtn.disabled = currentStage === 1;
    nextBtn.textContent =
        currentStage === TOTAL_STAGES ? "پایان 🏆" : "بعدی ▶";
}

function toPersianNumber(number) {
    return String(number).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
}


/* =====================================
   ساخت جدول الگو
   ===================================== */

function createGrid(rows, cols, className = "") {
    const wrapper = makeElement("div", "grid-wrapper");
    const grid = makeElement("div", "pattern-grid " + className);

    grid.style.gridTemplateColumns =
        "repeat(" + cols + ", minmax(0, 1fr))";

    grid.dataset.rows = String(rows);
    grid.dataset.cols = String(cols);

    wrapper.appendChild(grid);

    return {
        wrapper,
        grid
    };
}

function createCell(value, answer = false, index = 0) {
    const cell = makeElement("button", "cell");

    cell.type = "button";
    cell.dataset.index = String(index);
    cell.dataset.value = value || "";

    if (answer) {
        cell.classList.add("answer-cell");
        cell.dataset.answer = "true";
        cell.dataset.expected = "";
        cell.setAttribute("aria-label", "خانه پاسخ");
    } else {
        cell.dataset.answer = "false";
    }

    applyValue(cell, value || "");

    return cell;
}

function createPatternRow(values, fixedCount, rowIndex = 0) {
    const fragment = document.createDocumentFragment();

    values.forEach((value, index) => {
        const isAnswer = index >= fixedCount;
        const cell = createCell(isAnswer ? "" : value, isAnswer, index);

        cell.dataset.row = String(rowIndex);
        cell.dataset.expected = value || "";

        if (isAnswer) {
            cell.addEventListener("click", () => handleAnswerCell(cell));
        }

        fragment.appendChild(cell);
    });

    return fragment;
}

function handleAnswerCell(cell) {
    if (stageSolved) {
        return;
    }

    if (selectedValue === null) {
        setFeedback("اول یک رنگ یا شکل انتخاب کن. 🌈");
        return;
    }

    applyValue(cell, selectedValue);
    cell.classList.add("answered");
    cell.setAttribute("aria-label", "خانه پاسخ انتخاب شده");

    setFeedback("خوب است! همه خانه‌ها را کامل کن. 💜");
}

function addPaletteButton(value, label, className, displayText) {
    const button = makeElement(
        "button",
        "palette-btn " + (className || ""),
        displayText
    );

    button.type = "button";
    button.title = label;
    button.setAttribute("aria-label", label);

    button.addEventListener("click", () => {
        selectedValue = value;

        document.querySelectorAll(".palette-btn").forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        setFeedback("حالا خانه‌های خالی را کامل کن. ✨");
    });

    paletteArea.appendChild(button);

    return button;
}

function addColorPalette(colorList) {
    colorList.forEach((color) => {
        addPaletteButton(
            color,
            COLOR_NAMES[color],
            "palette-" + color,
            ""
        );
    });
}

function addShapePalette(shapeList) {
    shapeList.forEach((shape) => {
        addPaletteButton(
            shape,
            SHAPE_NAMES[shape],
            "palette-" + shape,
            SHAPES[shape]
        );
    });
}

function addGreenAndEmptyPalette() {
    addPaletteButton(
        "green",
        "خانه سبز",
        "palette-green",
        ""
    );

    addPaletteButton(
        "",
        "خانه خالی",
        "palette-empty",
        "□"
    );
}


/* =====================================
   الگوهای رنگی و شکلی
   ===================================== */

function renderSimplePattern(options) {
    instruction.textContent = options.instruction;

    const { wrapper, grid } = createGrid(
        options.rows || 1,
        options.cols,
        options.gridClass || ""
    );

    if (options.rows === 3) {
        grid.style.gridTemplateColumns =
            "repeat(" + options.cols + ", minmax(0, 1fr))";
    }

    options.values.forEach((value, index) => {
        const isAnswer = index >= options.fixedCount;
        const cell = createCell(isAnswer ? "" : value, isAnswer, index);

        cell.dataset.expected = value || "";

        if (isAnswer) {
            cell.addEventListener("click", () => handleAnswerCell(cell));
        }

        grid.appendChild(cell);
    });

    taskArea.appendChild(wrapper);

    if (options.paletteType === "color") {
        addColorPalette(options.palette);
    } else if (options.paletteType === "shape") {
        addShapePalette(options.palette);
    } else if (options.paletteType === "green-empty") {
        addGreenAndEmptyPalette();
    }
}


/* =====================================
   مرحله ۱
   الگوی رنگی آبی و قرمز
   ===================================== */

function renderStage1() {
    const values = [];

    for (let i = 0; i < 10; i++) {
        values.push(i % 2 === 0 ? "blue" : "red");
    }

    renderSimplePattern({
        instruction: "الگو را پیدا کن و رنگ خانه‌های خالی را کامل کن.",
        rows: 1,
        cols: 10,
        values,
        fixedCount: 6,
        paletteType: "color",
        palette: ["blue", "red"]
    });
}


/* =====================================
   مرحله ۲
   الگوی قلب، مثلث و لوزی
   ===================================== */

function renderStage2() {
    const unit = [
        "heart",
        "heart",
        "triangle",
        "triangle",
        "diamond"
    ];

    const values = [];

    for (let i = 0; i < 15; i++) {
        values.push(unit[i % unit.length]);
    }

    renderSimplePattern({
        instruction: "به شکل‌ها دقت کن؛ الگو را پیدا کن و ادامه بده.",
        rows: 1,
        cols: 15,
        values,
        fixedCount: 10,
        paletteType: "shape",
        palette: ["heart", "triangle", "diamond"]
    });
}


/* =====================================
   مرحله‌های ۳ و ۴
   معمای موش و پنیر
   ===================================== */

function renderMousePuzzle(stage) {
    const scene = makeElement("div", "mouse-scene");

    const note = makeElement(
        "p",
        "mouse-note",
        "موش را با انگشت یا ماوس بگیر و روی آجر اشتباه ببر تا پنیر پیدا شود! 🐭"
    );

    scene.appendChild(note);

    const { wrapper, grid } = createGrid(1, 10, "mouse-grid");

    const sequence = stage === 3
        ? [
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
        ]
        : [
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
        ];

    const wrongIndex = stage === 3 ? 5 : 4;

    sequence.forEach((shape, index) => {
        const cell = createCell(shape, false, index);

        cell.classList.add("brick-target");
        cell.dataset.shape = shape;
        cell.dataset.wrong = index === wrongIndex ? "true" : "false";

        const span = makeElement("span", "shape-content", SHAPES[shape]);
        cell.textContent = "";
        cell.appendChild(span);

        grid.appendChild(cell);
    });

    scene.appendChild(wrapper);

    const mouse = makeElement("div", "mouse", "🐭");
    mouse.setAttribute("role", "button");
    mouse.setAttribute("aria-label", "موش را بکش");
    mouse.setAttribute("tabindex", "0");

    scene.appendChild(mouse);
    taskArea.appendChild(scene);

    const paletteNote = makeElement(
        "div",
        "mouse-note",
        stage === 3
            ? "کدام آجر نظم شکل‌ها را به هم زده است؟"
            : "کدام شکل با الگوی تکراری هماهنگ نیست؟"
    );

    paletteArea.appendChild(paletteNote);

    enableMouseDrag(mouse, scene, grid, wrongIndex);
}

function enableMouseDrag(mouse, scene, grid, wrongIndex) {
    mouse.addEventListener("pointerdown", (event) => {
        if (mousePuzzleSolved) {
            return;
        }

        event.preventDefault();

        const mouseRect = mouse.getBoundingClientRect();

        mousePointerState = {
            pointerId: event.pointerId,
            offsetX: event.clientX - mouseRect.left,
            offsetY: event.clientY - mouseRect.top
        };

        mouse.classList.add("dragging");

        try {
            mouse.setPointerCapture(event.pointerId);
        } catch (error) {
            // بعضی مرورگرها نیازی به pointer capture ندارند.
        }
    });

    mouse.addEventListener("pointermove", (event) => {
        if (
            !mousePointerState ||
            mousePointerState.pointerId !== event.pointerId
        ) {
            return;
        }

        event.preventDefault();

        const sceneRect = scene.getBoundingClientRect();

        const x =
            event.clientX -
            sceneRect.left -
            mousePointerState.offsetX;

        const y =
            event.clientY -
            sceneRect.top -
            mousePointerState.offsetY;

        mouse.style.left = Math.max(
            0,
            Math.min(scene.clientWidth - mouse.offsetWidth, x)
        ) + "px";

        mouse.style.top = Math.max(
            0,
            Math.min(scene.clientHeight - mouse.offsetHeight, y)
        ) + "px";
    });

    mouse.addEventListener("pointerup", (event) => {
        if (
            !mousePointerState ||
            mousePointerState.pointerId !== event.pointerId
        ) {
            return;
        }

        mousePointerState = null;
        mouse.classList.remove("dragging");

        const target = getBrickUnderPointer(event.clientX, event.clientY);

        if (!target || !grid.contains(target)) {
            return;
        }

        const index = Number(target.dataset.index);

        if (index === wrongIndex) {
            revealCheese(target, scene, mouse);
        } else {
            setFeedback("هنوز نه! با دقت بیشتری به الگو نگاه کن. 🧐", "error");
        }
    });

    mouse.addEventListener("pointercancel", () => {
        mousePointerState = null;
        mouse.classList.remove("dragging");
    });
}

function getBrickUnderPointer(x, y) {
    const elements = document.elementsFromPoint(x, y);

    for (const element of elements) {
        if (element.classList && element.classList.contains("brick-target")) {
            return element;
        }

        if (element.closest) {
            const cell = element.closest(".brick-target");

            if (cell) {
                return cell;
            }
        }
    }

    return null;
}

function revealCheese(cell, scene, mouse) {
    if (mousePuzzleSolved) {
        return;
    }

    mousePuzzleSolved = true;
    stageSolved = true;

    cell.classList.add("brick-falling");

    window.setTimeout(() => {
        cell.classList.remove("brick-falling");
        cell.classList.add("cheese-revealed");
    }, 350);

    mouse.textContent = "🐭";
    mouse.classList.add("happy");

    scene.classList.add("solved");

    const message = makeElement(
        "div",
        "mouse-success-message",
        "آفرین! آجر اشتباه را پیدا کردی! 🧀🎉"
    );

    scene.appendChild(message);

    setFeedback("عالی بود! معما را حل کردی. 🌟", "success");

    checkBtn.disabled = true;
    clearBtn.disabled = true;

    celebrate();
}


/* =====================================
   مرحله ۵
   الگوی گل‌ها
   ===================================== */

function renderStage5() {
    const values = [];

    for (let i = 0; i < 39; i++) {
        values.push(i % 2 === 0 ? "pink" : "yellow");
    }

    renderSimplePattern({
        instruction: "رنگ گل‌ها را بررسی کن و الگو را کامل کن.",
        rows: 3,
        cols: 13,
        values,
        fixedCount: 18,
        paletteType: "color",
        palette: ["pink", "yellow"]
    });
}


/* =====================================
   مرحله ۶
   الگوی زرد و آبی
   ===================================== */

function renderStage6() {
    const values = [];

    for (let i = 0; i < 12; i++) {
        values.push(i % 2 === 0 ? "yellow" : "blue");
    }

    renderSimplePattern({
        instruction: "الگوی زرد و آبی را پیدا کن و ادامه بده.",
        rows: 1,
        cols: 12,
        values,
        fixedCount: 8,
        paletteType: "color",
        palette: ["yellow", "blue"]
    });
}


/* =====================================
   مرحله ۷
   معمای منطقی دو ردیفی
   ===================================== */

function renderStage7() {
    instruction.textContent =
        "کارآگاه کوچولو! هر دو ردیف را بررسی کن و الگو را دو بار ادامه بده.";

    const wrapper = makeElement("div", "grid-wrapper");
    const grid = makeElement("div", "pattern-grid logic-grid");

    grid.style.gridTemplateColumns =
        "repeat(15, minmax(0, 1fr))";

    /*
      ردیف اول:
      سبز، سبز، خالی
      سبز، سبز، خالی
      سبز، سبز، خالی
      سپس دو بار دیگر تکرار می‌شود.
    */

    const rowOne = [];

    for (let i = 0; i < 15; i++) {
        rowOne.push(i % 3 === 2 ? "" : "green");
    }

    /*
      ردیف دوم:
      خالی، سبز، سبز
      خالی، سبز، سبز
      خالی، سبز، سبز
      سپس دو بار دیگر تکرار می‌شود.

      در نتیجه شروع الگوی ردیف دوم
      نسبت به ردیف اول یک خانه جابه‌جا است.
    */

    const rowTwo = [];

    for (let i = 0; i < 15; i++) {
        rowTwo.push(i % 3 === 0 ? "" : "green");
    }

    const fixedCount = 9;

    [rowOne, rowTwo].forEach((rowValues, rowIndex) => {
        rowValues.forEach((value, colIndex) => {
            const isAnswer = colIndex >= fixedCount;

            const cell = createCell(
                isAnswer ? "" : value,
                isAnswer,
                colIndex
            );

            cell.dataset.row = String(rowIndex);
            cell.dataset.expected = value || "";

            if (isAnswer) {
                cell.addEventListener("click", () => {
                    handleAnswerCell(cell);
                });
            }

            grid.appendChild(cell);
        });
    });

    wrapper.appendChild(grid);
    taskArea.appendChild(wrapper);

    addGreenAndEmptyPalette();
}


/* =====================================
   نمایش هر مرحله
   ===================================== */

function renderStage() {
    resetStageState();
    updateHeader();

    switch (currentStage) {
        case 1:
            renderStage1();
            break;

        case 2:
            renderStage2();
            break;

        case 3:
            renderMousePuzzle(3);
            break;

        case 4:
            renderMousePuzzle(4);
            break;
            

       
