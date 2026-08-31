import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiFileText,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiActivity,
  FiMapPin,
  FiPhone,
  FiArrowRight
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error: toastError } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load admin statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Aggregating portal security metrics..." />;
  }

  const counts = stats?.counts || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', margin: '0 0 4px 0' }}>Safety Operations Overview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Live metrics on user registrations, emergency incidents, duplicate detection safeguards, and SOS broadcasts.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid-4">
        {/* Total Users */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Users</span>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '6px', borderRadius: '8px' }}>
              <FiUsers size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>{counts.totalUsers || 0}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Registered SafeWoman accounts</span>
        </div>

        {/* Total Reports */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Incident Reports</span>
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', padding: '6px', borderRadius: '8px' }}>
              <FiFileText size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>{counts.totalReports || 0}</h2>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', marginTop: '2px' }}>
            <span style={{ color: '#f59e0b' }}>{counts.pendingReports || 0} Pending</span>
            <span>•</span>
            <span style={{ color: '#10b981' }}>{counts.verifiedReports || 0} Verified</span>
          </div>
        </div>

        {/* Flagged / Duplicate Reports */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Duplicate / Suspicious</span>
            <div style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24', padding: '6px', borderRadius: '8px' }}>
              <FiAlertTriangle size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: '#fbbf24' }}>
            {(counts.duplicateReports || 0) + (counts.suspiciousReports || 0)}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Flagged by geospatial AI engine</span>
        </div>

        {/* SOS Broadcasts */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>SOS Events</span>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '6px', borderRadius: '8px' }}>
              <FiAlertTriangle size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: '#f87171' }}>
            {counts.totalSOSEvents || 0}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
            {counts.activeSOSEvents > 0 ? `⚠️ ${counts.activeSOSEvents} Active Emergency` : 'All Resolved / Logged'}
          </span>
        </div>
      </div>

      {/* Two Column Layout: Recent Reports & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Reports for Moderation */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Recent Reports for Review</h3>
            <Link to="/admin/reports" className="btn btn-secondary btn-sm">
              Moderation Queue <FiArrowRight size={12} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(stats?.recentReports || []).map((r) => (
              <div
                key={r._id}
                style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{r.title}</h5>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Reporter: {r.reporter?.name || 'Anonymous'} • {r.address}
                  </span>
                </div>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background:
                      r.status === 'Verified'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : r.status === 'Duplicate'
                        ? 'rgba(217, 119, 6, 0.2)'
                        : 'rgba(245, 158, 11, 0.2)',
                    color:
                      r.status === 'Verified'
                        ? '#10b981'
                        : r.status === 'Duplicate'
                        ? '#fbbf24'
                        : '#f59e0b'
                  }}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', margin: '0 0 1rem 0' }}>Incident Reports by Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {(stats?.categoryStats || []).map((cat) => (
              <div
                key={cat._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0.9rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.875rem'
                }}
              >
                <span>{cat._id}</span>
                <strong style={{ color: 'var(--primary-500)' }}>{cat.count} report{cat.count !== 1 ? 's' : ''}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
