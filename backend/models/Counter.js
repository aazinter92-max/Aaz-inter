const mongoose = require('mongoose');

/**
 * Counter Model for Sequential Order Numbers
 * Ensures atomic increments and prevents duplicate order numbers
 */
const counterSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true 
  },
  year: {
    type: Number,
    required: true
  },
  sequence: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Static method to get next sequence number atomically
counterSchema.statics.getNextSequence = async function(year) {
  const counter = await this.findOneAndUpdate(
    { _id: 'orderNumber', year: year },
    { $inc: { sequence: 1 } },
    { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true 
    }
  );
  
  return counter.sequence;
};

module.exports = mongoose.model('Counter', counterSchema);
