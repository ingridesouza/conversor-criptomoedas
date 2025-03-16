// static/js/marketAgent.js
document.addEventListener('DOMContentLoaded', function () {
    const userId = 1; // Exemplo: usuário com ID 1

    async function analyzeMarket() {
        try {
            const response = await fetch(`/analyze-market/${userId}`);
            if (!response.ok) throw new Error('Erro ao analisar o mercado');
            const data = await response.json();

            // Exibe as notificações
            data.notifications.forEach(notification => {
                sendNotification(notification);
            });
        } catch (error) {
            console.error('Erro ao analisar o mercado:', error);
        }
    }

    function sendNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `<p>${message}</p>`;
        document.getElementById('notifications').appendChild(notification);
    }

    // Analisa o mercado a cada 5 minutos (300.000 ms)
    setInterval(analyzeMarket, 300000);
});