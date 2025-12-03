import { Message,IMessage } from "../models/message.model";

// Get messages by roomId
const getMessages = async(roomId: string) => {
  return await Message.find({roomId}).sort({created: 1})
}

// Add message
const add = async(newMessage: Partial<IMessage>) => {
  return await Message.create(newMessage)
}

export default {
  add,
  getMessages
}


