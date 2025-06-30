import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AuthState, AuthAction, User } from '../types';
import { authenticate } from '../data/mockData';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}>({
  state: initialState,
  login: () => Promise.resolve(false),
  logout: () => {},
});

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would make an API call
      const user = authenticate(email, password);
      
      if (user) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);