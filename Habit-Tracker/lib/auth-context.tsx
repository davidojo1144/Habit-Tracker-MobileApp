import { createContext } from "react";
import { Models } from "react-native-appwrite";

type AuthContextType = {
    user: Models.User<Models.Preferences> | null
    signUp: (email: string, password: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: {children: React.ReactNode}){
    return (
        <AuthContext.Provider
        value={{user, signUp, signIn}}
        ></AuthContext.Provider>
    )
}

export function useAuth() {

}