import type { Dispatch, SetStateAction } from "react";
import type { Message, OldMessage, Room, RoomType, User } from "./data.types";
import type { Socket } from "socket.io-client";

export interface AuthContextType{
    user:User|null,
    setUser:(u:User |null)=>void
}

export interface SocketContextType {
  isConnected: boolean;
  messages: any[];
  joinRoom: ({data}:JoinRoomProps) => void;
  leaveRoom: () => void;
  sendMessage: ({roomId, userId, content}:{roomId:string, userId:string, content:string}) => void;
  currentUsers:User[],
  socketLogin:(userId:string)=>void,
  socketLogout:(userId:string)=>void,
  removeRoom:(roomId:string, userId:string)=>void
  currentRoomList:Room[],
  oldMessages:OldMessage[],
  currentRoomId:string,
  setCurrentRoomId:Dispatch<SetStateAction<string>>,
  socket:Socket
}

export interface JoinRoomProps{
  // type:RoomType,
  data: JoinDmProps|JoinGroupProps
}

export interface JoinDmProps{
  currUserId: string,
  otherUserId:string,
  type: RoomType,
  roomname: string,
  roomId?:string
}

export interface JoinGroupProps{
  currUserId:string,
  roomId:string,
  type:RoomType
}