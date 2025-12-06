import { faAngleLeft, faArrowRightFromBracket, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { use, useEffect, useRef, useState, type MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import { robohash } from "../lib/constants"
import { getRoomById } from "../api/rooms.api"
import type { ChatHeadProps, MemberResult } from "../types/props.types"
import type { Room, User } from "../types/data.types"
import { getRoomMember } from "../api/roomUser.api"
import { useSocket } from "../contexts/SocketContext"
import { useAuth } from "../contexts/AuthContext"
import Modal from "./Modal"



const ChatHead = ({roomId, showMember}:ChatHeadProps) => {
    const navigate = useNavigate()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement|null>(null)
    const [room, setRoom]= useState<Room| null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const {user} = useAuth()
    const {removeRoom, leaveRoom, currentRoomId, setCurrentRoomId} = useSocket()
    const roomIdToShow = currentRoomId ?? roomId;


    //leave room handler
    const leaveRoomHandler=()=>{
        leaveRoom()
        //send leave room via socket.io
        navigate('/chats')
    }
    //delete room handler
    const deleteRoomHandler=()=>{
        console.log("Delet??")
        if(!user) {
            console.log("no user exist")
            return
        }
        console.log("DELETING", roomId, "FOR USER", user._id);
        //delete room from the list
        removeRoom(roomId, user._id)
        console.log("setting room to null")
        setCurrentRoomId("")
        setRoom(null)
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

    // Fetch room details when roomid exists
    const fetchRoom = async () => {
        console.log(roomIdToShow)
        if(!roomIdToShow|| !user) return
        try {
            const roomDetail = await getRoomById(roomIdToShow) // your API call
            console.log(roomDetail)
            setRoom(roomDetail) // ← set the room state here

            if(roomDetail.type==="dm"){
                const members = await getRoomMember(roomIdToShow) as MemberResult[]
                const otherUser = members
                .map((m)=> m.userId)
                .filter((u) => u._id !== user._id) as User[]

                console.log(otherUser[0].username)

                const updateRoom:Room = {
                    ...roomDetail,
                    name:otherUser[0].username
                }
                setRoom(updateRoom)
            }
        } catch (err) {
            console.error("Failed to fetch room details:", err)
        }
    }

    useEffect(() => {
        if (!roomIdToShow || !user){
            setRoom(null);
            return
        }

        let isCancelled = false;

        const load = async () => {
            const roomDetail = await getRoomById(roomIdToShow)
            if (isCancelled) return;

            if (roomDetail.type === "dm") {
                const members = await getRoomMember(roomIdToShow) as MemberResult[]
                if (isCancelled) return;

                const otherUser = members
                    .map(m => m.userId)
                    .find(u => u._id !== user._id) as User

                if(!otherUser) return

                setRoom({
                    ...roomDetail,
                    name: otherUser.username,
                });
            } else {
                setRoom(roomDetail);
            }
        };

        load();

        return () => {
            isCancelled = true;
        };
    }, [roomIdToShow, user]);

    useEffect(()=>{
        window.addEventListener('mousedown', handleOutSideCLick)

        return()=>{
            window.removeEventListener('mousedown', handleOutSideCLick)
        }
    },[menuRef])

    // useEffect(()=>{
    //     fetchRoom()
    // },[])
    // useEffect(()=>{
    //     fetchRoom()
    // },[currentRoomId,roomId])


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
                    src={`${robohash}/${room?.name}`}
                    className="w-[35px] sm:w-[40px] rounded-[50%] bg-[rgba(218,218,220,0.42)]"/>
                    <div>{room&&room.name}</div>
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
            <div className="p-4 pe-6 cursor-pointer hover:bg-[#F5F5F5]"
            onClick={()=>setIsModalOpen(true)}>
                Rename
            </div>}
        </div>}
        {isModalOpen&&
        <Modal
            isOpen={isModalOpen} 
            onClose={()=>setIsModalOpen(false)} 
            submitType='update'
            onUpdate={fetchRoom}
            />}
    </div>
  )
}

export default ChatHead