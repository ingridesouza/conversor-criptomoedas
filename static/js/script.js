document.addEventListener('DOMContentLoaded', function () {
    // Alternar entre modo claro e noturno
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    themeToggleBtn.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            themeToggleBtn.textContent = '☀️ Modo Claro';
        } else {
            themeToggleBtn.textContent = '🌙 Modo Noturno';
        }
    });

    // Buscar a lista de criptomoedas ao carregar a página
    fetch('/get-top-cryptos')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#crypto-table tbody');
            const fromSelect = document.getElementById('from');

            data.forEach(crypto => {
                // Preencher a tabela
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${crypto.rank}</td>
                    <td>${crypto.name} (${crypto.symbol})</td>
                    <td>${parseFloat(crypto.priceUsd).toFixed(2)}</td>
                    <td>${parseFloat(crypto.marketCapUsd).toLocaleString()}</td>
                    <td>${parseFloat(crypto.vwap24Hr).toFixed(2)}</td>
                    <td>${parseFloat(crypto.supply).toLocaleString()}</td>
                    <td>${parseFloat(crypto.volumeUsd24Hr).toLocaleString()}</td>
                    <td>${parseFloat(crypto.changePercent24Hr).toFixed(2)}%</td>
                `;
                tableBody.appendChild(row);

                // Preencher o select do conversor
                const option = document.createElement('option');
                option.value = crypto.id;
                option.text = `${crypto.name} (${crypto.symbol})`;
                fromSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar criptomoedas:', error);
        });

    // Configurar o conversor
    document.getElementById('converter-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const from = document.getElementById('from').value;
        const to = document.getElementById('to').value;
        const amount = document.getElementById('amount').value;

        fetch('/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ from, to, amount }),
        })
        .then(response => response.json())
        .then(data => {
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
});