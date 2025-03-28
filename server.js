const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

io.on("connection", (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    // Registro de usuário
    socket.on("registerUser", (username) => {
        socket.username = username;
        console.log(`${username} entrou no chat.`);
    });

    // Receber e reenviar mensagens de chat
    socket.on("chatMessage", (data) => {
        io.emit("chatMessage", data);
    });

    // Receber e reenviar imagens
    socket.on("sendImage", (data) => {
        io.emit("receiveImage", data);
    });

    // Notificação de digitação
    socket.on("typing", (username) => {
        socket.broadcast.emit("typing", username);
    });

    socket.on("stopTyping", () => {
        socket.broadcast.emit("stopTyping");
    });

    // Desconexão do usuário
    socket.on("disconnect", () => {
        console.log(`Usuário desconectado: ${socket.id}`);
    });
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});