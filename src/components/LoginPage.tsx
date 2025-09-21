import React from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    login();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" mb={4}>
          <img 
            src="/logo.png" 
            alt="SyncUp Logo" 
            style={{ height: '120px', width: '120px', marginBottom: '20px' }} 
          />
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            color: '#775287',
            fontFamily: '"Quicksand", "Inter", sans-serif',
            fontWeight: 'bold'
          }}>
            SyncUp
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', fontFamily: '"Inter", sans-serif', mb: 2 }}>
            Sync schedules, meet Up
          </Typography>
        </Box>

        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom sx={{ 
              color: '#775287',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 'bold'
            }}>
              Welcome to SyncUp!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
              Connect with fellow students, share your interests, and find the perfect hangout buddies.
            </Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>
              Please sign in to access your personalized dashboard and start connecting.
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleLogin}
              sx={{
                backgroundColor: '#775287',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#603275',
                }
              }}
            >
              Sign In
            </Button>
          </CardActions>
        </Card>

        <Box textAlign="center">
          <Typography variant="body2" sx={{ color: '#999', fontSize: '0.9rem' }}>
            Secure authentication powered by Auth0
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;