const socket = io();

// Verifica se já existe um nome salvo no localStorage
let username = localStorage.getItem("username") || "";

// Se o nome já existir, entra direto no chat
document.addEventListener("DOMContentLoaded", function () {
    if (username) {
        showChat(username);
    }
});

// Função para entrar no chat
function enterChat() {
    username = document.getElementById("username").value.trim();

    if (username === "") {
        alert("Por favor, digite um nome de usuário!");
        return;
    }

    localStorage.setItem("username", username);
    showChat(username);
}

// Exibe a interface do chat e oculta a tela de login
function showChat(username) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("chat-container").style.display = "flex";
    document.getElementById("user-display").innerText = `Usuário: ${username}`;

    // Entra na sala do chat (caso tenha suporte a salas no servidor)
    socket.emit("joinChat", username);
}

// Enviar mensagem
function sendMessage() {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();

    if (message === "") return;

    socket.emit("chatMessage", { username, message });
    messageInput.value = "";
}

// Receber mensagens e exibir corretamente no chat
socket.on("chatMessage", (data) => {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");

    // Definir classe de estilo (mensagem enviada ou recebida)
    messageElement.classList.add("message", data.username === username ? "sent" : "received");

    // Exibir nome do usuário e mensagem
    messageElement.innerHTML = `<span class="username">${data.username}</span>${data.message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});