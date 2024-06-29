//Variáveis
const userTableBody = document.getElementById('user-table-body');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    buscaUsers();
})

const buscaUsers = async () => {
    const response = await fetch('../controllers/getUsers.php', {
        method: 'GET'
    });

    if (!response.ok)
        throw new Error("Error");

    const data = await response.json();
    data.reverse();
    console.log(data);

    data.forEach((item)=>{
        var row = userTableBody.insertRow();
        row.insertCell().textContent = item.nome;
        row.insertCell().textContent = item.email;
    });
}