const startBtn = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const quiz = document.getElementById('quiz');


startBtn.addEventListener('click' , (e) =>{
    quizContainer.style.display = 'block';
    quiz.style.display = 'none';
})

let questions = [];
let userAnswers = {};
let currentQuestionIndex = 0;
let timer;
const timeLimit = 15; // 15 seconds per question
let timeLeft = timeLimit;

// Function to start quiz
function startQuiz() {
    document.getElementById("quiz-container").innerHTML = "Loading questions...";
    document.getElementById("result").innerText = "";

    let difficulty = document.getElementById("difficulty").value;
    let urls = {
        easy: "https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=boolean&encode=url3986",
        medium: "https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=boolean&encode=url3986",
        hard: "https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=boolean&encode=url3986",
       
    };

    let fetchUrls = difficulty === "mixed" ? urls.mixed : [urls[difficulty]];

    Promise.all(fetchUrls.map(url => fetch(url).then(res => res.json())))
        .then(data => {
            questions = difficulty === "mixed"
                ? [...data[0].results, ...data[1].results, ...data[2].results]
                : data[0].results;

            currentQuestionIndex = 0;
            displayQuestion();
        })
        .catch(error => console.error("Error fetching questions:", error));
}

// Function to display questions in card format
function displayQuestion() {
    clearInterval(timer);
    timeLeft = timeLimit;

    let quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = "";

    if (questions.length === 0) return;

    let q = questions[currentQuestionIndex];
    let answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

    let questionHTML = `
        <div class="card">
            <div class="card-body">
            <div class="timer my-3"><strong>Time Left: </strong> <span id="timer">${timeLeft}</span> seconds</div>
                <p class="card-text">${decodeURIComponent(q.question)}</p>
                <div class="answers">
                    ${answers.map(answer => `
                        <label class="btn">
                            <input type="radio" name="q${currentQuestionIndex}" value="${decodeURIComponent(answer)}"
                            ${userAnswers[currentQuestionIndex] === decodeURIComponent(answer) ? "checked" : ""} 
                            onclick="saveAnswer(${currentQuestionIndex}, '${decodeURIComponent(answer)}')">
                            ${decodeURIComponent(answer)}
                        </label>
                    `).join("")}
                </div>
                
            </div>
        </div>
    `;

    quizContainer.innerHTML = questionHTML;

    let buttonHTML = `
        <div class="mt-3 d-flex justify-content-between">
            <button class="prev-btn" onclick="prevQuestion()" ${currentQuestionIndex === 0 ? "disabled" : ""}>Previous</button>
            <button class="next-btn" onclick="nextQuestion()" ${currentQuestionIndex === questions.length - 1 ? "style='display:none;'" : ""}>Next</button>
            <button id="submit-btn"" onclick="submitQuiz()" ${currentQuestionIndex === questions.length - 1 ? "" : "style='display:none;'"}>Submit</button>
        </div>
    `;

    quizContainer.innerHTML += buttonHTML;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            autoMoveNext();
        }
    }, 1000);
}

// Function to save answer
function saveAnswer(index, answer) {
    userAnswers[index] = answer;
}

// Function for "Next" button
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

// Function for "Previous" button
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Auto move to next question when time is up
function autoMoveNext() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        submitQuiz();
    }
}

// Function to submit the quiz
function submitQuiz() {
    clearInterval(timer);

    let score = 0;
    questions.forEach((q, index) => {
        if (userAnswers[index] === decodeURIComponent(q.correct_answer)) {
            score++;
        }
    });

    let resultHTML = `<h2 class="score text-center">Your Score: ${score} / ${questions.length}</h2>`;
    resultHTML += `<button class="btn-review" onclick="reviewAnswers()">Review your answers</button>`;

    document.getElementById("quiz-container").innerHTML = resultHTML;
}

// Function to review answers after submission
function reviewAnswers() {
    let reviewHTML = `<h2 class="text-center">Review Answers</h2>`;

    questions.forEach((q, index) => {
        let correctAnswer = decodeURIComponent(q.correct_answer);
        let userAnswer = userAnswers[index] ? userAnswers[index] : "No answer selected";
        
        let isCorrect = userAnswer === correctAnswer;
        let color = isCorrect ? "green" : "red";

        reviewHTML += `
            <div class="card">
                <div class="card-body">
                    <div class="question">${index + 1}. ${decodeURIComponent(q.question)}</div>
                    <div class="correction">
                    Your Answer: <span style="color: ${color};">${userAnswer}</span><br>
                    Correct Answer: <span style="color: green;">${correctAnswer}</span>
                </div>
                <hr>
                </div>
            </div>
        `;
    });

    document.getElementById("quiz-container").innerHTML = reviewHTML;
}
