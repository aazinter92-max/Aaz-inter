// WhatsApp Integration
export const sendWhatsAppMessage = (message = '') => {
  const phoneNumber = '923453450644'; // AAZ International WhatsApp number
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

// Predefined WhatsApp Messages
export const whatsappMessages = {
  generalInquiry: () => 
    `Hello AAZ International Enterprises,\n\nI would like to inquire about your medical products and services.\n\nThank you.`,
  
  productInquiry: (productName) => 
    `Hello AAZ International Enterprises,\n\nI am interested in: ${productName}\n\nCould you please provide more information about pricing and availability?\n\nThank you.`,
  
  orderInquiry: (orderId) => 
    `Hello AAZ International Enterprises,\n\nI would like to inquire about my order #${orderId}.\n\nThank you.`,
  
  bulkOrder: (category) => 
    `Hello AAZ International Enterprises,\n\nI am interested in placing a bulk order for ${category}.\n\nPlease contact me with more details.\n\nThank you.`,
};

// Scroll to top utility
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Pakistan format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('92')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+92${cleaned.substring(1)}`;
  }
  return `+92${cleaned}`;
};

// Generate order ID
export const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `AAZ-${timestamp}-${randomStr}`.toUpperCase();
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
