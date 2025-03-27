const socket = io();
let username = localStorage.getItem("username") || "";

// Perguntar o nome se ainda não tiver
if (!username) {
    username = prompt("Digite seu nome:");
    localStorage.setItem("username", username);
}

// Captura dos botões e inicialização de variáveis
const recordBtn = document.getElementById("record-btn");
const sendBtn = document.getElementById("send-btn");
let mediaRecorder;
let audioChunks = [];
let startTime;
let recordingInterval;

// Enviar mensagem de texto
function sendMessage() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();
    
    if (message) {
        const messageData = { username, message };
        displayMessage(messageData, true);
        socket.emit("chatMessage", messageData);
        messageInput.value = "";
    }
}

// Receber mensagens do servidor
socket.on("chatMessage", (data) => {
    if (data.username !== username) {
        displayMessage(data, false);
    }
});

// Exibir mensagens corretamente
function displayMessage(data, isSender) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");

    messageElement.classList.add("message", isSender ? "sent" : "received");

    messageElement.innerHTML = `
        <span class="username">${data.username}</span>
        <p>${data.message}</p>
    `;
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Iniciar gravação de áudio
recordBtn.addEventListener("mousedown", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audioData = { username, audioUrl };

            socket.emit("audioMessage", audioData);
            displayAudioMessage(audioData, true);

            // **Zerar cronômetro e restaurar botão**
            clearInterval(recordingInterval);
            recordBtn.innerText = "🎤";
        };

        mediaRecorder.start();
        startTime = Date.now();

        // Atualizar tempo de gravação
        recordingInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            recordBtn.innerText = `🎤 ${elapsedTime}s`;
        }, 1000);
    } catch (error) {
        console.error("Erro ao acessar o microfone:", error);
    }
});

// Parar gravação quando soltar o botão
recordBtn.addEventListener("mouseup", stopRecording);
recordBtn.addEventListener("mouseleave", stopRecording);

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        clearInterval(recordingInterval); // Corrigido para garantir que pare corretamente
        recordBtn.innerText = "🎤"; // Restaurar o ícone original
    }
}

// Receber áudio do servidor
socket.on("audioMessage", (data) => {
    if (data.username !== username) {
        displayAudioMessage(data, false);
    }
});

// Exibir áudio no chat
function displayAudioMessage(data, isSender) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");

    messageElement.classList.add("message", isSender ? "sent" : "received");

    messageElement.innerHTML = `
        <span class="username">${data.username}</span>
        <div class="audio-message">
            <audio controls>
                <source src="${data.audioUrl}" type="audio/webm">
                Seu navegador não suporta a reprodução de áudio.
            </audio>
        </div>
    `;
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
