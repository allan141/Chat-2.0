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

// Função para salvar as mensagens no localStorage
function saveMessages(messages) {
    localStorage.setItem("messages", JSON.stringify(messages));
}

// Função para carregar as mensagens do localStorage
function loadMessages() {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
}

// Carregar e exibir as mensagens salvas ao carregar a página
function loadChatHistory() {
    const messages = loadMessages();
    messages.forEach((messageData) => {
        displayMessage(messageData, false);
    });
}

// Enviar mensagem de texto
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message) {
        const messageData = { username, message, time: new Date().toLocaleTimeString() };
        displayMessage(messageData, true);
        socket.emit("chatMessage", messageData);
        
        // Salvar a nova mensagem no localStorage
        const messages = loadMessages();
        messages.push(messageData);
        saveMessages(messages);
        
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
            
            // Salvar a imagem no localStorage
            const messages = loadMessages();
            messages.push(imageData);
            saveMessages(messages);
            
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

// Função para apagar a conversa
function clearChat() {
    localStorage.removeItem("messages"); // Apagar as mensagens do localStorage
    chatBox.innerHTML = ""; // Limpar a caixa de chat na interface
}

// Evento para apagar conversa
const clearChatBtn = document.getElementById("clear-chat-btn");
clearChatBtn.addEventListener("click", clearChat);

// Eventos
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("input", notifyTyping);
imageInput.addEventListener("change", sendImage);

// Carregar o histórico de mensagens
loadChatHistory();

// Função para alternar a visibilidade do menu
function toggleMenu() {
    const menuDropdown = document.getElementById("menu-dropdown");
    menuDropdown.classList.toggle("show");
}