document.addEventListener('DOMContentLoaded', function () {
    const languageSelect = document.getElementById('language');
    let currentLanguage = localStorage.getItem('language') || 'en'; // Idioma padrão: inglês

    // Carregar traduções
    let translations = {};
    fetch('/static/translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            applyTranslations(currentLanguage); // Aplicar traduções ao carregar a página
        })
        .catch(error => {
            console.error('Erro ao carregar traduções:', error);
        });

    // Alternar entre modo claro e noturno
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    themeToggleBtn.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            themeToggleBtn.textContent = '☀️ ' + translations[currentLanguage].theme;
        } else {
            themeToggleBtn.textContent = '🌙 ' + translations[currentLanguage].theme;
        }
    });

    // Atualizar o idioma quando o usuário mudar a seleção
    languageSelect.addEventListener('change', function () {
        currentLanguage = this.value;
        localStorage.setItem('language', currentLanguage); // Salvar idioma no localStorage
        applyTranslations(currentLanguage); // Aplicar traduções
        fetchCryptoDetails(searchTerm, currentLanguage); // Recarregar dados da criptomoeda
    });

    // Configurar o formulário de pesquisa
    document.getElementById('search-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const searchTerm = document.getElementById('search').value.trim();
        if (!searchTerm) return;

        fetchCryptoDetails(searchTerm, currentLanguage);
    });

    // Função para aplicar traduções
    function applyTranslations(language) {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            element.textContent = translations[language][key];
        });
    }

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
                        <p><strong data-translate="description">Descrição:</strong> ${description}</p>
                        <p><strong data-translate="price">Preço:</strong> $${data.market_data.current_price.usd.toFixed(2)}</p>
                        <p><strong data-translate="market_cap">Capitalização:</strong> $${data.market_data.market_cap.usd.toLocaleString()}</p>
                        <p><strong data-translate="volume_24h">Volume (24h):</strong> $${data.market_data.total_volume.usd.toLocaleString()}</p>
                        <p><strong data-translate="change_24h">Variação (24h):</strong> ${data.market_data.price_change_percentage_24h.toFixed(2)}%</p>
                    `;
                    applyTranslations(currentLanguage); // Aplicar traduções após carregar os dados
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }
});