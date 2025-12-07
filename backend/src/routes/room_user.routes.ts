import { Router } from "express";
import room_userController from "../controllers/room_user.controller";

//Router
const roomUserRouter = Router()

roomUserRouter.get("/",room_userController.getAllUsers)
roomUserRouter.post("/typeanduser", room_userController.getRoomByTypes)
roomUserRouter.post("/typeandusername", room_userController.getDmRooms)
roomUserRouter.post("/checkexist", room_userController.checkRoomUser)
roomUserRouter.get("/:id", room_userController.getAllUsers)
roomUserRouter.post("/", room_userController.addRoomUser)



export default roomUserRouter