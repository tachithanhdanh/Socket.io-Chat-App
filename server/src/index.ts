// Import the 'express' module
import express from 'express';
import { Server as socketio } from 'socket.io';
import http from 'http';

// Import the 'dotenv' module
const PORT = process.env.PORT || 5000;

// Create an Express application
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server
const io = new socketio(server);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
