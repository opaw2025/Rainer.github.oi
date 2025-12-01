// Shared JavaScript for both game.html and ga.html

let hp = 100;
let correct = 0;
let damage = 10;
let qNum = 0;
let maxQ = 10;
let diff = "easy";
let time = 10;
let timer;

// ✅ Function used in game.html
function goToGame() {
  const selected = document.getElementById("difficulty").value;
  localStorage.setItem("selectedDifficulty", selected);
  window.location.href = "ga.html"; // move to game page
}

// ✅ Function used in ga.html
function startGame() {
  diff = localStorage.getItem("selectedDifficulty") || "easy";

  if (diff === "easy") damage = 10;
  else if (diff === "normal") damage = 20;
  else if (diff === "hard") damage = 33;

  hp = 100;
  qNum = 0;

  document.getElementById("hp").style.width = "100%";
  document.getElementById("game").style.display = "block";
  document.getElementById("answer").disabled = false;
  document.getElementById("message").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("backBtn").style.display = "none";

  newQuestion();
}

// ✅ Generate new math question
function newQuestion() {
  clearInterval(timer);
  
  if (hp <= 0) {
    // Already lost, stop generating questions
    return;
  }
  
  qNum++;

  if (qNum > maxQ) {
    // Player wins!
    document.getElementById("result").innerHTML = "🎉 You Win!";
    document.getElementById("answer").disabled = true;
    clearInterval(timer);
    document.getElementById("backBtn").style.display = "inline";
    return;
  }

  let a, b, operator, correctAns;

  if (diff === "easy") {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    operator = "+";
    correctAns = a + b;
  } else if (diff === "normal") {
    a = Math.floor(Math.random() * 50) + 1;
    b = Math.floor(Math.random() * 50) + 1;
    operator = Math.random() < 0.5 ? "+" : "-";
    correctAns = operator === "+" ? a + b : a - b;
  } else if (diff === "hard") {
    a = Math.floor(Math.random() * 100) + 1;
    b = Math.floor(Math.random() * 100) + 1;

    const ops = ["+", "-", "*","%"];
    operator = ops[Math.floor(Math.random() * ops.length)];

    if (operator === "+") {
      correctAns = a + b;
    } else if (operator === "-") {
      correctAns = a - b;
    } else {
      correctAns = a * b;
    }
  }

  document.getElementById("question").innerHTML = `Question ${qNum}:`+` ${a} ${operator} ${b} = ?`;
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();
  document.getElementById("answer").dataset.correct = correctAns;

  // Start timer
  let seconds = 10;
  document.getElementById("timer").innerHTML = `⏰ Time left: ${seconds}`;
  timer = setInterval(() => {
    seconds--;
    document.getElementById("timer").innerHTML = `⏰ Time left: ${seconds}`;
    if (seconds <= 0) {
      clearInterval(timer);
      takeDamage();
      setTimeout(newQuestion, 500);
    }
  }, 1000);
}

// ✅ Check answer
function checkAnswer() {
  clearInterval(timer);
  let ans = Number(document.getElementById("answer").value);
  let correctAns = Number(document.getElementById("answer").dataset.correct);

  if (ans === correctAns) {
    document.getElementById("message").innerHTML = "✅ Correct!";
  } else {
    document.getElementById("message").innerHTML = "❌ Wrong!";
    takeDamage();
  }

  setTimeout(newQuestion, 1000);
}

// ✅ Reduce HP
function takeDamage() {
  hp -= damage;
  if (hp < 0) hp = 0;

  // Update the HP bar width visually
  document.getElementById("hp").style.width = hp + "%";

  var imagePress1 = document.getElementById("pokemon");
  
  function changeImage() {
    imagePress1.src = "assets/img/rip.png";
  }

  if (hp <= 0) {
    document.getElementById("result").innerHTML = "💀 You Lose!";
    document.getElementById("answer").disabled = true;
    clearInterval(timer);
    document.getElementById("backBtn").style.display = "inline"; // show back button
    changeImage();
  }
}

// ✅ Auto start game when on ga.html
window.onload = function() {
  if (window.location.pathname.endsWith("ga.html")) {
    startGame();
  }
};

function goBack() {
  window.location.href = "game.html"; // go back to difficulty selection
}
let music= document.getElementById("music");
 
function playMusic(){
  music.play();

}
 document.getElementById("btn").addEventListener("mouseover",playMusic);
