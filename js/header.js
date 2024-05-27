// Código para inicialização do cabeçalho



document.addEventListener('DOMContentLoaded', () => {

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('Estado de login ao carregar a página:', isLoggedIn);
    updateHeader(isLoggedIn);

    var desconectar = document.getElementById('desconectar');

    desconectar.addEventListener('click', () => {

        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');

        updateHeader(false);

        window.location.href = '../index.html'

    });

    var loginLink = document.getElementById('loginLink');

    loginLink.addEventListener('click', function () {

        window.location.href = '../pages/login.html';

    });

});


function updateHeader(logged) {
    var loggedIn = logged; // Simula o estado de não logado
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

    function atualizarInterfaceUsuario() {
        
        const usuarioSalvo = localStorage.getItem('usuario');

        if (usuarioSalvo) {
            const { nome } = JSON.parse(usuarioSalvo);
            // Se houver um usuário logado, exiba o nome do usuário na barra de navegação
            userButton.innerText = nome;
            loginLink.style.display = 'none'; // Oculta o botão de login
        } else {
            // Se não houver usuário logado, exiba o botão de login na barra de navegação
            document.getElementById('userButton').innerText = ''; // Limpa o texto do nome do usuário
            document.getElementById('loginlink').style.display = 'inline'; // Exibe o botão de login
        }
    }
    document.addEventListener('DOMContentLoaded', function () {
        atualizarInterfaceUsuario();
    });
}

document.addEventListener('userLoggedIn', function () {
    updateHeader(true);
});

export { updateHeader };