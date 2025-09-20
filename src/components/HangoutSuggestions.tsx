import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid
} from '@mui/material';
import {
  Lightbulb,
  CheckCircle,
  Cancel,
  Add,
  LocationOn,
  Schedule,
  Group,
  Star
} from '@mui/icons-material';
import { User, HangoutSuggestion, Activity } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface HangoutSuggestionsProps {
  user: User;
  suggestions: HangoutSuggestion[];
  onUpdateSuggestions: (suggestions: HangoutSuggestion[]) => void;
}

const ACTIVITIES: Activity[] = [
  {
    name: 'Coffee & Study Session',
    category: 'Study',
    duration: 120,
    location: 'Local Coffee Shop',
    description: 'Grab coffee and study together'
  },
  {
    name: 'Movie Night',
    category: 'Entertainment',
    duration: 180,
    location: 'Cinema or Home',
    description: 'Watch a movie together'
  },
  {
    name: 'Gaming Session',
    category: 'Gaming',
    duration: 240,
    location: 'Home or Gaming Cafe',
    description: 'Play video games together'
  },
  {
    name: 'Hiking Adventure',
    category: 'Outdoor',
    duration: 300,
    location: 'Local Trail',
    description: 'Explore nature together'
  },
  {
    name: 'Cooking Together',
    category: 'Food',
    duration: 150,
    location: 'Kitchen',
    description: 'Prepare a meal together'
  },
  {
    name: 'Board Game Night',
    category: 'Games',
    duration: 180,
    location: 'Home or Cafe',
    description: 'Play board games together'
  }
];

const HangoutSuggestions: React.FC<HangoutSuggestionsProps> = ({
  user,
  suggestions,
  onUpdateSuggestions
}) => {
  const [open, setOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedBuddies, setSelectedBuddies] = useState<string[]>([]);
  const [suggestedDate, setSuggestedDate] = useState('');
  const [suggestedTime, setSuggestedTime] = useState('');

  // Generate AI suggestions based on user data
  const generateAISuggestions = () => {
    const newSuggestions: HangoutSuggestion[] = [];
    
    // Find common interests with buddies
    const commonInterests = user.interests; // In a real app, this would compare with buddies' interests
    
    // Generate suggestions based on interests
    commonInterests.forEach(interest => {
      const matchingActivities = ACTIVITIES.filter(activity => 
        activity.category.toLowerCase().includes(interest.toLowerCase()) ||
        activity.description.toLowerCase().includes(interest.toLowerCase())
      );
      
      if (matchingActivities.length > 0) {
        const activity = matchingActivities[0];
        const suggestion: HangoutSuggestion = {
          id: uuidv4(),
          title: `${activity.name} with Buddies`,
          description: activity.description,
          location: activity.location,
          suggestedTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in next week
          duration: activity.duration,
          activity: activity.name,
          participants: user.buddies,
          status: 'pending',
          responses: {},
          createdBy: 'ai',
          createdAt: new Date()
        };
        newSuggestions.push(suggestion);
      }
    });
    
    onUpdateSuggestions([...suggestions, ...newSuggestions]);
  };

  const handleResponse = (suggestionId: string, response: 'accepted' | 'declined') => {
    const updatedSuggestions = suggestions.map(suggestion => {
      if (suggestion.id === suggestionId) {
        const newResponses = {
          ...suggestion.responses,
          [user.id]: response
        };
        
        // Check if all participants have responded
        const allResponded = suggestion.participants.every(participantId => 
          newResponses[participantId] !== undefined
        );
        
        const allAccepted = suggestion.participants.every(participantId => 
          newResponses[participantId] === 'accepted'
        );
        
        let newStatus = suggestion.status;
        if (allResponded) {
          newStatus = allAccepted ? 'accepted' : 'declined';
        }
        
        return {
          ...suggestion,
          responses: newResponses,
          status: newStatus
        };
      }
      return suggestion;
    });
    
    onUpdateSuggestions(updatedSuggestions);
  };

  const handleCreateSuggestion = () => {
    if (!selectedActivity || selectedBuddies.length === 0 || !suggestedDate || !suggestedTime) {
      return;
    }

    const suggestion: HangoutSuggestion = {
      id: uuidv4(),
      title: `${selectedActivity.name} with Buddies`,
      description: selectedActivity.description,
      location: selectedActivity.location,
      suggestedTime: new Date(`${suggestedDate}T${suggestedTime}`),
      duration: selectedActivity.duration,
      activity: selectedActivity.name,
      participants: selectedBuddies,
      status: 'pending',
      responses: {},
      createdBy: user.id,
      createdAt: new Date()
    };

    onUpdateSuggestions([...suggestions, suggestion]);
    setOpen(false);
    setSelectedActivity(null);
    setSelectedBuddies([]);
    setSuggestedDate('');
    setSuggestedTime('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'declined': return 'error';
      case 'completed': return 'info';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle />;
      case 'declined': return <Cancel />;
      case 'completed': return <Star />;
      default: return <Lightbulb />;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Hangout Suggestions</Typography>
        <Box>
          <Button
            variant="outlined"
            onClick={generateAISuggestions}
            sx={{ mr: 2 }}
          >
            Generate AI Suggestions
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Create Suggestion
          </Button>
        </Box>
      </Box>

      {suggestions.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" color="text.secondary">
              No hangout suggestions yet
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Create a suggestion or let AI generate some based on your interests!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {suggestions.map((suggestion) => (
            <Grid item xs={12} md={6} key={suggestion.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {getStatusIcon(suggestion.status)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {suggestion.title}
                    </Typography>
                    <Chip
                      label={suggestion.status}
                      color={getStatusColor(suggestion.status) as any}
                      size="small"
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {suggestion.description}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {suggestion.location}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <Schedule fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {suggestion.suggestedTime.toLocaleDateString()} at {suggestion.suggestedTime.toLocaleTimeString()}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={2}>
                    <Group fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {suggestion.duration} minutes
                    </Typography>
                  </Box>

                  {suggestion.status === 'pending' && (
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        startIcon={<CheckCircle />}
                        color="success"
                        onClick={() => handleResponse(suggestion.id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Cancel />}
                        color="error"
                        onClick={() => handleResponse(suggestion.id, 'declined')}
                      >
                        Decline
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Hangout Suggestion</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Activity</InputLabel>
                <Select
                  value={selectedActivity?.name || ''}
                  onChange={(e) => {
                    const activity = ACTIVITIES.find(a => a.name === e.target.value);
                    setSelectedActivity(activity || null);
                  }}
                >
                  {ACTIVITIES.map((activity) => (
                    <MenuItem key={activity.name} value={activity.name}>
                      {activity.name} - {activity.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Buddies</InputLabel>
                <Select
                  multiple
                  value={selectedBuddies}
                  onChange={(e) => setSelectedBuddies(e.target.value as string[])}
                >
                  {user.buddies.map((buddyId) => (
                    <MenuItem key={buddyId} value={buddyId}>
                      Buddy {buddyId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={suggestedDate}
                onChange={(e) => setSuggestedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={suggestedTime}
                onChange={(e) => setSuggestedTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSuggestion} variant="contained">
            Create Suggestion
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HangoutSuggestions;
