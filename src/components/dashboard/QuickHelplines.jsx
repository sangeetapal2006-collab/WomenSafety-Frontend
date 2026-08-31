import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiExternalLink, FiShield, FiAlertTriangle, FiGlobe, FiActivity } from 'react-icons/fi';

const QuickHelplines = ({ helplines = [] }) => {
  const quickList = [
    { name: 'National Emergency', number: '112', desc: 'Police / Medical / Fire', icon: FiAlertTriangle, color: '#e11d48' },
    { name: 'Women Helpline', number: '1091', desc: '24x7 Women Distress', icon: FiShield, color: '#f43f5e' },
    { name: 'Cyber Crime', number: '1930', desc: 'Online Harassment & Fraud', icon: FiGlobe, color: '#6366f1' },
    { name: 'Ambulance', number: '108', desc: 'Emergency Medical Care', icon: FiActivity, color: '#10b981' }
  ];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#f43f5e',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex'
            }}
          >
            <FiPhone size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem' }}>Direct Emergency Helplines</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Toll-free 24/7 national response lines</span>
          </div>
        </div>

        <Link to="/helplines" className="btn btn-secondary btn-sm">
          All Lines <FiExternalLink size={12} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
        {quickList.map((item, idx) => {
          const Icon = item.icon;
          return (
            <a
              key={idx}
              href={`tel:${item.number}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '0.9rem',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="helpline-quick-btn"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <Icon size={18} color={item.color} />
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{item.number}</span>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '2px' }}>{item.desc}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default QuickHelplines;
