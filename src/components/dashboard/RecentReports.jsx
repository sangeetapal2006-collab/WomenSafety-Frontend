import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiPlus, FiClock, FiMapPin } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';

const RecentReports = ({ reports = [], loading = false }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Verified':
        return 'badge-verified';
      case 'Under Review':
        return 'badge-under-review';
      case 'Duplicate':
        return 'badge-duplicate';
      case 'Suspicious':
        return 'badge-suspicious';
      case 'Rejected':
        return 'badge-rejected';
      case 'Resolved':
        return 'badge-resolved';
      default:
        return 'badge-pending';
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex'
            }}
          >
            <FiFileText size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem' }}>Recent Incident Reports</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Submitted by you for safety verification</span>
          </div>
        </div>

        <Link to="/report-incident" className="btn btn-secondary btn-sm">
          <FiPlus size={14} /> Report
        </Link>
      </div>

      {reports.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
            No incident reports submitted recently.
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Help build a safer community map by reporting unsafe areas or incidents.
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {reports.slice(0, 3).map((r) => (
            <div
              key={r._id}
              style={{
                padding: '0.85rem 1rem',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{r.title}</h5>
                <span className={`badge ${getBadgeClass(r.status)}`}>{r.status}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiMapPin size={12} /> {r.address}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiClock size={12} /> {formatDate(r.createdAt)}
                </span>
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
            <Link to="/my-reports" style={{ color: 'var(--primary-500)', fontSize: '0.85rem', fontWeight: 600 }}>
              View all reports & review status &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentReports;
