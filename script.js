// TODO(you): Write the JavaScript necessary to complete the assignment.
class Question {
    answers;
    text;
    _id;
    __v;
}

class Attempt {
    completed;
    correctAnswers;
    questions;
    score;
    __v;
    _id;
}

const topView = document.querySelector('.quiz-header');
const startBtn = document.querySelector('#button_start');
const submitBtn = document.querySelector('#button_submit');
const restartBtn = document.querySelector('#button_restart');

let quizForm = document.querySelectorAll('.quiz-form');
let result_1 = document.querySelector('#result_1');
let result_2 = document.querySelector('#result_2');
let result_3 = document.querySelector('#result_3');
let attemptId;
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
    // console.log(response.status);
    return response.json();
}

function startQuiz() {
    let quizIntroduction = document.querySelector('#quiz-introduction');
    quizIntroduction.classList.add('hidden');

    let quizAttempt = document.querySelector('#quiz-attempt');
    quizAttempt.classList.remove('hidden');

    // Print new quiz-attempt
    printData('https://wpr-quiz-api.herokuapp.com/attempts')
        .then(attempt => {
            console.log(attempt);

            // Lấy id của attempt
            attemptId = attempt._id;
            correctAnswers = attempt.correctAnswers;
            // console.log(attemptId);

            // Lấy questionList from data.questions
            const questionList = attempt.questions;
            // console.log(questionList[0].answers.length);

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
                    answerInput.classList.add(`qId-${question._id}`);
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

                // Truyền div.quiz-container vào trong div#quiz-form + div#quiz-form_review
                // quizForm.appendChild(newQuizContainer);
                // quizFormReview.appendChild(newQuizContainer);
                quizForm.forEach(form => {
                    form.innerHTML += newQuizContainer.outerHTML;
                });
            }
        });
}

function submitQuiz() {
    const quizFormReviewChilds = document.querySelectorAll('#quiz-review > #quiz-form_review .quiz-container');
    console.log(quizFormReviewChilds);
    const quizContainer = document.getElementsByClassName('quiz-container');
    const inputs = document.querySelectorAll('input');
    let answers_submission = {};
    let score;
    let scorePercent;
    let scoreText;

    // comparison?
    for (const input of inputs) {
        if (input.type = "radio") {
            if (input.name = "option") {
                if (input.checked) {
                    // get questionId
                    const questionId = input.classList[0].split('-')[1];
                    // {questionId: answer}
                    answers_submission[questionId] = +input.value;
                }
            }
        }
    }

    for (const [key, value] of Object.entries(answers_submission)) {
        let quesid = key;
        let invalue = value;
        // console.log(quesid);
        // console.log(`${value}`);
        for (let g = 0; g < quizFormReviewChilds.length; g++) {
            if (quesid = quizFormReviewChilds[g].id) {
                let checkedInput = document.querySelector(`input.qId-${quesid}[value="${invalue}"]`);
                console.log(checkedInput)
                checkedInput.checked = true;
            }
        }
    }

    let answersData = {
        "answers": answers_submission
    }
    fetch('https://wpr-quiz-api.herokuapp.com/attempts/' + attemptId + '/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answersData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Lấy result
            score = data.score + '/10';
            scorePercent = (data.score / 10) * 100 + '%';
            scoreText = data.scoreText;


            for (let m in data.correctAnswers) {
                for (let n = 0; n < quizContainer.length; n++) {
                    const paraCorrect = document.createElement('p');
                    paraCorrect.classList.add('badge');
                    paraCorrect.textContent = 'Correct answer';

                    const paraYour = document.createElement('p');
                    paraYour.classList.add('badge');
                    paraYour.textContent = 'Your answer';

                    let indexCorrectAnswer = data.correctAnswers[m] + 2;
                    let indexYourAnswer = data.answers[m] + 2;

                    if (m == quizContainer[n].id) {
                        if (data.correctAnswers[m] != data.answers[m]) {
                            quizContainer[n].children[indexCorrectAnswer].appendChild(paraCorrect);
                            quizContainer[n].children[indexCorrectAnswer].style.backgroundColor = '#d4edda';

                            if (indexYourAnswer <= 5) {
                                quizContainer[n].children[indexYourAnswer].appendChild(paraYour);
                                quizContainer[n].children[indexYourAnswer].style.backgroundColor = '#f8d7da';
                                //   quizContainer[n].querySelector('input').checked = true;
                            }
                        } else {
                            quizContainer[n].children[indexCorrectAnswer].appendChild(paraCorrect);
                            // quizContainer[n].children[indexCorrectAnswer].classList.add('right');
                            quizContainer[n].children[indexCorrectAnswer].style.backgroundColor = '#d4edda';
                            //   quizContainer[n].querySelector('input').checked = true;

                        }
                    }
                    //   console.log(quizContainer[n].querySelector('input'));
                    // quizContainer[n].children[indexYourAnswer].querySelector('input').checked = true; 
                }
            }
            // console.log(result_1);
            result_1.textContent = score;
            result_2.textContent = scorePercent;
            result_3.textContent = scoreText;
        });
    let quizAttempt = document.querySelector('#quiz-attempt');
    quizAttempt.classList.add('hidden');

    let quizReview = document.querySelector('#quiz-review');
    quizReview.classList.remove('hidden');


}

function restartQuiz() {
    let quizReview = document.querySelector('#quiz-review');
    quizReview.classList.add('hidden');

    // Delete before quiz-attempt
    quizForm.forEach(form => {
        form.innerHTML = '';
    });

    let quizIntroduction = document.querySelector('#quiz-introduction');
    quizIntroduction.classList.remove('hidden');
}

// function changeDivColor() {
//   const inputs = document.querySelectorAll('input');
//     for (const input of inputs) {
//         if (input.type = "radio") {
//             if (input.name = "option") {
//                 if (input.checked) {
//                     input.parentNode.style.backgroundColor = '#ddd';
//                 }
//             }
//         }
//     }
// }

startBtn.addEventListener('click', function() {
    topView.scrollIntoView(true);
    startQuiz();
});

submitBtn.addEventListener('click', function() {
    // confirm finish
    const confirmSubmit = confirm("Are you sure to finish this quiz?");
    if (confirmSubmit) {
        submitQuiz();

        // disabled all input
        const inputs = document.querySelectorAll('input');
        [].forEach.call(inputs, function(input) {
            input.disabled = true;
        })
    }
})

restartBtn.addEventListener('click', function() {
    topView.scrollIntoView(true);
    restartQuiz();
});




// function selectOption(event) {
//     const quizOption = event.currentTarget;

//     const selectedOption = document.querySelector('.active');
//     if (selectedOption) {
//         selectedOption.classList.remove('active');
//     }

//     quizOption.classList.add('active');
// }


// quizOption.addEventListener('click', selectOption);
