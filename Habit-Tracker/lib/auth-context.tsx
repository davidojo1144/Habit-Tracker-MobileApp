import { createContext } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type AuthContextType = {
    user: Models.User<Models.Preferences> | null
    signUp: (email: string, password: string) => Promise<string | null>
    signIn: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: {children: React.ReactNode}){
    const signUp = async (email: string, password: string) => {
        try {
            await account.create(ID.unique(), email, password)
            await signIn(email, password)
        } catch (error) {
            
        }
    }

     const signIn = async (email: string, password: string) => {
        try {
            await account.create(ID.unique(), email, password)
        } catch (error) {
            
        }
    }

    return (
        <AuthContext.Provider value={{user, signUp, signIn}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {

}