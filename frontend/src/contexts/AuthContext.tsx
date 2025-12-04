import { createContext, useState, type ReactNode } from "react";
import type { AuthContextType } from "../types/context.types";
import type { User } from "../types/data.types";

export const AuthContext = createContext<AuthContextType| null>(null)


export const AuthProvider=({children}:{children:ReactNode})=>{
    const [user, setUser]= useState<User|null>(null)

    return(
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}