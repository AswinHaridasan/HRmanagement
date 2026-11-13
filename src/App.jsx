import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from "./pages/WelcomePage/WelcomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import TermsPage from './pages/TermsPage.jsx';
import WelcomeSetupPage from './pages/WelcomeSetupPage.jsx';
import MyProfilePage from './pages/MyProfilePage.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';
import HomePage from './pages/HomePage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import SignInPhonePage from './pages/SignInPhonePage.jsx';
import SignInEmployeePage from './pages/SignInEmployeePage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ClockInPage from './pages/ClockInPage.jsx';
import AttendantPage from './pages/AttendantPage.jsx';
import TaskPage from './pages/TaskPage.jsx';
import LeavePage from './pages/LeavePage.jsx';
import ExpensePage from './pages/ExpensePage.jsx';
import OfficeAssetsPage from './pages/OfficeAssetsPage.jsx';
import ChangePasswordPage from './pages/ChangePasswordPage.jsx';
import PayrollPage from './pages/PayrollPage.jsx';
import MessagePage from './pages/MessagePage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin-phone" element={<SignInPhonePage />} />
        <Route path="/signin-employee" element={<SignInEmployeePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/welcome-setup" element={<WelcomeSetupPage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/clock-in" element={<ClockInPage />} />
        <Route path="/attendant" element={<AttendantPage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/leave" element={<LeavePage />} />
        <Route path="/expense" element={<ExpensePage />} />
        <Route path="/office-assets" element={<OfficeAssetsPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/messages" element={<MessagePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App