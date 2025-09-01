import React, { useState } from 'react';
import './Login.css';
import DecarbonizeLogo from '../../assets/Decarbonize-Logo.png';

// Google Icon SVG
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'admin@decarbonize.com' && password === 'password') {
        onLoginSuccess({ role: 'Admin', name: 'Mohit', email });
      } else if (email === 'operatormine@decarbonize.com' && password === 'password') {
        onLoginSuccess({ role: 'Mine Operator', name: 'Aarushi', email });
      } else if (email === 'verifier@decarbonize.com' && password === 'password') {
        onLoginSuccess({ role: 'Verifier', name: 'Priya', email });
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError('');
    
    // Simulate Google OAuth flow
    setTimeout(() => {
      onLoginSuccess({ 
        role: 'Mine Operator', 
        name: 'John Doe', 
        email: 'john.doe@gmail.com',
        provider: 'google'
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-brand-section">
          <div className="brand-content">
            <div className="brand-logo">
              <img src={DecarbonizeLogo} alt="Decarbonize" className="logo-img" />
              <div className="logo-glow"></div>
            </div>
            <h1 className="brand-title">Decarbonize</h1>
            <p className="brand-subtitle">Leading the future of sustainable mining through innovative carbon management solutions</p>
            
            <div className="features-preview">
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <span>Real-time GHG Tracking</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌱</div>
                <span>Carbon Sequestration</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🏆</div>
                <span>Compliance Reporting</span>
              </div>
            </div>
          </div>
          <div className="brand-background">
            <div className="floating-particle"></div>
            <div className="floating-particle"></div>
            <div className="floating-particle"></div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Sign in to access your decarbonization dashboard</p>
            </div>

            {/* Google Login Button */}
            <button 
              type="button" 
              className="google-auth-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <GoogleIcon />
              <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
            </button>

            <div className="auth-divider">
              <span>or continue with email</span>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-row">
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

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
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
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#forgot" className="forgot-link">Forgot password?</a>
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>Don't have an account? <a href="/signup" className="signup-link">Create one here</a></p>
              <div className="demo-accounts">
                <p className="demo-title">Demo Accounts:</p>
                <div className="demo-list">
                  <span>admin@decarbonize.com</span>
                  <span>operatormine@decarbonize.com</span>
                  <span>verifier@decarbonize.com</span>
                  <span className="demo-password">Password: password</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;