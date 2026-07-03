import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false
      };
    case 'LOGOUT':
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      if (!state.token) {
        dispatch({ type: 'AUTH_ERROR' });
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          dispatch({ type: 'SET_USER', payload: res.data.user });
        } else {
          dispatch({ type: 'AUTH_ERROR' });
        }
      } catch (err) {
        dispatch({ type: 'AUTH_ERROR' });
      }
    };
    loadUser();
  }, [state.token]);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
        return { success: true };
      }
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
        return { success: true };
      }
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error on backend', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/me', data);
      if (res.data.success) {
        dispatch({ type: 'SET_USER', payload: res.data.user });
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Update failed' };
    }
  };

  const uploadAvatar = async (formData) => {
    try {
      const res = await api.put('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        dispatch({ type: 'SET_USER', payload: res.data.user });
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Avatar upload failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile, uploadAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);