// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem('userInfo');
    if (userInfoFromStorage) {
      const parsedUserInfo = JSON.parse(userInfoFromStorage);
      setUser(parsedUserInfo);
    }
    setLoading(false);
  }, []);

  const login = (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Optional: Function to re-fetch user details or refresh token
  const refreshUser = async () => {
    // This is a placeholder. In a real app, you might have an API endpoint
    // to get current user details by sending the token, or a token refresh mechanism.
    // For now, if the token is valid, we assume user info is current.
    const userInfoFromStorage = localStorage.getItem('userInfo');
    if (userInfoFromStorage) {
      setUser(JSON.parse(userInfoFromStorage));
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;