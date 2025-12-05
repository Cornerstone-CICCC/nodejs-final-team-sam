import { BASE_URL } from "../lib/constants"


const endpoint= `${BASE_URL}/rooms`

//create chat room 
export const createRoom = async({roomName, type}:{roomName:string, type:string})=>{
    try{
        const res = await fetch(endpoint,{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                name: roomName,
                type
            }),
            credentials:'include'
        })

        const data = await res.json()
        return data
    }catch(err){
        console.error(err)
    }  
}

//update room name by room id
export const updateRoomName = async(roomId:string,newName:string)=>{
    try{
        const res = await fetch(`${endpoint}/${roomId}`,{
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                name: newName            
            }),
            credentials:'include'
        })

        const data = await res.json()
        console.log(data)
    }catch(err){
        console.error(err)
    }  
}

//Find room by room name
export const findRoom = async(keyword:string)=>{
    try{
        const res = await fetch(`${endpoint}/search?roomname=${keyword}`,{
            method:"GET",
            credentials:'include'
        })

        const data = await res.json()

        return data
    }catch(err){
        console.error(err)
    }
}

//Get room by Id 
export const getRoomById = async(roomId:string)=>{
    try{
        const res = await fetch(`${endpoint}/${roomId}`,{
            method:"GET",
            credentials:'include'
        })

        if (!res.ok) {
        console.error("Failed to fetch room:", res.statusText)
        return null
        }

        const data = await res.json()

        return data
    }catch(err){
        console.error(err)
        return null
    }
}

//get all rooms(including non related)
export const getAllRooms = async()=>{
    try{
        const res = await fetch(`${endpoint}/`,{
            method:"GET",
            credentials:'include'
        })

        const data = res.json()
        console.log(data)

        return data
    }catch(err){
        console.error(err)
    }
}
