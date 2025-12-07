import { RoomUser, IRoomUser } from "../models/room_user.model";
import { Room } from "../models/room.model";
import mongoose from "mongoose";
import { Message } from "../models/message.model";

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
    match: {type},
  }).lean()

  //sort by latest message
  const validRooms = rooms.filter(r=>r.roomId !== null)

  const roomWithLatest = await Promise.all(
    validRooms.map(async (r)=>{
      const latestMsg = await Message.findOne({roomId:r.roomId._id})
      .sort({createdAt:-1})
      .lean()

      return{
        ...r,
        latestMsgDate: latestMsg?.createdAt || null
      }
    })
  )

  //sort by latest message date
  roomWithLatest.sort((a,b)=>{
    const dateA = a.latestMsgDate ? new Date(a.latestMsgDate).getTime() : 0;
    const dateB = b.latestMsgDate ? new Date(b.latestMsgDate).getTime() : 0;
    return dateB - dateA;
  })
  
  return roomWithLatest
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

      //get latest message date
      const latestMsg = await Message.findOne({roomId:r.roomId._id})
          .sort({createdAt:-1})
          .lean()

      return {
        room: r.roomId,
        otherUser: otherUser?.userId, // { _id, username }
        latestMsgDate:latestMsg?.createdAt || null
      };
    })
  );

  results.sort((a,b)=>{
    const dateA = a.latestMsgDate ? new Date(a.latestMsgDate).getTime() : 0;
    const dateB = b.latestMsgDate ? new Date(b.latestMsgDate).getTime() : 0;
    return dateB - dateA;
  })

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

