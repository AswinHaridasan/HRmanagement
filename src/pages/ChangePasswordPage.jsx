
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePasswordPage.css";

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  // Change password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswords, setShowPasswords] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Forgot password states
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [newForgotPassword, setNewForgotPassword] = useState("");
  const [confirmForgotPassword, setConfirmForgotPassword] = useState("");

  const [message, setMessage] = useState("");

  // Toggle password visibility
  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Normal password update
  const handleUpdate = (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword.length < 8) {
      setMessage("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = () => {
    localStorage.setItem("registeredPassword", newPassword);

    setShowConfirmModal(false);
    setShowSuccess(true);
  };

  // Generate random OTP
  const generateOtp = () => {
    const randomOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    setGeneratedOtp(randomOtp);
    setOtp(["", "", "", "", "", ""]);
    setOtpVerified(false);
    return randomOtp;
  };

  // Forgot password button
  const handleForgotPassword = () => {
    setForgotMode(true);
    setForgotStep(1);
    setMessage("");
    setEmail(localStorage.getItem("userEmail") || "");
  };

  // Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    generateOtp();
    setForgotStep(2);
  };

  // OTP input
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    setMessage("");

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setMessage("Please enter the complete 6-digit OTP.");
      return;
    }

    if (enteredOtp !== generatedOtp) {
      setMessage("Invalid OTP. Please try again.");
      return;
    }

    setOtpVerified(true);
    setMessage("");
    setForgotStep(3);
  };

  // Resend OTP
  const handleResendOtp = () => {
    generateOtp();
    setMessage("New OTP generated successfully.");
  };

  // Reset password
  const handleForgotPasswordUpdate = (e) => {
    e.preventDefault();
    setMessage("");

    if (!otpVerified) {
      setMessage("Please verify OTP first.");
      return;
    }

    if (newForgotPassword.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (newForgotPassword !== confirmForgotPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    localStorage.setItem(
      "registeredPassword",
      newForgotPassword
    );

    setForgotStep(4);
  };

  // Reusable password input
  const renderPasswordInput = (
    label,
    value,
    setter,
    field,
    placeholder
  ) => (
    <div className="password-form-group">
      <label>{label}</label>

      <div className="password-input-wrapper">
        <span className="password-field-icon">🔒</span>

        <input
          type={showPasswords[field] ? "text" : "password"}
          value={value}
          onChange={(e) => setter(e.target.value)}
          placeholder={placeholder}
          required
        />

        <button
          type="button"
          className="password-eye-btn"
          onClick={() => togglePassword(field)}
          aria-label={
            showPasswords[field]
              ? "Hide password"
              : "Show password"
          }
        >
          {showPasswords[field] ? "🙈" : "👁"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="change-password-page">

      {/* HEADER */}
      <header className="change-password-header">
        <button
          onClick={() => {
            if (forgotMode) {
              setForgotMode(false);
              setMessage("");
            } else {
              navigate(-1);
            }
          }}
        >
          ←
        </button>

        <h2>
          {forgotMode ? "Forgot Password" : "Change Password"}
        </h2>

        <span></span>
      </header>

      <main className="change-password-content">

        {/* ==================================
            NORMAL CHANGE PASSWORD
        ================================== */}

        {!forgotMode && (
          <>
            <div className="change-password-heading">
              <div className="password-main-icon">🔐</div>

              <h2>Change Your Password</h2>

              <p>
                Create a strong password to keep your account secure.
              </p>
            </div>

            <form
              onSubmit={handleUpdate}
              className="password-form"
            >

              {renderPasswordInput(
                "Current Password",
                currentPassword,
                setCurrentPassword,
                "current",
                "Enter current password"
              )}

              {renderPasswordInput(
                "New Password",
                newPassword,
                setNewPassword,
                "new",
                "Enter new password"
              )}

              {renderPasswordInput(
                "Confirm New Password",
                confirmPassword,
                setConfirmPassword,
                "confirm",
                "Re-enter new password"
              )}

              <p className="password-hint">
                Password must contain at least 8 characters.
              </p>

              {message && (
                <p className="password-error">{message}</p>
              )}

              <button
                type="submit"
                className="password-submit-btn"
              >
                Update Password
              </button>

              <button
                type="button"
                className="forgot-password-link"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>

            </form>
          </>
        )}

        {/* ==================================
            FORGOT PASSWORD FLOW
        ================================== */}

        {forgotMode && (

          <div className="forgot-password-card">

            <div className="password-main-icon">
              {forgotStep === 4 ? "🛡️" : "🔐"}
            </div>

            {/* STEP 1: EMAIL */}

            {forgotStep === 1 && (
              <>
                <h2>Forgot Password?</h2>

                <p className="forgot-description">
                  Enter your registered email address to
                  generate a verification code.
                </p>

                <form onSubmit={handleSendOtp}>

                  <div className="password-form-group">
                    <label>Email Address</label>

                    <div className="password-input-wrapper">
                      <span className="password-field-icon">
                        ✉️
                      </span>

                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {message && (
                    <p className="password-error">{message}</p>
                  )}

                  <button
                    type="submit"
                    className="password-submit-btn"
                  >
                    Send Verification Code
                  </button>

                </form>
              </>
            )}

            {/* STEP 2: OTP */}

            {forgotStep === 2 && (
              <>
                <h2>Verify OTP</h2>

                <p className="forgot-description">
                  Enter the 6-digit code for {email}.
                </p>

                <div className="demo-otp-box">
                  <span>OTP Code </span>
                  <strong>{generatedOtp} </strong>
                  <small>
                      This is The OTP Verify.
                  </small>
                </div>

                <div className="otp-input-container">

                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(e.target.value, index)
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Backspace" &&
                          !digit &&
                          index > 0
                        ) {
                          document
                            .getElementById(`otp-${index - 1}`)
                            ?.focus();
                        }
                      }}
                    />
                  ))}

                </div>

                {message && (
                  <p className="password-error">{message}</p>
                )}

                <button
                  type="button"
                  className="password-submit-btn"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>

                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              </>
            )}

            {/* STEP 3: NEW PASSWORD */}

            {forgotStep === 3 && (
              <>
                <h2>Create New Password</h2>

                <p className="forgot-description">
                  Your OTP has been verified. Create your new password.
                </p>

                <form onSubmit={handleForgotPasswordUpdate}>

                  {renderPasswordInput(
                    "New Password",
                    newForgotPassword,
                    setNewForgotPassword,
                    "forgotNew",
                    "Enter new password"
                  )}

                  {renderPasswordInput(
                    "Confirm Password",
                    confirmForgotPassword,
                    setConfirmForgotPassword,
                    "forgotConfirm",
                    "Confirm new password"
                  )}

                  <p className="password-hint">
                    Password must contain at least 8 characters.
                  </p>

                  {message && (
                    <p className="password-error">{message}</p>
                  )}

                  <button
                    type="submit"
                    className="password-submit-btn"
                  >
                    Reset Password
                  </button>

                </form>
              </>
            )}

            {/* STEP 4: SUCCESS */}

            {forgotStep === 4 && (
              <>
                <div className="password-success-icon">✓</div>

                <h2>Password Updated!</h2>

                <p className="forgot-description">
                  Your password has been successfully reset.
                  You can now sign in using your new password.
                </p>

                <button
                  className="password-submit-btn"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </button>
              </>
            )}

            {forgotStep !== 4 && (
              <button
                type="button"
                className="forgot-password-link"
                onClick={() => {
                  setForgotMode(false);
                  setForgotStep(1);
                  setMessage("");
                }}
              >
                ← Back to Change Password
              </button>
            )}

          </div>
        )}

      </main>

      {/* ==================================
          CONFIRMATION MODAL
      ================================== */}

      {showConfirmModal && (
        <div className="password-modal-overlay">

          <div className="password-modal">

            <div className="password-modal-icon">🔐</div>

            <h2>Update Password?</h2>

            <p>
              Are you sure you want to change your account password?
            </p>

            <div className="password-modal-actions">

              <button
                onClick={() => setShowConfirmModal(false)}
                className="password-modal-cancel"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmUpdate}
                className="password-modal-confirm"
              >
                Yes, Update
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ==================================
          NORMAL UPDATE SUCCESS MODAL
      ================================== */}

      {showSuccess && (
        <div className="password-modal-overlay">

          <div className="password-modal">

            <div className="password-success-icon">✓</div>

            <h2>Password Updated!</h2>

            <p>
              Your password has been updated successfully.
            </p>

            <button
              className="password-modal-confirm full-width"
              onClick={() => navigate("/my-profile")}
            >
              Back to My Profile
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default ChangePasswordPage;
