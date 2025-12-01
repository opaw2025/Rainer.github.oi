// Show welcome screen by default
document.getElementById("welcome").style.display = "flex";

// === Background Music Setup ===
let backgroundMusic;
function initBackgroundMusic() {
  if (!backgroundMusic) {
    backgroundMusic = new Audio('assets/audio/1.m4a');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;
  }
}

function showMenu() {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("menu").style.display = "flex";
  document.getElementById("gameOver").style.display = "none";
  document.querySelector(".center-container").style.display = "none";
}

function showWelcome() {
  document.getElementById("welcome").style.display = "flex";
  document.getElementById("menu").style.display = "none";
  document.getElementById("gameOver").style.display = "none";
  document.querySelector(".center-container").style.display = "block";
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let basket = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 300,
  height: 100,
  moveSpeed: 10,
  color: 'brown'
};

const basketImage = new Image();
basketImage.src = 'assets/images/basket.png';

let fruits = [];
let fruitCount = 3;
let fruitSpeed = 4;
let score = 0;
let lives = 5;
let gameRunning = false;

let keys = { left: false, right: false };

const fruitImageNames = [
  'avocado.png', 'fruit2.png', 'fruit3.png', 'fruit4.png', 'fruit5.png',
  'fruit6.png', 'fruit7.png', 'fruit8.png', 'fruit9.png', 'fruit10.png',
  'fruit11.png', 'fruit12.png',
];
const loadedImages = {};

function preloadImages(callback) {
  let imagesToLoad = fruitImageNames.length;
  fruitImageNames.forEach(name => {
    const img = new Image();
    img.src = 'assets/images/' + name;
    img.onload = () => {
      loadedImages[name] = img;
      imagesToLoad--;
      if (imagesToLoad === 0) callback();
    };
    img.onerror = () => {
      console.error("Failed to load image:", name);
      imagesToLoad--;
      if (imagesToLoad === 0) callback();
    };
  });
}

function createFruits() {
  fruits = [];
  for (let i = 0; i < fruitCount; i++) {
    const randomName = fruitImageNames[Math.floor(Math.random() * fruitImageNames.length)];
    fruits.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      radius: 25,
      speed: fruitSpeed,
      imageName: randomName
    });
  }
}

function drawBasket() {
  if (basketImage.complete && basketImage.naturalWidth !== 0) {
    ctx.drawImage(basketImage, basket.x, basket.y, basket.width, basket.height);
  } else {
    ctx.fillStyle = basket.color;
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
  }
}

function drawFruits() {
  for (let fruit of fruits) {
    const image = loadedImages[fruit.imageName];
    if (image) {
      ctx.drawImage(
        image,
        fruit.x - fruit.radius,
        fruit.y - fruit.radius,
        fruit.radius * 2,
        fruit.radius * 2
      );
    }
  }
}

function updateFruits() {
  for (let i = 0; i < fruits.length; i++) {
    const fruit = fruits[i];
    fruit.y += fruit.speed;

    if (
      fruit.y + fruit.radius >= basket.y &&
      fruit.x >= basket.x &&
      fruit.x <= basket.x + basket.width
    ) {
      score++;
      resetFruit(fruit);
    } else if (fruit.y > canvas.height) {
      lives--;
      if (lives <= 0) {
        gameOver();
        return;
      } else {
        resetFruit(fruit);
      }
    }
  }
}

function resetFruit(fruit) {
  fruit.x = Math.random() * canvas.width;
  fruit.y = 0;
  fruit.imageName = fruitImageNames[Math.floor(Math.random() * fruitImageNames.length)];
}

function drawScoreAndLives() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center"; // Center text horizontally
  ctx.textBaseline = "top"; // Align text to top

  // Center position
  const centerX = canvas.width / 2;
  const topY = 20;

  // Draw both Score and Lives in one line
  ctx.fillText(`Score: ${score}   |   Lives: ${lives}`, centerX, topY);
}


function updateBasket() {
  if (keys.left && basket.x > 0) basket.x -= basket.moveSpeed;
  if (keys.right && basket.x + basket.width < canvas.width) basket.x += basket.moveSpeed;
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBasket();
  drawBasket();
  drawFruits();
  updateFruits();
  drawScoreAndLives();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});

function startGame(difficulty) {
  document.getElementById("menu").style.display = "none";
  document.getElementById("gameOver").style.display = "none";
  document.querySelector(".center-container").style.display = "none";

  gameRunning = true;
  score = 0;
  lives = 5;

  // Difficulty settings
  if (difficulty === "easy") {
    fruitSpeed = 3;
    fruitCount = 3;
    basket.width = 100;
    basket.moveSpeed = 27;
  } else if (difficulty === "medium") {
    fruitSpeed = 4;
    fruitCount = 3;
    basket.width = 110;
    basket.moveSpeed = 28;
  } else if (difficulty === "hard") {
    fruitSpeed = 5;
    fruitCount = 4;
    basket.width = 120;
    basket.moveSpeed = 29;
  } else if (difficulty === "extreme") {
    fruitSpeed = 7;
    fruitCount = 4;
    basket.width = 130;
    basket.moveSpeed = 30;
  }

  basket.x = canvas.width / 2 - basket.width / 2;

  preloadImages(() => {
    createFruits();
    gameLoop();
  });
}

function gameOver() {
  gameRunning = false;
  document.getElementById("finalScore").innerText = "Your Score: " + score;
  document.getElementById("gameOver").style.display = "flex";
  document.querySelector(".center-container").style.display = "block";
}

function restartGame() {
  document.getElementById("menu").style.display = "flex";
  document.getElementById("gameOver").style.display = "none";
  document.querySelector(".center-container").style.display = "block";
}

// Resize canvas and basket position on window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  basket.y = canvas.height - 100;
});

// === Mute / Unmute Button ===
document.addEventListener("DOMContentLoaded", () => {
  const muteButton = document.getElementById("muteButton");

  if (muteButton) {
    muteButton.addEventListener("click", () => {
      if (!backgroundMusic) return;
      backgroundMusic.muted = !backgroundMusic.muted;
      muteButton.textContent = backgroundMusic.muted ? "🔇 Unmute" : "🔊 Mute";
    });
  }

  // Attach event listeners to difficulty buttons for music init & play
  const difficulties = ["easy", "medium", "hard", "extreme"];
  difficulties.forEach(diff => {
    const btn = document.querySelector(`#menu button[onclick="startGame('${diff}')"]`);
    if (btn) {
      btn.addEventListener("click", (e) => {
        initBackgroundMusic();
        backgroundMusic.play().catch(() => {
          console.warn("Autoplay blocked. Music will play on user interaction.");
        });
        // Note: The original onclick attribute will still call startGame(), so no need to call here.
      });
    }
  });
});
