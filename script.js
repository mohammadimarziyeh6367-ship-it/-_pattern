"use strict";

/* =========================================
   تنظیمات اصلی
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
   تعریف هشت مرحله
========================================= */

const STAGES = [

    {
        title: "الگوی خطی قرمز",
        question: "با دقت به الگوی قرمز نگاه کن و خط را ادامه بده.",
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
        question: "الگوی سبز را با همان ترتیب ادامه بده.",
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
        question: "مسیر خط را با دقت دنبال کن و ادامه بده.",
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
        question: "الگوی زرد را تا انتها ادامه بده.",
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
        question: "خانه‌های خالی را با توجه به الگوی گل کامل کن.",
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
        question: "الگوی سبز را در خانه‌های خالی ادامه بده.",
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
        question: "ترتیب رنگ‌های آبی و قرمز را ادامه بده.",
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
        question: "الگوی چهاررنگ را با دقت کامل کن.",
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

let activeStroke = null;
let activeBoard = null;

let fireworksAnimation = null;


/* =========================================
   ابزارهای عمومی
========================================= */

function getStage() {
    return STAGES[currentStage];
}

function answerKey(stageIndex, boardName) {
    return stageIndex + "_" + boardName;
}

function getAnswer(stageIndex, boardName) {
    const key = answerKey(stageIndex, boardName);

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
   انتخاب مدادها
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

        if (selectedColor === color && !eraserActive) {
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


function selectEraser() {

    eraserActive = !eraserActive;

    eraserButton.classList.toggle(
        "active",
        eraserActive
    );

    renderPalette();

}

eraserButton.addEventListener("click", selectEraser);


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
        "مرحله " + (currentStage + 1) +
        " از " + STAGES.length;

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

function makeBoard(element, cols, rows, className = "") {

    element.innerHTML = "";

    element.style.setProperty("--cols", cols);
    element.style.setProperty("--rows", rows);

    element.className = "board " + className;

    element.dataset.cols = cols;
    element.dataset.rows = rows;

}


/* =========================================
   مراحل خانه‌ای
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


function renderCellBoard(
    element,
    stage,
    boardName,
    cols,
    rows,
    lockedColumns
) {

    makeBoard(element, cols, rows);

    const answer = getAnswer(currentStage, boardName);

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            const cell = document.createElement("button");

            cell.type = "button";
            cell.className = "grid-cell";

            cell.dataset.row = row;
            cell.dataset.col = col;

            const locked =
                boardName === "main" &&
                col < lockedColumns;

            if (locked) {
                cell.classList.add("locked");
            } else {
                cell.classList.add("answer-cell");
            }

            const expected =
                boardName === "main" && locked
                    ? expectedCell(stage, row, col)
                    : null;

            const saved =
                answer.cells[row + "_" + col] || null;

            if (locked && expected) {

                cell.style.backgroundColor = COLORS[expected];

            } else if (!locked && saved) {

                cell.style.backgroundColor = COLORS[saved];

            }

            if (!locked) {

                cell.addEventListener("click", () => {

                    if (eraserActive) {

                        delete answer.cells[row + "_" + col];

                    } else {

                        answer.cells[row + "_" + col] =
                            selectedColor;

                    }

                    cell.style.backgroundColor =
                        eraserActive
                            ? "#fff"
                            : COLORS[selectedColor];

                    clearFeedback();

                });

            }

            element.appendChild(cell);

        }

    }

}


function renderCellStage(stage) {

    renderCellBoard(
        mainBoard,
        stage,
        "main",
        stage.cols,
        stage.rows,
        stage.fixedColumns
    );

    renderCellBoard(
        copyBoard,
        stage,
        "copy",
        stage.copyCols,
        stage.rows,
        0
    );

}


/* =========================================
   مراحل خطی
========================================= */

function getLinePoints(stage, width = 100, height = 100) {

    const points = [];

    const total = stage.points.length;

    stage.points.forEach((row, index) => {

        const x = total === 1
            ? 0
            : index / (total - 1) * width;

        const y = (row + 0.5) / stage.rows * height;

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


function createSvg(element, stage, boardName) {

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");

    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");

    svg.classList.add("line-svg");

    const expected = getLinePoints(stage);

    const answer = getAnswer(currentStage, boardName);

    const guide = document.createElementNS(svgNS, "path");

    let guidePoints = expected;

    if (boardName === "main") {

        guidePoints = expected.slice(
            0,
            stage.fixedColumns
        );

    }

    guide.setAttribute(
        "d",
        pointsToPath(guidePoints)
    );

    guide.setAttribute(
        "stroke",
        COLORS[stage.color]
    );

    guide.setAttribute("stroke-width", "2.8");

    guide.classList.add(
        "line-path",
        "line-guide"
    );

    svg.appendChild(guide);


    answer.strokes.forEach(stroke => {

        const path = document.createElementNS(svgNS, "path");

        path.setAttribute(
            "d",
            pointsToPath(stroke.points)
        );

        path.setAttribute(
            "stroke",
            stroke.color
        );

        path.setAttribute("stroke-width", "3.2");

        path.classList.add("line-path");

        svg.appendChild(path);

    });


    const drawLayer = document.createElementNS(
        svgNS,
        "path"
    );

    drawLayer.setAttribute("d", "");
    drawLayer.setAttribute("stroke", "transparent");
    drawLayer.setAttribute("stroke-width", "12");

    drawLayer.classList.add("line-draw");

    drawLayer.style.fill = "none";

    svg.appendChild(drawLayer);

    element.appendChild(svg);

    attachDrawing(svg, element, boardName, stage);

}


/* =========================================
   رسم با انگشت و ماوس
========================================= */

function getPointerPosition(event, svg) {

    const rect = svg.getBoundingClientRect();

    return {
        x: Math.max(
            0,
            Math.min(
                100,
                (event.clientX - rect.left) / rect.width * 100
            )
        ),

        y: Math.max(
            0,
            Math.min(
                100,
                (event.clientY - rect.top) / rect.height * 100
            )
        )
    };

}


function attachDrawing(svg, board, boardName, stage) {

    const drawLayer = svg.querySelector(".line-draw");

    const answer = getAnswer(currentStage, boardName);

    let drawing = false;

    let currentPoints = [];

    function drawPath(points, color) {

        const svgNS = "http://www.w3.org/2000/svg";

        const path = document.createElementNS(
            svgNS,
            "path"
        );

        path.setAttribute(
            "d",
            pointsToPath(points)
        );

        path.setAttribute("stroke", color);
        path.setAttribute("stroke-width", "3.2");

        path.classList.add("line-path");

        svg.insertBefore(path, drawLayer);

        return path;

    }


    function startDrawing(event) {

        event.preventDefault();

        drawing = true;

        currentPoints = [
            getPointerPosition(event, svg)
        ];

        try {
            drawLayer.setPointerCapture(event.pointerId);
        } catch (error) {
            // در مرورگرهایی که pointer capture را پشتیبانی نمی‌کنند
        }

        const color = eraserActive
            ? "#ffffff"
            : COLORS[selectedColor];

        activeStroke = {
            points: currentPoints,
            color,
            boardName,
            stageIndex: currentStage
        };

        activeBoard = boardName;

        drawLayer.dataset.activeColor = color;

    }


    function moveDrawing(event) {

        if (!drawing) {
            return;
        }

        event.preventDefault();

        const point = getPointerPosition(event, svg);

        const previous =
            currentPoints[currentPoints.length - 1];

        const distance = Math.hypot(
            point.x - previous.x,
            point.y - previous.y
        );

        if (distance < 0.6) {
            return;
        }

        currentPoints.push(point);

        drawLayer.setAttribute(
            "d",
            pointsToPath(currentPoints)
        );

        drawLayer.setAttribute(
            "stroke",
            drawLayer.dataset.activeColor
        );

        drawLayer.setAttribute(
            "stroke-width",
            eraserActive ? "12" : "3.2"
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

        if (currentPoints.length > 1) {

            if (eraserActive) {

                eraseNearStroke(
                    answer,
                    currentPoints
                );

            } else {

                answer.strokes.push({
                    points: currentPoints.map(p => ({
                        x: p.x,
                        y: p.y
                    })),
                    color: COLORS[selectedColor]
                });

            }

        }

        drawLayer.setAttribute("d", "");

        renderLineStage(stage);

        activeStroke = null;
        activeBoard = null;

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

    drawLayer.addEventListener(
        "lostpointercapture",
        () => {
            if (drawing) {
                stopDrawing({
                    preventDefault() {}
                });
            }
        }
    );

}


/* =========================================
   پاک کردن مسیر نزدیک به خط
========================================= */

function distanceBetween(a, b) {

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}


function eraseNearStroke(answer, eraserPoints) {

    answer.strokes = answer.strokes.filter(stroke => {

        let shouldRemove = false;

        for (const point of stroke.points) {

            for (const eraserPoint of eraserPoints) {

                if (
                    distanceBetween(point, eraserPoint) < 9
                ) {

                    shouldRemove = true;
                    break;

                }

            }

            if (shouldRemove) {
                break;
            }

        }

        return !shouldRemove;

    });

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

    createGridBackground(mainBoard, stage);
    createGridBackground(copyBoard, stage);

    createSvg(mainBoard, stage, "main");
    createSvg(copyBoard, stage, "copy");

}


function createGridBackground(element, stage) {

    for (let row = 0; row < stage.rows; row++) {

        for (let col = 0; col < stage.cols; col++) {

            const cell = document.createElement("div");

            cell.className = "grid-cell";

            element.appendChild(cell);

        }

    }

}


/* =========================================
   بررسی پاسخ خطی
========================================= */

function pointToSegmentDistance(point, start, end) {

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


function distanceToPath(point, path) {

    let minDistance = Infinity;

    for (let i = 0; i < path.length - 1; i++) {

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


function samplePath(path, count = 80) {

    const samples = [];

    for (let i = 0; i <= count; i++) {

        const t = i / count;

        const scaled = t * (path.length - 1);

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


function strokeCoversPath(strokes, targetPath, tolerance = 8) {

    if (!strokes.length) {
        return false;
    }

    const samples = samplePath(targetPath);

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


function checkLineStage(stage) {

    const mainAnswer = getAnswer(currentStage, "main");
    const copyAnswer = getAnswer(currentStage, "copy");

    const expected = getLinePoints(stage);

    const mainTarget = expected.slice(
        stage.fixedColumns - 1
    );

    const copyTarget = getLinePoints(stage);

    const mainCorrect = strokeCoversPath(
        mainAnswer.strokes,
        mainTarget,
        9
    );

    const copyCorrect = strokeCoversPath(
        copyAnswer.strokes,
        copyTarget,
        9
    );

    return mainCorrect && copyCorrect;

}


/* =========================================
   بررسی مراحل خانه‌ای
========================================= */

function checkCellBoard(stage, boardName, cols, rows) {

    const answer = getAnswer(currentStage, boardName);

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

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


function checkCellStage(stage) {

    const mainAnswer = getAnswer(currentStage, "main");

    for (
        let row = 0;
        row < stage.rows;
        row++
    ) {

        for (
            let col = stage.fixedColumns;
            col < stage.cols;
            col++
        ) {

            const expected = expectedCell(
                stage,
                row,
                col
            );

            const actual =
                mainAnswer.cells[row + "_" + col] || null;

            if (expected !== actual) {
                return false;
            }

        }

    }


    const copyCorrect = checkCellBoard(
        stage,
        "copy",
        stage.copyCols,
        stage.rows
    );

    return copyCorrect;

}


/* =========================================
   بررسی نهایی
========================================= */

function checkAnswers() {

    const stage = getStage();

    let correct = false;

    if (stage.kind === "line") {

        correct = checkLineStage(stage);

    } else {

        correct = checkCellStage(stage);

    }

    if (correct) {

        showFeedback("");

        showFireworks();

        if (currentStage === STAGES.length - 1) {

            setTimeout(() => {
                showFinish();
            }, 2600);

        }

    } else {

        showFeedback(
            "یک بار دیگر با دقت الگو را کامل کن.",
            "wrong"
        );

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

        currentStage--;

        renderStage();

    }

});


nextButton.addEventListener("click", () => {

    if (currentStage < STAGES.length - 1) {

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

    game.classList.add("hidden");
    finish.classList.add("hidden");

    welcome.classList.remove("hidden");

    stopFireworks();

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
        "آفرین " + student +
        "! همه الگوها را با موفقیت کامل کردی.";

}


function restartGame() {

    currentStage = 0;

    Object.keys(answers).forEach(key => {
        delete answers[key];
    });

    finish.classList.add("hidden");
    welcome.classList.remove("hidden");

    studentName.value = "";

    stopFireworks();

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

let particles = [];

let animationFrame = null;

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

    const context = fireworksCanvas.getContext("2d");

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
                        Math.random() * fireworkColors.length
                    )
                ]

        });

    }

}


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

        const context = fireworksCanvas.getContext("2d");

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

            animationFrame = requestAnimationFrame(animate);

        } else {

            stopFireworks();

        }

    }

    animate();

}


function stopFireworks() {

    if (animationFrame) {

        cancelAnimationFrame(animationFrame);

        animationFrame = null;

    }

    fireworksCanvas.style.display = "none";

    const context = fireworksCanvas.getContext("2d");

    context.clearRect(
        0,
        0,
        fireworksCanvas.width,
        fireworksCanvas.height
    );

    particles = [];

}


window.addEventListener("resize", () => {

    if (fireworksCanvas.style.display === "block") {
        resizeFireworksCanvas();
    }

});


/* =========================================
   آماده‌سازی اولیه
========================================= */

renderPalette();
