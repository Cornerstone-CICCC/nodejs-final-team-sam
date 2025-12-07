
import type { Room, User } from "./data.types";

export type ListType= 
    |
    {
        type:"group"; 
        data:RoomUserResult[]; 
        unreadGroups:{[roomId:string]:boolean};
        clickRoom: (roomId:string) => void;
    }
    | {
        type:"dm"; 
        data:DmData[]; 
        unreadDMs:{[userId:string]:boolean};
        clickRoom: (roomId: string, otherUserId?:string) => void;
    }

export interface NewDmType {
    roomId: string,
    senderId:string,
    contentPreview:string,
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
// DM-specific result type
export interface DmData {
  otherUser: User;
  room: Room;
}

export interface SidebarProps{
    trigger?:boolean
}

export interface ChatHeadProps{
    roomId:string,
    showMember:()=>void
    onTrigger?:()=>void
}

export interface MemberResult{
    userId:User,
    _id:string,//room user id
    roomId:string,
    createdAt:string,
    updatedAt:string
}