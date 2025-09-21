import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, HangoutSuggestion } from '../types';

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
        // Convert Date strings back to Date objects for suggestions
        if (userData.suggestions) {
          userData.suggestions = userData.suggestions.map((suggestion: any) => ({
            ...suggestion,
            suggestedTime: new Date(suggestion.suggestedTime),
            createdAt: new Date(suggestion.createdAt)
          }));
        }
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
    // Check if we have saved user data in localStorage
    const savedUser = localStorage.getItem('demoUser');
    let mockUser: User;
    
    if (savedUser) {
      try {
        // Load existing user data
        mockUser = JSON.parse(savedUser);
        // Convert Date strings back to Date objects for suggestions
        if (mockUser.suggestions) {
          mockUser.suggestions = mockUser.suggestions.map((suggestion: any) => ({
            ...suggestion,
            suggestedTime: new Date(suggestion.suggestedTime),
            createdAt: new Date(suggestion.createdAt)
          }));
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        // Fall back to creating new user
        mockUser = createNewDemoUser();
      }
    } else {
      // Create new demo user
      mockUser = createNewDemoUser();
    }
    
    setUser(mockUser);
    // Save to localStorage for persistence across page refreshes
    localStorage.setItem('demoUser', JSON.stringify(mockUser));
  };

  const createNewDemoUser = (): User => {
    return {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      majors: ['Computer Science'],
      interests: ['Technology', 'Gaming', 'Music'],
      schedule: [
        // M/W/F Classes
        {
          id: 'cs180-mwf',
          name: 'CS 18000 - Programming I',
          dayOfWeek: 1, // Monday
          startTime: '09:00',
          endTime: '09:50',
          location: 'LWSN B151'
        },
        {
          id: 'cs180-mwf-wed',
          name: 'CS 18000 - Programming I',
          dayOfWeek: 3, // Wednesday
          startTime: '09:00',
          endTime: '09:50',
          location: 'LWSN B151'
        },
        {
          id: 'cs180-mwf-fri',
          name: 'CS 18000 - Programming I',
          dayOfWeek: 5, // Friday
          startTime: '09:00',
          endTime: '09:50',
          location: 'LWSN B151'
        },
        {
          id: 'math159-mwf',
          name: 'MATH 15900 - Calculus I',
          dayOfWeek: 1, // Monday
          startTime: '11:00',
          endTime: '11:50',
          location: 'MATH 175'
        },
        {
          id: 'math159-mwf-wed',
          name: 'MATH 15900 - Calculus I',
          dayOfWeek: 3, // Wednesday
          startTime: '11:00',
          endTime: '11:50',
          location: 'MATH 175'
        },
        {
          id: 'math159-mwf-fri',
          name: 'MATH 15900 - Calculus I',
          dayOfWeek: 5, // Friday
          startTime: '11:00',
          endTime: '11:50',
          location: 'MATH 175'
        },
        {
          id: 'engl106-mwf',
          name: 'ENGL 10600 - First-Year Composition',
          dayOfWeek: 1, // Monday
          startTime: '14:00',
          endTime: '14:50',
          location: 'BRNG 2284'
        },
        {
          id: 'engl106-mwf-wed',
          name: 'ENGL 10600 - First-Year Composition',
          dayOfWeek: 3, // Wednesday
          startTime: '14:00',
          endTime: '14:50',
          location: 'BRNG 2284'
        },
        {
          id: 'engl106-mwf-fri',
          name: 'ENGL 10600 - First-Year Composition',
          dayOfWeek: 5, // Friday
          startTime: '14:00',
          endTime: '14:50',
          location: 'BRNG 2284'
        },
        // T/R Classes
        {
          id: 'cs182-tr',
          name: 'CS 18200 - Foundations of Computer Science',
          dayOfWeek: 2, // Tuesday
          startTime: '10:00',
          endTime: '10:50',
          location: 'LWSN B155'
        },
        {
          id: 'cs182-tr-thu',
          name: 'CS 18200 - Foundations of Computer Science',
          dayOfWeek: 4, // Thursday
          startTime: '10:00',
          endTime: '10:50',
          location: 'LWSN B155'
        },
        {
          id: 'phys172-tr',
          name: 'PHYS 17200 - Modern Mechanics',
          dayOfWeek: 2, // Tuesday
          startTime: '12:00',
          endTime: '12:50',
          location: 'PHYS 112'
        },
        {
          id: 'phys172-tr-thu',
          name: 'PHYS 17200 - Modern Mechanics',
          dayOfWeek: 4, // Thursday
          startTime: '12:00',
          endTime: '12:50',
          location: 'PHYS 112'
        },
        {
          id: 'com114-tr',
          name: 'COM 11400 - Fundamentals of Speech Communication',
          dayOfWeek: 2, // Tuesday
          startTime: '15:00',
          endTime: '15:50',
          location: 'BRNG 2290'
        },
        {
          id: 'com114-tr-thu',
          name: 'COM 11400 - Fundamentals of Speech Communication',
          dayOfWeek: 4, // Thursday
          startTime: '15:00',
          endTime: '15:50',
          location: 'BRNG 2290'
        }
      ],
      buddies: [],
      suggestions: []
    };
  };

  const logout = () => {
    // Mock logout - clear user
    setUser(null);
    // Clear localStorage
    localStorage.removeItem('demoUser');
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      // For demo mode, update local state directly
      if (API_BASE_URL.includes('localhost') || !process.env.REACT_APP_API_URL) {
        if (user) {
          const updatedUser = { ...user, ...userData };
          setUser(updatedUser);
          // Save to localStorage for persistence
          localStorage.setItem('demoUser', JSON.stringify(updatedUser));
        }
        return;
      }

      // For real API mode
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
