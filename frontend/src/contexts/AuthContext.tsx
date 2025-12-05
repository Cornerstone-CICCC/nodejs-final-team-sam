import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthContextType } from "../types/context.types";
import type { User } from "../types/data.types";

export const AuthContext = createContext<AuthContextType| null>(null)


export const AuthProvider=({children}:{children:ReactNode})=>{
    const [user, setUser]= useState<User|null>(()=>{
        const stored = localStorage.getItem("user")
        return stored ? JSON.parse(stored):null
    })

    useEffect(()=>{
        if(user){
            localStorage.setItem("user", JSON.stringify(user))
        }else{
            localStorage.removeItem("user")
        }
    },[user])

    const value={user, setUser}

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth =()=>{
    const ctx = useContext(AuthContext)

    if(!ctx){
        throw new Error("useAuth must be used inside <AuthProvider>");
    }
    return ctx
}