import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import type { Message, User } from "../types/data.types";
import type { SocketContextType } from "../types/context.types";
import { AuthContext, useAuth } from "./AuthContext";

const SocketContext = createContext<SocketContextType| null>(null)

export const SocketProvider =({children}:{children:React.ReactNode})=>{
    const [isConnected, setIsConnected] = useState(false)
    const [currentRoom, setCurrentRoom] =useState<string|null>(null)
    const [onlineUsers, setOnlineUsers] =useState<User[]>([])
    const [messages, setMessages] = useState<Message[]>([])

    const { user } = useAuth()

    useEffect(()=>{
      if(!user){
        if(socket){
          socket.disconnect()
        }
        return
      }
        socket.connect()

        socket.on('connect', ()=> setIsConnected(true))
        socket.on('disconnect',()=>setIsConnected(false))

        //listener
        socket.on('chatRoom',(message)=>{
            setMessages((prev)=>[...prev, message])
        })
        
        socket.on('updateOnlineUsers', (users:User[])=>setOnlineUsers(users))

        return ()=>{
            //remove all lisner
            socket.off('connect')
            socket.off('disconnect')
            socket.off('chatRoom')
            socket.off('updateOnlineUsers')
            socket.disconnect()
        }
    },[])

    const joinRoom =(room:string, username:string)=>{
        setCurrentRoom(room)
        setMessages([])
        socket.emit('joinRoom',{room})
    }

    const leaveRoom = () => {
        if (!currentRoom) return;
        socket.emit("leaveRoom", { room: currentRoom });
        setCurrentRoom(null);
        setMessages([]);
        setOnlineUsers([]);
  };

  const sendMessage = (message: string, username: string) => {
    if (!currentRoom) return;
    socket.emit("chatRoom", { room: currentRoom, username, message });
  };

  

  return(
    <SocketContext value={{
    isConnected,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    onlineUsers
  }}>
        {children}
    </SocketContext>
  )
}