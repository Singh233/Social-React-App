import { createContext } from "react";
import { useProvideAuth } from "../hooks";


const initialState = {
    user: null, 
    login: () => {},
    googleLogin: () => {},
    logout: () => {},
    loading: true,
    signUp: () => {},
    updateUser: () => {},
    updateUserFriends: () => {},
}

export const AuthContext = createContext(initialState);

export const AuthProvider = ({children}) => {
    const auth = useProvideAuth();

    return <AuthContext.Provider value={auth}> {children} </AuthContext.Provider>
}