const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Route: /api/events
router
  .route('/')
  .get(getAllEvents)   // GET all events
  .post(createEvent);  // POST create a new event

// Route: /api/events/:id
router
  .route('/:id')
  .get(getEventById)   // GET event by MongoDB ObjectId
  .put(updateEvent)    // PUT update event by MongoDB ObjectId
  .delete(deleteEvent);// DELETE event by MongoDB ObjectId

module.exports = router;

