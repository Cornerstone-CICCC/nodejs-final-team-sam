import { faFaceSmile, faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import type { Message, Received } from '../types/data.types'

const ChatSection = () => {
    const [sendingMsg, setSendingMsg] = useState("") //use this to send input to backend
    const [history, setHistory] = useState<Message[]>([])//this is for history message
    const [message, setMessage] = useState<Received[]>([])//new messages


    //need to have some function to distinct between my message and others
    const clickHandeler=()=>{
        const newMessage: Received={
            username: "A",
            message: sendingMsg
        }
        setMessage([...message, newMessage])
        setSendingMsg("")
    }
    const keyHandeler=(e:React.KeyboardEvent<HTMLElement>)=>{
        if(e.key.toLowerCase() ==="enter"){
        const newMessage: Received={
            username: "A",
            message: sendingMsg
        }
        setMessage([...message, newMessage])
        setSendingMsg("")   
        }
    }

    useEffect(()=>{

    },[])

  return (
    <div className='h-screen'>

        {/* Chat history */}
        <div className='h-[80vh]'>
            <div className='flex items-end overflow-y-scroll flex-col gap-6 no-scrollbar p-4'>
                {/* Feched messge will go here */}
                {
                history.length>0&&history.map((h)=>
                <div>{h.content}</div>
                )}

                {message.length>0&&message.map((m)=>
                    <div className='bg-[#9BB1FF] py-1 px-4 rounded-xl'>
                        {m.message}
                    </div>
                )}

            </div>
            
        </div>


        {/* Input box */}
        <div className='flex pt-7 pb-8 px-10 w-full items-center bg-white'>
            <div className='text-[#707991] w-full flex gap-4 items-center'>
                <FontAwesomeIcon icon={faFaceSmile}/>
                <input type="text" name='message' placeholder='Message'
                value={sendingMsg} 
                onChange={(e)=>setSendingMsg(e.target.value)}
                onKeyDown={(e)=>keyHandeler(e)} />
            </div>
            <FontAwesomeIcon icon={faPaperPlane} 
            className='text-[#8BABD8] cursor-pointer'
            onClick={()=>clickHandeler()}
            />
        </div>

    </div>
  )
}

export default ChatSection