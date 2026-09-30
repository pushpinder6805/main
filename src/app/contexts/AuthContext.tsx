"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

export interface WorksphereUser {
  id: string;
  username: string;
  name: string;
  email: string;
  email_verified: boolean;
  type: 'user' | 'advisor' | 'admin';
  onboarded: boolean;
  approved: boolean;
  avatar_url?: string;
  wallet_balance?: number;
  is_advisor?: boolean;
}

interface AuthContextType {
  user: WorksphereUser | null;
  isAdmin: boolean;
  isAdvisor: boolean;
  isLoading: boolean;
  refresh: () => Promise<WorksphereUser | null>;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<WorksphereUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {cache: 'no-store'});
      if (!response.ok) {
        setUser(null);
        return null;
      }
      const data = await response.json() as {user: WorksphereUser};
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const login = () => {
    window.location.href = '/login';
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {method: 'POST'}).catch(() => undefined);
    setUser(null);
    window.location.href = '/';
  };

  const isAdmin = user?.type === 'admin';
  const isAdvisor = user?.type === 'advisor';

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAdvisor, isLoading, refresh, login, logout }}>
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
