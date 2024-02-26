import { createContext } from 'react';
import { useProvideAuth } from '../hooks/useAuth';

const initialState = {
  user: null,
  login: async () => {},
  googleLogin: async () => {},
  logout: () => {},
  loading: true,
  signUp: async () => {},
  updateUser: async () => {},
  updateUserFriends: () => {},
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}> {children} </AuthContext.Provider>;
};
