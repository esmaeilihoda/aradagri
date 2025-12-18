import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/services/api';
import { User, AuthState } from '@/types';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      token,
      refreshToken: localStorage.getItem('refreshToken'),
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!token,
    };
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      const { user, token, refreshToken } = response.data.data;

      apiClient.setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('refreshToken', refreshToken);

      setState({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error(error);
    } finally {
      apiClient.clearToken();
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      setState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  }, []);

  return {
    ...state,
    login,
    logout,
  };
};
