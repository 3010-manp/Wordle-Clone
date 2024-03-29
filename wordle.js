
let guesses = 6
let remainingGuesses = 6;
let box = document.getElementById("board");
let rowNumber = 0;
let columnNumber = 0;
const buttons = document.querySelectorAll("button");

const randomWord = listOfWOrds[Math.floor(Math.random() * listOfWOrds.length)];
let pressedButtons = [];
let usedGuessBoxes = [];
let gameIsOver = false;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    let key = button.value;
    if (!gameIsOver) {
      if (key.toUpperCase() === "ENTER") {
        guessWord();
      } else if (key.toUpperCase() === "DELETE") {
        deleteWord(button);
      } else if (key.toUpperCase() === "PLAY") {
        let modal2 = document.getElementById("modal2");
        $(modal2).modal("show");
      } else if (key.toUpperCase() === "CLOSE") {
        let modal2 = document.getElementById("modal2");
        $(modal2).modal("hide");
      } else {
        insertWord(key, button);
      }
    }
  });
});

document.addEventListener("keyup", (e) => {
  let key = String(e.key);
  let keyFound = key.match(/[a-z]/gi);
  let button = document.getElementById(key.toUpperCase());
  if (!gameIsOver) {
    if (key.toUpperCase() === "ENTER") {
      guessWord();
    } else if (key.toUpperCase() === "BACKSPACE") {
      deleteWord(button);
    } else if (keyFound.length === 1) {
      insertWord(key.toUpperCase(), button);
    }
  }
});

function insertWord(key, button) {
  pressedButtons.push(button);
  if (columnNumber >= 5) {
    return;
  }
  let parentRow = document.getElementById(rowNumber);
  let rowElement = parentRow.querySelectorAll(".row-element")[columnNumber];
  usedGuessBoxes.push(rowElement);
  rowElement.classList.add("row-insert-effect");
  rowElement.innerHTML = key;
  if (columnNumber < 5) {
    columnNumber++;
  }
}


function deleteWord(button) {

  pressedButtons.pop();

  if (columnNumber <= 0) {
    return;
  } else {
    columnNumber--;
    let parentRow = document.getElementById(rowNumber);
    let rowElement = parentRow.querySelectorAll(".row-element")[columnNumber];
    rowElement.classList.remove("row-insert-effect");
    rowElement.innerHTML = " ";
  }
}

function guessWord() {
  if (columnNumber < 5) {
    notificationBanner("Not Enough Words", "alert-danger");
  } else {
    let check = checkWord();
    if (check === 1) {
      columnNumber = 0;
      return;
    }
    remainingGuesses--;
    updateGuesses();
    rowNumber++;
    columnNumber = 0;
  }
}

function checkWord() {
  let parentRow = document.getElementById(rowNumber);
  const word = parentRow.querySelectorAll(".row-element");
  let correctCharacters = 0;
  if (!checkWorkInList(word)) {
    notificationBanner("Please Try Another Word", "alert-danger");
    return 1;
  }

  let totalCharCount = {};
  let charCounting = {};
  randomWord.split('').forEach((character)=> {
    if(totalCharCount[character])
    {
      totalCharCount[character]++;
    }
    else 
    {
      totalCharCount[character] = 1;
    }
    charCounting[character] = 0
  });

  word.forEach((character, index) => {
    let char = character.innerText.toLowerCase();
    charCounting[char]++;
    if (randomWord.charAt(index) === char) {
      character.classList.add("green-box");
      correctCharacters++;
    } else if (randomWord.indexOf(char) != -1 && charCounting[char] <= totalCharCount[char]) {
      character.classList.add("yellow-box");
    } else {
      character.classList.add("grey-box");
    }
  })
  shadowKeyboard();
  if (correctCharacters === 5) {
    notificationBanner("Congrats!, the word is right", "alert-success");
    gameIsOver = true;
    setTimeout(() => {
      let boldWord = document.createElement("b");
      boldWord.innerText = "Congratulations!";
      let model = document.getElementById("game-over-modal");
      let correctWord = document.getElementById("correct-word");
      correctWord.append(boldWord);
      $(model).modal("show");
    }, 1500);

  } else if (rowNumber === 5) {
    let boldWord = document.createElement("b");
    boldWord.innerText = randomWord;
    let correctWord = document.getElementById("correct-word");
    correctWord.innerText = "The correct word is ";
    correctWord.append(boldWord);
    let model = document.getElementById("game-over-modal");
    $(model).modal("show");
  } else {
    notificationBanner("Try Another Guess", "alert-info");
  }
  pressedButtons = [];
}


function shadowKeyboard() {
  pressedButtons.forEach((button, index) => {
    const characterIndex = randomWord.indexOf(button.innerText.toLowerCase());
    if (index === characterIndex) {
      if (button.classList.contains("yellow-box-button")) {
        button.classList.remove("yellow-box-button");
      }
      button.classList.add("green-box-button");
    } else if (characterIndex != index && characterIndex >= 0) {
      if (!button.classList.contains("green-box-button")) {
        button.classList.add("yellow-box-button");
      }
    } else {
      button.classList.add("grey-box-button");
    }
  });
}

function generateBoard() {
  for (let i = 0; i < guesses; i++) {
    let boxRow = document.createElement("div");
    boxRow.className = "row-box";
    boxRow.id = i;

    for (let j = 0; j < 5; j++) {
      let rowElement = document.createElement("div");
      rowElement.className = "row-element";
      boxRow.append(rowElement);
    }
    box.append(boxRow);
  }
  updateGuesses();
}

function notificationBanner(text, alert) {
  let notification = document.getElementsByClassName("alert")[0];
  notification.classList.add(alert);
  notification.classList.remove("fade");
  notification.classList.remove("in");
  notification.innerText = text;
  setTimeout(() => {
    notification.classList.add("fade");
    notification.classList.add("in");
    notification.classList.remove(alert);
  }, 1000);
}


function updateGuesses() {
  let guessText = document.getElementById("guess-left");
  let number = document.createElement("b");
  number.innerText = remainingGuesses;
  guessText.innerText = "Remaining Guesses: ";
  guessText.append(number);
}

function checkWorkInList(word) {
  let guessedWord = ""
  word.forEach((character) => {
    guessedWord += character.innerText.toLowerCase()
  })
  if (listOfWOrds.includes(guessedWord)) {
    usedGuessBoxes = [];
    return true;
  } else {
    pressedButtons = [];
    usedGuessBoxes.forEach((box) => {
      box.classList.remove("row-insert-effect");
      box.innerHTML = " ";
    });
    return false;
  }
}

generateBoard();
