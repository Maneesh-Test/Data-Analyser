import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This effect simulates checking for an existing session on app load.
  useEffect(() => {
    // In a real app, you might check for a token in localStorage.
    // For this example, we assume the user is not logged in initially.
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.loginWithEmail(email, password);
      // Since the provided authService is fire-and-forget, we optimistically
      // set the user state upon a successful API call.
      setUser({ email });
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      throw error; // Re-throw to be handled by the UI component
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.signupWithEmail(email, password);
      // After signup, we don't automatically log the user in.
      // The UI will show a message to check for a verification email.
    } catch (error) {
      console.error('Signup failed:', error);
      throw error; // Re-throw to be handled by the UI component
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // In a real app, you would also clear any stored tokens or session data.
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
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
