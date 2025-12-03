import { Router } from "express";
import room_userController from "../controllers/room_user.controller";

//Router
const roomUserRouter = Router()

roomUserRouter.get("/", room_userController.getAllUsers)

export default roomUserRouter