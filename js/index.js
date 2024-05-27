document.addEventListener('DOMContentLoaded', () => {
    var comeceAgora = document.getElementById('comece-agora');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    comeceAgora.addEventListener('click', () => {
        if (isLoggedIn) {
            console.log('logado');
            window.location.href = '../pages/app.html'
        } else {
            window.location.href = '../pages/login.html'
            console.log('não logado');
        }
    });
});