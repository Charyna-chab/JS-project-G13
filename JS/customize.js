const playQuiz = document.getElementById('play-quiz')
const subjects = document.getElementById('types-subject')
const content = document.querySelector('#content-1')
const titleCategory = document.querySelector('#title-category')
const button = document.querySelector('#btn');

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
