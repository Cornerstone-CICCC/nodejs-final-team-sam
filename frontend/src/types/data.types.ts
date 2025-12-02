export interface User{
    id: string,
    username:string
}

export interface Room{
    id:string,
    roomName:string
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