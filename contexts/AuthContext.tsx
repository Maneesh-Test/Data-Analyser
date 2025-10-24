import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, Session, Provider } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authEvent: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  sendPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  loginWithProvider: (provider: Provider) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authEvent, setAuthEvent] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const currentSession = await authService.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    };

    checkSession();

    const subscription = authService.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthEvent(event);
      // Reset event after a short delay for non-recovery events to avoid sticky state
      if (event !== 'PASSWORD_RECOVERY') {
        setTimeout(() => setAuthEvent(null), 500);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);


  const login = async (email: string, password: string) => {
    await authService.loginWithEmail(email, password);
  };
  
  const signup = async (email: string, password: string) => {
    await authService.signupWithEmail(email, password);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setSession(null);
  };
  
  const sendPasswordReset = async (email: string) => {
    await authService.sendPasswordResetEmail(email);
  };

  const updatePassword = async (password: string) => {
    await authService.updateUserPassword(password);
    // Manually clear the recovery event state after a successful update
    setAuthEvent(null);
  };

  const loginWithProvider = async (provider: Provider) => {
    await authService.loginWithProvider(provider);
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    authEvent,
    login,
    signup,
    logout,
    sendPasswordReset,
    updatePassword,
    loginWithProvider,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};