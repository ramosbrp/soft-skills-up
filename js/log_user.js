// Variáveis
const logTableBody = document.getElementById('logTableBody');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    buscaLogs();
})


const buscaLogs = async () => {
    const response = await fetch('../controllers/getLogs.php', {
        method: 'GET',
    });


    if (!response.ok)
        throw new Error("Error");

    const data = await response.json();
    data.reverse();

    data.forEach((item)=>{
        var row = logTableBody.insertRow();
        row.insertCell().textContent = item.log_date;
        row.insertCell().textContent = item.user_id;
        row.insertCell().textContent = item.action;
        row.insertCell().textContent = item.details;
    });

}
