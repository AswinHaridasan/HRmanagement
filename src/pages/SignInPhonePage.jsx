import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignInPhonePage.css';

export default function SignInPhonePage() {
  const navigate = useNavigate();
  
  // Step 1: Phone Input, Step 2: OTP Verification
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // OTP state for 6 digits
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length > 5) {
      setStep(2); // Move to OTP step
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Take only the last character if they type multiple
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input automatically
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on Backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      // Success - Navigate to Home
      navigate('/home');
    }
  };

  return (
    <div className="phone-signin-container">
      
      {/* Top purple background */}
      <div className="phone-signin-graphic"></div>

      <div className="phone-signin-content">
        
        {step === 1 ? (
          /* =========================================
             STEP 1: PHONE NUMBER INPUT
             ========================================= */
          <>
            <div className="phone-signin-header">
              <h1 className="phone-signin-title">Sign In</h1>
              <p className="phone-signin-subtitle">Sign in to my account</p>
            </div>

            <form className="phone-signin-form" onSubmit={handlePhoneSubmit}>
              
              <div className="input-group">
                <label>Phone Number</label>
                <div className="phone-input-box">
                  <div className="country-code">
                    <span>INA ▾</span>
                    <span className="code-number">+62</span>
                  </div>
                  <input 
                    type="tel" 
                    placeholder="821 3930 0003" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

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

              <button type="submit" className="btn-primary signin-btn">
                Sign In
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="alt-login-options">
              <button type="button" className="btn-secondary alt-btn">
                 <span className="alt-icon">👤</span> Sign In With Employee ID
              </button>
              
              <Link to="/signin" className="btn-secondary alt-btn" style={{ textDecoration: 'none' }}>
                 <span className="alt-icon">✉️</span> Sign In With Email
              </Link>
            </div>

            <div className="phone-signin-footer">
              <p>Don't have an account? <Link to="/signup" className="signup-link">Sign Up Here</Link></p>
            </div>
          </>

        ) : (
          /* =========================================
             STEP 2: OTP VERIFICATION
             ========================================= */
          <div className="otp-section">
            
            {/* Floating Phone Icon */}
            <div className="floating-icon-box">
              📞
            </div>

            <h1 className="phone-signin-title">Sign In Phone Number</h1>
            <p className="otp-subtitle">
              Sign in code has been sent to <strong>+91{phoneNumber || '00000 00000'}</strong>, 
              check your inbox to continue the sign in process.
            </p>

            <form className="otp-form" onSubmit={handleOtpSubmit}>
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
                Haven't received the sign in code? <span className="resend-link">Resend it.</span>
              </p>

              <button type="submit" className="btn-primary submit-btn">
                Submit
              </button>
            </form>

            <div className="different-method-footer">
              <p>Sign in with different method <span className="method-link" onClick={() => setStep(1)}>Here.</span></p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}