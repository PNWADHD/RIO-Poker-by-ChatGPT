
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.get('/', (req, res) => {
  res.send('RIO Poker backend is running.');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Sample socket logic
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat_message', (msg) => {
    io.emit('chat_message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
