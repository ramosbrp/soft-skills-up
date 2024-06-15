// import { updateHeader } from './header.js';

// Variáveis
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const dataNascimento = document.getElementById('dataNascimento');
const nome = document.getElementById('nome');
const nomeMae = document.getElementById('nomeMae');
const campoTelefone = document.getElementById('telefone');
const campoCPF = document.getElementById('cpf');
const cep = document.getElementById('cep');
const rua = document.getElementById('rua');
const bairro = document.getElementById('bairro');
const cidade = document.getElementById('cidade');
const estado = document.getElementById('estado');
const email = document.getElementById('email');
const telefone = document.getElementById('telefone');
const viaCepAPI = 'https://viacep.com.br/ws';
const loginForm = document.getElementById('login-form');
const cadastroForm = document.getElementById('cadastro-form');
const signupPassword = document.getElementById('signupPassword');
const reSignupPassword = document.getElementById('reSignupPassword');


// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');

  window.addEventListener('click', function (event) {
    if (event.target == loginModal) {
      loginModal.style.display = 'none';
    }
    if (event.target == signupModal) {
      signupModal.style.display = 'none';
    }
  });

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    logar(event.target);
  });

  cadastroForm.addEventListener('submit', (event) => {
    event.preventDefault();
    cadastrar(event.target);
  });
});

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

nome.addEventListener('blur', () => {
  validarNome('nome');
});

nomeMae.addEventListener('blur', () => {
  validarNomeMae('nomeMae');
});

dataNascimento.addEventListener('blur', () => {
  validarIdade('dataNascimento');
});

// Event listener para preencher os campos de endereço ao perder o foco do campo CEP
cep.addEventListener('blur', function () {
  const cep = this.value.replace(/\D/g, '');
  if (cep.length === 8) {
    buscarEndereco(cep);
  }
});

campoCPF.addEventListener('blur', () => {
  // mascaraCPF('cpf');
  validarCPF('cpf');
});

email.addEventListener('blur', () => {
  validarEmail('email');
});

telefone.addEventListener('blut', () => {
  validarTelefone('telefone');
});

// Verifica se as senhas são iguais
reSignupPassword.addEventListener('change', ()=>{
  console.log(reSignupPassword.value);
  if(reSignupPassword.value != signupPassword.value)
    toastr.error('As senha devem ser iguais.');
});





// Funcções
// Função genérica para validar texto
const validarTexto = (idCampo, mensagemErro, minCaracteres, maxCaracteres, regex) => {
  const elemento = document.getElementById(idCampo);
  if (!elemento) {
    console.error(`Elemento com ID ${idCampo} não encontrado.`);
    return false;
  }
  const spanSuccess = elemento.nextElementSibling.nextElementSibling;
  const spanError = elemento.nextElementSibling;
  const texto = elemento.value.trim();
  elemento.classList.remove("is-valid", "is-invalid");

  if (texto.length === 0) {
    spanError.textContent = 'O campo não pode estar vazio.';
    toastr.error('Revise os campos');
    elemento.classList.add('is-invalid');
    return false;
  }

  if (texto.length < minCaracteres) {
    spanError.textContent = "Precisa ter no mínimo " + minCaracteres + " caracteres";
    elemento.classList.add('is-invalid');
    return false;
  }

  if (texto.length > maxCaracteres) {
    spanError.textContent = "Máximo " + maxCaracteres + "caracteres";
    elemento.classList.add('is-invalid');
    return false;
  }

  if (!regex.test(texto)) {
    spanError.textContent = mensagemErro;
    elemento.classList.add('is-invalid');
    return false;
  }

  spanError.textContent = '';
  spanSuccess.textContent = 'Válido';
  spanSuccess.classList.add("success-message");
  elemento.classList.add("is-valid");
  return true;
}

// Função para validar nome
const validarNome = (idCampo) => {
  const mensagemErro = 'O nome não pode possuir números ou caracteres especiais';
  const regex = /^[A-Za-zÀ-ÿ\s]+$/;
  return validarTexto(idCampo, mensagemErro, 15, 80, regex);
}

// Função para validar nome materno
const validarNomeMae = (idCampo) => {
  const mensagemErro = 'O nome não pode possuir números ou caracteres especiais';
  const regex = /^[A-Za-zÀ-ÿ\s]+$/;
  return validarTexto(idCampo, mensagemErro, 5, 80, regex);
}

// Função para validar CPF
const validarCPF = (idCampo) => {
  const mensagemErro = 'CPF inválido';
  const regex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
  return validarTexto(idCampo, mensagemErro, 14, 14, regex);
}

// Função para validar e-mail
const validarEmail = (idCampo) => {
  const mensagemErro = 'Formato de e-mail inválido';
  const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return validarTexto(idCampo, mensagemErro, 0, Infinity, regex);
}

const validarTelefone = (idCampo) => {
  const mensagemErro = 'O telefone deve ser válido';
  const regex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
  const elemento = document.getElementById(idCampo);
  const spanError = elemento.nextElementSibling; // Assume que o span de erro é o próximo irmão do campo
  const spanSuccess = spanError.nextElementSibling; // Assume que o span de sucesso é o próximo irmão do span de erro
  const texto = elemento.value.trim();
  elemento.classList.remove("is-valid", "is-invalid");

  if (texto.length === 0) {
    spanError.textContent = 'O campo não pode estar vazio';
    elemento.classList.add('is-invalid');
    return false;
  }
  const digitsOnly = texto.replace(/\D/g, '');
  const formattedPhoneNumber = formatarNumeroTelefone(texto);
  if (!formattedPhoneNumber) {
    spanError.textContent = 'Número de telefone inválido';
    elemento.classList.add('is-invalid');
    spanSuccess.textContent = '';
    return false;
  }

  // Atualiza o valor do campo com o número formatado
  elemento.value = formattedPhoneNumber;

  spanError.textContent = '';
  spanSuccess.textContent = 'Válido';
  spanSuccess.classList.add("success-message");
  elemento.classList.add("is-valid");
  return true;
}
// Função para formatar número de telefone

const formatarNumeroTelefone = (numero) => {
  // Remove todos os caracteres não numéricos do número
  const digitsOnly = numero.replace(/\D/g, '');

  // Verifica se o número possui a quantidade correta de dígitos
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 2)})${digitsOnly.slice(2, 6)}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 11) {
    return `(${digitsOnly.slice(0, 2)})${digitsOnly.slice(2, 7)}-${digitsOnly.slice(7)}`;
  } else {
    return null; // Retorna null se o número de telefone for inválido
  }
}

// Função para mascarar CEP
const mascaraCEP = (campo) => {
  campo.maxLength = 9;
  campo.addEventListener('input', function (event) {
    event.target.value = event.target.value.replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2');
  });
}

// Função para validar idade
const validarIdade = (idCampo) => {
  const elemento = document.getElementById(idCampo);
  if (!elemento) {
    console.error(`Elemento com ID ${idCampo} não encontrado.`);
    return false;
  }
  const spanError = elemento.nextElementSibling;
  const spanSuccess = spanError.nextElementSibling;
  const dataNascimento = elemento.value;

  elemento.classList.remove("is-valid", "is-invalid");

  if (!dataNascimento) {
    toastr.error('A data de nascimento não pode estar vazia.');
    elemento.classList.add("is-invalid");
    return false;
  }

  const idade = calcularIdade(dataNascimento);

  if (idade < 18 || idade > 120) {
    toastr.error('A idade deve ser maior que 18.');
    elemento.classList.add("is-invalid");
    return false;
  }

  spanError.textContent = '';
  spanSuccess.textContent = 'Válido';
  spanSuccess.classList.add("success-message");
  elemento.classList.add("is-valid");
  return true;
}

// Função para mascarar CPF
const mascaraCPF = (campo) => {
  campo.maxLength = 14;
  campo.addEventListener('input', function (event) {
    event.target.value = event.target.value.replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  });
}

// Função para calcular idade
const calcularIdade = (dataNascimento) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade;
}

// Função para validar CEP com o preenchimento automático
const validarCEP = (idCampo) => {
  const elemento = document.getElementById(idCampo);
  if (!elemento) {
    console.error(`Elemento com ID ${idCampo} não encontrado.`);
    return false;
  }
  const span = elemento.nextElementSibling;
  const cep = elemento.value.replace(/\D/g, '');

  elemento.classList.remove("is-valid", "is-invalid");

  if (cep.length !== 8) {
    span.textContent = 'CEP inválido.';
    toastr.error('CEP inválido.');
    elemento.classList.add('is-invalid');
    return false;
  }
}

// Função para aplicar máscara ao campo CPF
if (campoCPF) {
  mascaraCPF(campoCPF);
}

// Função para buscar endereço pelo CEP
const buscarEndereco = async (cep) => {

  try {
    const response = await fetch(`${viaCepAPI}/${cep}/json/`);
    if (!response.ok)
      throw new Error("Não foi possível obter dados");

    const data = await response.json();
    if (data.erro) {
      toastr.error('CEP não encontrado');
      return
    }
    rua.value = data.logradouro;
    cidade.value = data.localidade;
    estado.value = data.uf;
    bairro.value = data.bairro;

  } catch (error) {
    toastr.error(error.message);
  }

}

// Função para validar campo preenchido
const validarCampoPreenchido = (idCampo) => {
  console.log(idCampo);
  const elemento = document.getElementById(idCampo);
  if (!elemento) {
    console.error(`Elemento com ID ${idCampo} não encontrado.`);
    return false;
  }
  const span = elemento.nextElementSibling;
  const valor = elemento.value.trim();

  elemento.classList.remove("is-valid", "is-invalid");
  span.classList.remove("success-message", "error-message");

  if (valor.length === 0) {
    span.textContent = 'O campo não pode estar vazio';
    span.classList.add("error-message");
    elemento.classList.add("is-invalid");
    return false;
  }

  span.textContent = 'Campo válido';
  span.classList.add("success-message");
  elemento.classList.add("is-valid");
  return true;
}


// Aplicar máscara ao campo de telefone e adicionar evento de validação
if (campoTelefone) {
  campoTelefone.addEventListener('input', function () {
    validarTelefone('telefone');
  });
}

// Função login
const logar = async (formElement) => {

  const formData = new FormData(formElement); // Usar o elemento do formulário passado como argumento

  try {

    const response = await fetch('../controllers/login.php', {
      method: 'POST',
      body: formData
    })
    if (!response.ok)
      throw new Error("Error");

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', data.username);

      $(document).ready(function () {
        toastr.success(data.message);
        setTimeout(function () {
          window.location.href = '../pages/artigo.html';
        }, 2000);
      });

    } else {
      $(document).ready(() => {
        toastr.error(data.message);
      });

      localStorage.setItem('isLoggedIn', 'false');
    }
  } catch (error) {
    console.error('Error:', error);
    toastr.error('An error occurred during login.');
  }

}

// Função cadastrar
const cadastrar = async (formElement) => {

  const formData = new FormData(formElement);

  try {
    const response = await fetch('../controllers/cadastro.php', {
      method: 'POST',
      body: formData
    });
    if (!response.ok)
      throw new Error("Error");


    const data = await response.json();

    if (data.success) {
      $(document).ready(function () {
        toastr.success('Usuário cadastrado!');
        setTimeout(() => {
          container.classList.remove("sign-up-mode");
        }, 2000);
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    toastr.error(error.toString());
  }
}





