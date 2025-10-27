import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      axios
        .get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token, API]);

  const login = async (username, password) => {
    const response = await axios.post(`${API}/auth/login`, {
      username,
      password,
    });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);

    // Get user info
    const userResponse = await axios.get(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    setUser(userResponse.data);
    return userResponse.data;
  };

  const register = async (username, email, password) => {
    const response = await axios.post(`${API}/auth/register`, {
      username,
      email,
      password,
    });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);

    // Get user info
    const userResponse = await axios.get(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    setUser(userResponse.data);
    return userResponse.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
