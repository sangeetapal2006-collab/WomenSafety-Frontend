import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiPhone, FiStar, FiPlus, FiAlertCircle } from 'react-icons/fi';

const ContactsWidget = ({ contacts = [], loading = false }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex'
            }}
          >
            <FiUsers size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem' }}>Emergency Contacts</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {contacts.length} registered trusted contact{contacts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <Link to="/emergency-contacts" className="btn btn-secondary btn-sm">
          <FiPlus size={14} /> Manage
        </Link>
      </div>

      {contacts.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '1.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-color)'
          }}
        >
          <FiAlertCircle size={28} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 0.75rem 0' }}>
            No emergency contacts added yet. In an SOS event, notifications cannot be dispatched without contacts.
          </p>
          <Link to="/emergency-contacts" className="btn btn-primary btn-sm">
            <FiPlus /> Add Trusted Contact
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {contacts.slice(0, 3).map((contact) => (
            <div
              key={contact._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{contact.name}</span>
                  {contact.isPrimary && (
                    <span
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: '#fbbf24',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <FiStar size={10} /> Primary
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {contact.relationship} • {contact.phone}
                </span>
              </div>

              <a
                href={`tel:${contact.phone}`}
                className="btn btn-secondary btn-sm"
                style={{ color: '#10b981', padding: '0.4rem 0.6rem' }}
                title="Call Contact"
              >
                <FiPhone size={14} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactsWidget;
