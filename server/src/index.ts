// Import the 'express' module
import express from 'express';
import { Socket, Server as socketio } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import router from './router';
import cors from 'cors';

dotenv.config();

// Import the 'dotenv' module
const PORT = process.env.PORT || 5000;

// Create an Express application
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server
const io = require('socket.io')(server, {
  cors: {
    origin: ["http://localhost:5001", "http://127.0.0.1:5001"],
  }
});

// Use the 'cors' middleware
app.use(cors());

// Use the router
app.use(router);

console.log("Hello")

io.on('connection', (socket : Socket) => {
  console.log('We have a new connection!!!');

  socket.on('join', ({ name, room }, callback: Function) => {
    console.log(name, room);
  });

  socket.on('disconnect', () => {
    console.log('User had left!!!');
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
