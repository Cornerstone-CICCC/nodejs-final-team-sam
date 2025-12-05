import { createContext, use, useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import type { Message, OldMessage, Room, User } from "../types/data.types";
import type { JoinDmProps, JoinRoomProps, SocketContextType } from "../types/context.types";
import { AuthContext, useAuth } from "./AuthContext";

const SocketContext = createContext<SocketContextType| null>(null)

export const SocketProvider =({children}:{children:React.ReactNode})=>{
    const [isConnected, setIsConnected] = useState(false)
    const [currentRoom, setCurrentRoom] =useState<Room|null>(null)
    const [currentUsers, setOnlineUsers] =useState<User[]>([])
    const [oldMessages, setOldMessages] =useState<OldMessage[]>([])
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
            console.log(message)
        })
        //All system chat will be fall here
        socket.on('systemChat',(data)=>{
          setMessages((prev)=>[...prev, data])
          console.log(data)
        })

        //returning current list of rooms with userId (not filtering type)
        socket.on("updatedRoomList",(data)=>{
          setCurrentRoomList(data)
        })
        
        //get update on online users
        socket.on('currentUsers', (users:User[])=>{
          setOnlineUsers(users)})

        //get old messages
        socket.on('oldMessages', (data)=>{
          console.log(data)
          setOldMessages(data)
        })

        
        socket.on('joinRoom',(data)=>{
          console.log(`received join room ${data}`)
          setCurrentRoom(data)
          setOldMessages([])
        })

        return ()=>{
            //remove all lisner
            socket.removeAllListeners()
            socket.disconnect()
        }
    },[user])

    const joinRoom =({data}:JoinRoomProps)=>{ //
      setMessages([])
      socket.emit('joinRoom', data)
    }

    const leaveRoom = (roomId:string) => {
        if (!currentRoom) return;
        socket.emit("leaveRoom", { roomId });
        setCurrentRoom(null);
        setMessages([]);
        setOnlineUsers([]);
  };

  const sendMessage = ({roomId, userId, content}:{roomId:string, userId:string, content:string}) => {
    socket.emit("sendMessage", {roomId, userId, content });
  };

  const socketLogin = (userId:string)=>{
    socket.emit('login', {userId})
  }

  const socketLogout = (userId:string)=>{
    socket.emit('logout',{userId} )
  }

  //deleting a room from room user
  const removeRoom = (roomId:string, userId:string)=>{
    socket.emit('deleteRoom', {roomId, userId})
  }
  

  return(
    <SocketContext.Provider value={{
    isConnected,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    currentUsers,
    socketLogin,
    socketLogout,
    removeRoom,
    currentRoom,
    currentRoomList,
    oldMessages
  }}>
        {children}
    </SocketContext.Provider>
  )
}

export const useSocket =()=>{
  const ctx = useContext(SocketContext)
  if(!ctx) throw new Error("useScock must be used insed SocketProvide")
  return ctx
}