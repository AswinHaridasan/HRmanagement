
import React, { useState } from "react";
import "./ExpensePage.css";
import { useNavigate } from "react-router-dom";

export default function ExpensePage() {

  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Healthcare",
    "Entertainment",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0 || !expenseDate || !description.trim()) {
      alert("Please enter valid expense details.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      category,
      amount: Number(amount),
      date: expenseDate,
      paymentMethod,
      description,
    };

    setExpenses((prev) => [newExpense, ...prev]);

    setAmount("");
    setExpenseDate("");
    setDescription("");
    setCategory("Food");
    setPaymentMethod("Cash");
    setShowForm(false);
    setShowSuccess(true);
  };

  const totalExpense = expenses.reduce(
    (total, item) => total + item.amount,
    0
  );

  const today = new Date().toISOString().split("T")[0];

  const todayExpense = expenses
    .filter((item) => item.date === today)
    .reduce((total, item) => total + item.amount, 0);

  const filteredExpenses =
    activeTab === "All"
      ? expenses
      : expenses.filter((item) => item.category === activeTab);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  const getCategoryIcon = (name) => {
    const icons = {
      Food: "🍔",
      Travel: "🚗",
      Shopping: "🛍️",
      Bills: "🧾",
      Healthcare: "🏥",
      Entertainment: "🎬",
      Other: "📦",
    };

    return icons[name] || "📦";
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="expense-page">

      {/* Header */}
      <header className="expense-header">
        <div className="expense-header-top">
          <button 
            className="expense-back-btn" 
            aria-label="Go back"
            onClick={() => navigate(-1)} 
          >
            ‹-
          </button>

          <h2>Expense Management</h2>

          <button className="expense-notification">♧</button>
        </div>
      </header>

      <main className="expense-content">

        {/* Welcome Banner */}
        <section className="expense-banner">
          <div className="expense-banner-text">
            <span className="expense-banner-small">
              PERSONAL FINANCE
            </span>

            <h2>Track Your Expenses</h2>

            <p>Manage your spending smartly.</p>
          </div>

          <div className="expense-banner-icon">💰</div>
        </section>

        {/* Expense Summary */}
        <section className="expense-summary-card">
          <div className="expense-section-heading">
            <h3>Expense Overview</h3>
            <span>This Month</span>
          </div>

          <div className="expense-total-box">
            <p>Total Expenses</p>
            <h2>{formatCurrency(totalExpense)}</h2>
            <span>All recorded expenses</span>
          </div>

          <div className="expense-stats-grid">
            <div className="expense-stat">
              <div className="expense-stat-icon today-icon">
                📅
              </div>
              <p>Today</p>
              <h3>{formatCurrency(todayExpense)}</h3>
            </div>

            <div className="expense-stat">
              <div className="expense-stat-icon count-icon">
                📊
              </div>
              <p>Transactions</p>
              <h3>{expenses.length}</h3>
            </div>
          </div>
        </section>

        {/* Add Expense Button */}
        <button
          className="add-expense-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <span>＋</span>
          Add New Expense
        </button>

        {/* Add Expense Form */}
        {showForm && (
          <section className="expense-form-card">

            <div className="expense-section-heading">
              <div>
                <h3>Add Expense</h3>
                <p>Enter your expense details</p>
              </div>

              <button
                className="expense-close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="expense-form-group">
                <label>Expense Category</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="expense-form-group">
                <label>Amount (₹)</label>

                <input
                  type="number"
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="expense-form-group">
                <label>Expense Date</label>

                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  required
                />
              </div>

              <div className="expense-form-group">
                <label>Payment Method</label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Bank Transfer</option>
                </select>
              </div>

              <div className="expense-form-group">
                <label>Expense Description</label>

                <textarea
                  placeholder="Write expense details..."
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="expense-submit-btn">
                Save Expense
                <span>→</span>
              </button>

            </form>
          </section>
        )}

        {/* Expense History */}
        <section className="expense-history-section">

          <div className="expense-section-heading">
            <h3>Recent Expenses</h3>

            <span className="expense-count">
              {expenses.length} Records
            </span>
          </div>

          {/* Category Tabs */}
          <div className="expense-tabs">
            {["All", ...categories].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Expense List */}
          {filteredExpenses.length === 0 ? (
            <div className="expense-empty-state">
              <div className="expense-empty-icon">💸</div>

              <h3>No Expenses Found</h3>

              <p>
                Start tracking your expenses by adding your first transaction.
              </p>

              <button onClick={() => setShowForm(true)}>
                + Add Expense
              </button>
            </div>
          ) : (
            filteredExpenses.map((item) => (
              <div className="expense-item-card" key={item.id}>

                <div className="expense-item-icon">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="expense-item-details">
                  <h4>{item.category}</h4>
                  <p>{item.description}</p>

                  <span>
                    {item.date} · {item.paymentMethod}
                  </span>
                </div>

                <div className="expense-item-right">
                  <strong>
                    {formatCurrency(item.amount)}
                  </strong>

                  <button
                    className="expense-delete-btn"
                    onClick={() => deleteExpense(item.id)}
                    aria-label="Delete expense"
                  >
                    🗑️
                  </button>
                </div>

              </div>
            ))
          )}

        </section>

      </main>

      

      {/* Success Modal */}
      {showSuccess && (
        <div className="expense-success-overlay">
          <div className="expense-success-card">

            <div className="expense-success-check">✓</div>

            <h2>Expense Added!</h2>

            <p>
              Your expense has been successfully recorded.
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
