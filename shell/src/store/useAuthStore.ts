
import { create } from 'zustand';
import type { UserDto } from '../types/auth';


interface AuthState {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: UserDto, token: string) => void;
  logout: () => void;
}

const getInitialUser = (): UserDto | null => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const getInitialToken = (): string | null => {
  return localStorage.getItem('token');
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: !!localStorage.getItem('token'),
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
