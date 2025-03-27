const socket = io();
let username = localStorage.getItem("username") || "";

// Definir o nome do usuário
function setUsername() {
    const input = document.getElementById("username");
    if (input.value.trim()) {
        username = input.value.trim();
        localStorage.setItem("username", username);
        document.querySelector(".name-container").style.display = "none";
        document.querySelector(".chat-container").style.display = "block";
    }
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

// Receber mensagens
socket.on("chatMessage", (data) => {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});
// Salvar e carregar histórico
function saveMessage(data) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push(data);
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function loadChatHistory() {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const chatBox = document.getElementById("chat-box");

    chatHistory.forEach(data => {
        const messageElement = document.createElement("div");
        messageElement.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
        chatBox.appendChild(messageElement);
    });
}

document.addEventListener("DOMContentLoaded", loadChatHistory);

socket.on("chatMessage", (data) => {
    saveMessage(data);
});

