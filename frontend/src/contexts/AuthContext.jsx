import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import React from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUser();
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const res = await axios.get(`/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user');
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/users/login', { email, password });
    setToken(res.data.token);
  };

  const register = async (username, email, password) => {
    const res = await axios.post('/users/register', { username, email, password });
    setToken(res.data.token);
  };

  const logout = () => {
    setToken('');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
