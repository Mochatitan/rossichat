const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let chatHistory = []; // store all messages in memory

io.on("connection", (socket) => {
    let nickname = "Anonymous";

    // Send existing chat history to new client
    socket.emit("chat_history", chatHistory);

    socket.on("set_nickname", (name) => {
        nickname = name;
        const joinMsg = { user: "Server", text: `${nickname} joined the chat` };
        chatHistory.push(joinMsg);
        io.emit("chat_message", joinMsg);
    });

    socket.on("send_message", (msg) => {
        const newMsg = { user: nickname, text: msg };
        chatHistory.push(newMsg);
        io.emit("chat_message", newMsg);
    });

    socket.on("disconnect", () => {
        const leaveMsg = { user: "Server", text: `${nickname} left the chat` };
        chatHistory.push(leaveMsg);
        io.emit("chat_message", leaveMsg);
    });
});

server.listen(3001, () => console.log("Server listening on port 3001"));
