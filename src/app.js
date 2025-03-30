const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./config/database');
const i18nMiddleware = require('./middlewares/i18n');

// Import routes
const routes = require('./routes');

// Initialize Express
const app = express();

// Connect to MongoDB
dbConnection().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Failed to initialize database', err);
  process.exit(1);
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nMiddleware); // Add i18n middleware

// Routes
app.use('/api', routes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app; 