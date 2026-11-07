const mongoose = require('mongoose');
const Event = require('../models/Event');

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid event ID format: '${id}'. Must be a 24-character hexadecimal MongoDB ObjectId`
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with ID '${id}' not found in MongoDB`
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Public
 */
const createEvent = async (req, res, next) => {
  try {
    const { name, date, location, description, capacity, registered } = req.body;

    // Manual pre-validation for required fields to provide clear user messages
    if (!name || !date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. Event name, date, and location are mandatory.'
      });
    }

    // Persist new document in MongoDB using Mongoose model
    const newEvent = await Event.create({
      name,
      date,
      location,
      description: description || '',
      capacity: capacity !== undefined ? Number(capacity) : 100,
      registered: registered !== undefined ? Number(registered) : 0
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully in MongoDB',
      data: newEvent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update existing event by ID
 * @route   PUT /api/events/:id
 * @access  Public
 */
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid event ID format: '${id}'. Must be a 24-character hexadecimal MongoDB ObjectId`
      });
    }

    // Update document with new values, returning the updated document and running schema validators
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // Return modified document rather than original
        runValidators: true // Enforce schema validation on update
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: `Event with ID '${id}' not found in MongoDB`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully in MongoDB',
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete event by ID
 * @route   DELETE /api/events/:id
 * @access  Public
 */
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid event ID format: '${id}'. Must be a 24-character hexadecimal MongoDB ObjectId`
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: `Event with ID '${id}' not found in MongoDB`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully from MongoDB',
      data: deletedEvent
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};

