import mongoose, {Schema, Document} from "mongoose";

export interface IRoom extends Document{
  name: string,
  type: string
}

const RoomSchema: Schema = new Schema({
  name: {type: String,},
  type: {type: String, enum: ["dm", "group"], required: true}
}, {
  timestamps: true
})

export const Room = mongoose.model<IRoom>('Room', RoomSchema)