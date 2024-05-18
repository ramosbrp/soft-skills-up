// Função para validar nome
function validarNome(idCampo) {
    const elemento = document.getElementById(idCampo);
    if (!elemento) {
        console.error(`Elemento com ID ${idCampo} não encontrado.`);
        return false;
    }
    const span = elemento.nextElementSibling;
    const nome = elemento.value.trim();
    elemento.classList.remove("is-valid", "is-invalid");

    if (nome.length === 0) {
        span.textContent = 'O campo não pode estar vazio';
        elemento.classList.add('is-invalid');
        return false;
    }

    if (nome.length < 8) {
        span.textContent = 'Precisa ter mais que 8 caracteres';
        elemento.classList.add('is-invalid');
        return false;
    }

    const regex = /^[A-Za-zÀ-ÿ\s]+$/; // Aceita letras e espaços
    if (!regex.test(nome)) {
        span.textContent = 'O nome não pode possuir números ou caracteres especiais';
        elemento.classList.add('is-invalid');
        return false;
    }

    span.textContent = '';
    elemento.classList.add('is-valid');
    return true;
}

// Função para validar email
function validarEmail(idCampo) {
    const elemento = document.getElementById(idCampo);
    if (!elemento) {
        console.error(`Elemento com ID ${idCampo} não encontrado.`);
        return false;
    }
    const email = elemento.value.trim();
    const span = elemento.nextElementSibling;

    elemento.classList.remove("is-valid", "is-invalid");

    const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (email.length === 0) {
        span.textContent = 'O campo não pode estar vazio';
        elemento.classList.add("is-invalid");
        return false;
    }

    if (!regex.test(email)) {
        span.textContent = 'Formato de e-mail inválido';
        elemento.classList.add("is-invalid");
        return false;
    }

    span.textContent = '';
    elemento.classList.add("is-valid");
    return true;
}

// Função para validar CPF
function validarCPF(idCampo) {
    const elemento = document.getElementById(idCampo);
    if (!elemento) {
        console.error(`Elemento com ID ${idCampo} não encontrado.`);
        return false;
    }
    const span = elemento.nextElementSibling;
    const cpf = elemento.value.replace(/\D/g, '');

    elemento.classList.remove("is-valid", "is-invalid");

    if (cpf.length !== 11 || !validarDigitoCPF(cpf)) {
        span.textContent = 'CPF inválido';
        elemento.classList.add('is-invalid');
        return false;
    }

    span.textContent = '';
    elemento.classList.add('is-valid');
    return true;
}

// Função para validar os dígitos verificadores do CPF
function validarDigitoCPF(cpf) {
    let soma = 0;
    let resto;

    if (cpf === '00000000000') return false;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
}

// Função para validar CEP
function validarCEP(idCampo) {
    const elemento = document.getElementById(idCampo);
    if (!elemento) {
        console.error(`Elemento com ID ${idCampo} não encontrado.`);
        return false;
    }
    const span = elemento.nextElementSibling;
    const cep = elemento.value.replace(/\D/g, '');

    elemento.classList.remove("is-valid", "is-invalid");

    if (cep.length !== 8) {
        span.textContent = 'CEP inválido';
        elemento.classList.add('is-invalid');
        return false;
    }

    span.textContent = '';
    elemento.classList.add('is-valid');
    return true;
}

// Função para validar idade
function validarIdade(idCampo) {
    const elemento = document.getElementById(idCampo);
    if (!elemento) {
        console.error(`Elemento com ID ${idCampo} não encontrado.`);
        return false;
    }
    const span = elemento.nextElementSibling;
    const dataNascimento = elemento.value;

    elemento.classList.remove("is-valid", "is-invalid");

    if (!dataNascimento) {
        span.textContent = 'A data de nascimento não pode estar vazia';
        elemento.classList.add("is-invalid");
        return false;
    }

    const idade = calcularIdade(dataNascimento);

    if (idade < 18 || idade > 120) {
        span.textContent = 'A idade deve estar entre 18 e 120 anos';
        elemento.classList.add("is-invalid");
        return false;
    }

    span.textContent = '';
    elemento.classList.add("is-valid");
    return true;
}

// Função para calcular idade
function calcularIdade(dataNascimento) {
    const dataNasc = new Date(dataNascimento);
    const dataAtual = new Date();

    let idade = dataAtual.getFullYear() - dataNasc.getFullYear();
    const mesAtual = dataAtual.getMonth();
    const mesNasc = dataNasc.getMonth();

    if (mesAtual < mesNasc || (mesAtual === mesNasc && dataAtual.getDate() < dataNasc.getDate())) {
        idade--;
    }
    return idade;
}

// Função para mascarar CPF
function mascaraCPF(campo) {
    campo.maxLength = 14;
    campo.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    });
}

mascaraCPF(document.getElementById('cpf'));

// Função para mascarar CEP
function mascaraCEP(campo) {
    campo.maxLength = 9;
    campo.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2');
    });
}

mascaraCEP(document.getElementById('cep'));

// Função para mascarar celular
function mascaraCelular(campo) {
    campo.maxLength = 15;
    campo.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/\D/g, '')
            .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    });
}

mascaraCelular(document.getElementById('celular'));

// Função para mascarar telefone
function mascaraTelefone(campo) {
    campo.maxLength = 14;
    campo.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/\D/g, '')
            .replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    });
}

mascaraTelefone(document.getElementById('telefone'));

// Função para buscar endereço pelo CEP
function buscarEndereco(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('endereco').value = data.logradouro;
            document.getElementById('cidade').value = data.localidade;
            document.getElementById('estado').value = data.uf;
        })
        .catch(error => {
            console.error('Erro ao buscar endereço:', error);
        });
}

// Event listener para preencher os campos de endereço ao perder o foco do campo CEP
document.getElementById('cep').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        buscarEndereco(cep);
    }
});

// Função para validar campo preenchido
function validarCampoPreenchido(idCampo) {
    const elemento = document.getElementById(idCampo);
    if (!elemento) {
        console.error(`Elemento com ID ${idCampo} não encontrado.`);
        return false;
    }
    const span = elemento.nextElementSibling;
    const valor = elemento.value.trim();

    elemento.classList.remove("is-valid", "is-invalid");

    if (valor.length === 0) {
        span.textContent = 'O campo não pode estar vazio';
        elemento.classList.add("is-invalid");
        return false;
    }

    span.textContent = '';
    elemento.classList.add("is-valid");
    return true;
}

    function salvarCadastro() {
        // Obtém os valores dos campos do formulário
        const nome = document.getElementById('name').value;
        const nomeMaterno = document.getElementById('motherName').value;
        const email = document.getElementById('email').value;
        const dob = document.getElementById('dob').value;
        const cpf = document.getElementById('cpf').value;
        const cep = document.getElementById('cep').value;
        const endereco = document.getElementById('endereco').value;
        const numero = document.getElementById('number').value;
        const cidade = document.getElementById('cidade').value;
        const estado = document.getElementById('estado').value;
        const celular = document.getElementById('celular').value;
        const telefone = document.getElementById('telefone').value;
        const login = document.getElementById('signupUsername').value;
        const senha = document.getElementById('signupPassword').value;
    
        // Cria um objeto com os dados do usuário
        const usuario = {
            nome: nome,
            nomeMaterno: nomeMaterno,
            email: email,
            cpf: cpf,
            cep: cep,
            endereco: endereco,
            numero: numero,
            cidade: cidade,
            estado: estado,
            celular: celular,
            telefone: telefone,
            login: login,
            senha: senha
        };
    
        // Converte o objeto para JSON e salva no localStorage
        localStorage.setItem('usuario', JSON.stringify(usuario));
    
        // Exibe uma mensagem de sucesso
        alert('Cadastro realizado com sucesso!');
    }

// Event listener para validação dos campos ao submeter o formulário
document.getElementById('cadastrar').addEventListener('click', function(event) {
    event.preventDefault(); // Evita que o formulário seja enviado

    // Array com os IDs dos campos do formulário
    const campos = ['name', 'motherName', 'email', 'dob', 'cpf', 'cep', 'endereco', 'number', 'cidade', 'estado', 'celular', 'signupUsername', 'signupPassword'];
    let formValido = true;

    // Valida cada campo do formulário
    campos.forEach(campo => {
        const valido = validarCampoPreenchido(campo);
        if (!valido) formValido = false;
    });

    // Verifica se todos os campos são válidos
    if (formValido) {
        // Se todos os campos forem válidos, salva os dados no localStorage
        salvarCadastro();
    } else {
        // Se algum campo for inválido, exibe uma mensagem de erro
        alert('Por favor, preencha todos os campos corretamente.');
    }
});

document.getElementById('entrar').addEventListener('click', function(event) {
    event.preventDefault(); // Evita que o formulário seja enviado

    // Obtém os valores dos campos do formulário
    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    // Recupera os dados do usuário armazenados no localStorage
    const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));

    // Verifica se o usuário e a senha correspondem aos dados salvos
    if (usuarioSalvo && usuarioSalvo.login === login && usuarioSalvo.senha === senha) {
        alert('Login bem-sucedido!');
        // Aqui você pode redirecionar o usuário para a página de perfil, por exemplo
    } else {
        alert('Usuário ou senha inválidos.');
    }
});