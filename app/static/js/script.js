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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar criptomoedas');
                }
                return response.json();
            })
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

    function fetchMarketAnalysis() {
        const notificationsDiv = document.getElementById('notifications');
        
        // Mostrar estado de carregamento com animação
        notificationsDiv.innerHTML = `
            <div class="loading-analysis">
                <div class="spinner"></div>
                <p>Buscando as melhores oportunidades de mercado...</p>
            </div>
        `;
    
        fetch('/analyze-market')
            .then(response => {
                if (!response.ok) throw new Error('Erro ao buscar análise de mercado');
                return response.json();
            })
            .then(data => {
                notificationsDiv.innerHTML = '';
    
                if (data.error) {
                    showErrorMessage(data.error);
                    return;
                }
    
                // Filtrar apenas as moedas mais relevantes (top 5% ou que atendam a critérios específicos)
                const relevantCryptos = filterRelevantCryptos(data.recommendations || []);
                
                if (relevantCryptos.length === 0) {
                    showNoOpportunitiesMessage();
                    return;
                }
    
                // Exibir resumo do mercado
                displayMarketSummary(data.market_summary);
    
                // Exibir apenas as 3 melhores oportunidades
                const topOpportunities = relevantCryptos.slice(0, 3);
                displayOpportunities(topOpportunities);
    
                // Botão para ver mais oportunidades (se houver)
                if (relevantCryptos.length > 3) {
                    addShowMoreButton(relevantCryptos.slice(3));
                }
    
                addRefreshSection();
            })
            .catch(error => {
                console.error('Erro na análise:', error);
                showErrorMessage('Erro ao analisar as melhores oportunidades. Tente novamente.');
            });
    
        // Funções auxiliares para melhor organização
        function filterRelevantCryptos(recommendations) {
            return recommendations
                .filter(crypto => {
                    // Critérios para considerar uma moeda relevante:
                    // 1. Alta confiança (>70%) OU
                    // 2. Grande variação de preço (>5%) OU
                    // 3. Recomendação de compra com potencial alto
                    return crypto.confidence > 70 || 
                           Math.abs(crypto.price_change_24h) > 5 || 
                           (crypto.action.toLowerCase().includes('comprar') && crypto.potential_gain > 10);
                })
                .sort((a, b) => {
                    // Ordenar por: maior confiança, depois maior potencial de ganho
                    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
                    return b.potential_gain - a.potential_gain;
                });
        }
    
        function displayMarketSummary(summary) {
            if (!summary) return;
            
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'market-summary';
            
            summaryDiv.innerHTML = `
                <h3>📊 Resumo do Mercado</h3>
                <div class="summary-grid">
                    <div class="summary-item ${summary.sentiment === 'positive' ? 'positive' : 'negative'}">
                        <span>Sentimento:</span>
                        <strong>${summary.sentiment === 'positive' ? 'Positivo 🚀' : 'Negativo ⚠️'}</strong>
                    </div>
                    <div class="summary-item ${summary.top_gainer_change > 0 ? 'positive' : ''}">
                        <span>Melhor desempenho (24h):</span>
                        <strong>${summary.top_gainer || 'N/A'} ${summary.top_gainer_change > 0 ? '+' : ''}${summary.top_gainer_change}%</strong>
                    </div>
                    <div class="summary-item ${summary.top_loser_change < 0 ? 'negative' : ''}">
                        <span>Maior queda (24h):</span>
                        <strong>${summary.top_loser || 'N/A'} ${summary.top_loser_change}%</strong>
                    </div>
                </div>
                <p class="summary-advice">${getMarketAdvice(summary.sentiment, summary.volatility)}</p>
            `;
            
            notificationsDiv.appendChild(summaryDiv);
        }
    
        function getMarketAdvice(sentiment, volatility) {
            if (sentiment === 'positive' && volatility < 30) {
                return "💡 Mercado em alta com baixa volatilidade - bom momento para investimentos consistentes";
            } else if (sentiment === 'positive' && volatility >= 30) {
                return "💡 Mercado em alta mas volátil - considere proteções contra quedas bruscas";
            } else if (sentiment === 'negative' && volatility < 30) {
                return "💡 Mercado em baixa estável - oportunidades de compra podem aparecer";
            } else {
                return "💡 Mercado volátil - cuidado com movimentos bruscos e considere stop-loss";
            }
        }
    
        function displayOpportunities(opportunities) {
            opportunities.forEach((opp, index) => {
                const oppElement = document.createElement('div');
                oppElement.className = `notification ${opp.urgency} highlight`;
                
                // Ícone e cor baseado na ação
                const { icon, color } = getOppIconAndColor(opp);
                
                oppElement.innerHTML = `
                    <div class="opportunity-header" style="border-left: 4px solid ${color}">
                        <span class="opp-icon">${icon}</span>
                        <h4>${opp.name} (${opp.symbol})</h4>
                        <span class="opp-price">$${opp.price.toFixed(2)}</span>
                    </div>
                    <div class="opportunity-content">
                        <div class="opp-action ${opp.action.toLowerCase().includes('comprar') ? 'buy' : 'sell'}">
                            <strong>${opp.action.toUpperCase()}</strong>
                        </div>
                        <p><strong>Potencial:</strong> 
                            <span class="${opp.potential_gain > 0 ? 'positive' : 'negative'}">
                                ${opp.potential_gain > 0 ? '+' : ''}${opp.potential_gain}%
                            </span>
                            (${opp.confidence}% de confiança)
                        </p>
                        <p class="opp-reason">${opp.reason}</p>
                    </div>
                    <div class="opportunity-footer">
                        <div class="opp-stats">
                            <span>24h: <span class="${opp.price_change_24h >= 0 ? 'positive' : 'negative'}">
                                ${opp.price_change_24h >= 0 ? '+' : ''}${opp.price_change_24h}%
                            </span></span>
                            <span>Vol: $${opp.volume_24h.toLocaleString()}</span>
                        </div>
                        <button class="details-btn" data-id="${opp.id}">Detalhes</button>
                    </div>
                `;
                
                // Animação de entrada
                setTimeout(() => {
                    oppElement.style.opacity = '1';
                    oppElement.style.transform = 'translateY(0)';
                }, index * 150);
                
                notificationsDiv.appendChild(oppElement);
            });
        }
    
        function getOppIconAndColor(opportunity) {
            if (opportunity.action.toLowerCase().includes('comprar')) {
                return {
                    icon: '🟢',
                    color: '#2ecc71'
                };
            } else if (opportunity.action.toLowerCase().includes('vender')) {
                return {
                    icon: '🔴',
                    color: '#e74c3c'
                };
            } else {
                return {
                    icon: '🟡',
                    color: '#f39c12'
                };
            }
        }
    
        function addShowMoreButton(hiddenOpportunities) {
            const showMoreDiv = document.createElement('div');
            showMoreDiv.className = 'show-more';
            showMoreDiv.innerHTML = `
                <button id="show-more-btn" class="show-more-btn">
                    ↓ Mostrar mais oportunidades (${hiddenOpportunities.length})
                </button>
            `;
            
            notificationsDiv.appendChild(showMoreDiv);
            
            document.getElementById('show-more-btn').addEventListener('click', () => {
                showMoreDiv.remove();
                displayOpportunities(hiddenOpportunities);
            });
        }
    
        function showNoOpportunitiesMessage() {
            notificationsDiv.innerHTML = `
                <div class="notification info">
                    <p>ℹ️ Nenhuma oportunidade relevante encontrada no momento.</p>
                    <p>O mercado está estável sem movimentos significativos. Verifique novamente mais tarde.</p>
                </div>
            `;
        }
    
        function showErrorMessage(message) {
            notificationsDiv.innerHTML = `
                <div class="notification error">
                    <p>⚠️ ${message}</p>
                    <button id="retry-analysis" class="retry-btn">Tentar novamente</button>
                </div>
            `;
            document.getElementById('retry-analysis').addEventListener('click', fetchMarketAnalysis);
        }
    
        function addRefreshSection() {
            const refreshDiv = document.createElement('div');
            refreshDiv.className = 'refresh-section';
            refreshDiv.innerHTML = `
                <button id="refresh-analysis" class="refresh-btn">
                    🔄 Atualizar Análise
                </button>
                <span class="last-updated">Atualizado: ${new Date().toLocaleTimeString()}</span>
            `;
            notificationsDiv.appendChild(refreshDiv);
            document.getElementById('refresh-analysis').addEventListener('click', fetchMarketAnalysis);
        }
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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados da criptomoeda');
                }
                return response.json();
            })
            .then(data => {
                const priceInUSD = data.market_data.current_price.usd;
                const convertedAmount = amount * priceInUSD;

                document.getElementById('result').innerText = 
                    `${amount} ${data.name} = ${convertedAmount.toFixed(2)} ${to.toUpperCase()}`;
            })
            .catch(error => {
                console.error('Erro:', error);
                document.getElementById('result').innerText = 'Erro ao converter moeda. Tente novamente.';
            });
    });
});