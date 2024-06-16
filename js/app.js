/**
 * Variáveis
 */

const quizForm = document.getElementById('quiz-form');

const scoreElement = document.getElementById('score');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const level = document.getElementById('level');
let score = 0;

document.addEventListener("DOMContentLoaded", () => {

    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
        enviarResposta_(event.target);
    });


    carregarPergunta();
})




/**
 * Funções
 */
//Função para carregar a pegunta
const carregarPergunta = async () => {
    var level = 1;
    try {
        const response = await fetch('../controllers/get_question.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'level=' + level
        });
        if (!response.ok)
            throw new Error("Error");

        const data = await response.json();
        mostrarPergunta(data);
        toastr.success('Pergunta pronta!!');

    } catch (error) {
        console.error('Error: ', error);
        toastr.error('An erro occurred during response');
    }
}

const mostrarPergunta = (questionData) => {
    questionText.textContent = questionData.question.question_text;

    level.value = questionData.question.level;

    optionsContainer.innerHTML = '';

    questionData.options.forEach(option => {

        const optionElement = document.createElement('input');
        const label = document.createElement('label');
        const optionContainer = document.createElement('div');
        const p = document.createElement('p');
        // const level = document.createElement('input');

        //Cria um elemento de rádio para cada opção
        optionElement.type = 'radio';
        optionElement.name = 'quiz-option';
        optionElement.value = option.option_id;
        optionElement.className = 'quiz-option';

        //Cria um label para o input
        label.textContent = 'opção';
        label.htmlFor = option.option_id;

        p.textContent = option.option_text;

        //Cria um container para a opção
        optionContainer.className = 'app-opcoes';

        optionContainer.appendChild(optionElement);
        optionContainer.appendChild(label);
        optionContainer.appendChild(p);
        optionsContainer.appendChild(optionContainer);
        // optionsContainer.appendChild(level);
        optionContainer.setAttribute('data-score', option.points);
    });
}

const enviarResposta_ = async () => {
    let selectedOptionScore = 0;
    let selectedOptionId = 0;
    let questionLevel = 1;
    
    const quizOptions = Array.from(document.querySelectorAll('.quiz-option'));

    quizOptions.forEach((option) => {
        if (option.checked) {
            let parentDiv = option.closest('.app-opcoes');
            selectedOptionScore = parseInt(parentDiv.getAttribute('data-score'));
            // selectedOptionId = ;
        }
    })
    if (score == 0) {
        score = selectedOptionScore;
    } else {
        console.log(score);
        score += selectedOptionScore;
        console.log(score);
    }
    scoreElement.textContent = score;

    try {
        const response = await fetch('../controllers/process_answer.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `score=${selectedOptionScore}&level=${questionLevel}&optionId=${selectedOptionId}`
        });

        if (!response.ok)
            throw new Error("Error");

        const data = await response.json();
        mostrarPergunta(data);

    } catch (error) {
        console.error('Error: ', error);
        toastr.error('An erro occurred during response');
    }
}

