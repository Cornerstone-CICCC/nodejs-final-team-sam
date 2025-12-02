import ChatHead from '../components/ChatHead'
import ChatSection from '../components/ChatSection'
import { Sidebar } from '../components/Sidebar'

const TextingPage = () => {
  return (
    <div className='font-inter max-w-[1800px] mx-auto md:flex md:h-screen'>
        <div className='hidden md:flex  sm:w-[28%] md:w-[35%] flex-shrink-0'>
            <Sidebar/>
        </div>
        {/* Desktop right side -chat history*/}
        <div className='flex bg-[rgba(222,234,255,0.42)] h-screen flex-1 flex-col'>
          <ChatHead/>
          <ChatSection/>
        </div>
    </div>
  )
}

export default TextingPage