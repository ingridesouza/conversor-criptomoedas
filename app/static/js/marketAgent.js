// static/js/marketAgent.js
document.addEventListener('DOMContentLoaded', function () {
    const userId = 1; // Exemplo: usuário com ID 1

    async function monitorCryptos() {
        try {
            const response = await fetch(`/get-monitored-cryptos/${userId}`);
            if (!response.ok) throw new Error('Erro ao buscar criptomoedas monitoradas');
            const monitoredCryptos = await response.json();

            for (const crypto of monitoredCryptos) {
                const cryptoData = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto.crypto_id}`);
                if (!cryptoData.ok) throw new Error('Erro ao buscar dados da criptomoeda');
                const data = await cryptoData.json();

                const currentPrice = data.market_data.current_price.usd;
                const priceChange = currentPrice - crypto.last_price;

                if (Math.abs(priceChange) > 0.01 * crypto.last_price) { // 1% de variação
                    const message = `Atenção! ${crypto.crypto_name} ` +
                        `${priceChange > 0 ? 'valorizou' : 'desvalorizou'} ` +
                        `${Math.abs(priceChange).toFixed(2)} USD (${(priceChange / crypto.last_price * 100).toFixed(2)}%). ` +
                        `Preço atual: $${currentPrice.toFixed(2)}.`;

                    sendNotification(message);

                    await fetch('/add-monitored-crypto', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: userId,
                            crypto_id: crypto.crypto_id,
                            crypto_name: crypto.crypto_name,
                            last_price: currentPrice
                        })
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao monitorar criptomoedas:', error);
        }
    }

    function sendNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `<p>${message}</p>`;
        document.getElementById('notifications').appendChild(notification);
    }

    setInterval(monitorCryptos, 60000); // Verifica a cada 60 segundos
});