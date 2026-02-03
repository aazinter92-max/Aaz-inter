import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for auto-logout on user inactivity
 * @param {Function} onLogout - Function to call when user should be logged out
 * @param {number} timeout - Timeout in milliseconds (default: 10 minutes)
 * @param {boolean} isAuthenticated - Whether user is currently authenticated
 */
const useInactivityLogout = (onLogout, timeout = 10 * 60 * 1000, isAuthenticated = false) => {
  const timeoutId = useRef(null);
  const warningTimeoutId = useRef(null);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
    if (warningTimeoutId.current) {
      clearTimeout(warningTimeoutId.current);
      warningTimeoutId.current = null;
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    clearTimers();
    console.log('🔒 Auto-logout: User inactive for 10 minutes');
    
    // Show alert
    alert('You have been logged out due to inactivity for security reasons.');
    
    // Call the logout function (which will handle navigation)
    if (onLogout) {
      onLogout();
    }
  }, [onLogout, clearTimers]);

  // Show warning (2 minutes before logout)
  const showWarning = useCallback(() => {
    console.log('⚠️ Warning: You will be logged out in 2 minutes due to inactivity');
    
    const shouldStay = window.confirm(
      'You will be logged out in 2 minutes due to inactivity. Click OK to stay logged in.'
    );
    
    if (shouldStay) {
      // Reset the timer if user chooses to stay
      resetTimer();
    }
  }, []);

  // Reset the inactivity timer
  const resetTimer = useCallback(() => {
    // Only reset if user is authenticated
    if (!isAuthenticated) return;

    clearTimers();

    // Set warning timer (8 minutes - 2 minutes before logout)
    warningTimeoutId.current = setTimeout(showWarning, timeout - 2 * 60 * 1000);

    // Set logout timer (10 minutes)
    timeoutId.current = setTimeout(handleLogout, timeout);
  }, [isAuthenticated, timeout, handleLogout, showWarning, clearTimers]);

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) {
      clearTimers();
      return;
    }

    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Reset timer on any activity
    const handleActivity = () => {
      resetTimer();
    };

    // Initialize timer
    resetTimer();

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      clearTimers();
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, resetTimer, clearTimers]);

  return { resetTimer };
};

export default useInactivityLogout;

