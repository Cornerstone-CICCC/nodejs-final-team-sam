import { createContext, use, useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import type { Message, Room, User } from "../types/data.types";
import type { JoinDmProps, JoinRoomProps, SocketContextType } from "../types/context.types";
import { AuthContext, useAuth } from "./AuthContext";

const SocketContext = createContext<SocketContextType| null>(null)

export const SocketProvider =({children}:{children:React.ReactNode})=>{
    const [isConnected, setIsConnected] = useState(false)
    const [currentRoom, setCurrentRoom] =useState<string|null>(null)
    const [currentUsers, setOnlineUsers] =useState<User[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [currentRoomList, setCurrentRoomList] = useState<Room[]>([])

    const { user } = useAuth()

    useEffect(()=>{
      if(!user){
        if(socket){
          socket.removeAllListeners()
          socket.disconnect()
        }
        return
      }
        socket.connect()

        socket.on('connect', ()=> setIsConnected(true))
        socket.on('disconnect',()=>setIsConnected(false))

        //listener
        socket.on('newMessage',(message)=>{
            setMessages((prev)=>[...prev, message])
        })
        //All system chat will be fall here
        socket.on('systemChat',(data)=>{
          setMessages((prev)=>[...prev, data])
        })

        //returning current list of rooms with userId (not filtering type)
        socket.on("updatedRoomList",(data)=>{
          setCurrentRoomList(data)
        })
        
        //get update on online users
        socket.on('currentUsers', (users:User[])=>setOnlineUsers(users))

        return ()=>{
            //remove all lisner
            socket.removeAllListeners()
            socket.disconnect()
        }
    },[user])

    const joinRoom =({type, data}:JoinRoomProps)=>{ //
      setMessages([])
      if(type === "dm"){
        socket.emit('joinRoom', {data})
      }else{
        socket.emit('joinRoom',{data})
      }
    }

    const leaveRoom = () => {
        if (!currentRoom) return;
        socket.emit("leaveRoom", { room: currentRoom });
        setCurrentRoom(null);
        setMessages([]);
        setOnlineUsers([]);
  };

  const sendMessage = ({roomId, userId, content}:{roomId:string, userId:string, content:string}) => {
    if (!currentRoom) return;
    socket.emit("sendMessage", {roomId, userId, content });
  };

  const login = (userId:string)=>{
    socket.emit('login', {userId})
  }

  const logout = (userId:string)=>{
    socket.emit('logout',{userId} )
  }

  //deleting a room from room user
  const removeRoom = (roomId:string)=>{
    socket.emit('leaveRoom', {roomId})
  }
  

  return(
    <SocketContext value={{
    isConnected,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    currentUsers,
    login,
    logout,
    removeRoom,
    currentRoomList
  }}>
        {children}
    </SocketContext>
  )
}