const express = require('express');
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);

router.get('/status', (req, res) => {
  res.status(200).json({ status: 'online' });
});

module.exports = router; 