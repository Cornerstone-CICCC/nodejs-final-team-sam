
import type { AuthProps } from "../types/auth.types"
import { BASE_URL } from "../lib/constants"
import type { User } from "../types/data.types"

const endpoint = `${BASE_URL}/users`

//look for username, if finds then not valid
export const validateUsername = async(username:string)=>{
    try{
        const res = await fetch(`${endpoint}/search?username=${username}`,{
            method:"GET",
            credentials: "include", // send cookies
        })

        const data = await res.json()
        
        if(!res.ok){
            console.log(data)
            return false
        }
        return true

    }catch(err){
        console.error(err)
    }
}

export const signup = async({username, password}:AuthProps)=>{
    try{
        const res = await fetch(`${endpoint}/signup`,{
            method:"POST",
            headers:{
               "Content-type" :"application/json",
            },
            body: JSON.stringify({
                username,
                password
            }),
            credentials: "include", // send cookies
        })
        const data = await res.json()

        if(!res.ok){
            return false
        }
        console.log(`${data.username} account has been successfully created`)
        return true

    }catch(err){
        console.error(err)
    }
}

//log in to session
export const login = async({username, password}:AuthProps)=>{

    try{
        const res = await fetch(`${endpoint}/login`,{
            method:"POST",
            headers:{
               "Content-type" :"application/json",
            },
            body: JSON.stringify({
                username,
                password
            }),
            credentials:"include"
        })

        const data = await res.json() 
        if('user' in data){
            return data.user
        }
        return null
    }catch(err){
        console.error(err)
    }
}

export const logout = async()=>{
    try{
        await fetch(`${endpoint}/logout`,{
            credentials:"include",
        })

    }catch(err){
        console.error(err)
    }
}