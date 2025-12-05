import React, { useState } from 'react'
import type { ModalProps } from '../types/props.types'
import { createRoom, updateRoomName } from '../api/rooms.api'
import { useAuth } from '../contexts/AuthContext'
import { createRoomUser } from '../api/roomUser.api'
import { useParams } from 'react-router-dom'

const Modal = ({isOpen, onClose, submitType, setGroups, onUpdate}:ModalProps) => {
    const [roomName, setRoomName]= useState("")
    const [error, setError] = useState("")

    const {user}= useAuth()
    const {roomid} = useParams()
    console.log(user)

    if(!isOpen) return null

    const createRoomHandler=async()=>{
        if(!roomName){
          setError("Please enter room name")
          return
        }

        if(!user){
          console.error("user not found")
          return
        }

        //api call to create room
        const newGroup = await createRoom({roomName:roomName, type:"group"})

        //create related room user
        const roomId = newGroup._id
        const newRoomUser = await createRoomUser(roomId, user._id)
        console.log(newRoomUser)

        //close modal
        onClose()
    }

    const updateRoomNameHandler = async()=>{
      if(!roomid){
        console.log("no room id")
        return
      }
        if(!roomName){
          setError("Please enter new name")
          return
        }
        const res = await updateRoomName(roomid,roomName)
        
        if(onUpdate) onUpdate()
        onClose()
    }


  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-5 right-5 text-gray-400 hover:text-black cursor-pointer"
          onClick ={onClose}
        >✕</button>

        {/* modal content */}
        <div className='flex flex-col py-15 px-4'>
            <div className='flex flex-col pt-5'>
                <label
                className='text-[14px] text-[#757575]'>
                    Room Name:
                </label>
                <input type="text" value={roomName} 
                onChange={(e)=>setRoomName(e.target.value)} 
                className='border-b border-[#BDBDBD] p-2'/>
                {error&&
                <div className='text-red-400 text-sm text-center pt-2'>
                  {error}
                  </div>}
            </div>
            {submitType==="create"?
            <button className='blue-btn w-fit mx-auto mt-10'
            onClick={()=>createRoomHandler()}>
                Create a room
            </button>:
            <button className='blue-btn w-fit mx-auto mt-10'
            onClick={()=>updateRoomNameHandler()}>
                Update Room Name
            </button>           
            }
        </div>

      </div>
    </div>
  )
}

export default Modal