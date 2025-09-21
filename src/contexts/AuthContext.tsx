import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const checkAuthStatus = useCallback(async () => {
    // Check if we have a user in localStorage (for demo mode)
    const savedUser = localStorage.getItem('demoUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing saved user:', error);
      }
    }

    // For demo mode, skip API calls and just set loading to false
    if (API_BASE_URL.includes('localhost') || !process.env.REACT_APP_API_URL) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Try to fetch from API (for real auth) with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = () => {
    // Mock login - set a demo user
    const mockUser: User = {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      majors: ['Computer Science'],
      interests: ['Technology', 'Gaming', 'Music'],
      schedule: [],
      buddies: []
    };
    setUser(mockUser);
    // Save to localStorage for persistence across page refreshes
    localStorage.setItem('demoUser', JSON.stringify(mockUser));
  };

  const logout = () => {
    // Mock logout - clear user
    setUser(null);
    // Clear localStorage
    localStorage.removeItem('demoUser');
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
