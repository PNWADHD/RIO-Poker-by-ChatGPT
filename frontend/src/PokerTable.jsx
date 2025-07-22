import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// ✅ Correct backend socket URL from Render
const socket = io('https://rio-poker-by-chatgpt-1.onrender.com');

const PokerTable = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('chat_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('chat_message');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('chat_message', input);
      setInput('');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">RIO Poker</h1>

      <div className="border rounded p-2 h-40 overflow-y-scroll mb-2 bg-gray-100">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm">{msg}</div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white rounded px-4 py-1"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default PokerTable;
