
import type { ListType } from '../types/props.types'
import { robohash } from '../lib/constants'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSocket } from '../contexts/SocketContext'
import { useAuth } from '../contexts/AuthContext'
import { getUserByUsername } from '../api/users.api'
import type { User } from '../types/data.types'

const Lists = (props:ListType) => {
    const navigate = useNavigate()
    const data = props.data
    const type = props.type
    //console.log(data)

    const {joinRoom} = useSocket()
    const {user} = useAuth()


    const joinTheRoom = async(roomid:string, roomName:string)=>{
        if(!user) return
        if(type ==="dm"){
            //find other user by roomname(username)
           const otherUser = await getUserByUsername(roomName) as User
           joinRoom({
            data:{
                currUserId:user._id,
                otherUserId:otherUser._id,
                type,
                roomname:otherUser.username
            }
           })

        }else{
            console.log(data)
            joinRoom({
                data:{
                    currUserId:user._id,
                    roomId:roomid,
                    type
                }
            })
           
        }
        navigate(`/chats/${roomid}`)
    }

  return (
    <div className='px-10 flex flex-col overflow-y-scroll max-h-[45vh] no-scrollbar'>
        {data.length>0?(data.map((u)=>
        <div className='flex items-center gap-8 cursor-pointer hover:bg-[#F5F5F5] p-4' 
        key={u._id}
        onClick={()=>joinTheRoom(u.roomId._id, u.roomId.name)}
        >
            <div className='bg-[rgba(218,218,220,0.42)] rounded-[50%] p-1 flex items-center'>
                <img
                src={`${robohash}/${u.roomId.name}`}
                width={50}
                className='rounded-[50%]'
                />
            </div>
            <div className='font-bold'>
                {u.roomId.name}
            </div>
        </div>)):
        <div className='text-center italic text-[#D9DCE0]'>
            No Chat history
        </div>
        }
    </div>
  )
}

export default Lists