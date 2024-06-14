/**
 * Variáveis
 */

const quizForm = document.getElementById('quiz-form');
const quizOptions = Array.from(document.querySelectorAll('.quiz-option'));
const scoreElement = document.getElementById('score');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
var score = 0;

document.addEventListener("DOMContentLoaded", () => {

    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // enviarResposta_(event.target);

        console.log('ok');
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
        const response = await fetch('../controllers/app.php', {
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

    optionsContainer.innerHTML = '';

    questionData.options.forEach(option => {

        
        
        const optionElement = document.createElement('input');
        const label = document.createElement('label');
        const optionContainer = document.createElement('div');
        const p = document.createElement('p');

        //Cria um elemento de rádio para cada opção
        console.log(option)
        optionElement.type = 'radio';
        optionElement.name = 'quiz-option';
        optionElement.value = option.option_id;

        //Cria um label para o input
        label.textContent = option.option_text;
        label.htmlFor = option.option_id;

        p.textContent = option.option_text;

        //Cria um container para a opção
        optionContainer.className = 'app-opcoes';

        optionContainer.appendChild(optionElement);
        optionContainer.appendChild(label);
        optionContainer.appendChild(p);
        optionsContainer.appendChild(optionContainer);
    });
}

const enviarResposta_ = async () => {
    quizOptions.forEach((option) => {
        if (option.checked) {
            var parentDiv = option.closest('.app-opcoes');

            var optionScore = parseInt(parentDiv.getAttribute('data-score'));
            score = optionScore;

        }
    })
    scoreElement.textContent = score;
    try {
        const response = await fetch('../controllers/app.php', {
            //logica para obter 
        });
    } catch (error) {
        console.error('Error: ', error);
        toastr.error('An erro occurred during response');
    }
}

