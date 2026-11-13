import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PayrollPage.css";

// Setting data to empty to trigger the empty state
const payrollData = []; 

const PayrollPage = () => {
  const navigate = useNavigate();

  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);

  const getNetSalary = (item) =>
    item.basic + item.allowance - item.tax - item.pf;

  const handleSavePayslip = () => {
    window.print();
    setShowSuccess(true);
  };

  return (
    <div className="payroll-page">

      <header className="payroll-header">
        <button onClick={() => navigate(-1)}>← Back</button>
        <h2>Payroll and Tax</h2>
        <span></span>
      </header>

      <main className="payroll-content">

        {!selectedPayroll ? (
          <>
            <div className="payroll-heading">
              <h2>My Payroll</h2>
              <p>View your monthly salary and payslip history.</p>
            </div>

            <div className="payroll-list">
              {payrollData.length === 0 ? (
                // --- PROFESSIONAL EMPTY STATE ---
                <div className="payroll-empty-state">
                  <div className="empty-icon-wrapper">
                    <span className="empty-document-icon">📄</span>
                  </div>
                  <h3>No Payroll Records Found</h3>
                  <p>Your payslips will appear here automatically once they are processed and published by your HR department.</p>
                  <button className="empty-refresh-btn" onClick={() => window.location.reload()}>
                    Refresh Page
                  </button>
                </div>
              ) : (
                payrollData.map((item) => (
                  <div className="payroll-month-card" key={item.month}>

                    <div className="payroll-month-heading">
                      <div>
                        <span className="payroll-calendar-icon">📅</span>
                        <h3>{item.month}</h3>
                      </div>
                      <span className="payroll-paid-badge">Paid</span>
                    </div>

                    <div className="payroll-mini-details">
                      <div>
                        <span>Basic Salary</span>
                        <strong>{formatMoney(item.basic)}</strong>
                      </div>

                      <div>
                        <span>Allowance</span>
                        <strong>{formatMoney(item.allowance)}</strong>
                      </div>

                      <div>
                        <span>Working Days</span>
                        <strong>{item.working}</strong>
                      </div>

                      <div>
                        <span>Paid Days</span>
                        <strong>{item.paid}</strong>
                      </div>
                    </div>

                    <div className="payroll-card-footer">
                      <div>
                        <span>Net Salary</span>
                        <strong>{formatMoney(getNetSalary(item))}</strong>
                      </div>

                      <button
                        onClick={() => setSelectedPayroll(item)}
                      >
                        View Details →
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="payslip-details">

            <div className="payslip-top">
              <button
                className="payslip-back"
                onClick={() => setSelectedPayroll(null)}
              >
                ← Back
              </button>
              <span className="payroll-paid-badge">Paid</span>
            </div>

            <div className="payslip-title">
              <div className="payslip-icon">💰</div>
              <h2>Payslip Details</h2>
              <p>{selectedPayroll.month}</p>
            </div>

            <div className="salary-highlight">
              <span>Total Net Salary</span>
              <h1>{formatMoney(getNetSalary(selectedPayroll))}</h1>
              <p>Successfully processed</p>
            </div>

            <div className="payroll-working-card">
              <h3>Attendance Summary</h3>
              <div>
                <span>Working Days</span>
                <strong>{selectedPayroll.working} Days</strong>
              </div>
              <div>
                <span>Paid Days</span>
                <strong>{selectedPayroll.paid} Days</strong>
              </div>
            </div>

            <div className="payroll-breakdown-card">
              <h3>Payroll Details</h3>

              <div className="breakdown-heading">
                <span>Earnings</span>
                <span>Amount</span>
              </div>

              <div className="breakdown-row">
                <span>Basic Salary</span>
                <strong>{formatMoney(selectedPayroll.basic)}</strong>
              </div>

              <div className="breakdown-row">
                <span>Allowances</span>
                <strong className="earning">
                  + {formatMoney(selectedPayroll.allowance)}
                </strong>
              </div>

              <div className="breakdown-heading deduction-heading">
                <span>Deductions</span>
                <span>Amount</span>
              </div>

              <div className="breakdown-row">
                <span>Income Tax</span>
                <strong className="deduction">
                  - {formatMoney(selectedPayroll.tax)}
                </strong>
              </div>

              <div className="breakdown-row">
                <span>Provident Fund</span>
                <strong className="deduction">
                  - {formatMoney(selectedPayroll.pf)}
                </strong>
              </div>

              <div className="breakdown-total">
                <span>Total Salary</span>
                <strong>{formatMoney(getNetSalary(selectedPayroll))}</strong>
              </div>
            </div>

            <button
              className="save-payslip-btn"
              onClick={handleSavePayslip}
            >
              ↓ Save Payslip / Print
            </button>

          </div>
        )}

      </main>

      {showSuccess && (
        <div className="payroll-modal-overlay">
          <div className="payroll-success-modal">
            <div className="payroll-success-icon">✓</div>
            <h2>Payslip Ready!</h2>
            <p>Your payslip print/save window has been opened.</p>
            <button onClick={() => setShowSuccess(false)}>
              Close Message
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default PayrollPage;