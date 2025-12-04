
import type { ListType } from '../types/props.types'
import { robohash } from '../lib/constants'
import { useNavigate } from 'react-router-dom'

const Lists = (props:ListType) => {
    const navigate = useNavigate()
    const data = props.data 

  return (
    <div className='px-10 flex flex-col overflow-y-scroll max-h-[45vh] no-scrollbar'>
        {data.length>0?(data.map((u)=>
        <div className='flex items-center gap-8 cursor-pointer hover:bg-[#F5F5F5] p-4' 
        key={u._id}
        onClick={()=>navigate(`/chats/${u._id}`)}>
            <div className='bg-[rgba(218,218,220,0.42)] rounded-[50%] p-1 flex items-center'>
                <img
                src={`${robohash}/${u.name}`}
                width={50}
                className='rounded-[50%]'
                />
            </div>
            <div className='font-bold'>
                {u.name}
            </div>
        </div>)):
        <div className='text-center italic text-[#D9DCE0]'>
            No Chat history
        </div>
        }
    </div>
  )
}

export default Lists