const socket = io();
let username = localStorage.getItem("username") || "";

// Perguntar nome se ainda não tiver
if (!username) {
    username = prompt("Digite seu nome:");
    localStorage.setItem("username", username);
}

// Enviar mensagem
function sendMessage() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();
    
    if (message) {
        socket.emit("chatMessage", { username, message });
        messageInput.value = "";
    }
}

// Receber mensagens e exibir corretamente
socket.on("chatMessage", (data) => {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");

    // Definir classe de estilo (mensagem enviada ou recebida)
    messageElement.classList.add("message");
    messageElement.classList.add(data.username === username ? "sent" : "received");

    // Exibir nome do usuário e mensagem
    messageElement.innerHTML = `<span class="username">${data.username}</span>${data.message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});
