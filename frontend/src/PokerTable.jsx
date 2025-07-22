
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
const socket = io('https://rio-poker-backend.onrender.com');
export default function PokerTable() {
  const [players, setPlayers] = useState([]);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [board, setBoard] = useState([]);
  const [round, setRound] = useState('');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on('table_state', (state) => {
      setPlayers(state.players);
      setBoard(state.board || []);
      setRound(state.round || '');
    });

    socket.on('chat_message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    socket.on('hand_result', (result) => {
      setWinner(result.winner);
      setTimeout(() => setWinner(null), 4000);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chat_message', message.trim());
      setMessage('');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, backgroundColor: '#043b1a', color: 'white', minHeight: '100vh' }}>
      <img src="/rio-logo.png" alt="RIO Logo" style={{ width: 100, marginBottom: 20 }} />
      <div style={{ background: `url(/felt-texture.png)`, borderRadius: 16, padding: 20, boxShadow: '0 0 20px black' }}>
        <h2>Betting Round: {round}</h2>
        <div style={{ margin: '10px 0' }}>
          Board: {board.map((card, i) => <span key={i}>{card} </span>)}
        </div>
        <div>
          {players.map((p, i) => (
            <div key={i} style={{ margin: 5, backgroundColor: '#065f2f', padding: 10, borderRadius: 8 }}>
              <span style={{ marginRight: 8 }}>{p.avatar}</span>
              <b>{p.name}</b> – ${p.stack}
            </div>
          ))}
        </div>
        {winner && <div style={{ marginTop: 10, background: '#FFD700', color: '#000', padding: 10, borderRadius: 8 }}>
          🏆 Winner: {winner.name}
        </div>}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Chat</h3>
        <div style={{ maxHeight: 150, overflowY: 'auto', backgroundColor: '#222', padding: 10 }}>
          {chat.map((msg, i) => <div key={i}>{msg}</div>)}
        </div>
        <input value={message} onChange={e => setMessage(e.target.value)} style={{ width: '70%' }} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
