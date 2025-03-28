
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
// Conectar ao servidor WebSocket hospedado no Render

// Remover "está digitando..." quando o usuário parar
socket.on("stopTyping", () => {
    typingIndicator.innerText = "";
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
document.getElementById("call-btn").addEventListener("click", startCall);

function startCall() {
    alert("Iniciando chamada...");
    // Aqui entra o código do WebRTC para iniciar a chamada
}