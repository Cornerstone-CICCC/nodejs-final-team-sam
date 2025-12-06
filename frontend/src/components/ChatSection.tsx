import { faFaceSmile, faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState, useRef } from 'react'
import type { Message, OldMessage, Received } from '../types/data.types'
import { useSocket } from '../contexts/SocketContext'
import { useAuth } from '../contexts/AuthContext'

const ChatSection = ({roomId}:{roomId:string}) => {
    const {oldMessages, sendMessage, messages} = useSocket()
    const {user} = useAuth()
    
    const [sendingMsg, setSendingMsg] = useState("") //use this to send input to backend
    const messagesWrapper = useRef<HTMLDivElement>(null)

    //need to have some function to distinct between my message and others

    const handleSubmit =(e:React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault()

        if("key" in e){
            if(e.key !== "Enter"){
                return
            }
        }

        if(!sendingMsg) return
        if(!user) return

        //emit to chatroom
        sendMessage({
            roomId, 
            userId:user._id,
            content:sendingMsg
         })

        //clear the message
        setSendingMsg("")
    }

    useEffect(()=>{
        console.log("OldMessage",oldMessages)
        if (messagesWrapper.current) {
            messagesWrapper.current.scrollTop = messagesWrapper.current.scrollHeight
        }
    },[messages, oldMessages])

  return (
    <div className='h-full'>

        {/* Chat history */}
        <div ref={messagesWrapper} className='h-[77.5vh] overflow-y-scroll no-scrollbar'>
            <div className='flex justify-end flex-col gap-3 p-4'>
                {/* Feched messge will go here */}
                {
                oldMessages.length>0&&(oldMessages as OldMessage[]).map((m)=>
                    <div className={`w-full flex ${m.userId._id === user?._id ? "justify-end" : "justify-start"}`}
                    key={m._id}>
                        <div className={`${m.userId._id === user?._id ? "bg-[#9BB1FF]" : "bg-[#E5E5EA]"} py-1 px-4 rounded-xl w-fit`}>
                            {m.content}
                        </div>
                    </div>
                )}

                {/* {messages.length>0&&(messages as Message[]).map((m, i)=>
                <div className={`w-full flex ${m.userId === user?._id ? "justify-end" : "justify-start"}`}
                key={i}>
                    <div className={`${m.userId === user?._id ? "bg-[#9BB1FF]" : "bg-[#E5E5EA]"} py-1 px-4 rounded-xl w-fit`}>
                        {m.content}
                    </div>
                </div>
                )} */}
                {messages.length > 0 &&
            messages.map((m, i) => {
                // SYSTEM MESSAGE (has "message" but no "content")
                if ("message" in m && !("content" in m)) {
                return (
                    <div key={i} className="w-full flex justify-center">
                        <div className="text-gray-500 italic text-sm py-1">
                            {m.message}
                        </div>
                    </div>
                )}
                return (
                <div
                    key={i}
                    className={`w-full flex ${m.userId === user?._id  ? "justify-end" : "justify-start"}`}>
                    <div
                    className={`${m.userId === user?._id ? "bg-[#9BB1FF]" : "bg-[#E5E5EA]"} py-1 px-4 rounded-xl w-fit`}>
                    {m.content}
                    </div>
                </div>)
            })
            }

            </div>
            
        </div>


        {/* Input box */}
        <form 
        className='flex py-6 px-10 w-full items-center bg-white'
        onSubmit={handleSubmit}>
            <div className='text-[#707991] w-full flex gap-4 items-center'>
                <FontAwesomeIcon icon={faFaceSmile}
                className='lg:text-xl'/>
                <input type="text" name='message' placeholder='Message'
                className='w-full text-xl'
                value={sendingMsg} 
                onChange={(e)=>setSendingMsg(e.target.value)}
                />
            </div>
            <button
            type="submit"
            className='border-none bg-none'>
            <FontAwesomeIcon icon={faPaperPlane} 
            className='text-[#8BABD8] cursor-pointer lg:text-xl'
            />
            </button>
        </form>

    </div>
  )
}

export default ChatSection