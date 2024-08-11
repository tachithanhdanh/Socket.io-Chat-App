// Import the 'express' module
import express from 'express';
import { Socket, Server as socketio } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import router from './router';
import cors from 'cors';
import { addUser, removeUser, getUser, getUsersInRoom, User } from './users';
import { SOCKET_EVENT } from './constants';

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

io.on(SOCKET_EVENT.CONNECT, (socket : Socket) => {
  console.log('We have a new connection!!!');

  socket.on(SOCKET_EVENT.JOIN, ({ name, room }, callback: Function) => {
    const { error, user } = addUser({ id: socket.id, name, room }) as { error: string; user?: User };
    
    if (!user) return callback(error);

    // Emit a message to the user who joined
    socket.emit(SOCKET_EVENT.SERVER_MESSAGE, { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });

    // Emit a message to everyone in the room except the user who joined
    socket.broadcast.to(user.room).emit(SOCKET_EVENT.SERVER_MESSAGE, { user : 'admin', text: `${user.name} has joined!` });

    socket.join(user.room);

    // This callback is called without any arguments if there is no error
    callback();
  });

  socket.on(SOCKET_EVENT.CLIENT_MESSAGE, (message, callback) => {
    const user = getUser(socket.id);

    if (!user) {
      return callback('User not found');
    }

    io.to(user.room).emit(SOCKET_EVENT.SERVER_MESSAGE, { user: user.name, text: message });

    callback();
  });

  socket.on(SOCKET_EVENT.DISCONNECT, () => {
    console.log('User had left!!!');
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
