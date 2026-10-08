“use strict”;

/* عناصر صفحه */
const startScreen = document.getElementById(“startScreen”);
const gameScreen = document.getElementById(“gameScreen”);
const finishScreen = document.getElementById(“finishScreen”);
const startBtn = document.getElementById(“startBtn”);
const restartBtn = document.getElementById(“restartBtn”);
const prevBtn = document.getElementById(“prevBtn”);
const nextBtn = document.getElementById(“nextBtn”);
const taskArea = document.getElementById(“taskArea”);
const paletteArea = document.getElementById(“paletteArea”);
const instruction = document.getElementById(“instruction”);
const feedback = document.getElementById(“feedback”);
const checkBtn = document.getElementById(“checkBtn”);
const clearBtn = document.getElementById(“clearBtn”);
const stageTitle = document.getElementById(“stageTitle”);
const progressText = document.getElementById(“progressText”);
const studentNameInput = document.getElementById(“studentName”);
const finishMessage = document.getElementById(“finishMessage”);
const celebrationLayer = document.getElementById(“celebrationLayer”);

let currentStage = 0;
let studentName = “”;
let currentAnswers = [];
let audioContext = null;
let mousePuzzleSolved = false;
let activeDrag = null;

const TOTAL_STAGES = 7;

const COLORS = {
blue: “#42a5f5”,
red: “#ef5350”,
green: “#58c86b”,
yellow: “#ffd84d”,
pink: “#ff73ad”,
purple: “#9c64e8”
};

const SHAPES = {
heart: “♥”,
triangle: “▲”,
diamond: “◆”,
circle: “●”,
star: “★”,
square: “■”
};

/* صدا */
function getAudioContext() {
if (!audioContext) {
const AudioCtx = window.AudioContext || window.webkitAudioContext;
if (AudioCtx) audioContext = new AudioCtx();
}
if (audioContext && audioContext.state === “suspended”) {
audioContext.resume().catch(() => {});
}
return audioContext;
}

function playTone(frequency = 520, duration = 0.14, type = “sine”, volume = 0.08) {
const ctx = getAudioContext();
if (!ctx) return;

try {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
} catch (error) {
    /* اگر مرورگر صدا را پشتیبانی نکند، بازی ادامه می‌یابد. */
}

}

function clickSound() {
playTone(620, 0.08, “sine”, 0.045);
}

function wrongSound() {
playTone(230, 0.18, “triangle”, 0.07);
}

function correctSound() {
playTone(660, 0.12, “sine”, 0.07);
setTimeout(() => playTone(880, 0.16, “sine”, 0.07), 100);
setTimeout(() => playTone(1050, 0.2, “sine”, 0.07), 210);
}

/* جشن */
function fireworks() {
if (!celebrationLayer) return;
celebrationLayer.innerHTML = “”;

const colors = [
    "#ff73ad", "#42a5f5", "#ffd84d",
    "#58c86b", "#9c64e8", "#ef5350"
];
for (let i = 0; i < 65; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.65}s`;
    piece.style.animationDuration = `${1.3 + Math.random() * 1.5}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    celebrationLayer.appendChild(piece);
}
setTimeout(() => {
    celebrationLayer.innerHTML = "";
}, 3500);

}

function showCorrect(message = “آفرین! پاسخ درست است. 🌟”) {
feedback.textContent = message;
feedback.style.color = “#159447”;
correctSound();
}

function showWrong(message = “یک بار دیگر با دقت نگاه کن. تو می‌توانی! 💜”) {
feedback.textContent = message;
feedback.style.color = “#d34b55”;
wrongSound();
}

/* ساخت خانه‌ها */
function createGrid(rows, cols, className = “”) {
const wrapper = document.createElement(“div”);
wrapper.className = “grid-wrapper”;

const grid = document.createElement("div");
grid.className = `pattern-grid ${className}`.trim();
grid.style.gridTemplateColumns = `repeat(${cols}, auto)`;
grid.dataset.rows = rows;
grid.dataset.cols = cols;
wrapper.appendChild(grid);
return { wrapper, grid };

}

function createCell(grid, index, content = “”, extraClass = “”) {
const cell = document.createElement(“div”);
cell.className = cell ${extraClass}.trim();
cell.dataset.index = index;

if (content !== "") {
    cell.textContent = content;
}
grid.appendChild(cell);
return cell;

}

function shapeText(shape) {
return SHAPES[shape] || shape || “”;
}

function setCellShape(cell, shape) {
cell.textContent = shapeText(shape);
cell.dataset.shape = shape || “”;
}

/* مرحله ۱: الگوی رنگ‌ها */
function renderColorQuestion() {
instruction.textContent = “به ترتیب رنگ‌ها نگاه کن و خانه‌های خالی را کامل کن. 🌈”;

const { wrapper, grid } = createGrid(1, 10);
const sequence = [
    "blue", "red", "blue", "red", "blue", "red",
    null, null, null, null
];
currentAnswers = Array(10).fill(null);
sequence.forEach((color, index) => {
    const cell = createCell(grid, index, "", color ? `color-${color}` : "answer-cell");
    if (color) {
        cell.dataset.color = color;
        cell.style.backgroundColor = COLORS[color];
        currentAnswers[index] = color;
    } else {
        cell.addEventListener("click", () => {
            clickSound();
            const next = nextColor(currentAnswers[index]);
            currentAnswers[index] = next;
            cell.style.backgroundColor = next ? COLORS[next] : "";
            cell.dataset.color = next || "";
            cell.textContent = "";
            cell.classList.toggle("selected-cell", !!next);
        });
    }
});
taskArea.appendChild(wrapper);
createColorPalette();

}

function nextColor(current) {
const names = Object.keys(COLORS);
if (!current) return names[0];
return names[(names.indexOf(current) + 1) % names.length];
}

function createColorPalette() {
const label = document.createElement(“div”);
label.className = “mouse-note”;
label.textContent = “برای انتخاب رنگ، خانهٔ خالی را لمس کن.”;
paletteArea.appendChild(label);
}

/* مرحله ۲: الگوی شکل‌ها */
function renderShapeQuestion() {
instruction.textContent = “به ترتیب شکل‌ها نگاه کن و الگو را ادامه بده. 🔺”;

const { wrapper, grid } = createGrid(1, 15);
const sequence = [
    "heart", "heart", "triangle", "triangle", "diamond",
    "heart", "heart", "triangle", "triangle", "diamond",
    null, null, null, null, null
];
currentAnswers = sequence.slice();
sequence.forEach((shape, index) => {
    const cell = createCell(
        grid,
        index,
        shape ? shapeText(shape) : "",
        shape ? "" : "answer-cell"
    );
    if (shape) {
        cell.dataset.shape = shape;
        cell.style.color = shapeColor(shape);
    } else {
        cell.addEventListener("click", () => {
            const order = Object.keys(SHAPES);
            const current = currentAnswers[index];
            const next = !current ? order[0] :
                order[(order.indexOf(current) + 1) % order.length];
            currentAnswers[index] = next;
            setCellShape(cell, next);
            cell.style.color = shapeColor(next);
            cell.classList.add("selected-cell");
            clickSound();
        });
    }
});
taskArea.appendChild(wrapper);
createShapePalette();

}

function shapeColor(shape) {
const map = {
heart: “#ff73ad”,
triangle: “#42a5f5”,
diamond: “#9c64e8”,
circle: “#58c86b”,
star: “#d7a800”,
square: “#ef5350”
};
return map[shape] || “#7438c8”;
}

function createShapePalette() {
const label = document.createElement(“div”);
label.className = “mouse-note”;
label.textContent = “برای کامل کردن الگو، روی خانه‌های خالی بزن.”;
paletteArea.appendChild(label);
}

/* مراحل ۳ و ۴: پیدا کردن آجر ناهماهنگ با کمک موش */
const mouseQuestions = {
3: {
title: “مرحله ۳: موش و پنیر 🐭”,
shapes: [
“circle”, “star”, “circle”, “star”, “circle”,
“triangle”, “circle”, “star”, “circle”, “star”
],
wrongIndex: 5,
expected: “star”
},
4: {
title: “مرحله ۴: موش و پنیر 🐭”,
shapes: [
“square”, “triangle”, “square”, “triangle”, “diamond”,
“triangle”, “square”, “triangle”, “square”, “triangle”
],
wrongIndex: 4,
expected: “square”
}
};

function renderMouseQuestion(questionNumber) {
const question = mouseQuestions[questionNumber];
mousePuzzleSolved = false;

instruction.textContent =
    "پنیر موش گرسنه زیر کدام آجر است؟ آن را پیدا کن و موش را به غذایش برسان!";
const scene = document.createElement("div");
scene.className = "mouse-scene";
scene.dataset.question = questionNumber;
const note = document.createElement("div");
note.className = "mouse-note";
note.textContent =
    "الگو را با دقت بخوان. موش را بگیر و روی آجری ببر که الگو را به هم زده است. 🧀";
scene.appendChild(note);
const { wrapper, grid } = createGrid(1, question.shapes.length, "mouse-grid");
const cells = [];
question.shapes.forEach((shape, index) => {
    const cell = createCell(grid, index, "", "brick-target");
    cell.dataset.shape = shape;
    const shapeSpan = document.createElement("span");
    shapeSpan.className = "shape-content";
    shapeSpan.textContent = shapeText(shape);
    shapeSpan.style.color = shapeColor(shape);
    cell.appendChild(shapeSpan);
    cells.push(cell);
});
scene.appendChild(wrapper);
const mouse = document.createElement("div");
mouse.className = "mouse";
mouse.textContent = "🐭";
mouse.setAttribute("role", "button");
mouse.setAttribute("aria-label", "موش را بگیر و روی آجر موردنظر ببر");
mouse.setAttribute("tabindex", "0");
mouse.title = "موش را بگیر و روی آجر موردنظر ببر";
scene.appendChild(mouse);
taskArea.appendChild(scene);
/* برای جلوگیری از لو رفتن پاسخ، هیچ خانه‌ای برجسته نمی‌شود. */
paletteArea.innerHTML = "";
currentAnswers = question.shapes.slice();
enableMouseDrag(mouse, scene, grid, cells, question);

}

function enableMouseDrag(mouse, scene, grid, cells, question) {
let dragging = false;
let pointerId = null;
let offsetX = 0;
let offsetY = 0;
let startX = 0;
let startY = 0;

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function positionMouse(clientX, clientY) {
    const sceneRect = scene.getBoundingClientRect();
    const x = clientX - sceneRect.left - offsetX;
    const y = clientY - sceneRect.top - offsetY;
    mouse.style.left = `${clamp(x, 0, scene.clientWidth - mouse.offsetWidth)}px`;
    mouse.style.top = `${clamp(y, 0, scene.clientHeight - mouse.offsetHeight)}px`;
}
function onPointerDown(event) {
    if (mousePuzzleSolved || dragging) return;
    event.preventDefault();
    getAudioContext();
    dragging = true;
    pointerId = event.pointerId;
    const mouseRect = mouse.getBoundingClientRect();
    offsetX = event.clientX - mouseRect.left;
    offsetY = event.clientY - mouseRect.top;
    startX = event.clientX;
    startY = event.clientY;
    mouse.classList.add("dragging");
    try {
        mouse.setPointerCapture(pointerId);
    } catch (error) {
        /* بعضی مرورگرها ممکن است pointer capture را نپذیرند. */
    }
    feedback.textContent = "آفرین! موش را به آجری ببر که با الگو هماهنگ نیست.";
    feedback.style.color = "#7438c8";
}
function onPointerMove(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    event.preventDefault();
    positionMouse(event.clientX, event.clientY);
}
function onPointerUp(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    dragging = false;
    mouse.classList.remove("dragging");
    try {
        mouse.releasePointerCapture(pointerId);
    } catch (error) {
        /* مشکلی نیست؛ می‌توانیم ادامه بدهیم. */
    }
    pointerId = null;
    const target = getCellUnderPointer(event.clientX, event.clientY, cells);
    if (!target) {
        returnMouseHome();
        return;
    }
    const index = Number(target.dataset.index);
    if (index === question.wrongIndex) {
        revealCheese(target, mouse, scene, question);
    } else {
        showWrong("این آجر با الگو هماهنگ است! دوباره فکر کن و تلاش کن. 💜");
        mouse.classList.add("happy");
        setTimeout(() => {
            mouse.classList.remove("happy");
            returnMouseHome();
        }, 650);
    }
}
function getCellUnderPointer(x, y, cellList) {
    const elements = document.elementsFromPoint(x, y);
    for (const element of elements) {
        const cell = element.closest(".brick-target");
        if (cell && cellList.includes(cell)) return cell;
    }
    return null;
}
function returnMouseHome() {
    mouse.style.left = "10px";
    mouse.style.top = "8px";
}
mouse.addEventListener("pointerdown", onPointerDown);
mouse.addEventListener("pointermove", onPointerMove);
mouse.addEventListener("pointerup", onPointerUp);
mouse.addEventListener("pointercancel", () => {
    dragging = false;
    pointerId = null;
    mouse.classList.remove("dragging");
    returnMouseHome();
});
mouse.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        feedback.textContent = "موش را با انگشت یا ماوس بگیر و روی آجر موردنظر ببر.";
    }
});

}

function revealCheese(cell, mouse, scene, question) {
if (mousePuzzleSolved) return;
mousePuzzleSolved = true;

const shapeSpan = cell.querySelector(".shape-content");
/* شکل ناهماهنگ پایین می‌افتد و پنیر زیر آن نمایان می‌شود. */
cell.classList.add("brick-falling");
setTimeout(() => {
    if (shapeSpan) shapeSpan.remove();
    cell.classList.remove("brick-falling");
    cell.classList.add("cheese-revealed");
    mouse.classList.add("happy");
    mouse.textContent = "🐭";
    scene.classList.add("solved");
    const success = document.createElement("div");
    success.className = "mouse-success-message";
    success.textContent = "هورااا! آفرین! آجر ناهماهنگ را پیدا کردی؛ موش به پنیرش رسید! 🧀🎉";
    scene.appendChild(success);
    feedback.textContent = "چه الگویاب باهوشی! موش را به غذایش رساندی! 🌟";
    feedback.style.color = "#159447";
    correctSound();
    setTimeout(() => playTone(1040, 0.18, "sine", 0.07), 300);
    fireworks();
}, 380);

}

/* مرحله ۵: الگوی گل‌ها */
function renderFlowerQuestion() {
instruction.textContent = “گل‌ها را با دقت نگاه کن و الگوی رنگی را ادامه بده. 🌸”;

const rows = 3;
const cols = 13;
const { wrapper, grid } = createGrid(rows, cols);
const sequence = [];
for (let i = 0; i < rows * cols; i++) {
    sequence.push(i < 18 ? (i % 2 === 0 ? "pink" : "yellow") : null);
}
currentAnswers = sequence.slice();
sequence.forEach((color, index) => {
    const cell = createCell(
        grid,
        index,
        color ? "🌸" : "",
        color ? `color-${color}` : "answer-cell"
    );
    if (color) {
        cell.style.backgroundColor = COLORS[color];
    } else {
        cell.addEventListener("click", () => {
            const next = currentAnswers[index] === "pink" ? "yellow" :
                currentAnswers[index] === "yellow" ? "pink" : "pink";
            currentAnswers[index] = next;
            cell.textContent = "🌸";
            cell.style.backgroundColor = COLORS[next];
            cell.classList.add("selected-cell");
            clickSound();
        });
    }
});
taskArea.appendChild(wrapper);
createColorPalette();

}

/* مرحله ۶: الگوی خطی */
function renderLinearQuestion() {
instruction.textContent = “الگوی رنگی را پیدا کن و خانه‌های خالی را کامل کن. 🎨”;

const { wrapper, grid } = createGrid(1, 12);
const sequence = [
    "yellow", "blue", "yellow", "blue", "yellow", "blue",
    "yellow", "blue", null, null, null, null
];
currentAnswers = sequence.slice();
sequence.forEach((color, index) => {
    const cell = createCell(grid, index, "", color ? `color-${color}` : "answer-cell");
    if (color) {
        cell.style.backgroundColor = COLORS[color];
        cell.dataset.color = color;
    } else {
        cell.addEventListener("click", () => {
            const next = currentAnswers[index] === "yellow" ? "blue" :
                currentAnswers[index] === "blue" ? "yellow" : "yellow";
            currentAnswers[index] = next;
            cell.style.backgroundColor = COLORS[next];
            cell.dataset.color = next;
            cell.classList.add("selected-cell");
            clickSound();
        });
    }
});
taskArea.appendChild(wrapper);
createColorPalette();

}

/* مرحله ۷: الگوی شکل‌ها */
function renderFinalShapeQuestion() {
instruction.textContent = “الگوی شکل‌ها را پیدا کن و خانه‌های خالی را کامل کن. ⭐”;

const { wrapper, grid } = createGrid(1, 12);
const sequence = [
    "circle", "triangle", "circle", "triangle",
    "circle", "triangle", "circle", "triangle",
    null, null, null, null
];
currentAnswers = sequence.slice();
sequence.forEach((shape, index) => {
    const cell = createCell(
        grid,
        index,
        shape ? shapeText(shape) : "",
        shape ? "" : "answer-cell"
    );
    if (shape) {
        cell.dataset.shape = shape;
        cell.style.color = shapeColor(shape);
    } else {
        cell.addEventListener("click", () => {
            const next = currentAnswers[index] === "circle" ? "triangle" :
                currentAnswers[index] === "triangle" ? "circle" : "circle";
            currentAnswers[index] = next;
            setCellShape(cell, next);
            cell.style.color = shapeColor(next);
            cell.classList.add("selected-cell");
            clickSound();
        });
    }
});
taskArea.appendChild(wrapper);
createShapePalette();

}

/* بررسی پاسخ‌ها */
function checkColorQuestion() {
const grid = taskArea.querySelector(”.pattern-grid”);
if (!grid) return;

const cells = [...grid.querySelectorAll(".cell")];
const expected = ["blue", "red", "blue", "red", "blue", "red",
    "blue", "red", "blue", "red"];
const ok = cells.length === expected.length &&
    cells.every((cell, index) => cell.dataset.color === expected[index]);
if (ok) {
    showCorrect("آفرین! الگوی رنگ‌ها را درست ادامه دادی. 🌈");
    fireworks();
} else {
    showWrong("به ترتیب آبی، قرمز نگاه کن و دوباره تلاش کن.");
}

}

function checkShapeQuestion() {
const grid = taskArea.querySelector(”.pattern-grid”);
if (!grid) return;

const cells = [...grid.querySelectorAll(".cell")];
const expected = [
    "heart", "heart", "triangle", "triangle", "diamond",
    "heart", "heart", "triangle", "triangle", "diamond",
    "heart", "heart", "triangle", "triangle", "diamond"
];
const ok = cells.length === expected.length &&
    cells.every((cell, index) => cell.dataset.shape === expected[index]);
if (ok) {
    showCorrect("آفرین! الگوی شکل‌ها را کامل کردی. ⭐");
    fireworks();
} else {
    showWrong("به ترتیب تکرار شکل‌ها نگاه کن و دوباره امتحان کن.");
}

}

function checkMouseQuestion() {
if (mousePuzzleSolved) {
showCorrect(“تو پنیر را پیدا کردی! آفرین! 🧀”);
} else {
feedback.textContent =
“هنوز پاسخ را بررسی نمی‌کنیم؛ موش را بگیر و روی آجری ببر که الگو را به هم زده است. 🐭”;
feedback.style.color = “#7438c8”;
clickSound();
}
}

function checkFlowerQuestion() {
const grid = taskArea.querySelector(”.pattern-grid”);
if (!grid) return;

const cells = [...grid.querySelectorAll(".cell")];
const ok = cells.length === 39 &&
    cells.every((cell, index) => {
        if (index < 18) return true;
        const expected = (index - 18) % 2 === 0 ? "pink" : "yellow";
        return cell.style.backgroundColor === COLORS[expected];
    });
if (ok) {
    showCorrect("آفرین! الگوی گل‌ها را کامل کردی. 🌸");
    fireworks();
} else {
    showWrong("رنگ گل‌ها را یکی‌درمیان ادامه بده.");
}

}

function checkLinearQuestion() {
const grid = taskArea.querySelector(”.pattern-grid”);
if (!grid) return;

const cells = [...grid.querySelectorAll(".cell")];
const expected = [
    "yellow", "blue", "yellow", "blue", "yellow", "blue",
    "yellow", "blue", "yellow", "blue", "yellow", "blue"
];
const ok = cells.length === expected.length &&
    cells.every((cell, index) => cell.dataset.color === expected[index]);
if (ok) {
    showCorrect("آفرین! الگوی رنگی را درست ادامه دادی. 🎨");
    fireworks();
} else {
    showWrong("رنگ زرد و آبی را یکی‌درمیان ادامه بده.");
}

}

function checkFinalShapeQuestion() {
const grid = taskArea.querySelector(”.pattern-grid”);
if (!grid) return;

const cells = [...grid.querySelectorAll(".cell")];
const expected = [
    "circle", "triangle", "circle", "triangle",
    "circle", "triangle", "circle", "triangle",
    "circle", "triangle", "circle", "triangle"
];
const ok = cells.length === expected.length &&
    cells.every((cell, index) => cell.dataset.shape === expected[index]);
if (ok) {
    showCorrect("آفرین! الگوی شکل‌ها را کامل کردی. ⭐");
    fireworks();
} else {
    showWrong("دایره و مثلث را یکی‌درمیان ادامه بده.");
}

}

function checkCurrentStage() {
switch (currentStage) {
case 0: checkColorQuestion(); break;
case 1: checkShapeQuestion(); break;
case 2:
case 3: checkMouseQuestion(); break;
case 4: checkFlowerQuestion(); break;
case 5: checkLinearQuestion(); break;
case 6: checkFinalShapeQuestion(); break;
}
}

function clearCurrentAnswer() {
if (currentStage === 2 || currentStage === 3) {
if (mousePuzzleSolved) {
feedback.textContent = “برای دیدن دوبارهٔ این سؤال، به مرحلهٔ بعد برو و برگرد.”;
} else {
feedback.textContent = “موش را بگیر و روی آجر موردنظر ببر. الگو را با دقت بخوان!”;
}
feedback.style.color = “#7438c8”;
return;
}

renderStage();
feedback.textContent = "خانه‌های قابل انتخاب دوباره پاک شدند.";
feedback.style.color = "#7438c8";

}

/* نمایش مرحله */
function renderStage() {
taskArea.innerHTML = “”;
paletteArea.innerHTML = “”;
feedback.textContent = “”;
instruction.textContent = “”;
currentAnswers = [];
mousePuzzleSolved = false;

stageTitle.textContent = `مرحله ${currentStage + 1}`;
progressText.textContent = `مرحله ${currentStage + 1} از ${TOTAL_STAGES}`;
prevBtn.disabled = currentStage === 0;
nextBtn.textContent = currentStage === TOTAL_STAGES - 1 ? "پایان 🎉" : "بعدی ▶";
switch (currentStage) {
    case 0:
        stageTitle.textContent = "مرحله ۱: الگوی رنگ‌ها";
        renderColorQuestion();
        break;
    case 1:
        stageTitle.textContent = "مرحله ۲: الگوی شکل‌ها";
        renderShapeQuestion();
        break;
    case 2:
        stageTitle.textContent = mouseQuestions[3].title;
        renderMouseQuestion(3);
        break;
    case 3:
        stageTitle.textContent = mouseQuestions[4].title;
        renderMouseQuestion(4);
        break;
    case 4:
        stageTitle.textContent = "مرحله ۵: الگوی گل‌ها";
        renderFlowerQuestion();
        break;
    case 5:
        stageTitle.textContent = "مرحله ۶: الگوی رنگی";
        renderLinearQuestion();
        break;
    case 6:
        stageTitle.textContent = "مرحله ۷: الگوی شکل‌ها";
        renderFinalShapeQuestion();
        break;
}

}

/* پایان بازی */
function finishGame() {
gameScreen.classList.add(“hidden”);
finishScreen.classList.remove(“hidden”);

finishMessage.textContent = studentName
    ? `${studentName} جان، تو با دقت و تلاش از همهٔ مرحله‌ها گذشتی. به خودت افتخار کن! 🌟`
    : "تو با دقت و تلاش از همهٔ مرحله‌ها گذشتی. به خودت افتخار کن! 🌟";
fireworks();
correctSound();

}

/* رویدادها */
startBtn.addEventListener(“click”, () => {
getAudioContext();
studentName = studentNameInput.value.trim();

startScreen.classList.add("hidden");
finishScreen.classList.add("hidden");
gameScreen.classList.remove("hidden");
currentStage = 0;
renderStage();
window.scrollTo({ top: 0, behavior: "smooth" });

});

prevBtn.addEventListener(“click”, () => {
if (currentStage <= 0) return;
currentStage–;
renderStage();
window.scrollTo({ top: 0, behavior: “smooth” });
});

nextBtn.addEventListener(“click”, () => {
if (currentStage < TOTAL_STAGES - 1) {
currentStage++;
renderStage();
window.scrollTo({ top: 0, behavior: “smooth” });
} else {
finishGame();
}
});

checkBtn.addEventListener(“click”, checkCurrentStage);
clearBtn.addEventListener(“click”, clearCurrentAnswer);

restartBtn.addEventListener(“click”, () => {
currentStage = 0;
mousePuzzleSolved = false;
finishScreen.classList.add(“hidden”);
startScreen.classList.remove(“hidden”);
gameScreen.classList.add(“hidden”);
studentNameInput.value = “”;
studentName = “”;
window.scrollTo({ top: 0, behavior: “smooth” });
});
