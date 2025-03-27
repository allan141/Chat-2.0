const socket = io();
let username = localStorage.getItem("username") || "";

// Perguntar o nome se ainda não tiver
if (!username) {
    username = prompt("Digite seu nome:");
    localStorage.setItem("username", username);
}

// Captura do botão de gravação e inicialização de variáveis
const recordBtn = document.getElementById("record-btn");
let mediaRecorder;
let audioChunks = [];
let startTime;
let recordingInterval;

// Enviar mensagem de texto
function sendMessage() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();
    
    if (message) {
        displayMessage({ username, message }, true);
        socket.emit("chatMessage", { username, message });
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

    messageElement.classList.add("message");
    messageElement.classList.add(isSender ? "sent" : "received");

    messageElement.innerHTML = `<span class="username">${data.username}</span>${data.message}`;
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
            socket.emit("audioMessage", { username, audioUrl });

            // Exibir áudio no chat
            displayAudioMessage({ username, audioUrl }, true);
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
recordBtn.addEventListener("mouseup", () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        clearInterval(recordingInterval);
        recordBtn.innerText = "🎤"; // Restaurar o ícone original
    }
});

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

    messageElement.classList.add("message");
    messageElement.classList.add(isSender ? "sent" : "received");

    messageElement.innerHTML = `
        <span class="username">${data.username}</span>
        <audio controls>
            <source src="${data.audioUrl}" type="audio/webm">
            Seu navegador não suporta a reprodução de áudio.
        </audio>
    `;
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}