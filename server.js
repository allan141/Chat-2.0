const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const users = {}; // Objeto para armazenar usuários conectados

io.on("connection", (socket) => {
    console.log("Novo usuário conectado:", socket.id);

    // Armazena o nome do usuário quando ele entra
    socket.on("userJoined", (username) => {
        users[socket.id] = username;
        io.emit("userList", Object.values(users));
        io.emit("serverMessage", { message: `${username} entrou no chat.`, type: "join" });
    });

    // Mensagem de texto
    socket.on("chatMessage", (data) => {
        io.emit("chatMessage", data);
    });

    // Mensagem de áudio
    socket.on("audioMessage", (data) => {
        io.emit("audioMessage", data);
    });

    // Indicador de "digitando..."
    socket.on("typing", (username) => {
        socket.broadcast.emit("typing", username);
    });

    // Quando um usuário sai
    socket.on("disconnect", () => {
        const username = users[socket.id] || "Usuário desconhecido";
        delete users[socket.id];
        io.emit("userList", Object.values(users));
        io.emit("serverMessage", { message: `${username} saiu do chat.`, type: "leave" });
        console.log("Usuário desconectado:", socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));