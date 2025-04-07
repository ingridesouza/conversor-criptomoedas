document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const converterForm = document.getElementById('converter-form');
    const amountInput = document.getElementById('amount');
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    const swapBtn = document.getElementById('swap-currencies');
    const clearBtn = document.getElementById('clear-amount');
    const resultContainer = document.getElementById('result');
    const resultValue = resultContainer.querySelector('.result-value');
    const resultCurrency = resultContainer.querySelector('.result-currency');
    const rateInfo = resultContainer.querySelector('.rate-value');
    const lastUpdated = resultContainer.querySelector('.updated-value');
    const copyBtn = document.getElementById('copy-result');
    const historyBtn = document.getElementById('converter-history-btn');
    const historyPanel = document.getElementById('conversion-history');
    const closeHistoryBtn = document.getElementById('close-history');
    const historyList = historyPanel.querySelector('.history-list');
    const historyOverlay = document.createElement('div');
    historyOverlay.className = 'history-overlay';
    document.body.appendChild(historyOverlay);
    const copiedMessage = document.createElement('div');
    copiedMessage.className = 'copied-message';
    copiedMessage.textContent = 'Copiado para a área de transferência!';
    document.body.appendChild(copiedMessage);

    // Carregar moedas (exemplo com algumas criptomoedas)
    const currencies = [
        { code: 'usd', name: 'USD - Dólar Americano' },
        { code: 'brl', name: 'BRL - Real Brasileiro' },
        { code: 'eur', name: 'EUR - Euro' },
        { code: 'btc', name: 'BTC - Bitcoin' },
        { code: 'eth', name: 'ETH - Ethereum' },
        { code: 'xrp', name: 'XRP - Ripple' },
        { code: 'ada', name: 'ADA - Cardano' },
        { code: 'sol', name: 'SOL - Solana' }
    ];

    // Preencher select 'from'
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency.code;
        option.textContent = currency.name;
        fromSelect.appendChild(option);
    });

    // Histórico de conversões
    let conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];

    // Mostrar/ocultar botão de limpar
    amountInput.addEventListener('input', function() {
        clearBtn.classList.toggle('visible', this.value !== '');
    });

    // Limpar campo de valor
    clearBtn.addEventListener('click', function() {
        amountInput.value = '';
        this.classList.remove('visible');
        amountInput.focus();
    });

    // Inverter moedas
    swapBtn.addEventListener('click', function() {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
        
        // Se já houver um resultado, converter automaticamente
        if (resultContainer.classList.contains('visible')) {
            convertCurrency();
        }
    });

    // Copiar resultado
    copyBtn.addEventListener('click', function() {
        const textToCopy = `${resultValue.textContent} ${resultCurrency.textContent}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copiedMessage.classList.add('visible');
            setTimeout(() => {
                copiedMessage.classList.remove('visible');
            }, 2000);
        });
    });

    // Abrir/fechar histórico
    historyBtn.addEventListener('click', openHistoryPanel);
    closeHistoryBtn.addEventListener('click', closeHistoryPanel);
    historyOverlay.addEventListener('click', closeHistoryPanel);

    function openHistoryPanel() {
        historyPanel.classList.add('open');
        historyOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
        renderHistory();
    }

    function closeHistoryPanel() {
        historyPanel.classList.remove('open');
        historyOverlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    function renderHistory() {
        historyList.innerHTML = '';
        
        if (conversionHistory.length === 0) {
            historyList.innerHTML = '<p class="empty-history">Nenhuma conversão recente</p>';
            return;
        }
        
        conversionHistory.slice().reverse().forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item-value">${item.result} ${item.toCurrency.toUpperCase()}</div>
                <div class="history-item-details">
                    <span>${item.amount} ${item.fromCurrency.toUpperCase()}</span>
                    <span>1 ${item.fromCurrency.toUpperCase()} = ${item.rate} ${item.toCurrency.toUpperCase()}</span>
                </div>
                <div class="history-item-date">${new Date(item.timestamp).toLocaleString()}</div>
            `;
            
            historyItem.addEventListener('click', () => {
                amountInput.value = item.amount;
                fromSelect.value = item.fromCurrency;
                toSelect.value = item.toCurrency;
                closeHistoryPanel();
                convertCurrency();
            });
            
            historyList.appendChild(historyItem);
        });
    }

    // Converter moedas
    converterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        convertCurrency();
    });

    function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromSelect.value;
        const toCurrency = toSelect.value;
        
        if (isNaN(amount) || amount <= 0) {
            alert('Por favor, insira um valor válido');
            return;
        }
        
        // Simular carregamento
        const convertBtn = converterForm.querySelector('button[type="submit"]');
        convertBtn.classList.add('loading');
        
        // Simular API de conversão (na prática, você usaria uma API real)
        setTimeout(() => {
            // Taxas de câmbio fictícias (em um app real, isso viria de uma API)
            const exchangeRates = {
                usd: { brl: 5.0, eur: 0.85, btc: 0.000025, eth: 0.00045 },
                brl: { usd: 0.2, eur: 0.17, btc: 0.000005, eth: 0.00009 },
                eur: { usd: 1.18, brl: 5.88, btc: 0.000029, eth: 0.00053 },
                btc: { usd: 40000, brl: 200000, eur: 34000, eth: 18 },
                eth: { usd: 2200, brl: 11000, eur: 1870, btc: 0.055 }
            };
            
            // Adicionar taxas para moedas não incluídas acima
            currencies.forEach(currency => {
                if (!exchangeRates[currency.code]) {
                    exchangeRates[currency.code] = {
                        usd: (1 / (Math.random() * 0.5 + 0.5)).toFixed(6),
                        brl: (5 / (Math.random() * 0.5 + 0.5)).toFixed(6),
                        eur: (0.85 / (Math.random() * 0.5 + 0.5)).toFixed(6),
                        btc: (0.000025 / (Math.random() * 0.5 + 0.5)).toFixed(8),
                        eth: (0.00045 / (Math.random() * 0.5 + 0.5)).toFixed(8)
                    };
                }
            });
            
            // Verificar se temos a taxa de câmbio necessária
            if (!exchangeRates[fromCurrency] || !exchangeRates[fromCurrency][toCurrency]) {
                alert('Taxa de câmbio não disponível para estas moedas');
                convertBtn.classList.remove('loading');
                return;
            }
            
            const rate = parseFloat(exchangeRates[fromCurrency][toCurrency]);
            const result = (amount * rate).toFixed(6);
            
            // Mostrar resultado
            resultValue.textContent = parseFloat(result).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
            });
            resultCurrency.textContent = toCurrency.toUpperCase();
            rateInfo.textContent = `1 ${fromCurrency.toUpperCase()} = ${rate.toFixed(6)} ${toCurrency.toUpperCase()}`;
            lastUpdated.textContent = 'agora mesmo';
            
            // Adicionar ao histórico
            const conversion = {
                amount: amount,
                fromCurrency: fromCurrency,
                toCurrency: toCurrency,
                result: parseFloat(result).toFixed(6),
                rate: rate.toFixed(6),
                timestamp: new Date().toISOString()
            };
            
            conversionHistory.push(conversion);
            if (conversionHistory.length > 10) {
                conversionHistory = conversionHistory.slice(-10);
            }
            
            localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
            
            // Mostrar container do resultado
            resultContainer.classList.add('visible');
            convertBtn.classList.remove('loading');
        }, 800);
    }
    
    // Converter automaticamente ao mudar moedas (se já houver valor)
    fromSelect.addEventListener('change', autoConvert);
    toSelect.addEventListener('change', autoConvert);
    
    function autoConvert() {
        if (amountInput.value && resultContainer.classList.contains('visible')) {
            convertCurrency();
        }
    }
});