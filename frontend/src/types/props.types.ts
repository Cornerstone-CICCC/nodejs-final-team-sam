import type { Room, User } from "./data.types";

export type ListType= {type:"group"; data:RoomUserResult[]}|{type:"dm", data:DmData[]}

export interface RoomUserResult{
    userId:string,
    _id:string,
    updatedAt:string,
    createdAt:string
    roomId:Room
}
export interface ModalProps{
    isOpen:boolean,
    onClose:()=>void,
    submitType:'create'|'update'
    setGroups?:React.Dispatch<React.SetStateAction<any[]>>
    onUpdate?:()=> void
}
// DM-specific result type
export interface DmData {
  otherUser: User;
  room: Room;
}

export interface ChatHeadProps{
    roomId:string,
    showMember:()=>void
}

export interface MemberResult{
    userId:User,
    _id:string,//room user id
    roomId:string,
    createdAt:string,
    updatedAt:string
}