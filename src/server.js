const express = require("express");
const listEndpoints = require("express-list-endpoints");
const profileRouter = require("./routes/profiles");
const postRouter = require("./routes/posts");
const passport = require("passport");
const session = require("express-session");
require("../src/routes/profiles/authTools");
const cookieParser = require("cookie-parser");
const profileModel = require("./routes/profiles/schema");
const http = require("http")
const socketio = require("socket.io")
const {
  addUserToRoom,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./routes/rooms/users")
const {addMessage, addSingleMessage}= require("./routes/messages/messages")
const experienceRouter = require("./routes/experiences");
const { join } = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const server = express();
server.use(cookieParser());
server.use(cors());
const app = http.createServer(server);
const io = socketio(app);

//server.use(express.static(join(__dirname, `../public`)))
const port = process.env.PORT;
server.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
server.use(passport.initialize());
server.use(passport.session());

server.use(express.json());
server.use("/profile", profileRouter);
server.use("/post", postRouter);
server.use("/experience", experienceRouter);
console.log(listEndpoints(server));

io.on("connection", (socket) => {
  console.log("New WebSocket connection ", socket.id);

  socket.on("join", async (options) => {
    try {
      const { username, room } = await addUserToRoom({
        id: socket.id,
        ...options,
      });

      socket.join(room);

      const welcomeMessage = {
        sender: "Admin",
        text: `Welcome to ${room} channel`,
        createdAt: new Date(),
      };

      socket.emit("message", welcomeMessage);

      const messageToRoomMembers = {
        sender: "Admin",
        text: `${username} has joined!`,
        createdAt: new Date(),
      };

      socket.broadcast.to(room).emit("message", messageToRoomMembers);

      const roomMembers = await getUsersInRoom(room);
      io.to(room).emit("roomData", {
        room: room,
        users: roomMembers,
      });
    } catch (error) {
      console.log(error);
    }
  })
  socket.on("privateChat", ({ sender, text, receiver }) => {
    let to = profileModel.findById((user)=>user._id===receiver)
    let from = profileModel.findById((user) => user._id === sender);
    io.to(to.id).emit("message", { sender, text, receiver});
    io.to(from.id).emit("message", { sender, text, receiver});

    console.log(to);
    console.log(from);
  });
  
  socket.on("groupChat", async ({ text, room }) => {
    try {
      const user = await getUser(room, socket.id);

      const messageContent = {
        sender: user.username,
        text: text,
        createdAt: new Date(),
      };

      const response = await addMessage(
        messageContent.text,
        user.username,
        room
      );
      if (response) {
        io.to(room).emit("message", messageContent);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("leaveRoom", async ({ room }) => {
    try {
      const user = await removeUser(socket.id, room);
      const message = {
        username: "Admin",
        text: `${user.username} has left!`,
        createdAt: new Date(),
      };

      const roomMembers = await getUsersInRoom(room);
      if (user) {
        io.to(room).emit("message", message);
        io.to(room).emit("roomData", {
          room: room,
          users: roomMembers,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
});

mongoose
  .connect(
    process.env.MONGO_CONNECTION,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(
    server.listen(port, () => {
      console.log(`Server is Running on ${port}`);
    })
  )
  .catch((err) => console.log(err));
