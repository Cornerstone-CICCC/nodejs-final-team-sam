import { Message,IMessage } from "../models/message.model";

// Get messages by roomId
const getMessages = async(roomId: string) => {
  return await Message.find({roomId}).sort({createdAt: 1}).populate("userId", "username")
  .lean()
}

// Add message
const add = async(newMessage: Partial<IMessage>) => {
  return await Message.create(newMessage)
}

export default {
  add,
  getMessages
}


