function startGame() {
    alert("Game started!");
    
  }
const music = document.getElementById('background-music');
music.volume = 0.5;
function playMusic() {
    music.play();
}
function startGame(seconds) {
    playMusic();
    resetGame();
    timeLeft = seconds;
    document.getElementById("timer").textContent = timeLeft;
    timerInterval = setInterval(updateTimer, 1000);
    createGameBoard();
}
function showSection(sectionId) {
    document.getElementById("home-section").classList.add("hidden");
    document.getElementById("game-section").classList.add("hidden");
    document.getElementById("about-section").classList.add("hidden");
    document.getElementById(sectionId).classList.remove("hidden");
}

let cards = [];
let flippedCards = [];
let matches = 0;
let timeLeft;
let timerInterval;

function startGame(seconds) {
    resetGame();
    timeLeft = seconds;
    document.getElementById("timer").textContent = timeLeft;
    timerInterval = setInterval(updateTimer, 1000);
    createGameBoard();
}

function updateTimer() {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame(false);
    }
}

function createGameBoard() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    matches = 0;
    flippedCards = [];
    const emojis = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🍍", "🥝"];
    cards = [...emojis, ...emojis];
    cards.sort(() => 0.5 - Math.random());
    cards.forEach((emoji, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.addEventListener("click", flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length === 2 || this.textContent) return;
    this.textContent = this.dataset.emoji;
    flippedCards.push(this);
    if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.emoji === card2.dataset.emoji) {
        matches++;
        flippedCards = [];
        if (matches === cards.length / 2) endGame(true);
    } else {
        setTimeout(() => {
            card1.textContent = "";
            card2.textContent = "";
            flippedCards = [];
        }, 800);
    }
}

function endGame(won) {
    clearInterval(timerInterval);
    document.getElementById("result-message").textContent = won ? "You win! 🎉" : "Time's up! Try again.";
}

function resetGame() {
    clearInterval(timerInterval);
    document.getElementById("result-message").textContent = "";
    document.getElementById("timer").textContent = "0";
    createGameBoard();
}

