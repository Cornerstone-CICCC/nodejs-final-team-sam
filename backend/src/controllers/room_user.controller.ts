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

export default {
  getAllUsers
}