// ==========================
// Baer vs Gravity - Flappy Bird JS (Rotated Pipes + Accurate Collision)
// ==========================

let currentScreen = "difficulty";
let difficulty = "easy";
let selectedCharacter = "bird1";
let theme = "morning";
let isMuted = false;
let score = 0;
let gravity = 0.4;
let bird = null;
let gameInterval;
let gameRunning = false;
let inputBound = false;

// DOM references
const screens = document.querySelectorAll(".game-screen");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");
const characterButtons = document.querySelectorAll(".character-btn");
const themeButtons = document.querySelectorAll(".theme-btn");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score");
const gameArea = document.getElementById("game-area");
const restartBtn = document.getElementById("restart-btn");
const muteBtn = document.getElementById("mute-btn");
const winMessage = document.getElementById("win-message");

// ==========================
// SOUNDS
// ==========================
const bgMusic = new Audio("assets/audio/Angry Birds Theme Song.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.4;

const tapSound = new Audio("assets/audio/A.mp3");
tapSound.volume = 0.7;

const dieSound = new Audio("assets/audio/dead.mp3");
dieSound.volume = 0.8;

// ==========================
// GAME OVER POPUP
// ==========================
const popup = document.createElement("div");
popup.id = "game-over-popup";
popup.innerHTML = `
  <div class="popup-content">
    <h2>Game Over 💀</h2>
    <p>Your final score: <span id="final-score">0</span></p>
    <button id="popup-restart" class="btn">Restart</button>
    <button id="popup-home" class="btn">Back to Home</button>
  </div>
`;
document.body.appendChild(popup);
Object.assign(popup.style, {
  display: "none",
  position: "fixed",
  left: "0",
  top: "0",
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.5)",
});

// ==========================
// SCREEN NAVIGATION
// ==========================
function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id + "-screen");
  if (target) target.classList.add("active");
  currentScreen = id;

  const nav = document.getElementById("nav-controls");
  nav.style.display = id === "gameplay" ? "none" : "block";
}

difficultyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    difficulty = btn.dataset.difficulty;
    showScreen("character");
  });
});

characterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedCharacter = btn.dataset.character;
    showScreen("theme");
  });
});

themeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    theme = btn.dataset.theme;
    document.body.className = "game theme-" + theme;
    showScreen("gameplay");
    startGame();
  });
});

if (backBtn)
  backBtn.addEventListener("click", () => {
    if (currentScreen === "difficulty") {
      window.location.href = "index.html";
    } else if (currentScreen === "character") {
      showScreen("difficulty");
    } else if (currentScreen === "theme") {
      showScreen("character");
    }
  });

if (nextBtn)
  nextBtn.addEventListener("click", () => {
    if (currentScreen === "difficulty") showScreen("character");
    else if (currentScreen === "character") showScreen("theme");
  });

// ==========================
// INPUT (Flap)
// ==========================
function flapHandler(e) {
  if (!gameRunning) return;
  if (e.type === "keydown") {
    const key = e.key;
    if (![" ", "ArrowUp", "w", "W"].includes(key)) return;
  }
  document.dispatchEvent(new CustomEvent("game-flap"));
}

if (!inputBound) {
  document.addEventListener("keydown", flapHandler);
  document.addEventListener("click", flapHandler);
  inputBound = true;
}

// ==========================
// GAME LOGIC
// ==========================
function startGame() {
  if (gameInterval) clearInterval(gameInterval);
  gameArea.innerHTML = "";
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  winMessage.style.display = "none";
  popup.style.display = "none";
  gameRunning = true;

  if (!isMuted) {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
  }

  // Bird setup
  bird = document.createElement("img");
  bird.src = `assets/images/${selectedCharacter}.png`;
  bird.classList.add("bird");
  const birdSize = 45;
  Object.assign(bird.style, {
    position: "absolute",
    left: "100px",
    top: "200px",
    width: `${birdSize}px`,
    height: `${birdSize}px`,
  });
  gameArea.appendChild(bird);

  // Difficulty settings
  const pipeGap = difficulty === "easy" ? 180 : difficulty === "medium" ? 150 : 130;
  const pipeSpeed = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 4;
  gravity = difficulty === "easy" ? 0.4 : difficulty === "medium" ? 0.5 : 0.6;

  let velocity = 0;
  let birdY = 200;
  let pipes = [];
  let pipeSpawnTimer = 0;

  function onFlap() {
    if (!gameRunning) return;
    velocity = -7;
    if (!isMuted) {
      tapSound.currentTime = 0;
      tapSound.play().catch(() => {});
    }
  }

  document.removeEventListener("game-flap", onFlap);
  document.addEventListener("game-flap", onFlap);

  // ==========================
  // CREATE PIPE (Rotated Top + Accurate Collision)
  // ==========================
  function createPipe(gapHeight, pipesArray) {
    const areaHeight = gameArea.clientHeight || 400;
    const areaWidth = gameArea.clientWidth || 700;
    const minGapY = 80;
    const maxGapY = areaHeight - gapHeight - 80;
    const gapY = Math.floor(Math.random() * (Math.max(maxGapY - minGapY, 1))) + minGapY;
    const startX = areaWidth + 50;
    const pipeWidth = 60;

    // Top pipe (rotated upside down)
    const pipeTop = document.createElement("img");
    pipeTop.src = "assets/images/pipe.png";
    Object.assign(pipeTop.style, {
      position: "absolute",
      left: `${startX}px`,
      bottom: `${areaHeight - gapY}px`,
      width: `${pipeWidth}px`,
      height: `${gapY}px`,
      transform: "rotate(180deg)",
      transformOrigin: "center",
      objectFit: "fill",
    });

    // Bottom pipe (normal)
    const pipeBottom = document.createElement("img");
    pipeBottom.src = "assets/images/pipe.png";
    Object.assign(pipeBottom.style, {
      position: "absolute",
      left: `${startX}px`,
      top: `${gapY + gapHeight}px`,
      width: `${pipeWidth}px`,
      height: `${areaHeight - (gapY + gapHeight)}px`,
      objectFit: "fill",
    });

    gameArea.appendChild(pipeTop);
    gameArea.appendChild(pipeBottom);

    pipesArray.push({
      x: startX,
      width: pipeWidth,
      topElem: pipeTop,
      bottomElem: pipeBottom,
      passed: false,
    });
  }

  // ==========================
// Collision (Improved, tighter hit detection)
// ==========================
function checkCollision(birdElem, pipeElem) {
  if (!birdElem || !pipeElem) return false;

  const b = birdElem.getBoundingClientRect();
  const p = pipeElem.getBoundingClientRect();

  // Shrink the bird's box by a few pixels on each side
  const birdHitbox = {
    top: b.top + 6,
    bottom: b.bottom - 6,
    left: b.left + 6,
    right: b.right - 6
  };

  // Shrink the pipe's box inward a bit to avoid invisible edges
  const pipeHitbox = {
    top: p.top + 2,
    bottom: p.bottom - 2,
    left: p.left + 8,
    right: p.right - 8
  };

  return !(
    birdHitbox.bottom < pipeHitbox.top ||
    birdHitbox.top > pipeHitbox.bottom ||
    birdHitbox.right < pipeHitbox.left ||
    birdHitbox.left > pipeHitbox.right
  );
}

  // ==========================
  // GAME LOOP
  // ==========================
  gameInterval = setInterval(() => {
    if (!gameRunning) return;

    velocity += gravity;
    birdY += velocity;
    if (birdY < 0) birdY = 0;
    bird.style.top = birdY + "px";

    const birdBottom = birdY + birdSize;
    const areaHeight = gameArea.clientHeight || 400;
    if (birdBottom >= areaHeight) {
      endGame();
      return;
    }

    pipeSpawnTimer++;
    const spawnInterval = 90;
    if (pipeSpawnTimer > spawnInterval) {
      pipeSpawnTimer = 0;
      createPipe(pipeGap, pipes);
    }

    pipes.forEach(pipe => {
      pipe.x -= pipeSpeed;
      pipe.topElem.style.left = pipe.x + "px";
      pipe.bottomElem.style.left = pipe.x + "px";

      if (!pipe.passed && pipe.x + pipe.width < 100) {
        pipe.passed = true;
        score++;
        scoreDisplay.textContent = "Score: " + score;
      }

      // Only end if actual pipe hit
      if (checkCollision(bird, pipe.topElem) || checkCollision(bird, pipe.bottomElem)) {
        endGame();
      }
    });

    pipes = pipes.filter(pipe => {
      if (pipe.x > -100) return true;
      pipe.topElem.remove();
      pipe.bottomElem.remove();
      return false;
    });
  }, 20);
}

// ==========================
// GAME OVER
// ==========================
function endGame() {
  if (!gameRunning) return;
  gameRunning = false;
  clearInterval(gameInterval);
  if (!isMuted) {
    dieSound.currentTime = 0;
    dieSound.play().catch(() => {});
  }
  bgMusic.pause();
  document.getElementById("final-score").textContent = score;
  popup.style.display = "flex";
}

// ==========================
// POPUP BUTTONS
// ==========================
document.addEventListener("click", e => {
  if (e.target.id === "popup-restart") {
    popup.style.display = "none";
    showScreen("gameplay");
    startGame();
  }
  if (e.target.id === "popup-home") {
    popup.style.display = "none";
    window.location.href = "index.html";
  }
});

if (restartBtn)
  restartBtn.addEventListener("click", () => {
    showScreen("gameplay");
    startGame();
  });

if (muteBtn)
  muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? "Unmute" : "Mute";
    if (isMuted) bgMusic.pause();
    else bgMusic.play().catch(() => {});
  });
