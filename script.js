"use strict";


/* =========================================
   تنظیمات رنگ‌ها
========================================= */

const COLORS = {
    red: "#e53935",
    blue: "#159ed0",
    green: "#55ad48",
    yellow: "#f4c62f",
    orange: "#e9782c",
    black: "#242424"
};

const COLOR_NAMES = {
    red: "قرمز",
    blue: "آبی",
    green: "سبز",
    yellow: "زرد",
    orange: "نارنجی",
    black: "مشکی"
};


/* =========================================
   هشت مرحله بازی
========================================= */

const STAGES = [

    {
        title: "الگوی خطی قرمز",
        question: "با دقت به الگوی قرمز نگاه کن و آن را در جدول پایین تکرار کن.",
        kind: "line",
        color: "red",
        cols: 14,
        rows: 4,
        fixedColumns: 6,
        copyCols: 8,
        points: [2, 3, 2, 3, 2, 3, 2, 3, 2]
    },

    {
        title: "الگوی خطی سبز",
        question: "الگوی سبز را با همان ترتیب در جدول پایین رسم کن.",
        kind: "line",
        color: "green",
        cols: 14,
        rows: 4,
        fixedColumns: 6,
        copyCols: 8,
        points: [3, 2, 2, 3, 3, 2, 2, 3, 3]
    },

    {
        title: "الگوی خطی مشکی",
        question: "مسیر خط را با دقت نگاه کن و یک بار در جدول پایین رسم کن.",
        kind: "line",
        color: "black",
        cols: 14,
        rows: 4,
        fixedColumns: 6,
        copyCols: 8,
        points: [2, 3, 3, 3, 2, 2, 2, 3, 3]
    },

    {
        title: "الگوی خطی زرد",
        question: "الگوی زرد را در جدول خالی پایین تکرار کن.",
        kind: "line",
        color: "yellow",
        cols: 14,
        rows: 4,
        fixedColumns: 6,
        copyCols: 8,
        points: [3, 2, 2, 3, 3, 2, 2, 3, 3]
    },

    {
        title: "الگوی گل",
        question: "با توجه به الگوی گل، یک بار آن را در جدول پایین بساز.",
        kind: "cells",
        cols: 12,
        rows: 3,
        fixedColumns: 6,
        copyCols: 3,
        motif: [
            [0, 0, "green"],
            [0, 2, "green"],

            [1, 0, "green"],
            [1, 1, "red"],
            [1, 2, "green"],

            [2, 1, "green"]
        ]
    },

    {
        title: "الگوی پله‌ای سبز",
        question: "الگوی سبز را یک بار در جدول پایین تکرار کن.",
        kind: "cells",
        cols: 16,
        rows: 3,
        fixedColumns: 12,
        copyCols: 4,
        motif: [
            [0, 0, "green"],
            [0, 2, "green"],

            [1, 1, "green"],
            [1, 3, "green"],

            [2, 0, "green"],
            [2, 2, "green"]
        ]
    },

    {
        title: "الگوی آبی و قرمز",
        question: "ترتیب رنگ‌های آبی و قرمز را در جدول پایین تکرار کن.",
        kind: "cells",
        cols: 12,
        rows: 2,
        fixedColumns: 8,
        copyCols: 4,
        motif: [
            [0, 0, "blue"],
            [0, 1, "red"],
            [0, 2, "blue"],
            [0, 3, "red"],

            [1, 0, "red"],
            [1, 1, "blue"],
            [1, 2, "red"],
            [1, 3, "blue"]
        ]
    },

    {
        title: "الگوی چهار رنگ",
        question: "الگوی چهاررنگ را یک بار در جدول پایین تکرار کن.",
        kind: "cells",
        cols: 16,
        rows: 1,
        fixedColumns: 8,
        copyCols: 4,
        motif: [
            [0, 0, "blue"],
            [0, 1, "red"],
            [0, 2, "green"],
            [0, 3, "yellow"]
        ]
    }

];


/* =========================================
   عناصر صفحه
========================================= */

const $ = id => document.getElementById(id);

const welcome = $("welcome");
const game = $("game");
const finish = $("finish");

const studentName = $("studentName");
const startButton = $("startButton");

const stageCounter = $("stageCounter");
const progressBar = $("progressBar");

const questionTitle = $("questionTitle");
const questionText = $("questionText");

const palette = $("palette");
const eraserButton = $("eraserButton");

const mainBoard = $("mainBoard");
const copyBoard = $("copyBoard");

const boardLabel = $("boardLabel");
const copyLabel = $("copyLabel");

const feedback = $("feedback");

const prevButton = $("prevButton");
const checkButton = $("checkButton");
const nextButton = $("nextButton");
const exitButton = $("exitButton");

const restartButton = $("restartButton");

const fireworksCanvas = $("fireworksCanvas");


/* =========================================
   وضعیت بازی
========================================= */

let currentStage = 0;

let selectedColor = "red";

let eraserActive = false;

let student = "";

const answers = {};

const completedStages = new Set();

let particles = [];

let animationFrame = null;

let finishTimer = null;


/* =========================================
   ابزارهای عمومی
========================================= */

function getStage() {
    return STAGES[currentStage];
}


function answerKey(stageIndex) {
    return String(stageIndex);
}


function getAnswer(stageIndex) {

    const key = answerKey(stageIndex);

    if (!answers[key]) {

        answers[key] = {
            cells: {},
            strokes: []
        };

    }

    return answers[key];

}


function showFeedback(message, type = "") {

    feedback.textContent = message;

    feedback.className = "feedback";

    if (type) {
        feedback.classList.add(type);
    }

}


function clearFeedback() {
    showFeedback("");
}


/* =========================================
   ساخت پالت مدادها
========================================= */

function renderPalette() {

    palette.innerHTML = "";

    Object.keys(COLORS).forEach(color => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "pencil-choice";

        button.style.setProperty(
            "--pencil",
            COLORS[color]
        );

        button.setAttribute(
            "aria-label",
            "مداد " + COLOR_NAMES[color]
        );

        const pencil = document.createElement("span");

        pencil.className = "pencil";

        const shine = document.createElement("i");

        pencil.appendChild(shine);

        button.appendChild(pencil);

        if (
            selectedColor === color &&
            !eraserActive
        ) {

            button.classList.add("selected");

        }

        button.addEventListener("click", () => {

            selectedColor = color;

            eraserActive = false;

            eraserButton.classList.remove("active");

            renderPalette();

        });

        palette.appendChild(button);

    });

}


/* =========================================
   پاک‌کن
========================================= */

function selectEraser() {

    eraserActive = !eraserActive;

    eraserButton.classList.toggle(
        "active",
        eraserActive
    );

    renderPalette();

}

eraserButton.addEventListener(
    "click",
    selectEraser
);


/* =========================================
   نمایش مرحله
========================================= */

function renderStage() {

    const stage = getStage();

    clearFeedback();

    selectedColor = "red";

    eraserActive = false;

    eraserButton.classList.remove("active");

    renderPalette();

    stageCounter.textContent =
        "مرحله " +
        (currentStage + 1) +
        " از " +
        STAGES.length;

    progressBar.style.width =
        ((currentStage + 1) / STAGES.length * 100) + "%";

    questionTitle.textContent = stage.title;

    questionText.textContent = stage.question;

    boardLabel.textContent = "الگوی اصلی";

    copyLabel.textContent =
        "یک بار الگوی اصلی را در جدول خالی تکرار کن";

    prevButton.disabled = currentStage === 0;

    nextButton.disabled =
        currentStage === STAGES.length - 1;

    if (stage.kind === "line") {

        renderLineStage(stage);

    } else {

        renderCellStage(stage);

    }

}


/* =========================================
   ساخت جدول
========================================= */

function makeBoard(element, cols, rows, extraClass = "") {

    element.innerHTML = "";

    element.style.setProperty("--cols", cols);

    element.style.setProperty("--rows", rows);

    const smallClass =
        element.id === "copyBoard"
            ? " small-board"
            : "";

    element.className =
        "board" +
        smallClass +
        (extraClass ? " " + extraClass : "");

    element.dataset.cols = cols;

    element.dataset.rows = rows;

}


/* =========================================
   نقشه الگوی رنگی
========================================= */

function makeMotifMap(stage) {

    const map = {};

    stage.motif.forEach(([row, col, color]) => {

        map[row + "_" + col] = color;

    });

    return map;

}


function expectedCell(stage, row, col) {

    const map = makeMotifMap(stage);

    const motifCol = col % stage.copyCols;

    return map[row + "_" + motifCol] || null;

}


/* =========================================
   ساخت جدول رنگی
========================================= */

function renderCellBoard(
    element,
    stage,
    boardName,
    cols,
    rows
) {

    makeBoard(element, cols, rows);

    const answer = getAnswer(currentStage);

    const isMain = boardName === "main";

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            const cell = document.createElement("button");

            cell.type = "button";

            cell.className = "grid-cell";

            cell.dataset.row = row;

            cell.dataset.col = col;

            if (isMain) {

                /*
                   جدول بالا فقط الگوی راهنماست.
                   دانش‌آموز نمی‌تواند آن را تغییر دهد.
                */

                cell.classList.add("locked");

                const expected = expectedCell(
                    stage,
                    row,
                    col
                );

                if (expected) {

                    cell.style.backgroundColor =
                        COLORS[expected];

                }

            } else {

                /*
                   جدول پایین همیشه از پاسخ‌های
                   ذخیره‌شده دانش‌آموز ساخته می‌شود.
                */

                cell.classList.add("answer-cell");

                const saved =
                    answer.cells[row + "_" + col] || null;

                if (saved) {

                    cell.style.backgroundColor =
                        COLORS[saved];

                }

                cell.addEventListener("click", () => {

                    if (completedStages.has(currentStage)) {
                        return;
                    }

                    const key = row + "_" + col;

                    if (eraserActive) {

                        delete answer.cells[key];

                        cell.style.backgroundColor = "#ffffff";

                    } else {

                        answer.cells[key] = selectedColor;

                        cell.style.backgroundColor =
                            COLORS[selectedColor];

                    }

                    clearFeedback();

                });

            }

            element.appendChild(cell);

        }

    }

}


/* =========================================
   نمایش مراحل رنگی
========================================= */

function renderCellStage(stage) {

    renderCellBoard(
        mainBoard,
        stage,
        "main",
        stage.cols,
        stage.rows
    );

    renderCellBoard(
        copyBoard,
        stage,
        "copy",
        stage.copyCols,
        stage.rows
    );

}


/* =========================================
   مختصات مسیر خطی
========================================= */

function getLinePoints(stage) {

    const points = [];

    const total = stage.points.length;

    stage.points.forEach((row, index) => {

        const x = total === 1
            ? 0
            : index / (total - 1) * 100;

        const y =
            (row + 0.5) / stage.rows * 100;

        points.push({
            x,
            y
        });

    });

    return points;

}


function pointsToPath(points) {

    if (!points.length) {
        return "";
    }

    return points.map((point, index) => {

        return (
            (index === 0 ? "M" : "L") +
            point.x + " " +
            point.y
        );

    }).join(" ");

}


/* =========================================
   ایجاد SVG
========================================= */

function createSvg(element, stage, boardName) {

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(
        svgNS,
        "svg"
    );

    svg.setAttribute("viewBox", "0 0 100 100");

    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    );

    svg.classList.add("line-svg");

    const expected = getLinePoints(stage);

    /*
       جدول بالا: فقط قسمت راهنما نمایش داده می‌شود.
       جدول پایین: هیچ خط راهنمایی ندارد.
    */

    if (boardName === "main") {

        const guidePoints = expected.slice(
            0,
            stage.fixedColumns
        );

        const guide = document.createElementNS(
            svgNS,
            "path"
        );

        guide.setAttribute(
            "d",
            pointsToPath(guidePoints)
        );

        guide.setAttribute(
            "stroke",
            COLORS[stage.color]
        );

        guide.setAttribute(
            "stroke-width",
            "2.8"
        );

        guide.classList.add(
            "line-path",
            "line-guide"
        );

        svg.appendChild(guide);

    }

    /*
       مسیرهای ذخیره‌شده فقط در جدول پاسخ
       نمایش داده می‌شوند.
    */

    if (boardName === "copy") {

        const answer = getAnswer(currentStage);

        answer.strokes.forEach(stroke => {

            const path = document.createElementNS(
                svgNS,
                "path"
            );

            path.setAttribute(
                "d",
                pointsToPath(stroke.points)
            );

            path.setAttribute(
                "stroke",
                stroke.color
            );

            path.setAttribute(
                "stroke-width",
                "3.2"
            );

            path.classList.add("line-path");

            svg.appendChild(path);

        });

        const drawLayer = document.createElementNS(
            svgNS,
            "path"
        );

        drawLayer.setAttribute("d", "");

        drawLayer.setAttribute(
            "stroke",
            "transparent"
        );

        drawLayer.setAttribute(
            "stroke-width",
            "14"
        );

        drawLayer.classList.add("line-draw");

        drawLayer.style.fill = "none";

        svg.appendChild(drawLayer);

    }

    element.appendChild(svg);

    if (boardName === "copy") {

        attachDrawing(
            svg,
            stage
        );

    }

}


/* =========================================
   ساخت خانه‌های پس‌زمینه
========================================= */

function createGridBackground(element, cols, rows) {

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            const cell = document.createElement("div");

            cell.className = "grid-cell locked";

            element.appendChild(cell);

        }

    }

}


/* =========================================
   نمایش مراحل خطی
========================================= */

function renderLineStage(stage) {

    makeBoard(
        mainBoard,
        stage.cols,
        stage.rows,
        "line-board"
    );

    makeBoard(
        copyBoard,
        stage.copyCols,
        stage.rows,
        "line-board"
    );

    createGridBackground(
        mainBoard,
        stage.cols,
        stage.rows
    );

    createGridBackground(
        copyBoard,
        stage.copyCols,
        stage.rows
    );

    createSvg(
        mainBoard,
        stage,
        "main"
    );

    createSvg(
        copyBoard,
        stage,
        "copy"
    );

}


/* =========================================
   محاسبه موقعیت انگشت یا ماوس
========================================= */

function getPointerPosition(event, svg) {

    const rect = svg.getBoundingClientRect();

    return {

        x: Math.max(
            0,
            Math.min(
                100,
                (event.clientX - rect.left) /
                rect.width * 100
            )
        ),

        y: Math.max(
            0,
            Math.min(
                100,
                (event.clientY - rect.top) /
                rect.height * 100
            )
        )

    };

}


/* =========================================
   رسم خط
========================================= */

function attachDrawing(svg, stage) {

    const drawLayer = svg.querySelector(".line-draw");

    const answer = getAnswer(currentStage);

    let drawing = false;

    let currentPoints = [];

    let pointerId = null;


    function startDrawing(event) {

        if (completedStages.has(currentStage)) {
            return;
        }

        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        event.preventDefault();

        drawing = true;

        pointerId = event.pointerId;

        currentPoints = [
            getPointerPosition(event, svg)
        ];

        try {

            drawLayer.setPointerCapture(
                event.pointerId
            );

        } catch (error) {
            // سازگاری با مرورگرهای مختلف
        }

    }


    function moveDrawing(event) {

        if (!drawing) {
            return;
        }

        if (event.pointerId !== pointerId) {
            return;
        }

        event.preventDefault();

        const point = getPointerPosition(
            event,
            svg
        );

        const previous =
            currentPoints[currentPoints.length - 1];

        const distance = Math.hypot(
            point.x - previous.x,
            point.y - previous.y
        );

        if (distance < 0.45) {
            return;
        }

        currentPoints.push(point);

        drawLayer.setAttribute(
            "d",
            pointsToPath(currentPoints)
        );

        drawLayer.setAttribute(
            "stroke",
            eraserActive
                ? "#ffffff"
                : COLORS[selectedColor]
        );

        drawLayer.setAttribute(
            "stroke-width",
            eraserActive ? "14" : "3.2"
        );

        drawLayer.style.strokeLinecap = "round";

        drawLayer.style.strokeLinejoin = "round";

        drawLayer.style.fill = "none";

    }


    function stopDrawing(event) {

        if (!drawing) {
            return;
        }

        drawing = false;

        pointerId = null;

        if (currentPoints.length > 1) {

            if (eraserActive) {

                eraseNearStroke(
                    answer,
                    currentPoints
                );

            } else {

                answer.strokes.push({

                    points: currentPoints.map(point => ({
                        x: point.x,
                        y: point.y
                    })),

                    color: COLORS[selectedColor]

                });

            }

        }

        drawLayer.setAttribute("d", "");

        renderLineStage(stage);

        clearFeedback();

    }


    drawLayer.addEventListener(
        "pointerdown",
        startDrawing
    );

    drawLayer.addEventListener(
        "pointermove",
        moveDrawing
    );

    drawLayer.addEventListener(
        "pointerup",
        stopDrawing
    );

    drawLayer.addEventListener(
        "pointercancel",
        stopDrawing
    );

}


/* =========================================
   فاصله دو نقطه
========================================= */

function distanceBetween(a, b) {

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}


/* =========================================
   فاصله نقطه تا پاره‌خط
========================================= */

function pointToSegmentDistance(point, start, end) {

    const dx = end.x - start.x;

    const dy = end.y - start.y;

    const lengthSquared =
        dx * dx + dy * dy;

    if (lengthSquared === 0) {

        return distanceBetween(
            point,
            start
        );

    }

    let t = (

        (point.x - start.x) * dx +
        (point.y - start.y) * dy

    ) / lengthSquared;

    t = Math.max(
        0,
        Math.min(1, t)
    );

    const projection = {

        x: start.x + t * dx,

        y: start.y + t * dy

    };

    return distanceBetween(
        point,
        projection
    );

}


/* =========================================
   فاصله نقطه تا مسیر
========================================= */

function distanceToPath(point, path) {

    if (path.length === 1) {

        return distanceBetween(
            point,
            path[0]
        );

    }

    let minDistance = Infinity;

    for (
        let i = 0;
        i < path.length - 1;
        i++
    ) {

        const distance = pointToSegmentDistance(
            point,
            path[i],
            path[i + 1]
        );

        minDistance = Math.min(
            minDistance,
            distance
        );

    }

    return minDistance;

}


/* =========================================
   پاک کردن خط
========================================= */

function eraseNearStroke(answer, eraserPoints) {

    const eraseRadius = 9;

    answer.strokes = answer.strokes.filter(stroke => {

        let shouldRemove = false;

        for (const erasePoint of eraserPoints) {

            const distance = distanceToPath(
                erasePoint,
                stroke.points
            );

            if (distance < eraseRadius) {

                shouldRemove = true;

                break;

            }

        }

        return !shouldRemove;

    });

}


/* =========================================
   نمونه‌برداری از مسیر
========================================= */

function samplePath(path, count = 100) {

    const samples = [];

    for (let i = 0; i <= count; i++) {

        const t = i / count;

        const scaled =
            t * (path.length - 1);

        const index = Math.min(
            Math.floor(scaled),
            path.length - 2
        );

        const localT = scaled - index;

        const a = path[index];

        const b = path[index + 1];

        samples.push({

            x: a.x + (b.x - a.x) * localT,

            y: a.y + (b.y - a.y) * localT

        });

    }

    return samples;

}


/* =========================================
   بررسی رسم خط
========================================= */

function strokeCoversPath(
    strokes,
    targetPath,
    tolerance = 10
) {

    if (!strokes.length) {
        return false;
    }

    const samples = samplePath(
        targetPath,
        100
    );

    let covered = 0;

    samples.forEach(sample => {

        let nearest = Infinity;

        strokes.forEach(stroke => {

            const distance = distanceToPath(
                sample,
                stroke.points
            );

            nearest = Math.min(
                nearest,
                distance
            );

        });

        if (nearest <= tolerance) {
            covered++;
        }

    });

    return covered / samples.length >= 0.82;

}


/* =========================================
   بررسی مرحله خطی
========================================= */

function checkLineStage(stage) {

    const answer = getAnswer(currentStage);

    const expected = getLinePoints(stage);

    /*
       فقط مسیر جدول پایین بررسی می‌شود.
       جدول بالا صرفاً راهنماست.
    */

    return strokeCoversPath(
        answer.strokes,
        expected,
        11
    );

}


/* =========================================
   بررسی جدول رنگی
========================================= */

function checkCellStage(stage) {

    const answer = getAnswer(currentStage);

    for (
        let row = 0;
        row < stage.rows;
        row++
    ) {

        for (
            let col = 0;
            col < stage.copyCols;
            col++
        ) {

            const expected = expectedCell(
                stage,
                row,
                col
            );

            const actual =
                answer.cells[row + "_" + col] || null;

            if (expected !== actual) {
                return false;
            }

        }

    }

    return true;

}


/* =========================================
   بررسی پاسخ
========================================= */

function checkAnswers() {

    if (completedStages.has(currentStage)) {
        return;
    }

    const stage = getStage();

    let correct = false;

    if (stage.kind === "line") {

        correct = checkLineStage(stage);

    } else {

        correct = checkCellStage(stage);

    }

    if (!correct) {

        showFeedback(
            "یک بار دیگر با دقت الگو را کامل کن.",
            "wrong"
        );

        return;

    }

    completedStages.add(currentStage);

    clearFeedback();

    showFireworks();

    if (currentStage === STAGES.length - 1) {

        finishTimer = setTimeout(() => {

            showFinish();

        }, 2600);

    }

}

checkButton.addEventListener(
    "click",
    checkAnswers
);


/* =========================================
   جابه‌جایی بین مراحل
========================================= */

prevButton.addEventListener("click", () => {

    if (currentStage > 0) {

        stopFireworks();

        currentStage--;

        renderStage();

    }

});


nextButton.addEventListener("click", () => {

    if (currentStage < STAGES.length - 1) {

        stopFireworks();

        currentStage++;

        renderStage();

    }

});


/* =========================================
   شروع بازی
========================================= */

function startGame() {

    student = studentName.value.trim();

    if (!student) {

        studentName.focus();

        studentName.placeholder =
            "لطفاً نامت را بنویس";

        return;

    }

    currentStage = 0;

    welcome.classList.add("hidden");

    finish.classList.add("hidden");

    game.classList.remove("hidden");

    renderStage();

}

startButton.addEventListener(
    "click",
    startGame
);

studentName.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        startGame();

    }

});


/* =========================================
   خروج
========================================= */

function exitGame() {

    const accepted = confirm(
        "آیا می‌خواهی از بازی خارج شوی؟"
    );

    if (!accepted) {
        return;
    }

    if (finishTimer) {

        clearTimeout(finishTimer);

        finishTimer = null;

    }

    stopFireworks();

    game.classList.add("hidden");

    finish.classList.add("hidden");

    welcome.classList.remove("hidden");

}

exitButton.addEventListener(
    "click",
    exitGame
);


/* =========================================
   پایان بازی
========================================= */

function showFinish() {

    game.classList.add("hidden");

    finish.classList.remove("hidden");

    $("finishMessage").textContent =
        "آفرین " +
        student +
        "! همه الگوها را با موفقیت کامل کردی.";

}


function restartGame() {

    currentStage = 0;

    Object.keys(answers).forEach(key => {

        delete answers[key];

    });

    completedStages.clear();

    if (finishTimer) {

        clearTimeout(finishTimer);

        finishTimer = null;

    }

    stopFireworks();

    finish.classList.add("hidden");

    welcome.classList.remove("hidden");

    studentName.value = "";

}

restartButton.addEventListener(
    "click",
    restartGame
);


/* =========================================
   فشفشه‌های رنگی
========================================= */

const fireworkColors = [
    "#e53935",
    "#159ed0",
    "#55ad48",
    "#f4c62f",
    "#e9782c",
    "#9565cf"
];


function resizeFireworksCanvas() {

    const ratio = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    fireworksCanvas.width =
        window.innerWidth * ratio;

    fireworksCanvas.height =
        window.innerHeight * ratio;

    fireworksCanvas.style.width =
        window.innerWidth + "px";

    fireworksCanvas.style.height =
        window.innerHeight + "px";

    const context =
        fireworksCanvas.getContext("2d");

    context.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

}


function createExplosion(x, y) {

    for (let i = 0; i < 45; i++) {

        const angle =
            Math.random() * Math.PI * 2;

        const speed =
            1.5 + Math.random() * 4;

        particles.push({

            x,
            y,

            vx: Math.cos(angle) * speed,

            vy: Math.sin(angle) * speed,

            life: 70 + Math.random() * 35,

            size: 2 + Math.random() * 3,

            color:
                fireworkColors[
                    Math.floor(
                        Math.random() *
                        fireworkColors.length
                    )
                ]

        });

    }

}


/* =========================================
   نمایش فشفشه
========================================= */

function showFireworks() {

    stopFireworks();

    resizeFireworksCanvas();

    fireworksCanvas.style.display = "block";

    particles = [];

    createExplosion(
        window.innerWidth * 0.25,
        window.innerHeight * 0.35
    );

    createExplosion(
        window.innerWidth * 0.5,
        window.innerHeight * 0.3
    );

    createExplosion(
        window.innerWidth * 0.75,
        window.innerHeight * 0.35
    );

    let extraExplosions = 0;

    function animate() {

        const context =
            fireworksCanvas.getContext("2d");

        context.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

        particles.forEach(particle => {

            particle.x += particle.vx;

            particle.y += particle.vy;

            particle.vy += 0.035;

            particle.vx *= 0.99;

            particle.vy *= 0.99;

            particle.life--;

            context.globalAlpha = Math.max(
                0,
                particle.life / 90
            );

            context.fillStyle = particle.color;

            context.beginPath();

            context.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            context.fill();

        });

        context.globalAlpha = 1;

        particles = particles.filter(
            particle => particle.life > 0
        );

        if (extraExplosions < 5) {

            if (Math.random() < 0.08) {

                createExplosion(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight * 0.55
                );

                extraExplosions++;

            }

        }

        if (particles.length > 0) {

            animationFrame =
                requestAnimationFrame(animate);

        } else {

            stopFireworks();

        }

    }

    animate();

}


/* =========================================
   توقف فشفشه
========================================= */

function stopFireworks() {

    if (animationFrame) {

        cancelAnimationFrame(animationFrame);

        animationFrame = null;

    }

    fireworksCanvas.style.display = "none";

    const context =
        fireworksCanvas.getContext("2d");

    context.clearRect(
        0,
        0,
        fireworksCanvas.width,
        fireworksCanvas.height
    );

    particles = [];

}


/* =========================================
   تغییر اندازه نمایشگر
========================================= */

window.addEventListener("resize", () => {

    if (fireworksCanvas.style.display === "block") {

        resizeFireworksCanvas();

    }

});


/* =========================================
   آماده‌سازی اولیه
========================================= */

renderPalette();
