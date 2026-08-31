import React from 'react';
import { FiLock, FiShield, FiDatabase, FiEyeOff, FiCheckCircle } from 'react-icons/fi';

const PrivacyPolicy = () => {
  return (
    <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '850px' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <FiLock size={28} color="#10b981" />
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Privacy & Data Protection Policy</h1>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Your safety and data confidentiality are the cornerstone of the Women Safety Portal platform. This policy outlines how information is collected, encrypted, and protected under strict data security principles.
        </p>

        <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              1. What Data We Collect & Why
            </h3>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              <li>
                <strong>Personal Account Details:</strong> Name, phone number, encrypted password hash, and optional blood group for medical response preparedness.
              </li>
              <li>
                <strong>Emergency Contacts:</strong> Names, contact numbers, and relationship tags designated by you solely for SOS alert dispatch.
              </li>
              <li>
                <strong>GPS Geolocation Coordinates:</strong> Captured <em>only</em> when explicitly triggered via the SOS button or during incident report submission with explicit browser permission. We never track your ongoing movement silently.
              </li>
              <li>
                <strong>Incident Reports & Evidence:</strong> Descriptions, coordinates, and optional multimedia evidence uploaded to alert moderators of community hazards.
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              2. Strict Isolation & No Public Disclosure
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              Your emergency contacts, private user details, and unprocessed incident evidence are never shared publicly or indexed by search engines. Verified incident points on the community map are completely anonymized to protect reporter identity.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              3. Security & Storage Standards
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              All database communications are protected via HTTPS/TLS, with passwords salted using bcrypt (10 rounds) and JWT authentication tokens. Uploaded evidence undergoes strict MIME type validation and size restriction checks.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              4. User Control & Data Deletion
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              You retain full control to edit or delete your emergency contacts, update medical notes, or request complete account closure through your settings dashboard at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
