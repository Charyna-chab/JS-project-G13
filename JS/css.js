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
const timeLimit = 15; // 10 seconds per question
let timeLeft = timeLimit;
// Function for start quiz
function startQuiz() {
    document.getElementById("quiz-container").innerHTML = "Loading questions...";
    document.getElementById("result").innerText = "";

    let difficulty = document.getElementById("difficulty").value;
    let urls = {
        easy: "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple",
        medium:"https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple",
        hard: "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple",
        mixed: [
            "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple",
            "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple",
           "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple",
        ]
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


// Function for display time during quiz
function displayQuestion() {
    clearInterval(timer);
    timeLeft = timeLimit;

    let quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = "";

    if (questions.length === 0) return;

    let q = questions[currentQuestionIndex];
    let answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

    let questionHTML = `
        <div class="timer" id="timer">Time Left: ${timeLeft}second</div>
        <div class="question">${currentQuestionIndex + 1}. ${decodeURIComponent(q.question)}</div>
        <div class="answers">
            ${answers.map(answer => `
                <label>
                    <input type="radio" name="q${currentQuestionIndex}" value="${decodeURIComponent(answer)}" 
                    ${userAnswers[currentQuestionIndex] === decodeURIComponent(answer) ? "checked" : ""} 
                    onclick="saveAnswer(${currentQuestionIndex}, '${decodeURIComponent(answer)}')">
                    ${decodeURIComponent(answer)}
                </label><br>
            `).join("")}
        </div>
    `;

    quizContainer.innerHTML = questionHTML;

    let buttonHTML = `
        <button  class="prev-btn" onclick="prevQuestion()" ${currentQuestionIndex === 0 ? "disabled" : ""}>Previous</button>
        <button class="next-btn" onclick="nextQuestion()" ${currentQuestionIndex === questions.length - 1 ? "style='display:none;'" : ""}>Next</button>
        <button id="submit-btn" onclick="submitQuiz()" ${currentQuestionIndex === questions.length - 1 ? "" : "style='display:none;'"}>Submit</button>
    `;

    quizContainer.innerHTML += buttonHTML;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Time Left: ${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            autoMoveNext();
        }
    }, 1000);
}

// Function for save answer
function saveAnswer(index, answer) {
    userAnswers[index] = answer;
}

// Function for click next question button
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}


// Function for click back question button
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}


// Function for auto next question if end seconds
function autoMoveNext() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        submitQuiz();
    }
}


// Function for submit after finish quiz
function submitQuiz() {
    clearInterval(timer);

    let score = 0;
    questions.forEach((q, index) => {
        if (userAnswers[index] === decodeURIComponent(q.correct_answer)) {
            score++;
        }
    });

    let resultHTML = `<h2 class="score">Your Score: ${score} / ${questions.length}</h2>`;
    resultHTML += `<button class="review">Review your answers:</button>`;

    questions.forEach((q, index) => {
        let correctAnswer = decodeURIComponent(q.correct_answer);
        let userAnswer = userAnswers[index] ? userAnswers[index] : "No answer selected";
        
        let isCorrect = userAnswer === correctAnswer;
        let color = isCorrect ? "green" : "red";

        resultHTML += `
            <div class="question">${index + 1}. ${decodeURIComponent(q.question)}</div>
            <div class="correction">
                Your Answer: <span style="color: ${color};">${userAnswer}</span><br>
                Correct Answer: <span style="color: green;">${correctAnswer}</span>
            </div>
            <hr>
        `;
    });

    document.getElementById("quiz-container").innerHTML = resultHTML;
}
