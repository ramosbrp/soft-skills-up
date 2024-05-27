import { updateHeader } from './header.js';

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

document.addEventListener('DOMContentLoaded', function () {
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  const openSignupModalBtn = document.getElementById('openSignupModal');
  const closeLoginModalBtn = document.getElementById('closeLoginModal');
  const closeSignupModalBtn = document.getElementById('closeSignupModal');


  openSignupModalBtn.addEventListener('click', function () {
    signupModal.style.display = 'block';
  });

  closeLoginModalBtn.addEventListener('click', function () {
    loginModal.style.display = 'none';
  });

  closeSignupModalBtn.addEventListener('click', function () {
    signupModal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target == loginModal) {
      loginModal.style.display = 'none';
    }
    if (event.target == signupModal) {
      signupModal.style.display = 'none';
    }
  });
});
// Função genérica para validar texto
function validarTexto(idCampo, mensagemErro, minCaracteres, maxCaracteres, regex) {
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
    spanError.textContent = 'O campo não pode estar vazio';
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
function validarNome(idCampo) {
  const mensagemErro = 'O nome não pode possuir números ou caracteres especiais';
  const regex = /^[A-Za-zÀ-ÿ\s]+$/;
  return validarTexto(idCampo, mensagemErro, 15, 80, regex);
}

// Função para validar nome materno
function validarmotherNome(idCampo) {
  const mensagemErro = 'O nome não pode possuir números ou caracteres especiais';
  const regex = /^[A-Za-zÀ-ÿ\s]+$/;
  return validarTexto(idCampo, mensagemErro, 5, 80, regex);
}

// Função para validar CPF
function validarCPF(idCampo) {
  const mensagemErro = 'CPF inválido';
  const regex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
  return validarTexto(idCampo, mensagemErro, 14, 14, regex);
}

// Função para validar e-mail
function validarEmail(idCampo) {
  const mensagemErro = 'Formato de e-mail inválido';
  const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return validarTexto(idCampo, mensagemErro, 0, Infinity, regex);
}

function validarTelefone(idCampo) {
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

function formatarNumeroTelefone(numero) {
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

// Aplicar máscara ao campo de telefone e adicionar evento de validação
const campoTelefone = document.getElementById('telefone');
if (campoTelefone) {
  campoTelefone.addEventListener('input', function () {
    validarTelefone('telefone');
  });
}

// Função para validar idade
function validarIdade(idCampo) {
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
    spanError.textContent = 'A data de nascimento não pode estar vazia';
    elemento.classList.add("is-invalid");
    return false;
  }

  const idade = calcularIdade(dataNascimento);

  if (idade < 18 || idade > 120) {
    spanError.textContent = 'A idade deve ser maior que 18';
    elemento.classList.add("is-invalid");
    return false;
  }

  spanError.textContent = '';
  spanSuccess.textContent = 'Válido';
  spanSuccess.classList.add("success-message");
  elemento.classList.add("is-valid");
  return true;
}

// Função para calcular idade
function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade;
}

// Função para aplicar máscara ao campo CPF
const campoCPF = document.getElementById('cpf');
if (campoCPF) {
  mascaraCPF(campoCPF);
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

// Função para validar CEP com o preenchimento automático
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
}

jQuery(document).ready(function ($) {

  /*SETUP DE CAMPOS DO FORMULÁRIO - Altere com seus seletores abaixo! */
  var cepId = '#cep';
  var enderecoId = '#rua';
  var bairroId = '#bairro';
  var cidadeId = '#cidade';
  var estadoId = '#estado';


  function setLoading(loading) {
    var loadingText = 'Carregando...';
    if (loading) {
      $(enderecoId).val(loadingText);
      $(bairroId).val(loadingText);
      $(cidadeId).val(loadingText);
      $(estadoId).val(loadingText);
    } else {
      $(enderecoId).val('');
      $(bairroId).val('');
      $(cidadeId).val('');
      $(estadoId).val('');
    }
  }

  function preencherEndereco() {
    var cep = $(cepId).val().replace(/\D/g, '');
    console.log("CEP digitado: ", cep); // Debug
    if (cep !== "") {
      setLoading(true);
      $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
        setLoading(false);
        console.log("Dados recebidos: ", dados); // Debug
        if (!("erro" in dados)) {
          $('#rua').val(dados.logradouro);
          $('#bairro').val(dados.bairro);
          $('#cidade').val(dados.localidade);
          $('#estado').val(dados.uf);
          // Adiciona a mensagem de "Válido" ao campo CEP
          const elemento = document.getElementById('cep');
          const spanSuccess = elemento.nextElementSibling.nextElementSibling;
          spanSuccess.textContent = 'Válido';
          spanSuccess.classList.add("success-message");
          elemento.classList.add("is-valid");

          const camposEndereco = ['endereco', 'bairro', 'cidade', 'estado',];
          camposEndereco.forEach(campo => {
            const elementoEndereco = document.getElementById(campo);
            const spanSuccessEndereco = elementoEndereco.nextElementSibling.nextElementSibling;
            spanSuccessEndereco.textContent = 'Válido';
            spanSuccessEndereco.classList.add("success-message");
            elementoEndereco.classList.add("is-valid");
          });

        } else {
          const elemento = document.getElementById('cep');
          const span = elemento.nextElementSibling;
          span.textContent = 'CEP não encontrado'; // Define a mensagem de erro no span
          elemento.classList.add('is-invalid');
        }
      }).fail(function () {
        setLoading(false);
        alert("Erro ao buscar o CEP.");
      });
    } else {
      const elemento = document.getElementById('cep');
      const span = elemento.nextElementSibling;
      span.textContent = 'CEP inválido'; // Define a mensagem de erro no span
      elemento.classList.add('is-invalid');
    }
  }
  $('#number').on('input', function () {
    const numero = $(this).val().trim();
    if (numero !== '') {
      const elementoNumero = document.getElementById('number');
      const spanSuccessNumero = elementoNumero.nextElementSibling.nextElementSibling;
      spanSuccessNumero.textContent = 'Válido';
      spanSuccessNumero.classList.add("success-message");
      elementoNumero.classList.add("is-valid");
    }
  });


  $(cepId).on('blur', preencherEndereco);

  $('#number').on('input', function () {
    var enderecoCompleto = $('#rua').val() + ', ' +
      $('#number').val() + ', ' +
      $('#cidade').val() + ', ' +
      $('#estado').val();
    $('#endereco-completo').val(enderecoCompleto);
  });
});

// Função para mascarar CEP
function mascaraCEP(campo) {
  campo.maxLength = 9;
  campo.addEventListener('input', function (event) {
    event.target.value = event.target.value.replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2');
  });
}

mascaraCEP(document.getElementById('cep'));

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
      // console.error('Erro ao buscar endereço:', error);
    });
}

// Event listener para preencher os campos de endereço ao perder o foco do campo CEP
document.getElementById('cep').addEventListener('blur', function () {
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
  const telefone = document.getElementById('telefone').value;
  const login = document.getElementById('signupUsername').value;
  const senha = document.getElementById('signupPassword').value;

  // Cria um objeto com os dados do usuário
  const usuario = {
    nome: nome,
    nomeMaterno: nomeMaterno,
    dob: dob,
    email: email,
    cpf: cpf,
    cep: cep,
    endereco: endereco,
    numero: numero,
    cidade: cidade,
    estado: estado,
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
document.getElementById('cadastrar').addEventListener('click', function (event) {
  event.preventDefault(); // Evita que o formulário seja enviado

  // Array com os IDs dos campos do formulário
  const campos = ['name', 'motherName', 'email', 'dob', 'cpf', 'cep', 'endereco', 'number', 'cidade', 'estado', 'telefone', 'signupUsername', 'signupPassword'];
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

document.getElementById('entrar').addEventListener('click', function (event) {
  event.preventDefault(); // Evita que o formulário seja enviado

  // Obtém os valores dos campos do formulário
  const login = document.getElementById('login').value;
  const senha = document.getElementById('senha').value;

  // Recupera os dados do usuário armazenados no localStorage
  const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));

  // Verifica se o usuário e a senha correspondem aos dados salvos
  if (usuarioSalvo && usuarioSalvo.login === login && usuarioSalvo.senha === senha) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', login);
    document.dispatchEvent(new CustomEvent('userLoggedIn'));
    window.location.href = '../pages/artigo.html';
    alert('Login bem-sucedido!');
  } else {
    alert('Usuário ou senha inválidos.');
  }
});