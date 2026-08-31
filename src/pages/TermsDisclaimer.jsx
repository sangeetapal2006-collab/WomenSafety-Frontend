import React from 'react';
import { FiAlertTriangle, FiPhone, FiShield, FiInfo } from 'react-icons/fi';

const TermsDisclaimer = () => {
  return (
    <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '850px' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <FiAlertTriangle size={28} color="#f59e0b" />
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Terms & Safety Disclaimer</h1>
        </div>

        {/* High Priority Warning Banner */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '2px solid #ef4444',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          <h3 style={{ color: '#f87171', margin: '0 0 0.5rem 0', fontSize: '1.15rem' }}>
            CRITICAL EMERGENCY NOTICE & SERVICE LIMITATIONS
          </h3>
          <p style={{ color: '#fecdd3', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>
            The <strong>Women Safety Portal</strong> is an auxiliary digital support and community reporting system. It is <strong>NOT</strong> a replacement for official state police (112 / 100), emergency ambulance dispatch, fire departments, medical practitioners, or other licensed governmental emergency responders.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              1. No Direct Law Enforcement Dispatch Guarantee
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              Triggering the SOS button alerts your personal registered emergency contacts and logs the event on this portal. <em>It does not directly dispatch police officers or emergency vehicles to your location</em>. In life-threatening emergencies, dial <strong>112</strong> or <strong>1091</strong> directly.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              2. GPS Location Accuracy Disclaimers
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              Location accuracy depends heavily on your device hardware, mobile network carrier, satellite reception, and surrounding physical structures. The portal displays accuracy in meters (~Xm). No guarantee is made that captured coordinates represent exact millimeter positioning.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              3. Telecommunication & Notification Dependencies
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              SMS and email emergency notifications rely on third-party mobile telecom operators and internet service providers. Delivery times may be delayed by carrier network congestion, out-of-coverage zones, or device power status.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              4. False Reporting Prohibitions
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              Submitting fabricated or malicious reports intentionally is strictly prohibited. The system employs automated geospatial duplicate detection and audit logging to identify bad-faith misuse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsDisclaimer;
