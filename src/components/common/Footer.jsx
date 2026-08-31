import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiPhone, FiAlertTriangle, FiLock, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer
      style={{
        background: '#070a11',
        borderTop: '1px solid var(--border-color)',
        padding: '3rem 0 2rem 0',
        marginTop: 'auto',
        color: 'var(--text-muted)'
      }}
    >
      <div className="container">
        {/* Emergency Quick Numbers Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.15), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(225, 29, 72, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                background: '#e11d48',
                color: 'white',
                padding: '12px',
                borderRadius: '50%',
                display: 'flex'
              }}
            >
              <FiPhone size={24} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', margin: 0, fontSize: '1.1rem' }}>
                In Immediate Life-Threatening Danger?
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
                Do not wait for portal review. Call official national emergency responders directly.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="tel:112" className="btn btn-primary">
              <FiPhone /> Call 112 (National)
            </a>
            <a href="tel:1091" className="btn btn-secondary" style={{ color: '#fb7185' }}>
              <FiPhone /> Call 1091 (Women)
            </a>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* Brand & Project Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <FiShield size={22} color="#f43f5e" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff', fontSize: '1.15rem' }}>
                SafeWoman Portal
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              A full-stack safety and incident reporting platform engineered to empower women with instant SOS location broadcasting, verified incident reporting, and 24/7 emergency helplines.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#10b981' }}>
              <FiLock size={14} /> End-to-End Encrypted Authentication
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '0.95rem' }}>Quick Access</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/sos" style={{ color: 'var(--text-muted)' }}>Emergency SOS Hub</Link>
              </li>
              <li>
                <Link to="/helplines" style={{ color: 'var(--text-muted)' }}>National Helpline Directory</Link>
              </li>
              <li>
                <Link to="/report-incident" style={{ color: 'var(--text-muted)' }}>Report Unsafe Incident</Link>
              </li>
              <li>
                <Link to="/safety-resources" style={{ color: 'var(--text-muted)' }}>Safety Tips & Legal Rights</Link>
              </li>
            </ul>
          </div>

          {/* User & Admin */}
          <div>
            <h5 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '0.95rem' }}>Account & Security</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>User Dashboard</Link>
              </li>
              <li>
                <Link to="/emergency-contacts" style={{ color: 'var(--text-muted)' }}>Manage Trusted Contacts</Link>
              </li>
              <li>
                <Link to="/my-reports" style={{ color: 'var(--text-muted)' }}>Track Incident Reports</Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--text-muted)' }}>Admin Login</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Safety Policies */}
          <div>
            <h5 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '0.95rem' }}>Legal & Disclaimer</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/privacy-policy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-disclaimer" style={{ color: 'var(--text-muted)' }}>Terms & Safety Disclaimer</Link>
              </li>
              <li style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Developed for BCA Final Year Academic Project.
              </li>
            </ul>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-dim)'
          }}
        >
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} Women Safety Portal. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <FiHeart color="#e11d48" size={14} /> for Women Safety & Empowerment
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
