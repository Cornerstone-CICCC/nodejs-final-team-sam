import {Server,Socket} from 'socket.io'
import messageService from '../services/message.service'
import { ConnectedUser } from '../types/connecteduser'
import userService from '../services/user.service'
import room_userService from '../services/room_user.service'
import roomService from '../services/room.service'


const connectedUsers: ConnectedUser[] = [];


export const handleSocketEvents = (io:Server, socket: Socket) => {
  console.log(`User connected: ${socket.id}`)


  socket.on('login', async({userId}) => {
    // add current userId to connectedUser array
    if(!connectedUsers.find(u => u.userId === userId)){
      connectedUsers.push({userId, socketId: socket.id})
    }

    // 2. currently online users
    const users = await Promise.all(
      connectedUsers.map(u => userService.getById(u.userId))
    )

    // 3. send the currentUser list to all users
    io.emit("currentUsers", users)

  })

  // client side will send 
  // 1. current userId(currUserId), 
  // 2. the other's userId(otherUserId), 
  // 3. type("dm" or "group")
  // 4. roomname - if it's a dm, it could be the other's username
  socket.on('joinRoom', async(data) => {
    
    if(data.type === "dm"){

      const ids = [data.currUserId, data.otherUserId]

      let roomId = await room_userService.checkExistedRoom(ids)

      // dm's roomname - user1_user2
      const name = data.roomname 
      const type = data.type

      // doesn't exist room -> create a new room
      if(!roomId){
        const newRoom = await roomService.add({name, type })
        roomId = newRoom._id

         // create roomUser
        await room_userService.add(roomId, data.currUserId)
        await room_userService.add(roomId, data.otherUserId)
      }

      socket.join(roomId.toString())
      socket.emit("joinedRoom", {roomId})

      
    }else{
      

    }


    


  })

}