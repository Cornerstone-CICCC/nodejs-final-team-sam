import { io } from "socket.io-client";

const socket = io("http://localhost:3500")

socket.on("connect", () => {
  console.log("Connected to Server: " , socket.id)

  socket.emit('login', {
    userId: "6930d004f5d7fd00dfabf1cd"
  })

  

} )

