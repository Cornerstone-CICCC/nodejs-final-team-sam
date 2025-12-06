import { createContext, use, useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import type { Message, OldMessage, Room, User } from "../types/data.types";
import type { JoinDmProps, JoinRoomProps, SocketContextType } from "../types/context.types";
import { AuthContext, useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const SocketContext = createContext<SocketContextType| null>(null)

export const SocketProvider =({children}:{children:React.ReactNode})=>{
    const [isConnected, setIsConnected] = useState(false)
    const [currentRoomId, setCurrentRoomId] =useState("")
    const [currentUsers, setOnlineUsers] =useState<User[]>([])
    const [oldMessages, setOldMessages] =useState<OldMessage[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [currentRoomList, setCurrentRoomList] = useState<Room[]>([])

    const { user } = useAuth()

    // useEffect(()=>{
    //   if(!user){
    //     if(socket){
    //       socket.removeAllListeners()
    //       socket.disconnect()
    //     }
    //     return
    //   }

    //     socket.on('connect', ()=> setIsConnected(true))
    //     socket.on('disconnect',()=>setIsConnected(false))

    //     //listener
    //     socket.on('newMessage',(message)=>{
    //         setMessages((prev)=>[...prev, message])
    //         console.log(message)
    //     })
    //     //All system chat will be fall here
    //     socket.on('systemChat',(data)=>{
    //       setMessages((prev)=>[...prev, data])
    //       console.log(data)
    //     })

    //     //returning current list of rooms with userId (not filtering type)
    //     socket.on("updatedRoomList",(data)=>{
    //       setCurrentRoomList(data)
    //     })
        
    //     //get update on online users
    //     socket.on('currentUsers', (users:User[])=>{
    //       setOnlineUsers(users)})

    //     //get old messages
    //     socket.on('oldMessages', (data)=>{
    //       setOldMessages(data)
    //     })

        
    //     socket.on('joinedRoom',(data)=>{
    //       console.log(`received join room ${data.roomId}`)
    //       setCurrentRoomId(data.roomId)
    //       setOldMessages([])
    //     })

    //     socket.connect()

    //     return ()=>{
    //         socket.off('newMessage')
    //         socket.off('joinedRoom')
    //         socket.off('oldMessage')
    //     }
    // },[user])
    useEffect(() => {
      if (!socket) return;

      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));

      socket.on('currentUsers', (users: User[]) => setOnlineUsers(users));
      socket.on('newMessage', (message) => setMessages((prev) => [...prev, message]));
      socket.on('systemChat', (data) => setMessages((prev) => [...prev, data]));
      socket.on('updatedRoomList', (data) => setCurrentRoomList(data));
      socket.on('oldMessages', (data) => {
        console.log("Old Messages",data)
        setOldMessages(data)});
      socket.on('joinedRoom', (data) => {
        console.log("joined:", data.roomId)
        setCurrentRoomId(data.roomId);
        
      });

      socket.connect();

      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('currentUsers');
        socket.off('newMessage');
        socket.off('systemChat');
        socket.off('updatedRoomList');
        socket.off('oldMessages');
        socket.off('joinedRoom');
      };
    }, []); // run only once

    // Emit login whenever user becomes available
    useEffect(() => {
      if (user?._id) {
        socket.emit('login', { userId: user._id });
      }
    }, [user]);

    const joinRoom =({data}:JoinRoomProps)=>{ //
      setMessages([])
      setOldMessages([])
      socket.emit('joinRoom', data)
    }

    const leaveRoom = () => {
        if (!currentRoomId) return;
        socket.emit("leaveRoom", { roomId:currentRoomId });
        setCurrentRoomId("");
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
      if (!user) return;
      socket.emit('logout', { userId});
      socket.disconnect(); // only here
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
    currentRoomId,
    currentRoomList,
    oldMessages,
    setCurrentRoomId
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