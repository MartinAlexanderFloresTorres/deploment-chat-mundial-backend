import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { PORT } from "./config.js";
let activos = 0;

const app = express();
const server = http.createServer(app);

//=============== Permitir coneciones de este frontend ===============//
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
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
  activos += 1;

  setInterval(() => {
    socket.emit("actualizar", activos);
  }, 1000);

  socket.on("disconnect", () => {
    if (activos >= 0) {
      activos -= 1;
    }
    setInterval(() => {
      socket.emit("actualizar", activos);
    }, 1000);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto - ${PORT}`);
});
