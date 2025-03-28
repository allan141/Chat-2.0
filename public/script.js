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
const imageInput = document.getElementById("image-input");

// Enviar mensagem de texto
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message) {
        const messageData = { username, message, time: new Date().toLocaleTimeString() };
        displayMessage(messageData, true);
        socket.emit("chatMessage", messageData);
        messageInput.value = "";
        stopTyping();
    } else {
        console.log("⚠️ Mensagem vazia, não enviada.");
    }
}

// Enviar imagem
function sendImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const imageData = { username, image: reader.result, time: new Date().toLocaleTimeString() };
            displayImage(imageData, true);
            socket.emit("sendImage", imageData);
        };
        reader.readAsDataURL(file);
    }
}

// Receber mensagens do servidor
socket.on("chatMessage", (data) => {
    if (data.username !== username) {
        displayMessage(data, false);
    }
});

// Receber imagens do servidor
socket.on("receiveImage", (data) => {
    if (data.username !== username) {
        displayImage(data, false);
    }
});

// Exibir mensagens corretamente
function displayMessage(data, isSender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", isSender ? "sent" : "received");
    messageElement.innerHTML = `<span class="username">${data.username}</span><p>${data.message}</p><span class="time">${data.time}</span>`;
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Exibir imagens corretamente
function displayImage(data, isSender) {
    const imageElement = document.createElement("div");
    imageElement.classList.add("message", isSender ? "sent" : "received");
    imageElement.innerHTML = `<span class="username">${data.username}</span><img src="${data.image}" class="chat-image" /><span class="time">${data.time}</span>`;
    
    chatBox.appendChild(imageElement);
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

// Eventos
sendBtn.addEventListener("click", sendMessage); // Correção aqui, chamando sendMessage ao clicar no botão
messageInput.addEventListener("input", notifyTyping); // Notificar digitação
imageInput.addEventListener("change", sendImage); // Enviar imagem ao selecionar