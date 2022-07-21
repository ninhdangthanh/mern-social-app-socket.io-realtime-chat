const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});


let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);  

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  
  socket.on("sendMessage", ({newMessage, idUser}) => {
    const user = getUser(idUser)
    io.to(user.socketId).emit("getMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});