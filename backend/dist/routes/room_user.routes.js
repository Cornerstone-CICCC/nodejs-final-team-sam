"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_user_controller_1 = __importDefault(require("../controllers/room_user.controller"));
//Router
const roomUserRouter = (0, express_1.Router)();
roomUserRouter.get("/", room_user_controller_1.default.getAllUsers);
roomUserRouter.post("/typeanduser", room_user_controller_1.default.getRoomByTypes);
roomUserRouter.post("/checkexist", room_user_controller_1.default.checkRoomUser);
roomUserRouter.get("/:id", room_user_controller_1.default.getAllUsers);
roomUserRouter.post("/", room_user_controller_1.default.addRoomUser);
exports.default = roomUserRouter;
