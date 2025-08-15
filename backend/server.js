// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Keep track of messages in memory
let messages = [];

// Socket.io connection
io.on("connection", (socket) => {
    console.log("A user connected");

    // Send chat history to the new user
    socket.emit("chat history", messages);

    // Listen for new messages
    socket.on("chat message", (msg) => {
        messages.push(msg);
        io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Serve frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("/root/chat/rossichat/frontend/chat-client/dist"));
app.get("*", (req, res) => {
    res.sendFile(
        path.join("/root/chat/rossichat/frontend/chat-client/dist", "index.html")
    );
});

// Start server
const PORT = process.env.PORT || 80;
server.listen(PORT, "0.0.0.0");
