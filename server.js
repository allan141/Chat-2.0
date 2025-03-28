const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const users = {}; // Armazena os usuários conectados

io.on("connection", (socket) => {
    console.log("Novo usuário conectado:", socket.id);

    
    // Receber e retransmitir imagens
    socket.on("sendImage", (data) => {
        io.emit("receiveImage", data); // Envia a imagem para todos os clientes
    });

    socket.on("disconnect", () => {
        console.log("Usuário desconectado:", socket.id);
    });

    // Registrar usuário ao entrar
    socket.on("registerUser", (username) => {
        users[socket.id] = username;
        io.emit("userList", Object.values(users)); // Atualiza a lista para todos
    });

    // Enviar mensagem
    socket.on("chatMessage", (data) => {
        io.emit("chatMessage", data);
    });

    // Notificar quando alguém está digitando
    socket.on("typing", (username) => {
        socket.broadcast.emit("typing", username);
    });

    // Parar de mostrar "está digitando..."
    socket.on("stopTyping", () => {
        socket.broadcast.emit("stopTyping");
    });

    // Remover usuário ao desconectar
    socket.on("disconnect", () => {
        console.log(`Usuário desconectado: ${socket.id}`);
        delete users[socket.id];
        io.emit("userList", Object.values(users)); // Atualiza a lista
    });
});


const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
