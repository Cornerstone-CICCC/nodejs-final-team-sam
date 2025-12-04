import type { Room, User } from "./data.types";

export type ListType={ data:Room[]}

export interface ModalProps{
    isOpen:boolean,
    onClose:()=>void,
    submitType:'create'|'update'
    setGroups:React.Dispatch<React.SetStateAction<any[]>>
}

export interface ChatHeadProps{
    roomId:string,
    showMember:()=>void
}
