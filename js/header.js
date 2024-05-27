// Código para inicialização do cabeçalho
document.addEventListener("DOMContentLoaded", function () {
    var loggedIn = true; // Simula o estado de não logado
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

function atualizarInterfaceUsuario() {
    const usuarioSalvo = localStorage.getItem('usuario');

    if (usuarioSalvo) {
        const { nome } = JSON.parse(usuarioSalvo);
        // Se houver um usuário logado, exiba o nome do usuário na barra de navegação
        document.getElementById('userButton').innerText = nome;
        document.getElementById('loginlink').style.display = 'none'; // Oculta o botão de login
    } else {
        // Se não houver usuário logado, exiba o botão de login na barra de navegação
        document.getElementById('userButton').innerText = ''; // Limpa o texto do nome do usuário
        document.getElementById('loginlink').style.display = 'inline'; // Exibe o botão de login
    }
}
document.addEventListener('DOMContentLoaded', function() {
    atualizarInterfaceUsuario();
});