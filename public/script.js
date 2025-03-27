const socket = io();

// Obtém o nome do usuário do localStorage
let username = localStorage.getItem("username") || "";

// Se não tiver username salvo, exibe o campo de login
document.addEventListener("DOMContentLoaded", function () {
    if (!username) {
        document.getElementById("login-container").style.display = "flex";
        document.getElementById("chat-container").style.display = "none";
    } else {
        showChat(username);
    }
});

// Função para entrar no chat
function enterChat() {
    username = document.getElementById("username").value.trim();
    
    if (username === "") {
        alert
} 
}