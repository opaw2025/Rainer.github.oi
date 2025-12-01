
let playerHP, maxPlayerHP, enemyHP, maxEnemyHP;
let playerLevel = 1, playerXP = 0, score = 0;
let difficulty = 'Easy';
let healCooldown = false;
let playerTurn = true;
let currentLevel = 1;
let enemiesDefeated = 0;
let enemiesPerLevel = 3;

const playerSprite = document.getElementById('playerSprite');
const enemySprite = document.getElementById('enemySprite');
const playerHitSound = document.getElementById('playerHitSound');
const enemyHitSound = document.getElementById('enemyHitSound');
const defeatSound = document.getElementById('defeatSound');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}


function playSound(sound) {
  sound.currentTime = 0; // restart if already playing
  sound.play();
}

function showPage(pageId) {
  document.querySelectorAll('.container').forEach(c => c.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function startGame(selectedDifficulty) {
  difficulty = selectedDifficulty;
  playerLevel = 1;
  playerXP = 0;
  score = 0;
  maxPlayerHP = 100;
  playerHP = maxPlayerHP;
  currentLevel = 1;
  enemiesDefeated = 0;
  spawnEnemy();
  document.getElementById('difficultyLabel').textContent = "Difficulty: " + difficulty;
  updateUI();
  showPage('game');
}

function spawnEnemy() {
  if (enemiesDefeated >= enemiesPerLevel) {
    handleLevelComplete();
    return;
  }

  const baseHP = difficulty === 'Easy' ? 60 : difficulty === 'Medium' ? 100 : 150;
  const levelScaling = (currentLevel - 1) * 15;
  maxEnemyHP = baseHP + playerLevel * 10 + levelScaling;
  enemyHP = maxEnemyHP;
  document.getElementById('statusText').textContent = `Level ${currentLevel} - Enemy ${enemiesDefeated + 1}/${enemiesPerLevel} approaches! ⚔️`;
  playerTurn = true;
  enableButtons(true);
  updateHPBars();
}

function animateSprite(sprite) {
  sprite.classList.add('animate');
  setTimeout(() => sprite.classList.remove('animate'), 300);
}

function attack() {
  if (!playerTurn) return;
  playerTurn = false;
  enableButtons(false);
  animateSprite(playerSprite);

  const playerDamage = Math.floor(Math.random() * 15) + 10 + playerLevel * 2;

  enemyHP -= playerDamage;
playSound(enemyHitSound); // 👈 Play enemy hit sound
  updateHPBars();

  document.getElementById('statusText').textContent = `You attacked and dealt ${playerDamage} damage!`;

  if (enemyHP <= 0) {
    handleVictory();
  } else {
    setTimeout(enemyTurn, 1000);
  }
}

function defend() {
  if (!playerTurn) return;
  playerTurn = false;
  enableButtons(false);
  animateSprite(playerSprite);

  document.getElementById('statusText').textContent = "You brace for impact and reduce incoming damage!";
  setTimeout(() => enemyTurn(true), 1000);
}

function heal() {
  if (!playerTurn) return;
  if (healCooldown) {
    document.getElementById('statusText').textContent = "⏳ You need to wait before healing again!";
    return;
  }

  playerTurn = false;
  enableButtons(false);
  healCooldown = true;
  document.getElementById('healBtn').disabled = true;
  animateSprite(playerSprite);

  const healAmount = difficulty === 'Easy' ? 30 : difficulty === 'Medium' ? 20 : 15;
  playerHP += healAmount;
  if (playerHP > maxPlayerHP) playerHP = maxPlayerHP;
  updateHPBars();

  document.getElementById('statusText').textContent = `You healed for ${healAmount} HP! 💖`;

  setTimeout(() => {
    healCooldown = false;
    document.getElementById('healBtn').disabled = false;
  }, 5000);

  setTimeout(enemyTurn, 1000);
}

function enemyTurn(defended = false) {
  animateSprite(enemySprite);

  let baseDamage = Math.floor(Math.random() * 10) + (difficulty === 'Hard' ? 20 : difficulty === 'Medium' ? 15 : 10);
  if (defended) baseDamage = Math.floor(baseDamage / 2);

  playerHP -= baseDamage;
  playSound(playerHitSound);
  updateHPBars();

  if (playerHP <= 0) {
    document.getElementById('statusText').textContent = `Enemy attacked and dealt ${baseDamage} damage. You were defeated 💀`;
    setTimeout(endGame, 1500);
  } else {
    document.getElementById('statusText').textContent = defended
      ? `Enemy attacked! You defended and took only ${baseDamage} damage!`
      : `Enemy attacked and dealt ${baseDamage} damage!`;

    playerTurn = true;
    enableButtons(true);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function handleVictory() {
  enemiesDefeated++;
  score += 10;
  playerXP += 20;
  playSound(victorySound); // 🔊 Play victory sound here
  document.getElementById('statusText').textContent = `Enemy defeated! (${enemiesDefeated}/${enemiesPerLevel}) You gained 20 XP!`;
  checkLevelUp();

  if (enemiesDefeated >= enemiesPerLevel) {
    setTimeout(handleLevelComplete, 1200);
  } else {
    setTimeout(spawnEnemy, 1500);
  }
}

function endGame() {
  playSound(defeatSound); // 🔊 Play defeat sound

  document.getElementById('statusText').textContent = `💀 You were defeated! Game Over!`;
  playerTurn = false;
  enableButtons(false);

  // Optional: fade out effect or short delay before showing alert
  setTimeout(() => {
    alert(`💀 Game Over!\nFinal Score: ${score}\nPlayer Level: ${playerLevel}\nHighest Stage: ${currentLevel}`);
    showPage('intro');
  }, 2000);
}



function checkLevelUp() {
  const xpNeeded = playerLevel * 50;
  if (playerXP >= xpNeeded) {
    playerXP -= xpNeeded;
    playerLevel++;
    maxPlayerHP += 20;
    playerHP = maxPlayerHP;
    document.getElementById('statusText').textContent = `⭐ Level Up! You are now level ${playerLevel}! 💪`;
  }
  updateUI();
}

function updateUI() {
  document.getElementById('playerLevel').textContent = playerLevel;
  document.getElementById('playerXP').textContent = playerXP;
  document.getElementById('scoreText').textContent = score;
  updateHPBars();
  const xpPercent = (playerXP / (playerLevel * 50)) * 100;
  document.getElementById('xpFill').style.width = xpPercent + "%";
}

function updateHPBars() {
  document.getElementById('playerHPFill').style.width = (playerHP / maxPlayerHP * 100) + "%";
  document.getElementById('enemyHPFill').style.width = (enemyHP / maxEnemyHP * 100) + "%";
}

function enableButtons(state) {
  document.querySelectorAll('#game button:not(#healBtn)').forEach(btn => {
    if (btn.textContent !== 'Quit') btn.disabled = !state;
  });
}

function endGame() {
  alert(`💀 Game Over!\nFinal Score: ${score}\nPlayer Level: ${playerLevel}\nHighest Stage: ${currentLevel}`);
  showPage('intro');
}
