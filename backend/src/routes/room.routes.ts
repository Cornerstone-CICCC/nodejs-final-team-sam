import { Router } from "express";
import roomController from "../controllers/room.controller";

const roomRouter = Router()

roomRouter.get("/", roomController.getAllRooms)
roomRouter.get("/search", roomController.getRoomByRoomName)
// roomRouter.get("/types/:type", roomController.getRoomByTypes)
roomRouter.get("/:id", roomController.getRoomById)
roomRouter.post("/", roomController.addRoom)
roomRouter.put("/:id", roomController.updateRoomById)
roomRouter.delete("/:id", roomController.deleteRoomById)

export default roomRouter