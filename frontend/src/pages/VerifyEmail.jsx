import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import './Login.css'; // Reuse Login styles for consistency

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams();
  const { verifyEmailByToken } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('registered')) {
      setRegistered(true);
    }

    if (token) {
      handleAutoVerify(token);
    }
  }, [token, location]);

  const handleAutoVerify = async (verifyToken) => {
    setLoading(true);
    setError('');
    const result = await verifyEmailByToken(verifyToken);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-split-container centered-single-col">
          <div className="auth-form-container success-container">
            <div className="success-icon-wrapper">
              <ShieldCheck size={64} className="text-green-500" />
            </div>
            <h1>Email Verified!</h1>
            <p>Your account has been successfully verified.</p>
            <Button 
                onClick={() => navigate('/login')}
                variant="primary"
                className="mt-4"
            >
                Continue to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (registered && !token) {
    return (
      <div className="auth-page">
        <div className="auth-split-container">
           <div className="auth-brand-panel signup-variant">
            <div className="brand-content">
              <span className="section-label">REGISTRATION SUCCESSful</span>
              <h1>Check Your Email</h1>
              <p className="tagline">We've sent a verification link to your email address.</p>
            </div>
          </div>
          <div className="auth-form-side">
            <div className="auth-form-container">
              <div className="auth-header-minimal">
                <Mail size={48} className="text-primary mb-4" />
                <h1>Verify Your Account</h1>
                <p>Please click the link in the email we sent you to activate your account.</p>
              </div>
              <p className="mb-6 text-gray-600">You can close this window now or return to login after verification.</p>
              <Button 
                onClick={() => navigate('/login')}
                variant="outline" 
                fullWidth 
              >
                Return to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-split-container">
         <div className="auth-brand-panel login-variant">
          <div className="brand-content">
            <span className="section-label">SECURITY</span>
            <h1>Verifying Account</h1>
            <p className="tagline">Processing your email verification request...</p>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-form-container text-center">
            {loading ? (
              <div className="loading-state">
                <div className="spinner mb-4"></div>
                <p>Validating your token...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <div className="auth-error-flat">{error}</div>
                <p className="mb-6">The link might be expired or invalid.</p>
                <Button onClick={() => navigate('/signup')} variant="primary">Try Registering Again</Button>
              </div>
            ) : (
              <div>
                <h1>Email Verification</h1>
                <p>Please use the link sent to your email.</p>
                <Button onClick={() => navigate('/login')} variant="outline" className="mt-4">Back to Login</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
