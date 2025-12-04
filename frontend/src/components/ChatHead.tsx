import { faAngleLeft, faArrowRightFromBracket, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState, type MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import { robohash } from "../lib/constants"
import { getRoomById } from "../api/rooms.api"
import type { ChatHeadProps } from "../types/props.types"
import type { Room } from "../types/data.types"



const ChatHead = ({roomId, showMember}:ChatHeadProps) => {
    const navigate = useNavigate()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement|null>(null)
    const [room, setRoom]= useState<Room| null>(null)

    //leave room handler
    const leaveRoomHandler=()=>{
        //send leave room via socket.io
        navigate('/chats')
    }
    //delete room handler
    const deleteRoomHandler=()=>{
        //delete room from the list
        
        navigate('/chats')
    }

    //outside of menu event handler
    const handleOutSideCLick = (e:globalThis.MouseEvent)=>{
        if(!menuRef) return

        const target = e.target as Node

        if(!menuRef.current?.contains(target)){
            setIsEditOpen(false)
        }
    }

    const getRoomDetail = async(roomId: string)=>{
        const details = await getRoomById(roomId)
        return details
    }

    useEffect(()=>{
        window.addEventListener('mousedown', handleOutSideCLick)

        return()=>{
            window.removeEventListener('mousedown', handleOutSideCLick)
        }
    },[menuRef])

    useEffect(()=>{
        //getRoom deatail by Id 
        //const room = getRoomById(roomId)

        //setRoom(room)
    },[])

  return (
    <div className='bg-white p-5 border-b border-[#D9DCE0] w-full relative'>
        <div className=" flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="md:hidden">
                    <FontAwesomeIcon icon={faAngleLeft} 
                    className="text-black cursor-pointer sm:text-xl"
                    onClick={()=>leaveRoomHandler()}/>
                </div>
                <div className="flex items-center gap-3 font-bold sm:text-xl">
                    <img 
                    src={`${robohash}/${roomId}`}
                    className="w-[35px] sm:w-[40px] rounded-[50%] bg-[rgba(218,218,220,0.42)]"/>
                    <div>username</div>
                </div>
            </div>

            <div className="flex gap-4 smtext-xl">
                <FontAwesomeIcon icon={faEllipsisVertical}
                className="cursor-pointer"
                onClick={()=>{setIsEditOpen(true)}}/>
                <FontAwesomeIcon icon={faArrowRightFromBracket}
                className="cursor-pointer"
                onClick={()=>deleteRoomHandler()}/>
            </div>
        </div>
        {isEditOpen&&
        <div className="bg-white border-s border-b border-e border-[#D9DCE0] absolute top-19 sm:top-20 right-0 font-bold rounded-b-md"
        ref={menuRef}>
            <div 
            className="p-4 pe-6 cursor-pointer hover:bg-[#F5F5F5]"
            onClick={showMember}>
                See All Member
            </div>
            {/* If it is dm, then do not show */}
            {room?.type === "group"&&
            <div className="p-4 pe-6 cursor-pointer hover:bg-[#F5F5F5]">
                Rename
            </div>}
        </div>}
    </div>
  )
}

export default ChatHead