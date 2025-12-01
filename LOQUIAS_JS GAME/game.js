const rockBtn = document.getElementById("rockBtn");
const paperBtn = document.getElementById("paperBtn");
const scissorsBtn = document.getElementById("scissorsBtn");

const playerChoiceText = document.getElementById("playerChoice");
const computerChoiceText = document.getElementById("computerChoice");
const gameResultText = document.getElementById("gameResult");

const playerScoreText = document.getElementById("playerScore");
const computerScoreText = document.getElementById("computerScore");

const restartBtn = document.getElementById("restartBtn");

let playerScore = 0;
let computerScore = 0;
const scoreLimit = 5;

const backgroundMusic = document.getElementById('backgroundMusic');


function getComputerChoice() {
    const choices = ["Rock", "Paper", "Scissors"];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}


function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return "It's a tie!";
    } else if (
        (playerChoice === "Rock" && computerChoice === "Scissors") ||
        (playerChoice === "Scissors" && computerChoice === "Paper") ||
        (playerChoice === "Paper" && computerChoice === "Rock")
    ) {
        return "Player wins!";
    } else {
        return "Computer wins!";
    }
}


function playGame(playerChoice) {
    if (playerScore >= scoreLimit || computerScore >= scoreLimit) {
        return; 
    }

    const computerChoice = getComputerChoice();
    
    playerChoiceText.textContent = playerChoice;
    computerChoiceText.textContent = computerChoice;

    const result = determineWinner(playerChoice, computerChoice);
    gameResultText.textContent = result;

    if (result === "Player wins!") {
        playerScore++;
        playerScoreText.textContent = playerScore;
    } else if (result === "Computer wins!") {
        computerScore++;
        computerScoreText.textContent = computerScore;
    }

    if (playerScore >= scoreLimit) {
        gameResultText.textContent = "Player wins the game!";
        celebratePlayerWin();
        disableGameButtons();
    } else if (computerScore >= scoreLimit) {
        gameResultText.textContent = "Computer wins the game!";
        showSadEmoji();
        disableGameButtons();
    }
}


function disableGameButtons() {
    rockBtn.disabled = true;
    paperBtn.disabled = true;
    scissorsBtn.disabled = true;
}


function celebratePlayerWin() {
    gameResultText.style.color = "#4CAF50";
    gameResultText.style.fontSize = "24px";
    gameResultText.style.textShadow = "0 0 20px #4CAF50, 0 0 30px #4CAF50, 0 0 40px #4CAF50";
    showCelebratoryMessage();
}


function showCelebratoryMessage() {
    const celebratoryMessage = document.createElement("div");
    celebratoryMessage.textContent = "🎉 You Win! 🎉";
    celebratoryMessage.style.fontSize = "30px";
    celebratoryMessage.style.fontWeight = "bold";
    celebratoryMessage.style.color = "#4CAF50";
    celebratoryMessage.style.position = "absolute";
    celebratoryMessage.style.top = "10px";  
    celebratoryMessage.style.left = "50%";  
    celebratoryMessage.style.transform = "translateX(-50%)";  
    celebratoryMessage.style.animation = "fadeIn 2s ease-out";
    document.body.appendChild(celebratoryMessage);
  
    setTimeout(() => {
        celebratoryMessage.style.animation = "fadeOut 2s ease-out";
        setTimeout(() => {
            celebratoryMessage.remove();
        }, 2000);
    }, 3000);
}


function showSadEmoji() {
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundColor = "#f5f5f5";  

    const sadMessage = document.createElement("div");
    sadMessage.textContent = "😢 You Lost! 😢";
    sadMessage.style.fontSize = "30px";
    sadMessage.style.fontWeight = "bold";
    sadMessage.style.color = "#d32f2f";
    sadMessage.style.position = "absolute";
    sadMessage.style.top = "10px";  
    sadMessage.style.left = "50%";  
    sadMessage.style.transform = "translateX(-50%)";  
    sadMessage.style.animation = "fadeIn 2s ease-out";
    document.body.appendChild(sadMessage);
  
    setTimeout(() => {
        sadMessage.style.animation = "fadeOut 2s ease-out";
        setTimeout(() => {
            sadMessage.remove();
        }, 2000);
    }, 3000);
}


restartBtn.addEventListener("click", () => {
    playerScore = 0;
    computerScore = 0;
    playerScoreText.textContent = playerScore;
    computerScoreText.textContent = computerScore;
    playerChoiceText.textContent = "";
    computerChoiceText.textContent = "";
    gameResultText.textContent = "";

    document.body.style.backgroundColor = "";
    gameResultText.style.color = "black";
    gameResultText.style.textShadow = "none";

    rockBtn.disabled = false;
    paperBtn.disabled = false;
    scissorsBtn.disabled = false;

    backgroundMusic.currentTime = 0;
    playBackgroundMusic();
});


function playBackgroundMusic() {
    backgroundMusic.play().catch(error => {
        console.log("Audio play was blocked: ", error);
    });
}


function stopMusic() {
    backgroundMusic.pause();  
}


rockBtn.addEventListener("click", () => {
    playGame("Rock");
    playBackgroundMusic();
});
paperBtn.addEventListener("click", () => {
    playGame("Paper");
    playBackgroundMusic();
});
scissorsBtn.addEventListener("click", () => {
    playGame("Scissors");
    playBackgroundMusic();
});


window.onload = () => {
    playBackgroundMusic(); 
};


document.getElementById('restartBtn').addEventListener('click', () => {
    backgroundMusic.currentTime = 0;  
    playBackgroundMusic();  
    resetGame();  
});


function resetGame() {
    document.getElementById('playerChoice').textContent = '';
    document.getElementById('computerChoice').textContent = '';
    document.getElementById('gameResult').textContent = '';
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('computerScore').textContent = '0';
}
