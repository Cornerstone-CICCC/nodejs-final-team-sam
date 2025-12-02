import type { Room, User } from "./data.types";

export type ListType={type:"private" ; data:User[]} |{type:'group'; data:Room[]}

export interface ModalProps{
    isOpen:boolean,
    onClose:()=>void
}
