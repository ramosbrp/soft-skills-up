document.addEventListener("DOMContentLoaded", () => {
    var enviarResposta = document.getElementById('enviar-resposta');
    var quizOptions = Array.from(document.querySelectorAll('.quiz-option'));
    var scoreElement = document.getElementById('score');



    enviarResposta.addEventListener('click', () => {
        var score = 0;


        quizOptions.forEach((option) => {
            if (option.checked) {
                var parentDiv = option.closest('.app-opcoes');

                var optionScore = parseInt(parentDiv.getAttribute('data-score'));
                score = optionScore;

            }
        })
        scoreElement.textContent = score;
    });
})

