// Conectar ao servidor WebSocket hospedado no Render
const socket = io();
let username = localStorage.getItem("username") || "";

// Perguntar o nome se ainda não tiver
if (!username) {
    username = prompt("Digite seu nome:");
    localStorage.setItem("username", username);
}

// Captura de elementos
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const typingIndicator = document.getElementById("typing-indicator");
const imageInput = document.getElementById("image-input");
const callBtn = document.getElementById("call-btn");

// Enviar mensagem de texto
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message) {
        const messageData = { username, message };
        displayMessage(messageData, true);
        socket.emit("chatMessage", messageData);
        messageInput.value = "";
        stopTyping();
    }
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", notifyTyping);

// Receber mensagens do servidor
socket.on("chatMessage", (data) => {
    if (data.username !== username) {
        displayMessage(data, false);
    }
});

// Exibir mensagens corretamente
function displayMessage(data, isSender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", isSender ? "sent" : "received");
    messageElement.innerHTML = `<span class="username">${data.username}</span><p>${data.message}</p>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Notificar que o usuário está digitando
function notifyTyping() {
    socket.emit("typing", username);
}

// Parar de mostrar "está digitando..." após um tempo
function stopTyping() {
    socket.emit("stopTyping");
}

let typingTimeout;
socket.on("typing", (user) => {
    typingIndicator.innerText = `${user} está digitando...`;
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        typingIndicator.innerText = "";
    }, 3000);
});

socket.on("stopTyping", () => {
    typingIndicator.innerText = "";
});

// Capturar a imagem quando o usuário seleciona um arquivo
imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = {
                username: username,
                image: e.target.result, // Converte a imagem para base64
            };
            displayImage(imageData, true); // Exibe no chat do próprio usuário
            socket.emit("sendImage", imageData); // Envia para o servidor
        };
        reader.readAsDataURL(file);
    }
});

// Receber imagens do servidor
socket.on("sendImage", (data) => {
    if (data.username !== username) {
        displayImage(data, false); // Exibe a imagem recebida no chat
    }
});

// Exibir a imagem no chat
function displayImage(data, isSender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", isSender ? "sent" : "received");
    messageElement.innerHTML = `
        <span class="username">${data.username}</span>
        <img src="${data.image}" class="chat-image" alt="Imagem enviada"/>
    `;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Iniciar chamada
callBtn.addEventListener("click", startCall);
function startCall() {
    alert("Iniciando chamada...");
    // Aqui entra o código do WebRTC para iniciar a chamada
}