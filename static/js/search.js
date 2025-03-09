document.addEventListener('DOMContentLoaded', function () {
    const languageSelect = document.getElementById('language');
    let currentLanguage = languageSelect.value; // Idioma padrão: inglês

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

    // Atualizar o idioma quando o usuário mudar a seleção
    languageSelect.addEventListener('change', function () {
        currentLanguage = this.value;
        // Recarregar os dados da criptomoeda com o novo idioma
        const searchTerm = document.getElementById('search').value.trim();
        if (searchTerm) {
            fetchCryptoDetails(searchTerm, currentLanguage);
        }
    });

    // Configurar o formulário de pesquisa
    document.getElementById('search-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const searchTerm = document.getElementById('search').value.trim();
        if (!searchTerm) return;

        fetchCryptoDetails(searchTerm, currentLanguage);
    });

    // Função para buscar detalhes da criptomoeda
    function fetchCryptoDetails(cryptoId, language) {
        fetch(`/crypto/${cryptoId}`)
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('search-result');
                if (data.error) {
                    resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
                } else {
                    const description = data.description[language] || data.description.en || "Descrição não disponível.";
                    resultDiv.innerHTML = `
                        <h3>${data.name} (${data.symbol})</h3>
                        <img src="${data.image.large}" alt="${data.name}" class="crypto-image">
                        <p><strong>Descrição:</strong> ${description}</p>
                        <p><strong>Preço:</strong> $${data.market_data.current_price.usd.toFixed(2)}</p>
                        <p><strong>Capitalização:</strong> $${data.market_data.market_cap.usd.toLocaleString()}</p>
                        <p><strong>Volume (24h):</strong> $${data.market_data.total_volume.usd.toLocaleString()}</p>
                        <p><strong>Variação (24h):</strong> ${data.market_data.price_change_percentage_24h.toFixed(2)}%</p>
                    `;
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }
});