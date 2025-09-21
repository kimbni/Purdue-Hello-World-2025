const express = require('express');
const { requiresAuth } = require('express-openid-connect');
const path = require('path');

const router = express.Router();

// Home route
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// Profile route - protected
router.get('/api/profile', requiresAuth(), function (req, res, next) {
  // This will be handled by the API routes, but we can add auth-specific logic here if needed
  next();
});

// Catch all handler for non-API routes - send React app
router.get('*', function (req, res, next) {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

module.exports = router;
