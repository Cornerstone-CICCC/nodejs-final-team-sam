import { faAngleLeft, faL, faMagnifyingGlass, faPaperPlane, faPeopleGroup, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { robohash } from '../lib/constants'
import Lists from '../components/Lists'
import type { Room, User } from '../types/data.types'
import Modal from '../components/Modal'
import { logout } from '../api/auth.api'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { checkRoomUser, createRoomUser, getGroupRooms, getPrivateRooms } from '../api/roomUser.api'
import { useSocket } from '../contexts/SocketContext'
import { findRoom, getAllRooms, getRoomById } from '../api/rooms.api'
import type { DmData, NewDmType, RoomUserResult, SidebarProps } from '../types/props.types'
import type { JoinDmProps, JoinGroupProps } from '../types/context.types'
import { getUserByUsername, isSessionExist } from '../api/users.api'
import type { Socket } from 'socket.io-client'


export const Sidebar = ({trigger}:SidebarProps) => {
    const {roomId} = useParams()
    const {user, setUser} = useAuth()
    const {socketLogout, currentUsers, joinRoom, currentRoomId,setCurrentRoomId,leaveRoom, socket} =useSocket()

    const [activeUsers, setActiveUsers] = useState<User[]>([])
    const [friends, setFriends] = useState<DmData[]>([])
    const [groups, setGroups] = useState<RoomUserResult[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpne] = useState(false)
    const [isSearchResultOpen, setIsSearchResultOpen] = useState(false)
    const [results, setResults] = useState<Room[]>([])
    const [keyword, setKeyword] = useState("")
    const navigate = useNavigate()
    const [isPrivate, setIsPrivate] = useState(()=>{
        const storedValue = sessionStorage.getItem('isPrivate')
        return storedValue ? JSON.parse(storedValue): true
    })
    const [unreadDMs, setUnreadDMs] = useState<{[userId:string]:boolean}>({})
    const [unreadGroups, setUnreadGroups] = useState<{[roomId:string]:boolean}>({})

    const clickUserHandler=async(clickedUser:User)=>{
        console.log(clickedUser)
        console.log(user)

        if(!user||!clickedUser){
            console.log("user or other user not found")
            return
        }

        if(user._id === clickedUser._id){
            console.log("you are clicking yourself")
            return
        }
     
        const data: JoinDmProps = {
            currUserId: user._id,
            otherUserId:clickedUser._id,
            type :"dm",
            roomname: clickedUser.username
        }
        await joinRoom({data})
    }

    useEffect(()=>{
        if(currentRoomId){
            console.log("I got roomId, directing room")
            navigate(`/chats/${currentRoomId}`)
        }
    },[currentRoomId])

    const joinRoomHandler =async(room:Room)=>{
        if(!user) return

        leaveRoom()

        if(room.type==="group"){
            const data:JoinGroupProps={
                currUserId:user._id,
                roomId: room._id,
                type:room.type
            }

            // const isRoomUserExist =await checkRoomUser(room._id, user._id)
            // //if room user nor exist -> create room user
            // if(!isRoomUserExist){
            //    await createRoomUser(room._id, user._id)
            // }

            await joinRoom({data})

            if(currentRoomId){
                navigate(`/chats/${currentRoomId}`)            
            }

        }else{
            //find userId from username
            const otherUserId = await getUserByUsername(room.name)

            const data: JoinDmProps = {
                currUserId: user._id,
                otherUserId,
                type :"dm",
                roomname: room.name
                }
            await joinRoom({data})

            if(currentRoomId){
                navigate(`/chats/${currentRoomId}`)    
            }
        }
        if(isSearchResultOpen){
            setIsSearchResultOpen(false) //close results        
        }
        loadRoomsHandler()

    }

    const keyboardEventHandler =async(e:React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key!=="Enter") return

        const result = await findRoom(keyword)
        setResults(result)
        setKeyword('')
        setIsSearchResultOpen(true)
    }

    const logoutHandler = async()=>{
        if(!user?._id) return
        await logout()
        socketLogout(user._id)
        
        setUser(null)
        navigate("/")
    }

    const loadRoomsHandler = async()=>{
        console.log("loading room")

        if(user?._id){
            //fetch type="dm" -> return type Room
            if(isPrivate){
                setFriends([])
                 const rooms = await getPrivateRooms(user._id)
                setFriends(rooms)
            }else{
                console.log("rendering")
                setGroups([])
                const rooms = await getGroupRooms(user._id)
                setGroups(rooms)
                console.log(rooms)
            }
        }
    }

    const checkAuth = async()=>{
        const res = await isSessionExist()
        
        if(!res){
            navigate("/")
        }
    }

    const openRoom = (roomId:string, otherUserId?:string)=>{
        if(otherUserId) setUnreadDMs(prev => ({ ...prev, [otherUserId]: false }))
        else setUnreadGroups(prev => ({ ...prev, [roomId]: false }))

        setCurrentRoomId(roomId)
    }

    useEffect(()=>{
        if(trigger){
            loadRoomsHandler()
        }
    },[trigger])
    
    useEffect(()=>{
        //check if logged in user
        checkAuth()
        //Load rooms
        loadRoomsHandler()
        console.log(currentUsers)
  
    },[])

    useEffect(()=>{
        console.log(currentUsers)
        setActiveUsers(currentUsers)
    },[currentUsers])

    //store the private/group input in session storage
    useEffect(()=>{
        if(!user) return
        sessionStorage.setItem('isPrivate',JSON.stringify(isPrivate))
        loadRoomsHandler()
    },[isPrivate,user])

    //listen to new dm
    useEffect(() => {
    if (!socket) return;

        const handler = (data:NewDmType) =>{ 
            console.log("receiving data",data)
            loadRoomsHandler()

            if(currentRoomId===data.roomId ||(roomId&&roomId===data.roomId)) return

            if(data.type=="dm"){
                setUnreadDMs(prev =>({
                    ...prev,
                    [data.senderId]:true
                }))
            }else if(data.type==="group"){
                setUnreadGroups(prev=>({
                    ...prev,
                    [data.roomId]:true
                }))
            }
        };

        (socket as Socket).on("newDM",handler
        ); 

        return () => {
            (socket as Socket).off("newDM", handler);
        };
    }, [socket, loadRoomsHandler, currentRoomId]);

    //listen to join event
    useEffect(() => {
    if (!socket) return;

        const handler = () =>{ 
            console.log("joining event received")
            loadRoomsHandler()
        };

        (socket as Socket).on("joinedRoom",handler
        ); 

        return () => {
            (socket as Socket).off("joinedRoom", handler);
        };
    }, [socket]);

  return (
        <div className='w-full min-w-full max-h-screen'>
            {/* Head */}
            <div className='flex items-center py-6 px-6 text-xl text-[#707991] justify-between relative'>
                {!isUserMenuOpen?
                <div
                 onClick={()=>setIsUserMenuOpne(true)}
                 className='bg-lightGray rounded-[50%]'>
                    <img
                    src={`${robohash}/${user?.username}`}
                    className='cursor-pointer w-[35px] rounded-[50%]'
                   />
                </div>:
                <FontAwesomeIcon icon={faXmark}
                className='text-2xl lg:text-3xl cursor-pointer'
                onClick={()=>setIsUserMenuOpne(false)}/>
                }

                <div className='flex px-3 py-2 items-center gap-5 bg-[#F5F5F5] rounded-2xl w-fit text-[16px] lg:text-md'>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    <input type="text" placeholder='Find Group Rooms..'
                    className='w-[100%] max-w-[300px]'
                    value={keyword}
                    onChange={(e)=>setKeyword(e.target.value)}
                    onKeyDown={(e)=>keyboardEventHandler(e)} />
                </div>

                {/* Account detail */}
                {isUserMenuOpen&&
                <div className='bg-white w-full h-[89vh] absolute left-0 top-20 z-5'>
                    <div className='p-5 w-full flex flex-col h-full justify-center gap-8 items-center'>
                        <div className='mx-auto'>
                            <div className='bg-lightBlue w-fit rounded-2xl relative'>
                                <img
                                src={`${robohash}/${user?.username}`}
                                width={250}
                                />
                                <div className='absolute bg-white -bottom-5 -right-5 rounded-[50%] p-2'>
                                    <div className='bg-green-400 w-[50px] h-[50px] rounded-[50%]'></div>
                                </div>
                            </div>
                            <div className='pt-4 text-center font-bold'>
                                {user?.username}
                            </div>
                        </div>

                        <button
                        className='blue-btn w-fit mx-auto'
                        onClick={()=>logoutHandler()}>
                            Log Out
                        </button>
                    </div>
                </div>
                }

                {/* Search result */}
                {isSearchResultOpen&&
                <div className='bg-white w-full h-[89vh] absolute left-0 top-20 z-10'>
                    <div className='p-5 w-full flex flex-col'>
                        <div className='w-full pb-4'>
                            <FontAwesomeIcon 
                            icon={faAngleLeft}
                            onClick={()=>setIsSearchResultOpen(false)}/>
                        </div>
                        <div className='h-[80%] max-h-[500px] overflow-y-scroll no-scrollbar'>
                            {results.length>0&&
                            results.map((r)=>
                            <div className='p-6 flex items-center gap-4 cursor-pointer'
                            key={r._id}
                            onClick={()=>joinRoomHandler(r)}>
                                <div>
                                    <img
                                    src={`${robohash}/${r.name}`}
                                    className='w-[65px] rounded-[50%] bg-lightGray'/>
                                </div>
                                <div className='font-bold'>
                                    {r.name}
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
                }
            </div>


            {/* Private Chats */}
            {isPrivate&&<div>
                <div className='w-full text-black font-bold flex justify-end px-8 text-[18px]'>
                    <div className='flex gap-3 items-center cursor-pointer'
                    onClick={()=>setIsPrivate(!isPrivate)}>
                        <FontAwesomeIcon icon={faPeopleGroup}/>
                        <span>Join Group</span>
                    </div>
                </div>

                <div className='p-5 pb-0'>
                    {/* Active user */}
                    <div className='font-bold pb-2'>See People Online</div>
                    <div className='flex gap-4 h-[100px] p-2 overflow-x-scroll no-scrollbar'>
                        {activeUsers.length>0?(activeUsers.map((u,i)=>
                        <div className='relative bg-lightGray rounded-[50%] p-1 flex items-center aspect-square cursor-pointer'
                        key={i}
                        onClick={()=>clickUserHandler(u)}>
                            <img src={`${robohash}/${u.username}`}
                                width={70}
                                className='rounded-[50%]'/>
                            <div className='absolute bg-white bottom-0 -right-2 rounded-[50%] p-1'>
                                <div className='bg-green-400 w-5 h-5 rounded-[50%]'></div>
                            </div>
                        </div>)):
                        <div className='flex items-center justify-center w-full'>
                            <div className='italic text-[#D9DCE0]'>
                                No Active User
                            </div>
                        </div>
                        }
                    </div>
                </div>
                <div className='py-5 px-12'>
                    <div className='font-bold text-[26px]'>Private Chats</div>
                </div>
                <Lists data={friends} type="dm" unreadDMs={unreadDMs} clickRoom={openRoom}/>

            </div>}

            {/* Group */}
            {!isPrivate&&
            <div className='w-full'>
                <div className='w-full text-black font-bold flex justify-end px-8 text-[18px]'>
                    <div className='flex gap-3 items-center cursor-pointer'
                    onClick={()=>setIsPrivate(!isPrivate)}>
                        <FontAwesomeIcon icon={faPaperPlane}/>
                        <span>Message a Friend</span>
                    </div>
                </div>


                <div className='py-7 px-12 text-xl flex justify-between'>
                    <div className='font-bold text-[26px]'>Room Chats</div>
                    <div
                    className='cursor-pointer'
                    onClick={()=>setIsModalOpen(true)}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </div>
                </div>

                <Lists data={groups} type="group" unreadGroups={unreadGroups} clickRoom={openRoom}/>
            </div>}
            {isModalOpen&&
            <Modal 
            isOpen={isModalOpen} 
            onClose={()=>setIsModalOpen(false)} 
            submitType='create'
            setGroups={setGroups}
            onUpdate={loadRoomsHandler}/>}
        </div>
  )
}
