import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClockInPage.css';

const formatDuration = (milliseconds) => {
  const totalMinutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Safely read profile data
const getProfileData = () => {
  try {
    const savedData = JSON.parse(
      localStorage.getItem('profileData') || '{}'
    );

    return savedData?.profile || savedData?.user || savedData || {};
  } catch (error) {
    console.error('Profile loading error:', error);
    return {};
  }
};

const getFirstValue = (profile, keys) => {
  for (const key of keys) {
    const value = profile?.[key];

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
};

const getAttendanceData = () => {
  try {
    return {
      history: JSON.parse(
        localStorage.getItem('clockHistory') || '[]'
      ),
      activeSession: JSON.parse(
        localStorage.getItem('activeClockSession') || 'null'
      )
    };
  } catch (error) {
    console.error('Attendance loading error:', error);

    return {
      history: [],
      activeSession: null
    };
  }
};

export default function ClockInPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(getProfileData);
  const [history, setHistory] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Load profile and attendance data
  const refreshData = () => {
    setProfile(getProfileData());

    const attendance = getAttendanceData();

    setHistory(attendance.history);
    setActiveSession(attendance.activeSession);
  };

  useEffect(() => {
    refreshData();

    const timer = setInterval(() => {
      setCurrentTime(Date.now());
      refreshData();
    }, 1000);

    const handleFocus = () => refreshData();
    const handleStorage = () => refreshData();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Back button handler
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate('/home');
    } else {
      navigate('/dashboard'); // fallback route — change to your home route
    }
  };

  // Support common profile property names
  const firstName = getFirstValue(profile, [
    'firstName',
    'firstname',
    'first_name',
    'givenName'
  ]);

  const lastName = getFirstValue(profile, [
    'lastName',
    'lastname',
    'last_name',
    'surname'
  ]);

  const fullName = getFirstValue(profile, [
    'fullName',
    'fullname',
    'name',
    'displayName',
    'username'
  ]);

  // 1. പ്രൊഫൈലിൽ നിന്നോ അല്ലെങ്കിൽ ലോഗിൻ ഇമെയിലിൽ നിന്നോ ഇമെയിൽ എടുക്കുക
  const email = getFirstValue(profile, [
    'email',
    'emailAddress',
    'userEmail'
  ]) || localStorage.getItem('userEmail') || '';

  // 2. ഇമെയിലിൽ നിന്നും പേര് വേർതിരിച്ചെടുക്കുക (ഉദാ: aswin@gmail.com -> aswin)
  const nameFromEmail = email.split('@')[0];

  // 3. പേര് സെറ്റ് ചെയ്യുക (മുൻഗണന: ഫുൾ നെയിം -> ഫസ്റ്റ് നെയിം + ലാസ്റ്റ് നെയിം -> ഇമെയിൽ നെയിം -> User)
  const displayName =
    fullName ||
    `${firstName} ${lastName}`.trim() ||
    nameFromEmail ||
    'User';

  const position = getFirstValue(profile, [
    'position',
    'jobTitle',
    'designation',
    'role',
    'department'
  ]);

  const profileImage = getFirstValue(profile, [
    'profileImage',
    'profilePicture',
    'profilePic',
    'avatar',
    'image',
    'photo',
    'imageUrl'
  ]);

  const completedMilliseconds = history.reduce(
    (total, record) =>
      total + (Number(record.durationMs) || 0),
    0
  );

  const activeMilliseconds = activeSession?.clockInTimestamp
    ? Math.max(0, currentTime - Number(activeSession.clockInTimestamp))
    : 0;

  const totalWorkingHours =
    completedMilliseconds + activeMilliseconds;

  const handleClockAction = () => {
    navigate('/attendant');
  };

  // Inline styles
  const backButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'transparent',
    border: 'none',
    color: '#333',
    fontSize: '15px',
    fontWeight: '500',
    padding: '8px 12px',
    margin: '8px 0 0 8px',
    borderRadius: '8px',
    cursor: 'pointer',
  };

  const pageContainerStyle = {
    position: 'relative',
  };

  return (
    <div className="page-container" style={pageContainerStyle}>

      {/* Profile Header */}
      <div
        className="clock-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="clock-profile">

          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="clock-profile-avatar clock-profile-image"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="clock-profile-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="clock-profile-info">
            <h3>{displayName}</h3>

            {email && (
              <span className="clock-profile-email">
                {email}
              </span>
            )}
          </div>
        </div>

        <button
          style={backButtonStyle}
          onClick={handleBack}
          aria-label="Go back"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.12)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.06)';
          }}
        >
          ← Back
        </button>
      </div>

      {/* Banner */}
      <div className="clock-banner">
        <h2>Let's Clock-in!</h2>
        <p>Track your attendance and working hours</p>
      </div>

      <div className="content-scrollable">

        {/* Working Hours */}
        <div className="working-hours-card">
          <p className="card-subtitle">
            Total Working Hours
          </p>

          <p className="card-desc">
            Your total accumulated hours of work
          </p>

          <h2 className="hours-text">
            {formatDuration(totalWorkingHours)} Hrs
          </h2>

          {activeSession && (
            <p className="clock-status">
              ● You are currently clocked in
            </p>
          )}

          <button
            className="btn-clock clocked-in"
            onClick={handleClockAction}
          >
            {activeSession ? 'Clock Out' : 'Clock In'}
          </button>
        </div>

        {/* History */}
        <div className="history-section">
          <h3>History Activity</h3>

          {history.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No History Activity Yet!</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((record, index) => (
                <div
                  className="history-item"
                  key={record.id || index}
                >
                  <div className="history-date">
                    {record.date}
                  </div>

                  <div className="history-details">

                    <div className="time-block">
                      <span className="dot in"></span>
                      <span>Clock In</span>

                      <strong>
                        {record.clockInTime ||
                          (record.type === 'Clock In'
                            ? record.time
                            : '--:--')}
                      </strong>
                    </div>

                    <div className="time-line"></div>

                    <div className="time-block">
                      <span className="dot out"></span>
                      <span>Clock Out</span>

                      <strong>
                        {record.clockOutTime || '--:--'}
                      </strong>
                    </div>

                    {Number(record.durationMs) > 0 && (
                      <div className="history-total">
                        Total: {formatDuration(record.durationMs)} Hrs
                      </div>
                    )}

                    {record.location && (
                      <p className="history-location">
                        📍 {record.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Clock Session */}
          {activeSession && (
            <div className="history-item active-history">
              <div className="history-date">
                {activeSession.date}
              </div>

              <div className="history-details">

                <div className="time-block">
                  <span className="dot in"></span>
                  <span>Clock In</span>
                  <strong>{activeSession.clockInTime}</strong>
                </div>

                <div className="time-line"></div>

                <div className="time-block">
                  <span className="dot out"></span>
                  <span>Clock Out</span>
                  <strong>In Progress</strong>
                </div>

                <div className="history-total">
                  Current session: {formatDuration(activeMilliseconds)} Hrs
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add your existing bottom navigation JSX here */}

    </div>
  );
}