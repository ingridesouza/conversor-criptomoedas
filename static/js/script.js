// script.js

document.addEventListener('DOMContentLoaded', function () {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Verificar o tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-mode') {
        body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️ Modo Claro';
    } else {
        themeToggleBtn.textContent = '🌙 Modo Noturno';
    }

    // Alternar entre modo claro e noturno
    themeToggleBtn.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');

        // Atualizar o texto do botão de tema
        const currentLanguage = localStorage.getItem('language') || 'en';
        if (isDarkMode) {
            themeToggleBtn.textContent = '☀️ ' + translations[currentLanguage].theme;
        } else {
            themeToggleBtn.textContent = '🌙 ' + translations[currentLanguage].theme;
        }
    });

    // Buscar a lista de criptomoedas
    fetch('/get-top-cryptos')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#crypto-table tbody');
            const fromSelect = document.getElementById('from');

            data.forEach((crypto, index) => {
                // Preencher a tabela
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td><img src="${crypto.image}" alt="${crypto.name}" class="crypto-icon"> ${crypto.name} (${crypto.symbol.toUpperCase()})</td>
                    <td>$${crypto.current_price.toFixed(2)}</td>
                    <td>$${crypto.market_cap.toLocaleString()}</td>
                    <td>$${crypto.total_volume.toLocaleString()}</td>
                    <td class="${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">${crypto.price_change_percentage_24h.toFixed(2)}%</td>
                `;
                tableBody.appendChild(row);

                // Preencher o seletor do conversor
                const option = document.createElement('option');
                option.value = crypto.id;
                option.text = `${crypto.name} (${crypto.symbol.toUpperCase()})`;
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

        fetch(`/crypto/${from}`)
            .then(response => response.json())
            .then(data => {
                const priceInUSD = data.market_data.current_price.usd;
                const convertedAmount = amount * priceInUSD;

                document.getElementById('result').innerText = 
                    `${amount} ${data.name} = ${convertedAmount.toFixed(2)} ${to.toUpperCase()}`;
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    });
});