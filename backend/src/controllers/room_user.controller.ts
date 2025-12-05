import { Request, Response } from "express";
import room_userService from "../services/room_user.service";
import { IRoomUser } from "../models/room_user.model";

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
const getRoomByTypes = async(req: Request<{},{},{type: string; userId: string}>, res: Response) => {
  try{

    const {userId, type} = req.body
    const rooms = await room_userService.getRoomsByUserAndType(userId, type)

    res.status(200).json(rooms)
  }catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// Create room_user
const addRoomUser = async(req: Request<{}, IRoomUser>, res: Response) => {
  const {roomId, userId} = req.body

  // Validate
  if (!roomId || !userId) {
    return res.status(400).json({ message: "roomId and userId are required" });
  }

  try{
    const newRoomUser = await room_userService.add(roomId, userId)
    if(!newRoomUser) {
      res.status(500).json({message: "Unable to add Room_user"})
      return
    }
    res.status(201).json(newRoomUser)
  }catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
  
}

//const check if there is existing row with roomId and userId
const checkRoomUser = async(req: Request<{}, Partial<IRoomUser>>, res: Response)=>{
  const {roomId, userId} = req.body

  try{
    const roomUser = await room_userService.checkRoomUser(roomId,userId)

      res.status(201).json(roomUser)
    }catch (err) {
      console.error(err)
      res.status(500).json({ message: "Server error" })
    }
}
export default {
  getAllUsers,
  getRoomByTypes,
  addRoomUser,
  checkRoomUser
}