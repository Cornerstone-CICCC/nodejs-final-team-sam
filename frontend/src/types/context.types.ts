import type { Message, OldMessage, Room, RoomType, User } from "./data.types";

export interface AuthContextType{
    user:User|null,
    setUser:(u:User |null)=>void
}

export interface SocketContextType {
  isConnected: boolean;
  messages: any[];
  joinRoom: ({data}:JoinRoomProps) => void;
  leaveRoom: (roomId:string) => void;
  sendMessage: ({roomId, userId, content}:{roomId:string, userId:string, content:string}) => void;
  currentUsers:User[],
  socketLogin:(userId:string)=>void,
  socketLogout:(userId:string)=>void,
  removeRoom:(roomId:string, userId:string)=>void
  currentRoomList:Room[],
  oldMessages:OldMessage[],
  currentRoom:Room|null,
}

export interface JoinRoomProps{
  // type:RoomType,
  data: JoinDmProps|JoinGroupProps
}

export interface JoinDmProps{
  currUserId: string,
  otherUserId:string,
  type: RoomType,
  roomname: string
}

export interface JoinGroupProps{
  currUserId:string,
  roomId:string,
  type:RoomType
}