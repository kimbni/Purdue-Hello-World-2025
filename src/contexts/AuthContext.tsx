import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User } from '../types';
import { apiService } from '../services/api';

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
  const { user: auth0User, isAuthenticated: auth0IsAuthenticated, isLoading: auth0IsLoading, loginWithRedirect, logout: auth0Logout, getAccessTokenSilently } = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      apiService.setToken(token);
      
      const userData = await apiService.getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (auth0IsLoading) {
      setIsLoading(true);
      return;
    }

    if (auth0IsAuthenticated && auth0User) {
      checkAuthStatus();
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [auth0IsAuthenticated, auth0User, auth0IsLoading, checkAuthStatus]);

  const login = () => {
    loginWithRedirect();
  };

  const logout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const token = await getAccessTokenSilently();
      apiService.setToken(token);
      
      const updatedUser = await apiService.updateUserProfile(userData);
      setUser(updatedUser);
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
