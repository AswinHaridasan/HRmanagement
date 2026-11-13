import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './WelcomeSetupPage.css';

export default function WelcomeSetupPage() {
    const location = useLocation();
    const email = localStorage.getItem('userEmail') || '';

  return (
    <div className="setup-page-bg">
      <div className="setup-card">
        
        <h1 className="setup-heading">Welcome to Workmate.</h1>
        <p className="setup-desc">
          To enhance your user experience, please set up your profile first. 
          This will help us tailor the app to your needs and ensure you get the most of our features.
        </p>

        <div className="setup-buttons">
          
          <Link 
            to="/my-profile" 
            state={{ email: email }}
            className="primary-button"
            style={{ textDecoration: 'none', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}
          >
            Set up my profile
          </Link>
          
          <Link 
            to="/home" 
            state={{ email: email }}
            className="secondary-button"
            style={{ textDecoration: 'none', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}
          >
            Explore the app first
          </Link>
          
        </div>

      </div>
    </div>
  );
}