const mongoose = require('mongoose');

/**
 * Event Schema Definition
 * Represents an event document in MongoDB with validation rules
 */
const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      minlength: [3, 'Event name must be at least 3 characters'],
      maxlength: [100, 'Event name cannot exceed 100 characters']
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
      minlength: [2, 'Location must be at least 2 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      default: 100
    },
    registered: {
      type: Number,
      min: [0, 'Registered attendees cannot be negative'],
      default: 0
    }
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    versionKey: false // Omit the __v field for cleaner JSON responses
  }
);

// Virtual property to support both `id` and `_id` in frontend responses
eventSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

