// Conectar ao servidor WebSocket hospedado no Render
const socket = io("https://chat-2-0-v3n2.onrender.com");

let username = localStorage.getItem("username") || "";

// Perguntar o nome se ainda não tiver
if (!username) {
    username = prompt("Digite seu nome:");
    localStorage.setItem("username", username);
}

// Enviar o nome do usuário para o servidor
socket.emit("registerUser", username);

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

// Alternar a exibição do menu dropdown
function toggleMenu() {
    const menu = document.getElementById("menu-dropdown");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Alterar nome de usuário
function changeUsername() {
    let newUsername = prompt("Digite seu novo nome:");
    if (newUsername) {
        username = newUsername;
        localStorage.setItem("username", username);
        alert("Nome alterado para " + username);
        toggleMenu();
    }
}

// Sair do chat
function logout() {
    localStorage.removeItem("username");
    alert("Você saiu do chat!");
    location.reload();
}

// Fechar menu se clicar fora
document.addEventListener("click", (event) => {
    const menu = document.getElementById("menu-dropdown");
    const menuIcon = document.querySelector(".menu-icon");

    if (menu.style.display === "block" && !menu.contains(event.target) && !menuIcon.contains(event.target)) {
        menu.style.display = "none";
    }
});
// Evento para capturar a imagem quando o usuário seleciona um arquivo
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
socket.on("receiveImage", (data) => {
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