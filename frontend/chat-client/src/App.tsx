import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  user: string;
  text: string;
}

// ✅ No hardcoded IP — will connect to same origin as the page
const socket: Socket = io();

export default function App() {
  const [nickname, setNickname] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [joined, setJoined] = useState<boolean>(false);

  useEffect(() => {
    socket.on("chat_history", (history: ChatMessage[]) => {
      setMessages(history);
    });

    socket.on("chat_message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat_history");
      socket.off("chat_message");
    };
  }, []);

  const joinChat = () => {
    if (nickname.trim()) {
      socket.emit("set_nickname", nickname);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", message);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {!joined ? (
        <div>
          <h2>Enter your nickname</h2>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname"
          />
          <button onClick={joinChat}>Join</button>
        </div>
      ) : (
        <div>
          <h2>Chat Room</h2>
          <div
            style={{
              border: "1px solid #ccc",
              height: "300px",
              overflowY: "auto",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            {messages.map((m, i) => (
              <div key={i}>
                <strong>{m.user}: </strong>{m.text}
              </div>
            ))}
          </div>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
