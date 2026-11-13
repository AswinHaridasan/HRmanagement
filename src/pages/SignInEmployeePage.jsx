import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignInEmployeePage.css';

export default function SignInEmployeePage() {
  const navigate = useNavigate();
  
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState(''); 
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    
    // For demo purposes, we accept any ID and password length > 3
    if (employeeId && password.length > 3) {
      // Save dummy email or ID to localStorage so Home page loads something
      localStorage.setItem('userEmail', `EMP-${employeeId}@work.com`);
      navigate('/home');
    } else {
      setError('Please enter a valid Employee ID and Password.');
    }
  };

  return (
    <div className="emp-signin-container">
      
      {/* Top purple background padding */}
      <div className="emp-signin-graphic-section"></div>

      <div className="emp-signin-content-section">
        
        <div className="emp-signin-header">
          <h1 className="emp-signin-title">Sign In</h1>
          <p className="emp-signin-subtitle">Sign in to my account</p>
        </div>

        <form className="emp-signin-form" onSubmit={handleSignIn}>
          
          {/* Employee ID Input */}
          <div className="input-group">
            <label>Employee ID</label>
            <div className="input-box">
              <span className="icon">👤</span>
              <input 
                type="text" 
                placeholder="My Employee ID" 
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                  setError(''); 
                }}
                required
              />
              <span className="right-icon">◎</span>
            </div>
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label>Password</label>
            <div className="input-box">
              <span className="icon">🔒</span>
              <input 
                type={showPwd ? "text" : "password"} 
                placeholder="My Password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(''); 
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
          </div>

          {error && <p className="error-text">{error}</p>}

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
          <Link to="/signin" className="btn-secondary alt-btn" style={{ textDecoration: 'none' }}>
             <span className="alt-icon">✉️</span> Sign In With Email
          </Link>
          
          <Link to="/signin-phone" className="btn-secondary alt-btn" style={{ textDecoration: 'none' }}>
             <span className="alt-icon">📞</span> Sign In With Phone
          </Link>
        </div>

        <div className="emp-signin-footer">
          <p>Don't have an account? <Link to="/signup" className="signup-link">Sign Up Here</Link></p>
        </div>

      </div>
    </div>
  );
}