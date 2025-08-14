const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let chatHistory = [];

io.on("connection", (socket) => {
    let nickname = "Anonymous";

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

// ✅ Serve your React build
const frontendPath = "/root/chat/rossichat/frontend/chat-client/dist";
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Listen on all interfaces
server.listen(3001, "0.0.0.0", () => {
    console.log("Server running at http://<your_public_ip>:3001");
});
