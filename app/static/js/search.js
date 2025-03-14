// search.js

document.addEventListener('DOMContentLoaded', function () {
    // Configurar o formulário de pesquisa
    document.getElementById('search-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const searchTerm = document.getElementById('search').value.trim();
        if (!searchTerm) return;
        fetchCryptoDetails(searchTerm);
    });

    // Função para buscar detalhes da criptomoeda
    function fetchCryptoDetails(cryptoId) {
        fetch(`/crypto/${cryptoId}`)
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('search-result');
                if (data.error) {
                    resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
                } else {
                    const currentLanguage = localStorage.getItem('language') || 'en';
                    const description = data.description[currentLanguage] || data.description.en || "Descrição não disponível.";
                    resultDiv.innerHTML = `
                        <h3>${data.name} (${data.symbol})</h3>
                        <img src="${data.image.large}" alt="${data.name}" class="crypto-image">
                        <p><strong data-translate="description">Descrição:</strong> ${description}</p>
                        <p><strong data-translate="price">Preço:</strong> $${data.market_data.current_price.usd.toFixed(2)}</p>
                        <p><strong data-translate="market_cap">Capitalização:</strong> $${data.market_data.market_cap.usd.toLocaleString()}</p>
                        <p><strong data-translate="volume_24h">Volume (24h):</strong> $${data.market_data.total_volume.usd.toLocaleString()}</p>
                        <p><strong data-translate="change_24h">Variação (24h):</strong> ${data.market_data.price_change_percentage_24h.toFixed(2)}%</p>
                    `;
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }
});