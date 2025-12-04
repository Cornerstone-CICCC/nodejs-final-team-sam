import { Request, Response } from "express";
import room_userService from "../services/room_user.service";

//Get all users in the group
// id means roomId
const getAllUsers = async(req: Request<{id: string}>, res: Response) => {
  try{
    const roomId = req.params.id
    const users = await room_userService.getAll(roomId)
    res.status(200).json(users)
  }catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// get rooms by type
const getRoomByTypes = async(req: Request<{},{},{type: string, userId: string}>, res: Response) => {
  try{
    const rooms = await room_userService.getRoomsByUserAndType(req.body.userId, req.body.type)
    if(!rooms){
      res.status(500).json({message: "Rooms not found"})
      return
    }

    res.status(200).json(rooms)
  }catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

export default {
  getAllUsers,
  getRoomByTypes
}