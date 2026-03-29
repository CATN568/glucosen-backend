const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const glucoseRoutes = require('./routes/glucose');
const mealRoutes = require('./routes/meals');
const insulinRoutes = require('./routes/insulin');
const exerciseRoutes = require('./routes/exercise');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware de sécurité
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Routes de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes principales
app.use('/api/auth', authRoutes);
app.use('/api/glucose', glucoseRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/insulin', insulinRoutes);
app.use('/api/exercise', exerciseRoutes);

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
