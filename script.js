class Question {
  answers; // string[]
  text; //string
  _id; //string
  __v; // number
}

class Attempt {
  completed; // boolean
  correctAnswers; // {[k: string]: any}
  questions; // Question[]
  score; // number
  __v; // number
  _id; // string
}


// TODO(you): Write the JavaScript necessary to complete the assignment.
const topView = document.querySelector('.quiz-header');
const startBtn = document.querySelector('#button_start');
const submitBtn = document.querySelector('#button_submit');
const restartBtn = document.querySelector('#button_restart');


let quizForm = document.getElementById('quiz-form');
let quizFormReview = document.getElementById('quiz-form_review');
let attemptId;
let attemptData;
let correctAnswers;

// Fetch the API to data
async function printData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}
// Uploading JSON data
async function submitData(url = '', data = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  console.log(res.status);
  return res.json();
}

// fetch ('https://wpr-quiz-api.herokuapp.com/attempts/:id/submit')
// :id = attemptId
// const data = { username: 'example' };

// fetch('https://example.com/profile', {
//   method: 'POST', // or 'PUT'
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(data),
// })
// .then(response => response.json())
// .then(data => {
//   console.log('Success:', data);
// })
// .catch((error) => {
//   console.error('Error:', error);
// });

function startQuiz() {
  let quizIntroduction = document.querySelector('#quiz-introduction');
  quizIntroduction.classList.add('hidden');

  let quizAttempt = document.querySelector('#quiz-attempt');
  quizAttempt.classList.remove('hidden');

  // Delete before quiz-attempt
  quizForm.innerHTML = '';

  // Print new quiz-attempt
  printData('https://wpr-quiz-api.herokuapp.com/attempts')
    .then(attempt => {
      console.log(attempt);

      // Lấy id của attempt
      attemptId = attempt._id;
      correctAnswers = attempt.correctAnswers;

      // Lấy questionList from data.questions
      const questionList = attempt.questions;


      // Chạy vòng lặp lấy từng question
      for (let i = 0; i < questionList.length; i++) {
        // 1 element là 1 question
        let question = questionList[i];
        // In câu hỏi
        let newQuizContainer = document.createElement('div');
        newQuizContainer.classList.add('quiz-container');
        newQuizContainer.id = question._id;

        let newQuizNumber = document.createElement('h1');
        // Lấy số thứ tự câu hỏi
        let questionIndex = i + 1;
        newQuizNumber.textContent = 'Question ' + questionIndex + ' of 10';

        let newQuizTitle = document.createElement('p');
        newQuizTitle.textContent = question.text;

        newQuizContainer.appendChild(newQuizNumber);
        newQuizContainer.appendChild(newQuizTitle);


        question.answers.forEach(answer => {
          // Tạo 1 div đáp-án thuộc phần các đáp án trong div.quiz-container
          let answerContainer = document.createElement('div');

          // Tạo thẻ input cho 1 option "trong 1 div đáp-án"
          let answerInput = document.createElement('input');
          answerInput.classList.add(`qId:${question._id}`);
          answerInput.setAttribute("type", "radio");
          answerInput.setAttribute("name", 'option' + i);
          answerInput.setAttribute("value", question.answers.indexOf(answer));

          // Tạo thẻ label:"option title" cho 1 option "trong 1 div đáp-án"
          let answerLabel = document.createElement('label');
          answerLabel.textContent = answer;

          // Truyền thẻ input và thẻ label vào "trong 1 div đáp-án"
          answerContainer.appendChild(answerInput);
          answerContainer.appendChild(answerLabel);

          // Truyền div đáp-án vào trong div.quiz-container
          newQuizContainer.appendChild(answerContainer);
        });

        // Truyền div.quiz-container vào trong div#quiz-form
        quizForm.appendChild(newQuizContainer);
      }
    });

}

function submitQuiz() {
  if (confirm("Are you sure to finish this quiz?")) {
    const inputs = document.querySelectorAll('input');
    let answers = {};
    // comparison?
    for (const input of inputs) {
      if (input.type = "radio") {
        if (input.name = "option") {
          if (input.checked) {
            // get questionId
            const questionId = input.classList[0].split(':')[1];
            // {questionId: answer}
            answers[questionId] = +input.value;
            console.log(answers);
          }
        }
      }
    }
    // TODO: submit answers{}
  }

  let quizAttempt = document.querySelector('#quiz-attempt');
  quizAttempt.classList.add('hidden');

  let quizReview = document.querySelector('#quiz-review');
  quizReview.classList.remove('hidden');
}

function restartQuiz() {
  let quizReview = document.querySelector('#quiz-review');
  quizReview.classList.add('hidden');

  let quizIntroduction = document.querySelector('#quiz-introduction');
  quizIntroduction.classList.remove('hidden');
}

startBtn.addEventListener('click', function () {
  topView.scrollIntoView(true);
});
startBtn.addEventListener('click', startQuiz);

submitBtn.addEventListener('click', submitQuiz);

restartBtn.addEventListener('click', function () {
  topView.scrollIntoView(true);
});
restartBtn.addEventListener('click', restartQuiz);



// function selectOption(event) {
//     const quizOption = event.currentTarget;

//     const selectedOption = document.querySelector('.active');
//     if (selectedOption) {
//         selectedOption.classList.remove('active');
//     }

//     quizOption.classList.add('active');
// }


// quizOption.addEventListener('click', selectOption);