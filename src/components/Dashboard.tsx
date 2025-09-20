import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Schedule, 
  Favorite, 
  Group, 
  Lightbulb,
  CheckCircle,
  Cancel,
  School
} from '@mui/icons-material';
import { User, HangoutSuggestion } from '../types';

interface DashboardProps {
  user: User;
  suggestions: HangoutSuggestion[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, suggestions }) => {
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const upcomingClasses = user.schedule.filter(c => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return c.dayOfWeek === dayOfWeek;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🎉 Welcome back, {user.name}!
      </Typography>
      
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Schedule color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Classes Today</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {upcomingClasses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Favorite color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Interests</Typography>
              </Box>
              <Typography variant="h3" color="secondary">
                {user.interests.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <School color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Majors</Typography>
              </Box>
              <Typography variant="h3" color="info.main">
                {user.majors.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Group color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Buddies</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {user.buddies.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Lightbulb color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Pending</Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {pendingSuggestions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Classes
              </Typography>
              {upcomingClasses.length > 0 ? (
                <List>
                  {upcomingClasses.map((classItem) => (
                    <ListItem key={classItem.id}>
                      <ListItemIcon>
                        <Schedule />
                      </ListItemIcon>
                      <ListItemText
                        primary={classItem.name}
                        secondary={`${classItem.startTime} - ${classItem.endTime} • ${classItem.location}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No classes scheduled for today!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Interests */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Interests & Hobbies
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {user.interests.map((interest) => (
                  <Chip key={interest} label={interest} color="primary" variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Majors */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Majors
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {user.majors.map((major) => (
                  <Chip key={major} label={major} color="secondary" variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Suggestions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Hangout Suggestions
              </Typography>
              {pendingSuggestions.length > 0 ? (
                <List>
                  {pendingSuggestions.map((suggestion) => (
                    <ListItem key={suggestion.id}>
                      <ListItemIcon>
                        <Lightbulb color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={suggestion.title}
                        secondary={`${suggestion.activity} at ${suggestion.location} • ${suggestion.suggestedTime.toLocaleDateString()}`}
                      />
                      <Box>
                        <Button
                          size="small"
                          startIcon={<CheckCircle />}
                          color="success"
                          sx={{ mr: 1 }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Cancel />}
                          color="error"
                        >
                          Decline
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No pending suggestions at the moment.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
