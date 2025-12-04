"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_controller_1 = __importDefault(require("../controllers/room.controller"));
const roomRouter = (0, express_1.Router)();
roomRouter.get("/", room_controller_1.default.getAllRooms);
roomRouter.get("/search", room_controller_1.default.getRoomByRoomName);
roomRouter.get("/types/:type", room_controller_1.default.getRoomByTypes);
roomRouter.get("/:id", room_controller_1.default.getRoomById);
roomRouter.post("/", room_controller_1.default.addRoom);
roomRouter.put("/:id", room_controller_1.default.updateRoomById);
roomRouter.delete("/:id", room_controller_1.default.deleteRoomById);
exports.default = roomRouter;
