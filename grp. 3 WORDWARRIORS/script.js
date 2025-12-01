const words = {
    easy: [
        { answer: "dog", hint: "A domesticated carnivorous mammal." },
        { answer: "cat", hint: "A small domesticated mammal." },
        { answer: "book", hint: "A collection of written pages." },
        { answer: "sun", hint: "The star at the center of our solar system." },
        { answer: "tree", hint: "A perennial plant with a trunk." },
        { answer: "car", hint: "A road vehicle powered by an engine." },
        { answer: "fish", hint: "A limbless cold-blooded vertebrate animal." },
        { answer: "ball", hint: "A spherical object used in games." },
        { answer: "house", hint: "A building for human habitation." },
        { answer: "apple", hint: "A round fruit with red or green skin." },
        { answer: "shoe", hint: "An item of footwear." },
        { answer: "bird", hint: "A warm-blooded egg-laying vertebrate." },
        { answer: "chair", hint: "A piece of furniture for sitting." },
        { answer: "table", hint: "A piece of furniture with a flat top." },
        { answer: "water", hint: "A transparent liquid essential for life." },
        { answer: "moon", hint: "Earth's natural satellite." },
        { answer: "star", hint: "A luminous celestial body." },
        { answer: "cake", hint: "A sweet baked dessert." },
        { answer: "clock", hint: "A device for telling time." },
        { answer: "pen", hint: "An instrument for writing." }
    ],
    medium: [
        { answer: "guitar", hint: "A musical instrument with strings." },
        { answer: "coffee", hint: "A popular caffeinated drink." },
        { answer: "cloud", hint: "A visible mass of condensed water vapor." },
        { answer: "bicycle", hint: "A vehicle with two wheels." },
        { answer: "ocean", hint: "A large body of saltwater." },
        { answer: "piano", hint: "A large musical instrument with keys." },
        { answer: "camera", hint: "A device for capturing images." },
        { answer: "planet", hint: "A celestial body orbiting a star." },
        { answer: "sandwich", hint: "Two slices of bread with filling." },
        { answer: "computer", hint: "An electronic device for processing data." },
        { answer: "rocket", hint: "A vehicle for traveling in space." },
        { answer: "violin", hint: "A string instrument played with a bow." },
        { answer: "jacket", hint: "An outer garment for the upper body." },
        { answer: "skateboard", hint: "A board with wheels for skating." },
        { answer: "triangle", hint: "A three-sided polygon." },
        { answer: "fountain", hint: "A structure that ejects water." },
        { answer: "chocolate", hint: "A sweet food made from cocoa." },
        { answer: "mountain", hint: "A large natural elevation of the Earth's surface." },
        { answer: "dolphin", hint: "A highly intelligent aquatic mammal." },
        { answer: "basketball", hint: "A sport played with a ball and hoop." }
    ],
    hard: [
        { answer: "mountain", hint: "A large natural elevation of the Earth's surface." },
        { answer: "elephant", hint: "A large mammal with a trunk." },
        { answer: "telescope", hint: "An optical instrument for viewing distant objects." },
        { answer: "sunflower", hint: "A plant with large yellow flowers." },
        { answer: "keyboard", hint: "An input device for typing." },
        { answer: "chameleon", hint: "A lizard known for changing color." },
        { answer: "quasar", hint: "An extremely luminous and distant celestial object." },
        { answer: "sphinx", hint: "A mythical creature with a lion's body and a human head." },
        { answer: "philosophy", hint: "The study of fundamental nature of knowledge." },
        { answer: "algorithm", hint: "A process for solving a problem." },
        { answer: "neuroscience", hint: "The study of the nervous system." },
        { answer: "astronaut", hint: "A person trained to travel in space." },
        { answer: "bioluminescence", hint: "The production of light by living organisms." },
        { answer: "metamorphosis", hint: "A transformation or change." },
        { answer: "paradox", hint: "A statement that contradicts itself." },
        { answer: "sustainability", hint: "The ability to be maintained at a certain rate." },
        { answer: "antimatter", hint: "Matter composed of antiparticles." },
        { answer: "cryptography", hint: "The art of writing or solving codes." },
        { answer: "epidemiology", hint: "The study of how diseases spread." },
        { answer: "vortex", hint: "A mass of whirling fluid or air." },
        { answer: "zenith", hint: "The highest point reached by a celestial object." }
    ]
};

let currentWord, answerArray, mistakes, maxMistakes, currentDifficulty, remainingWords;
const hintText = document.getElementById("hint-text");
const wordDisplay = document.getElementById("word");
const lettersContainer = document.getElementById("letters");
const mistakesDisplay = document.getElementById("mistakes-count");
const hangmanImage = document.getElementById("hangman-image");
const messageDisplay = document.getElementById("message");
const failedModal = document.getElementById("failed-modal");
const correctWordDisplay = document.getElementById("correct-word");


let gameActive = false;

function resetGameState() {
    currentWord = "";
    answerArray = [];
    mistakes = 0;
    mistakesDisplay.textContent = mistakes;
    hangmanImage.src = "images/stage0.png";
    lettersContainer.innerHTML = ""; 
    messageDisplay.textContent = ""; 
}

function startGame(difficulty) {
    currentDifficulty = difficulty;
    remainingWords = [...words[difficulty]];
    resetGameState();
    gameActive = true; 
    document.getElementById("difficulty-selection").style.display = "none";
    document.getElementById("game-area").style.display = "block";
    initGame();
}

function initGame() {
    if (remainingWords.length === 0) {
        endGame("You've completed all the words! Returning to the main menu...", false, false, true);
        return;
    }

    const randomIndex = Math.floor(Math.random() * remainingWords.length);
    const randomWord = remainingWords.splice(randomIndex, 1)[0];
    currentWord = randomWord.answer.toLowerCase();
    answerArray = Array(currentWord.length).fill("_");

    maxMistakes = 6;

    hintText.textContent = randomWord.hint;
    wordDisplay.textContent = answerArray.join(" ");
    mistakesDisplay.textContent = mistakes;
    hangmanImage.src = "images/stage0.png";
    messageDisplay.textContent = "";
    lettersContainer.innerHTML = "";

    createLetterButtons();
}

function createLetterButtons() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    alphabet.split("").forEach((letter) => {
        const button = document.createElement("button");
        button.textContent = letter;
        button.setAttribute("data-letter", letter);
        button.addEventListener("click", () => handleGuess(letter, button));
        lettersContainer.appendChild(button);
    });
}

document.addEventListener("keydown", (event) => {
    const letter = event.key.toLowerCase();
    if (gameActive && letter.match(/[a-z]/) && !document.querySelector(`button[data-letter='${letter}']`).disabled) {
        const button = document.querySelector(`button[data-letter='${letter}']`);
        handleGuess(letter, button);
    }
});

function handleGuess(letter, button) {
    button.disabled = true;

    const errorSound = document.getElementById("error-sound");
    const winSound = document.getElementById("win-sound");

    if (currentWord.includes(letter)) {
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === letter) {
                answerArray[i] = letter;
            }
        }
        wordDisplay.textContent = answerArray.join(" ");
        winSound.play();

        if (!answerArray.includes("_")) {
            messageDisplay.textContent = "Correct! You guessed the word!";
            setTimeout(() => {
                initGame(); 
            }, 2000);
        }
    } else {
        mistakes++;
        mistakesDisplay.textContent = mistakes;
        hangmanImage.src = `images/stage${mistakes}.png`;
        errorSound.play();

        if (mistakes === maxMistakes) {
            gameActive = false; 
            endGame(`You Lose! The word was "${currentWord}".`, true);
            displayFailedScreen();
        }
    }
}

function displayFailedScreen() {
    correctWordDisplay.textContent = `The word was: "${currentWord}"`;
    failedModal.style.display = "flex";
}


document.addEventListener("DOMContentLoaded", () => {
    failedModal.style.display = "none"; 
});

document.getElementById("restart-game").addEventListener("click", restartGame);

function restartGame() {
    failedModal.style.display = "none";
    resetGameState();
    document.getElementById("difficulty-selection").style.display = "block"; 
    document.getElementById("game-area").style.display = "none"; 
    gameActive = false;
}

function endGame(message, lost, proceedToNext = false, backToMenu = false) {
    messageDisplay.textContent = message;
    messageDisplay.className = lost ? "lost" : "won";
    document.querySelectorAll("#letters button").forEach((button) => {
        button.disabled = true;
    });

    if (backToMenu) {
        setTimeout(() => {
            document.getElementById("difficulty-selection").style.display = "block";
            document.getElementById("game-area").style.display = "none";
        }, 3000);
    }
}

document.getElementById("restart").addEventListener("click", restartGame);
