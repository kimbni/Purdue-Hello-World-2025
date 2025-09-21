import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box,
  Card,
  CardContent,
  CardActions,
  CircularProgress // Import CircularProgress for loading state
} from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";

const LoginPage: React.FC = () => {
  // Destructure isLoading, error, and loginWithRedirect for more control
  const { loginWithRedirect, isLoading, error } = useAuth0();

  // Local state to manage the button's loading state after a click
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handler to set loading state before redirecting
  const handleLogin = async () => {
    setIsRedirecting(true);
    await loginWithRedirect();
    // Note: The user will be redirected, so setIsRedirecting(false) is not strictly necessary.
  };

  // 1. Handle SDK Initial Loading State ⏳
  // Shows a spinner while the Auth0 provider is initializing
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. Handle Authentication Errors ❗
  // Displays an error message if something went wrong
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Authentication Error</Typography>
        <Typography color="error" sx={{ mt: 2 }}>Oops... {error.message}</Typography>
      </Container>
    );
  }

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
              disabled={isRedirecting} // Disable button when redirecting
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
                },
                position: 'relative', // Needed for spinner positioning
              }}
            >
              {isRedirecting ? 'Redirecting...' : 'Sign In'}
              {isRedirecting && ( // 3. Show a spinner on the button itself
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
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