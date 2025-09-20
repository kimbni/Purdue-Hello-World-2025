import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  IconButton,
  Grid,
  Divider
} from '@mui/material';
import { Add, Delete, Favorite, SportsEsports } from '@mui/icons-material';
import { User } from '../types';

interface InterestsManagerProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const COMMON_INTERESTS = [
  'Gaming', 'Movies', 'Music', 'Sports', 'Art', 'Photography', 'Cooking',
  'Reading', 'Travel', 'Fitness', 'Coffee', 'Technology', 'Fashion',
  'Dancing', 'Hiking', 'Swimming', 'Basketball', 'Soccer', 'Tennis'
];

const COMMON_HOBBIES = [
  'Photography', 'Cooking', 'Painting', 'Writing', 'Gardening', 'Knitting',
  'Board Games', 'Video Games', 'Playing Instruments', 'Singing', 'Dancing',
  'Yoga', 'Meditation', 'Collecting', 'DIY Projects', 'Language Learning'
];

const InterestsManager: React.FC<InterestsManagerProps> = ({ user, onUpdateUser }) => {
  const [newInterest, setNewInterest] = useState('');
  const [newHobby, setNewHobby] = useState('');

  const addInterest = () => {
    if (newInterest.trim() && !user.interests.includes(newInterest.trim())) {
      onUpdateUser({
        ...user,
        interests: [...user.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    onUpdateUser({
      ...user,
      interests: user.interests.filter(i => i !== interest)
    });
  };

  const addHobby = () => {
    if (newHobby.trim() && !user.hobbies.includes(newHobby.trim())) {
      onUpdateUser({
        ...user,
        hobbies: [...user.hobbies, newHobby.trim()]
      });
      setNewHobby('');
    }
  };

  const removeHobby = (hobby: string) => {
    onUpdateUser({
      ...user,
      hobbies: user.hobbies.filter(h => h !== hobby)
    });
  };

  const addCommonInterest = (interest: string) => {
    if (!user.interests.includes(interest)) {
      onUpdateUser({
        ...user,
        interests: [...user.interests, interest]
      });
    }
  };

  const addCommonHobby = (hobby: string) => {
    if (!user.hobbies.includes(hobby)) {
      onUpdateUser({
        ...user,
        hobbies: [...user.hobbies, hobby]
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Interests & Hobbies
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Tell us about your interests and hobbies so we can suggest better hangout activities!
      </Typography>

      <Grid container spacing={3}>
        {/* Interests Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Favorite color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Your Interests</Typography>
              </Box>
              
              <Box display="flex" gap={1} mb={2}>
                <TextField
                  size="small"
                  placeholder="Add new interest..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                />
                <Button
                  variant="contained"
                  onClick={addInterest}
                  disabled={!newInterest.trim()}
                >
                  Add
                </Button>
              </Box>

              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {user.interests.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    onDelete={() => removeInterest(interest)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Quick Add:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {COMMON_INTERESTS
                  .filter(interest => !user.interests.includes(interest))
                  .slice(0, 8)
                  .map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      onClick={() => addCommonInterest(interest)}
                      variant="outlined"
                      size="small"
                    />
                  ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Hobbies Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SportsEsports color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Your Hobbies</Typography>
              </Box>
              
              <Box display="flex" gap={1} mb={2}>
                <TextField
                  size="small"
                  placeholder="Add new hobby..."
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHobby()}
                />
                <Button
                  variant="contained"
                  onClick={addHobby}
                  disabled={!newHobby.trim()}
                >
                  Add
                </Button>
              </Box>

              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {user.hobbies.map((hobby) => (
                  <Chip
                    key={hobby}
                    label={hobby}
                    onDelete={() => removeHobby(hobby)}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Quick Add:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {COMMON_HOBBIES
                  .filter(hobby => !user.hobbies.includes(hobby))
                  .slice(0, 8)
                  .map((hobby) => (
                    <Chip
                      key={hobby}
                      label={hobby}
                      onClick={() => addCommonHobby(hobby)}
                      variant="outlined"
                      size="small"
                    />
                  ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InterestsManager;
