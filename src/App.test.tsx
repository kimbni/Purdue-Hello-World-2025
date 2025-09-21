import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

test('renders loading state initially', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const loadingElement = screen.getByText(/Loading/i);
  expect(loadingElement).toBeInTheDocument();
});
