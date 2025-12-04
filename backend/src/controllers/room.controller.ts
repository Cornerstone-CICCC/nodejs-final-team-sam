import { Request, Response } from "express";
import { IRoom } from "../models/room.model";
import roomService from "../services/room.service";

//Get all rooms
const getAllRooms = async(req: Request, res: Response) => {
  try{
    const rooms = await roomService.getAll()
    res.status(200).json(rooms)
  }catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

//Get room by id
const getRoomById = async(req: Request<{id: string}>, res: Response) => {
  try{
    const room = await roomService.getById(req.params.id)
    if(!room) {
      res.status(404).json({message: "Room not found"})
      return
    }
    res.status(200).json(room)
  }catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

//Get room by room name
const getRoomByRoomName = async(req: Request<{},{},{}, {roomname: string}>, res: Response) => {
  try{
    const room = await roomService.getByName(req.query.roomname)
    if(!room) {
      res.status(404).json({message: "Room not found"})
      return
    }
    res.status(200).json(room)
  }catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// // get rooms by type
// const getRoomByTypes = async(req: Request<{},{},{type: string, userId: string}>, res: Response) => {
//   try{
//     const rooms = await room_userService.getRoomsByUser(req.body.userid, req.body.type)
//     if(!rooms){
//       res.status(500).json({message: "Rooms not found"})
//       return
//     }

//     res.status(200).json(rooms)
//   }catch (err) {
//     console.error(err)
//     res.status(500).json({ message: "Server error" })
//   }
// }

// Create room
const addRoom = async(req: Request<{}, IRoom>, res: Response) => {
  const {name, type} = req.body

  try{
    const newRoom = await roomService.add({name, type})
    if(!newRoom) {
      res.status(500).json({message: "Unable to add Room"})
      return
    }
    res.status(201).json(newRoom)
  }catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
  
}

//Update room by id
const updateRoomById = async(req: Request<{id: string}, Partial<IRoom>>, res: Response) => {
  const {name, type} = req.body
  try{
    const updatedRoom = await roomService.update(req.params.id, {name, type})

    if(!updatedRoom) {
      res.status(500).json({message: "Unable to update room"})
      return
    }
    res.status(200).json(updatedRoom)
  }catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete room by id
const deleteRoomById = async(req: Request<{id: string}>, res: Response) => {
  try{
    const deletedRoom = await roomService.remove(req.params.id)
    if(!deletedRoom) {
      res.status(500).json({message: "Unable to delete room"})
      return
    }
    res.status(200).json(deletedRoom)
  }catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }

}

export default{
  getAllRooms,
  getRoomById,
  getRoomByRoomName,
  addRoom,
  updateRoomById,
  deleteRoomById
}