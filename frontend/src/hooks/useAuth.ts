import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { ApiResponse, User } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface AuthData {
  token: string;
  user: User;
}

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await api.post<ApiResponse<AuthData>>('/auth/login', credentials);
      return data.data as AuthData;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? 'Login failed');
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: { name: string; email: string; password: string; role?: string }) => {
      const { data } = await api.post<ApiResponse<AuthData>>('/auth/register', payload);
      return data.data as AuthData;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Account created successfully!');
      navigate('/');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? 'Registration failed');
    },
  });
};
