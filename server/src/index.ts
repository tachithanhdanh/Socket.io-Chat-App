// Import the 'express' module
import express from "express";
import { Socket, Server as socketio } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import router from "./router";
import cors from "cors";
import { addUser, removeUser, getUser, getUsersInRoom, User } from "./users";
import { SOCKET_EVENT } from "./constants";
import connectDb from "./dbConnection";
import { ChatLog, ChatLogModel } from "./ChatLogModel";

dotenv.config();

connectDb();

// Import the 'dotenv' module
const PORT = process.env.PORT || 5050;

// Create an Express application
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:5001", "http://127.0.0.1:5001"],
  },
});

// Use the 'cors' middleware
app.use(cors());

// Use the router
app.use(router);

io.on(SOCKET_EVENT.CONNECT, (socket: Socket) => {
  // console.log('We have a new connection!!!');

  socket.on(SOCKET_EVENT.JOIN, async ({ name, room }, callback: Function) => {
    if (name.trim().toLowerCase() === "admin") {
      return callback('Cannot use the name "admin"');
    }

    const { error, user } = addUser({ id: socket.id, name, room }) as {
      error: string;
      user?: User;
    };

    if (!user) return callback(error);

    
    let chatLogs: ChatLog[] | null = null;
    try {
      chatLogs = await ChatLogModel.find({ room: user.room });
    } catch (error) {
      console.log(error);
    }
    
    if (chatLogs) {
      socket.emit(SOCKET_EVENT.CHAT_LOG, chatLogs);
    }
    
    // Emit a message to the user who joined
    socket.emit(SOCKET_EVENT.SERVER_MESSAGE, {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });
    
    const joinedMessage: ChatLog = {
      room: user.room,
      user: "admin",
      text: `${user.name} has joined!`,
    };
    ChatLogModel.create(joinedMessage);

    // Emit a message to everyone in the room except the user who joined
    socket.broadcast
      .to(user.room)
      .emit(SOCKET_EVENT.SERVER_MESSAGE, {
        user: joinedMessage.user,
        text: joinedMessage.text,
      });

    socket.join(user.room);

    // Emit a message to everyone in the room
    // Purpose: To update the list of users in the room
    io.to(user.room).emit(SOCKET_EVENT.ROOM_DATA, {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    // This callback is called without any arguments if there is no error
    callback();
  });

  socket.on(SOCKET_EVENT.CLIENT_MESSAGE, (message, callback) => {
    const user = getUser(socket.id);

    if (!user) {
      return callback("User not found");
    }

    const chatMessage: ChatLog = {
      room: user.room,
      user: user.name,
      text: message,
    }; 

    ChatLogModel.create(chatMessage);

    io.to(user.room).emit(SOCKET_EVENT.SERVER_MESSAGE, {
      user: user.name,
      text: message,
    });
    io.to(user.room).emit(SOCKET_EVENT.ROOM_DATA, {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on(SOCKET_EVENT.DISCONNECT, () => {
    const user: User | undefined = removeUser(socket.id);

    if (user) {
      const chatMessage: ChatLog = {
        room: user.room,
        user: "admin",
        text: `${user.name} has left.`,
      };

      ChatLogModel.create(chatMessage);

      io.to(user.room).emit(SOCKET_EVENT.SERVER_MESSAGE, {
        user: chatMessage.user,
        text: chatMessage.text,
      });
    }
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
