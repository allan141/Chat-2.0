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

// Exibir mensagem no chat
function appendMessage(user, msg, type) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");

    messageElement.classList.add("message", type);
    messageElement.innerHTML = `<span class="username">${user}</span>${msg}`;
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Escutar mensagens do servidor e exibir no chat
socket.on("chatMessage", (data) => {
    appendMessage(data.username, data.message, data.username === username ? "sent" : "received");
});

// Enviar mensagem ao pressionar "Enter"
document.getElementById("message").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        sendMessage();
    }
});