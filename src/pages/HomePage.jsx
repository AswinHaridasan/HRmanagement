
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});
  const [email, setEmail] = useState('');
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    // 1. Get saved email
    const savedEmail = localStorage.getItem('userEmail');

    if (savedEmail) {
      setEmail(savedEmail);
    }

    // 2. Get profile data
    const savedProfileData = localStorage.getItem('profileData');

    if (savedProfileData) {
      try {
        setProfile(JSON.parse(savedProfileData));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }

    // 3. Get user-created tasks
    const savedTasks = localStorage.getItem('userTasks');

    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }

    // 4. Get existing meetings
    const savedMeetings = localStorage.getItem('meetings');

    if (savedMeetings) {
      try {
        const parsedMeetings = JSON.parse(savedMeetings);
        setMeetings(Array.isArray(parsedMeetings) ? parsedMeetings : []);
      } catch (error) {
        console.error('Error loading meetings:', error);
      }
    }
  }, []);

  const defaultName = email
    ? email.split('@')[0]
    : 'User';

  const displayName =
    profile.firstName || profile.lastName
      ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
      : defaultName;

  return (
    <div className="home-bg">

      {/* Header */}
      <div className="home-header">

        <div className="user-info">

          <div className="home-pic">
            {profile.profilePic ? (
              <img
                src={profile.profilePic}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              '👤'
            )}
          </div>

          <div>
            <h3 className="capitalize">
              {displayName}
              <span className="verified-badge">✔️</span>
            </h3>

            <p>{email}</p>
          </div>

        </div>

        <div className="header-icons">

          <span
            className="icon-btn"
            onClick={() => navigate('/notifications')}
          >
            🔔
          </span>

          <span
            className="icon-btn"
            onClick={() => navigate('/messages')}
          >
            🗫
          </span>


        </div>

      </div>

      {/* Summary Banner */}
      <div className="summary-banner">

        <div>
          <h2>My Work Summary</h2>
          <p>Today and Upcoming Activity</p>
        </div>

        <div className="banner-icon">
          📊
        </div>

      </div>

      {/* Today Meeting */}
      <div className="section-title">
        Today Meeting
      </div>

      {meetings.length === 0 ? (

        <div className="no-meeting">

          <span className="no-meeting-icon">
            📅
          </span>

          <h4>No Meetings Available</h4>

          <p>
            You don't have any meetings scheduled for today.
          </p>

        </div>

      ) : (

        <div className="meeting-list">

          {meetings.map((meeting) => (

            <div
              className={`meeting-card ${meeting.color || ''}`}
              key={meeting.id}
            >

              <div className="meeting-details">

                <h4 className="meeting-title">
                  {meeting.title}
                </h4>

                <p className="meeting-time">
                  ⏱️ {meeting.time}
                </p>

              </div>

              <button
                className="join-btn"
                onClick={() => {
                  if (meeting.link) {
                    window.open(
                      meeting.link,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }
                }}
              >
                Join Now
              </button>

            </div>

          ))}

        </div>

      )}

      {/* Today Task */}
      <div className="section-title mt-20">
        Today Task
      </div>

      {tasks.length === 0 ? (

        <div
          style={{
            textAlign: 'center',
            color: '#888',
            fontSize: '13px',
            marginTop: '20px',
            paddingBottom: '20px'
          }}
        >

          <span
            style={{
              fontSize: '30px',
              display: 'block',
              marginBottom: '10px'
            }}
          >
            📝
          </span>

          No tasks for today. Create a new task!

        </div>

      ) : (

        tasks.slice(0, 3).map((task) => (

          <div className="task-card" key={task.id}>

            <div
              className={`task-icon-box ${
                task.priority === 'High'
                  ? 'bg-purple'
                  : 'bg-blue'
              }`}
            >
              <span className="task-icon">
                📋
              </span>
            </div>

            <div className="task-details">

              <h4 className="task-title">
                {task.title}
              </h4>

              <p className="task-time">
                Priority: {task.priority} • {task.status}
              </p>

            </div>

            <div className="task-status">

              <input
                type="checkbox"
                checked={task.status === 'Done'}
                readOnly
              />

            </div>

          </div>

        ))

      )}

      {/* Bottom Navigation */}
      <div className="bottom-nav-container">

        <div className="bottom-nav">

          <Link to="/home" className="nav-item active">
            <span className="nav-icon">🏠</span>
          </Link>

          <Link to="/clock-in" className="nav-item">
            <span className="nav-icon">⏱️</span>
          </Link>

          <Link to="/tasks" className="nav-item">
            <span className="nav-icon">📝</span>
          </Link>

          <Link to="/my-profile" className="nav-item">
            <span className="nav-icon">👤</span>
          </Link>

        </div>

      </div>

    </div>
  );
}
