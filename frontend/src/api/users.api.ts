import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../lib/constants"

const endpoint = `${BASE_URL}/users`
export const logout = async()=>{
    const navigate = useNavigate()
    try{
        await fetch(`${BASE_URL}/users/logout`,{
            credentials:"include",
        })

        navigate("/")
    }catch(err){
        console.error(err)
    }
}

//Getting user Info from session after successfully logged in
export const getUserAccounnt = async()=>{
    try{
        const res = await fetch(`${endpoint}/account`,{
            credentials:'include'
        })
        const data = await res.json() //will return userInfo
        console.log(data)
    }catch(err){
        console.error(err)
    }
}

