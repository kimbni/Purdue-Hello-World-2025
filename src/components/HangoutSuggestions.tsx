import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { geminiService } from '../services/geminiService';

interface HangoutSuggestionsProps {
  user: User;
  suggestions: HangoutSuggestion[];
  onUpdateSuggestions: (suggestions: HangoutSuggestion[]) => Promise<void>;
}

const ACTIVITIES: Activity[] = [
  // Study & Academic
  {
    name: 'Coffee & Study Session',
    category: 'Study',
    duration: 120,
    location: 'Local Coffee Shop',
    description: 'Grab coffee and study together'
  },
  {
    name: 'Library Study Group',
    category: 'Study',
    duration: 180,
    location: 'University Library',
    description: 'Collaborative study session'
  },
  {
    name: 'Campus Tour',
    category: 'Academic',
    duration: 90,
    location: 'Purdue Campus',
    description: 'Explore campus landmarks and history'
  },
  
  // Entertainment & Media
  {
    name: 'Movie Night',
    category: 'Entertainment',
    duration: 180,
    location: 'Cinema or Home',
    description: 'Watch a movie together'
  },
  {
    name: 'Netflix & Chill',
    category: 'Entertainment',
    duration: 120,
    location: 'Home',
    description: 'Binge-watch your favorite series'
  },
  {
    name: 'Concert or Live Music',
    category: 'Entertainment',
    duration: 240,
    location: 'Concert Venue',
    description: 'Enjoy live music together'
  },
  {
    name: 'Podcast Recording',
    category: 'Media',
    duration: 90,
    location: 'Recording Studio',
    description: 'Create content together'
  },
  
  // Gaming & Technology
  {
    name: 'Gaming Session',
    category: 'Gaming',
    duration: 240,
    location: 'Home or Gaming Cafe',
    description: 'Play video games together'
  },
  {
    name: 'VR Experience',
    category: 'Technology',
    duration: 120,
    location: 'VR Arcade',
    description: 'Explore virtual reality worlds'
  },
  {
    name: 'Escape Room Challenge',
    category: 'Games',
    duration: 90,
    location: 'Escape Room',
    description: 'Solve puzzles and escape together'
  },
  {
    name: 'Board Game Night',
    category: 'Games',
    duration: 180,
    location: 'Home or Cafe',
    description: 'Play board games together'
  },
  
  // Outdoor & Adventure
  {
    name: 'Hiking Adventure',
    category: 'Outdoor',
    duration: 300,
    location: 'Local Trail',
    description: 'Explore nature together'
  },
  {
    name: 'Picnic in the Park',
    category: 'Outdoor',
    duration: 150,
    location: 'Local Park',
    description: 'Enjoy food and nature'
  },
  {
    name: 'Bike Ride',
    category: 'Outdoor',
    duration: 120,
    location: 'Bike Trails',
    description: 'Cycling adventure around town'
  },
  {
    name: 'Photography Walk',
    category: 'Outdoor',
    duration: 180,
    location: 'Downtown or Campus',
    description: 'Capture memories together'
  },
  {
    name: 'Stargazing',
    category: 'Outdoor',
    duration: 120,
    location: 'Observatory or Open Field',
    description: 'Watch the stars and planets'
  },
  
  // Food & Cooking
  {
    name: 'Cooking Together',
    category: 'Food',
    duration: 150,
    location: 'Kitchen',
    description: 'Prepare a meal together'
  },
  {
    name: 'Food Truck Tour',
    category: 'Food',
    duration: 180,
    location: 'Food Truck Park',
    description: 'Try different cuisines'
  },
  {
    name: 'Baking Challenge',
    category: 'Food',
    duration: 120,
    location: 'Kitchen',
    description: 'Bake cookies or desserts'
  },
  {
    name: 'Restaurant Hopping',
    category: 'Food',
    duration: 240,
    location: 'Multiple Restaurants',
    description: 'Try appetizers at different places'
  },
  
  // Sports & Fitness
  {
    name: 'Basketball Game',
    category: 'Sports',
    duration: 120,
    location: 'Campus Gym',
    description: 'Play basketball together'
  },
  {
    name: 'Rock Climbing',
    category: 'Sports',
    duration: 180,
    location: 'Climbing Gym',
    description: 'Challenge yourselves on the wall'
  },
  {
    name: 'Swimming',
    category: 'Sports',
    duration: 90,
    location: 'Pool',
    description: 'Swim laps or play water games'
  },
  {
    name: 'Tennis Match',
    category: 'Sports',
    duration: 120,
    location: 'Tennis Courts',
    description: 'Play tennis together'
  },
  
  // Arts & Culture
  {
    name: 'Art Museum Visit',
    category: 'Culture',
    duration: 180,
    location: 'Art Museum',
    description: 'Explore art and culture'
  },
  {
    name: 'Pottery Class',
    category: 'Arts',
    duration: 150,
    location: 'Art Studio',
    description: 'Create pottery together'
  },
  {
    name: 'Open Mic Night',
    category: 'Culture',
    duration: 120,
    location: 'Coffee Shop or Venue',
    description: 'Share talents or enjoy performances'
  },
  {
    name: 'Book Club Meeting',
    category: 'Culture',
    duration: 90,
    location: 'Library or Cafe',
    description: 'Discuss books and literature'
  },
  
  // Social & Community
  {
    name: 'Volunteer Work',
    category: 'Community',
    duration: 180,
    location: 'Local Organization',
    description: 'Give back to the community'
  },
  {
    name: 'Farmers Market Visit',
    category: 'Community',
    duration: 120,
    location: 'Farmers Market',
    description: 'Shop for fresh local produce'
  },
  {
    name: 'Campus Event',
    category: 'Social',
    duration: 120,
    location: 'Campus',
    description: 'Attend university events together'
  },
  {
    name: 'Thrift Shopping',
    category: 'Shopping',
    duration: 150,
    location: 'Thrift Stores',
    description: 'Find unique vintage items'
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

  // Generate AI suggestions using Gemini
  const generateAISuggestions = async () => {
    try {
      // Use Gemini to generate personalized activity suggestions
      const geminiSuggestion = await geminiService.generateActivitySuggestions(
        user, 
        suggestions, 
        user.buddies.length
      );
      
      const newSuggestion: HangoutSuggestion = {
        id: uuidv4(),
        title: geminiSuggestion.activity,
        description: geminiSuggestion.description,
        location: geminiSuggestion.location,
        suggestedTime: geminiSuggestion.suggestedTime,
        duration: geminiSuggestion.duration,
        activity: geminiSuggestion.activity,
        participants: user.buddies,
        status: 'pending',
        responses: {},
        createdBy: 'ai',
        createdAt: new Date()
      };
      
      await onUpdateSuggestions([...suggestions, newSuggestion]);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      // Fallback to original method if Gemini fails
      await generateFallbackSuggestions();
    }
  };

  // Fallback method using the original logic
  const generateFallbackSuggestions = async () => {
    // Get user's interests and majors for better matching
    const userInterests = user.interests.map(interest => interest.toLowerCase());
    const userMajors = user.majors.map(major => major.toLowerCase());
    
    // Create a scoring system for activities
    const scoredActivities = ACTIVITIES.map(activity => {
      let score = 0;
      const activityCategory = activity.category.toLowerCase();
      const activityDescription = activity.description.toLowerCase();
      const activityName = activity.name.toLowerCase();
      
      // Score based on interests
      userInterests.forEach(interest => {
        if (activityCategory.includes(interest) || 
            activityDescription.includes(interest) || 
            activityName.includes(interest)) {
          score += 3;
        }
      });
      
      // Score based on majors
      userMajors.forEach(major => {
        if (activityCategory.includes(major) || 
            activityDescription.includes(major) || 
            activityName.includes(major)) {
          score += 2;
        }
      });
      
      // Bonus for study-related activities for CS majors
      if (userMajors.some(major => major.includes('computer') || major.includes('cs'))) {
        if (activityCategory.includes('study') || activityCategory.includes('technology')) {
          score += 2;
        }
      }
      
      // Add some randomness to prevent always getting the same suggestions
      score += Math.random() * 2;
      
      return { activity, score };
    });
    
    // Get existing suggestion activities to prevent duplicates
    const usedActivities = new Set();
    suggestions.forEach(suggestion => {
      usedActivities.add(suggestion.activity);
    });
    
    // Filter out already used activities and sort by score
    const availableActivities = scoredActivities
      .filter(item => !usedActivities.has(item.activity.name))
      .sort((a, b) => b.score - a.score);
    
    // If no available activities, pick a random one
    if (availableActivities.length === 0) {
      const randomActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
      availableActivities.push({ activity: randomActivity, score: 0 });
    }
    
    // Select the top activity
    const selectedActivity = availableActivities[0].activity;
    
    // Generate random time in the next 2 weeks
    const randomDays = Math.floor(Math.random() * 14) + 1;
    const randomHours = Math.floor(Math.random() * 12) + 9; // Between 9 AM and 9 PM
    const randomMinutes = Math.random() < 0.5 ? 0 : 30; // Either on the hour or half hour
    
    const suggestedTime = new Date();
    suggestedTime.setDate(suggestedTime.getDate() + randomDays);
    suggestedTime.setHours(randomHours, randomMinutes, 0, 0);
    
    // Ensure it's not on a weekend if user has weekday classes
    const dayOfWeek = suggestedTime.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Move to next Monday if it's weekend
      const daysToAdd = dayOfWeek === 0 ? 1 : 2;
      suggestedTime.setDate(suggestedTime.getDate() + daysToAdd);
    }
    
    const newSuggestion: HangoutSuggestion = {
      id: uuidv4(),
      title: selectedActivity.name,
      description: selectedActivity.description,
      location: selectedActivity.location,
      suggestedTime: suggestedTime,
      duration: selectedActivity.duration,
      activity: selectedActivity.name,
      participants: user.buddies,
      status: 'pending',
      responses: {},
      createdBy: 'ai',
      createdAt: new Date()
    };
    
    await onUpdateSuggestions([...suggestions, newSuggestion]);
  };

  const handleResponse = async (suggestionId: string, response: 'accepted' | 'declined') => {
    if (response === 'declined') {
      // Remove the suggestion entirely when declined
      const updatedSuggestions = suggestions.filter(suggestion => suggestion.id !== suggestionId);
      await onUpdateSuggestions(updatedSuggestions);
      return;
    }

    // Handle acceptance
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
        
        let newStatus: 'pending' | 'accepted' | 'declined' | 'completed' = suggestion.status;
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
    
    await onUpdateSuggestions(updatedSuggestions);
  };

  const handleUnaccept = async (suggestionId: string) => {
    const updatedSuggestions = suggestions.map(suggestion => {
      if (suggestion.id === suggestionId) {
        // Remove user's response and set status back to pending
        const newResponses = { ...suggestion.responses };
        delete newResponses[user.id];
        
        return {
          ...suggestion,
          responses: newResponses,
          status: 'pending' as const
        };
      }
      return suggestion;
    });
    
    await onUpdateSuggestions(updatedSuggestions);
  };

  const handleCreateSuggestion = async () => {
    if (!selectedActivity || selectedBuddies.length === 0 || !suggestedDate || !suggestedTime) {
      return;
    }

    const suggestion: HangoutSuggestion = {
      id: uuidv4(),
      title: selectedActivity.name,
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

    await onUpdateSuggestions([...suggestions, suggestion]);
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
                      {new Date(suggestion.suggestedTime).toLocaleDateString()} at {new Date(suggestion.suggestedTime).toLocaleTimeString()}
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
                  
                  {suggestion.status === 'accepted' && (
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        startIcon={<Cancel />}
                        color="warning"
                        onClick={() => handleUnaccept(suggestion.id)}
                      >
                        Unaccept
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
