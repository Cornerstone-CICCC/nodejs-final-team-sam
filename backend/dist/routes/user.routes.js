"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
//Router
const userRouter = (0, express_1.Router)();
userRouter.get('/', user_controller_1.default.getAllUsers);
userRouter.get('/search', user_controller_1.default.getUserByUsername);
userRouter.get("/:id", user_controller_1.default.getUserById);
userRouter.post("/signup", user_controller_1.default.addUser);
userRouter.post("/login", user_controller_1.default.login);
userRouter.get("/logout", user_controller_1.default.logout);
userRouter.put("/:id", user_controller_1.default.updateUserById);
userRouter.delete("/:id", user_controller_1.default.deleteUser);
exports.default = userRouter;
