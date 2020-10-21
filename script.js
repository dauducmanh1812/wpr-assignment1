// TODO(you): Write the JavaScript necessary to complete the assignment.
const topView = document.querySelector('.quiz-header');
const startBtn = document.querySelector('#button_start');
const submitBtn = document.querySelector('#button_submit');
const restartBtn = document.querySelector('#button_restart');

let quizForm = document.getElementById('quiz-form');
let quizFormReview = document.getElementById('quiz-form_review');
let attemptId;
let attemptData;

// Fetch the API to data
async function printData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  console.log(response.status);
  return response.json();
}
// Uploading JSON data
async function submitData(url ='', data = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify()
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
      .then(data => {
        console.log(data);
        
        // Lấy id của attempt
        attemptId = data._id;
        console.log(attemptId);
    
        // Lấy questionList from data.questions
        const questionList = data.questions;
        // console.log(questionList[0].answers.length);

        // Chạy vòng lặp lấy từng question
        for (let i = 0; i < questionList.length; i++) {
          // 1 element là 1 question
          let element = questionList[i];
          // In câu hỏi
          let newQuizContainer = document.createElement('div');
          newQuizContainer.classList.add('quiz-container');

          let newQuizNumber = document.createElement('h1');
          // Lấy số thứ tự câu hỏi
          let questionIndex = i + 1;
          newQuizNumber.textContent = 'Question ' + questionIndex + ' of 10';

          let newQuizTitle = document.createElement('p');
          newQuizTitle.textContent = element['text'];

          newQuizContainer.appendChild(newQuizNumber);
          newQuizContainer.appendChild(newQuizTitle);

      
          element.answers.forEach(oneAnswer => {
            // Tạo 1 div đáp-án thuộc phần các đáp án trong div.quiz-container
            let newDivAnswer = document.createElement('div');

            // Tạo thẻ input cho 1 option "trong 1 div đáp-án"
            let newDivAnswerInput = document.createElement('input');
            newDivAnswerInput.setAttribute("type", "radio");
            newDivAnswerInput.setAttribute("name", 'option'+ i);
            newDivAnswerInput.setAttribute("value", element.answers.indexOf(oneAnswer));

            // Tạo thẻ label:"option title" cho 1 option "trong 1 div đáp-án"
            let newDivAnswerLabel = document.createElement('lablel');
            newDivAnswerLabel.textContent = oneAnswer;

            // Truyền thẻ input và thẻ label vào "trong 1 div đáp-án"
            newDivAnswer.appendChild(newDivAnswerInput);
            newDivAnswer.appendChild(newDivAnswerLabel);

            // Truyền div đáp-án vào trong div.quiz-container
            newQuizContainer.appendChild(newDivAnswer);
          });

          // Truyền div.quiz-container vào trong div#quiz-form
          quizForm.appendChild(newQuizContainer);
        }
        
        
      });

}

function submitQuiz() {
    if (confirm("Are you sure to finish this quiz?")) {
      const userInput = document.querySelectorAll('input');
      for (let t = 0; t < userInput.length; t++) {
        if (userInput[t].type="radio") {
          if (userInput[t].name="option") {
            if (userInput[t].checked) {
              let arrayInput = [];
              arrayInput.push(userInput[t].value);
              console.log(arrayInput);
            }
          }
        }
      }
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

startBtn.addEventListener('click', function() {
    topView.scrollIntoView(true);
});
startBtn.addEventListener('click', startQuiz);

submitBtn.addEventListener('click', submitQuiz);

restartBtn.addEventListener('click', function() {
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