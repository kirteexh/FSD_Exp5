const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const errorHandler = require('./middleware/errorMiddleware');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas / Local Database
connectDB();

// Middleware Configuration
app.use(cors()); // Allow Cross-Origin requests from React frontend
app.use(express.json()); // Parse JSON request bodies

// Root endpoint - Health check and API documentation
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Event Management API with MongoDB & Mongoose',
    experiment: 'FSD Experiment 5',
    author: 'Kirteesh D. Rakshe (D15A - 43)',
    database: 'MongoDB Atlas / Local MongoDB',
    status: 'Connected & Active',
    endpoints: {
      'GET    /api/events': 'Retrieve all events from MongoDB',
      'GET    /api/events/:id': 'Retrieve a single event by MongoDB ObjectId',
      'POST   /api/events': 'Create a new event document in MongoDB',
      'PUT    /api/events/:id': 'Update an existing event document by ObjectId',
      'DELETE /api/events/:id': 'Remove an event document from MongoDB'
    }
  });
});

// Mount Event API Routes
app.use('/api/events', eventRoutes);

// 404 Catch-All Handler for Undefined Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint '${req.originalUrl}' not found on this server`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints available at http://localhost:${PORT}/api/events`);
});

