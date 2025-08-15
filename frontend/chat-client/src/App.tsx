import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { io } from "socket.io-client";
import "./index.css";

const socket = io(); // auto-connect to same origin

function App() {
  const [nickname, setNickname] = useState("");
  const [tempNick, setTempNick] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("chat message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("chat history", (history: string[]) => {
      setMessages(history);
    });

    return () => {
      socket.off("chat message");
      socket.off("chat history");
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", `${nickname}: ${message}`);
      setMessage("");
    }
  };

  if (!nickname) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Enter your nickname</h2>
        <input
          value={tempNick}
          onChange={(e) => setTempNick(e.target.value)}
          placeholder="Nickname"
        />
        <button onClick={() => tempNick && setNickname(tempNick)}>Join</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat Room</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "scroll",
          padding: "5px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ width: "80%" }}
        />
        <button type="submit" style={{ width: "18%" }}>
          Send
        </button>
      </form>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
