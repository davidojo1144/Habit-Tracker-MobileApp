import { createContext } from "react";

const AuthContext = createContext(undefined)

export function AuthProvider({children}: {children: React.ReactNode}){
    return <></>
}

export function useAuth() {
    
}