const stickmanImage = document.querySelector(".stickman");
const bugImage = document.querySelector(".bug");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");

let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;
//Restart
const resetGame = () => {
    correctLetters = []
    wrongGuessCount = 0
    stickmanImage.src = `./images/Stickman_idle.gif`;
    bugImage.src = `./images/Bug_idle.gif`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(() => '<li class="letter"></li>').join("");
    gameModal.classList.remove("show");
}
//New word
const getRandomWord = () => {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}
//Win or loose
const gameOver = (isVictory) => {
    setTimeout(() => {
        const modalText = isVictory ? 'You guessed it! ' : 'The correct word was: ';
        gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory ? 'Congrats!' : 'Game Over!'}`;
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
    }, 1000);
}
//Frame delay
function waitFrames(frameCount) {
    return new Promise(resolve => {
        function nextFrame(count) {
            if (count <= 0) return resolve();
            requestAnimationFrame(() => nextFrame(count - 1));
        }
        nextFrame(frameCount);
    });
}
//Stickman changes
const initGame = async (button, clickedLetter) => {

    if(currentWord.includes(clickedLetter)) {
        
        [...currentWord].forEach(async (letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
                stickmanImage.src = `./images/Stickman_attacking.gif`;
                await waitFrames(20);
                bugImage.src = `./images/Bug_damaged.gif`;
                await waitFrames(40);
                stickmanImage.src = `./images/Stickman_idle.gif`;
                bugImage.src = `./images/Bug_idle.gif`;
            }
        })
    } else {
        
        wrongGuessCount++;
        stickmanImage.src = `./images/Stickman_damaged.gif`;
        await waitFrames(20);
        stickmanImage.src = `./images/Stickman_idle.gif`;
    }
    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;


    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}
//Keyboards
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);