import { BASE_URL } from "../lib/constants"


const endpoint= `${BASE_URL}/rooms`

//get list of existing private rooms by userId
export const getPrivateRooms = async()=>{
    const type = "dm"
    try{
        const res = await fetch(`endpoint/types/${type}`,{
            method:"GET",
            credentials:"include",
        })

        const data = await res.json()

        return data
    }catch(err){
        console.error(err)
    }  
}

//get list of existing group rooms by userId
export const getGroupRooms = async()=>{
    const type = "group"
    try{
        const res = await fetch(`endpoint/types/${type}`,{
            method:"GET",
            credentials:"include",
        })

        const data = await res.json()

        return data
    }catch(err){
        console.error(err)
    }  
}

//create chat room 
export const createRoom = async({roomName, type}:{roomName:string, type:string})=>{
    try{
        const res = await fetch(endpoint,{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                name: roomName,
                type
            })
        })

        const data = await res.json()
        console.log(data)
    }catch(err){
        console.error(err)
    }  
}

//update room name by room id
export const updateRoomName = async(newName:string)=>{
    try{
        const res = await fetch(endpoint,{
            method:"PUT",
            credentials:"include",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                name: newName            
            })
        })

        const data = await res.json()
        console.log(data)
    }catch(err){
        console.error(err)
    }  
}

//Find a room by room name
export const findRoom = async(keyword:string)=>{
    try{
        const res = await fetch(`${endpoint}/search?name=${keyword}`,{
            method:"GET",
            credentials:"include"
        })

        const data = await res.json()

        return data
    }catch(err){
        console.error(err)
    }
}

//Get room by Id 
export const getRoomById = async(roomID:string)=>{
    try{
        const res = await fetch(`${endpoint}/${roomID}`,{
            method:"GET",
            credentials:"include",
        })

        const data = res.json()

        return data
    }catch(err){
        console.error(err)
    }
}
