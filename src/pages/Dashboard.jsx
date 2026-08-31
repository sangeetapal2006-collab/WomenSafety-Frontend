import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiShield,
  FiAlertTriangle,
  FiUsers,
  FiMapPin,
  FiPhone,
  FiFileText,
  FiSettings,
  FiBell,
  FiUser
} from 'react-icons/fi';
import { useAuth } from '../hooks';
import SOSButton from '../components/dashboard/SOSButton';
import LocationCard from '../components/dashboard/LocationCard';
import ContactsWidget from '../components/dashboard/ContactsWidget';
import QuickHelplines from '../components/dashboard/QuickHelplines';
import RecentReports from '../components/dashboard/RecentReports';
import { contactService } from '../services/contactService';
import { reportService } from '../services/reportService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [contactsRes, reportsRes] = await Promise.allSettled([
        contactService.getContacts(),
        reportService.getMyReports({ limit: 5 })
      ]);

      if (contactsRes.status === 'fulfilled' && contactsRes.value.success) {
        setContacts(contactsRes.value.data.contacts || []);
      }

      if (reportsRes.status === 'fulfilled' && reportsRes.value.success) {
        setReports(reportsRes.value.data.reports || []);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 69, 0.7), rgba(15, 23, 42, 0.9))',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              ● Safety System Active
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', margin: '0 0 4px 0' }}>
            Welcome, {user?.name || 'User'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Your emergency dashboard is connected. Location services & emergency contacts are ready.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/emergency-contacts" className="btn btn-secondary btn-sm">
            <FiUsers /> Contacts ({contacts.length})
          </Link>
          <Link to="/profile" className="btn btn-secondary btn-sm">
            <FiSettings /> Settings
          </Link>
        </div>
      </div>

      {/* Main Grid: SOS & Location Side by Side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* Emergency SOS Control Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <SOSButton onSOSTriggered={() => loadDashboardData()} />
        </div>

        {/* Location & GPS Status Card */}
        <LocationCard />
      </div>

      {/* Secondary Row: Contacts, Quick Helplines, Recent Reports */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}
      >
        <ContactsWidget contacts={contacts} loading={loading} />
        <QuickHelplines />
        <RecentReports reports={reports} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
