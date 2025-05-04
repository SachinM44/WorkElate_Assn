import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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
      console.log('User data fetched:', res.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      toast.error('Failed to fetch user data');
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/users/login', { email, password });
      setToken(res.data.token);
      toast.success('Successfully logged in!');
      console.log('Login successful');
    } catch (err) {
      console.error('Login failed:', err);
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post('/users/register', { username, email, password });
      setToken(res.data.token);
      toast.success('Registration successful!');
      console.log('Registration successful');
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setToken('');
    toast.info('Logged out successfully');
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
