"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_user_controller_1 = __importDefault(require("../controllers/room_user.controller"));
//Router
const roomUserRouter = (0, express_1.Router)();
roomUserRouter.get("/:id", room_user_controller_1.default.getAllUsers);
exports.default = roomUserRouter;
