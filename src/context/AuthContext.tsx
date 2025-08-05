import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AuthState, AuthAction, User } from '../types';
import { authAPI, LoginRequest, User as ApiUser } from '../api/auth';

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
      const loginData: LoginRequest = { email, password };
      const response = await authAPI.login(loginData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.access_token);
      
      // Get current user info
      const user = await authAPI.getCurrentUser(response.access_token);
      
      // Convert API user to frontend user format
      const frontendUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: frontendUser });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);