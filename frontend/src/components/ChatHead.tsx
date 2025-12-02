import { faAngleLeft, faArrowRightFromBracket, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState, type MouseEvent } from "react"
import { useNavigate } from "react-router-dom"



const ChatHead = () => {
    const navigate = useNavigate()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement|null>(null)

    useEffect(()=>{
        const handleOutSideCLick = (e:globalThis.MouseEvent)=>{
            if(!menuRef) return

            const target = e.target as Node

            if(!menuRef.current?.contains(target)){
                setIsEditOpen(false)
            }
        }

        window.addEventListener('mousedown', handleOutSideCLick)

        return()=>{
            window.removeEventListener('mousedown', handleOutSideCLick)
        }
    },[menuRef])

  return (
    <div className='bg-white p-5 border-b border-[#D9DCE0] w-full relative'>
        <div className=" flex justify-between">
            <FontAwesomeIcon icon={faAngleLeft} 
            className="text-black cursor-pointer md:hidden"
            onClick={()=>navigate('/chats')}/>

            <div className="flex gap-4">
                <FontAwesomeIcon icon={faEllipsisVertical}
                onClick={()=>{setIsEditOpen(true)}}/>
                <FontAwesomeIcon icon={faArrowRightFromBracket}/>
            </div>
        </div>
        {isEditOpen&&
        <div className="bg-white border-s border-b border-e border-[#D9DCE0] absolute top-14 right-0 font-bold p-2 rounded-b-xl"
        ref={menuRef}>
            <div className="p-2">
                See All Member
            </div>
            <div className="p-2">
                Rename
            </div>
            <div className="p-2">
                Delete
            </div>
        </div>}
    </div>
  )
}

export default ChatHead