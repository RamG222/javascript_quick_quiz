const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progress-bar-full");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;
//fetching data from API
const API_URL =
  "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple";
fetch(API_URL)
  .then((response) => {
    return response.json();
  })
  .then((loadedQuestions) => {
    console.log(loadedQuestions.results);
    // loadedQuestions.results fetches Result from this API
    questions = loadedQuestions.results.map((loadedQuestions) => {
      //fetching question from API
      const formattedQuestion = {
        question: loadedQuestions.question,
      };
      //fetching choices from API
      //adds wrong choices
      const answerChoices = [...loadedQuestions.incorrect_answers];
      // adds correct choice and randomizes choices
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestions.correct_answer
      );

      //adding all choices to formattedQuestion
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });
      return formattedQuestion;
    });

    start();
  })
  .then(() => {})
  .catch((err) => {
    console.error(err);
  });

function start() {
  startgame();
}

startgame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions]; // copy question array
  console.log(availableQuestions);
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("./end.html");
  }

  questionCounter++;
  progressText.innerText =
    "Question " + questionCounter + " / " + MAX_QUESTIONS;
  const setprogressbarwidht = (questionCounter / MAX_QUESTIONS) * 100;
  progressBarFull.style.width = setprogressbarwidht + "%";

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply == "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
