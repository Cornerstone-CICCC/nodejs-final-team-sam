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

//get list of existing private rooms by userId
export const getPrivateRooms = async(userId:string)=>{
    const type = "dm"
    try{
        const res = await fetch(`${endpoint}/typeanduser/`,{
            method:"POST",
            headers:{
               "Content-type" :"application/json",
            },
            body: JSON.stringify({
                type,
                userId
            })
        })
        const data = await res.json()

        return data
    }catch(err){
        console.error(err)
    }  
}
//get list of existing private rooms by userId
export const getGroupRooms = async(userId:string)=>{
    const type = "group"
    try{
        const res = await fetch(`${endpoint}/typeanduser/`,{
            method:"POST",
            headers:{
               "Content-type" :"application/json",
            },
            body: JSON.stringify({
                type,
                userId
            })
        })
        const data = await res.json()

        return data
    }catch(err){
        console.error(err)
    }  
}