import { Server } from "socket.io";
import { handleSocketEvents } from "./event.handler";

export const socketHandler = (io: Server) => {
  io.on("connection", (socket)=> {
    console.log(`${socket.id} has connected`)
    handleSocketEvents(io, socket)
  })
}