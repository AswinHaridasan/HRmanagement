import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyProfilePage.css";

export default function MyProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});
  const [email, setEmail] = useState("email@work.com");

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) setEmail(savedEmail);

    try {
      const savedProfile = JSON.parse(
        localStorage.getItem("profileData") || "{}"
      );
      setProfile(savedProfile);
    } catch {
      setProfile({});
    }
  }, []);

  const defaultName = email.split("@")[0] || "User";

  const displayName =
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
    defaultName;

  const handleLogout = () => {
    // Added clock history, active session, and todo list keys to be removed
    [
      "userEmail",
      "profileData",
      "firstName",
      "lastName",
      "position",
      "address",
      "profilePic",
      "clockHistory",         // Clears Clock In/Out history
      "activeClockSession",   // Clears active Clock In session
      "todos",                // Clears To-Do list (change this key if your app uses a different name like 'tasks')
      "todoList",             // Backup To-Do list key
      "tasks"                 // Backup To-Do list key
    ].forEach((key) => localStorage.removeItem(key));

    navigate("/");
  };

  return (
    <div className="new-profile-bg">

      {/* Purple Profile Header */}
      <header className="profile-purple-header">
        <div className="profile-header-top">
        <button
          className="new-back-btn"
          onClick={() => navigate("/home")}
          aria-label="Go to Home"
        >
          ‹-
        </button>

          <h2>My Profile</h2>

          <button
            className="profile-edit-icon"
            onClick={() => navigate("/edit-profile")}
            aria-label="Edit profile"
          >
            ✎
          </button>
        </div>

        <div className="profile-hero">
          <div className="new-profile-pic">
            {profile.profilePic ? (
              <img src={profile.profilePic} alt="Profile" />
            ) : (
              <span>👤</span>
            )}
          </div>

          <h3>
            {displayName}
            <span className="verified-icon">✓</span>
          </h3>

          <p>{profile.position || "Position not added"}</p>
        </div>
      </header>

      <main className="new-profile-content">

        {/* Personal Information */}
        <section className="profile-info-section">
          <div className="profile-section-title">
            <h3>Personal Information</h3>
            <Link to="/edit-profile">Edit</Link>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-row">
              <span className="profile-info-icon">✉</span>
              <div>
                <small>Email Address</small>
                <p>{email}</p>
              </div>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-icon">📍</span>
              <div>
                <small>Address</small>
                <p>{profile.address || "Address not added"}</p>
              </div>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-icon">🎂</span>
              <div>
                <small>Date of Birth</small>
                <p>{profile.dob || "Not added"}</p>
              </div>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-icon">💼</span>
              <div>
                <small>Position</small>
                <p>{profile.position || "Not added"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="profile-info-section">
          <h3 className="profile-section-heading">Achievements</h3>

          <div className="profile-achievements">
            <div className="achievement-item">
              <span className="achievement-icon green">🏅</span>
              <p>Probation Slayer</p>
            </div>

            <div className="achievement-item">
              <span className="achievement-icon blue">🌟</span>
              <p>Junior Of The Month</p>
            </div>

            <div className="achievement-item">
              <span className="achievement-icon orange">🏆</span>
              <p>Employee Of The Year</p>
            </div>

            <div className="achievement-item">
              <span className="achievement-icon red">💎</span>
              <p>Top Performer</p>
            </div>
          </div>
        </section>

        {/* Account Menu */}
        <section className="profile-info-section">
          <h3 className="profile-section-heading">Account</h3>

          <div className="profile-menu-card">
            <Link to="/edit-profile" className="profile-menu-link">
              <span className="menu-icon-box purple">👤</span>
              <span className="menu-link-text">Personal Data</span>
              <span className="profile-arrow">›</span>
            </Link>

            <Link to="/office-assets" className="profile-menu-link">
              <span className="menu-icon-box blue">💻</span>
              <span className="menu-link-text">Office Assets</span>
              <span className="profile-arrow">›</span>
            </Link>

            <Link to="/payroll" className="profile-menu-link">
              <span className="menu-icon-box green">💳</span>
              <span className="menu-link-text">Payroll & Tax</span>
              <span className="profile-arrow">›</span>
            </Link>

            
          </div>
        </section>

        {/* Settings */}
        <section className="profile-info-section">
          <h3 className="profile-section-heading">Settings</h3>

          <div className="profile-menu-card">
            <Link to="/change-password" className="profile-menu-link">
              <span className="menu-icon-box purple">🔒</span>
              <span className="menu-link-text">Change Password</span>
              <span className="profile-arrow">›</span>
            </Link>

            <div className="profile-menu-link">
              <span className="menu-icon-box blue">🔄</span>
              <span className="menu-link-text">Versioning</span>
              <span className="profile-arrow">›</span>
            </div>

            <Link to="#" className="profile-menu-link">
              <span className="menu-icon-box orange">❓</span>
              <span className="menu-link-text">FAQ and Help</span>
              <span className="profile-arrow">›</span>
            </Link>

            <button
              className="profile-menu-link logout-link"
              onClick={handleLogout}
            >
              <span className="menu-icon-box red">🚪</span>
              <span className="menu-link-text">Logout</span>
              <span className="profile-arrow">›</span>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}