import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Lock } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import './Login.css';
const ForgotPassword = () => {
  const navigate = useNavigate();
  const { fetchSecurityQuestion, verifyAnswer } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Email, 2: Question
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Submit Email to get Question
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    const result = await fetchSecurityQuestion(email);
    setLoading(false);

    if (result.success) {
      setQuestion(result.question);
      setStep(2);
    } else {
      setError('Invalid request. Please try again.');
    }
  };

  // Step 2: Submit Answer to get Reset Token
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answer) {
      setError('Please enter your answer');
      return;
    }

    setLoading(true);
    setError('');
    const result = await verifyAnswer(email, answer);
    setLoading(false);

    if (result.success) {
      // Navigate to Reset Password page with the temporary token
      navigate(`/reset-password/${result.resetToken}`);
    } else {
      setError('Invalid answer. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-centered-box">
        <div className="auth-header-minimal">
          <h1>Recover Access</h1>
          <p>{step === 1 ? 'Enter your email to retrieve your security question' : 'Answer your security question to reset password'}</p>
        </div>

        {step === 1 ? (
          <form className="auth-form" onSubmit={handleEmailSubmit}>
            {error && <div className="auth-error-flat">{error}</div>}
            <div className="form-group-modern">
              <label htmlFor="email">Work Email</label>
              <div className="input-modern-group">
                <Mail size={18} className="input-icon-modern" />
                <input
                  type="email"
                  id="email"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <Button type="submit" variant="primary" fullWidth loading={loading} className="auth-submit-btn">
              Show Security Question
            </Button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleAnswerSubmit}>
            {error && <div className="auth-error-flat">{error}</div>}
            
            <div className="form-group-modern">
               <div className="security-question-box" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--user-primary)', marginBottom: '10px' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--user-text-muted)', marginBottom: '5px', textAlign: 'left' }}>YOUR SECURITY QUESTION:</p>
                  <p style={{ fontWeight: '700', color: 'var(--user-text-dark)', textAlign: 'left', fontSize: '1.05rem' }}>{question}</p>
               </div>
            </div>

            <div className="form-group-modern">
              <label htmlFor="answer">Your Secret Answer</label>
              <div className="input-modern-group">
                <Lock size={18} className="input-icon-modern" />
                <input
                  type="text"
                  id="answer"
                  placeholder="Enter your security answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>
            <Button type="submit" variant="primary" fullWidth loading={loading} className="auth-submit-btn">
              Verify Answer
            </Button>
            <Button type="button" variant="outline" fullWidth onClick={() => setStep(1)} disabled={loading} style={{ marginTop: '10px' }}>
               Use Different Email
            </Button>
          </form>
        )}

        <div className="auth-footer-minimal">
          <Link to="/login" className="auth-link-bold" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ArrowLeft size={18} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
