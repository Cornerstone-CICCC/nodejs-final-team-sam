
import type { AuthProps } from "../types/auth.types"
import { BASE_URL } from "../lib/constants"



//calling find username routes by sending username
export const validateUsername = async(username:string)=>{
    try{
        const res = await fetch(`${BASE_URL}/???`,{
            method:"GET",
            body: JSON.stringify({
                username
            })
        })

        const data = await res.json()
        console.log(data)

    }catch(err){
        console.error(err)
    }
}

export const signup = async({username, password}:AuthProps)=>{
    try{
        const res = await fetch(`${BASE_URL}/sigup`,{
            method:"POST",
            headers:{
               "Content-type" :"application/json",
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        const data = await res.json()
        console.log(data)

    }catch(err){
        console.error(err)
    }
}

//log in to session
export const login = async({username, password}:AuthProps)=>{

    try{
        const res = await fetch(`${BASE_URL}/login`,{
            method:"POST",
            headers:{
               "Content-type" :"application/json",
            },
            body: JSON.stringify({
                username,
                password
            })
        })

        const data = await res.json()
        console.log(data)
    }catch(err){
        console.error(err)
    }
}
