import { RoomUser, IRoomUser } from "../models/room_user.model";
import { Room } from "../models/room.model";
import mongoose from "mongoose";

//Get all users by roomId
const getAll = async(roomId:string) => {
  const users = await RoomUser.find({roomId}).populate("userId", "username").lean()
  return users
}

// Get all rooms by userId
const getAllRooms = async(userId: string) => {
  const rooms = await RoomUser.find({userId}).populate("roomId", "name").lean()
  return rooms
}

// Get rooms by type and userId
const getRoomsByUserAndType = async(userId: string, type: string) => {
  const rooms = await RoomUser.find({userId}).populate({
    path: "roomId",
    match: {type}
  }).lean()
  
  return rooms.filter(r=> r.roomId !== null)
}

// Get roomId by userId
const checkExistedRoom = async(ids: string[], type: string) => {
  // find all room with ids
  const rooms = await RoomUser.find({
    userId: {$in: ids}
  }).lean()
  console.log(rooms)

  // count users per roomId
  const countMap = new Map()

  rooms.forEach(r => {
    const rid = r.roomId.toString()
    countMap.set(rid, (countMap.get(rid) || 0) + 1);
  })

  // find the roomId that has two users
  const existedRoomId = [...countMap.entries()].find(([_, count])=> count === ids.length)?.[0]
  console.log(existedRoomId)
  if(!existedRoomId) return null;

  const room = await Room.findOne({
    _id: existedRoomId,
    type
  }).lean()


  return room? room._id.toString(): null;
}

//check room user exist or not
const checkRoomUser = async(roomId:string, userId:string)=>{
  return await RoomUser.find({roomId, userId})
}

// Add room_users
const add = async(roomId: string, userId: string) => {
  return await RoomUser.create({roomId, userId})
}

// Delete room_users when they leave
const remove = async(roomId: string, userId: string) => {
  return await RoomUser.deleteOne({roomId, userId})
}

//get dm other username
const getDmRoomsWithOtherUser = async (userId: string) => {
  // 1. Find all RoomUser entries for this user where room type is "dm"
  const rooms = await RoomUser.find({ userId })
    .populate({
      path: "roomId",
      match: { type: "dm" }, 
    })
    .lean();

  const validRooms = rooms.filter(r => r.roomId !== null);

  // 2. For each DM room, find the other user
  const results = await Promise.all(
    validRooms.map(async (r) => {
      const otherUser = await RoomUser.findOne({
        roomId: r.roomId._id,
        userId: { $ne: new mongoose.Types.ObjectId(userId) } // exclude current user
      })
      .populate({ path: "userId", select: "username" })
      .lean();

      return {
        room: r.roomId,
        otherUser: otherUser?.userId // { _id, username }
      };
    })
  );

  return results;
};

export default{
  checkExistedRoom,
  checkRoomUser,
  add,
  getAll,
  remove,
  getAllRooms,
  getRoomsByUserAndType,
  getDmRoomsWithOtherUser
}

