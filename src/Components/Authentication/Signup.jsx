import React, { useState } from 'react';
import './Signup.css';
import Navbar from '../Layout/Navbar';
import DecarbonizeLogo from '../../assets/Decarbonize-Logo.png';
import { authHelpers } from '../../config/firebase';

// Google Icon SVG
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('Mine Operator');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    // Basic Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      setIsLoading(false);
      return;
    }

    // Firebase Sign Up
    const { user, error: authError } = await authHelpers.signUpWithEmail(email, password, fullName);

    if (authError) {
      // Handle specific Firebase error messages
      if (authError.includes('email-already-in-use')) {
        setError('This email is already registered. Please sign in instead.');
      } else if (authError.includes('invalid-email')) {
        setError('Invalid email address.');
      } else if (authError.includes('weak-password')) {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError('Sign up failed. Please try again.');
      }
      setIsLoading(false);
    } else if (user) {
      // Successfully signed up
      console.log('New user signed up:', { fullName, companyName, role, email, uid: user.uid });
      setSuccess(true);
      setIsLoading(false);
      
      // Optional: Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');
    
    // Firebase Google Sign Up
    const { user, error: authError } = await authHelpers.signInWithGoogle();

    if (authError) {
      if (authError.includes('popup-closed-by-user')) {
        setError('Sign-up cancelled. Please try again.');
      } else if (authError.includes('popup-blocked')) {
        setError('Pop-up blocked. Please allow pop-ups and try again.');
      } else {
        setError('Google sign-up failed. Please try again.');
      }
      setIsLoading(false);
    } else if (user) {
      // Successfully signed up with Google
      console.log('New user signed up with Google:', { email: user.email, uid: user.uid });
      setSuccess(true);
      setIsLoading(false);
      
      // Optional: Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    }
  };

  return (
    <>
      <Navbar user={null} />
      <div className="auth-page">
        <div className="auth-container">
          {/* Left Side - Branding */}
          <div className="auth-brand-section">
            <div className="brand-content">
              <div className="brand-logo">
                <img src={DecarbonizeLogo} alt="Decarbonize" className="logo-img" />
                <div className="logo-glow"></div>
              </div>
              <h1 className="brand-title">Join Decarbonize</h1>
              <p className="brand-subtitle">Transform your mining operations with cutting-edge carbon management technology</p>
              
              <div className="features-preview">
                <div className="feature-item">
                  <div className="feature-icon">🔒</div>
                  <span>Enterprise-grade Security</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <span>Real-time Analytics</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🌍</div>
                  <span>Global Compliance Support</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📈</div>
                  <span>ROI Optimization</span>
                </div>
              </div>
            </div>
            <div className="brand-background">
              <div className="floating-particle"></div>
              <div className="floating-particle"></div>
              <div className="floating-particle"></div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="auth-form-section">
            <div className="auth-form-container">
              {success ? (
                <div className="success-container">
                  <div className="success-icon">🎉</div>
                  <h2>Welcome to Decarbonize!</h2>
                  <p>Your account has been created successfully. Please check your email to verify your account.</p>
                  <a href="/login" className="login-redirect-btn">Continue to Login</a>
                </div>
              ) : (
                <>
                  <div className="auth-header">
                    <h2>Create Your Account</h2>
                    <p>Start your journey towards sustainable mining</p>
                  </div>

                  {/* Google Signup Button */}
                  <button 
                    type="button" 
                    className="google-auth-btn"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                  >
                    <GoogleIcon />
                    <span>{isLoading ? 'Creating account...' : 'Sign up with Google'}</span>
                  </button>

                  <div className="auth-divider">
                    <span>or create account with email</span>
                  </div>

                  <form onSubmit={handleSignup} className="auth-form">
                    <div className="form-row form-row-double">
                      <div className="input-group">
                        <label htmlFor="fullName">Full Name</label>
                        <div className="input-wrapper">
                          <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Enter your full name"
                            className="form-input no-icon"
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label htmlFor="companyName">Company Name</label>
                        <div className="input-wrapper">
                          <input
                            type="text"
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                            placeholder="Enter company name"
                            className="form-input no-icon"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row form-row-double">
                      <div className="input-group">
                        <label htmlFor="role">Your Role</label>
                        <div className="input-wrapper">
                          <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="form-select no-icon"
                          >
                            <option value="Mine Operator">Mine Operator</option>
                            <option value="Verifier">Verifier</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                      </div>
                      <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            className="form-input no-icon"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row form-row-double">
                      <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Create password"
                            className="form-input with-toggle"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                          </button>
                        </div>
                        <div className="password-strength">
                          <div className={`strength-bar ${password.length >= 8 ? 'active' : ''}`}></div>
                          <span className="strength-text">Minimum 8 characters</span>
                        </div>
                      </div>
                      <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-wrapper">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm password"
                            className="form-input with-toggle"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="form-terms">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        I agree to the <a href="#terms" className="terms-link">Terms of Service</a> and <a href="#privacy" className="terms-link">Privacy Policy</a>
                      </label>
                    </div>

                    {error && (
                      <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                      </div>
                    )}

                    <button type="submit" className="auth-submit-btn" disabled={isLoading || !acceptTerms}>
                      {isLoading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </form>

                  <div className="auth-footer">
                    <p>Already have an account? <a href="/login" className="login-link">Sign in here</a></p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;