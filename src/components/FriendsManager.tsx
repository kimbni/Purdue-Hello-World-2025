import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Grid
} from '@mui/material';
import { Add, Delete, Person, Email } from '@mui/icons-material';
import { User } from '../types';

interface FriendsManagerProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const FriendsManager: React.FC<FriendsManagerProps> = ({ user, onUpdateUser }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Mock friends data - in a real app, this would come from a database
  const friendsData = {
    '2': { name: 'Sarah Chen', email: 'sarah@example.com', status: 'online' },
    '3': { name: 'Mike Rodriguez', email: 'mike@example.com', status: 'offline' },
    '4': { name: 'Emma Wilson', email: 'emma@example.com', status: 'online' }
  };

  const handleAddFriend = () => {
    if (!email.trim()) {
      setMessage('Please enter an email address');
      return;
    }

    // In a real app, this would send an invitation
    setMessage(`Invitation sent to ${email}!`);
    setEmail('');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRemoveFriend = (friendId: string) => {
    onUpdateUser({
      ...user,
      friends: user.friends.filter(id => id !== friendId)
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'success' : 'default';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Friends</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Friend
        </Button>
      </Box>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={2}>
        {user.friends.map((friendId) => {
          const friend = friendsData[friendId as keyof typeof friendsData];
          if (!friend) return null;

          return (
            <Grid item xs={12} md={6} key={friendId}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Person color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">{friend.name}</Typography>
                    <Chip
                      label={friend.status}
                      color={getStatusColor(friend.status) as any}
                      size="small"
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={2}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {friend.email}
                    </Typography>
                  </Box>
                  
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleRemoveFriend(friendId)}
                  >
                    Remove Friend
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {user.friends.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" color="text.secondary">
              No friends yet
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Add friends by their email address to start planning hangouts together!
            </Typography>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Friend's Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your friend's email address"
            sx={{ mt: 2 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            We'll send them an invitation to join your hangout planning group.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddFriend} variant="contained">
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FriendsManager;
