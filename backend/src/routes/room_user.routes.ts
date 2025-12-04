import { Router } from "express";
import room_userController from "../controllers/room_user.controller";

//Router
const roomUserRouter = Router()

roomUserRouter.post("/typeanduser", room_userController.getRoomByTypes)
roomUserRouter.get("/:id", room_userController.getAllUsers)

export default roomUserRouter