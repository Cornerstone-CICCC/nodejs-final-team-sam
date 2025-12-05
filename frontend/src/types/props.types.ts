import type { Room, User } from "./data.types";

export interface ListType{ 
    data:RoomUserResult[],
    type:"dm"|"group"
}

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