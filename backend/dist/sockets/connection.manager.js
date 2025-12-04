"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const event_handler_1 = require("./event.handler");
const socketHandler = (io) => {
    io.on("connection", (socket) => {
        //console.log(`${socket.id} has connected`)
        (0, event_handler_1.handleSocketEvents)(io, socket);
    });
};
exports.socketHandler = socketHandler;
