import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const development = app.settings.env === "development";
const clientUrl = development
  ? "https://drawing-board-mur2f4uxn-aps-webdev.vercel.app/"
  : "http://localhost:3000";
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: clientUrl,
  },
});

io.on("connection", (socket) => {
  console.log("Socket Server Connected");
  socket.on("beginPath", (args) => {
    socket.broadcast.emit("beginPath", args);
  });

  socket.on("drawLine", (args) => {
    socket.broadcast.emit("drawLine", args);
  });

  socket.on("configChange", (args) => {
    socket.broadcast.emit("configChange", args);
  });
});

httpServer.listen(5000);
