import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public & User Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SOSPage from './pages/SOSPage';
import Dashboard from './pages/Dashboard';
import EmergencyContacts from './pages/EmergencyContacts';
import ReportIncident from './pages/ReportIncident';
import MyReports from './pages/MyReports';
import Helplines from './pages/Helplines';
import SafetyResources from './pages/SafetyResources';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsDisclaimer from './pages/TermsDisclaimer';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReports from './pages/admin/AdminReports';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSOS from './pages/admin/AdminSOS';
import AdminHelplines from './pages/admin/AdminHelplines';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';

// Route Guards
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/helplines" element={<Helplines />} />
        <Route path="/safety-resources" element={<SafetyResources />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-disclaimer" element={<TermsDisclaimer />} />

        {/* Protected User Routes */}
        <Route
          path="/sos"
          element={
            <ProtectedRoute>
              <SOSPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency-contacts"
          element={
            <ProtectedRoute>
              <EmergencyContacts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-incident"
          element={
            <ProtectedRoute>
              <ReportIncident />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reports"
          element={
            <ProtectedRoute>
              <MyReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sos" element={<AdminSOS />} />
          <Route path="helplines" element={<AdminHelplines />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
