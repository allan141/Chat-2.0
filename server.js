const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("Novo usuário conectado:", socket.id);

    // Quando o usuário envia uma mensagem de texto
    socket.on("chatMessage", (data) => {
        io.emit("chatMessage", { username: data.username, message: data.message });
    });

    // Quando o usuário envia uma mensagem de áudio
    socket.on("audioMessage", (data) => {
        io.emit("audioMessage", { username: data.username, audio: data.audio });
    });

    // Quando o usuário desconecta
    socket.on("disconnect", () => {
        console.log("Usuário desconectado:", socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));