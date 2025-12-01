/* ===========================================================
   MEMORY QUEST - FIXED LEADERBOARD (per-difficulty)
   - Saves leaderboards to localStorage as leaderboard_<mode>
   - Keeps top 5 scores (highest remaining time first)
   - Minor guards/validation added
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-board");
  const livesDisplay = document.getElementById("lives");
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const modal = document.getElementById("gameover-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalText = document.getElementById("modal-text");
  const muteBtn = document.getElementById("mute-btn");
  const restartBtn = document.getElementById("restart-btn");

  const bgMusic = document.getElementById("bg-music");
  const winSound = document.getElementById("win-sound");
  const loseSound = document.getElementById("lose-sound");

  let firstCard = null;
  let secondCard = null;
  let score = 0;
  let lives = 0;
  let pairs = 0;
  let matched = 0;
  let timeLeft = 150; // 2:30 minutes
  let timerInterval = null;
  let selectedMode = "";
  let playing = false;
  let muted = false;

  /* ==========================
     🧪 SCIENCE EMOJIS
  ========================== */
  const cardEmojis = [
    "⚗️", "🔬", "🧪", "🧬", "💡", "🔭", "🧲", "🔋", "🌡️", "💥",
    "🧠", "🌍", "💧", "🧫", "⚛️"
  ];

  /* ==========================
     🎯 DIFFICULTY SETTINGS
  ========================== */
  const difficultySettings = {
    easy:   { pairs: 8,  lives: 12 },
    medium: { pairs: 10, lives: 10 },
    hard:   { pairs: 12, lives: 10 }
  };

  /* ==========================
     🎮 START GAME
  ========================== */
  function startGame(mode) {
    selectedMode = mode || "easy";
    const config = difficultySettings[selectedMode] || difficultySettings.easy;
    pairs = config.pairs;
    lives = config.lives;
    matched = 0;
    score = 0;
    timeLeft = 150;
    board.innerHTML = "";
    playing = true;

    const difficultyScreen = document.getElementById("difficulty-screen");
    const gameUI = document.getElementById("game-ui");
    if (difficultyScreen) difficultyScreen.style.display = "none";
    if (gameUI) gameUI.style.display = "block";

    updateScore();
    updateLives();
    updateTimer();

    // Build and reveal deck briefly
    const chosen = cardEmojis.slice(0, pairs);
    const deck = [...chosen, ...chosen];
    deck.forEach(symbol => {
      const card = document.createElement("div");
      card.className = "card flipped";
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front"><span class="emoji">${symbol}</span></div>
          <div class="card-back"><span class="emoji-back">🧠</span></div>
        </div>`;
      board.appendChild(card);
    });

    setTimeout(() => {
      const scrambled = deck.sort(() => Math.random() - 0.5);
      board.innerHTML = "";
      scrambled.forEach(symbol => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="card-inner">
            <div class="card-front"><span class="emoji">${symbol}</span></div>
            <div class="card-back"><span class="emoji-back">🧠</span></div>
          </div>`;
        card.addEventListener("click", () => flipCard(card, symbol));
        board.appendChild(card);
      });
    }, 2000);

    // Timer countdown
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (playing) {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
          endGame(false, true);
        }
      }
    }, 1000);

    playBackgroundMusic();
  }

  /* ==========================
     🃏 FLIP CARD
  ========================== */
  function flipCard(card, symbol) {
    if (!playing || card.classList.contains("flipped") || secondCard) return;
    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      setTimeout(checkMatch, 600);
    }
  }

  function checkMatch() {
    const symbol1 = firstCard.querySelector(".card-front").textContent;
    const symbol2 = secondCard.querySelector(".card-front").textContent;

    if (symbol1 === symbol2) {
      score += 10;
      matched++;
      updateScore();
      firstCard.onclick = null;
      secondCard.onclick = null;
      resetTurn();

      if (matched === pairs) {
        endGame(true);
      }
    } else {
      lives--;
      updateLives();
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();
        if (lives <= 0) {
          endGame(false);
        }
      }, 700);
    }
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
  }

  /* ==========================
     🏁 END GAME
  ========================== */
  function endGame(won, timeout = false) {
    playing = false;
    clearInterval(timerInterval);
    if (modal) modal.style.display = "flex";

    if (won) {
      modalTitle.textContent = "🎉 You Win!";
      modalText.textContent = `You matched all ${pairs} pairs with ${timeLeft}s remaining!`;
      playWinSound();
      saveToLeaderboard(timeLeft);
    } else {
      modalTitle.textContent = timeout ? "⏰ Time’s Up!" : "💀 Game Over!";
      modalText.textContent = `Final Score: ${score}`;
      playLoseSound();
    }
  }

  /* ==========================
     🔁 RESTART BUTTON
  ========================== */
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      if (selectedMode) startGame(selectedMode);
    });
  }

  /* ==========================
     🔊 AUDIO
  ========================== */
  function playBackgroundMusic() {
    if (!bgMusic) return;
    if (!muted) {
      bgMusic.volume = 0.4;
      bgMusic.loop = true;
      bgMusic.currentTime = 0;
      bgMusic.play().catch(() => {});
    }
  }
  function playWinSound() {
    if (winSound && !muted) { winSound.currentTime = 0; winSound.play().catch(() => {}); }
  }
  function playLoseSound() {
    if (loseSound && !muted) { loseSound.currentTime = 0; loseSound.play().catch(() => {}); }
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      muted = !muted;
      if (muted) bgMusic && bgMusic.pause();
      else playBackgroundMusic();
      muteBtn.textContent = muted ? "🔈 Unmute" : "🔊 Mute";
    });
  }

  /* ==========================
     🧾 UI UPDATES
  ========================== */
  function updateLives() { livesDisplay.textContent = lives > 0 ? "❤️".repeat(lives) : ""; }
  function updateScore() { scoreDisplay.textContent = score; }
  function updateTimer() {
    const mins = Math.floor(timeLeft / 60);
    const secs = String(timeLeft % 60).padStart(2, "0");
    timerDisplay.textContent = `${mins}:${secs}`;
  }

  /* ==========================
     🧩 DIFFICULTY BUTTONS
  ========================== */
  document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      startGame(mode);
    });
  });

  document.addEventListener("click", e => {
    if (e.target.classList.contains("try-again")) {
      if (modal) modal.style.display = "none";
      startGame(selectedMode || "easy");
    }
    if (e.target.classList.contains("go-home")) {
      location.href = "index.html";
    }
  });

  /* ==========================
     🏆 LEADERBOARD SYSTEM (per difficulty)
  ========================== */
  function saveToLeaderboard(timeRemaining) {
    // ensure we have a mode
    const mode = selectedMode || "easy";
    const key = `leaderboard_${mode}`;

    let scores = [];
    try {
      scores = JSON.parse(localStorage.getItem(key)) || [];
      if (!Array.isArray(scores)) scores = [];
    } catch (err) {
      scores = [];
    }

    // push the new time (integer seconds)
    const t = Number(timeRemaining) || 0;
    scores.push(t);

    // sort descending (higher remaining time = better)
    scores.sort((a, b) => b - a);

    // keep top 5 only
    if (scores.length > 5) scores = scores.slice(0, 5);

    localStorage.setItem(key, JSON.stringify(scores));
  }
});