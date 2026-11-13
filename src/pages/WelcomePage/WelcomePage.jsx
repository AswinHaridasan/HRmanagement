import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './WelcomePage.css';
import taskManagement from "../../assets/Download_Tick_with_a_pencil_illustration_for_free-removebg-preview.png";

import successImage from "../../assets/download-removebg-preview.png";

import workJourney from "../../assets/3d_cartoon_in_chill_using_laptop_in_sitting_in_sofa-removebg-preview.png";

const onboardingSlides = [
  {
    id: 1,
    title: "Welcome to Workmate!",
    subtitle: "Make Smart Decisions! Set clear timelines for projects and celebrate your achievements!",
    image: "https://cdn3d.iconscout.com/3d/premium/thumb/task-management-4620436-3833076.png"
  },
  {
    id: 2,
    title: "Manage Stress Effectively",
    subtitle: "Stay Balanced! Track your workload and maintain a healthy stress level with ease.",
    image: taskManagement
  },
  {
    id: 3,
    title: "Plan for Success",
    subtitle: "Your Journey Starts Here! Earn achievement badges as you conquer your tasks. Let's get started!",
    image: successImage
  },
  {
    id: 4,
    title: "Navigate Your Work Journey\nEfficient & Easy",
    subtitle: "Increase your work management & career\ndevelopment radically",
    image: workJourney
  }
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Go to next slide
  const handleNext = () => {
    if (currentStep < onboardingSlides.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Skip directly to the final slide
  const handleSkip = () => {
    setCurrentStep(3); // Index 3 is the 4th screen
  };

  const currentSlide = onboardingSlides[currentStep];
  const isFinalStep = currentStep === 3;

  return (
    <div className="welcome-container">
      
      <div className="welcome-graphic-section">
        <img 
          src={currentSlide.image} 
          alt={`Onboarding step ${currentSlide.id}`} 
          className="welcome-image"
        />
      </div>
      <div className="welcome-content-section">
        
        <div className="welcome-text-area">
          <h2 className="welcome-title">
            <span style={{ whiteSpace: 'pre-line' }}>{currentSlide.title}</span>
          </h2>
          
          <p className="welcome-subtitle">
            <span style={{ whiteSpace: 'pre-line' }}>{currentSlide.subtitle}</span>
          </p>
        </div>

        {/* Pagination Dots (Only show on first 3 screens) */}
        {!isFinalStep && (
          <div className="welcome-pagination">
            {[0, 1, 2].map((index) => (
              <span 
                key={index} 
                className={`dot ${currentStep === index ? 'active' : ''}`}
              ></span>
            ))}
          </div>
        )}

        <div className="welcome-buttons">
          {!isFinalStep ? (
            <>
              <button className="btn-primary" onClick={handleNext}>
                Next
              </button>
              <button className="btn-secondary" onClick={handleSkip}>
                Skip
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn-primary" style={{ textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/signup" className="btn-secondary" style={{ textDecoration: 'none' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}