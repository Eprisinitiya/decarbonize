import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'admin@decarbonize.com' && password === 'password') {
        onLoginSuccess({ role: 'Admin', name: 'Admin User' });
      } else if (email === 'operator@mine.com' && password === 'password') {
        onLoginSuccess({ role: 'Mine Operator', name: 'Coal Mine One' });
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Enter your credentials to access your dashboard.</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g., user@company.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="login-footer">
          <a href="#forgot">Forgot Password?</a>
          <span>•</span>
          <a href="/signup">Don't have an account? Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;