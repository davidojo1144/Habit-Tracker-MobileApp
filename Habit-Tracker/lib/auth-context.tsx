import { createContext } from "react";

type AuthContextType = {
    
}

const AuthContext = createContext(undefined)

export function AuthProvider({children}: {children: React.ReactNode}){
    return <></>
}

export function useAuth() {

}