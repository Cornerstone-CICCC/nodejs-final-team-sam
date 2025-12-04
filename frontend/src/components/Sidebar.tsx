import { faAngleLeft, faL, faMagnifyingGlass, faPaperPlane, faPeopleGroup, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { robohash } from '../lib/constants'
import Lists from '../components/Lists'
import type { Room } from '../types/data.types'
import Modal from '../components/Modal'
import { faCircleUser } from '@fortawesome/free-regular-svg-icons'
import { getAllRooms, getRoomById } from '../api/rooms.api'
import { logout } from '../api/auth.api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getGroupRooms, getPrivateRooms } from '../api/roomUser.api'


export const Sidebar = () => {
    const {user} = useAuth()

    const [activeUsers, setActiveUsers] = useState<{ id: string; username: string }[]>([])
    const [friends, setFriends] = useState<Room[]>([])
    const [groups, setGroups] = useState<Room[]>([])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpne] = useState(false)
    const [isSearchResultOpen, setIsSearchResultOpen] = useState(false)
    const [keyword, setKeyword] = useState("")
    const navigate = useNavigate()
    const [isPrivate, setIsPrivate] = useState(()=>{
        const storedValue = localStorage.getItem('isPrivate')
        return storedValue ? JSON.parse(storedValue): true
    })

    const keyboardEventHandler =(e:React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key!=="Enter") return
        setKeyword('')
        setIsSearchResultOpen(true)
    }

    const logoutHandler = async()=>{
        await logout()
        navigate("/")
    }

    const loadRoomsHandler = async()=>{
        if(user?._id){
            
            //fetch type="dm" -> return type Room
            let rooms:Room[]
            if(isPrivate){
                rooms = await getPrivateRooms(user._id)
                setFriends(rooms)
            }else{
                rooms = await getGroupRooms(user._id)
                setGroups(rooms)
            }
        }
    }

    useEffect(()=>{
        //Load rooms
        loadRoomsHandler()

    },[])

    //store the private/group input in local storage
    useEffect(()=>{
        localStorage.setItem('isPrivate',JSON.stringify(isPrivate))
        loadRoomsHandler()
    },[isPrivate])


  return (
        <div className='w-full min-w-full max-h-screen'>
            {/* Head */}
            <div className='flex items-center py-6 px-6 text-xl text-[#707991] justify-between relative'>
                {!isUserMenuOpen?
                <FontAwesomeIcon  icon={faCircleUser}
                className='text-2xl lg:text-3xl cursor-pointer'
                onClick={()=>setIsUserMenuOpne(true)}/>:
                <FontAwesomeIcon icon={faXmark}
                className='text-2xl lg:text-3xl cursor-pointer'
                onClick={()=>setIsUserMenuOpne(false)}/>
                }

                <div className='flex px-3 py-2 items-center gap-5 bg-[#F5F5F5] rounded-2xl w-fit text-[16px] lg:text-md'>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    <input type="text" placeholder='Find users..'
                    className='w-[100%] max-w-[300px]'
                    value={keyword}
                    onChange={(e)=>setKeyword(e.target.value)}
                    onKeyDown={(e)=>keyboardEventHandler(e)} />
                </div>

                {/* Account detail */}
                {isUserMenuOpen&&
                <div className='bg-white w-full h-[89vh] absolute left-0 top-20'>
                    <div className='p-5 w-full flex flex-col h-full justify-center gap-8 items-center'>
                        <div className='mx-auto'>
                            <div className='bg-lightBlue w-fit rounded-2xl'>
                                <img
                                src={`${robohash}/${user?.username}`}
                                width={250}
                                />
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
                <div className='bg-white w-full h-[89vh] absolute left-0 top-20'>
                    <div className='p-5 w-full flex flex-col'>
                        <div className='w-full'>
                            <FontAwesomeIcon 
                            icon={faAngleLeft}
                            onClick={()=>setIsSearchResultOpen(false)}/>
                        </div>
                        <div>

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

                <div className='p-5'>
                    {/* Active user */}
                    <div className='font-bold'>See People Online</div>
                    <div className='flex gap-4 h-[100px] p-2 overflow-x-scroll no-scrollbar'>
                        {activeUsers.length>0?(activeUsers.map((u,i)=>
                        <div className='bg-lightGray rounded-[50%] p-1 flex items-center aspect-square cursor-pointer'
                        key={i}>
                            <img src={`${robohash}/${u.username}`}
                                width={70}
                                className='rounded-[50%]'/>
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
                <Lists  data={friends}/>

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

                <Lists data={groups}/>
            </div>}
            {isModalOpen&&
            <Modal 
            isOpen={isModalOpen} 
            onClose={()=>setIsModalOpen(false)} 
            submitType='create'
            setGroups={setGroups}/>}
        </div>
  )
}
