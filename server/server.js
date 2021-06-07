const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const cors = require("cors");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

//app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(router);

io.on("connect", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    //console.log(name, room);
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);
    socket.join(user.room);
    socket.emit("message", {
      user: "admin",
      text: `Hey there ${user.name}! Welcome to ${user.room}! :sparkles: `,
    });
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `Hey, ${user.name} just joined the room! :smile:`,
    });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    console.log(getUsersInRoom(user.room));
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    //console.log(socket.id);
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left the room! :worried: `,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
    //console.log("Left");
  });
});

server.listen(PORT, () => console.log(`Server : ${PORT}`));
