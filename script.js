// 1. PEGAR OS ELEMENTOS DA TELA
const themeToggle = document.getElementById('theme-toggle');
const colorCircle = document.getElementById('color-circle');
const colorPicker = document.getElementById('color-picker'); // O input invisível
const historyBox = document.getElementById('history-box');

// 2. FUNÇÃO DO MODO CLARO / MODO ESCURO
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeToggle.textContent = 'Dark Mode';
    } else {
        themeToggle.textContent = 'Light Mode';
    }
});

// 3. FUNÇÃO DO CÍRCULO CROMÁTICO
colorPicker.addEventListener('change', (event) => {
    // Pega a cor exata que você clicou na caixinha de cores
    const selectedColor = event.target.value.toUpperCase();
    
    // Atualiza o texto do centro do círculo com a cor e fundo certos
    const textLabel = colorCircle.querySelector('.circle-text');
    textLabel.textContent = selectedColor;
    textLabel.style.backgroundColor = selectedColor;
    textLabel.style.color = '#ffffff'; 

    // 4. MEMÓRIA: Cria o quadradinho da cor para o histórico
    const colorCard = document.createElement('div');
    colorCard.classList.add('color-card');
    colorCard.innerHTML = `
        <div class="color-preview" style="background-color: ${selectedColor}"></div>
        <span class="color-code">${selectedColor}</span>
    `;

    // Função de clicar no histórico para copiar o código HEX
    colorCard.addEventListener('click', () => {
        navigator.clipboard.writeText(selectedColor);
        alert(`Color ${selectedColor} copied to clipboard! 🚀`);
    });

    // Coloca a nova cor no topo do histórico
    historyBox.insertBefore(colorCard, historyBox.firstChild);
    
    // Envia a cor selecionada para o n8n
    handleColorSelection(selectedColor);
});

// ==========================================
// 5. AI AGENT & N8N AUTOMATION CONNECTION
// ==========================================

const n8nWebhookUrl = "https://scenic-harmonics-dress.ngrok-free.dev/webhook/34b91517-b4a7-40d8-86d3-263e4927e570";

// Função principal de envio de dados para o n8n
async function sendToWorkflow(payload) {
    try {
        const response = await fetch(n8nWebhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        // Lê a resposta retornada pelo nó "Respond to Webhook" do n8n
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to connect to n8n workflow:", error);
        return { error: true, message: "Oops! Something went wrong with the AI Agent connection." };
    }
}

// Função disparada quando o usuário escolhe uma cor no círculo
async function handleColorSelection(chosenColor) {
    const payload = {
        type: "color_selection",
        cor: chosenColor,
        timestamp: new Date().toISOString(),
        context: "Aesthetics and color curations based on curated Pinterest boards"
    };

    console.log("Sending selected color to n8n...", payload);
    await sendToWorkflow(payload);
}

// Função disparada quando o usuário envia uma mensagem no chat
async function handleChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const historyContainer = document.getElementById('history-box') || document.querySelector('.history-box');
    const messageText = chatInput.value.trim();

    if (messageText === "") return;

    // 1. Adiciona a mensagem do usuário na tela
    chatMessages.innerHTML += `<div class="message user">${messageText}</div>`;
    chatInput.value = ""; // Limpa o campo
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const payload = {
        type: "chat_message",
        message: messageText,
        timestamp: new Date().toISOString()
    };

    try {
        // 2. Envia para o n8n e aguarda a IA
        const result = await sendToWorkflow(payload);

        // 3. Exibe a resposta da IA no chat
        const botReply = (result && result.aiResponse) 
            ? result.aiResponse 
            : "AI Agent is offline. Please check your workflow activation.";

        chatMessages.innerHTML += `<div class="message bot">${botReply}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 4. Se a IA respondeu, extrai os códigos HEX das cores
        if (result && result.aiResponse) {
            const hexRegex = /#([0-9A-F]{6})/gi;
            const foundColors = result.aiResponse.match(hexRegex);

            if (foundColors && historyContainer) {
                for (const colorHex of foundColors) {
                    const upperHex = colorHex.toUpperCase();

                    // Adiciona o card visual no histórico da tela
                    const colorCard = document.createElement('div');
                    colorCard.classList.add('color-card');
                    colorCard.innerHTML = `
                        <div class="color-preview" style="background-color: ${upperHex}"></div>
                        <span class="color-code">${upperHex}</span>
                    `;

                    colorCard.addEventListener('click', () => {
                        navigator.clipboard.writeText(upperHex);
                        alert(`Color ${upperHex} copied to clipboard! 🚀`);
                    });

                    historyContainer.insertBefore(colorCard, historyContainer.firstChild);

                    // Envia cada cor sugerida para o Notion via n8n
                    sendToWorkflow({
                        type: "color_selection",
                        cor: upperHex,
                        timestamp: new Date().toISOString(),
                        contexto: "Sugerido pela IA no Chat"
                    });
                }
            }
        }
    } catch (error) {
        console.error("Erro no chat:", error);
        chatMessages.innerHTML += `<div class="message bot">Erro ao se comunicar com o servidor.</div>`;
    }
}

// ==========================================
// 6. EVENT LISTENERS FOR CHAT
// ==========================================
const btnEnviar = document.getElementById('btn-enviar-chat');
if (btnEnviar) {
    btnEnviar.addEventListener('click', handleChatMessage);
}

const chatInput = document.getElementById('chat-input');
if (chatInput) {
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleChatMessage();
        }
    });
}