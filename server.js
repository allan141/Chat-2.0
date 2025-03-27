const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("Novo usuário conectado:", socket.id);

    socket.on("chatMessage", (data) => {
        // Enviar mensagem para todos EXCETO o próprio remetente
        socket.broadcast.emit("chatMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("Usuário desconectado:", socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));