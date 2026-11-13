import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import './TermsPage.css';

export default function TermsPage() {
  const location = useLocation();
  
  const savedFormData = location.state?.formData;

  return (
    <div className="terms-page-background">
      <div className="terms-card">
        
        <h2 className="terms-header">Terms & Conditions and<br/>Privacy Policy</h2>
        
        <div className="terms-content">
          <h4>Terms and Conditions</h4>
          <p>By using the Work Mate app, you agree to comply with all applicable terms and conditions.</p>
          <p>This app is for personal use only and may not be used for commercial purposes without permission.</p>
          
          <h4>Privacy Policy</h4>
          <p>We collect personal data such as name, email, and location to process transactions and improve our services.</p>
          <p>We protect your data with appropriate security measures to prevent unauthorized access.</p>
        </div>

        <div className="terms-buttons">
          <Link 
            to="/signup" 
            state={{ isAgreed: true, formData: savedFormData }} 
            className="agree-button"
            style={{ textDecoration: 'none', textAlign: 'center' }}
          >
            I Agree
          </Link>
          
          <Link 
            to="/signup" 
            state={{ isAgreed: false, formData: savedFormData }} 
            className="decline-button"
            style={{ textDecoration: 'none', textAlign: 'center' }}
          >
            Decline
          </Link>
        </div>

      </div>
    </div>
  );
}