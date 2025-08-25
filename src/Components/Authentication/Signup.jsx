import React, { useState } from 'react';
import './Signup.css'; // We will create this new CSS file
import Navbar from '../Layout/Navbar';

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

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    // --- Basic Validation ---
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    // --- Mock API Call for Signup ---
    setTimeout(() => {
      console.log('New user signed up:', { fullName, companyName, role, email });
      setSuccess(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <Navbar user={null} />
      <div className="auth-page-container">
        <div className="auth-card signup-card">
          <div className="auth-header">
            <h2>Create Your Account</h2>
            <p>Join the future of decarbonization.</p>
          </div>
          
          {success ? (
            <div className="success-message">
              <h3>Registration Successful!</h3>
              <p>Please check your email to verify your account. You can now <a href="/login">log in</a>.</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="auth-form">
              <div className="input-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="e.g., Anjali Sharma" />
              </div>
              <div className="input-group">
                <label htmlFor="companyName">Company / Mine Name</label>
                <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required placeholder="e.g., GeoMin Resources" />
              </div>
              <div className="input-group">
                <label htmlFor="role">Your Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option>Mine Operator</option>
                  <option>Verifier</option>
                  <option>Admin</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="e.g., user@company.com" />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Minimum 8 characters" />
              </div>
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Re-enter your password" />
              </div>

              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>Already have an account? <a href="/login">Sign In</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;