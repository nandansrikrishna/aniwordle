document.addEventListener("DOMContentLoaded", async () => {
  const url =
    "https://random-words5.p.rapidapi.com/getMultipleRandom?count=1&wordLength=5";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "af9362b11emshc57b7730a23eb82p1700b4jsn7cb25cda42d0",
      "X-RapidAPI-Host": "random-words5.p.rapidapi.com",
    },
  };

  let word_array = await fetch(url, options)
    .then((res) => res.json())
    // .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));

  let word = word_array[0];

  createSquares();

  let guessedWords = [[]];
  let availableSpace = 1;

  let guessedWordCount = 0;

  const keys = document.querySelectorAll(".keyboard-row button");

  function getCurrentWordArr() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr && currentWordArr.length < 5) {
      currentWordArr.push(letter);

      const availableSpaceEl = document.getElementById(availableSpace);
      availableSpace += 1;

      availableSpaceEl.textContent = letter;
    }
  }

  function getTileColor(letter, index) {
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
      return "rgb(58, 58, 60)";
    }

    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = letter == letterInThatPosition;

    if (isCorrectPosition) {
      return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
  }

  async function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 5) {
      window.alert("Word must be 5 letters!");
      return;
    }

    const currentWord = currentWordArr.join("");

    let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`)
      .then((res) => res.json())
      .catch((err) => console.error("error:" + err));

    console.log(response);
    
    if (!response[0].word) {
        window.alert("Input must be a real world!");
        return;
    }

    const firstLetterId = guessedWordCount * 5 + 1;
    const interval = 200;
    currentWordArr.forEach((letter, index) => {
      setTimeout(() => {
        const tileColor = getTileColor(letter, index, word);

        const letterId = firstLetterId + index;
        const letterEl = document.getElementById(letterId);
        letterEl.classList.add("animate__flipInX");
        letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
      }, interval * index);
    });

    ++guessedWordCount;

    if (currentWord === word) {
      window.alert("Correct!!");
    }

    if (guessedWords.length === 6) {
      window.alert(`The word is ${word}.`);
    }

    guessedWords.push([]);
  }

  function createSquares() {
    const gameBoard = document.getElementById("board");

    for (let i = 0; i < 30; i++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", i + 1);
      gameBoard.appendChild(square);
    }
  }

  function handleDelete() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length == 0) {
        return;
    }
    const removedLetter = currentWordArr.pop();

    guessedWords[guessedWords.length - 1] = currentWordArr;

    const lastLetterEl = document.getElementById(String(availableSpace - 1));

    lastLetterEl.textContent = "";
    availableSpace -= 1;
  }

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute("data-key");

      if (letter == "enter") {
        handleSubmitWord();
        return;
      }

      if (letter == "del") {
        handleDelete();
        return;
      }

      updateGuessedWords(letter);
    };
  }
});
