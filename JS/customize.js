const playQuiz = document.getElementById('play-quiz')
const subjects = document.getElementById('types-subject')
const content = document.querySelector('#content-1')
const titleCategory = document.querySelector('#title-category')
const button = document.querySelector('#btn');
const html = document.getElementById('html');
const htmlQuiz = document.getElementById('htmlquiz');
const btnStart = document.getElementById('btnStart');
const quiz = document.getElementById('start-quiz');
const htmlContainer = document.getElementById('html-container');
const submitBtn = document.getElementById('submit-btn')
const showResult = document.getElementById('show-result');
const backBtn = document.getElementById('back');


playQuiz.addEventListener('click',  (e) =>{
    subjects.style.display = "block";
    content.style.display = "none";
    titleCategory.style.display = "none";
})

button.addEventListener('click',(e) =>{
    subjects.style.display = "none";
    content.style.display = "flex";
    titleCategory.style.display = "block";
})

// quiz HTML
html.addEventListener('click',(e) => {
    htmlQuiz.style.display ='block';
    subjects.style.display = 'none';
    content.style.display = "none";
    titleCategory.style.display = "none";
})

// btnStart.addEventListener('click',(e) => {
//     quiz.style.display = 'block'
//     htmlContainer.style.display = 'none'

// })

// submitBtn.addEventListener('click',(e) => {
//     showResult.style.display = 'block';
//     quiz.style.display = 'none';
// })

// backBtn.addEventListener('click',(e) => {
//     subjects.style.display = 'block';
//     htmlQuiz.style.display = 'none';
// })
// funtion for quiz html and API
let questions = [];
        let userAnswers = {};

        function startQuiz() {
            document.getElementById("quiz-container").innerHTML = "Loading questions...";
            document.getElementById("result").innerText = "";
            
            let difficulty = document.getElementById("difficulty").value;
            let urls = {
                easy: "https://the-trivia-api.com/api/questions?categories=technology&limit=5&difficulty=easy",
                medium: "https://the-trivia-api.com/api/questions?categories=technology&limit=5&difficulty=medium",
                hard: "https://the-trivia-api.com/api/questions?categories=technology&limit=5&difficulty=hard",
                mixed: [
                    "https://the-trivia-api.com/api/questions?categories=technology&limit=2&difficulty=easy",
                    "https://the-trivia-api.com/api/questions?categories=technology&limit=2&difficulty=medium",
                    "https://the-trivia-api.com/api/questions?categories=technology&limit=2&difficulty=hard"
                ]
            };

            let fetchUrls = difficulty === "mixed" ? urls.mixed : [urls[difficulty]];

            // Fetch Questions from API
            Promise.all(fetchUrls.map(url => fetch(url).then(res => res.json())))
                .then(data => {
                    questions = difficulty === "mixed" ? [...data[0], ...data[1], ...data[2]] : data[0];
                    displayQuestions();
                })
                .catch(error => console.error("Error fetching questions:", error));
        }

        function displayQuestions() {
            let quizContainer = document.getElementById("quiz-container");
            quizContainer.innerHTML = "";
            userAnswers = {};

            questions.forEach((q, index) => {
                let answers = [...q.incorrectAnswers, q.correctAnswer].sort(() => Math.random() - 0.5);

                let questionHTML = `
                    <div class="question">${index + 1}. ${q.question}</div>
                    <div class="answers">
                        ${answers.map(answer => `
                            <label>
                                <input type="radio" name="q${index}" value="${answer}" onclick="saveAnswer(${index}, '${answer}')">
                                ${answer}
                            </label><br>
                        `).join("")}
                    </div>
                `;

                quizContainer.innerHTML += questionHTML;
            });

            document.getElementById("submit-btn").style.display = "block";
        }

        function saveAnswer(index, answer) {
            userAnswers[index] = answer;
        }

        function submitQuiz() {
            let score = 0;

            questions.forEach((q, index) => {
                if (userAnswers[index] === q.correctAnswer) {
                    score++;
                }
            });

            document.getElementById("result").innerText = `Your Score: ${score} / ${questions.length}`;
        }

 


   


