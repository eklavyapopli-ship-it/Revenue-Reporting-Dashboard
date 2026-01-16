"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader } from "lucide-react";

export default function ChatWebSocket() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { sender: "you" | "worker"; text: string; loading?: boolean }[]
  >([]);
  const [connected, setConnected] = useState(false);

  const ws = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Connect WebSocket
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws");

    ws.current.onopen = () => setConnected(true);

    ws.current.onmessage = (event) => {
      // Remove loading state for last worker message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.loading ? { sender: "worker", text: event.data } : msg
        )
      );
      scrollToBottom();
    };

    ws.current.onclose = () => setConnected(false);

    return () => ws.current?.close();
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!message.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN)
      return;

    // Add your message to chat
    setMessages((prev) => [...prev, { sender: "you", text: message }]);
    scrollToBottom();

    // Add placeholder for worker with loading
    setMessages((prev) => [
      ...prev,
      { sender: "worker", text: "", loading: true },
    ]);

    ws.current.send(message);
    setMessage("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto h-[80vh] flex flex-col justify-end">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 rounded-t-2xl border-b border-gray-200">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "you" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-xl break-words ${
                msg.sender === "you"
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-white text-gray-900 rounded-bl-none border"
              } flex items-center gap-2`}
            >
              {msg.loading && <Loader className="h-4 w-4 animate-spin text-gray-400" />}
              <span>{msg.loading ? "Typing..." : msg.text}</span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input section */}
      <div className="flex gap-2 p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <input
          type="text"
          className="flex-1 rounded-full border text-black px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500"
          placeholder={connected ? "Type a message..." : "Connecting..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!connected}
        />
        <button
          onClick={sendMessage}
          disabled={!connected || !message.trim()}
          className="rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
