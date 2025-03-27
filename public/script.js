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

// 🎤 Captura e envio de áudio
let mediaRecorder;
let audioChunks = [];

document.getElementById("record-audio").addEventListener("mousedown", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const audioBase64 = reader.result;
                socket.emit("audioMessage", { username, audio: audioBase64 });
            };
            audioChunks = [];
        };

        mediaRecorder.start();
    } catch (err) {
        console.error("Erro ao acessar o microfone:", err);
    }
});

document.getElementById("record-audio").addEventListener("mouseup", () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
});

// Receber áudios e exibir no chat
socket.on("audioMessage", (data) => {
    const chatBox = document.getElementById("chat-box");
    const audioElement = document.createElement("audio");
    audioElement.controls = true;
    audioElement.src = data.audio;

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", data.username === username ? "sent" : "received");
    messageElement.innerHTML = `<span class="username">${data.username}</span>`;
    messageElement.appendChild(audioElement);

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});
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