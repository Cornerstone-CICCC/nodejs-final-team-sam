import { useNavigate, useParams } from 'react-router-dom'
import ChatHead from '../components/ChatHead'
import ChatSection from '../components/ChatSection'
import { Sidebar } from '../components/Sidebar'
import { useEffect, useState } from 'react'
import { getRoomMember } from '../api/roomUser.api'
import type { Room, User } from '../types/data.types'
import { robohash } from '../lib/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import type { MemberResult } from '../types/props.types'
import { getRoomById } from '../api/rooms.api'

const TextingPage = () => {
  const [showingMember, setShowingMember] = useState(false)
  const [members, setMembers] = useState<MemberResult[]>([])
  const [room, setRoom] = useState<Room|null>(null)
  const [sidebarTrigger, setSidebarTrigger] = useState(false);
  //get room id in parameter
  const {roomid} = useParams()
  const navigate = useNavigate()

  useEffect(()=>{
    if(!roomid){
      navigate("/chats")
      return
    }

  },[roomid, navigate])

  // Prevent rendering until redirect happens
  if (!roomid) return null;

  const seeRoomMembers = async(roomId: string)=>{
      const members = await getRoomMember(roomId)
      console.log(members)
      setMembers(members)
  }



  useEffect(()=>{
    if(!showingMember) return
    //get all member (Type User)
    seeRoomMembers(roomid)

  },[showingMember])

  return (
    <div className='font-inter max-w-[1800px] mx-auto md:flex md:h-screen'>
      {/* Show when in desktop */}
        <div className='hidden md:flex sm:w-[28%] md:w-[35%] md:max-w-[450px] flex-shrink-0 sidebar-md-border'>
            <Sidebar trigger={sidebarTrigger}/>
        </div>

        {/* Desktop right side & whole screnn in mobile-chat history*/}
        <div className='flex bg-[rgba(222,234,255,0.42)] h-screen flex-1 flex-col relative'>
          <ChatHead roomId={roomid} showMember={()=>setShowingMember(true)}
           onTrigger={() => setSidebarTrigger(prev => !prev)} />

          {/* Show all members */}
          {showingMember&&
          <div className='absolute w-full bg-white h-[87vh] top-18'>
            <div className='w-full px-7 py-5 flex justify-end'>
              <FontAwesomeIcon icon={faXmark}
              className=' cursor-pointer md:text-xl'
              onClick={()=>setShowingMember(false)}/>
            </div>
            {members.length>0&&
            members.map((m)=>
            <div key={m._id}
            className='px-8 py-4 sm:py-6 flex items-center gap-8'>
              <div>
                <img
                src={`${robohash}/${m.userId.username}`}
                className='rounded-[50%] bg-lightGray w-[50px] md:w-[60px]'
                />
              </div>
              <div className='font-bold'>
                {m.userId.username}
              </div>
            </div>)
            }
          </div>}
          <ChatSection roomId={roomid} />
        </div>
    </div>
  )
}

export default TextingPage