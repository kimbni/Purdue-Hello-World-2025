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
import { Add, Delete, Favorite, School } from '@mui/icons-material';
import { User } from '../types';

interface InfoManagerProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const COMMON_INTERESTS = [
  'Gaming', 'Movies', 'Music', 'Sports', 'Art', 'Photography', 'Cooking',
  'Reading', 'Travel', 'Fitness', 'Coffee', 'Technology', 'Fashion',
  'Dancing', 'Hiking', 'Swimming', 'Basketball', 'Soccer', 'Tennis',
  'Painting', 'Writing', 'Gardening', 'Knitting', 'Board Games', 'Video Games', 
  'Playing Instruments', 'Singing', 'Yoga', 'Meditation', 'Collecting', 
  'DIY Projects', 'Language Learning'
];

const COMMON_MAJORS = [
  'Computer Science', 'Mathematics', 'Engineering', 'Business', 'Psychology',
  'Biology', 'Chemistry', 'Physics', 'English', 'History', 'Art', 'Music',
  'Economics', 'Political Science', 'Sociology', 'Philosophy', 'Education',
  'Nursing', 'Medicine', 'Law', 'Architecture', 'Communications', 'Marketing'
];

const InfoManager: React.FC<InfoManagerProps> = ({ user, onUpdateUser }) => {
  const [newInterest, setNewInterest] = useState('');
  const [newMajor, setNewMajor] = useState('');

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

  const addMajor = () => {
    if (newMajor.trim() && !user.majors.includes(newMajor.trim())) {
      onUpdateUser({
        ...user,
        majors: [...user.majors, newMajor.trim()]
      });
      setNewMajor('');
    }
  };

  const removeMajor = (major: string) => {
    onUpdateUser({
      ...user,
      majors: user.majors.filter(m => m !== major)
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

  const addCommonMajor = (major: string) => {
    if (!user.majors.includes(major)) {
      onUpdateUser({
        ...user,
        majors: [...user.majors, major]
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Personal Info
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Tell us about your interests, hobbies, and academic majors so we can suggest better hangout activities and connect you with like-minded buddies!
      </Typography>

      <Grid container spacing={3}>
        {/* Interests & Hobbies Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Favorite color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Your Interests & Hobbies</Typography>
              </Box>
              
              <Box display="flex" gap={1} mb={2}>
                <TextField
                  size="small"
                  placeholder="Add new interest or hobby..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  fullWidth
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
                  .slice(0, 12)
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

        {/* Majors Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <School color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Your Majors</Typography>
              </Box>
              
              <Box display="flex" gap={1} mb={2}>
                <TextField
                  size="small"
                  placeholder="Add new major..."
                  value={newMajor}
                  onChange={(e) => setNewMajor(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMajor()}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={addMajor}
                  disabled={!newMajor.trim()}
                >
                  Add
                </Button>
              </Box>

              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {user.majors.map((major) => (
                  <Chip
                    key={major}
                    label={major}
                    onDelete={() => removeMajor(major)}
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
                {COMMON_MAJORS
                  .filter(major => !user.majors.includes(major))
                  .slice(0, 12)
                  .map((major) => (
                    <Chip
                      key={major}
                      label={major}
                      onClick={() => addCommonMajor(major)}
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

export default InfoManager;
