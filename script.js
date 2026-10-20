// ========================================
// بازی الگوی منظم 🎨
// فایل: script.js
// ========================================

const welcome = document.getElementById("welcome");
const game = document.getElementById("game");
const finish = document.getElementById("finish");

const studentName = document.getElementById("studentName");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const stageLabel = document.getElementById("stageLabel");
const stageTitle = document.getElementById("stageTitle");
const stageInstruction = document.getElementById("stageInstruction");

const modelBoard = document.getElementById("modelBoard");
const drawingCanvas = document.getElementById("drawingCanvas");
const finalCanvas = document.getElementById("finalCanvas");

const prevButton = document.getElementById("prevButton");
const clearButton = document.getElementById("clearButton");
const checkButton = document.getElementById("checkButton");
const nextButton = document.getElementById("nextButton");

const feedback = document.getElementById("feedback");

const drawingContext = drawingCanvas.getContext("2d");
const finalContext = finalCanvas.getContext("2d");

let currentStage = 0;
let currentName = "";
let isDrawing = false;

let drawingPoints = [];
let finalPoints = [];
let selectedCells = new Map();

const GRID_COLUMNS = 12;
const GRID_ROWS = 6;

// رنگ‌های مورد استفاده در بازی
const COLORS = {
    red: "#e53935",
    green: "#43a047",
    purple: "#8e44ad",
    yellow: "#fbc02d",
    blue: "#1e88e5",
    white: "#ffffff",
    dark: "#263238"
};

// ========================================
// الگوهای بازی
// ========================================

const stages = [
    {
        title: "تمرین ۱",
        type: "line",
        color: COLORS.red,
        pattern: [0, 1, 0, 1, 0, 1, 0, 1],
        instruction: "الگو را بلند بخوان و سپس ادامه بده."
    },
    {
        title: "تمرین ۲",
        type: "line",
        color: COLORS.green,
        pattern: [1, 1, 0, 0, 1, 1, 0, 0],
        instruction: "الگو را بلند بخوان و سپس ادامه بده."
    },
    {
        title: "تمرین ۳",
        type: "line",
        color: COLORS.purple,
        pattern: [1, 0, 0, 1, 0, 0, 1, 0],
        instruction: "الگو را بلند بخوان و سپس ادامه بده."
    },
    {
        title: "تمرین ۴",
        type: "line",
        color: COLORS.yellow,
        pattern: [1, 1, 1, 0, 0, 1, 1, 1],
        instruction: "الگو را بلند بخوان و سپس ادامه بده."
    },
    {
        title: "تمرین ۵",
        type: "cells",
        pattern: ["green", "green", "empty", "empty"],
        instruction: "الگو را بلند بخوان و سپس ادامه بده."
    },
    {
        title: "تمرین ۶",
        type: "cells",
        pattern: ["blue", "red", "blue", "red"],
        instruction: "الگو را بلند بخوان و سپس ادامه بده."
    },
    {
        title: "تمرین ۷",
        type: "cells",
        pattern: ["blue", "red", "green", "yellow"],
        instruction: "الگو را بلند بخوان و سپس ادامه بده."
    }
];

// ========================================
// شروع بازی
// ========================================
startButton.addEventListener("click", () => {
    currentName = studentName.value.trim() || "دانش‌آموز";

    welcome.classList.add("hidden");
    finish.classList.add("hidden");
    game.classList.remove("hidden");

    currentStage = 0;
    showStage();
});


    welcome.classList.add("hidden");
    finish.classList.add("hidden");
    game.classList.remove("hidden");

    currentStage = 0;
    showStage();
});

restartButton.addEventListener("click", () => {
    finish.classList.add("hidden");
    welcome.classList.remove("hidden");
    studentName.value = "";
});

// ========================================
// نمایش مرحله
// ========================================

function showStage() {
    if (currentStage >= stages.length) {
        showFinish();
        return;
    }

    const stage = stages[currentStage];

    stageLabel.textContent =
        `مرحله ${currentStage + 1} از ${stages.length}`;

    stageTitle.textContent = stage.title;
    stageInstruction.textContent = stage.instruction;

    feedback.textContent = "";
    feedback.className = "";

    selectedCells.clear();
    drawingPoints = [];
    finalPoints = [];

    modelBoard.innerHTML = "";

    resizeCanvases();

    if (stage.type === "line") {
        renderLineModel(stage);
    } else {
        renderCellModel(stage);
    }

    drawGrid(drawingCanvas, drawingContext);
    drawGrid(finalCanvas, finalContext);

    prevButton.disabled = currentStage === 0;
    nextButton.textContent =
        currentStage === stages.length - 1
            ? "پایان بازی 🏆"
            : "مرحله بعد";
}

// ========================================
// تنظیم اندازه بوم‌ها
// ========================================

function resizeCanvases() {
    [drawingCanvas, finalCanvas].forEach(canvas => {
        const rect = canvas.getBoundingClientRect();

        const width = Math.max(280, rect.width);
        const height = Math.max(130, rect.height);

        const ratio = window.devicePixelRatio || 1;

        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);

        const context = canvas.getContext("2d");
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    });
}

// ========================================
// رسم جدول روی بوم
// ========================================

function drawGrid(canvas, context) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    context.clearRect(0, 0, width, height);

    const cellWidth = width / GRID_COLUMNS;
    const cellHeight = height / GRID_ROWS;

    context.lineWidth = 1;
    context.strokeStyle = "#cbd5e1";

    for (let column = 0; column <= GRID_COLUMNS; column++) {
        const x = column * cellWidth;

        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }

    for (let row = 0; row <= GRID_ROWS; row++) {
        const y = row * cellHeight;

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
    }
}

// ========================================
// نمایش الگوی خطی
// ========================================

function renderLineModel(stage) {
    const canvas = document.createElement("canvas");

    canvas.className = "model-line-canvas";
    canvas.width = 600;
    canvas.height = 180;

    modelBoard.appendChild(canvas);

    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#d9e2ec";
    context.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += 30) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }

    for (let y = 0; y <= canvas.height; y += 30) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }

    const pattern = stage.pattern;
    const step = 50;
    const startX = 30;
    const centerY = canvas.height / 2;
    const amplitude = 35;

    context.beginPath();
    context.strokeStyle = stage.color;
    context.lineWidth = 5;
    context.lineCap = "round";
    context.lineJoin = "round";

    pattern.forEach((value, index) => {
        const x = startX + index * step;
        const y = centerY + (value === 1 ? -amplitude : amplitude);

        if (index === 0) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
    });

    context.stroke();
}

// ========================================
// نمایش الگوی رنگی
// ========================================

function renderCellModel(stage) {
    const pattern = stage.pattern;

    for (let row = 0; row < GRID_ROWS; row++) {
        for (let column = 0; column < GRID_COLUMNS; column++) {
            const index = row * GRID_COLUMNS + column;

            const cell = document.createElement("button");
            cell.type = "button";
            cell.className = "pattern-cell";

            // دو ردیف اول نمونه الگو هستند.
            // ردیف‌های بعدی برای تمرین کودک خالی می‌مانند.
            if (row < 2) {
                const colorName = pattern[column % pattern.length];

                if (colorName !== "empty") {
                    cell.style.backgroundColor = COLORS[colorName];
                }
            } else {
                cell.style.backgroundColor = "#ffffff";
                cell.dataset.index = index;

                cell.addEventListener("click", () => {
                    fillCell(cell, index, stage);
                });
            }

            modelBoard.appendChild(cell);
        }
    }
}

// ========================================
// رنگ‌آمیزی خانه‌ها
// ========================================

function fillCell(cell, index, stage) {
    const pattern = stage.pattern;
    const position = index % GRID_COLUMNS;
    const expectedColor = pattern[position % pattern.length];

    if (expectedColor === "empty") {
        cell.style.backgroundColor = "#ffffff";
        selectedCells.delete(index);
        return;
    }

    cell.style.backgroundColor = COLORS[expectedColor];
    selectedCells.set(index, expectedColor);
}

// ========================================
// رسم آزاد با انگشت یا ماوس
// ========================================

function getCanvasPosition(event, canvas) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function startDrawing(event) {
    isDrawing = true;

    const point = getCanvasPosition(event, drawingCanvas);

    drawingPoints.push({
        x: point.x,
        y: point.y
    });

    drawingContext.beginPath();
    drawingContext.moveTo(point.x, point.y);

    drawingCanvas.setPointerCapture?.(event.pointerId);
}

function continueDrawing(event) {
    if (!isDrawing) return;

    const point = getCanvasPosition(event, drawingCanvas);

    drawingPoints.push({
        x: point.x,
        y: point.y
    });

    const stage = stages[currentStage];

    drawingContext.lineTo(point.x, point.y);
    drawingContext.strokeStyle =
        stage.type === "line" ? stage.color : COLORS.blue;

    drawingContext.lineWidth = 4;
    drawingContext.lineCap = "round";
    drawingContext.lineJoin = "round";

    drawingContext.stroke();
}

function stopDrawing() {
    isDrawing = false;
    drawingContext.beginPath();
}

drawingCanvas.addEventListener("pointerdown", startDrawing);
drawingCanvas.addEventListener("pointermove", continueDrawing);
drawingCanvas.addEventListener("pointerup", stopDrawing);
drawingCanvas.addEventListener("pointercancel", stopDrawing);
drawingCanvas.addEventListener("pointerleave", stopDrawing);

// ========================================
// دکمه پاک کردن
// ========================================

clearButton.addEventListener("click", () => {
    drawingPoints = [];
    finalPoints = [];
    selectedCells.clear();

    drawGrid(drawingCanvas, drawingContext);
    drawGrid(finalCanvas, finalContext);

    showStage();

    feedback.textContent = "صفحه پاک شد. دوباره امتحان کن! ✏️";
});

// ========================================
// بررسی پاسخ
// ========================================

checkButton.addEventListener("click", () => {
    const stage = stages[currentStage];

    if (stage.type === "line") {
        if (drawingPoints.length < 8) {
            feedback.textContent =
                "هنوز الگو را کامل نکشیدی. دوباره تلاش کن! ✏️";
            feedback.className = "try-again";
            return;
        }

        feedback.textContent =
            "آفرین! نقاشی‌ات را با الگو مقایسه کن. 🌟";
        feedback.className = "success";
        return;
    }

    if (selectedCells.size === 0) {
        feedback.textContent =
            "چند خانه را رنگ کن و دوباره بررسی کن! 🎨";
        feedback.className = "try-again";
        return;
    }

    feedback.textContent =
        "آفرین! حالا رنگ‌ها را با الگوی نمونه مقایسه کن. 🌈";
    feedback.className = "success";
});

// ========================================
// رفتن به مرحله قبل
// ========================================

prevButton.addEventListener("click", () => {
    if (currentStage > 0) {
        currentStage--;
        showStage();
    }
});

// ========================================
// رفتن به مرحله بعد
// ========================================

nextButton.addEventListener("click", () => {
    if (currentStage < stages.length - 1) {
        currentStage++;
        showStage();
    } else {
        showFinish();
    }
});

// ========================================
// پایان بازی
// ========================================

function showFinish() {
    game.classList.add("hidden");
    finish.classList.remove("hidden");

    document.getElementById("finishMessage").textContent =
        `آفرین ${currentName}! همهٔ مرحله‌ها را دیدی و تمرین کردی. 🏆`;
}

// ========================================
// تنظیم دوباره اندازه صفحه
// ========================================

window.addEventListener("resize", () => {
    if (game.classList.contains("hidden")) return;

    showStage();
});
