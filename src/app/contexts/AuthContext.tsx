"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DiscourseUser } from '@/lib/discourse-auth';

interface AuthContextType {
  user: DiscourseUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DiscourseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('discourse_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('discourse_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    const returnUrl = `${window.location.origin}/api/auth/discourse/callback`;
    window.location.href = `/api/auth/discourse/login?return_url=${encodeURIComponent(returnUrl)}`;
  };

  const logout = () => {
    localStorage.removeItem('discourse_user');
    setUser(null);
    window.location.href = '/';
  };

  const isAdmin = user?.admin === true || user?.moderator === true;

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
