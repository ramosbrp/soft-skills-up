document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
});

document.getElementById('signupLink').addEventListener('click', function() {
    document.getElementById('signupModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
});

document.querySelectorAll('.close').forEach(function(closeBtn) {
    closeBtn.addEventListener('click', function() {
        document.querySelectorAll('.modal').forEach(function(modal) {
            modal.style.display = 'none';
        });
        document.getElementById('overlay').style.display = 'none';
    });
});

document.getElementById('overlay').addEventListener('click', function() {
    document.querySelectorAll('.modal').forEach(function(modal) {
        modal.style.display = 'none';
    });
    document.getElementById('overlay').style.display = 'none';
});

document.querySelectorAll('.modal-content form').forEach(function(form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        // Aqui você pode adicionar a lógica para processar o formulário
    });
});
