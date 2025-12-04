import {Server,Socket} from 'socket.io'
import { ConnectedUser } from '../types/connecteduser'
import userService from '../services/user.service'
import room_userService from '../services/room_user.service'
import roomService from '../services/room.service'
import messageService from '../services/message.service'


const connectedUsers: ConnectedUser[] = [];


export const handleSocketEvents = (io:Server, socket: Socket) => {
  console.log(`User connected: ${socket.id}`)

  // <login>
  // 1. userId
  socket.on('login', async(data) => {
    const userId = data.userId
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
    console.log("users list")
    console.log(users)

  })

  // <Logout>
  // 1. userId
  socket.on('logout', async(data) => {
    const userId = data.userId

    if(!connectedUsers.find(u => u.userId === userId)){
      return
    }

    // remove online users
    const removeIndex = connectedUsers.findIndex(u => u.userId === userId)
    if(removeIndex !== -1){
      connectedUsers.splice(removeIndex, 1)

      const users = await Promise.all(
        connectedUsers.map(u => userService.getById(u.userId))
      )

      io.emit("currentUsers", users)

      console.log("updated users list")
      console.log(users)
    }


  })

  // client side will send 
  // <DM>
  // 1. current userId(currUserId), 
  // 2. the other's userId(otherUserId), 
  // 3. type("dm")
  // 4. roomname - if it's a dm, it could be the other's username

  // <Group>
  // 1. current userId (currUserId)
  // 2. roomId (already existed)
  // 3. type("group")

  socket.on('joinRoom', async(data) => {
    
    if(data.type === "dm"){

      const ids = [data.currUserId, data.otherUserId]

      let roomId = await room_userService.checkExistedRoom(ids)

      console.log(roomId)

      // doesn't exist room -> create a new room
      if(!roomId){

        // dm's roomname - user1_user2
        const name = data.roomname 
        const type = data.type

        const newRoom = await roomService.add({name, type })
        roomId = newRoom._id

        console.log(`mewRoom: ${newRoom}`)


        // add users to room_users table
        await room_userService.add(roomId, data.currUserId)
        await room_userService.add(roomId, data.otherUserId)
      }

      // join the room
      socket.join(roomId.toString())

      // load the history message
      const oldMessages = await messageService.getMessages(roomId)
      // send the old message to specific user
      socket.emit("oldMessages", oldMessages)
      console.log(oldMessages)

      socket.emit("joinedRoom", {roomId})

      console.log(`roomId: ${roomId}`)

      
    }else{
      const roomId = data.roomId
      const userId = data.currUserId
      const username = (await userService.getById(userId))?.username
      
      // add user to room_users table
      await room_userService.add(roomId, userId)

      //join the room
      socket.join(roomId.toString())
      console.log(`group roomId: ${roomId}`)


      // load the history message
      const oldMessages = await messageService.getMessages(roomId)
      // send the old message to specific user
      socket.emit("oldMessages", oldMessages)
      console.log(oldMessages)

      // send a message to all clients in the room 
      socket.broadcast.to(roomId.toString()).emit
      ('systemChat', {
        username: "System",
        message: `${username} has joined`
      })

    }
  })

  //Send message
  // 1. roomId
  // 2. userId
  // 3. content
  socket.on('sendMessage', async(data) => {
    const {roomId, userId, content} = data;

    try{
      // save message to messages table
      const message = await messageService.add({roomId, userId, content})

      // broadcast the message to users in the roon
      io.to(roomId.toString()).emit("newMessage", message)
      console.log(`newMessage: ${message}`)
    }catch(err){
      console.error('Error saving message:', err)
    }

  })


  //Leave room
  // 1. roomId
  socket.on("leaveRoom", (data) => {
    const roomId = data.roomId
    socket.leave(roomId.toString())

  })

  //Delete room
  // 1. roomId
  // 2. userId
  socket.on("deleteRoom", async(data) => {
    const roomId = data.roomId
    const userId = data.userId
    const username = (await userService.getById(userId))?.username

    // leave the room
    socket.leave(roomId.toString())

    // delete the user from the group
    await room_userService.remove(roomId, userId)

    // get updatedRoomList
    const roomList = await room_userService.getAllRooms(userId)

    //notify 
    socket.broadcast.to(roomId.toString()).emit
    ('systemChat', {
      username: "System",
      message: `${username} has left`
    })

    socket.emit("updatedRoomList", roomList)


  })

}