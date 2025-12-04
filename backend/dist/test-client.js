"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)("http://localhost:3500");
socket.on("connect", () => {
    console.log("Connected to Server: ", socket.id);
    socket.emit('login', {
        userId: "6930d004f5d7fd00dfabf1cd"
    });
});
