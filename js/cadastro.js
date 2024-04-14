
const viaCepAPI = 'https://viacep.com.br/ws';


const buscaCep = async (cep) => {
    try {
        const response = await fetch(`${viaCepAPI}/${cep}/json`);
        if (!response.ok) {
            throw new Error("Não foi possível  obter dados.");
        }
        const data = await response.json();
        if (data.erro) {
            alert("CEP não encontrado!");
            return
        }

        //Preenche os campos
        document.getElementById('logradouro').value = data.logradouro;
        document.getElementById('cidade').value = data.localidade;
        document.getElementById('uf').value = data.uf;

    }
    catch (error) {
        alert(error.message);
    }

}


var inputCep = document.getElementById("cep")
inputCep.addEventListener('blur', ()=>{
    buscaCep(inputCep.value);
});