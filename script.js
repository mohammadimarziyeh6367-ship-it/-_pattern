"use strict";

/* =========================================
   تنظیمات و عناصر اصلی
========================================= */

const $ = (id) => document.getElementById(id);

const welcome = $("welcome");
const game = $("game");
const finish = $("finish");

const studentNameInput = $("studentName");
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

const finishMessage = $("finishMessage");
const restartButton = $("restartButton");

const fireworksCanvas = $("fireworksCanvas");
const fireworksContext = fireworksCanvas.getContext("2d");


/* =========================================
   رنگ‌ها
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

const PALETTE_COLORS = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "black"
];


/* =========================================
   تعریف هشت مرحله
========================================= */

const stages = [

    /* مرحله ۱: خط پله‌ای قرمز */

    {
        type: "line",
        title: "الگوی قرمز را ادامه بده",
        description: "با مداد قرمز، خط پله‌ای را ادامه بده.",
        color: "red",
        cols: 14,
        rows: 4,
        fixedColumns: 6,
        copyCols: 8,
        points: [2, 3, 2, 3, 2, 3, 2, 3, 2]
    },


    /* مرحله ۲: خط پله‌ای سبز */

    {
        type: "line",
        title: "الگوی سبز را ادامه بده",
        description: "به مسیر نگاه کن و آن را با مداد سبز ادامه بده.",
        color: "green",
        cols: 14,
        rows: 4,
        fixedColumns: 6,
        copyCols: 8,
        points: [3, 2, 2, 3, 3, 2, 2, 3, 3]
    },


    /* مرحله ۳: خط پله‌ای مشکی */

    {
        type: "line",
        title: "الگوی مشکی را ادامه بده",
        description: "مسیر را با مداد مشکی ادامه بده.",
        color: "black",
        cols: 14,
        rows: 4,
        fixedColumns: 6,
        copyCols: 8,
        points: [2, 3, 3, 3, 2, 2, 2, 3, 3]
    },


    /* مرحله ۴: خط پله‌ای زرد */

    {
        type: "line",
        title: "الگوی زرد را ادامه بده",
        description: "خط پله‌ای را با مداد زرد کامل کن.",
        color: "yellow",
        cols: 14,
        rows: 4,
        fixedColumns: 6,
        copyCols: 8,
        points: [3, 2, 2, 3, 3, 2, 2, 3, 3]
    },


    /* مرحله ۵: گل */

    {
        type: "cells",
        title: "گل را کامل کن",
        description: "به گل نگاه کن و الگوی آن را در جدول پایین تکرار کن.",
        cols: 12,
        rows: 3,
        fixedColumns: 6,
        copyCols: 3,
        motifWidth: 3,

        motif: [
            [0, 0, "green"],
            [0, 2, "green"],

            [1, 0, "green"],
            [1, 1, "red"],
            [1, 2, "green"],

            [2, 1, "green"]
        ]
    },


    /* مرحله ۶: الگوی سبز پله‌ای */

    {
        type: "cells",
        title: "الگوی سبز را ادامه بده",
        description: "خانه‌های سبز را مانند الگوی اصلی رنگ کن.",
        cols: 16,
        rows: 3,
        fixedColumns: 12,
        copyCols: 4,
        motifWidth: 4,

        motif: [
            [0, 0, "green"],
            [0, 2, "green"],

            [1, 1, "green"],
            [1, 3, "green"],

            [2, 0, "green"],
            [2, 2, "green"]
        ]
    },


    /* مرحله ۷: آبی و قرمز */

    {
        type: "cells",
        title: "الگوی آبی و قرمز را ادامه بده",
        description: "به ترتیب رنگ‌ها دقت کن و الگو را تکرار کن.",
        cols: 12,
        rows: 2,
        fixedColumns: 8,
        copyCols: 4,
        motifWidth: 4,

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


    /* مرحله ۸: چهار رنگ */

    {
        type: "cells",
        title: "الگوی چهاررنگ را ادامه بده",
        description: "ترتیب رنگ‌های آبی، قرمز، سبز و زرد را رعایت کن.",
        cols: 16,
        rows: 1,
        fixedColumns: 8,
        copyCols: 4,
        motifWidth: 4,

        motif: [
            [0, 0, "blue"],
            [0, 1, "red"],
            [0, 2, "green"],
            [0, 3, "yellow"]
        ]
    }

];


/* =========================================
   وضعیت بازی
========================================= */

let currentStage = 0;
let studentName = "";
let selectedColor = "red";
let eraserMode = false;

let answers = [];

let fireworksAnimation = null;
let fireworksParticles = [];

let drawing = null;


/* =========================================
   ساخت وضعیت اولیه هر مرحله
========================================= */

function createStageAnswer(stage) {

    if (stage.type === "line") {

        return {
            mainPath: "",
            copyPath: "",
            mainColor: null,
            copyColor: null
        };

    }

    return {
        main: {},
        copy: {}
    };
}


function initializeAnswers() {

    answers = stages.map(stage => createStageAnswer(stage));

}


/* =========================================
   شروع بازی
========================================= */

startButton.addEventListener("click", startGame);

studentNameInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        startGame();
    }

});


function startGame() {

    studentName = studentNameInput.value.trim();

    if (!studentName) {
        studentNameInput.focus();
        studentNameInput.placeholder = "لطفاً نامت را بنویس";
        return;
    }

    initializeAnswers();

    currentStage = 0;

    welcome.classList.add("hidden");
    finish.classList.add("hidden");
    game.classList.remove("hidden");

    renderStage();

}


function restartGame() {

    stopFireworks();

    studentNameInput.value = "";

    game.classList.add("hidden");
    finish.classList.add("hidden");
    welcome.classList.remove("hidden");

    initializeAnswers();

    currentStage = 0;

}


/* =========================================
   نمایش مرحله
========================================= */

function renderStage() {

    const stage = stages[currentStage];

    selectedColor = "red";
    eraserMode = false;

    drawing = null;

    stageCounter.textContent =
        toPersianNumber(currentStage + 1) +
        " از " +
        toPersianNumber(stages.length);

    progressBar.style.width =
        ((currentStage + 1) / stages.length * 100) + "%";

    questionTitle.textContent =
        "نام دانش‌آموز: " + studentName + "، الگو را ادامه بده";

    questionText.textContent = stage.description;

    boardLabel.textContent =
        stage.type === "line"
            ? "خط اصلی را ادامه بده"
            : "الگوی اصلی";

    copyLabel.textContent =
        "یک بار الگوی اصلی را در جدول خالی تکرار کن";

    feedback.textContent = "";
    feedback.className = "feedback";

    prevButton.disabled = currentStage === 0;

    nextButton.disabled = currentStage === stages.length - 1;

    renderPalette();

    if (stage.type === "line") {
        renderLineBoards(stage);
    } else {
        renderCellBoards(stage);
    }

}


function toPersianNumber(number) {

    return String(number).replace(/[0-9]/g, digit =>
        "۰۱۲۳۴۵۶۷۸۹"[digit]
    );

}


/* =========================================
   ساخت پالت رنگ
========================================= */

function renderPalette() {

    palette.innerHTML = "";

    PALETTE_COLORS.forEach(color => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "pencil-choice";

        button.dataset.color = color;

        button.style.setProperty(
            "--pencil",
            COLORS[color]
        );

        button.setAttribute(
            "aria-label",
            "مداد " + COLOR_NAMES[color]
        );

        button.innerHTML = '<span class="pencil"><i></i></span>';

        button.addEventListener("click", function () {

            selectedColor = color;
            eraserMode = false;

            eraserButton.classList.remove("active");

            updatePaletteSelection();

        });

        palette.appendChild(button);

    });

    updatePaletteSelection();

}


function updatePaletteSelection() {

    document.querySelectorAll(".pencil-choice").forEach(button => {

        button.classList.toggle(
            "selected",
            !eraserMode && button.dataset.color === selectedColor
        );

    });

}


/* =========================================
   ابزار پاک‌کن
========================================= */

eraserButton.addEventListener("click", function () {

    eraserMode = !eraserMode;

    eraserButton.classList.toggle("active", eraserMode);

    updatePaletteSelection();

});


/* =========================================
   الگوهای خانه‌ای
========================================= */

function getMotifMap(stage) {

    const map = {};

    stage.motif.forEach(item => {

        const row = item[0];
        const col = item[1];
        const color = item[2];

        map[row + "-" + col] = color;

    });

    return map;

}


function getExpectedColor(stage, row, col) {

    const motifCol = col % stage.motifWidth;

    const map = getMotifMap(stage);

    return map[row + "-" + motifCol] || null;

}


/* =========================================
   ساخت جدول‌های خانه‌ای
========================================= */

function renderCellBoards(stage) {

    mainBoard.innerHTML = "";
    copyBoard.innerHTML = "";

    createCellBoard(
        mainBoard,
        stage,
        "main"
    );

    createCellBoard(
        copyBoard,
        stage,
        "copy"
    );

}


function createCellBoard(board, stage, boardType) {

    const cols =
        boardType === "main"
            ? stage.cols
            : stage.copyCols;

    const rows = stage.rows;

    board.style.setProperty("--cols", cols);
    board.style.setProperty("--rows", rows);

    board.className =
        boardType === "main"
            ? "board"
            : "board small-board";

    board.style.direction = "ltr";

    const answer = answers[currentStage];

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            const cell = document.createElement("button");

            cell.type = "button";
            cell.className = "grid-cell";

            cell.dataset.row = row;
            cell.dataset.col = col;

            const expected = getExpectedColor(stage, row, col);

            const locked =
                boardType === "main" &&
                col < stage.fixedColumns;

            if (locked) {

                cell.classList.add("locked");

                if (expected) {
                    paintCell(cell, expected);
                }

            } else {

                cell.classList.add("answer-cell");

                const key = row + "-" + col;

                const saved =
                    answer[boardType][key] || null;

                if (saved) {
                    paintCell(cell, saved);
                }

                cell.addEventListener("click", function () {

                    handleCellClick(
                        cell,
                        boardType,
                        row,
                        col
                    );

                });

            }

            board.appendChild(cell);

        }

    }

}


/* =========================================
   رنگ کردن خانه
========================================= */

function paintCell(cell, color) {

    cell.innerHTML = "";

    if (!color) {
        return;
    }

    const fill = document.createElement("span");

    fill.className = "paint-fill";

    fill.style.setProperty(
        "--fill",
        COLORS[color]
    );

    cell.appendChild(fill);

}


function handleCellClick(cell, boardType, row, col) {

    const key = row + "-" + col;

    const answer = answers[currentStage];

    if (eraserMode) {

        delete answer[boardType][key];

        paintCell(cell, null);

    } else {

        answer[boardType][key] = selectedColor;

        paintCell(cell, selectedColor);

    }

    feedback.textContent = "";
    feedback.className = "feedback";

}


/* =========================================
   مراحل رسم خط
========================================= */

function renderLineBoards(stage) {

    mainBoard.innerHTML = "";
    copyBoard.innerHTML = "";

    createLineBoard(
        mainBoard,
        stage,
        "main"
    );

    createLineBoard(
        copyBoard,
        stage,
        "copy"
    );

}


function createLineBoard(board, stage, boardType) {

    const cols =
        boardType === "main"
            ? stage.cols
            : stage.copyCols;

    board.style.setProperty("--cols", cols);
    board.style.setProperty("--rows", stage.rows);

    board.className =
        boardType === "main"
            ? "board line-board"
            : "board small-board line-board";

    board.style.direction = "ltr";

    for (let row = 0; row < stage.rows; row++) {

        for (let col = 0; col < cols; col++) {

            const cell = document.createElement("div");

            cell.className = "grid-cell";

            board.appendChild(cell);

        }

    }

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");

    svg.classList.add("line-svg");

    svg.setAttribute("viewBox", "0 0 1000 1000");

    svg.setAttribute("preserveAspectRatio", "none");

    const guide = document.createElementNS(svgNS, "polyline");

    guide.classList.add("line-guide");

    guide.setAttribute("fill", "none");

    guide.setAttribute("stroke", COLORS[stage.color]);

    guide.setAttribute("stroke-width", "13");

    guide.setAttribute("stroke-linecap", "round");

    guide.setAttribute("stroke-linejoin", "round");

    const guidePoints =
        boardType === "main"
            ? getMainGuidePoints(stage)
            : [];

    if (guidePoints.length > 0) {

        guide.setAttribute(
            "points",
            guidePoints.map(point =>
                point.x + "," + point.y
            ).join(" ")
        );

    }

    svg.appendChild(guide);

    const drawPath = document.createElementNS(svgNS, "path");

    drawPath.classList.add("line-draw");

    drawPath.setAttribute("fill", "none");

    drawPath.setAttribute("stroke", COLORS[stage.color]);

    drawPath.setAttribute("stroke-width", "13");

    drawPath.setAttribute("stroke-linecap", "round");

    drawPath.setAttribute("stroke-linejoin", "round");

    const answer = answers[currentStage];

    const savedPath =
        boardType === "main"
            ? answer.mainPath
            : answer.copyPath;

    if (savedPath) {
        drawPath.setAttribute("d", savedPath);
    }

    svg.appendChild(drawPath);

    board.appendChild(svg);

    setupLineDrawing(
        svg,
        drawPath,
        boardType,
        stage
    );

}


/* =========================================
   مختصات الگوی خط
========================================= */

function getPointY(stage, index) {

    const row =
        stage.points[index % stage.points.length];

    return ((row + 0.5) / stage.rows) * 1000;

}


function getPointX(index, total) {

    return ((index + 0.5) / total) * 1000;

}


function getMainGuidePoints(stage) {

    const points = [];

    for (let i = 0; i < stage.fixedColumns; i++) {

        points.push({
            x: getPointX(i, stage.cols),
            y: getPointY(stage, i)
        });

    }

    return points;

}


function getMainExpectedPoints(stage) {

    const points = [];

    for (let i = 0; i < stage.cols; i++) {

        points.push({
            x: getPointX(i, stage.cols),
            y: getPointY(stage, i)
        });

    }

    return points;

}


function getCopyExpectedPoints(stage) {

    const points = [];

    for (let i = 0; i < stage.copyCols; i++) {

        points.push({
            x: getPointX(i, stage.copyCols),
            y: getPointY(stage, i)
        });

    }

    return points;

}


/* =========================================
   رسم خط با انگشت یا ماوس
========================================= */

function setupLineDrawing(svg, pathElement, boardType, stage) {

    let activePointer = null;
    let points = [];

    function getCoordinates(event) {

        const rect = svg.getBoundingClientRect();

        return {
            x: Math.max(
                0,
                Math.min(
                    1000,
                    ((event.clientX - rect.left) / rect.width) * 1000
                )
            ),

            y: Math.max(
                0,
                Math.min(
                    1000,
                    ((event.clientY - rect.top) / rect.height) * 1000
                )
            )
        };

    }


    function savePath() {

        const path = points.map((point, index) => {

            return (
                (index === 0 ? "M" : "L") +
                point.x.toFixed(1) +
                " " +
                point.y.toFixed(1)
            );

        }).join(" ");

        pathElement.setAttribute("d", path);

        if (boardType === "main") {

            answers[currentStage].mainPath = path;
            answers[currentStage].mainColor =
                eraserMode ? null : selectedColor;

        } else {

            answers[currentStage].copyPath = path;
            answers[currentStage].copyColor =
                eraserMode ? null : selectedColor;

        }

    }


    svg.addEventListener("pointerdown", function (event) {

        event.preventDefault();

        if (activePointer !== null) {
            return;
        }

        activePointer = event.pointerId;

        svg.setPointerCapture(event.pointerId);

        if (eraserMode) {

            points = [];

            pathElement.setAttribute("d", "");

            if (boardType === "main") {

                answers[currentStage].mainPath = "";
                answers[currentStage].mainColor = null;

            } else {

                answers[currentStage].copyPath = "";
                answers[currentStage].copyColor = null;

            }

            return;

        }

        points = [];

        points.push(getCoordinates(event));

        savePath();

    });


    svg.addEventListener("pointermove", function (event) {

        if (activePointer !== event.pointerId) {
            return;
        }

        event.preventDefault();

        if (eraserMode) {
            return;
        }

        const point = getCoordinates(event);

        const previous = points[points.length - 1];

        if (!previous) {
            return;
        }

        const distance = Math.hypot(
            point.x - previous.x,
            point.y - previous.y
        );

        if (distance < 5) {
            return;
        }

        points.push(point);

        savePath();

    });


    function finishDrawing(event) {

        if (activePointer !== event.pointerId) {
            return;
        }

        if (!eraserMode) {
            savePath();
        }

        activePointer = null;

        points = [];

        feedback.textContent = "";
        feedback.className = "feedback";

    }


    svg.addEventListener("pointerup", finishDrawing);

    svg.addEventListener("pointercancel", finishDrawing);

    svg.addEventListener("lostpointercapture", function () {

        activePointer = null;

    });

}


/* =========================================
   بررسی مسیر رسم‌شده
========================================= */

function parsePath(path) {

    if (!path) {
        return [];
    }

    const numbers = path.match(/-?\d+(?:\.\d+)?/g);

    if (!numbers || numbers.length < 4) {
        return [];
    }

    const points = [];

    for (let i = 0; i < numbers.length - 1; i += 2) {

        points.push({
            x: Number(numbers[i]),
            y: Number(numbers[i + 1])
        });

    }

    return points;

}


function distanceBetween(a, b) {

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}


function distanceToSegment(point, start, end) {

    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {
        return distanceBetween(point, start);
    }

    let t = (
        (point.x - start.x) * dx +
        (point.y - start.y) * dy
    ) / lengthSquared;

    t = Math.max(0, Math.min(1, t));

    const projection = {
        x: start.x + t * dx,
        y: start.y + t * dy
    };

    return distanceBetween(point, projection);

}


function distanceToPolyline(point, line) {

    let minimum = Infinity;

    for (let i = 0; i < line.length - 1; i++) {

        const distance = distanceToSegment(
            point,
            line[i],
            line[i + 1]
        );

        minimum = Math.min(minimum, distance);

    }

    return minimum;

}


function segmentsFollowPattern(drawnPath, expectedPoints, isMain) {

    const drawn = parsePath(drawnPath);

    if (drawn.length < 2 || expectedPoints.length < 2) {
        return false;
    }

    let expected = expectedPoints;

    if (isMain) {

        const stage = stages[currentStage];

        expected = expectedPoints.slice(
            stage.fixedColumns - 1
        );

    }

    if (expected.length < 2) {
        return false;
    }

    const startDistance = distanceBetween(
        drawn[0],
        expected[0]
    );

    const endDistance = distanceBetween(
        drawn[drawn.length - 1],
        expected[expected.length - 1]
    );

    /*
       تلورانس برای تفاوت طبیعی حرکت انگشت
       و کمی کج کشیدن خط در نظر گرفته شده است.
    */

    const tolerance = 115;

    if (startDistance > tolerance * 1.7) {
        return false;
    }

    if (endDistance > tolerance * 1.7) {
        return false;
    }

    let covered = 0;

    const samples = 90;

    for (let i = 0; i <= samples; i++) {

        const targetIndex =
            Math.round(
                (i / samples) * (expected.length - 1)
            );

        const target = expected[targetIndex];

        const distance = distanceToPolyline(
            target,
            drawn
        );

        if (distance <= tolerance) {
            covered++;
        }

    }

    const coverage = covered / (samples + 1);

    let totalDistance = 0;

    for (const point of drawn) {

        totalDistance += distanceToPolyline(
            point,
            expected
        );

    }

    const averageDistance =
        totalDistance / drawn.length;

    return coverage >= 0.82 &&
           averageDistance <= 105;

}


/* =========================================
   بررسی پاسخ جدول‌های خانه‌ای
========================================= */

function checkCellStage(stage) {

    const answer = answers[currentStage];

    const mainCorrect =
        checkCellBoard(
            stage,
            answer.main,
            stage.cols,
            stage.fixedColumns,
            true
        );

    const copyCorrect =
        checkCellBoard(
            stage,
            answer.copy,
            stage.copyCols,
            0,
            false
        );

    return mainCorrect && copyCorrect;

}


function checkCellBoard(
    stage,
    userAnswer,
    cols,
    fixedColumns,
    isMain
) {

    for (let row = 0; row < stage.rows; row++) {

        for (let col = 0; col < cols; col++) {

            const key = row + "-" + col;

            const expected = getExpectedColor(
                stage,
                row,
                col
            );

            const locked =
                isMain && col < fixedColumns;

            if (locked) {
                continue;
            }

            const actual = userAnswer[key] || null;

            if (actual !== expected) {
                return false;
            }

        }

    }

    return true;

}


/* =========================================
   بررسی مراحل خطی
========================================= */

function checkLineStage(stage) {

    const answer = answers[currentStage];

    const expectedMain = getMainExpectedPoints(stage);

    const expectedCopy = getCopyExpectedPoints(stage);

    const mainCorrect =
        answer.mainColor === stage.color &&
        segmentsFollowPattern(
            answer.mainPath,
            expectedMain,
            true
        );

    const copyCorrect =
        answer.copyColor === stage.color &&
        segmentsFollowPattern(
            answer.copyPath,
            expectedCopy,
            false
        );

    return mainCorrect && copyCorrect;

}


/* =========================================
   بررسی کلی پاسخ
========================================= */

checkButton.addEventListener("click", checkAnswers);


function checkAnswers() {

    const stage = stages[currentStage];

    let correct = false;

    if (stage.type === "line") {

        correct = checkLineStage(stage);

    } else {

        correct = checkCellStage(stage);

    }

    if (correct) {

        feedback.textContent = "";
        feedback.className = "feedback";

        launchFireworks();

        checkButton.disabled = true;

        setTimeout(() => {

            stopFireworks();

            checkButton.disabled = false;

            if (currentStage === stages.length - 1) {

                showFinish();

            } else {

                feedback.textContent = "";
                feedback.className = "feedback";

            }

        }, 1800);

    } else {

        feedback.textContent =
            "دوباره نگاه کن و الگو را با دقت کامل کن.";

        feedback.className = "feedback wrong";

    }

}


/* =========================================
   جابه‌جایی بین مراحل
========================================= */

prevButton.addEventListener("click", function () {

    if (currentStage <= 0) {
        return;
    }

    currentStage--;

    renderStage();

});


nextButton.addEventListener("click", function () {

    if (currentStage >= stages.length - 1) {
        return;
    }

    currentStage++;

    renderStage();

});


/* =========================================
   خروج از بازی
========================================= */

exitButton.addEventListener("click", exitGame);


function exitGame() {

    const confirmed = window.confirm(
        "آیا می‌خواهی از بازی خارج شوی؟"
    );

    if (!confirmed) {
        return;
    }

    stopFireworks();

    game.classList.add("hidden");
    finish.classList.add("hidden");
    welcome.classList.remove("hidden");

    studentNameInput.value = "";

    currentStage = 0;

}


/* =========================================
   پایان بازی
========================================= */

restartButton.addEventListener("click", restartGame);


function showFinish() {

    game.classList.add("hidden");

    finish.classList.remove("hidden");

    finishMessage.textContent =
        "آفرین " + studentName +
        " عزیز! همه الگوها را با موفقیت کامل کردی.";

    launchFireworks();

    setTimeout(stopFireworks, 2600);

}


/* =========================================
   فشفشه‌های رنگی
========================================= */

function resizeFireworksCanvas() {

    const ratio = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    fireworksCanvas.width =
        window.innerWidth * ratio;

    fireworksCanvas.height =
        window.innerHeight * ratio;

    fireworksContext.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

}


window.addEventListener(
    "resize",
    resizeFireworksCanvas
);


function createFirework(x, y) {

    const colors = [
        "#ef5350",
        "#42a5f5",
        "#43b96b",
        "#ffd54f",
        "#9565cf",
        "#ff963d"
    ];

    const color =
        colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 45; i++) {

        const angle =
            Math.random() * Math.PI * 2;

        const speed =
            1.5 + Math.random() * 5;

        fireworksParticles.push({

            x,
            y,

            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,

            life: 55 + Math.random() * 25,

            size: 2 + Math.random() * 3,

            color

        });

    }

}


function launchFireworks() {

    stopFireworks();

    resizeFireworksCanvas();

    fireworksCanvas.style.display = "block";

    fireworksParticles = [];

    let frame = 0;

    function animate() {

        const width = window.innerWidth;
        const height = window.innerHeight;

        fireworksContext.clearRect(
            0,
            0,
            width,
            height
        );

        if (frame % 18 === 0) {

            createFirework(
                Math.random() * width,
                Math.random() * height * 0.65
            );

        }

        fireworksParticles.forEach(particle => {

            particle.x += particle.vx;
            particle.y += particle.vy;

            particle.vy += 0.035;

            particle.life--;

            fireworksContext.globalAlpha =
                Math.max(0, particle.life / 75);

            fireworksContext.fillStyle =
                particle.color;

            fireworksContext.beginPath();

            fireworksContext.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            fireworksContext.fill();

        });

        fireworksParticles =
            fireworksParticles.filter(
                particle => particle.life > 0
            );

        fireworksContext.globalAlpha = 1;

        frame++;

        fireworksAnimation =
            requestAnimationFrame(animate);

    }

    animate();

}


function stopFireworks() {

    if (fireworksAnimation !== null) {

        cancelAnimationFrame(fireworksAnimation);

        fireworksAnimation = null;

    }

    fireworksContext.clearRect(
        0,
        0,
        fireworksCanvas.width,
        fireworksCanvas.height
    );

    fireworksCanvas.style.display = "none";

    fireworksParticles = [];

}


/* =========================================
   آماده‌سازی اولیه
========================================= */

initializeAnswers();

resizeFireworksCanvas();
