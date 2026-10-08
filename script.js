"use strict";

/* ==========================================
   بازی الگوی منظم | ریاضی پایه اول
   آموزگار: مرضیه محمدی
   نسخه اصلاح‌شده
========================================== */

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

/* ==========================================
   دسترسی به عناصر صفحه
========================================== */

const $ = id => document.getElementById(id);

let currentStage = 1;
let studentName = "";
let selectedValue = null;
let stageSolved = false;
let mousePuzzleSolved = false;
let mousePointerState = null;
let audioContext = null;
let speechQueue = [];
let isSpeaking = false;
let speechEnabled = true;
let celebrationTimer = null;

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

/* ==========================================
   ابزارهای عمومی
========================================== */

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

function toPersianNumber(number) {
    return String(number).replace(/\d/g, digit =>
        "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]
    );
}

function setFeedback(message, type = "") {
    if (!feedback) return;

    feedback.textContent = message;
    feedback.className = "feedback";

    if (type) {
        feedback.classList.add(type);
    }
}

function getCellValue(cell) {
    return cell.dataset.value ?? "";
}

function resetStageState() {
    selectedValue = null;
    stageSolved = false;
    mousePuzzleSolved = false;
    mousePointerState = null;

    setFeedback("");

    if (checkBtn) {
        checkBtn.disabled = false;
    }

    if (clearBtn) {
        clearBtn.disabled = false;
    }
}

function updateHeader() {
    if (stageTitle) {
        stageTitle.textContent =
            "مرحله " + toPersianNumber(currentStage);
    }

    if (progressText) {
        progressText.textContent =
            "مرحله " +
            toPersianNumber(currentStage) +
            " از " +
            toPersianNumber(TOTAL_STAGES);
    }

    if (prevBtn) {
        prevBtn.disabled = currentStage === 1;
    }

    if (nextBtn) {
        nextBtn.textContent =
            currentStage === TOTAL_STAGES
                ? "پایان بازی ★"
                : "بعدی ▶";
    }

    if (stageGoal) {
        stageGoal.classList.toggle("hidden", currentStage !== 7);
    }
}

/* ==========================================
   مدیریت صدا
========================================== */

function getAudioContext() {
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            return null;
        }

        if (!audioContext || audioContext.state === "closed") {
            audioContext = new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume().catch(() => {});
        }

        return audioContext;
    } catch (error) {
        return null;
    }
}

function playTone(frequency, duration = 0.12, type = "sine") {
    const context = getAudioContext();

    if (!context) return;

    try {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const now = context.currentTime;

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + Math.max(0.04, duration)
        );

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start(now);
        oscillator.stop(now + duration + 0.03);

        oscillator.onended = () => {
            try {
                oscillator.disconnect();
                gain.disconnect();
            } catch (error) {}
        };
    } catch (error) {}
}

function playClickSound() {
    playTone(660, 0.06, "sine");
}

function playSuccessSound() {
    const notes = [
        { frequency: 523, delay: 0 },
        { frequency: 659, delay: 150 },
        { frequency: 784, delay: 300 }
    ];

    notes.forEach(note => {
        setTimeout(() => {
            playTone(note.frequency, 0.16, "sine");
        }, note.delay);
    });
}

function playErrorSound() {
    playTone(220, 0.18, "triangle");
}

function playCelebrationSound() {
    const notes = [523, 659, 784, 1047];

    notes.forEach((frequency, index) => {
        setTimeout(() => {
            playTone(frequency, 0.2, "sine");
        }, index * 170);
    });
}

/*
  گفتار فارسی در صف پخش می‌شود.
  برای هر جمله speechSynthesis.cancel()
  اجرا نمی‌کنیم تا جمله‌های قبلی بی‌دلیل قطع نشوند.
*/

function speakPersian(message) {
    if (!speechEnabled) return;

    if (!("speechSynthesis" in window)) {
        return;
    }

    if (!message || !String(message).trim()) {
        return;
    }

    speechQueue.push(String(message));

    if (!isSpeaking) {
        playNextSpeech();
    }
}

function playNextSpeech() {
    if (!speechEnabled || isSpeaking || speechQueue.length === 0) {
        return;
    }

    if (!("speechSynthesis" in window)) {
        speechQueue = [];
        return;
    }

    const message = speechQueue.shift();

    try {
        const utterance = new SpeechSynthesisUtterance(message);

        utterance.lang = "fa-IR";
        utterance.rate = 0.85;
        utterance.pitch = 1.08;
        utterance.volume = 1;

        const voices = window.speechSynthesis.getVoices();

        const persianVoice = voices.find(voice =>
            /^fa(-|_)/i.test(voice.lang)
        );

        if (persianVoice) {
            utterance.voice = persianVoice;
        }

        isSpeaking = true;

        let completed = false;

        function finishSpeech() {
            if (completed) return;

            completed = true;
            isSpeaking = false;

            setTimeout(playNextSpeech, 180);
        }

        utterance.onend = finishSpeech;
        utterance.onerror = finishSpeech;

        window.speechSynthesis.speak(utterance);

        /*
          اگر مرورگر صدایی در صف نگه داشت و رویداد پایان
          ارسال نشد، تلاش می‌کنیم صف برای همیشه متوقف نماند.
        */
        setTimeout(() => {
            if (
                isSpeaking &&
                window.speechSynthesis.speaking === false &&
                window.speechSynthesis.pending === false
            ) {
                finishSpeech();
            }
        }, Math.max(5000, message.length * 180));

    } catch (error) {
        isSpeaking = false;
        setTimeout(playNextSpeech, 250);
    }
}

if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

/* ==========================================
   ساخت خانه‌های الگو
========================================== */

function createCell(value, options = {}) {
    const {
        answer = false,
        expected = value,
        index = 0,
        row = 0,
        shape = false
    } = options;

    const cell = makeElement("div", "cell");

    cell.dataset.value = answer ? "" : value;
    cell.dataset.expected = expected;
    cell.dataset.index = String(index);
    cell.dataset.row = String(row);

    if (answer) {
        cell.classList.add("answer-cell");
        cell.setAttribute("role", "button");
        cell.setAttribute("tabindex", "0");
        cell.setAttribute("aria-label", "خانه خالی الگو");
        cell.textContent = "؟";
        cell.dataset.value = "";
    } else {
        paintCell(cell, value, shape);
    }

    if (answer) {
        cell.addEventListener("click", () => handleAnswerCell(cell));

        cell.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleAnswerCell(cell);
            }
        });
    }

    return cell;
}

function paintCell(cell, value, shape = false) {
    cell.dataset.value = value;

    cell.classList.remove("answered", "correct");

    if (value === "" || value === "empty") {
        cell.textContent = "□";
        cell.style.backgroundColor = "#ffffff";
        cell.style.color = "#8c8c8c";
        cell.style.border = "2px dashed #c9c9c9";
        return;
    }

    cell.style.border = "";

    if (shape) {
        cell.textContent = SHAPES[value] || "●";
        cell.style.backgroundColor = "#ffffff";
        cell.style.color = COLORS[value] || "#7438c8";
        return;
    }

    if (COLORS[value]) {
        cell.style.backgroundColor = COLORS[value];
        cell.style.color = "#ffffff";
        cell.textContent = "";
        return;
    }

    if (SHAPES[value]) {
        cell.textContent = SHAPES[value];
        cell.style.backgroundColor = "#ffffff";
        cell.style.color = "#7438c8";
        return;
    }

    cell.textContent = String(value);
}

function createGrid(className = "pattern-grid") {
    return makeElement("div", className);
}

function createPatternRow(values, fixedCount, rowIndex = 0, shape = false) {
    const row = createGrid("pattern-grid");

    values.forEach((value, index) => {
        const answer = index >= fixedCount;

        row.appendChild(
            createCell(value, {
                answer,
                expected: value,
                index,
                row: rowIndex,
                shape
            })
        );
    });

    return row;
}

function handleAnswerCell(cell) {
    if (stageSolved) return;

    if (selectedValue === null) {
        setFeedback("اول یک رنگ یا شکل انتخاب کن! 🌈", "error");
        playErrorSound();
        return;
    }

    applyValue(cell, selectedValue);
    playClickSound();
}

function applyValue(cell, value) {
    const shape = Boolean(cell.dataset.shape === "true");

    paintCell(cell, value, shape);

    cell.classList.add("answered");
    cell.setAttribute("aria-label", "پاسخ انتخاب‌شده");
}

/* ==========================================
   انتخاب رنگ و شکل
========================================== */

function createPaletteButton(value, label, shape = false) {
    const button = makeElement("button", "palette-btn");
    button.type = "button";
    button.dataset.value = value;
    button.setAttribute("aria-label", label);
    button.title = label;

    if (value === "empty") {
        button.textContent = "□";
        button.style.backgroundColor = "#ffffff";
        button.style.color = "#777777";
    } else if (shape) {
        button.textContent = SHAPES[value] || value;
        button.style.backgroundColor = "#ffffff";
        button.style.color = COLORS[value] || "#7438c8";
    } else {
        button.style.backgroundColor = COLORS[value] || "#ffffff";
        button.textContent = "";
    }

    button.addEventListener("click", () => {
        if (stageSolved) return;

        selectedValue = value === "empty" ? "" : value;

        document.querySelectorAll(".palette-btn").forEach(item => {
            item.classList.remove("selected");
            item.setAttribute("aria-pressed", "false");
        });

        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");

        playClickSound();
        setFeedback("حالا خانه‌های خالی را کامل کن! ✨");
    });

    return button;
}

function renderColorPalette(colorNames) {
    if (!paletteArea) return;

    paletteArea.innerHTML = "";

    colorNames.forEach(color => {
        paletteArea.appendChild(
            createPaletteButton(color, COLOR_NAMES[color] || color)
        );
    });
}

function renderShapePalette(shapeNames) {
    if (!paletteArea) return;

    paletteArea.innerHTML = "";

    shapeNames.forEach(shape => {
        paletteArea.appendChild(
            createPaletteButton(shape, SHAPE_NAMES[shape] || shape, true)
        );
    });

    paletteArea.appendChild(
        createPaletteButton("empty", "خانه خالی")
    );
}

/* ==========================================
   نمایش الگوهای ساده
========================================== */

function renderSimplePattern({
    values,
    fixedCount,
    columns,
    shape = false,
    rows = 1
}) {
    taskArea.innerHTML = "";

    const grid = createGrid("pattern-grid");

    grid.style.display = "grid";
    grid.style.gridTemplateColumns =
        `repeat(${columns}, minmax(0, 1fr))`;

    grid.style.direction = "ltr";

    values.forEach((value, index) => {
        const answer = index >= fixedCount;

        const cell = createCell(value, {
            answer,
            expected: value,
            index,
            row: Math.floor(index / columns),
            shape
        });

        if (shape) {
            cell.dataset.shape = "true";
        }

        grid.appendChild(cell);
    });

    taskArea.appendChild(grid);
}

/* ==========================================
   مرحله ۱: الگوی رنگی آبی و قرمز
========================================== */

function renderStage1() {
    instruction.textContent =
        "الگو را پیدا کن و سپس ادامه بده. کدام رنگ بعد از دیگری می‌آید؟ 🌈";

    const values = [];

    for (let i = 0; i < 10; i++) {
        values.push(i % 2 === 0 ? "blue" : "red");
    }

    renderSimplePattern({
        values,
        fixedCount: 6,
        columns: 10
    });

    renderColorPalette(["blue", "red"]);
}

/* ==========================================
   مرحله ۲: الگوی شکل‌ها
========================================== */

function renderStage2() {
    instruction.textContent =
        "به شکل‌ها خوب نگاه کن. الگوی تکرارشونده را پیدا کن و ادامه بده! 💗";

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
        values,
        fixedCount: 10,
        columns: 5,
        shape: true
    });

    renderShapePalette(["heart", "triangle", "diamond"]);
}

/* ==========================================
   معماهای موش
========================================== */

function createMousePuzzle(values, wrongIndex, title) {
    taskArea.innerHTML = "";

    instruction.textContent = title;

    const wrapper = makeElement("div", "mouse-puzzle");

    const message = makeElement(
        "p",
        "mouse-help",
        "موش کوچولو را بگیر و روی آجری ببر که الگو را به هم زده است! 🐭"
    );

    const row = createGrid("pattern-grid mouse-bricks");

    row.style.display = "grid";
    row.style.gridTemplateColumns =
        `repeat(${values.length}, minmax(0, 1fr))`;

    row.style.direction = "ltr";

    values.forEach((value, index) => {
        const brick = makeElement("div", "cell mouse-brick");

        brick.dataset.index = String(index);
        brick.dataset.value = value;

        brick.style.position = "relative";

        brick.textContent = SHAPES[value] || "●";
        brick.style.backgroundColor = "#ffffff";
        brick.style.color = "#7438c8";

        if (index === wrongIndex) {
            brick.dataset.wrong = "true";
        }

        row.appendChild(brick);
    });

    const mouse = makeElement("button", "mouse-character", "🐭");
    mouse.type = "button";
    mouse.setAttribute("aria-label", "موش کوچولو را حرکت بده");
    mouse.style.touchAction = "none";
    mouse.style.cursor = "grab";
    mouse.style.fontSize = "2rem";

    const cheese = makeElement("div", "mouse-cheese", "🧀");
    cheese.hidden = true;

    const successText = makeElement(
        "p",
        "mouse-success",
        "آفرین! آجر اشتباه را پیدا کردی! 🎉"
    );

    successText.hidden = true;

    wrapper.appendChild(mouse);
    wrapper.appendChild(row);
    wrapper.appendChild(cheese);
    wrapper.appendChild(successText);
    wrapper.appendChild(message);

    taskArea.appendChild(wrapper);

    mouse.addEventListener("pointerdown", event => {
        if (mousePuzzleSolved) return;

        event.preventDefault();

        mousePointerState = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY
        };

        try {
            mouse.setPointerCapture(event.pointerId);
        } catch (error) {}

        mouse.style.cursor = "grabbing";
        mouse.style.position = "relative";
        mouse.style.zIndex = "10";

        playClickSound();
    });

    mouse.addEventListener("pointermove", event => {
        if (
            !mousePointerState ||
            mousePointerState.pointerId !== event.pointerId
        ) {
            return;
        }

        const dx = event.clientX - mousePointerState.startX;
        const dy = event.clientY - mousePointerState.startY;

        mouse.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    function endDrag(event) {
        if (
            !mousePointerState ||
            mousePointerState.pointerId !== event.pointerId
        ) {
            return;
        }

        mousePointerState = null;
        mouse.style.cursor = "grab";

        const target = document.elementFromPoint(
            event.clientX,
            event.clientY
        );

        const brick = target ? target.closest(".mouse-brick") : null;

        mouse.style.transform = "";

        if (brick && row.contains(brick)) {
            const index = Number(brick.dataset.index);

            if (index === wrongIndex) {
                revealCheese(brick, cheese, successText, mouse);
            } else {
                setFeedback(
                    "این آجر درست است! یک بار دیگر دقت کن. 🔍",
                    "error"
                );

                playErrorSound();
            }
        }
    }

    mouse.addEventListener("pointerup", endDrag);
    mouse.addEventListener("pointercancel", endDrag);

    /*
      روش جایگزین برای موبایل یا دستگاهی که کشیدن سخت است:
      با لمس آجر هم می‌توان آن را انتخاب کرد.
    */
    row.querySelectorAll(".mouse-brick").forEach(brick => {
        brick.setAttribute("role", "button");
        brick.setAttribute("tabindex", "0");
        brick.setAttribute("aria-label", "انتخاب آجر");

        brick.addEventListener("click", () => {
            if (mousePuzzleSolved) return;

            if (Number(brick.dataset.index) === wrongIndex) {
                revealCheese(brick, cheese, successText, mouse);
            } else {
                setFeedback(
                    "هنوز آجر اشتباه را پیدا نکردی؛ دوباره نگاه کن! 🐭",
                    "error"
                );

                playErrorSound();
            }
        });

        brick.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                brick.click();
            }
        });
    });
}

function revealCheese(brick, cheese, successText, mouse) {
    if (mousePuzzleSolved) return;

    mousePuzzleSolved = true;

    brick.classList.add("correct");
    brick.style.backgroundColor = "#d8f8dc";
    brick.style.border = "3px solid #58c86b";

    cheese.hidden = false;
    successText.hidden = false;

    if (mouse) {
        mouse.textContent = "🐭";
    }

    setFeedback("آفرین! آجر اشتباه را پیدا کردی! 🧀", "success");

    playSuccessSound();

    speakPersian(
        "آفرین " + (studentName || "قهرمان") +
        "! آجر اشتباه را پیدا کردی."
    );

    celebrate();
}

/* ==========================================
   مرحله ۳: معمای موش و شکل‌ها
========================================== */

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
        "star"
    ];

    createMousePuzzle(
        values,
        5,
        "کدام آجر با الگوی شکل‌ها هماهنگ نیست؟ موش را به آن برسان! 🐭"
    );

    if (paletteArea) {
        paletteArea.innerHTML = "";
    }
}

/* ==========================================
   مرحله ۴: معمای موش و شکل‌ها
========================================== */

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
        "triangle"
    ];

    createMousePuzzle(
        values,
        4,
        "یک شکل با بقیه هماهنگ نیست. آن را پیدا کن و موش را به آن برسان! 🐭"
    );

    if (paletteArea) {
        paletteArea.innerHTML = "";
    }
}

/* ==========================================
   مرحله ۵: الگوی صورتی و زرد
========================================== */

function renderStage5() {
    instruction.textContent =
        "الگو را پیدا کن و سپس ادامه بده. با دقت رنگ خانه‌ها را کامل کن! 💗💛";

    const values = [];

    for (let i = 0; i < 39; i++) {
        values.push(i % 2 === 0 ? "pink" : "yellow");
    }

    renderSimplePattern({
        values,
        fixedCount: 18,
        columns: 13,
        rows: 3
    });

    renderColorPalette(["pink", "yellow"]);
}

/* ==========================================
   مرحله ۶: الگوی آبی و زرد
========================================== */

function renderStage6() {
    instruction.textContent =
        "الگو را با دقت نگاه کن و خانه‌های خالی را کامل کن! 💙💛";

    const values = [];

    for (let i = 0; i < 12; i++) {
        values.push(i % 2 === 0 ? "yellow" : "blue");
    }

    renderSimplePattern({
        values,
        fixedCount: 8,
        columns: 12
    });

    renderColorPalette(["yellow", "blue"]);
}

/* ==========================================
   مرحله ۷: جدول یکپارچه الگو
========================================== */

function renderStage7() {
    instruction.textContent =
        "الگو را پیدا کن و سپس ادامه بده. به هر دو ردیف دقت کن! 🟩";

    taskArea.innerHTML = "";

    const grid = createGrid("pattern-grid logic-grid");

    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(15, minmax(0, 1fr))";
    grid.style.gap = "0";
    grid.style.direction = "ltr";

    const row1 = [];
    const row2 = [];

    for (let i = 0; i < 15; i++) {
        row1.push(i % 3 === 2 ? "" : "green");
        row2.push(i % 3 === 0 ? "" : "green");
    }

    const allValues = row1.concat(row2);

    allValues.forEach((value, index) => {
        const rowIndex = index < 15 ? 0 : 1;
        const columnIndex = index % 15;

        const answer = columnIndex >= 9;

        const cell = createCell(value, {
            answer,
            expected: value,
            index: columnIndex,
            row: rowIndex
        });

        cell.dataset.shape = "false";

        /*
          هر دو ردیف در یک جدول هستند.
          مرز بین ردیف‌ها باریک و بدون فاصله می‌ماند.
        */
        cell.style.margin = "0";
        cell.style.borderRadius = "0";

        if (rowIndex === 1) {
            cell.style.borderTop = "1px solid #d9d9d9";
        }

        grid.appendChild(cell);
    });

    taskArea.appendChild(grid);

    if (paletteArea) {
        paletteArea.innerHTML = "";
        paletteArea.appendChild(
            createPaletteButton("green", "سبز")
        );
        paletteArea.appendChild(
            createPaletteButton("empty", "خانه خالی")
        );
    }
}

/* ==========================================
   نمایش مرحله
========================================== */

function renderStage() {
    resetStageState();
    updateHeader();

    if (taskArea) {
        taskArea.innerHTML = "";
    }

    if (paletteArea) {
        paletteArea.innerHTML = "";
    }

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

        default:
            currentStage = 1;
            renderStage1();
            updateHeader();
    }

    if (currentStage === 3 || currentStage === 4) {
        if (checkBtn) {
            checkBtn.textContent = "بررسی پاسخ ✓";
        }
    }
}

/* ==========================================
   بررسی پاسخ‌ها
========================================== */

function checkAnswer() {
    if (stageSolved) return;

    /*
      مراحل ۳ و ۴ با پیدا کردن آجر اشتباه
      به‌صورت خودکار بررسی می‌شوند.
    */
    if (currentStage === 3 || currentStage === 4) {
        if (mousePuzzleSolved) {
            stageSolved = true;
            setFeedback("آفرین! این معما را حل کردی! 🎉", "success");
        } else {
            setFeedback(
                "موش را به آجر اشتباه برسان تا معما را حل کنی! 🐭",
                "error"
            );

            playErrorSound();
            speakPersian("یک بار دیگر با دقت نگاه کن.");
        }

        return;
    }

    const cells = Array.from(
        taskArea.querySelectorAll(".answer-cell")
    );

    if (cells.length === 0) {
        setFeedback("آفرین! این مرحله را کامل کردی! 🎉", "success");
        stageSolved = true;
        playSuccessSound();
        speakPersian("آفرین! خیلی خوب بود.");
        return;
    }

    const allFilled = cells.every(cell =>
        cell.classList.contains("answered")
    );

    if (!allFilled) {
        setFeedback(
            "هنوز همه خانه‌ها را کامل نکرده‌ای. دوباره تلاش کن! 🌈",
            "error"
        );

        playErrorSound();
        speakPersian("بعضی خانه‌ها هنوز خالی هستند.");
        return;
    }

    const allCorrect = cells.every(cell => {
        const actual = cell.dataset.value ?? "";
        const expected = cell.dataset.expected ?? "";

        return actual === expected;
    });

    if (allCorrect) {
        stageSolved = true;

        cells.forEach(cell => {
            cell.classList.add("correct");
        });

        setFeedback(
            "آفرین " + (studentName || "قهرمان") +
            "! همه پاسخ‌ها درست هستند! 🌟",
            "success"
        );

        playSuccessSound();

        speakPersian(
            "آفرین " + (studentName || "قهرمان") +
            "! همه پاسخ‌هایت درست است. تو یک قهرمان الگوها هستی!"
        );

        celebrate();

        if (checkBtn) {
            checkBtn.textContent =
                currentStage === TOTAL_STAGES
                    ? "پایان بازی ★"
                    : "مرحله بعدی ▶";
        }
    } else {
        setFeedback(
            "یک یا چند پاسخ درست نیست. دوباره الگو را نگاه کن! 💪",
            "error"
        );

        playErrorSound();
        speakPersian("یک بار دیگر تلاش کن. تو می‌توانی!");
    }
}

/* ==========================================
   پاک کردن پاسخ‌ها
========================================== */

function clearAnswers() {
    if (stageSolved) {
        setFeedback(
            "این مرحله را حل کرده‌ای! برای ادامه، دکمه بعدی را بزن. 🌟",
            "success"
        );
        return;
    }

    if (currentStage === 3 || currentStage === 4) {
        renderStage();
        playClickSound();
        return;
    }

    const cells = taskArea.querySelectorAll(".answer-cell");

    cells.forEach(cell => {
        cell.dataset.value = "";
        cell.classList.remove("answered", "correct");
        cell.textContent = "؟";
        cell.style.backgroundColor = "";
        cell.style.color = "";
        cell.style.border = "";
    });

    selectedValue = null;

    document.querySelectorAll(".palette-btn").forEach(button => {
        button.classList.remove("selected");
        button.setAttribute("aria-pressed", "false");
    });

    setFeedback("خانه‌های خالی پاک شدند. دوباره تلاش کن! 🌈");
    playClickSound();
}

/* ==========================================
   شروع بازی
========================================== */

function startGame() {
    getAudioContext();

    if (studentNameInput) {
        studentName = studentNameInput.value.trim();
    }

    if (!studentName) {
        if (studentNameInput) {
            studentNameInput.focus();
        }

        window.alert("اول نام زیبایت را وارد کن! 🌸");
        playErrorSound();
        return;
    }

    if (startScreen) {
        startScreen.classList.add("hidden");
    }

    if (finishScreen) {
        finishScreen.classList.add("hidden");
    }

    if (gameScreen) {
        gameScreen.classList.remove("hidden");
    }

    currentStage = 1;

    renderStage();

    playSuccessSound();

    speakPersian(
        "سلام " + studentName +
        " عزیزم! به بازی الگوی منظم خوش آمدی. بیا با هم الگوها را پیدا کنیم."
    );
}

/* ==========================================
   مرحله بعدی
========================================== */

function nextStage() {
    if (currentStage < TOTAL_STAGES) {
        currentStage++;
        renderStage();
        playClickSound();

        speakPersian(
            "به مرحله " +
            toPersianNumber(currentStage) +
            " رسیدی. با دقت الگو را پیدا کن!"
        );

        return;
    }

    if (stageSolved) {
        finishGame();
        return;
    }

    setFeedback(
        "ابتدا پاسخ‌های مرحله هفتم را بررسی کن! 🟩",
        "error"
    );

    playErrorSound();
}

/* ==========================================
   مرحله قبلی
========================================== */

function previousStage() {
    if (currentStage <= 1) return;

    currentStage--;
    renderStage();
    playClickSound();

    speakPersian(
        "به مرحله " +
        toPersianNumber(currentStage) +
        " برگشتی."
    );
}

/* ==========================================
   پایان بازی
========================================== */

function finishGame() {
    if (gameScreen) {
        gameScreen.classList.add("hidden");
    }

    if (startScreen) {
        startScreen.classList.add("hidden");
    }

    if (finishScreen) {
        finishScreen.classList.remove("hidden");
    }

    if (finishMessage) {
        finishMessage.textContent =
            studentName +
            " عزیزم، تو هر هفت مرحله را پشت سر گذاشتی! " +
            "به دقت و تلاش تو افتخار می‌کنیم. آفرین قهرمان الگوها! 🌈";
    }

    playCelebrationSound();
    celebrate();

    speakPersian(
        "تبریک می‌گویم " + studentName +
        " عزیزم! تو همه مراحل بازی الگوی منظم را به پایان رساندی. " +
        "به تو افتخار می‌کنم. همیشه کنجکاو باش و یاد بگیر!"
    );
}

/* ==========================================
   شروع دوباره
========================================== */

function restartGame() {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    speechQueue = [];
    isSpeaking = false;

    currentStage = 1;
    stageSolved = false;
    mousePuzzleSolved = false;
    selectedValue = null;

    if (finishScreen) {
        finishScreen.classList.add("hidden");
    }

    if (gameScreen) {
        gameScreen.classList.add("hidden");
    }

    if (startScreen) {
        startScreen.classList.remove("hidden");
    }

    if (studentNameInput) {
        studentNameInput.value = "";
        studentNameInput.focus();
    }

    if (celebrationLayer) {
        celebrationLayer.innerHTML = "";
    }

    playClickSound();
}

/* ==========================================
   جشن و کاغذرنگی
========================================== */

function celebrate() {
    if (!celebrationLayer) return;

    if (celebrationTimer) {
        clearTimeout(celebrationTimer);
    }

    celebrationLayer.innerHTML = "";

    const symbols = ["🎉", "✨", "⭐", "🌈", "🎊"];

    for (let i = 0; i < 45; i++) {
        const piece = makeElement(
            "span",
            "confetti",
            symbols[Math.floor(Math.random() * symbols.length)]
        );

        piece.style.position = "fixed";
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.top = "-30px";
        piece.style.fontSize =
            (16 + Math.random() * 18) + "px";
        piece.style.pointerEvents = "none";
        piece.style.zIndex = "9999";
        piece.style.animation =
            `confettiFall ${2 + Math.random() * 2}s linear forwards`;

        celebrationLayer.appendChild(piece);
    }

    celebrationTimer = setTimeout(() => {
        celebrationLayer.innerHTML = "";
    }, 4000);
}

/* ==========================================
   اتصال دکمه‌ها
========================================== */

function initGame() {
    if (startBtn) {
        startBtn.addEventListener("click", startGame);
    }

    if (studentNameInput) {
        studentNameInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                startGame();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", previousStage);
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", nextStage);
    }

    if (restartBtn) {
        restartBtn.addEventListener("click", restartGame);
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", clearAnswers);
    }

    if (checkBtn) {
        checkBtn.addEventListener("click", checkAnswer);
    }

    /*
      صدا با اولین تعامل کاربر فعال می‌شود.
      این کار در مرورگرهای موبایل اهمیت دارد.
    */
    document.addEventListener(
        "pointerdown",
        () => {
            getAudioContext();
        },
        { once: true, passive: true }
    );

    updateHeader();
}

/* ==========================================
   اجرای امن پس از آماده شدن صفحه
========================================== */

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGame);
} else {
    initGame();
}
