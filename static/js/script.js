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

    // Variável para armazenar os dados anteriores das criptomoedas
    let previousCryptoData = [];

    // Função para atualizar os dados das criptomoedas
    function updateCryptoData() {
        fetch('/get-top-cryptos')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#crypto-table tbody');
                const fromSelect = document.getElementById('from');

                // Ordenar os dados pelo maior valor da moeda (current_price)
                data.sort((a, b) => b.current_price - a.current_price);

                // Limpar a tabela e o seletor antes de preencher novamente
                tableBody.innerHTML = '';
                fromSelect.innerHTML = '';

                // Selecionar aleatoriamente 3 das 5 primeiras moedas para animação
                const top5 = data.slice(0, 5); // Pegar as 5 primeiras moedas
                const random3 = top5.sort(() => 0.5 - Math.random()).slice(0, 3); // Selecionar 3 aleatórias

                data.forEach((crypto, index) => {
                    // Verificar se houve mudança no valor da criptomoeda
                    const previousCrypto = previousCryptoData.find(c => c.id === crypto.id);
                    const priceChange = previousCrypto ? crypto.current_price - previousCrypto.current_price : 0;

                    // Criar a linha da tabela
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td><img src="${crypto.image}" alt="${crypto.name}" class="crypto-icon"> ${crypto.name} (${crypto.symbol.toUpperCase()})</td>
                        <td>$${crypto.current_price.toFixed(2)}</td>
                        <td>$${crypto.market_cap.toLocaleString()}</td>
                        <td>$${crypto.total_volume.toLocaleString()}</td>
                        <td class="${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">${crypto.price_change_percentage_24h.toFixed(2)}%</td>
                    `;

                    // Aplicar animação de fundo apenas para 3 moedas aleatórias das 5 primeiras
                    if (random3.includes(crypto) && priceChange !== 0) {
                        row.classList.add(priceChange > 0 ? 'price-up' : 'price-down');
                        setTimeout(() => {
                            row.classList.remove('price-up', 'price-down');
                        }, 1000); // Remover a classe após 1 segundo
                    }

                    tableBody.appendChild(row);

                    // Preencher o seletor do conversor
                    const option = document.createElement('option');
                    option.value = crypto.id;
                    option.text = `${crypto.name} (${crypto.symbol.toUpperCase()})`;
                    fromSelect.appendChild(option);
                });

                // Atualizar os dados anteriores
                previousCryptoData = data;
            })
            .catch(error => {
                console.error('Erro ao buscar criptomoedas:', error);
            });
    }

    // Função para buscar e exibir as notificações de análise de mercado
    function fetchMarketAnalysis() {
        fetch('/analyze-market')
            .then(response => response.json())
            .then(data => {
                const notificationsDiv = document.getElementById('notifications');
                notificationsDiv.innerHTML = ''; // Limpa as notificações antes de preencher

                if (data.error) {
                    notificationsDiv.innerHTML = `<p class="error">${data.error}</p>`;
                    return;
                }

                // Exibir as recomendações
                data.recommendations.forEach(recommendation => {
                    const notification = document.createElement('div');
                    notification.className = 'notification';
                    notification.innerHTML = `
                        <p><strong>${recommendation.name}</strong>: ${recommendation.action} a $${recommendation.price.toFixed(2)}</p>
                        <p>Motivo: ${recommendation.reason}</p>
                    `;
                    notificationsDiv.appendChild(notification);
                });
            })
            .catch(error => {
                console.error('Erro ao buscar análise de mercado:', error);
            });
    }

    // Atualizar os dados das criptomoedas imediatamente e a cada 30 segundos
    updateCryptoData();
    setInterval(updateCryptoData, 30000); // 30 segundos

    // Buscar e exibir as notificações de análise de mercado imediatamente e a cada 60 segundos
    fetchMarketAnalysis();
    setInterval(fetchMarketAnalysis, 60000); // 60 segundos

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

    function fetchMarketAnalysis() {
        fetch('/analyze-market')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar análise de mercado');
                }
                return response.json();
            })
            .then(data => {
                const notificationsDiv = document.getElementById('notifications');
                notificationsDiv.innerHTML = ''; // Limpa as notificações antes de preencher
    
                if (data.error) {
                    notificationsDiv.innerHTML = `<p class="error">${data.error}</p>`;
                    return;
                }
    
                // Exibir as recomendações
                data.recommendations.forEach(recommendation => {
                    const notification = document.createElement('div');
                    notification.className = 'notification';
                    notification.innerHTML = `
                        <p><strong>${recommendation.name}</strong>: ${recommendation.action} a $${recommendation.price.toFixed(2)}</p>
                        <p>Motivo: ${recommendation.reason}</p>
                    `;
                    notificationsDiv.appendChild(notification);
                });
            })
            .catch(error => {
                console.error('Erro ao buscar análise de mercado:', error);
                const notificationsDiv = document.getElementById('notifications');
                notificationsDiv.innerHTML = `<p class="error">Erro ao analisar criptomoedas. Tente novamente mais tarde.</p>`;
            });
    }
});

