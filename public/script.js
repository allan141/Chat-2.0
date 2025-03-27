const socket = io();
let username = localStorage.getItem("username") || "";

// Perguntar nome se ainda não tiver
if (!username) {
    username = prompt("Digite seu nome:");
    localStorage.setItem("username", username);
}

const sendButton = document.getElementById("send-btn");
const recordButton = document.getElementById("record-btn");
const messageInput = document.getElementById("message");
let mediaRecorder;
let audioChunks = [];

// Enviar mensagem de texto
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message) {
        socket.emit("chatMessage", { username, message });
        appendMessage(username, message, "sent");
        messageInput.value = "";
    }
}

// Iniciar gravação ao pressionar
recordButton.addEventListener("mousedown", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            const reader = new FileReader();

            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const audioData = reader.result;
                socket.emit("audioMessage", { username, audio: audioData });
                appendMessage(username, audioData, "sent", true);
            };
        };

        mediaRecorder.start();
    } catch (error) {
        console.error("Erro ao acessar o microfone:", error);
    }
});

// Parar gravação ao soltar o botão
recordButton.addEventListener("mouseup", () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    }
});

// Adicionar mensagens ao chat
function appendMessage(user, content, type, isAudio = false) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");

    messageElement.classList.add("message", type);
    if (isAudio) {
        messageElement.innerHTML = `<span class="username">${user}</span><audio controls><source src="${content}" type="audio/webm"></audio>`;
    } else {
        messageElement.innerHTML = `<span class="username">${user}</span>${content}`;
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Receber mensagens de texto e áudio
socket.on("chatMessage", (data) => {
    appendMessage(data.username, data.message, "received");
});

socket.on("audioMessage", (data) => {
    appendMessage(data.username, data.audio, "received", true);
});

// Enviar mensagem ao pressionar "Enter"
messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});