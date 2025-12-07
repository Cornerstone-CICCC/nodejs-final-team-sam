
import type { DmData, ListType, MemberResult, RoomUserResult } from '../types/props.types'
import { robohash } from '../lib/constants'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../contexts/SocketContext'
import { useAuth } from '../contexts/AuthContext'
import { getUserByUsername } from '../api/users.api'
import type { User } from '../types/data.types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots } from '@fortawesome/free-regular-svg-icons'

const Lists = (props:ListType) => {
    const navigate = useNavigate()
    const data = props.data
    const type = props.type
    const openRoom = props.clickRoom


    const {joinRoom,leaveRoom, currentRoomId} = useSocket()
    const {user} = useAuth()

    const joinTheRoom = async(roomid:string, roomName:string)=>{
        if(!user) return
        leaveRoom()
        if(type ==="dm"){
            //find other user by roomname(username)
           const otherUser = await getUserByUsername(roomName) as User
           console.log("otherUser",otherUser)
           if(!otherUser) return
           openRoom(roomid, otherUser._id)

           joinRoom({
            data:{
                currUserId:user._id,
                otherUserId:otherUser._id,
                type,
                roomname:otherUser.username,
                roomId:roomid
            }
           })

        }else{

          openRoom(roomid)
            joinRoom({
                data:{
                    currUserId:user._id,
                    roomId:roomid,
                    type
                }
            })
           
        }
        // if(currentRoomId){
        //     navigate(`/chats/${currentRoomId}`)
        // }else{
              navigate(`/chats/${roomid}`)      
        // }
    }




  return (
    <div className='px-10 flex flex-col overflow-y-scroll max-h-[65vh] no-scrollbar'>
  {data.length > 0 ? (
    data.map((item) => {
      if (type === "dm") {
        const dmItem = item as DmData;
        if (!dmItem.otherUser) return null;

        const isUnread = props.unreadDMs[dmItem.otherUser._id]

        return (
          <div
            className='flex items-center justify-between cursor-pointer hover:bg-[#F5F5F5] p-4'
            key={dmItem.otherUser._id}
            onClick={() => joinTheRoom(dmItem.room._id, dmItem.room.name)}
          >
            <div className='flex items-center gap-8'>
              <div className='bg-[rgba(218,218,220,0.42)] rounded-[50%] p-1 flex items-center'>
                <img
                  src={`${robohash}/${dmItem.otherUser.username}`}
                  width={50}
                  className='rounded-[50%]'
                />
              </div>
              <div className='font-bold'>
                {dmItem.otherUser.username}
              </div>
            </div>
              {isUnread&&
              <div>
                <FontAwesomeIcon icon={faCommentDots}
                className='text-blue-400 text-xl' />
              </div>
              }
          </div>
        );
      } else {
        const groupItem = item as RoomUserResult;
        const isUnread = props.unreadGroups[groupItem.roomId._id]
        return (
          <div
            className='flex items-center gap-8 cursor-pointer hover:bg-[#F5F5F5] p-4'
            key={groupItem._id}
            onClick={() => joinTheRoom(groupItem.roomId._id, groupItem.roomId.name)}
          >
            <div className='bg-[rgba(218,218,220,0.42)] rounded-[50%] p-1 flex items-center'>
              <img
                src={`${robohash}/${groupItem.roomId.name}`}
                width={50}
                className='rounded-[50%]'
              />
            </div>
            <div className='font-bold'>
              {groupItem.roomId.name}
            </div>
              {isUnread&&
              <div>
                <FontAwesomeIcon icon={faCommentDots}
                className='text-blue-400' />
              </div>
              }

          </div>
        );
      }
    })
  ) : (
        <div className='text-center italic text-[#D9DCE0]'>
            No Chat history
        </div>
  )}
</div>
  )
}

export default Lists