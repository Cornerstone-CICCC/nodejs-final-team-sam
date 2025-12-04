import { getGroupRooms } from "../api/rooms.api"
import type { RoomType } from "../types/data.types"

export const loadRooms = async(type:RoomType)=>{
    if(type=="group"){
        return await getGroupRooms()
    }
}