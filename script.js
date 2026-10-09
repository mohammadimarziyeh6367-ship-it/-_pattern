"use strict";

/* ========================================
   الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
======================================== */

const TOTAL_STAGES = 7;

const COLORS = {
    blue: "#42a5f5",
    red: "#ef5350",
    green: "#58c86b",
    yellow: "#ffd84d",
    pink: "#ff73ad",
    purple: "#9c64e8"
};

const COLOR_NAMES = {
    blue: "آبی",
    red: "قرمز",
    green: "سبز",
    yellow: "زرد",
    pink: "صورتی",
    purple: "بنفش"
};

const SHAPES = {
    heart: "♥",
    triangle: "▲",
    diamond: "◆",
    circle: "●",
    star: "★",
    square: "■"
};

const SHAPE_NAMES = {
    heart: "قلب",
    triangle: "مثلث",
    diamond: "لوزی",
    circle: "دایره",
    star: "ستاره",
    square: "مربع"
};

const $ = id => document.getElementById(id);

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
let selectedColors = [];
let stageSolved = false;
let mousePuzzleSolved = false;
let audioContext = null;


/* ========================================
   فقط صدای کلیک
======================================== */

function playClickSound() {
    try {
        const AudioClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioClass) return;

        if (!audioContext || audioContext.state === "closed") {
            audioContext = new AudioClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume().catch(() => {});
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const now = audioContext.currentTime;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(650, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(now);
        oscillator.stop(now + 0.06);

        oscillator.onended = () => {
            try {
                oscillator.disconnect();
                gain.disconnect();
            } catch (error) {}
        };
    } catch (error) {}
}


/* ========================================
   ابزارهای عمومی
======================================== */

function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;

    if (text !== undefined && text !== null) {
        element.textContent = text;
    }

    return element;
}

function toPersianNumber(number) {
    return String(number).replace(
        /\d/g,
        digit => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]
    );
}

function setFeedback(message, type = "") {
    if (!feedback) return;

    feedback.textContent = message;
    feedback.className = "feedback";

    if (type) feedback.classList.add(type);
}

function resetStageState() {
    selectedValue = null;
    selectedColors = [];
    stageSolved = false;
    mousePuzzleSolved = false;

    setFeedback("");
}

function updateHeader() {
    stageTitle.textContent =
        "مرحله " + toPersianNumber(currentStage);

    progressText.textContent =
        "مرحله " +
        toPersianNumber(currentStage) +
        " از " +
        toPersianNumber(TOTAL_STAGES);

    prevBtn.disabled = currentStage === 1;

    nextBtn.textContent =
        currentStage === TOTAL_STAGES
            ? "پایان بازی ★"
            : "بعدی ▶";

    stageGoal.classList.toggle("hidden", currentStage !== 7);
}


/* ========================================
   جدول‌های چسبیده با خطوط پیوسته
======================================== */

function styleGrid(grid, columns = 12) {
    grid.style.display = "grid";
    grid.style.gridTemplateColumns =
        `repeat(${columns}, minmax(0, 1fr))`;

    grid.style.gap = "0";
    grid.style.width = "100%";
    grid.style.maxWidth = "100%";
    grid.style.direction = "ltr";
    grid.style.boxSizing = "border-box";
    grid.style.borderTop = "1px solid #777";
    grid.style.borderLeft = "1px solid #777";
    grid.style.margin = "0";
}

function styleCell(cell) {
    cell.style.minWidth = "0";
    cell.style.width = "100%";
    cell.style.aspectRatio = "1 / 1";
    cell.style.boxSizing = "border-box";
    cell.style.padding = "0";
    cell.style.margin = "0";
    cell.style.display = "flex";
    cell.style.alignItems = "center";
    cell.style.justifyContent = "center";
    cell.style.fontSize = "clamp(9px, 2.2vw, 22px)";
    cell.style.overflow = "hidden";
    cell.style.borderRadius = "0";
    cell.style.border = "0";
    cell.style.borderRight = "1px solid #777";
    cell.style.borderBottom = "1px solid #777";
}


/* ========================================
   نمایش شکل و رنگ در خانه
======================================== */

function paintCell(cell, value, shape = false) {
    cell.dataset.value = value ?? "";
    cell.style.backgroundColor = "#ffffff";
    cell.style.color = "#7438c8";

    if (value === "" || value === null || value === undefined) {
        cell.textContent = "";
        return;
    }

    if (value === "greenTriangle") {
        cell.textContent = SHAPES.triangle;
        cell.style.color = COLORS.green;
        return;
    }

    if (value === "purpleCircle") {
        cell.textContent = SHAPES.circle;
        cell.style.color = COLORS.purple;
        return;
    }

    if (shape && SHAPES[value]) {
        cell.textContent = SHAPES[value];

        if (value === "triangle") {
            cell.style.color = COLORS.green;
        } else if (value === "circle") {
            cell.style.color = COLORS.purple;
        } else {
            cell.style.color = "#7438c8";
        }

        return;
    }

    if (COLORS[value]) {
        cell.textContent = "";
        cell.style.backgroundColor = COLORS[value];
        return;
    }

    if (SHAPES[value]) {
        cell.textContent = SHAPES[value];
        return;
    }

    cell.textContent = String(value);
}


/* ========================================
   ساخت خانه جدول
   بدون علامت سؤال
======================================== */

function createCell(value, options = {}) {
    const {
        answer = false,
        expected = value,
        shape = false,
        row = 0,
        index = 0
    } = options;

    const cell = makeElement("button", "cell");

    cell.type = "button";
    cell.dataset.expected = expected ?? "";
    cell.dataset.value = "";
    cell.dataset.shape = shape ? "true" : "false";
    cell.dataset.row = String(row);
    cell.dataset.index = String(index);

    styleCell(cell);

    if (answer) {
        cell.classList.add("answer-cell");
        cell.textContent = "";
        cell.setAttribute("aria-label", "خانه خالی");
        cell.style.backgroundColor = "#ffffff";
    } else {
        paintCell(cell, value, shape);
        cell.dataset.fixed = "true";
        cell.disabled = true;
    }

    if (answer) {
        cell.addEventListener("click", () => {
            if (stageSolved) return;

            playClickSound();

            if (selectedValue === null) {
                setFeedback("ابتدا رنگ یا شکل موردنظرت را انتخاب کن. 🌈");
                return;
            }

            applyValue(cell, selectedValue);
        });
    }

    return cell;
}

function applyValue(cell, value) {
    const shape = cell.dataset.shape === "true";

    paintCell(cell, value, shape);
    cell.classList.add("answered");
    cell.dataset.value = value;
}


/* ========================================
   عنوان جدول تمرین
======================================== */

function createPracticeTitle() {
    const title = makeElement(
        "div",
        "practice-title",
        "دلبندم، الگو را یک بار در زیر تکرار کن"
    );

    title.style.textAlign = "center";
    title.style.fontWeight = "bold";
    title.style.color = "#7438c8";
    title.style.fontSize = "clamp(12px, 2.5vw, 17px)";
    title.style.margin = "10px 0 6px";
    title.style.lineHeight = "1.8";

    return title;
}


/* ========================================
   جدول اصلی و جدول تمرین
   هر جدول ۱۲ خانه در یک ردیف
======================================== */

function renderPatternWithPractice({
    values,
    fixedCount,
    columns = 12,
    shape = false
}) {
    taskArea.innerHTML = "";

    const mainGrid = makeElement(
        "div",
        "pattern-grid main-pattern"
    );

    styleGrid(mainGrid, 12);

    values.forEach((value, index) => {
        const answer = index >= fixedCount;

        const cell = createCell(value, {
            answer,
            expected: value,
            shape,
            row: 0,
            index
        });

        mainGrid.appendChild(cell);
    });

    taskArea.appendChild(mainGrid);

    taskArea.appendChild(createPracticeTitle());

    const practiceGrid = makeElement(
        "div",
        "pattern-grid practice-pattern"
    );

    styleGrid(practiceGrid, 12);

    values.forEach((value, index) => {
        const cell = createCell(value, {
            answer: true,
            expected: value,
            shape,
            row: 0,
            index
        });

        cell.classList.add("practice-cell");
        cell.dataset.practiceExpected = value;
        cell.dataset.practiceShape = shape ? "true" : "false";

        practiceGrid.appendChild(cell);
    });

    taskArea.appendChild(practiceGrid);
}


/* ========================================
   انتخاب رنگ‌ها
======================================== */

function renderColorPalette() {
    paletteArea.innerHTML = "";

    const title = makeElement(
        "div",
        "palette-title",
        "دو رنگ دلخواهت را انتخاب کن:"
    );

    title.style.width = "100%";
    title.style.textAlign = "center";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "6px";
    title.style.color = "#7438c8";

    paletteArea.appendChild(title);

    const colorGrid = makeElement("div", "color-choice-grid");

    colorGrid.style.display = "grid";
    colorGrid.style.gridTemplateColumns =
        "repeat(6, minmax(0, 1fr))";
    colorGrid.style.gap = "5px";
    colorGrid.style.width = "100%";

    Object.keys(COLORS).forEach(color => {
        const button = makeElement("button", "palette-btn");

        button.type = "button";
        button.title = COLOR_NAMES[color];
        button.setAttribute("aria-label", COLOR_NAMES[color]);
        button.dataset.value = color;

        button.style.backgroundColor = COLORS[color];
        button.style.width = "100%";
        button.style.minWidth = "0";
        button.style.height = "32px";
        button.style.border = "2px solid #ffffff";
        button.style.borderRadius = "8px";
        button.style.boxShadow = "0 0 0 1px #dddddd";
        button.style.cursor = "pointer";

        button.addEventListener("click", () => {
            if (stageSolved) return;

            playClickSound();

            if (selectedColors.includes(color)) {
                selectedColors = selectedColors.filter(
                    item => item !== color
                );
            } else if (selectedColors.length < 2) {
                selectedColors.push(color);
            } else {
                setFeedback(
                    "برای تغییر رنگ‌ها، ابتدا یکی از رنگ‌های انتخاب‌شده را لمس کن."
                );
                return;
            }

            colorGrid.querySelectorAll(".palette-btn").forEach(item => {
                const chosen = selectedColors.includes(item.dataset.value);

                item.classList.toggle("selected", chosen);
                item.style.outline = chosen
                    ? "3px solid #7438c8"
                    : "";
            });

            selectedValue = selectedColors[0] ?? null;

            if (selectedColors.length === 2) {
                setFeedback("دو رنگ انتخاب شدند. حالا خانه‌ها را کامل کن. 🌈");
            } else {
                setFeedback("یک رنگ دیگر هم انتخاب کن.");
            }
        });

        colorGrid.appendChild(button);
    });

    paletteArea.appendChild(colorGrid);
}


/* ========================================
   انتخاب شکل‌ها
======================================== */

function renderShapePalette(shapes) {
    paletteArea.innerHTML = "";

    shapes.forEach(shape => {
        const button = makeElement("button", "palette-btn");

        button.type = "button";
        button.textContent = SHAPES[shape];
        button.dataset.value = shape;
        button.title = SHAPE_NAMES[shape];

        button.style.backgroundColor = "#ffffff";
        button.style.fontSize = "22px";
        button.style.minWidth = "42px";
        button.style.borderRadius = "8px";

        if (shape === "triangle") {
            button.style.color = COLORS.green;
        } else if (shape === "circle") {
            button.style.color = COLORS.purple;
        } else {
            button.style.color = "#7438c8";
        }

        button.addEventListener("click", () => {
            if (stageSolved) return;

            playClickSound();

            selectedValue = shape;

            paletteArea
                .querySelectorAll(".palette-btn")
                .forEach(item => item.classList.remove("selected"));

            button.classList.add("selected");

            setFeedback(
                shape === "triangle"
                    ? "مثلث سبز را انتخاب کردی! 💚"
                    : shape === "circle"
                        ? "دایره بنفش را انتخاب کردی! 💜"
                        : "شکل موردنظرت را انتخاب کردی."
            );
        });

        paletteArea.appendChild(button);
    });
}


/* ========================================
   مرحله ۱: الگوی دو رنگ
======================================== */

function renderStage1() {
    instruction.textContent =
        "الگو را پیدا کن و خانه‌های خالی را کامل کن.";

    const values = [];

    for (let i = 0; i < 12; i++) {
        values.push(i % 2 === 0 ? "blue" : "red");
    }

    renderPatternWithPractice({
        values,
        fixedCount: 6,
        columns: 12
    });

    renderColorPalette();
}


/* ========================================
   مرحله ۲: دو مثلث سبز و یک دایره بنفش
======================================== */

function renderStage2() {
    instruction.textContent =
        "به شکل‌ها نگاه کن و الگوی تکرارشونده را ادامه بده.";

    taskArea.innerHTML = "";
    paletteArea.innerHTML = "";

    const unit = [
        "greenTriangle",
        "greenTriangle",
        "purpleCircle"
    ];

    const values = [];

    for (let i = 0; i < 12; i++) {
        values.push(unit[i % unit.length]);
    }

    const mainGrid = makeElement(
        "div",
        "pattern-grid main-pattern"
    );

    styleGrid(mainGrid, 12);

    values.forEach((value, index) => {
        const answer = index >= 6;

        const cell = createCell(value, {
            answer,
            expected: value,
            shape: true,
            row: 0,
            index
        });

        if (answer) {
            cell.textContent = "";
            cell.style.backgroundColor = "#ffffff";
        } else {
            paintCell(cell, value, true);
        }

        mainGrid.appendChild(cell);
    });

    taskArea.appendChild(mainGrid);

    taskArea.appendChild(createPracticeTitle());

    const practiceGrid = makeElement(
        "div",
        "pattern-grid practice-pattern"
    );

    styleGrid(practiceGrid, 12);

    for (let i = 0; i < 12; i++) {
        const expected = unit[i % unit.length];

        const cell = createCell(expected, {
            answer: true,
            expected,
            shape: true,
            row: 0,
            index: i
        });

        cell.classList.add("practice-cell");
        cell.dataset.practiceExpected = expected;
        cell.dataset.practiceShape = "true";

        practiceGrid.appendChild(cell);
    }

    taskArea.appendChild(practiceGrid);

    renderShapePalette(["triangle", "circle"]);
}


/* ========================================
   مراحل ۳ و ۴: معمای موش
======================================== */

function renderMousePuzzle(values, wrongIndex, title) {
    taskArea.innerHTML = "";
    paletteArea.innerHTML = "";

    instruction.textContent = title;

    const grid = makeElement("div", "pattern-grid mouse-bricks");

    // ۱۲ خانه در یک ردیف
    styleGrid(grid, 12);

    values.forEach((value, index) => {
        const brick = makeElement("button", "cell mouse-brick");

        brick.type = "button";
        brick.textContent = SHAPES[value];
        brick.dataset.index = String(index);
        brick.style.color = "#7438c8";
        brick.style.backgroundColor = "#ffffff";
        brick.style.aspectRatio = "1 / 1";
        brick.style.borderRadius = "0";
        brick.style.border = "0";
        brick.style.borderRight = "1px solid #777";
        brick.style.borderBottom = "1px solid #777";
        brick.style.minWidth = "0";
        brick.style.padding = "0";

        brick.addEventListener("click", () => {
            if (mousePuzzleSolved) return;

            playClickSound();

            if (index === wrongIndex) {
                mousePuzzleSolved = true;

                brick.style.backgroundColor = "#d8f8dc";
                brick.style.border = "2px solid #58c86b";

                setFeedback(
                    "آفرین! آجر اشتباه را پیدا کردی! 🧀",
                    "success"
                );

                showMousePractice(values);
            } else {
                setFeedback("این شکل با الگو هماهنگ است. دوباره نگاه کن.");
            }
        });

        grid.appendChild(brick);
    });

    taskArea.appendChild(grid);

    const mouseHelp = makeElement(
        "p",
        "mouse-help",
        "روی آجری که با الگو هماهنگ نیست بزن. 🐭"
    );

    mouseHelp.style.textAlign = "center";
    taskArea.appendChild(mouseHelp);

    const mouse = makeElement("div", "mouse-character", "🐭");
    mouse.style.textAlign = "center";
    mouse.style.fontSize = "28px";

    taskArea.appendChild(mouse);
}

function showMousePractice(values) {
    taskArea.appendChild(createPracticeTitle());

    const grid = makeElement("div", "pattern-grid practice-pattern");
    styleGrid(grid, 12);

    const practiceValues = [];

    for (let i = 0; i < 12; i++) {
        practiceValues.push(values[i % values.length]);
    }

    practiceValues.forEach((value, index) => {
        const cell = createCell(value, {
            answer: true,
            expected: value,
            shape: true,
            row: 0,
            index
        });

        cell.dataset.practiceExpected = value;
        cell.dataset.practiceShape = "true";

        grid.appendChild(cell);
    });

    taskArea.appendChild(grid);

    renderShapePalette(Object.keys(SHAPES));
}

function renderStage3() {
    const values = [
        "circle",
        "star",
        "circle",
        "star",
        "circle",
        "triangle",
        "circle",
        "star",
        "circle",
        "star",
        "circle",
        "star"
    ];

    renderMousePuzzle(
        values,
        5,
        "کدام شکل با بقیه هماهنگ نیست؟"
    );
}

function renderStage4() {
    const values = [
        "square",
        "triangle",
        "square",
        "triangle",
        "diamond",
        "triangle",
        "square",
        "triangle",
        "square",
        "triangle",
        "square",
        "triangle"
    ];

    renderMousePuzzle(
        values,
        4,
        "شکل ناهماهنگ را پیدا کن."
    );
}


/* ========================================
   مرحله ۵: الگوی صورتی و زرد
======================================== */

function renderStage5() {
    instruction.textContent =
        "الگوی رنگی را پیدا کن و در جدول زیر تکرار کن.";

    const values = [];

    for (let i = 0; i < 12; i++) {
        values.push(i % 2 === 0 ? "pink" : "yellow");
    }

    renderPatternWithPractice({
        values,
        fixedCount: 6,
        columns: 12
    });

    renderColorPalette();
}


/* ========================================
   مرحله ۶: الگوی آبی و زرد
======================================== */

function renderStage6() {
    instruction.textContent =
        "به ترتیب رنگ‌ها دقت کن و الگو را ادامه بده.";

    const values = [];

    for (let i = 0; i < 12; i++) {
        values.push(i % 2 === 0 ? "yellow" : "blue");
    }

    renderPatternWithPractice({
        values,
        fixedCount: 8,
        columns: 12
    });

    renderColorPalette();
}


/* ========================================
   مرحله ۷: جدول دو ردیفی با ۱۲ ستون
======================================== */

function renderStage7() {
    instruction.textContent =
        "الگو را پیدا کن و سپس در جدول زیر تکرار کن.";

    taskArea.innerHTML = "";
    paletteArea.innerHTML = "";

    const grid = makeElement("div", "pattern-grid logic-grid");

    grid.style.display = "grid";
    grid.style.gridTemplateColumns =
        "repeat(12, minmax(0, 1fr))";
    grid.style.gridTemplateRows = "repeat(2, auto)";
    grid.style.gap = "0";
    grid.style.direction = "ltr";
    grid.style.width = "100%";
    grid.style.borderTop = "1px solid #777";
    grid.style.borderLeft = "1px solid #777";

    const values = [];

    for (let i = 0; i < 24; i++) {
        const column = i % 12;
        const row = Math.floor(i / 12);

        let value = "";

        if (row === 0) {
            value = column % 3 === 2 ? "" : "green";
        } else {
            value = column % 3 === 0 ? "" : "green";
        }

        values.push(value);
    }

    values.forEach((value, index) => {
        const column = index % 12;
        const row = Math.floor(index / 12);

        const cell = createCell(value, {
            answer: column >= 8,
            expected: value,
            row,
            index: column
        });

        grid.appendChild(cell);
    });

    taskArea.appendChild(grid);
    taskArea.appendChild(createPracticeTitle());

    const practiceGrid = makeElement(
        "div",
        "pattern-grid logic-grid practice-pattern"
    );

    practiceGrid.style.display = "grid";
    practiceGrid.style.gridTemplateColumns =
        "repeat(12, minmax(0, 1fr))";
    practiceGrid.style.gridTemplateRows = "repeat(2, auto)";
    practiceGrid.style.gap = "0";
    practiceGrid.style.direction = "ltr";
    practiceGrid.style.width = "100%";
    practiceGrid.style.borderTop = "1px solid #777";
    practiceGrid.style.borderLeft = "1px solid #777";

    values.forEach((value, index) => {
        const column = index % 12;
        const row = Math.floor(index / 12);

        const cell = createCell(value, {
            answer: true,
            expected: value,
            row,
            index: column
        });

        cell.dataset.practiceExpected = value;
        practiceGrid.appendChild(cell);
    });

    taskArea.appendChild(practiceGrid);

    renderColorPalette();
}


/* ========================================
   نمایش هر مرحله
======================================== */

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
            renderStage3();
            break;
        case 4:
            renderStage4();
            break;
        case 5:
            renderStage5();
            break;
        case 6:
            renderStage6();
            break;
        case 7:
            renderStage7();
            break;
    }
}


/* ========================================
   بررسی پاسخ
======================================== */

function checkAnswer() {
    if (stageSolved) return;

    if (currentStage === 3 || currentStage === 4) {
        const practiceCells = Array.from(
            taskArea.querySelectorAll(".practice-pattern .answer-cell")
        );

        if (!mousePuzzleSolved) {
            setFeedback("ابتدا شکل ناهماهنگ را پیدا کن.");
            return;
        }

        if (!practiceCells.length ||
            !practiceCells.every(cell => cell.classList.contains("answered"))) {
            setFeedback("دلبندم، جدول تمرین را هم کامل کن. 🌸");
            return;
        }

        const practiceCorrect = practiceCells.every(cell =>
            cell.dataset.value === cell.dataset.practiceExpected
        );

        if (practiceCorrect) {
            stageSolved = true;
            setFeedback("آفرین! هر دو بخش را درست انجام دادی. 🌈", "success");
            celebrate();
        } else {
            setFeedback("یک بار دیگر الگو را با دقت نگاه کن.");
        }

        return;
    }

    const mainCells = Array.from(
        taskArea.querySelectorAll(
            ".main-pattern .answer-cell, .logic-grid:not(.practice-pattern) .answer-cell"
        )
    );

    const practiceCells = Array.from(
        taskArea.querySelectorAll(".practice-pattern .answer-cell")
    );

    if (!mainCells.length || !practiceCells.length) {
        return;
    }

    const mainComplete = mainCells.every(cell =>
        cell.classList.contains("answered")
    );

    const practiceComplete = practiceCells.every(cell =>
        cell.classList.contains("answered")
    );

    if (!mainComplete || !practiceComplete) {
        setFeedback("دلبندم، هر دو جدول را کامل کن. 🌸");
        return;
    }

    const mainCorrect = mainCells.every(cell =>
        cell.dataset.value === cell.dataset.expected
    );

    const practiceCorrect = practiceCells.every(cell =>
        cell.dataset.value ===
        (cell.dataset.practiceExpected ?? cell.dataset.expected)
    );

    if (mainCorrect && practiceCorrect) {
        stageSolved = true;

        setFeedback(
            "آفرین " + (studentName || "قهرمان") +
            "! هر دو جدول را درست کامل کردی! 🌈",
            "success"
        );

        celebrate();
    } else {
        setFeedback("دلبندم، یک بار دیگر الگو را با دقت نگاه کن.");
    }
}


/* ========================================
   پاک کردن پاسخ‌ها
======================================== */

function clearAnswers() {
    if (stageSolved) {
        setFeedback("این مرحله را حل کرده‌ای؛ برای ادامه، بعدی را بزن.");
        return;
    }

    if (currentStage === 3 || currentStage === 4) {
        renderStage();
        return;
    }

    taskArea.querySelectorAll(".answer-cell").forEach(cell => {
        cell.classList.remove("answered", "correct");
        cell.dataset.value = "";
        cell.textContent = "";
        cell.style.backgroundColor = "#ffffff";
        cell.style.color = "#ffffff";
    });

    selectedValue = null;
    selectedColors = [];

    paletteArea.querySelectorAll(".palette-btn").forEach(button => {
        button.classList.remove("selected");
        button.style.outline = "";
    });

    setFeedback("خانه‌های تمرین پاک شدند. دوباره تلاش کن.");
}


/* ========================================
   شروع بازی
======================================== */

function startGame() {
    if (!studentNameInput.value.trim()) {
        studentNameInput.focus();
        window.alert("اول نام زیبایت را وارد کن! 🌸");
        return;
    }

    studentName = studentNameInput.value.trim();

    startScreen.classList.add("hidden");
    finishScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    currentStage = 1;
    renderStage();
}


/* ========================================
   مرحله بعد و قبل
======================================== */

function nextStage() {
    if (currentStage === TOTAL_STAGES) {
        if (stageSolved) {
            finishGame();
        } else {
            setFeedback("ابتدا هر دو جدول را کامل و بررسی کن.");
        }

        return;
    }

    currentStage++;
    renderStage();
}

function previousStage() {
    if (currentStage <= 1) return;

    currentStage--;
    renderStage();
}


/* ========================================
   جشن پایان مرحله
======================================== */

function celebrate() {
    if (!celebrationLayer) return;

    celebrationLayer.innerHTML = "";

    const symbols = ["🎉", "✨", "⭐", "🌈", "🎊"];

    for (let i = 0; i < 24; i++) {
        const piece = makeElement(
            "span",
            "confetti",
            symbols[Math.floor(Math.random() * symbols.length)]
        );

        piece.style.position = "fixed";
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.top = "-30px";
        piece.style.fontSize = "22px";
        piece.style.pointerEvents = "none";
        piece.style.zIndex = "9999";
        piece.style.animation =
            `confettiFall ${2 + Math.random() * 2}s linear forwards`;

        celebrationLayer.appendChild(piece);
    }

    setTimeout(() => {
        celebrationLayer.innerHTML = "";
    }, 3500);
}


/* ========================================
   پایان بازی
======================================== */

function finishGame() {
    gameScreen.classList.add("hidden");
    finishScreen.classList.remove("hidden");

    finishMessage.textContent =
        studentName +
        " عزیزم، هر هفت مرحله را پشت سر گذاشتی! " +
        "به تلاش و دقت تو افتخار می‌کنیم. آفرین قهرمان الگوها! 🌈";

    celebrate();
}


/* ========================================
   شروع دوباره
======================================== */

function restartGame() {
    currentStage = 1;
    selectedValue = null;
    selectedColors = [];
    stageSolved = false;
    mousePuzzleSolved = false;

    finishScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");

    studentNameInput.value = "";
    studentNameInput.focus();

    celebrationLayer.innerHTML = "";
}


/* ========================================
   اتصال دکمه‌ها
======================================== */

function initGame() {
    startBtn.addEventListener("click", startGame);

    studentNameInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            startGame();
        }
    });

    prevBtn.addEventListener("click", previousStage);
    nextBtn.addEventListener("click", nextStage);
    restartBtn.addEventListener("click", restartGame);
    clearBtn.addEventListener("click", clearAnswers);
    checkBtn.addEventListener("click", checkAnswer);

    updateHeader();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGame);
} else {
    initGame();
}
