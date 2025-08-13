import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // You need to install this: npm install jwt-decode

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser({ id: decodedUser.userId, name: decodedUser.name });
        localStorage.setItem('token', token);
      } catch (error) {
        // If token is invalid or expired
        console.error("Invalid token:", error);
        setUser(null);
        localStorage.removeItem('token');
      }
    }
  }, [token]);

  const login = (loginData) => {
    setToken(loginData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    window.location.href = '/'; 
  };

  const authContextValue = { user, token, login, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};