

const playQuiz = document.querySelector('#play-quiz')
const subjects = document.getElementById('types-subject')
const content = document.querySelector('#content-1')
const titleCategory = document.querySelector('#title-category')
const button = document.querySelector('#btn');

// each subject of quiz





// const cardSubjects = document.querySelector('.card-subject');
const cssQuiz = document.querySelector('#cssquiz');
const css = document.querySelector("#css");         // css div

subjects.addEventListener('click', (e) => {
    // subjects.style.display = "none";
    css.style.display = "block";

});


css.addEventListener('click', (e) => {
    subjects.style.display = "none";
    cssQuiz.style.display = "block";

});





// funtion for quiz html and API
let questions = [];
let userAnswers = {};
let currentQuestionIndex = 0; // Track the current question
const startBtn = document.querySelector("#start-btn");
const label = document.querySelector('.select');
const result = document.querySelector('#result');
const submitBtn = document.querySelector('#submit-btn');
const nextBtn = document.getElementById("next-btn"); 
const timer = document.querySelector('.timer');
const quizTitle = document.querySelector("#h1");
let timerInterval;




// Append the Next button to the DOM

difficulty.style.display = "block";
label.style.display = "block";
startBtn.style.display = "block";
result.style.display = "block";
quizTitle.style.display = "block";
timer.style.display = "none";



function startQuiz() {
    quizTitle.style.display = "none";
    timer.style.display = "block";
    // document.getElementById("quiz-container").innerHTML = "Loading questions...";
    document.getElementById("result").innerText = "";


    let difficulty = document.getElementById("difficulty").value;

    let urls = {
        easy: "https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple", 
        medium: "https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple", 
        hard: "https://opentdb.com/api.php?amount=5&category=18&difficulty=hard&type=multiple",
        mixed: [
            "https://opentdb.com/api.php?amount=2&category=18&difficulty=easy&type=multiple", 
            "https://opentdb.com/api.php?amount=2&category=18&difficulty=medium&type=multiple", 
            "https://opentdb.com/api.php?amount=2&category=18&difficulty=hard&type=multiple"   
        ]
    };

    let fetchUrls = difficulty === "mixed" ? urls.mixed : [urls[difficulty]];

    // Fetch Questions from API
    Promise.all(fetchUrls.map(url => fetch(url).then(res => res.json())))
        .then(data => {
            if (difficulty === "mixed") {
                questions = [...data[0].results, ...data[1].results, ...data[2].results];
            } else {
                questions = data[0].results;
            }
            currentQuestionIndex = 0; // Reset to the first question
            displayCurrentQuestion();
        })
        .catch(error => {
            console.error("Error fetching questions:", error);
            document.getElementById("quiz-container").innerHTML = "Error loading questions. Please try again later.";
        });
}
function displayCurrentQuestion() {
    difficulty.style.display = "none";
    startBtn.style.display = "none";
    label.style.display = "none";
    nextBtn.style.display = "block";



    clearInterval(timerInterval); // Clear any previous timer
    let secondsLeft = 10; // Set timer duration
    timer.textContent = `Time left: ${secondsLeft} s`;

    // Timer logic
    timerInterval = setInterval(() => {
        secondsLeft--;
        timer.textContent = `Time left: ${secondsLeft} s`;
        nextBtn.addEventListener("click", nextQuestion);


        if (secondsLeft <= 0) {

            clearInterval(timerInterval); // Stop the timer
            if (currentQuestionIndex < questions.length - 1) {

                nextQuestion(); // Automatically go to the next question
            } else {
                submitQuiz(); // Submit the quiz if it's the last question
            }
        }
    }, 1000);

    let quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = "";

    let q = questions[currentQuestionIndex];
    let answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

    let questionHTML = `
        <div class="question">${currentQuestionIndex + 1}. ${q.question}</div>
        <div class="answers">
            ${answers.map(answer => `
                <label>
                    <input type="radio" name="q${currentQuestionIndex}" value="${answer}" onclick="saveAnswer(${currentQuestionIndex}, '${answer}')">
                    ${answer}
                </label><br>
            `).join('')}
        </div>
    `;
    quizContainer.innerHTML = questionHTML;

    // Show the Next button if there are more questions
    if (currentQuestionIndex < questions.length - 1) {
        nextBtn.style.display = "block";
        submitBtn.style.display = "none";
    } else {
        // Hide the Next button on the last question and show Submit
        nextBtn.style.display = "none";
        submitBtn.style.display = "block";
    }
}

function nextQuestion() {

    clearInterval(timerInterval); // Stop the current timer
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion();
    }
}

function saveAnswer(questionIndex, selectedAnswer) {
    userAnswers[questionIndex] = selectedAnswer;
}


function submitQuiz() {
    clearInterval(timerInterval); // Stop the timer when the quiz ends
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("h1").style.display = "none";
    submitBtn.style.display = "none";
    timer.style.display = "none";

    let score = 0;
    questions.forEach((q, index) => {
        if (userAnswers[index] === q.correct_answer) {
            score++;
        }
    });

    // Display the score
    document.getElementById("result").innerText = `Score : ${score} / ${questions.length}`;
}


// choose the subject
playQuiz.addEventListener('click', (e) => {
    subjects.style.display = "block";
    content.style.display = "none";
    titleCategory.style.display = "none";
})

button.addEventListener('click', (e) => {
    subjects.style.display = "none";
    content.style.display = "flex";
    titleCategory.style.display = "block";
})