import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ClipboardCheck, Hospital, Globe } from 'lucide-react';
import Button from '../components/common/Button';
import './Login.css';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showOTP) {
        handleVerify(e);
        return;
    }
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setShowOTP(true);
        setError('');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleVerify = async (e) => {
      e.preventDefault();
      try {
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, otp })
          });
          const data = await response.json();
          if (response.ok) {
              setSuccess('Account verified successfully! Redirecting...');
              setTimeout(() => navigate('/login'), 1500); 
          } else {
              setError(data.message || 'Verification failed');
          }
      } catch (err) {
          setError('Network error');
      }
  };

  return (
    <div className="auth-page">
      <div className="auth-split-container">
        {/* Left Information Panel */}
        <div className="auth-brand-panel signup-variant">
          <div className="brand-content">
            <span className="section-label">ONBOARDING</span>
            <h1>AAZ</h1>
            <p className="tagline">Scale your procurement with direct access to global medical supply chains.</p>
            
            <div className="partnership-benefits">
              <span className="benefit-title">Why partner with AAZ?</span>
              <div className="trust-points">
                <div className="trust-item">
                  <div className="point-icon"><Hospital size={20} /></div>
                  <div className="trust-text">
                    <strong>Institutional Trust</strong>
                    <span>Verified by 500+ Healthcare Facilities</span>
                  </div>
                </div>
                <div className="trust-item">
                  <div className="point-icon"><ClipboardCheck size={20} /></div>
                  <div className="trust-text">
                    <strong>Standard Compliance</strong>
                    <span>ISO Certified Equipment Logistics</span>
                  </div>
                </div>
                <div className="trust-item">
                  <div className="point-icon"><Globe size={20} /></div>
                  <div className="trust-text">
                    <span>Direct Factory Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <div className="auth-header-minimal">
              <h1>Create Account</h1>
              <p>Register your healthcare organization</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <div className="auth-error-flat">{error}</div>}
              {success && <div className="auth-success-flat">{success}</div>}

              {!showOTP ? (
                <>
                  <div className="form-group-modern">
                    <label htmlFor="name">Full Name / Representative</label>
                    <div className="input-modern-group">
                      <User size={18} className="input-icon-modern" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group-modern">
                    <label htmlFor="email">Work Email</label>
                    <div className="input-modern-group">
                      <Mail size={18} className="input-icon-modern" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="name@organization.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group-modern">
                    <label htmlFor="password">Security Password</label>
                    <div className="input-modern-group">
                      <Lock size={18} className="input-icon-modern" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button type="button" className="password-toggle-modern" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group-modern">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-modern-group">
                      <Lock size={18} className="input-icon-modern" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="primary" fullWidth className="auth-submit-btn">
                    Register Institution
                  </Button>
                </>
              ) : (
                <div className="verification-step">
                  <div className="form-group-modern" style={{ textAlign: 'center' }}>
                    <label>Verification Code</label>
                    <p style={{ fontSize: '0.85rem', color: '#78909c', marginBottom: '1.5rem' }}>
                      Security check: Enter the 6-digit code sent to your professional email.
                    </p>
                    <div className="input-modern-group">
                      <input
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength="6"
                        className="otp-input-modern"
                      />
                    </div>
                    <Button type="submit" variant="primary" fullWidth style={{ marginTop: '2rem' }}>
                      Verify & Complete
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <div className="auth-footer-minimal">
              <p>
                Already registered? 
                <Link to="/login" className="auth-link-bold">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
