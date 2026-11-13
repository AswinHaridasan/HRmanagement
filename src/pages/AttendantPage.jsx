
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AttendantPage.css';

const readActiveSession = () => {
  try {
    const value = JSON.parse(
      localStorage.getItem('activeClockSession') || 'null'
    );

    if (
      value &&
      Number.isFinite(Number(value.clockInTimestamp))
    ) {
      return value;
    }

    return null;
  } catch {
    return null;
  }
};

const readHistory = () => {
  try {
    const value = JSON.parse(
      localStorage.getItem('clockHistory') || '[]'
    );

    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const formatTime = (date) =>
  date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

const formatDate = (date) =>
  date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

export default function AttendantPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [activeSession, setActiveSession] = useState(readActiveSession);
  const [completedAction, setCompletedAction] = useState('Clock In');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const actionType = activeSession ? 'Clock Out' : 'Clock In';

  useEffect(() => {
    if (step !== 1) return;

    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  const formattedTime = formatTime(currentDate);
  const timeParts = formattedTime.split(' ');
  const timeValue = timeParts[0];
  const amPm = timeParts[1];

  const fullDate = formatDate(currentDate);

  const shortDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handleNext = () => {
    setCurrentDate(new Date());
    setErrorMessage('');
    setStep((previous) => Math.min(previous + 1, 3));
  };

  const handleSubmit = () => {
    if (submitted) return;

    setSubmitted(true);
    setErrorMessage('');

    try {
      const now = new Date();
      const timestamp = now.getTime();
      const time = formatTime(now);
      const date = formatDate(now);

      const currentSession = readActiveSession();
      const existingHistory = readHistory();

      if (!currentSession) {
        // CLOCK IN
        const newSession = {
          id: timestamp,
          date,
          clockInTime: time,
          clockInTimestamp: timestamp,
          clockOutTime: null,
          clockOutTimestamp: null,
          durationMs: 0,
          location: 'Tech Park Workspace'
        };

        localStorage.setItem(
          'activeClockSession',
          JSON.stringify(newSession)
        );

        setActiveSession(newSession);
        setCompletedAction('Clock In');
      } else {
        // CLOCK OUT
        const clockInTimestamp = Number(
          currentSession.clockInTimestamp
        );

        if (
          !Number.isFinite(clockInTimestamp) ||
          timestamp < clockInTimestamp
        ) {
          throw new Error('Invalid clock-in time. Please try again.');
        }

        const durationMs = timestamp - clockInTimestamp;

        const completedSession = {
          ...currentSession,
          clockOutTime: time,
          clockOutTimestamp: timestamp,
          durationMs
        };

        const updatedHistory = [
          completedSession,
          ...existingHistory.filter(
            (record) => record.id !== currentSession.id
          )
        ];

        localStorage.setItem(
          'clockHistory',
          JSON.stringify(updatedHistory)
        );

        localStorage.removeItem('activeClockSession');

        setActiveSession(null);
        setCompletedAction('Clock Out');
      }

      setCurrentDate(now);
      setStep(4);
    } catch (error) {
      console.error('Attendance submission error:', error);
      setErrorMessage(
        error.message || 'Unable to save attendance. Please try again.'
      );
      setSubmitted(false);
    }
  };

  const handleComplete = () => {
    navigate('/clock-in');
  };

  return (
    <div className="attendant-container">

      {/* Header */}
      <header className="attendant-header">
        <button
          type="button"
          className="back-btn"
          onClick={() => {
            if (step === 1) {
              navigate('/clock-in');
            } else if (step === 4) {
              handleComplete();
            } else {
              setStep((previous) => previous - 1);
            }
          }}
          aria-label="Go back"
        >
          ←
        </button>

        <h2>{step === 4 ? 'Attendance' : actionType}</h2>

        <div className="placeholder-space"></div>
      </header>

      {/* STEP 1: LOCATION */}
      {step === 1 && (
        <div className="step-wrapper">
          <div className="map-background">
            <div className="location-pin">
              <span className="pin-icon">📍</span>
              <div className="pulse"></div>
            </div>
          </div>

          <div className="bottom-sheet">
            <div className="sheet-header">
              <div className="time-display">
                <h3>{timeValue}</h3>
                <p>{amPm}</p>
              </div>

              <p className="date-text">{fullDate}</p>
            </div>

            <div className="location-card">
              <div className="loc-icon">🏢</div>

              <div className="loc-details">
                <h4>Tech Park Workspace</h4>
                <p>Kochi, Kerala, India</p>
              </div>

              <div className="loc-status in-range">
                In Range
              </div>
            </div>

            <button
              type="button"
              className="btn-primary full-width"
              onClick={handleNext}
            >
              Take Photo
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CAMERA */}
      {step === 2 && (
        <div className="step-wrapper bg-dark">
          <div className="camera-view">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
              alt="Camera preview placeholder"
              className="camera-feed"
            />

            <div className="face-guide"></div>

            <p className="camera-instruction">
              Position your face inside the frame
            </p>

            <div className="camera-controls">
              <button
                type="button"
                className="capture-btn"
                onClick={handleNext}
                aria-label="Capture photo"
              >
                <div className="capture-inner"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PHOTO PREVIEW */}
      {step === 3 && (
        <div className="step-wrapper">
          <div className="preview-view">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
              alt="Photo preview placeholder"
              className="preview-image"
            />

            <div className="preview-overlay-info">
              <div className="info-tag">
                📍 Tech Park Workspace
              </div>

              <div className="info-tag">
                🕒 {formattedTime}
              </div>
            </div>
          </div>

          <div className="bottom-sheet">
            <h3 className="preview-title">Photo Preview</h3>

            <p className="preview-subtitle">
              Make sure your face is clearly visible and
              location is correct.
            </p>

            {errorMessage && (
              <p className="attendance-error">
                {errorMessage}
              </p>
            )}

            <div className="action-row">
              <button
                type="button"
                className="btn-secondary half-width"
                onClick={() => setStep(2)}
                disabled={submitted}
              >
                Retake
              </button>

              <button
                type="button"
                className="btn-primary half-width"
                onClick={handleSubmit}
                disabled={submitted}
              >
                {submitted ? 'Saving...' : `Submit ${actionType}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS */}
      {step === 4 && (
        <div className="step-wrapper blur-bg">
          <div
            className="map-background"
            style={{ opacity: 0.5 }}
          ></div>

          <div className="modal-overlay">
            <div className="success-modal">
              <div className="success-icon-large">
                <span className="shield-icon">🛡️</span>
                <span className="check-icon">✓</span>
              </div>

              <h2>{completedAction} Successful!</h2>

              <p>
                Your attendance has been recorded successfully
                at {formattedTime}.
              </p>

              <div className="modal-details">
                <div className="detail-row">
                  <span>Action:</span>
                  <strong>{completedAction}</strong>
                </div>

                <div className="detail-row">
                  <span>Location:</span>
                  <strong>Tech Park Workspace</strong>
                </div>

                <div className="detail-row">
                  <span>Date:</span>
                  <strong>{shortDate}</strong>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary full-width"
                onClick={handleComplete}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
