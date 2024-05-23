// Código para inicialização do cabeçalho
document.addEventListener("DOMContentLoaded", function () {
    var loggedIn = false; // Simula o estado de não logado
    var loginLink = document.getElementById('loginLink');
    var userMenu = document.getElementById('userMenu');
    var userButton = document.getElementById('userButton');

    // Simula a verificação do estado de login
    if (loggedIn) {
        loginLink.style.display = 'none';
        userMenu.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        userMenu.style.display = 'none';
    }

    // Adiciona interatividade ao botão do menu do usuário
    userButton.addEventListener('click', function () {
        var userDropdown = document.getElementById('userDropdown');
        userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
    });
});
