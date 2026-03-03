"use client"

import { useAuth } from './AuthContext';

export function useProgramAuth() {
  return useAuth();
}

export { AuthProvider as ProgramAuthProvider } from './AuthContext';
