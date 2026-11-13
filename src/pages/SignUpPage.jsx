import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SignUpPage.css';

export default function SignUpPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const savedData = location.state?.formData || {};

  const [email, setEmail] = useState(savedData.email || '');
  const [phone, setPhone] = useState(savedData.phone || '');
  const [companyId, setCompanyId] = useState(savedData.companyId || '');
  const [password, setPassword] = useState(savedData.password || '');
  const [confirmPassword, setConfirmPassword] = useState(savedData.confirmPassword || '');
  const [isChecked, setIsChecked] = useState(location.state?.isAgreed ?? savedData.isChecked ?? false);

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

  const currentFormData = {
    email,
    phone,
    companyId,
    password,
    confirmPassword,
    isChecked
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPwdError('Passwords do not match!');
      return; 
    }

    setPwdError(''); 
    setShowOtpModal(true);
  };

  
  const handleOtpSubmit = () => {
    setShowOtpModal(false);
    
    
    localStorage.setItem('registeredEmail', email);
    localStorage.setItem('registeredPassword', password);
    
    
    localStorage.setItem('userEmail', email); 
    navigate('/welcome-setup');
  };

  return (
    <div className="page-background">
      <div className="signup-card">
        
        <div className="header-section">
          <div className="logo-box"><span className="logo-icon">WM</span></div>
          <h1 className="brand-name">Work Mate</h1>
          <p className="subtitle">Register Using Your Credentials</p>
        </div>

        <form className="signup-form" onSubmit={handleSignUpClick}>
          <div className="input-group">
            <label>Email</label>
            <div className="input-box">
              <span className="icon">✉️</span>
              <input 
                type="email" 
                placeholder="Enter Your Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <div className="phone-input-box">
              <div className="country-code"><span>🇮🇳 +91</span><span className="dropdown-arrow">▼</span></div>
              <input 
                type="tel" 
                placeholder="00000 00000" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Company ID</label>
            <div className="input-box">
              <span className="icon">🏢</span>
              <input 
                type="text" 
                placeholder="Enter Company ID" 
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                required 
              />
            </div>
          </div>

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
                  setPwdError(''); 
                }}
                required 
              />
              <span 
                className="eye-icon" style={{ cursor: 'pointer', userSelect: 'none' }}
                onMouseDown={() => setShowPwd(true)} onMouseUp={() => setShowPwd(false)}
                onTouchStart={() => setShowPwd(true)} onTouchEnd={() => setShowPwd(false)}
              >👁️</span>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-box">
              <span className="icon">🔒</span>
              <input 
                type={showConfirmPwd ? "text" : "password"} 
                placeholder="Confirm My Password" 
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPwdError(''); 
                }}
                required 
              />
              <span 
                className="eye-icon" style={{ cursor: 'pointer', userSelect: 'none' }}
                onMouseDown={() => setShowConfirmPwd(true)} onMouseUp={() => setShowConfirmPwd(false)}
                onTouchStart={() => setShowConfirmPwd(true)} onTouchEnd={() => setShowConfirmPwd(false)}
              >👁️</span>
            </div>
            
            {pwdError && (
              <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '5px', marginBottom: '0' }}>
                {pwdError}
              </p>
            )}
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox" 
              checked={isChecked} 
              onChange={(e) => setIsChecked(e.target.checked)} 
              required
            />
            <label>
              I agree with <Link to="/terms" state={{ formData: currentFormData }}>terms & conditions</Link> and <Link to="/terms" state={{ formData: currentFormData }}>privacy policy </Link>
            </label>
          </div>

          <button type="submit" className="submit-button">Sign Up</button>
        </form>

        <div className="footer-link">
          <p>
            Already have an account? <Link to="/signin">Sign In here</Link>
          </p>
        </div>
      </div>

      {showOtpModal && (
        <div className="otp-overlay">
          <div className="otp-modal-card">
            <div className="otp-icon-box">📧</div>
            <h2 className="otp-heading">Email Verification Sent!</h2>
            <p className="otp-subtext">
              A verification code will be sent to the email <br/>
              <strong>{email || 'your email'}</strong> for your account verification process.
            </p>
            
            <div className="otp-inputs">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <input key={index} type="text" maxLength="1" className="otp-box" />
              ))}
            </div>

            <p className="resend-text">Haven't received the verification code? <span>Resend it.</span></p>
            
            <button className="submit-button" onClick={handleOtpSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}