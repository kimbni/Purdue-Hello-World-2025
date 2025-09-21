import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Tabs, Tab, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { User, HangoutSuggestion } from './types';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import ScheduleManager from './components/ScheduleManager';
import InfoManager from './components/InfoManager';
import HangoutSuggestions from './components/HangoutSuggestions';
import BuddiesManager from './components/BuddiesManager';
import LoginPage from './components/LoginPage';
import { apiService } from './services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Navigation component for the dashboard
function DashboardNav({ user, logout }: { user: User; logout: () => void }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/dashboard/schedule', label: 'My Schedule' },
    { path: '/dashboard/info', label: 'My Info' },
    { path: '/dashboard/suggestions', label: 'Hangout Suggestions' },
    { path: '/dashboard/buddies', label: 'Buddies' }
  ];

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#775287', minHeight: '60px' }}>
      <div className="container-fluid">
        <div 
          className="d-flex align-items-center px-3 py-1 me-3"
          style={{ 
            backgroundColor: 'rgba(195, 140, 219, 0.5)',
            borderRadius: '15px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <img 
            src="/logo.png" 
            alt="SyncUp Logo" 
            className="me-3"
            style={{ 
              height: '70px', 
              width: '70px'
            }} 
          />
          <div>
            <h5 
              className="mb-1 fw-bold"
              style={{ 
                color: '#e6e1d8',
                fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                fontSize: '1.4rem',
                lineHeight: 1
              }}
            >
              SyncUp
            </h5>
            <small 
              className="fst-italic"
              style={{ 
                color: '#e6e1d8',
                fontSize: '0.7rem',
                opacity: 0.8,
                fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif'
              }}
            >
              Sync schedules, meet Up
            </small>
          </div>
        </div>
        
        <div className="d-flex align-items-center">
          <div 
            className="d-flex me-3"
            style={{ 
              backgroundColor: 'rgba(195, 140, 219, 0.5)',
              borderRadius: '10px',
              padding: '6px 12px'
            }}
          >
            {navItems.map((item, index) => (
              <React.Fragment key={item.path}>
                <Link 
                  to={item.path}
                  className={`btn btn-link text-decoration-none me-2 ${location.pathname === item.path ? 'fw-bold' : ''}`}
                  style={{ 
                    color: '#e6e1d8',
                    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                    fontSize: '0.8rem',
                    transition: 'all 0.2s ease',
                    transform: location.pathname === item.path ? 'scale(1.05)' : 'scale(1)',
                    textShadow: location.pathname === item.path ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  {item.label}
                </Link>
                {index < navItems.length - 1 && (
                  <div style={{ width: '1px', height: '20px', backgroundColor: '#603275', margin: '0 8px' }}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div 
            className="px-3 py-1 me-3"
            style={{ 
              backgroundColor: '#e6e1d8',
              borderRadius: '10px',
              border: '2px solid rgba(195, 140, 219, 0.5)'
            }}
          >
            <span 
              className="navbar-text"
              style={{ 
                color: '#603275',
                fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                fontSize: '0.9rem'
              }}
            >
              Welcome, {user.name}!
            </span>
          </div>
          
          <Button
            variant="outlined"
            onClick={logout}
            sx={{
              color: '#e6e1d8',
              borderColor: 'rgba(195, 140, 219, 0.5)',
              borderRadius: '10px',
              fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
              fontSize: '0.8rem',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#e6e1d8',
                backgroundColor: 'rgba(195, 140, 219, 0.1)'
              }
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

// Dashboard layout component
function DashboardLayout() {
  const { user, isLoading, isAuthenticated, logout, updateUser } = useAuth();
  const [suggestions, setSuggestions] = useState<HangoutSuggestion[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadSuggestions();
    }
  }, [isAuthenticated, user]);

  const loadSuggestions = async () => {
    try {
      const userSuggestions = await apiService.getSuggestions();
      setSuggestions(userSuggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    try {
      await updateUser(userData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <DashboardNav user={user} logout={logout} />
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route index element={<Dashboard user={user} suggestions={suggestions} />} />
          <Route path="schedule" element={<ScheduleManager user={user} onUpdateUser={handleUpdateUser} />} />
          <Route path="info" element={<InfoManager user={user} onUpdateUser={handleUpdateUser} />} />
          <Route path="suggestions" element={
            <HangoutSuggestions 
              user={user} 
              suggestions={suggestions}
              onUpdateSuggestions={setSuggestions}
            />
          } />
          <Route path="buddies" element={<BuddiesManager user={user} onUpdateUser={handleUpdateUser} />} />
        </Routes>
      </Container>
    </Box>
  );
}

function AppContent() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard/*" element={<DashboardLayout />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
