import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { PORT } from "./config.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-mundial.netlify.app",
  },
});

app.use(cors());
app.use(morgan("dev"));
io.on("connection", (socket) => {
  socket.on("envio", (e) => {
    socket.broadcast.emit("respuesta", {
      body: e,
      id: socket.id,
    });
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto - ${PORT}`);
});
