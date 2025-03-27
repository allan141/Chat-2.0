const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    const messageInput = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");

    // Função para enviar mensagens
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit("chatMessage", message);
            messageInput.value = "";
        }
    }

    // Capturar a tecla "Enter" no campo de entrada
    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Adicionar evento ao botão de envio
    document.querySelector("button").addEventListener("click", sendMessage);

    // Receber e exibir mensagens no chat
    socket.on("chatMessage", (data) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `<strong>Usuário ${data.id}:</strong> ${data.message}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
});
