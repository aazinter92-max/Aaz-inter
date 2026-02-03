const Counter = require('../models/Counter');

/**
 * Generate Sequential Order Number
 * Format: AAZ-YEAR-SEQUENCE
 * Example: AAZ-2026-000001
 * 
 * @returns {Promise<string>} Generated order number
 */
const generateOrderNumber = async () => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Get next sequence number atomically
    const sequence = await Counter.getNextSequence(currentYear);
    
    // Format sequence with leading zeros (6 digits)
    const paddedSequence = String(sequence).padStart(6, '0');
    
    // Generate order number: AAZ-YEAR-SEQUENCE
    const orderNumber = `AAZ-${currentYear}-${paddedSequence}`;
    
    console.log(`✅ Generated Order Number: ${orderNumber}`);
    
    return orderNumber;
  } catch (error) {
    console.error('❌ Error generating order number:', error);
    throw new Error('Failed to generate order number');
  }
};

/**
 * Format Order Number for Display
 * If orderNumber exists, use it. Otherwise, fallback to MongoDB _id
 * 
 * @param {Object} order - Order object
 * @returns {string} Formatted order number or ID
 */
const getDisplayOrderNumber = (order) => {
  if (order.orderNumber) {
    return order.orderNumber;
  }
  // Fallback for legacy orders without orderNumber
  return `#${order._id.toString().substring(order._id.toString().length - 8).toUpperCase()}`;
};

module.exports = {
  generateOrderNumber,
  getDisplayOrderNumber
};
