import { useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { AuthContext } from '../providers/AuthProvider';
import { login as userLogin } from '../api';
import { signUp as userSignUp } from '../api';
import { setItemInLocalStorage, LOCALSTORAGE_TOKEN_KEY, removeItemInLocalStorage, getItemInLocalStorage} from '../utils';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
    return useContext(AuthContext);
};

export const useProvideAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const userToken = getItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY);
        if (userToken) {
            const user = jwtDecode(userToken);
            setUser(user);
        }
        setLoading(false);
    }, []);


    const signUp = async (name, email, password, confirmPassword) => {
        const response = await userSignUp(name, email, password, confirmPassword);

        if (response.success) {
            setUser(response.data.user);
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY, response.data.token ? response.data.token : null);
            return {
                success: true,
            };
        } else {
            return {
                success: false,
                message: response.message,
            };
        }
    }

    const login = async (email, password) => {
        const response = await userLogin(email, password);

        if (response.success) {
            setUser(response.data.user);
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY, response.data.token ? response.data.token : null);
            return {
                success: true,
            };
        } else {
            return {
                success: false,
                message: response.message,
            };
        }
    };

    const logout = () => {
        setUser(null);
        removeItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY);
        return toast.success("Successfully logged out!");

    };

    return {
        user,
        login,
        signUp,
        logout,
        loading,
    };
};
