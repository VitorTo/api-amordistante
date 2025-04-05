const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');

// Define all routes
router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);

// API health/status route
router.get('/status', (req, res) => {
  res.status(200).json({ status: 'online' });
});

module.exports = router; 