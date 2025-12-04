import type { Room, RoomType, User } from "./data.types";

export interface AuthContextType{
    user:User|null,
    setUser:(u:User |null)=>void
}

export interface SocketContextType {
  isConnected: boolean;
  messages: any[];
  joinRoom: ({type, data}:JoinRoomProps) => void;
  leaveRoom: () => void;
  sendMessage: ({roomId, userId, content}:{roomId:string, userId:string, content:string}) => void;
  currentUsers:User[],
  login:(userId:string)=>void,
  logout:(userId:string)=>void,
  removeRoom:(roomId:string)=>void
  currentRoomList:Room[]
}

export interface JoinRoomProps{
  type:RoomType,
  data: JoinDmProps|JoinGroupProps
}


export interface JoinDmProps{
  currUserId: string,
  otherUserId:string,
  typ: RoomType,
  roomname: string
}

export interface JoinGroupProps{
  currUserId:string,
  roomId:string,
  typr:RoomType
}