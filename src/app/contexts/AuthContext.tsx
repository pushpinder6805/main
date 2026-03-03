"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DiscourseUser } from '@/lib/discourse-auth';

interface AuthContextType {
  user: (DiscourseUser & { role?: string; is_advisor?: boolean; is_admin?: boolean }) | null;
  isAdmin: boolean;
  isAdvisor: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(DiscourseUser & { role?: string; is_advisor?: boolean; is_admin?: boolean }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    const discourseCookie = getCookie('discourse_user');

    if (discourseCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(discourseCookie));
        localStorage.setItem('discourse_user', JSON.stringify(userData));
        setUser(userData);
      } catch (e) {
        console.error('Error parsing discourse cookie:', e);
      }
    } else {
      const storedUser = localStorage.getItem('discourse_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (e) {
          localStorage.removeItem('discourse_user');
        }
      }
    }

    setIsLoading(false);
  };

  const login = () => {
    window.location.href = '/api/auth/discourse/login';
  };

  const logout = () => {
    localStorage.removeItem('discourse_user');
    localStorage.removeItem('worksphere_user');
    document.cookie = 'discourse_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    window.location.href = '/';
  };

  const isAdmin = user?.admin === true || user?.moderator === true || user?.is_admin === true;
  const isAdvisor = user?.is_advisor === true;

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAdvisor, isLoading, login, logout }}>
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
