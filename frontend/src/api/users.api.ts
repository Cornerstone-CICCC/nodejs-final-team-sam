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

//get user by username(unique)
export const getUserByUsername =async(username:string)=>{
    try{
        const res = await fetch(`${endpoint}/search?username=${username}`,{
            credentials:'include'
        })
        const data = await res.json() //will return userInfo
        return data
    }catch(err){
        console.error(err)
    }
}
//check if logged in or not
export const isSessionExist =async()=>{
    try{
        const res = await fetch(`${endpoint}/checkauth`,{
            credentials:'include'
        })
        if (res.status === 200) {
        const isLoggedIn = await res.json();
        console.log("Logged in:", isLoggedIn);
        return true;
        } else if (res.status === 401) {
        console.log("Not logged in");
        return false;
        }
    }catch(err){
        console.error(err)
    }
}

