import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Tabs, Tab } from '@mui/material';
import { User, HangoutSuggestion } from './types';
import Dashboard from './components/Dashboard';
import ScheduleManager from './components/ScheduleManager';
import InfoManager from './components/InfoManager';
import HangoutSuggestions from './components/HangoutSuggestions';
import BuddiesManager from './components/BuddiesManager';

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

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [suggestions, setSuggestions] = useState<HangoutSuggestion[]>([]);

  useEffect(() => {
    // Initialize with demo user data
    const demoUser: User = {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      interests: ['Gaming', 'Movies', 'Coffee', 'Hiking', 'Photography', 'Cooking', 'Board Games'],
      majors: ['Computer Science', 'Mathematics'],
      schedule: [
        {
          id: '1',
          name: 'Computer Science 101',
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '10:30',
          location: 'Building A, Room 101'
        },
        {
          id: '2',
          name: 'Mathematics 201',
          dayOfWeek: 3,
          startTime: '14:00',
          endTime: '15:30',
          location: 'Building B, Room 205'
        }
      ],
      buddies: ['2', '3']
    };
    setCurrentUser(demoUser);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
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
              <button 
                className={`btn btn-link text-decoration-none me-2 ${tabValue === 0 ? 'fw-bold' : ''}`}
                onClick={() => handleTabChange(null as any, 0)}
                style={{ 
                  color: '#e6e1d8',
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  transform: tabValue === 0 ? 'scale(1.05)' : 'scale(1)',
                  textShadow: tabValue === 0 ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (tabValue !== 0) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.textShadow = '0 1px 2px rgba(0,0,0,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (tabValue !== 0) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.textShadow = 'none';
                  }
                }}
               >
                 Dashboard
               </button>
               <div style={{ width: '1px', height: '20px', backgroundColor: '#603275', margin: '0 8px' }}></div>
               <button 
                 className={`btn btn-link text-decoration-none me-2 ${tabValue === 1 ? 'fw-bold' : ''}`}
                onClick={() => handleTabChange(null as any, 1)}
                style={{ 
                  color: '#e6e1d8',
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  transform: tabValue === 1 ? 'scale(1.05)' : 'scale(1)',
                  textShadow: tabValue === 1 ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (tabValue !== 1) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.textShadow = '0 1px 2px rgba(0,0,0,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (tabValue !== 1) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.textShadow = 'none';
                  }
                }}
               >
                 My Schedule
               </button>
               <div style={{ width: '1px', height: '20px', backgroundColor: '#603275', margin: '0 8px' }}></div>
               <button 
                 className={`btn btn-link text-decoration-none me-2 ${tabValue === 2 ? 'fw-bold' : ''}`}
                onClick={() => handleTabChange(null as any, 2)}
                style={{ 
                  color: '#e6e1d8',
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  transform: tabValue === 2 ? 'scale(1.05)' : 'scale(1)',
                  textShadow: tabValue === 2 ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (tabValue !== 2) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.textShadow = '0 1px 2px rgba(0,0,0,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (tabValue !== 2) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.textShadow = 'none';
                  }
                }}
               >
                 My Info
               </button>
               <div style={{ width: '1px', height: '20px', backgroundColor: '#603275', margin: '0 8px' }}></div>
               <button 
                 className={`btn btn-link text-decoration-none me-2 ${tabValue === 3 ? 'fw-bold' : ''}`}
                onClick={() => handleTabChange(null as any, 3)}
                style={{ 
                  color: '#e6e1d8',
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  transform: tabValue === 3 ? 'scale(1.05)' : 'scale(1)',
                  textShadow: tabValue === 3 ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (tabValue !== 3) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.textShadow = '0 1px 2px rgba(0,0,0,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (tabValue !== 3) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.textShadow = 'none';
                  }
                }}
               >
                 Hangout Suggestions
               </button>
               <div style={{ width: '1px', height: '20px', backgroundColor: '#603275', margin: '0 8px' }}></div>
               <button 
                 className={`btn btn-link text-decoration-none me-2 ${tabValue === 4 ? 'fw-bold' : ''}`}
                onClick={() => handleTabChange(null as any, 4)}
                style={{ 
                  color: '#e6e1d8',
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  transform: tabValue === 4 ? 'scale(1.05)' : 'scale(1)',
                  textShadow: tabValue === 4 ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (tabValue !== 4) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.textShadow = '0 1px 2px rgba(0,0,0,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (tabValue !== 4) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.textShadow = 'none';
                  }
                }}
              >
                Buddies
              </button>
            </div>
            
            <div 
              className="px-3 py-1"
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
            Welcome, {currentUser.name}!
              </span>
            </div>
          </div>
        </div>
      </nav>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        
        <TabPanel value={tabValue} index={0}>
          <Dashboard user={currentUser} suggestions={suggestions} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <ScheduleManager user={currentUser} onUpdateUser={setCurrentUser} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <InfoManager user={currentUser} onUpdateUser={setCurrentUser} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <HangoutSuggestions 
            user={currentUser} 
            suggestions={suggestions}
            onUpdateSuggestions={setSuggestions}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          <BuddiesManager user={currentUser} onUpdateUser={setCurrentUser} />
        </TabPanel>
      </Container>
    </Box>
  );
}

export default App;
