import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiShield,
  FiAlertTriangle,
  FiMapPin,
  FiPhone,
  FiFileText,
  FiCheckCircle,
  FiLock,
  FiHeart,
  FiArrowRight,
  FiUsers
} from 'react-icons/fi';
import IncidentMap from '../components/map/IncidentMap';
import { reportService } from '../services/reportService';

const Home = () => {
  const [publicReports, setPublicReports] = useState([]);

  useEffect(() => {
    const fetchPublicReports = async () => {
      try {
        const res = await reportService.getPublicSafetyMap();
        if (res.success && res.data) {
          setPublicReports(res.data.reports || []);
        }
      } catch (err) {
        // Quiet fail
      }
    };
    fetchPublicReports();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 0 3rem 0',
          background: 'radial-gradient(ellipse at 50% -20%, rgba(225, 29, 72, 0.25), transparent 70%)',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f43f5e',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.5rem'
            }}
          >
            <FiShield size={16} /> Empowering Women with Real-Time Safety Technology
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              lineHeight: 1.15,
              maxWidth: '900px',
              margin: '0 auto 1.5rem auto',
              fontWeight: 900
            }}
          >
            Instant Emergency Help & <br />
            <span style={{ color: 'var(--primary-500)' }}>Verified Incident Reporting</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-muted)',
              maxWidth: '720px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6
            }}
          >
            Broadcast your live GPS coordinates to trusted emergency contacts in seconds, access verified 24/7 national helplines, and report unsafe zones to protect the community.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2rem'
            }}
          >
            <Link to="/sos" className="btn btn-primary btn-lg" style={{ fontSize: '1.1rem', padding: '0.9rem 2rem' }}>
              <FiAlertTriangle size={20} /> Open Emergency SOS
            </Link>

            <Link to="/report-incident" className="btn btn-secondary btn-lg">
              <FiFileText size={18} /> Report Unsafe Incident
            </Link>

            <Link to="/helplines" className="btn btn-secondary btn-lg">
              <FiPhone size={18} /> 24/7 Helplines
            </Link>
          </div>

          {/* Quick Disclaimer */}
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto' }}>
            <FiAlertTriangle style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px', color: '#fbbf24' }} />
            Safety Notice: In extreme immediate life danger, always dial <strong>112</strong> or <strong>1091</strong> directly.
          </p>
        </div>
      </section>

      {/* Core Safety Features Grid */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Engineered for Total Protection</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            A complete safety ecosystem combining automated emergency alerts, geospatial analysis, and community vigilance.
          </p>
        </div>

        <div className="grid-3">
          {/* Feature 1 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(225, 29, 72, 0.15)',
                color: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FiAlertTriangle size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>One-Tap SOS Broadcast</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              Instantly sends high-accuracy GPS coordinates, map tracking links, and emergency alerts to all your registered trusted contacts via automated SMS and email.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FiMapPin size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>False Report Detection</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              Built-in geospatial duplicate detection engine prevents false and duplicate spam by analyzing proximity distance thresholds and NLP content similarity before admin review.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FiLock size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Encrypted & Private</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              Strict privacy architecture. User locations and emergency contacts are never exposed publicly. Evidence files undergo strict MIME-type & antivirus safety checks.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Safety Map Preview */}
      <section className="container">
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Community Safety Heatmap</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                Explore verified reported zones and unsafe locations to navigate safely.
              </p>
            </div>
            <Link to="/report-incident" className="btn btn-outline btn-sm">
              <FiFileText /> Submit a Hazard / Report
            </Link>
          </div>

          <IncidentMap reports={publicReports} height="360px" zoom={13} />
        </div>
      </section>

      {/* Helplines Directory Quick Access */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0 }}>National Emergency Helplines</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Direct toll-free contact numbers for verified legal, police, and counseling services.
          </p>
        </div>

        <div className="grid-4">
          <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e11d48', display: 'block', marginBottom: '4px' }}>
              112
            </span>
            <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>National Emergency</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Police, Ambulance, Fire</p>
            <a href="tel:112" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              <FiPhone /> Call Now
            </a>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f43f5e', display: 'block', marginBottom: '4px' }}>
              1091
            </span>
            <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>Women in Distress</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>24/7 Dedicated Support</p>
            <a href="tel:1091" className="btn btn-secondary btn-sm" style={{ width: '100%', color: '#fb7185' }}>
              <FiPhone /> Call Now
            </a>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#6366f1', display: 'block', marginBottom: '4px' }}>
              1930
            </span>
            <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>Cyber Crime Helpline</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Online Harassment & Fraud</p>
            <a href="tel:1930" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              <FiPhone /> Call Now
            </a>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981', display: 'block', marginBottom: '4px' }}>
              108
            </span>
            <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>Emergency Ambulance</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Trauma & Medical Care</p>
            <a href="tel:108" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              <FiPhone /> Call Now
            </a>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/helplines" className="btn btn-secondary">
            View Complete National Helpline Directory <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
