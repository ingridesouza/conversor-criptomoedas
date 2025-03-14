// translate.js

let translations = {};
let currentLanguage = localStorage.getItem('language') || 'en';

// Função para carregar as traduções
function loadTranslations() {
    return fetch('/static/translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            applyTranslations(currentLanguage);
        })
        .catch(error => {
            console.error('Erro ao carregar traduções:', error);
        });
}

// Função para aplicar as traduções
function applyTranslations(language) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    // Atualizar o texto do botão de tema
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        if (document.body.classList.contains('dark-mode')) {
            themeToggleBtn.textContent = '☀️ ' + translations[language].theme;
        } else {
            themeToggleBtn.textContent = '🌙 ' + translations[language].theme;
        }
    }
}

// Configurar o seletor de idioma
function setupLanguageSelector() {
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.value = currentLanguage;

        languageSelect.addEventListener('change', function () {
            currentLanguage = this.value;
            localStorage.setItem('language', currentLanguage);
            applyTranslations(currentLanguage);
        });
    }
}

// Inicializar a tradução
document.addEventListener('DOMContentLoaded', function () {
    loadTranslations().then(() => {
        setupLanguageSelector();
    });
});