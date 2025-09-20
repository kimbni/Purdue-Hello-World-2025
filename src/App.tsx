import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Tabs, Tab } from '@mui/material';
import { User, HangoutSuggestion } from './types';
import Dashboard from './components/Dashboard';
import ScheduleManager from './components/ScheduleManager';
import InterestsManager from './components/InterestsManager';
import HangoutSuggestions from './components/HangoutSuggestions';
import FriendsManager from './components/FriendsManager';

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
      interests: ['Gaming', 'Movies', 'Coffee', 'Hiking'],
      hobbies: ['Photography', 'Cooking', 'Board Games'],
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
      friends: ['2', '3']
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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hangout Planner
          </Typography>
          <Typography variant="body2">
            Welcome, {currentUser.name}!
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="main navigation">
            <Tab label="Dashboard" />
            <Tab label="My Schedule" />
            <Tab label="Interests & Hobbies" />
            <Tab label="Hangout Suggestions" />
            <Tab label="Friends" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Dashboard user={currentUser} suggestions={suggestions} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <ScheduleManager user={currentUser} onUpdateUser={setCurrentUser} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <InterestsManager user={currentUser} onUpdateUser={setCurrentUser} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <HangoutSuggestions 
            user={currentUser} 
            suggestions={suggestions}
            onUpdateSuggestions={setSuggestions}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          <FriendsManager user={currentUser} onUpdateUser={setCurrentUser} />
        </TabPanel>
      </Container>
    </Box>
  );
}

export default App;
