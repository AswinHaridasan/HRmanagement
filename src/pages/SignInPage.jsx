import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignInPage.css';

export default function SignInPage() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // States for specific errors matching the design flow
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    
    // Reset previous errors
    setEmailError('');
    setPasswordError('');
    
    const registeredEmail = localStorage.getItem('registeredEmail');
    const registeredPassword = localStorage.getItem('registeredPassword');
    
    // Check if email is registered (matching "Email Not Registered" flow)
    if (email !== registeredEmail && email !== 'tonald@work') {
      setEmailError('Email Not Registered! Sign Up to create');
      return;
    }

    // Check if password matches (matching "Wrong Password" flow)
    if (password !== registeredPassword && password !== '123456') { // Fallback pass for testing
      setPasswordError('Wrong Password!');
      return;
    }
    
    // Success flow
    localStorage.setItem('userEmail', email); 
    navigate('/home');
  };

  return (
    <div className="signin-container">
      
      {/* Top purple background padding */}
      <div className="signin-graphic-section">
         {/* Blank space to match the design's half-purple background */}
      </div>

      <div className="signin-content-section">
        
        <div className="signin-header">
          <h1 className="signin-title">Sign In</h1>
          <p className="signin-subtitle">Sign in to my account</p>
        </div>

        <form className="signin-form" onSubmit={handleSignIn}>
          
          {/* Email Input */}
          <div className="input-group">
            <label>Email</label>
            <div className={`input-box ${emailError ? 'error-border' : ''}`}>
              <span className="icon">✉️</span>
              <input 
                type="email" 
                placeholder="My Email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(''); 
                }}
                required
              />
            </div>
            {emailError && <p className="error-text">{emailError}</p>}
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label>Password</label>
            <div className={`input-box ${passwordError ? 'error-border' : ''}`}>
              <span className="icon">🔒</span>
              <input 
                type={showPwd ? "text" : "password"} 
                placeholder="My Password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(''); 
                }}
                required
              />
              <span 
                className="eye-icon" 
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
            {passwordError && <p className="error-text">{passwordError}</p>}
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="form-options">
            <label className="remember-me">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkmark"></span>
              Remember Me
            </label>
            <Link to="/forgot-password" className="forgot-pwd-link">Forgot Password</Link>
          </div>

          {/* Sign In Button */}
          <button type="submit" className="btn-primary signin-btn">
            Sign In
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        {/* Alternative Login Options */}
        <div className="alt-login-options">
          <Link to="/signin-employee" className="btn-secondary alt-btn" style={{ textDecoration: 'none' }}>
             <span className="alt-icon">👤</span> Sign In With Employer ID
          </Link>
          
          <Link to="/signin-phone" className="btn-secondary alt-btn" style={{ textDecoration: 'none' }}>
            <span className="alt-icon">📞</span> Sign In With Phone
          </Link>
        </div>

        <div className="signin-footer">
          <p>Don't have an account? <Link to="/signup" className="signup-link">Sign Up Here</Link></p>
        </div>

      </div>
    </div>
  );
}