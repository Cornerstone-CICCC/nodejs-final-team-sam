import mongoose, {Schema, Document, mongo} from "mongoose";

export interface IMessage extends Document{
  roomId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  content: string;
  createdAt?: Date;
}

const MessageSchema: Schema = new Schema({
  roomId: {type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  content: {type: String, required: true}
}, {
  timestamps: true
})

export const Message = mongoose.model<IMessage>('Message', MessageSchema)