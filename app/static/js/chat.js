document.addEventListener("DOMContentLoaded", function () {
    const chatContainer = document.getElementById("chat-container");
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const minimizeBtn = document.getElementById("minimize-btn");
    const closeBtn = document.getElementById("close-btn");

    // Envia mensagem ao clicar no botão ou pressionar Enter
    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    // Minimiza o chat
    minimizeBtn.addEventListener("click", () => {
        chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
    });

    // Fecha o chat (minimiza para a bolinha)
    closeBtn.addEventListener("click", () => {
        chatContainer.classList.add("chat-minimized");
        chatMinimized.style.display = "block";
    });

    // Reabre o chat ao clicar na bolinha
    openChatBtn.addEventListener("click", () => {
        chatContainer.classList.remove("chat-minimized");
        chatMinimized.style.display = "none";
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        addMessage(message, "user-message");

        // Envia a mensagem para o backend
        try {
            const response = await fetch("/get-bot-response", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message }),
            });

            if (!response.ok) {
                throw new Error(`Erro no servidor: ${response.status}`);
            }

            const data = await response.json();
            addMessage(data.response, "bot-message");
        } catch (error) {
            addMessage(`Erro ao conectar com o servidor: ${error.message}`, "bot-message");
        }

        userInput.value = "";
    }

    function addMessage(text, className) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", className);
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;
    
        addMessage(message, "user-message");
    
        // Envia a mensagem para o backend
        try {
            const response = await fetch("/api/get-bot-response", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message }),
            });
    
            if (!response.ok) {
                throw new Error(`Erro no servidor: ${response.status}`);
            }
    
            const data = await response.json();
            addMessage(data.response, "bot-message");
        } catch (error) {
            addMessage(`Erro ao conectar com o servidor: ${error.message}`, "bot-message");
        }
    
        userInput.value = "";
    }
});

