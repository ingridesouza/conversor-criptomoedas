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
            if (element.tagName === "INPUT") {
                element.placeholder = translations[language][key]; // Atualiza o placeholder
            } else {
                element.textContent = translations[language][key]; // Atualiza o texto
            }
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
        setupChat(); // Configura o chat após carregar as traduções
    });
});

// Configuração do chat
function setupChat() {
    const chatContainer = document.getElementById('chat-container');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const minimizeBtn = document.getElementById('minimize-btn');
    const closeBtn = document.getElementById('close-btn');
    const chatMinimized = document.getElementById('chat-minimized');
    const openChatBtn = document.getElementById('open-chat-btn');
    const loader = document.getElementById('loader');

    // Inicia o chat fechado e a bolinha visível
    chatContainer.style.display = 'none';
    chatMinimized.style.display = 'block';

    // Envia mensagem ao clicar no botão ou pressionar Enter
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });

    // Minimiza o chat (esconde a caixa de mensagens)
    minimizeBtn.addEventListener('click', () => {
        chatBox.style.display = chatBox.style.display === 'none' ? 'block' : 'none';
    });

    // Fecha o chat (minimiza para a bolinha)
    closeBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
        chatMinimized.style.display = 'block';
    });

    // Reabre o chat ao clicar na bolinha
    openChatBtn.addEventListener('click', () => {
        chatContainer.style.display = 'flex';
        chatMinimized.style.display = 'none';
        chatBox.style.display = 'block'; // Garante que a caixa de mensagens esteja visível
    });

    // Função para enviar mensagem
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Adiciona a mensagem do usuário ao chat
        addMessage(message, 'user-message');

        // Limpa o input imediatamente após o envio
        userInput.value = '';

        // Exibe o loader
        loader.style.display = 'block';

        // Simula o envio da mensagem para o backend (substitua pelo seu código real)
        try {
            const response = await simulateBotResponse(message); // Simulação de resposta do bot
            addMessage(response, 'bot-message');
        } catch (error) {
            addMessage(`Erro ao conectar com o servidor: ${error.message}`, 'bot-message');
        } finally {
            // Oculta o loader, independentemente de sucesso ou erro
            loader.style.display = 'none';
        }
    }

    // Função para adicionar mensagem ao chat
    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        messageDiv.textContent = text;
        document.getElementById('messages').appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Rola para a última mensagem
    }

    // Função de simulação de resposta do bot (substitua pelo seu backend real)
    function simulateBotResponse(userMessage) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (userMessage.toLowerCase().includes('oi') || userMessage.toLowerCase().includes('olá')) {
                    resolve(translations[currentLanguage].chat_bot_message);
                } else if (userMessage.toLowerCase().includes('investimento')) {
                    resolve('Claro! Podemos falar sobre fundos de renda fixa, ações ou tesouro direto. Qual você prefere?');
                } else {
                    resolve('Desculpe, não entendi. Poderia reformular sua pergunta?');
                }
            }, 1000); // Simula um atraso de 1 segundo
        });
    }
}