import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthContextType } from "../types/context.types";
import type { User } from "../types/data.types";
import { BASE_URL } from "../lib/constants";

export const AuthContext = createContext<AuthContextType| null>(null)


export const AuthProvider=({children}:{children:ReactNode})=>{
    const [user, setUser]= useState<User|null>(()=>{
        const stored = sessionStorage.getItem("user")
        return stored ? JSON.parse(stored):null
    })

    const fetchCurrentUser = async () => {
        const endpoint = `${BASE_URL}/users`
        try {
            const res = await fetch(`${endpoint}/checkauth`, {
                credentials: "include",
            });

            if (res.ok) {
                const userData = await res.json();
                console.log("fetchCurrentUser setUser:", userData)
                setUser(userData);
                sessionStorage.setItem("user", JSON.stringify(userData));
            } else if (res.status === 401) {
                const data = await res.json();
                if (data.message === "Session exists but no user") {
                    await fetch(`${endpoint}/logout`, { credentials: "include" });
                }
                console.log("fetchCurrentUser logout, setUser null")
                setUser(null);
                sessionStorage.removeItem("user");
            }
        } catch (err) {
            console.error(err);
            console.log("fetchCurrentUser error, setUser null")
            setUser(null);
            sessionStorage.removeItem("user");
        }
    };

    useEffect(()=>{
        fetchCurrentUser()
    },[])

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