import { BASE_URL } from "../lib/constants"

const endpoint = `${BASE_URL}/users`

//Getting user Info from session after successfully logged in
export const getUserAccounnt = async(userId:string)=>{
    try{
        const res = await fetch(`${endpoint}/userId`,{
            credentials:'include'
        })
        const data = await res.json() //will return userInfo
        console.log(data)
    }catch(err){
        console.error(err)
    }
}

