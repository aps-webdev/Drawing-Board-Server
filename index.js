const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

app.get("/", (_, res) => {
  res.send("Hello, from express");
});

app.get("/health", (_, res) => {
  const data = {
    uptime: process.uptime(),
    message: "Ok",
    date: new Date(),
  };

  res.status(200).send(data);
});

const development = app.settings.env == "development";
const clientUrl = development
  ? "http://localhost:3000"
  : "https://drawing-board-mur2f4uxn-aps-webdev.vercel.app/";

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
