import { Sidebar } from '../components/Sidebar'


const ChatsPage = () => {

    return (
    <div className='font-inter max-w-[1800px] mx-auto md:flex md:h-screen'>
        <div className='md:w-[35%] flex-shrink-0 max-h-screen'>
            <Sidebar/>
        </div>
        {/* Desktop right side*/}
        <div className=' hidden md:flex bg-[rgba(222,234,255,0.42)] h-screen flex-1 justify-center items-center'>
            <div className='text-gray-400 text-3xl font-bold' >
                Welcome to Chatwave!
            </div>
        </div>
    </div>
  )
}

export default ChatsPage