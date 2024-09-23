// fetch("html_questions.json").then((result) => {
//     let res = result.json()
//     return res
// }).then((result) => {
//     for (let i = 0; i < result.length; i++){
//         console.log(result[i]);
//     }
// })

// selected items
let count = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let queizArea = document.querySelector(".queiz-area");
let answersArea = document.querySelector(".answers-area");
let submitAnswer = document.querySelector(".submit-answer");
let result = document.querySelector(".result");
let countdown = document.querySelector(".countdown");

// set option
let numOfCount = 0;
rightAnswer = 0;
let countdownInterval;

function getData() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let numQuestions = questionObject.length;

      // create bullets + set questions count
      countNum(numQuestions);

      // add question data
      addQuestionData(questionObject[numOfCount], numQuestions);

      // start countDown
      countDown(60, numQuestions);

      // click submit
      submitAnswer.onclick = () => {
        let rightAnswer = questionObject[numOfCount].right_answer;

        // increase numOfCount

        numOfCount++;

        // check Answer
        checkAnswer(rightAnswer, numQuestions);

        // remove previous question
        queizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // add new question
        addQuestionData(questionObject[numOfCount], numQuestions);

        // start countDown
        clearInterval(countdownInterval);
        countDown(60, numQuestions);

        // handle Bullets class
        handleBullets();

        // show result in the end
        showResult(numQuestions);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getData();

function countNum(num) {
  count.innerHTML = num;

  // create spans
  for (let i = 0; i < num; i++) {
    // create bullets
    let bullets = document.createElement("span");

    //   check if the first questions
    if (i === 0) {
      bullets.className = "on";
    }

    // Append bullets to main bullet container
    bulletsSpanContainer.appendChild(bullets);
  }
}

// addQuestionData function

function addQuestionData(obj, count) {
  if (numOfCount < count) {
    // create h2 element for question
    let questionobj = document.createElement("h2");

    // create text to input in h2 question
    let questionText = document.createTextNode(obj.title);

    // append text to question
    questionobj.appendChild(questionText);

    // append question to quiez area zone
    queizArea.appendChild(questionobj);

    for (let i = 1; i <= 4; i++) {
      // add answers
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      // create input radio
      let inputRadio = document.createElement("input");
      inputRadio.name = "question";
      inputRadio.type = "radio";
      inputRadio.id = `answer_${i}`;
      inputRadio.dataset.answer = obj[`answer_${i}`];

      // make first input checked
      if (i === 1) {
        inputRadio.checked = true;
      }

      // create label
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;

      // create text label
      let labelText = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(labelText);

      // append input + label to mainDiv
      mainDiv.appendChild(inputRadio);
      mainDiv.appendChild(label);
      answersArea.appendChild(mainDiv);
    }
  }
}

// check answer function
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswer++;
    console.log("Good Answer");
  }
}

// handle Bullets class
function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let bulletsArray = Array.from(bulletsSpan);

  bulletsArray.forEach((span, index) => {
    if (numOfCount === index) {
      span.className = "on";
    }
  });
}

// show result function
function showResult(count) {
  let theResult;
  if (numOfCount === count) {
    queizArea.remove();
    answersArea.remove();
    submitAnswer.remove();
    bullets.remove();

    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResult = `<span class="good">Good</span>,  ${rightAnswer} from ${count}`;
    } else if (rightAnswer === count) {
      theResult = `<span class="perfect">Perfect</span>, All Answer Is Good`;
    } else {
      theResult = `<span class="bad">Bad</span>,  ${rightAnswer} from ${count}`;
    }

    result.innerHTML = theResult;
    result.style.padding = "10px";
    result.style.backgroundColor = "white";
    result.style.marginTop = "10px";
    result.style.textAlign = "center";
  }
}

function countDown(duration, count) {
  if (numOfCount < count) {
    let minutes, second;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      second = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      second = second < 10 ? `0${second}` : second;

      countdown.innerHTML = `${minutes}:${second}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitAnswer.click();
        console.log("finished");
      }
    }, 1000);
  }
}
