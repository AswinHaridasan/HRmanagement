import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPasswordPage.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  
  // Steps: 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfPwd, setShowConfPwd] = useState(false);
  
  const inputRefs = useRef([]);

  // Step 1: Submit Email
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setStep(2);
    }
  };

  // Step 2: OTP Logic
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      setStep(3);
    }
  };

  // Step 3: Set New Password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      // Update local storage for demo purposes
      localStorage.setItem('registeredPassword', newPassword);
      setStep(4);
    } else {
      alert("Passwords do not match!");
    }
  };

  return (
    <div className="forgot-pwd-container">
      <div className="forgot-pwd-graphic"></div>

      <div className="forgot-pwd-content">
        
        {/* Floating Shield Icon (Changes on success step) */}
        <div className="floating-shield-box">
          {step === 4 ? '🛡️✅' : '🛡️'}
        </div>

        {/* ================= STEP 1: EMAIL INPUT ================= */}
        {step === 1 && (
          <div className="step-section">
            <h1 className="forgot-title">Forgot Password</h1>
            <p className="forgot-subtitle">
              A verification code will be sent to the email address you registered.
            </p>
            
            <form className="forgot-form" onSubmit={handleEmailSubmit}>
              <div className="input-group">
                <label>Email</label>
                <div className="input-box">
                  <span className="icon">✉️</span>
                  <input 
                    type="email" 
                    placeholder="My Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="btn-primary forgot-btn">
                Send Verification Code
              </button>
            </form>
            <div className="back-to-login">
              <Link to="/signin">Back to Sign In</Link>
            </div>
          </div>
        )}

        {/* ================= STEP 2: OTP VERIFICATION ================= */}
        {step === 2 && (
          <div className="step-section">
            <h1 className="forgot-title">Forgot Password</h1>
            <p className="forgot-subtitle">
              A 6-digit code has been sent to <strong>{email}</strong>. Enter the code below to verify.
            </p>
            
            <form className="forgot-form" onSubmit={handleOtpSubmit}>
              <div className="otp-inputs-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-digit-input"
                    required
                  />
                ))}
              </div>
              
              <p className="resend-text">
                Didn't receive the code? <span className="resend-link">Resend it.</span>
              </p>

              <button type="submit" className="btn-primary forgot-btn">
                Submit
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 3: NEW PASSWORD ================= */}
        {step === 3 && (
          <div className="step-section">
            <h1 className="forgot-title">Set a New Password</h1>
            <p className="forgot-subtitle">
              Create a new password that is safe and easy to remember.
            </p>
            
            <form className="forgot-form" onSubmit={handlePasswordSubmit}>
              <div className="input-group">
                <label>New Password</label>
                <div className="input-box">
                  <span className="icon">🔒</span>
                  <input 
                    type={showNewPwd ? "text" : "password"} 
                    placeholder="New Password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span className="eye-icon" onClick={() => setShowNewPwd(!showNewPwd)}>
                    {showNewPwd ? '👁️' : '👁️‍🗨️'}
                  </span>
                </div>
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <div className="input-box">
                  <span className="icon">🔒</span>
                  <input 
                    type={showConfPwd ? "text" : "password"} 
                    placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span className="eye-icon" onClick={() => setShowConfPwd(!showConfPwd)}>
                    {showConfPwd ? '👁️' : '👁️‍🗨️'}
                  </span>
                </div>
              </div>
              
              <button type="submit" className="btn-primary forgot-btn" style={{marginTop: '10px'}}>
                Submit
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 4: SUCCESS ================= */}
        {step === 4 && (
          <div className="step-section text-center">
            <h1 className="forgot-title">Password Has Been Created</h1>
            <p className="forgot-subtitle">
              Your password has been successfully created. You can now log in to your account with your new password.
            </p>
            
            <button 
              className="btn-primary forgot-btn" 
              onClick={() => navigate('/signin')}
              style={{marginTop: '30px'}}
            >
              Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
}