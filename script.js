document.addEventListener("DOMContentLoaded", () => {

  const startScreen = document.getElementById("startScreen");
  const gameScreen = document.getElementById("gameScreen");
  const finishScreen = document.getElementById("finishScreen");

  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const checkBtn = document.getElementById("checkBtn");
  const nextBtn = document.getElementById("nextBtn");

  const studentNameInput = document.getElementById("studentName");
  const stageText = document.getElementById("stageText");
  const scoreText = document.getElementById("scoreText");
  const instruction = document.getElementById("instruction");

  const mainArea = document.getElementById("mainArea");
  const repeatArea = document.getElementById("repeatArea");
  const palette = document.getElementById("palette");
  const message = document.getElementById("message");

  const finalMessage = document.getElementById("finalMessage");
  const finalScore = document.getElementById("finalScore");
  const fireworks = document.getElementById("fireworks");

  let currentStage = 0;
  let score = 0;
  let studentName = "";
  let audioContext = null;

  const completedStages = new Set();

  const colors = {
    green: "#58c86b",
    blue: "#42a5f5",
    yellow: "#ffd84d",
    red: "#ef5350",
    pink: "#ff73ad",
    purple: "#9c64e8"
  };

  const shapes = {
    circle: "●",
    triangle: "▲",
    square: "■",
    star: "★",
    heart: "♥"
  };

  const stages = [

    {
      type: "color",
      pattern: ["green", "green", "red"],
      totalCells: 15,
      readyCells: 6
    },

    {
      type: "color",
      pattern: ["blue", "yellow"],
      totalCells: 14,
      readyCells: 6
    },

    {
      type: "color",
      pattern: ["green", "red", "red"],
      totalCells: 15,
      readyCells: 6
    },

    {
      type: "color",
      pattern: ["yellow", "blue", "green"],
      totalCells: 15,
      readyCells: 6
    },

    {
      type: "color",
      pattern: ["red", "red", "yellow"],
      totalCells: 15,
      readyCells: 6
    },

    {
      type: "color",
      pattern: ["green", "blue", "blue"],
      totalCells: 15,
      readyCells: 6
    },

    {
      type: "color",
      pattern: ["pink", "pink", "yellow"],
      totalCells: 15,
      readyCells: 6
    },

    {
      type: "shape",
      pattern: ["circle", "circle", "triangle"],
      totalCells: 15,
      readyCells: 6,
      shapeColors: {
        circle: "#42a5f5",
        triangle: "#ef5350"
      }
    },

    {
      type: "remove",
      pattern: ["circle", "circle", "square", "triangle", "circle", "circle", "square"],
      answer: 3
    },

    {
      type: "shape",
      pattern: ["star", "star", "heart"],
      totalCells: 12,
      readyCells: 6,
      shapeColors: {
        star: "#ffd84d",
        heart: "#ff73ad"
      }
    },

    {
      type: "remove",
      pattern: [
        "triangle",
        "triangle",
        "circle",
        "triangle",
        "square",
        "triangle",
        "circle",
        "triangle",
        "triangle",
        "circle"
      ],
      answer: 4
    },

    {
      type: "combinedChecker",
      rows: [
        ["green", "white"],
        ["white", "green", "white", "red"],
        ["green", "white"]
      ]
    }

  ];


  function initAudio() {
    try {
      if (!audioContext) {
        const AudioCtx =
          window.AudioContext ||
          window.webkitAudioContext;

        if (AudioCtx) {
          audioContext = new AudioCtx();
        }
      }

      if (
        audioContext &&
        audioContext.state === "suspended"
      ) {
        audioContext.resume().catch(() => {});
      }

    } catch (error) {
      console.log("Audio unavailable");
    }
  }


  function playTone(frequency, duration, type = "sine") {

    try {

      if (!audioContext) return;

      const oscillator =
        audioContext.createOscillator();

      const gain =
        audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(
        0.08,
        audioContext.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();

      oscillator.stop(
        audioContext.currentTime + duration
      );

    } catch (e) {}
  }


  function playClickSound() {
    playTone(330, .08, "sine");
  }


  function playCorrectSound() {
    playTone(523, .12, "sine");

    setTimeout(() => {
      playTone(659, .12, "sine");
    }, 100);
  }


  function playWrongSound() {
    playTone(180, .18, "square");
  }


  function updateScore() {
    scoreText.textContent =
      `امتیاز: ${score}`;
  }


  function clearAreas() {
    mainArea.innerHTML = "";
    repeatArea.innerHTML = "";
    palette.innerHTML = "";
    message.textContent = "";

    checkBtn.classList.remove("hidden");
    nextBtn.classList.add("hidden");
  }


  function createColorCell(color, blank = false) {

    const cell =
      document.createElement("div");

    cell.className = "cell";

    if (blank) {
      cell.classList.add("blank");
    } else {
      cell.classList.add(color);
    }

    return cell;
  }


  function createShapeCell(shape, color, blank = false) {

    const cell =
      document.createElement("div");

    cell.className = "cell shape-cell";

    if (!blank) {

      const span =
        document.createElement("span");

      span.className = "shape";
      span.textContent = shapes[shape];

      span.style.color =
        color || "#7438c8";

      cell.appendChild(span);
    }

    return cell;
  }


  function makeGrid(count, columns) {

    const grid =
      document.createElement("div");

    grid.className = "pattern-grid";

    grid.style.gridTemplateColumns =
      `repeat(${columns}, 1fr)`;

    return grid;
  }


  function createMainColorGrid(stage) {

    const grid =
      makeGrid(stage.totalCells, Math.min(stage.totalCells, 15));

    const values = [];

    for (let i = 0; i < stage.totalCells; i++) {

      if (i < stage.readyCells) {
        values.push(
          stage.pattern[i % stage.pattern.length]
        );
      } else {
        values.push(null);
      }
    }

    values.forEach(value => {

      const cell =
        createColorCell(value, !value);

      grid.appendChild(cell);
    });

    mainArea.appendChild(grid);
  }


  function createShapeMainGrid(stage) {

    const grid =
      makeGrid(
        stage.totalCells,
        Math.min(stage.totalCells, 15)
      );

    for (let i = 0; i < stage.totalCells; i++) {

      if (i < stage.readyCells) {

        const shape =
          stage.pattern[i % stage.pattern.length];

        const color =
          stage.shapeColors[shape];

        grid.appendChild(
          createShapeCell(shape, color)
        );

      } else {

        grid.appendChild(
          createShapeCell(null, null, true)
        );
      }
    }

    mainArea.appendChild(grid);
  }


  function createPalette(stage) {

    palette.innerHTML = "";

    if (stage.type === "color") {

      [...new Set(stage.pattern)].forEach(color => {

        const btn =
          document.createElement("button");

        btn.className = "palette-btn";
        btn.style.background = colors[color];
        btn.setAttribute("data-value", color);

        btn.addEventListener("click", () => {
          playClickSound();
          selectNextBlank(color);
        });

        palette.appendChild(btn);
      });
    }

    if (stage.type === "shape") {

      [...new Set(stage.pattern)].forEach(shape => {

        const btn =
          document.createElement("button");

        btn.className = "palette-btn";
        btn.textContent = shapes[shape];

        btn.style.color =
          stage.shapeColors[shape];

        btn.setAttribute("data-value", shape);

        btn.addEventListener("click", () => {
          playClickSound();
          selectNextBlank(shape);
        });

        palette.appendChild(btn);
      });
    }
  }


  function selectNextBlank(value) {

    const blanks =
      mainArea.querySelectorAll(".blank");

    if (!blanks.length) return;

    const blank =
      blanks[0];

    blank.classList.remove("blank");

    if (stages[currentStage].type === "color") {

      blank.classList.add(value);

      blank.dataset.value = value;

    } else {

      const stage =
        stages[currentStage];

      const span =
        document.createElement("span");

      span.className = "shape";
      span.textContent = shapes[value];
      span.style.color =
        stage.shapeColors[value];

      blank.classList.add("shape-cell");
      blank.appendChild(span);
      blank.dataset.value = value;
    }
  }


  function createRepeatGrid(stage) {

    const grid =
      document.createElement("div");

    grid.className = "repeat-grid";

    const columns =
      stage.pattern.length;

    grid.style.gridTemplateColumns =
      `repeat(${columns}, 1fr)`;

    stage.pattern.forEach(item => {

      if (stage.type === "color") {

        grid.appendChild(
          createColorCell(item)
        );

      } else {

        grid.appendChild(
          createShapeCell(
            item,
            stage.shapeColors[item]
          )
        );
      }

    });

    repeatArea.appendChild(grid);
  }


  function renderColorOrShape(stage) {

    createPalette(stage);

    if (stage.type === "color") {
      createMainColorGrid(stage);
    } else {
      createShapeMainGrid(stage);
    }

    createRepeatGrid(stage);
  }


  function renderRemoveStage(stage) {

    instruction.textContent =
      "شکلِ اشتباه را پیدا کن و روی آن بزن.";

    const grid =
      makeGrid(
        stage.pattern.length,
        stage.pattern.length
      );

    stage.pattern.forEach((shape, index) => {

      const cell =
        createShapeCell(
          shape,
          shape === "triangle"
            ? "#42a5f5"
            : shape === "circle"
              ? "#42a5f5"
              : shape === "square"
                ? "#ffd84d"
                : "#7438c8"
        );

      cell.dataset.index = index;

      cell.addEventListener("click", () => {

        playClickSound();

        if (index === stage.answer) {

          if (completedStages.has(currentStage)) return;

          completedStages.add(currentStage);
          score++;

          cell.style.opacity = "0.25";

          message.textContent =
            "آفرین! شکلِ اشتباه را پیدا کردی 🌟";

          message.className =
            "message correct";

          playCorrectSound();

          checkBtn.classList.add("hidden");
          nextBtn.classList.remove("hidden");

          updateScore();

        } else {

          message.textContent =
            "دوباره با دقت به الگو نگاه کن 🌸";

          message.className =
            "message wrong";

          playWrongSound();
        }
      });

      grid.appendChild(cell);
    });

    mainArea.appendChild(grid);
    checkBtn.classList.add("hidden");
    repeatArea.innerHTML = "";
    palette.innerHTML = "";
  }


  function renderStage12(stage) {

    instruction.textContent =
      "الگو را پیدا کن و سپس ادامه بده.";

    const wrapper =
      document.createElement("div");

    wrapper.className = "pattern-grid";

    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";

    stage.rows.forEach(row => {

      const rowDiv =
        document.createElement("div");

      rowDiv.style.display = "grid";
      rowDiv.style.gridTemplateColumns =
        `repeat(${row.length}, 1fr)`;

      row.forEach(value => {

        const cell =
          createColorCell(
            value,
            value === "white"
          );

        rowDiv.appendChild(cell);
      });

      wrapper.appendChild(rowDiv);
    });

    mainArea.appendChild(wrapper);

    palette.innerHTML = "";

    ["green", "red"].forEach(color => {

      const btn =
        document.createElement("button");

      btn.className = "palette-btn";
      btn.style.background =
        colors[color];

      btn.addEventListener("click", () => {

        playClickSound();

        const blank =
          mainArea.querySelector(".blank");

        if (!blank) return;

        blank.classList.remove("blank");
        blank.classList.add(color);
        blank.dataset.value = color;
      });

      palette.appendChild(btn);
    });

    repeatArea.innerHTML = "";

    checkBtn.textContent =
      "بررسی پاسخ ✅";
  }


  function renderStage() {

    clearAreas();

    const stage =
      stages[currentStage];

    stageText.textContent =
      `مرحله ${currentStage + 1} از ۱۲`;

    instruction.textContent =
      "ابتدا الگو را پیدا کن و سپس ادامه بده.";

    if (
      stage.type === "color" ||
      stage.type === "shape"
    ) {

      renderColorOrShape(stage);

    } else if (
      stage.type === "remove"
    ) {

      renderRemoveStage(stage);

    } else if (
      stage.type === "combinedChecker"
    ) {

      renderStage12(stage);
    }
  }


  function checkColorOrShape() {

    const stage =
      stages[currentStage];

    const blanks =
      mainArea.querySelectorAll(".blank");

    if (blanks.length) {

      message.textContent =
        "هنوز همه خانه‌ها را کامل نکرده‌ای 🌸";

      message.className =
        "message wrong";

      playWrongSound();
      return;
    }

    const cells =
      mainArea.querySelectorAll(".cell");

    let correct = true;

    cells.forEach((cell, index) => {

      const expected =
        stage.pattern[
          index % stage.pattern.length
        ];

      if (stage.type === "color") {

        const actual =
          [...cell.classList].find(
            c => colors[c]
          );

        if (actual !== expected) {
          correct = false;
        }

      } else {

        const span =
          cell.querySelector(".shape");

        const actualShape =
          span
            ? Object.keys(shapes)
                .find(
                  key => shapes[key] === span.textContent
                )
            : null;

        if (actualShape !== expected) {
          correct = false;
        }
      }
    });

    if (correct) {

      if (!completedStages.has(currentStage)) {
        completedStages.add(currentStage);
        score++;
      }

      message.textContent =
        "آفرین! پاسخ کاملاً درست است 🌟";

      message.className =
        "message correct";

      playCorrectSound();

      checkBtn.classList.add("hidden");
      nextBtn.classList.remove("hidden");

      updateScore();

    } else {

      message.textContent =
        "پاسخ اشتباه است؛ دوباره الگو را با دقت نگاه کن 🌸";

      message.className =
        "message wrong";

      playWrongSound();
    }
  }


  function checkStage12() {

    const blanks =
      mainArea.querySelectorAll(".blank");

    if (blanks.length) {

      message.textContent =
        "هنوز پاسخ کامل نشده است 🌸";

      message.className =
        "message wrong";

      playWrongSound();
      return;
    }

    const cells =
      mainArea.querySelectorAll(".cell");

    let correct = true;

    cells.forEach(cell => {

      if (!cell.dataset.value) return;

      const value =
        cell.dataset.value;

      if (
        value !== "green" &&
        value !== "red"
      ) {
        correct = false;
      }
    });

    if (correct) {

      if (!completedStages.has(currentStage)) {
        completedStages.add(currentStage);
        score++;
      }

      message.textContent =
        "آفرین! الگوی شطرنجی را پیدا کردی 🎉";

      message.className =
        "message correct";

      playCorrectSound();

      checkBtn.classList.add("hidden");
      nextBtn.classList.remove("hidden");

      updateScore();

    } else {

      message.textContent =
        "دوباره با دقت به الگو نگاه کن 🌸";

      message.className =
        "message wrong";

      playWrongSound();
    }
  }


  checkBtn.addEventListener("click", () => {

    initAudio();

    const stage =
      stages[currentStage];

    if (
      stage.type === "color" ||
      stage.type === "shape"
    ) {

      checkColorOrShape();

    } else if (
      stage.type === "combinedChecker"
    ) {

      checkStage12();
    }
  });


  nextBtn.addEventListener("click", () => {

    playClickSound();

    currentStage++;

    if (currentStage >= stages.length) {
      finishGame();
      return;
    }

    renderStage();
  });


  function finishGame() {

    gameScreen.classList.add("hidden");
    finishScreen.classList.remove("hidden");

    finalScore.textContent =
      `${studentName} عزیز، امتیاز تو ${score} از ۱۲ شد! 🌟`;

    if (score >= 9) {

      finalMessage.textContent =
        "فوق‌العاده بود! تو قهرمان الگوها هستی! 🏆🎉";

      startFireworks();

    } else if (score >= 6) {

      finalMessage.textContent =
        "آفرین! خیلی خوب تلاش کردی 🌸";

    } else {

      finalMessage.textContent =
        "آفرین که تا پایان ادامه دادی! دوباره تمرین کن 🌈";
    }
  }


  function startFireworks() {

    fireworks.innerHTML = "";

    const symbols =
      ["🎉", "✨", "🌟", "🎊", "💜"];

    for (let i = 0; i < 45; i++) {

      const item =
        document.createElement("div");

      item.className = "firework";

      item.textContent =
        symbols[
          Math.floor(
            Math.random() * symbols.length
          )
        ];

      item.style.left =
        Math.random() * 100 + "%";

      item.style.top =
        Math.random() * 100 + "%";

      item.style.setProperty(
        "--x",
        ((Math.random() * 2 - 1) * 180) + "px"
      );

      item.style.setProperty(
        "--y",
        ((Math.random() * 2 - 1) * 180) + "px"
      );

      item.style.animationDelay =
        Math.random() * .8 + "s";

      fireworks.appendChild(item);
    }

    setTimeout(() => {
      fireworks.innerHTML = "";
    }, 3000);
  }


  startBtn.addEventListener("click", () => {

    studentName =
      studentNameInput
        ? studentNameInput.value.trim()
        : "";

    if (!studentName) {
      studentName = "شکوفه‌ی عزیز";
    }

    currentStage = 0;
    score = 0;

    completedStages.clear();

    startScreen.classList.add("hidden");
    finishScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    updateScore();
    renderStage();

    initAudio();

    setTimeout(() => {
      playClickSound();
    }, 80);
  });


  restartBtn.addEventListener("click", () => {

    fireworks.innerHTML = "";

    finishScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");

    studentNameInput.value = "";
  });


});
