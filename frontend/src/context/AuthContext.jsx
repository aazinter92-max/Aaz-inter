import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import useInactivityLogout from '../hooks/useInactivityLogout';
import { api, cachedFetch } from '../config/api';
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customAuthCheck = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          const res = await cachedFetch(api('/api/auth/me'), {
            headers: { Authorization: `Bearer ${parsedUser.token}` }
          });
          
          if (res.ok) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('user');
            localStorage.removeItem('aaz-cart');
            setUser(null);
          }
        } catch (err) {
          localStorage.removeItem('user');
          localStorage.removeItem('aaz-cart');
          setUser(null);
        }
      }
      setLoading(false);
    };
    customAuthCheck();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(api('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return { success: true };
      }
      return { success: false, message: data.message || data.error || 'Login failed' };
    } catch (error) {
      return { success: false, message: 'Server error. Please try again later.' };
    }
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      const response = await fetch(api('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, email: data.email, isVerified: data.isVerified };
      }
      return { success: false, message: data.message || data.error || 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Server connection error. Please try again later.' };
    }
  }, []);

  const verifyEmailByToken = useCallback(async (token) => {
    try {
      const response = await fetch(api(`/api/auth/verify-email/${token}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Verification failed' };
    } catch (error) {
      return { success: false, message: 'Server error. Please try again later.' };
    }
  }, []);

  const fetchSecurityQuestion = useCallback(async (email) => {
    try {
      const response = await fetch(api('/api/auth/forgot-password/question'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, question: data.question };
      }
      return { success: false, message: data.message || 'Error fetching question' };
    } catch (error) {
      return { success: false, message: 'Server error' };
    }
  }, []);

  const verifyAnswer = useCallback(async (email, answer) => {
    try {
      const response = await fetch(api('/api/auth/forgot-password/verify-answer'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answer }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, resetToken: data.resetToken };
      }
      return { success: false, message: data.message || 'Incorrect answer' };
    } catch (error) {
      return { success: false, message: 'Server error' };
    }
  }, []);

  const resetPasswordSec = useCallback(async (resetToken, password) => {
    try {
      const response = await fetch(api('/api/auth/forgot-password/reset'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, password }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true };
      }
      return { success: false, message: data.message || 'Reset failed' };
    } catch (error) {
      return { success: false, message: 'Server error' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('aaz-cart');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, []);

  const updateProfile = useCallback((updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  const resendVerificationEmail = useCallback(async () => {
    try {
      if (!user || !user.token) {
        return { success: false, message: 'Not authenticated' };
      }

      const response = await fetch(api('/api/auth/resend-verification'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, message: data.message || 'Verification email sent!' };
      }
      
      return { success: false, message: data.message || 'Failed to send verification email' };
    } catch (error) {
      return { success: false, message: 'Server error. Please try again.' };
    }
  }, [user]);


  useInactivityLogout(logout, 10 * 60 * 1000, !!user);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    signup,
    verifyEmailByToken,
    fetchSecurityQuestion,
    verifyAnswer,
    resetPasswordSec,
    logout,
    updateProfile,
    resendVerificationEmail,
    isAuthenticated: !!user
  }), [user, loading, login, signup, verifyEmailByToken, fetchSecurityQuestion, verifyAnswer, resetPasswordSec, logout, updateProfile, resendVerificationEmail]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

