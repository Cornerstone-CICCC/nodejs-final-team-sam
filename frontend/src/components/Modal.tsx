import React, { useState } from 'react'
import type { ModalProps } from '../types/props.types'
import { createRoom } from '../api/rooms.api'

const Modal = ({isOpen, onClose, submitType, setGroups}:ModalProps) => {
    const [roomName, setRoomName]= useState("")
    const [error, setError] = useState("")

    if(!isOpen) return null

    const createRoomHandler=async()=>{
        if(!roomName){
          setError("Please enter room name")
          return
        }

        //api call to create room
        const newGroup = await createRoom({roomName:roomName, type:"group"})
        console.log(newGroup)

        //close modal
        onClose()

        //update room
        setGroups(prev =>[newGroup,...prev ])
    }

    const updateRoomNameHandler =()=>{
        if(!roomName){
          setError("Please enter new name")
          return
        }
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