import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import AdminPasswordResetOTP from './pages/AdminPasswordResetOTP';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/password-reset/otp" element={<AdminPasswordResetOTP />} />
      </Routes>
    </Router>
  </React.StrictMode>
);