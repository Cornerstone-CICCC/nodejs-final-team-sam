import { BASE_URL } from "../lib/constants";

const endpoint = `${BASE_URL}/roomusers`

//Get all member:User in room
export const getRoomMember = async(roomId:string)=>{
    try{
        const res = await fetch(`${endpoint}/${roomId}`,{
            credentials:'include'
        })
        const data = await res.json()
        console.log(data)

        return data
    }catch(err){
        console.error(err)
    }
}

//get list of existing private rooms by userId
export const getPrivateRooms = async(userId:string)=>{
    const type = "dm"
    try{
        const res = await fetch(`${endpoint}/typeanduser`,{
            method:"POST",
            credentials:'include',
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
        const res = await fetch(`${endpoint}/typeanduser`,{
            method:"POST",
            credentials:'include',
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

//create room user
export const createRoomUser = async(roomId:string, userId:string)=>{
    try{
        const res = await fetch(endpoint,{
            method:"POST",
            credentials:'include',
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                roomId,
                userId
            })
        })

        const data = await res.json()
        return data
    }catch(err){
        console.error(err)
    }  

}

export const checkRoomUser = async(roomId:string, userId:string)=>{
    try{
        const res = await fetch(`${endpoint}/checkexist`,{
            method:"POST",
            credentials:'include',
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                roomId,
                userId
            })
        })

        const data = await res.json()

        if(data.length === 0 || !data){
            return false
        }
        return true
    }catch(err){
        console.error(err)
    }  
}