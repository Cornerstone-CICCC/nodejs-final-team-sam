import { faFaceSmile, faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState, useRef } from 'react'
import type { Message, Received } from '../types/data.types'

const ChatSection = ({roomId}:{roomId:string}) => {
    const [sendingMsg, setSendingMsg] = useState("") //use this to send input to backend
    const [history, setHistory] = useState<Message[]>([])//this is for history message
    const [message, setMessage] = useState<Received[]>([])//new messages
    const messagesWrapper = useRef<HTMLDivElement>(null)

    //need to have some function to distinct between my message and others

    const handleSubmit =(e:React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault()

        if("key" in e && e.key !== "Enter") return

        if(!sendingMsg) return

        const newMessage: Received={
            username: "A",
            message: sendingMsg
        }

        setMessage([...message, newMessage])
        setSendingMsg("")
    }

    useEffect(()=>{   
        if (messagesWrapper.current) {
            messagesWrapper.current.scrollTop = messagesWrapper.current.scrollHeight
        }
    },[message])

  return (
    <div className='h-full'>

        {/* Chat history */}
        <div ref={messagesWrapper} className='h-[77.5vh] overflow-y-scroll no-scrollbar'>
            <div className='flex justify-end flex-col gap-3 p-4'>
                {/* Feched messge will go here */}
                {
                history.length>0&&history.map((h,i)=>
                    <div className={`w-full flex justify-end`}
                    key={i}>
                        <div className='bg-[#9BB1FF] py-1 px-4 rounded-xl w-fit'>
                            {h.content}
                        </div>
                    </div>
                )}

                {message.length>0&&message.map((m, i)=>
                <div className={`w-full flex justify-end`}
                key={i}>
                    <div className='bg-[#9BB1FF] py-1 px-4 rounded-xl w-fit'>
                        {m.message}
                    </div>
                </div>
                )}

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
            <FontAwesomeIcon icon={faPaperPlane} 
            className='text-[#8BABD8] cursor-pointer lg:text-xl'
            type='submi'
            />
        </form>

    </div>
  )
}

export default ChatSection