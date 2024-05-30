// Código para inicialização do cabeçalho


const desconectar = document.getElementById('desconectar');
const loginLink = document.getElementById('loginLink');
const userMenu = document.getElementById('userMenu');
const userButton = document.getElementById('userButton');
const userDropdown = document.getElementById('userDropdown');

document.addEventListener('DOMContentLoaded', () => {

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    updateHeader(isLoggedIn);


    desconectar.addEventListener('click', () => {
        
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');

        updateHeader(false);

        window.location.href = '../index.html'

    });


    loginLink.addEventListener('click', function () {

        window.location.href = '../pages/login.html';

    });

});


function updateHeader(logged) {
    var loggedIn = logged; // Simula o estado de não logado


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
            userButton.innerText = ''; // Limpa o texto do nome do usuário
            loginLink.style.display = 'inline'; // Exibe o botão de login
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