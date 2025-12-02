
import type { ListType } from '../types/props.types'
import { robohash } from '../lib/constants'
import type { Room, User } from '../types/data.types'

const Lists = (props:ListType) => {
    const data = props.data 
  return (
    <div className='px-10 flex flex-col gap-6'>
        {data.length>0&&data.map((u)=>
        <div className='flex items-center gap-8' key={u.id}>
            <div className='bg-[rgba(218,218,220,0.42)] rounded-[50%] p-1 flex items-center'>
                <img
                src={`${robohash}/${props.type==="private"?(u as User).username:(u as Room).roomName}`}
                width={50}
                className='rounded-[50%]'
                />
            </div>
            <div className='font-bold'>
                {props.type==="private"?(u as User).username:(u as Room).roomName}
            </div>
        </div>)}
    </div>
  )
}

export default Lists