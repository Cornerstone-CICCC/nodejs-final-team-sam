import { RoomUser, IRoomUser } from "../models/room_user.model";

//Get users by roomId



// Get roomId by userId
const checkExistedRoom = async(ids: string[]) => {
  // find all room with ids
  const rooms = await RoomUser.find({
    userId: {$in: ids}
  })

  // count users per roomId
  const countMap = new Map()

  rooms.forEach(r => {
    const rid = r.roomId.toString()
    countMap.set(rid, (countMap.get(rid) || 0) + 1);
  })

  // find the roomId that has two users
  const existedRoomId = [...countMap.entries()].find(([_, count])=> count === ids.length)?.[0]

  return existedRoomId || null;
}

// Add room_users
const add = async(roomId: string, userId: string) => {
  return await RoomUser.create({roomId, userId})
}

export default{
  checkExistedRoom,
  add
}

