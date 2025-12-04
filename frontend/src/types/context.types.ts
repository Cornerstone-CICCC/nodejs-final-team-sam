import type { User } from "./data.types";

export interface AuthContextType{
    user:User|null,
    setUser:(u:User |null)=>void
}

export interface SocketContextType {
  isConnected: boolean;
  messages: any[];
  joinRoom: (room: string, username: string) => void;
  leaveRoom: () => void;
  sendMessage: (message: string, username: string) => void;
  onlineUsers:User[]
}