import { faBars, faMagnifyingGlass, faPaperPlane, faPeopleGroup, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { robohash } from '../lib/constants'
import Lists from '../components/Lists'
import type { Room } from '../types/data.types'
import Modal from '../components/Modal'

export const Sidebar = () => {
    const [activeUsers, setActiveUsers] = useState<{ id: string; username: string }[]>([])
    const [friends, setFriends] = useState<{ id: string; username: string }[]>([])
    const [groups, setGroups] = useState<Room[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    // const [isPrivate, setIsPrivate] = useState(true)
    const [isPrivate, setIsPrivate] = useState(()=>{
        const storedValue = localStorage.getItem('isPrivate')
        return storedValue ? JSON.parse(storedValue): true
    })

    useEffect(()=>{
        //Sample data
        const friends =[
            {id:'1',username:"Amy"}, 
            {id:'2',username:"Pal"},
            {id:'3',username:"Bob"}, 
            {id:'4',username:"Sean"},
            {id:'5',username:"Kyle"},
            {id:'6',username:"Tyle"},
        ]

        const groups = [
            {id:'1',roomName:"Amy"}, 
            {id:'2',roomName:"Pal"},
            {id:'3',roomName:"Bob"}, 
        ]
        setFriends(friends)
        setActiveUsers(friends)
        setGroups(groups)
    },[])

    //store the private/group input in local storage
    useEffect(()=>{
        localStorage.setItem('isPrivate',JSON.stringify(isPrivate))
    },[isPrivate])
  return (
        <div className='w-full min-w-full'>
            {/* Head */}
            <div className='flex items-center py-6 px-6 text-xl text-[#707991] justify-between'>
                <FontAwesomeIcon  icon={faBars}/>

                <div className='flex px-3 py-2 items-center gap-5 bg-[#F5F5F5] rounded-2xl w-fit'>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    <input type="text" placeholder='Find a message..'
                    className='w-[100%] max-w-[300px]' />
                </div>
            </div>

            {/* Private Chats */}
            {isPrivate&&<div>
                <div className='w-full text-black font-bold flex justify-end px-8 text-[18px]'>
                    <div className='flex gap-3 items-center cursor-pointer'
                    onClick={()=>setIsPrivate(false)}>
                        <FontAwesomeIcon icon={faPeopleGroup}/>
                        <span>Join Group</span>
                    </div>
                </div>

                <div className='p-5'>
                    <div className='font-bold'>See People Online</div>
                    <div className='flex gap-4 h-[100px] p-2 overflow-x-scroll no-scrollbar'>
                        {activeUsers.length>0&&activeUsers.map((u)=>
                        <div className='bg-[#BFD7FF] rounded-[50%] p-1 flex items-center aspect-square cursor-pointer'>
                            <img src={`${robohash}/${u.id}`}
                                width={70}
                                className='rounded-[50%]'/>
                        </div>)}
                    </div>
                </div>
                {/* List of people messaged before */}
                {/* <div className='px-4 flex flex-col gap-6'>
                    {friends.length>0&&friends.map((friend)=>
                    <div className='flex items-center gap-8'>
                        <div className='bg-[#BFD7FF] rounded-[50%] p-1 flex items-center'>
                            <img
                            src={`${robohash}/${friend}`}
                            width={50}
                            className='rounded-[50%]'
                            />
                        </div>
                        <div className='font-bold'>
                            {friend}
                        </div>
                    </div>)}
                </div> */}
                <div className='py-7 px-12'>
                    <div className='font-bold text-[26px]'>Private Chats</div>
                </div>
                <Lists type={"private"} data={friends}/>

            </div>}

            {/* Group */}
            {!isPrivate&&
            <div className='w-full'>
                <div className='w-full text-black font-bold flex justify-end px-8 text-[18px]'>
                    <div className='flex gap-3 items-center cursor-pointer'
                    onClick={()=>setIsPrivate(true)}>
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

                <Lists type={"group"} data={groups}/>
            </div>}
            {isModalOpen&&<Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)}/>}
        </div>
  )
}
