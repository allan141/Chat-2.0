const socket = io();

// Conectar ao servidor WebSocket hospedado no Render
websocket = new WebSocket("ws://allan141.github.io/")
websocket.onmenssage = processMessage

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

// Receber evento de digitação do servidor
socket.on("typing", (user) => {
    typingIndicator.innerText = `${user} está digitando...`;
});

// Remover "está digitando..." quando o usuário parar
socket.on("stopTyping", () => {
    typingIndicator.innerText = "";
});

// Registrar usuário no servidor
socket.emit("registerUser", username);

// Atualizar a lista de usuários conectados
socket.on("userList", (users) => {
    const userList = document.getElementById("online-users");
    userList.innerHTML = users.length > 0 ? `Online: ${users.join(", ")}` : "Nenhum usuário online";
});