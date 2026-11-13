import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TaskPage.css';

export default function TaskPage() {
  const navigate = useNavigate();
  
  // 1. ലോക്കൽ സ്റ്റോറേജിൽ നിന്നും ടാസ്കുകൾ എടുക്കുന്നു
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('userTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [activeTab, setActiveTab] = useState('All');
  
  // Modal & Flow States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creationStep, setCreationStep] = useState(1); 
  
  // Form States
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newTaskImage, setNewTaskImage] = useState(null);
  
  // ടാസ്കുകളിൽ മാറ്റം വരുമ്പോൾ അത് ലോക്കൽ സ്റ്റോറേജിൽ സേവ് ചെയ്യുന്നു
  useEffect(() => {
    localStorage.setItem('userTasks', JSON.stringify(tasks));
  }, [tasks]);

  // കൗണ്ടറുകൾ
  const todoCount = tasks.filter(t => t.status === 'To Do').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const doneCount = tasks.filter(t => t.status === 'Done').length;

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'All') return true;
    return task.status === activeTab;
  });

  // ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യാൻ
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTaskImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // പുതിയ ടാസ്ക് ഉണ്ടാക്കാനും നോട്ടിഫിക്കേഷൻ അയക്കാനും
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const formattedTime = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // ടാസ്ക് ഉണ്ടാക്കുന്നു
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDesc,
      status: "To Do",
      priority: newPriority,
      image: newTaskImage,
      date: formattedDate,
      progress: 0
    };

    setTasks([newTask, ...tasks]);

    // 🔔 നോട്ടിഫിക്കേഷൻ ഉണ്ടാക്കുന്നു
    const newNotification = {
      id: Date.now() + 1,
      title: "New Task Created!",
      description: `You have successfully created a new task: "${newTaskTitle}".`,
      time: formattedTime,
      date: formattedDate,
      icon: "📝"
    };

    const savedNotifs = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    localStorage.setItem('userNotifications', JSON.stringify([newNotification, ...savedNotifs]));

    setCreationStep(2); // Success അനിമേഷൻ കാണിക്കാൻ
    
    // 2 സെക്കൻഡിന് ശേഷം മോഡൽ അടയ്ക്കുന്നു
    setTimeout(() => {
      closeCreateModal();
      setActiveTab('All');
    }, 2000);
  };

  // മോഡൽ അടയ്ക്കാനുള്ള ഫംഗ്ഷൻ
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreationStep(1);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewPriority('Medium');
    setNewTaskImage(null);
  };

  // സ്റ്റാറ്റസ് മാറ്റാൻ (To Do / In Progress / Done)
  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        let progress = task.progress;
        if (newStatus === 'To Do') progress = 0;
        if (newStatus === 'In Progress') progress = 50;
        if (newStatus === 'Done') progress = 100;
        return { ...task, status: newStatus, progress };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // എല്ലാ ടാസ്കുകളും ഡിലീറ്റ് ചെയ്യാൻ (Clear All)
  const handleClearAllTasks = () => {
    if (tasks.length === 0) return;
    
    const confirmClear = window.confirm("Are you sure you want to delete all tasks? This action cannot be undone.");
    if (confirmClear) {
      setTasks([]);
    }
  };

  return (
    <div className="task-page-container">
      
      {/* Header */}
      <div className="task-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h2>Task / {activeTab}</h2>
        <div className="header-icons">
          <span className="icon-btn">🔍</span>
        </div>
      </div>

      <div className="task-scrollable-content">
        
        {/* Banner */}
        <div className="task-banner">
          <div className="banner-text">
            <h2>Challenges Awaiting</h2>
            <p>Track and manage your tasks easily</p>
          </div>
          <div className="banner-icon">📝</div>
        </div>

        {/* Summary Card */}
        <div className="task-summary-card">
          <p className="summary-title">Summary of Task Work</p>
          <div className="summary-stats">
            <div className="stat-box">
              <span className="stat-dot blue"></span>
              <p>To Do</p>
              <h3>{todoCount}</h3>
            </div>
            <div className="stat-box">
              <span className="stat-dot orange"></span>
              <p>In Progress</p>
              <h3>{inProgressCount}</h3>
            </div>
            <div className="stat-box">
              <span className="stat-dot green"></span>
              <p>Done</p>
              <h3>{doneCount}</h3>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="task-tabs">
          {['All', 'To Do', 'In Progress', 'Done'].map(tab => (
            <div 
              key={tab} 
              className={`tab-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Task List Header with Clear All Button */}
        <div className="list-header-row">
          <span className="list-title">Your Tasks</span>
          {tasks.length > 0 && (
            <button className="clear-all-btn" onClick={handleClearAllTasks}>
              Clear All 🗑️
            </button>
          )}
        </div>

        {/* Task List Items */}
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="task-empty-state">
              <div className="empty-icon-box">📁</div>
              <h3>No Tasks Found</h3>
              <p>You don't have any tasks in this category yet.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div className="premium-task-card" key={task.id}>
                
                {/* അറ്റാച്ച് ചെയ്ത ഫോട്ടോ ഉണ്ടെങ്കിൽ കാണിക്കാൻ */}
                {task.image && (
                  <div className="task-card-cover">
                    <img src={task.image} alt="Task Cover" />
                    <div className="cover-overlay"></div>
                    <span className={`badge-overlay ${task.priority.toLowerCase()}`}>
                      {task.priority} Priority
                    </span>
                  </div>
                )}

                <div className="task-card-body">
                  <div className="task-card-header">
                    <h4 className="task-title">{task.title}</h4>
                    <select 
                      value={task.status} 
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="status-dropdown"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  
                  {task.description && (
                    <p className="task-description-text">{task.description}</p>
                  )}
                  
                  {/* ഫോട്ടോ ഇല്ലാത്തപ്പോൾ മാത്രം ടാഗുകൾ കാണിക്കുക */}
                  {!task.image && (
                    <div className="task-tags">
                      <span className={`tag status ${task.status.toLowerCase().replace(' ', '-')}`}>
                        <span className="dot"></span> {task.status}
                      </span>
                      <span className={`tag priority ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                  )}

                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="task-footer">
                    <div className="assignees">
                      <div className="avatar">A</div>
                      <div className="avatar">B</div>
                    </div>
                    <div className="task-meta">
                      <span className="task-date">📅 {task.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Create Button */}
      <button className="create-task-fab" onClick={() => setShowCreateModal(true)}>
        + Create Task
      </button>

      {/* Bottom Navigation */}
      <div className="bottom-nav-container">
        <div className="bottom-nav">
          <Link to="/home" className="nav-item">
            <span className="nav-icon">🏠</span>
          </Link>
          <Link to="/clock-in" className="nav-item">
            <span className="nav-icon">⏱️</span>
          </Link>
          <Link to="/tasks" className="nav-item active">
            <span className="nav-icon">📝</span>
          </Link>
          <Link to="/my-profile" className="nav-item">
            <span className="nav-icon">👤</span>
          </Link>
        </div>
      </div>

      {/* FULL SCREEN CREATE TASK MODAL */}
      {showCreateModal && (
        <div className="full-screen-modal-wrapper">
          {creationStep === 1 ? (
            <div className="full-screen-modal">
              <div className="modal-header-nav">
                <button className="back-btn" onClick={closeCreateModal}>←</button>
                <h3>Create New Task</h3>
                <div style={{width: '24px'}}></div>
              </div>
              
              <div className="modal-scroll-content">
                <form onSubmit={handleCreateTask} className="premium-form">
                  <div className="form-group">
                    <label>Task Name</label>
                    <div className="premium-input-box">
                      <span className="input-icon">📝</span>
                      <input 
                        type="text" 
                        placeholder="E.g. Review UI Design" 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <div className="premium-input-box textarea-box">
                      <span className="input-icon align-top">📋</span>
                      <textarea 
                        placeholder="Write detailed task description..." 
                        value={newTaskDesc}
                        onChange={(e) => setNewTaskDesc(e.target.value)}
                        rows="4"
                      ></textarea>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Attachment (Optional)</label>
                    <div className="premium-upload-container">
                      {newTaskImage ? (
                        <div className="premium-image-preview">
                          <img src={newTaskImage} alt="Preview" />
                          <button type="button" className="change-img-btn" onClick={() => setNewTaskImage(null)}>
                            ✕ Remove Image
                          </button>
                        </div>
                      ) : (
                        <label className="premium-upload-box">
                          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                          <div className="upload-icon-circle">
                            <span>📷</span>
                          </div>
                          <span className="upload-title">Tap to upload a photo</span>
                          <span className="upload-subtitle">PNG, JPG up to 5MB</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Priority Level</label>
                    <div className="premium-priority-options">
                      {['Low', 'Medium', 'High'].map(level => (
                        <label key={level} className={`premium-priority-btn ${newPriority === level ? 'active ' + level.toLowerCase() : ''}`}>
                          <input 
                            type="radio" 
                            name="priority" 
                            value={level} 
                            checked={newPriority === level}
                            onChange={(e) => setNewPriority(e.target.value)}
                            hidden
                          />
                          {level}
                        </label>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-bottom-action">
                <button type="button" className="btn-primary full-width" onClick={handleCreateTask}>
                  Create Task
                </button>
              </div>
            </div>
          ) : (
            // Success Modal View
            <div className="success-overlay">
              <div className="success-card">
                <div className="success-icon-large">
                  <span className="shield-icon">🛡️</span>
                  <span className="check-icon">✓</span>
                </div>
                <h2>Task Created!</h2>
                <p>Your task has been successfully added to the To Do list.</p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}