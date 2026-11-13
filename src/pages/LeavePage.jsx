
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LeavePage.css";

export default function LeavePage() {

  const navigate = useNavigate();
  
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fromDate || !toDate || !reason.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (new Date(toDate) < new Date(fromDate)) {
      alert("End date cannot be before start date.");
      return;
    }

    const newRequest = {
      id: Date.now(),
      type: leaveType,
      from: fromDate,
      to: toDate,
      reason,
      status: "Pending",
    };

    setRequests((prev) => [newRequest, ...prev]);
    setShowSuccess(true);

    setFromDate("");
    setToDate("");
    setReason("");
  };

  const filteredRequests =
    activeTab === "All"
      ? requests
      : requests.filter((item) => item.status === activeTab);

  const calculateDays = (from, to) => {
    if (!from || !to) return 0;

    const start = new Date(from);
    const end = new Date(to);

    return Math.round((end - start) / 86400000) + 1;
  };

  return (
    <div className="leave-page">

      {/* Header */}
      <header className="leave-header">
        <div className="leave-header-top">
          <button 
            className="leave-back-btn" 
            aria-label="Go back"
            onClick={() => navigate(-1)} 
          >
            ‹
          </button>

          <h2>Leave Management</h2>

          <button className="leave-notification" aria-label="Notifications">
            ♧
          </button>
        </div>
      </header>

      <main className="leave-content">

        {/* Welcome Banner */}
        <section className="leave-banner">
          <div className="leave-banner-text">
            <span className="banner-small">EMPLOYEE PORTAL</span>
            <h2>Manage Your Leave</h2>
            <p>Plan your time off with ease.</p>
          </div>

          <div className="leave-banner-icon">🌴</div>
        </section>

        {/* Leave Balance */}
        <section className="leave-balance-card">
          <div className="section-heading">
            <h3>Leave Balance</h3>
            <span>This Year</span>
          </div>

          <div className="balance-grid">
            <div className="balance-item">
              <div className="balance-icon casual">📅</div>
              <h2>12</h2>
              <p>Casual Leave</p>
            </div>

            <div className="balance-item">
              <div className="balance-icon sick">🏥</div>
              <h2>08</h2>
              <p>Sick Leave</p>
            </div>

            <div className="balance-item">
              <div className="balance-icon annual">🌴</div>
              <h2>15</h2>
              <p>Annual Leave</p>
            </div>
          </div>
        </section>

        {/* Apply Leave Form */}
        <section className="leave-form-card">
          <div className="section-heading">
            <div>
              <h3>Apply for Leave</h3>
              <p>Fill in the details below</p>
            </div>
            <span className="form-heading-icon">✎</span>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="leave-form-group">
              <label>Leave Type</label>

              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Annual Leave</option>
                <option>Emergency Leave</option>
                <option>Unpaid Leave</option>
              </select>
            </div>

            <div className="leave-date-row">
              <div className="leave-form-group">
                <label>From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  required
                />
              </div>

              <div className="leave-form-group">
                <label>To Date</label>
                <input
                  type="date"
                  min={fromDate || undefined}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {fromDate && toDate && new Date(toDate) >= new Date(fromDate) && (
              <div className="leave-duration">
                <span>📆 Total Leave Duration</span>
                <strong>
                  {calculateDays(fromDate, toDate)} Days
                </strong>
              </div>
            )}

            <div className="leave-form-group">
              <label>Reason for Leave</label>

              <textarea
                placeholder="Write your reason here..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="4"
                required
              />
            </div>

            <button type="submit" className="leave-submit-btn">
              Submit Leave Request
              <span>→</span>
            </button>

          </form>
        </section>

        {/* Leave History */}
        <section className="leave-history-section">

          <div className="section-heading">
            <h3>My Leave Requests</h3>
            <span className="request-count">
              {requests.length} Requests
            </span>
          </div>

          <div className="leave-tabs">
            {["All", "Pending", "Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {filteredRequests.length === 0 ? (
            <div className="leave-empty-state">
              <div className="empty-leave-icon">📋</div>
              <h3>No Leave Requests</h3>
              <p>
                You haven't submitted any {activeTab === "All" ? "" : activeTab.toLowerCase()} leave requests yet.
              </p>
            </div>
          ) : (
            filteredRequests.map((item) => (
              <div className="leave-request-item" key={item.id}>
                <div className="request-top">
                  <div>
                    <h4>{item.type}</h4>
                    <p>{item.reason}</p>
                  </div>

                  <span className={`request-status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>

                <div className="request-dates">
                  <span>📅 {item.from}</span>
                  <span>→</span>
                  <span>{item.to}</span>
                </div>

                <div className="request-duration">
                  {calculateDays(item.from, item.to)} Day(s)
                </div>
              </div>
            ))
          )}

        </section>

      </main>


      {/* Success Modal */}
      {showSuccess && (
        <div className="leave-success-overlay">
          <div className="leave-success-card">
            <div className="success-check">✓</div>

            <h2>Request Submitted!</h2>
            <p>
              Your leave request has been submitted successfully.
              Waiting for approval.
            </p>

            <button onClick={() => setShowSuccess(false)}>
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
