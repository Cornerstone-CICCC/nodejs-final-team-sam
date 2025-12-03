import { Room, IRoom } from "../models/room.model";

//Get all rooms
const getAll = async() => {
  return await Room.find()
}

// Get room by id
const getById = async(id: string) => {
  return await Room.findById(id)
}

// Get room by room name
const getByName = async(roomname: string) => {
  return await Room.findOne({
    name: roomname
  })
}

// Get list of rooms by the type - 'dm' or 'group'
const getTypeRooms = async(type: string) => {
  return await Room.find({
    type
  })
}

// Add room
const add = async(newRoom: Partial<IRoom>) => {
  return await Room.create(newRoom)
}

//Update room by id
const update = async(id: string, data: Partial<IRoom>) => {
  return await Room.findByIdAndUpdate(id, data, {
    new: true
  })
}

//Delete room by id
const remove = async(id: string) => {
  return await Room.findByIdAndDelete(id)
}

export default{
  getAll,
  getById,
  getByName,
  getTypeRooms,
  add,
  update,
  remove
}