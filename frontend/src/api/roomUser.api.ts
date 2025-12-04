import { BASE_URL } from "../lib/constants";

const endpoint = `${BASE_URL}/roomusers`

//Get all member:User in room
export const getRoomMember = async(roomId:string)=>{
    try{
        const res = await fetch(`${endpoint}/roomusers/${roomId}`,{
            credentials:'include'
        })
        const data = await res.json()
        if(data.users){
            const users = data.users
            console.log(users)
            return users
        }
    }catch(err){
        console.error(err)
    }
}
