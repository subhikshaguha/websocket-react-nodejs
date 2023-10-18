import express from "express";
import cors from "cors";
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const PORT = 4000;
const socketIO = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors())

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)  
    socket.on("message", data => {
      // broadcast to all sockets except the one that sent the message
      // socket.broadcast.emit("messageResponse", data);
      // broadcast to all sockets including the one that sent the message
      socketIO.emit("messageResponse", data);
      
      // socket.emit("message", data)
      // emit to particular socket 
      // socket.to(anotherSocketId).emit("private message", socket.id, msg);
    })
 
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
      socket.disconnect()
    });
});

app.get("/api", (req, res) => {
  res.json({message: "Hello"})
});

   
server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});