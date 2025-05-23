import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

// JWT Payload Type
type JwtPayload = {
  id: string;
  full_name: string;
  email: string;
  role: 'ROLE_TEACHER' | 'ROLE_STUDENT';
};

// Context Type
interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User) => void; // Added setCurrentUser method
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
    const token = response.data.token;

    localStorage.setItem('token', token);

    const decoded: JwtPayload = jwtDecode(token);
    console.log("Decoded JWT:", decoded);

    if (!['ROLE_TEACHER', 'ROLE_STUDENT'].includes(decoded.role)) {
      throw new Error('Invalid role in token');
    }

    const user: User = {
      id: decoded.id, 
      name: decoded.full_name,
      email: decoded.email,
      role: decoded.role,
      tokens: [],
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    setCurrentUser, // Providing setCurrentUser function to update the context
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper to get user from token anywhere
export const getUserFromToken = (): User | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: JwtPayload = jwtDecode(token);
    if (!['ROLE_TEACHER', 'ROLE_STUDENT'].includes(decoded.role)) return null;

    return {
      id: decoded.id,
      name: decoded.full_name,
      email: decoded.email,
      role: decoded.role,
      tokens: [],
    };
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
};
