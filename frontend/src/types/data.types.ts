export interface User{
    _id: string,
    username:string
}

export interface Room{
    _id:string,
    name:string,
    type:RoomType,
    createAt: string,
    updatedAt:string,
}

export interface Message{
    id: string,
    roomId:string,
    senderId:string,
    content:string,
    createdAt:string
}

export interface Received{
    username:string,
    message:string
}

export type RoomType= "dm"| "group"
