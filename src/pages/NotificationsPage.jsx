import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationsPage.css';

export default function NotificationsPage() {
  const navigate = useNavigate();

  // ലോക്കൽ സ്റ്റോറേജിൽ നിന്നും നോട്ടിഫിക്കേഷനുകൾ എടുക്കുന്നു
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('userNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  // ഒരു നോട്ടിഫിക്കേഷൻ ക്ലിക്ക് ചെയ്യുമ്പോൾ അത് 'Read' ആക്കാൻ
  const markAsRead = (id) => {
    const updatedNotifs = notifications.map((notif) =>
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifs);
    localStorage.setItem('userNotifications', JSON.stringify(updatedNotifs));
  };

  // എല്ലാ നോട്ടിഫിക്കേഷനുകളും ക്ലിയർ ചെയ്യാൻ
  const clearNotifications = () => {
    localStorage.removeItem('userNotifications');
    setNotifications([]);
  };

  return (
    <div className="notifications-container">
      
      {/* Header */}
      <div className="notif-header">
        <button className="back-btn-light" onClick={() => navigate(-1)}>
          <span className="back-icon">‹</span>
        </button>
        <h2 className="notif-title">Notifications</h2>
        {notifications.length > 0 ? (
          <button 
            onClick={clearNotifications} 
            style={{background:'none', border:'none', color:'#ff4d4f', fontWeight:'600', cursor:'pointer', fontSize: '13px'}}
          >
            Clear
          </button>
        ) : (
          <div className="placeholder-space"></div>
        )}
      </div>

      {/* Notifications List */}
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>
            <div style={{fontSize: '40px', marginBottom: '10px', filter: 'grayscale(100%) opacity(0.5)'}}>📭</div>
            <p>No new notifications</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              // isRead false ആണെങ്കിൽ 'unread' എന്ന ക്ലാസ് കൂടി ചേർക്കുന്നു
              className={`notif-item ${!notif.isRead ? 'unread' : 'read'}`} 
              key={notif.id}
              onClick={() => markAsRead(notif.id)} // ക്ലിക്ക് ചെയ്യുമ്പോൾ Read ആകുന്നു
            >
              <div className="notif-icon-box">
                <span className="notif-icon">{notif.icon || "🔔"}</span>
              </div>
              
              <div className="notif-content">
                <div className="notif-title-row">
                  <h4>{notif.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="notif-time">{notif.time}</span>
                    {/* Unread ആണെങ്കിൽ ഒരു ചെറിയ ബ്ലൂ ഡോട്ട് കാണിക്കാൻ */}
                    {!notif.isRead && <span className="unread-dot"></span>}
                  </div>
                </div>
                <p className="notif-desc">{notif.description}</p>
                <span style={{fontSize: '10px', color: '#ccc', marginTop: '4px', display: 'block'}}>{notif.date}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}