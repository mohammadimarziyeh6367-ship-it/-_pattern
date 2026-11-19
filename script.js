"use strict";

const $ = id => document.getElementById(id);

/* رنگ‌ها */

const COLORS = {
    red: "#e53935",
    blue: "#159ed0",
    green: "#55ad48",
    yellow: "#f4c62f",
    orange: "#e9782c",
    black: "#242424"
};

const PENCILS = [
    ["red", "قرمز"],
    ["blue", "آبی"],
    ["green", "سبز"],
    ["yellow", "زرد"],
    ["orange", "نارنجی"],
    ["black", "مشکی"]
];

/* مراحل بازی */

const STAGES = [

    {
        title: "خط پله‌ای قرمز",
        kind: "line",
        color: "red",
        cols: 14,
        rows: 4,
        fixed: 6,
        copyCols: 8,
        points: [2, 3, 2, 3, 2, 3, 2, 3, 2]
    },

    {
        title: "خط پله‌ای سبز",
        kind: "line",
        color: "green",
        cols: 14,
        rows: 4,
        fixed: 6,
        copyCols: 8,
        points: [3, 2, 2, 3, 3, 2, 2, 3, 3]
    },

    {
        title: "خط پله‌ای مشکی",
        kind: "line",
        color: "black",
        cols: 14,
        rows: 4,
        fixed: 6,
        copyCols: 8,
        points: [2, 3, 3, 3, 2, 2, 2, 3, 3]
    },

    {
        title: "خط پله‌ای زرد",
        kind: "line",
        color: "yellow",
        cols: 14,
        rows: 4,
        fixed: 6,
        copyCols: 8,
        points: [3, 2, 2, 3, 3, 2, 2, 3, 3]
    },

    {
        title: "گل سبز با مرکز قرمز",
        kind: "cells",
        cols: 12,
        rows: 3,
        fixedCols: 6,
        repeatCols: 3,

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
        title: "الگوی سبز پله‌ای",
        kind: "cells",
        cols: 16,
        rows: 3,
        fixedCols: 12,
        repeatCols: 4,

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
        kind: "cells",
        cols: 12,
        rows: 2,
        fixedCols: 8,
        repeatCols: 4,

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
        title: "الگوی آبی، قرمز، سبز و زرد",
        kind: "cells",
        cols: 16,
        rows: 1,
        fixedCols: 8,
        repeatCols: 4,

        motif: [
            [0, 0, "blue"],
            [0, 1, "red"],
            [0, 2, "green"],
            [0, 3, "yellow"]
        ]
    }

];

/* وضعیت بازی */

let stageIndex = 0;
let studentName = "";
let selectedColor = "red";
let activeTool = "pencil";

let answers = {};
let savedStages = {};

let audioContext = null;
let fireworksFrame = null;

let celebratedStages = new Set();

/* مدیریت پاسخ‌ها */

function key(board, index) {
    return board + ":" + index;
}

function getAnswer(board, index) {
    return answers[key(board, index)] || null;
}

function setAnswer(board, index, value) {

    if (value) {
        answers[key(board, index)] = value;
    } else {
        delete answers[key(board, index)];
    }

}

function saveStage() {

    savedStages[stageIndex] = {
        answers: JSON.parse(JSON.stringify(answers))
    };

}

function loadStage() {

    const saved = savedStages[stageIndex];

    answers = saved
        ? JSON.parse(JSON.stringify(saved.answers))
        : {};

}

/* صدا */

function sound(freq = 520, duration = 0.08) {

    try {

        const AC =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AC) return;

        audioContext = audioContext || new AC();

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(audioContext.destination);

        gain.gain.setValueAtTime(
            0.08,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration
        );

        osc.start();

        osc.stop(
            audioContext.currentTime + duration
        );

    } catch (e) {}

}

/* پیام پاسخ */

function feedback(message = "", type = "") {

    $("feedback").textContent = message;

    $("feedback").className =
        "feedback " + type;

}

/* مدادها و پاک‌کن */

function palette() {

    const root = $("palette");

    root.replaceChildren();

    PENCILS.forEach(([id, label]) => {

        const btn = document.createElement("button");

        btn.type = "button";

        btn.className =
            "pencil-choice" +
            (selectedColor === id ? " selected" : "");

        btn.title = "مداد " + label;

        btn.setAttribute(
            "aria-label",
            "مداد " + label
        );

        btn.innerHTML =
            '<span class="pencil" style="--pencil:' +
            COLORS[id] +
            '"><i></i></span>';

        btn.addEventListener("click", () => {

            selectedColor = id;
            activeTool = "pencil";

            palette();

            sound(540);

            feedback("مداد " + label + " انتخاب شد.");

        });

        root.append(btn);

    });

    $("eraserButton").classList.toggle(
        "active",
        activeTool === "eraser"
    );

    $("eraserButton").setAttribute(
        "aria-pressed",
        String(activeTool === "eraser")
    );

}

/* ساخت جدول */

function makeBoard(
    id,
    cols,
    rows,
    small = false,
    line = false
) {

    const root = $(id);

    root.replaceChildren();

    root.style.setProperty("--cols", cols);
    root.style.setProperty("--rows", rows);

    root.classList.toggle("small-board", small);
    root.classList.toggle("line-board", line);

    root._lineState = null;

    return root;

}

/* ساخت خانه رنگی */

function makeCell(
    boardName,
    index,
    value,
    locked = false
) {

    const cell = document.createElement("button");

    cell.type = "button";

    cell.className =
        "grid-cell " +
        (locked ? "locked" : "answer-cell");

    if (value) {

        cell.innerHTML =
            '<span class="paint-fill" style="--fill:' +
            COLORS[value] +
            '"></span>';

    }

    if (!locked) {

        cell.addEventListener("click", () => {

            if (activeTool === "eraser") {

                setAnswer(boardName, index, null);

                sound(260, 0.06);

            } else {

                setAnswer(
                    boardName,
                    index,
                    selectedColor
                );

                sound(490);

            }

            renderCurrentBoards();

            saveStage();

        });

    }

    return cell;

}

/* تبدیل الگو به نقشه */

function motifMap(stage) {

    const map = new Map();

    stage.motif.forEach(([r, c, color]) => {

        map.set(r + ":" + c, color);

    });

    return map;

}

/* ساخت جدول‌های رنگی */

function renderCellStage(stage) {

    const main = makeBoard(
        "mainBoard",
        stage.cols,
        stage.rows
    );

    const copy = makeBoard(
        "copyBoard",
        stage.repeatCols,
        stage.rows,
        true
    );

    const motif = motifMap(stage);

    /* جدول اصلی */

    for (let r = 0; r < stage.rows; r++) {

        for (let c = 0; c < stage.cols; c++) {

            const index = r * stage.cols + c;

            const locked = c < stage.fixedCols;

            const expected =
                motif.get(
                    r + ":" + (c % stage.repeatCols)
                ) || null;

            const value = locked
                ? expected
                : getAnswer("main", index);

            main.append(
                makeCell(
                    "main",
                    index,
                    value,
                    locked
                )
            );

        }

    }

    /*
    جدول پایین از ابتدا خالی است.
    دانش‌آموز باید یک بار الگو را در آن بسازد.
    */

    for (let r = 0; r < stage.rows; r++) {

        for (let c = 0; c < stage.repeatCols; c++) {

            const index = r * stage.repeatCols + c;

            copy.append(
                makeCell(
                    "copy",
                    index,
                    getAnswer("copy", index),
                    false
                )
            );

        }

    }

}

/* محاسبه مسیر خط */

function pathY(stage, x, totalCols) {

    const points = stage.points;

    /*
    مختصات افقی جدول به بازه واقعی ۰ تا ۸
    تبدیل می‌شود.

    در جدول اصلی ۱۴ ستونی:
    هر نقطه با عرض واقعی جدول هماهنگ است.

    در جدول پایین ۸ ستونی:
    کل الگو در تمام عرض جدول قرار می‌گیرد.
    */

    const patternLength = points.length - 1;

    const patternX =
        (x / totalCols) * patternLength;

    const clampedX = Math.max(
        0,
        Math.min(patternLength, patternX)
    );

    const segment = Math.min(
        Math.floor(clampedX),
        patternLength - 1
    );

    const fraction = clampedX - segment;

    const a = points[segment];
    const b = points[segment + 1];

    return a + (b - a) * fraction;

}

/* ساخت خانه‌های جدول خطی */

function addGridCells(
    board,
    cols,
    rows,
    lockedColumns = 0
) {

    for (let r = 0; r < rows; r++) {

        for (let c = 0; c < cols; c++) {

            const cell = document.createElement("div");

            cell.className =
                "grid-cell" +
                (c < lockedColumns ? " locked" : "");

            board.append(cell);

        }

    }

}

/* ساخت SVG */

function svgElement(name) {

    return document.createElementNS(
        "http://www.w3.org/2000/svg",
        name
    );

}

/* خط راهنمای الگوی اصلی */

function addLineGuide(
    board,
    stage,
    start,
    end,
    totalCols
) {

    const svg = svgElement("svg");

    svg.classList.add(
        "line-svg",
        "line-guide"
    );

    svg.setAttribute(
        "viewBox",
        "0 0 " + totalCols + " " + stage.rows
    );

    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    );

    const points = [];

    const step = 0.05;

    for (let x = start; x < end; x += step) {

        points.push(
            x + "," + pathY(stage, x, totalCols)
        );

    }

    points.push(
        end + "," + pathY(stage, end, totalCols)
    );

    const line = svgElement("polyline");

    line.setAttribute(
        "points",
        points.join(" ")
    );

    line.setAttribute("fill", "none");

    line.setAttribute(
        "stroke",
        COLORS[stage.color]
    );

    line.setAttribute(
        "stroke-width",
        "0.09"
    );

    line.setAttribute(
        "stroke-linecap",
        "round"
    );

    line.setAttribute(
        "stroke-linejoin",
        "round"
    );

    svg.append(line);

    board.append(svg);

}

/* فاصله نقطه از پاره‌خط */

function distanceToSegment(p, a, b) {

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {

        return Math.hypot(
            p.x - a.x,
            p.y - a.y
        );

    }

    let t =
        (
            (p.x - a.x) * dx +
            (p.y - a.y) * dy
        ) / lengthSquared;

    t = Math.max(0, Math.min(1, t));

    const nearestX = a.x + t * dx;
    const nearestY = a.y + t * dy;

    return Math.hypot(
        p.x - nearestX,
        p.y - nearestY
    );

}

/* فاصله دو نقطه */

function pointDistance(a, b) {

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}

/* محاسبه خانه‌های پوشش داده شده توسط خط */

function calculateBins(
    segments,
    drawWidth,
    xOffset
) {

    const bins = new Set();

    const totalBins = Math.ceil(drawWidth * 4);

    segments.forEach(segment => {

        const localA = segment.a.x - xOffset;
        const localB = segment.b.x - xOffset;

        const low = Math.min(localA, localB);
        const high = Math.max(localA, localB);

        for (let i = 0; i < totalBins; i++) {

            const center = (i + 0.5) / 4;

            if (center >= low && center <= high) {
                bins.add(i);
            }

        }

    });

    return [...bins];

}

/* رسم قسمت‌های ذخیره‌شده */

function drawSavedSegments(svg, segments) {

    segments.forEach(segment => {

        const line = svgElement("line");

        line.setAttribute("x1", segment.a.x);
        line.setAttribute("y1", segment.a.y);

        line.setAttribute("x2", segment.b.x);
        line.setAttribute("y2", segment.b.y);

        line.setAttribute(
            "stroke",
            COLORS[segment.color]
        );

        line.setAttribute(
            "stroke-width",
            "0.19"
        );

        line.setAttribute(
            "stroke-linecap",
            "round"
        );

        line.setAttribute(
            "pointer-events",
            "none"
        );

        svg.append(line);

    });

}

/* پاک کردن خط با حرکت پاک‌کن */

function eraseSegmentsAlongSweep(
    answer,
    from,
    to,
    totalCols
) {

    if (
        !answer ||
        !Array.isArray(answer.segments) ||
        answer.segments.length === 0
    ) {
        return false;
    }

    const distance = pointDistance(from, to);

    const steps = Math.max(
        1,
        Math.ceil(distance / 0.04)
    );

    const eraseRadius = Math.max(
        0.22,
        totalCols * 0.018
    );

    const before = answer.segments.length;

    answer.segments = answer.segments.filter(segment => {

        let nearest = Infinity;

        for (let i = 0; i <= steps; i++) {

            const t = i / steps;

            const p = {
                x: from.x + (to.x - from.x) * t,
                y: from.y + (to.y - from.y) * t
            };

            const d = distanceToSegment(
                p,
                segment.a,
                segment.b
            );

            nearest = Math.min(nearest, d);

            if (nearest <= eraseRadius) {
                return false;
            }

        }

        return true;

    });

    return answer.segments.length < before;

}

/* رسم خط با انگشت یا ماوس */

function setupLineDrawing(
    board,
    boardName,
    stage,
    xOffset,
    drawWidth,
    isCopy
) {

    const totalCols = isCopy
        ? stage.copyCols
        : stage.cols;

    const svg = svgElement("svg");

    svg.classList.add(
        "line-svg",
        "line-draw"
    );

    svg.setAttribute(
        "viewBox",
        "0 0 " + totalCols + " " + stage.rows
    );

    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    );

    board.append(svg);

    const answerKey = key(boardName, "line");

    let answer = answers[answerKey] || {
        segments: [],
        bins: [],
        complete: false
    };

    if (!Array.isArray(answer.segments)) {
        answer.segments = [];
    }

    drawSavedSegments(
        svg,
        answer.segments
    );

    let drawing = false;
    let erasing = false;
    let erasedSomething = false;

    let currentPoint = null;
    let currentColor = selectedColor;

    /* تبدیل مختصات صفحه به مختصات جدول */

    function point(event) {

        const rect = board.getBoundingClientRect();

        return {
            x:
                (event.clientX - rect.left) /
                rect.width *
                totalCols,

            y:
                (event.clientY - rect.top) /
                rect.height *
                stage.rows
        };

    }

    /* بررسی محدوده مجاز رسم */

    function allowedPoint(p) {

        const start = isCopy ? 0 : xOffset;
        const end = start + drawWidth;

        const edgeTolerance = 0.25;

        return (
            p.x >= Math.max(0, start - edgeTolerance) &&
            p.x <= Math.min(totalCols, end + edgeTolerance) &&
            p.y >= 0 &&
            p.y <= stage.rows
        );

    }

    /* افزودن خط */

    function addSegment(a, b) {

        const segment = {
            a: {
                x: a.x,
                y: a.y
            },

            b: {
                x: b.x,
                y: b.y
            },

            color: currentColor
        };

        answer.segments.push(segment);

        const line = svgElement("line");

        line.setAttribute("x1", a.x);
        line.setAttribute("y1", a.y);

        line.setAttribute("x2", b.x);
        line.setAttribute("y2", b.y);

        line.setAttribute(
            "stroke",
            COLORS[currentColor]
        );

        line.setAttribute(
            "stroke-width",
            "0.19"
        );

        line.setAttribute(
            "stroke-linecap",
            "round"
        );

        line.setAttribute(
            "pointer-events",
            "none"
        );

        svg.append(line);

    }

    /* شروع رسم یا پاک کردن */

    svg.addEventListener("pointerdown", event => {

        event.preventDefault();

        const p = point(event);

        if (activeTool === "eraser") {

            erasing = true;
            drawing = false;

            currentPoint = p;
            erasedSomething = false;

            svg.setPointerCapture(event.pointerId);

            const changed = eraseSegmentsAlongSweep(
                answer,
                p,
                p,
                totalCols
            );

            if (changed) {
                erasedSomething = true;
            }

            return;

        }

        if (!allowedPoint(p)) return;

        drawing = true;
        erasing = false;

        currentPoint = p;
        currentColor = selectedColor;

        svg.setPointerCapture(event.pointerId);

    });

    /* حرکت انگشت یا ماوس */

    svg.addEventListener("pointermove", event => {

        const p = point(event);

        /* حرکت پاک‌کن */

        if (erasing && currentPoint) {

            event.preventDefault();

            const changed = eraseSegmentsAlongSweep(
                answer,
                currentPoint,
                p,
                totalCols
            );

            if (changed) {
                erasedSomething = true;
            }

            currentPoint = p;

            return;

        }

        /* رسم خط */

        if (!drawing || !currentPoint) return;

        event.preventDefault();

        if (!allowedPoint(p)) return;

        if (
            pointDistance(p, currentPoint) < 0.025
        ) {
            return;
        }

        addSegment(currentPoint, p);

        currentPoint = p;

    });

    /* پایان رسم یا پاک کردن */

    function stopPointer() {

        if (erasing) {

            erasing = false;
            currentPoint = null;

            if (erasedSomething) {

                answer.bins = calculateBins(
                    answer.segments,
                    drawWidth,
                    xOffset
                );

                answer.complete = false;

                answers[answerKey] = answer;

                saveStage();

                sound(260, 0.06);

                renderCurrentBoards();

                feedback("قسمت‌های لمس‌شده پاک شدند.");

            }

            return;

        }

        if (!drawing) return;

        drawing = false;
        currentPoint = null;

        answer.bins = calculateBins(
            answer.segments,
            drawWidth,
            xOffset
        );

        answer.complete =
            answer.bins.length >= Math.ceil(drawWidth * 4);

        answers[answerKey] = answer;

        saveStage();

        sound(460);

    }

    svg.addEventListener("pointerup", stopPointer);

    svg.addEventListener("pointercancel", stopPointer);

    svg.addEventListener("lostpointercapture", stopPointer);

    /* وضعیت مسیر */

    board._lineState = {

        get complete() {
            return !!answers[answerKey]?.complete;
        },

        get color() {

            const segments =
                answers[answerKey]?.segments || [];

            if (!segments.length) return null;

            return segments.every(
                segment => segment.color === stage.color
            )
                ? stage.color
                : "mixed";

        }

    };

}

/* نمایش مرحله خطی */

function renderLineStage(stage) {

    const main = makeBoard(
        "mainBoard",
        stage.cols,
        stage.rows,
        false,
        true
    );

    const copy = makeBoard(
        "copyBoard",
        stage.copyCols,
        stage.rows,
        true,
        true
    );

    addGridCells(
        main,
        stage.cols,
        stage.rows,
        stage.fixed
    );

    addGridCells(
        copy,
        stage.copyCols,
        stage.rows,
        0
    );

    /*
    راهنمای جدول اصلی:
    از ستون صفر تا پایان ستون ششم.
    */

    addLineGuide(
        main,
        stage,
        0,
        stage.fixed,
        stage.cols
    );

    /*
    ادامه مسیر:
    دقیقاً از انتهای راهنما تا انتهای جدول.
    */

    setupLineDrawing(
        main,
        "main",
        stage,
        stage.fixed,
        stage.cols - stage.fixed,
        false
    );

    /*
    جدول پایین:
    کاملاً خالی و آماده رسم یک تکرار کامل.
    */

    setupLineDrawing(
        copy,
        "copy",
        stage,
        0,
        stage.copyCols,
        true
    );

}

/* نمایش جدول مناسب هر مرحله */

function renderCurrentBoards() {

    const stage = STAGES[stageIndex];

    if (stage.kind === "line") {

        renderLineStage(stage);

    } else {

        renderCellStage(stage);

    }

}

/* نمایش مرحله */

function renderStage() {

    loadStage();

    selectedColor = "red";
    activeTool = "pencil";

    const stage = STAGES[stageIndex];

    $("stageCounter").textContent =
        (stageIndex + 1) +
        " از " +
        STAGES.length;

    $("progressBar").style.width =
        ((stageIndex + 1) / STAGES.length * 100) +
        "%";

    $("questionTitle").textContent =
        stage.title;

    $("questionText").textContent =
        stage.kind === "line"

            ? "الگو را با مداد هم‌رنگ ادامه بده و یک بار همان خط را در جدول خالی پایین رسم کن."

            : "الگوی اصلی را کامل کن و یک بار همان الگو را در جدول خالی پایین بساز.";

    $("boardLabel").textContent =
        "الگوی اصلی";

    $("copyLabel").textContent =
        "یک بار الگوی اصلی را در جدول خالی تکرار کن";

    $("prevButton").disabled =
        stageIndex === 0;

    $("nextButton").disabled =
        stageIndex === STAGES.length - 1;

    palette();

    renderCurrentBoards();

    feedback("");

    window.scrollTo({
        top: 0,
        behavior: "auto"
    });

}

/* بررسی جدول‌های رنگی */

function checkCellStage(stage) {

    const motif = motifMap(stage);

    /* بررسی جدول اصلی */

    for (let r = 0; r < stage.rows; r++) {

        for (
            let c = stage.fixedCols;
            c < stage.cols;
            c++
        ) {

            const expected =
                motif.get(
                    r + ":" + (c % stage.repeatCols)
                ) || null;

            const actual = getAnswer(
                "main",
                r * stage.cols + c
            );

            if (actual !== expected) {
                return false;
            }

        }

        /* بررسی مستقل جدول پایین */

        for (
            let c = 0;
            c < stage.repeatCols;
            c++
        ) {

            const expected =
                motif.get(r + ":" + c) || null;

            const actual = getAnswer(
                "copy",
                r * stage.repeatCols + c
            );

            if (actual !== expected) {
                return false;
            }

        }

    }

    return true;

}

/* بررسی میزان انطباق خط با الگو */

function segmentsFollowPattern(
    segments,
    stage,
    startX,
    endX,
    totalCols
) {

    if (!segments || segments.length === 0) {
        return false;
    }

    const tolerance = 0.70;
    const edgeTolerance = 0.30;

    /*
    بررسی همه قسمت‌های رسم‌شده.
    */

    for (const segment of segments) {

        for (const t of [0, 0.25, 0.5, 0.75, 1]) {

            const x =
                segment.a.x +
                (segment.b.x - segment.a.x) * t;

            const y =
                segment.a.y +
                (segment.b.y - segment.a.y) * t;

            if (
                x < startX - edgeTolerance ||
                x > endX + edgeTolerance
            ) {
                return false;
            }

            const expectedY = pathY(
                stage,
                x,
                totalCols
            );

            if (Math.abs(y - expectedY) > tolerance) {
                return false;
            }

        }

    }

    /*
    بررسی پوشش مسیر اصلی.
    */

    let covered = 0;
    let total = 0;

    for (
        let x = startX;
        x <= endX;
        x += 0.15
    ) {

        const expectedPoint = {
            x: x,
            y: pathY(stage, x, totalCols)
        };

        let nearestDistance = Infinity;

        for (const segment of segments) {

            const distance = distanceToSegment(
                expectedPoint,
                segment.a,
                segment.b
            );

            nearestDistance = Math.min(
                nearestDistance,
                distance
            );

        }

        total++;

        if (nearestDistance <= tolerance) {
            covered++;
        }

    }

    const coverage = total
        ? covered / total
        : 0;

    return coverage >= 0.90;

}

/* بررسی خط‌ها */

function checkLineStage(stage) {

    const main = answers[key("main", "line")];

    const copy = answers[key("copy", "line")];

    if (!main || !copy) return false;

    if (!Array.isArray(main.segments)) return false;

    if (!Array.isArray(copy.segments)) return false;

    if (main.segments.length === 0) return false;

    if (copy.segments.length === 0) return false;

    /* رنگ خط اصلی */

    const mainColorsCorrect =
        main.segments.every(
            segment => segment.color === stage.color
        );

    /* رنگ خط پایین */

    const copyColorsCorrect =
        copy.segments.every(
            segment => segment.color === stage.color
        );

    /*
    بررسی مسیر اصلی:
    از ستون ششم تا پایان ستون چهاردهم.
    */

    const mainPathCorrect = segmentsFollowPattern(
        main.segments,
        stage,
        stage.fixed,
        stage.cols,
        stage.cols
    );

    /*
    بررسی یک تکرار کامل در جدول پایین.
    */

    const copyPathCorrect = segmentsFollowPattern(
        copy.segments,
        stage,
        0,
        stage.copyCols,
        stage.copyCols
    );

    return (
        mainColorsCorrect &&
        copyColorsCorrect &&
        mainPathCorrect &&
        copyPathCorrect
    );

}

/* بررسی پاسخ */

function checkAnswers() {

    const stage = STAGES[stageIndex];

    const correct =
        stage.kind === "line"
            ? checkLineStage(stage)
            : checkCellStage(stage);

    if (correct) {

        sound(660);

        setTimeout(() => {
            sound(880, 0.12);
        }, 110);

        /* فقط فشفشه، بدون پیام تبریک اضافی */

        feedback("");

        saveStage();

        if (!celebratedStages.has(stageIndex)) {

            celebratedStages.add(stageIndex);

            showFireworks();

        }

        if (stageIndex === STAGES.length - 1) {

            setTimeout(() => {

                $("game").classList.add("hidden");

                $("finish").classList.remove("hidden");

                $("finishMessage").textContent =
                    studentName +
                    "، همهٔ الگوها را با موفقیت کامل کردی!";

            }, 2600);

        }

    } else {

        sound(230, 0.14);

        feedback(
            "هنوز بخشی از الگو کامل نشده یا رنگی درست انتخاب نشده است. دوباره بررسی کن.",
            "wrong"
        );

    }

}

/* فعال کردن پاک‌کن */

function toggleEraser() {

    activeTool =
        activeTool === "eraser"
            ? "pencil"
            : "eraser";

    palette();

    feedback(
        activeTool === "eraser"
            ? "پاک‌کن انتخاب شد. روی خانه یا با کشیدن روی خط، قسمت موردنظر را پاک کن."
            : "مداد رنگی انتخاب شد."
    );

}

/* مرحله بعد */

function nextStage() {

    saveStage();

    if (stageIndex < STAGES.length - 1) {

        stageIndex++;

        renderStage();

    }

}

/* مرحله قبل */

function previousStage() {

    saveStage();

    if (stageIndex > 0) {

        stageIndex--;

        renderStage();

    }

}

/* شروع بازی */

function startGame() {

    studentName =
        $("studentName").value.trim() ||
        "دانش‌آموز عزیز";

    stageIndex = 0;

    answers = {};

    savedStages = {};

    celebratedStages.clear();

    $("studentGreeting").textContent =
        "سلام " + studentName;

    $("welcome").classList.add("hidden");

    $("finish").classList.add("hidden");

    $("game").classList.remove("hidden");

    renderStage();

}

/* خروج */

function exitGame() {

    if (!confirm("از بازی خارج می‌شوی؟")) {
        return;
    }

    $("game").classList.add("hidden");

    $("welcome").classList.remove("hidden");

}

/* فشفشه‌ها */

function showFireworks() {

    const canvas = $("fireworksCanvas");

    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;

    canvas.width = innerWidth * dpr;

    canvas.height = innerHeight * dpr;

    canvas.style.display = "block";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    const particles = [];

    const colors = [
        "#f3c969",
        "#8fc9b5",
        "#a99bd5",
        "#ef9d91",
        "#8ebbd8",
        "#f0b6cf"
    ];

    const bursts = [

        {
            x: innerWidth * 0.22,
            y: innerHeight * 0.28
        },

        {
            x: innerWidth * 0.50,
            y: innerHeight * 0.20
        },

        {
            x: innerWidth * 0.78,
            y: innerHeight * 0.30
        }

    ];

    bursts.forEach((burst, burstIndex) => {

        for (let i = 0; i < 42; i++) {

            const angle =
                (Math.PI * 2 * i) / 42 +
                (Math.random() - 0.5) * 0.12;

            const speed =
                1.5 + Math.random() * 3.1;

            particles.push({

                x: burst.x,
                y: burst.y,

                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,

                gravity: 0.035 + Math.random() * 0.025,

                life: 65 + Math.random() * 25,

                size: 3 + Math.random() * 3,

                color: colors[
                    (i + burstIndex) % colors.length
                ],

                rotation: Math.random() * Math.PI,

                spin: (Math.random() - 0.5) * 0.16

            });

        }

    });

    let frame = 0;

    function draw() {

        ctx.clearRect(
            0,
            0,
            innerWidth,
            innerHeight
        );

        particles.forEach(p => {

            if (p.life <= 0) return;

            p.x += p.vx;
            p.y += p.vy;

            p.vy += p.gravity;

            p.rotation += p.spin;

            p.life--;

            ctx.save();

            ctx.globalAlpha =
                Math.min(1, p.life / 22);

            ctx.translate(p.x, p.y);

            ctx.rotate(p.rotation);

            ctx.fillStyle = p.color;

            ctx.fillRect(
                -p.size / 2,
                -p.size / 2,
                p.size,
                p.size * 1.45
            );

            ctx.restore();

        });

        frame++;

        if (frame < 100) {

            fireworksFrame =
                requestAnimationFrame(draw);

        } else {

            ctx.clearRect(
                0,
                0,
                innerWidth,
                innerHeight
            );

            canvas.style.display = "none";

            fireworksFrame = null;

        }

    }

    draw();

}

/* شروع دوباره */

function restartGame() {

    if (fireworksFrame) {

        cancelAnimationFrame(fireworksFrame);

        fireworksFrame = null;

    }

    $("fireworksCanvas").style.display = "none";

    celebratedStages.clear();

    $("finish").classList.add("hidden");

    $("welcome").classList.remove("hidden");

    $("studentName").value = "";

}

/* اتصال دکمه‌ها */

$("startButton").addEventListener(
    "click",
    startGame
);

$("studentName").addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            startGame();
        }

    }
);

$("prevButton").addEventListener(
    "click",
    previousStage
);

$("nextButton").addEventListener(
    "click",
    nextStage
);

$("checkButton").addEventListener(
    "click",
    checkAnswers
);

$("eraserButton").addEventListener(
    "click",
    toggleEraser
);

$("exitButton").addEventListener(
    "click",
    exitGame
);

$("restartButton").addEventListener(
    "click",
    restartGame
);

/* وضعیت اولیه */

$("welcome").classList.remove("hidden");

$("game").classList.add("hidden");

$("finish").classList.add("hidden");
