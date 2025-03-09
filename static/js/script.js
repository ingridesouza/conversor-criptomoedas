document.addEventListener('DOMContentLoaded', function () {
    // Buscar a lista de criptomoedas ao carregar a página
    fetch('/get-cryptos')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('from');
            data.forEach(crypto => {
                const option = document.createElement('option');
                option.value = crypto.id;
                option.text = `${crypto.name} (${crypto.symbol.toUpperCase()})`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar criptomoedas:', error);
        });
});

document.getElementById('converter-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const amount = document.getElementById('amount').value;

    console.log("Dados enviados:", { from, to, amount });  // Log dos dados

    fetch('/convert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to, amount }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Resposta do backend:", data);  // Log da resposta
        if (data.error) {
            document.getElementById('result').innerText = data.error;
        } else {
            document.getElementById('result').innerText = 
                `${data.amount} ${data.from} = ${data.converted_amount.toFixed(2)} ${data.to} (Taxa: ${data.rate.toFixed(6)})`;
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});