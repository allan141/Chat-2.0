const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("Novo usuário conectado:", socket.id);

    // Mensagem de texto
    socket.on("chatMessage", (data) => {
        io.emit("chatMessage", data);
    });

    // Notificação de "está digitando..."
    socket.on("typing", (username) => {
        socket.broadcast.emit("typing", username);
    });

    // Parar de mostrar "está digitando..."
    socket.on("stopTyping", () => {
        socket.broadcast.emit("stopTyping");
    });

    socket.on("disconnect", () => {
        console.log("Usuário desconectado:", socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));