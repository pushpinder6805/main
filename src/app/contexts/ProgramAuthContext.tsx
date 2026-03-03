"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, UserProfile } from '@/lib/api-client';

interface ProgramAuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdvisor: boolean;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const ProgramAuthContext = createContext<ProgramAuthContextType | undefined>(undefined);

export function ProgramAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('worksphere_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        refreshProfile();
      } catch (e) {
        localStorage.removeItem('worksphere_user');
      }
    }
    setIsLoading(false);
  }, []);

  const refreshProfile = async () => {
    const { data, error } = await apiClient.getUserProfile();
    if (data && !error) {
      setUser(data);
      localStorage.setItem('worksphere_user', JSON.stringify(data));
    }
  };

  const login = async (username: string): Promise<boolean> => {
    try {
      localStorage.setItem('worksphere_user', JSON.stringify({ username }));

      const { data, error } = await apiClient.getUserProfile();

      if (error || !data) {
        localStorage.removeItem('worksphere_user');
        return false;
      }

      setUser(data);
      localStorage.setItem('worksphere_user', JSON.stringify(data));
      return true;
    } catch (error) {
      localStorage.removeItem('worksphere_user');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('worksphere_user');
    setUser(null);
    window.location.href = '/';
  };

  const isAdvisor = user?.is_advisor === true;

  return (
    <ProgramAuthContext.Provider value={{ user, isLoading, isAdvisor, login, logout, refreshProfile }}>
      {children}
    </ProgramAuthContext.Provider>
  );
}

export function useProgramAuth() {
  const context = useContext(ProgramAuthContext);
  if (context === undefined) {
    throw new Error('useProgramAuth must be used within a ProgramAuthProvider');
  }
  return context;
}
