import type { Room, User } from "./data.types";

export type ListType={type:"dm" ; data:User[]} |{type:'group'; data:Room[]}

export interface ModalProps{
    isOpen:boolean,
    onClose:()=>void,
    submitType:'create'|'update'
}

export interface ChatHeadProps{
    roomId:string,
    showMember:()=>void
}
