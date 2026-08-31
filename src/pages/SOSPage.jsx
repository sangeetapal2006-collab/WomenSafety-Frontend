import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiPhone, FiMapPin, FiClock, FiCheckCircle, FiShield } from 'react-icons/fi';
import SOSButton from '../components/dashboard/SOSButton';
import LocationCard from '../components/dashboard/LocationCard';
import { sosService } from '../services/sosService';
import { formatDate } from '../utils/formatters';

const SOSPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await sosService.getHistory();
      if (res.success && res.data) {
        setHistory(res.data.history || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '0.75rem'
          }}
        >
          <FiAlertTriangle size={16} /> EMERGENCY SOS COMMAND CENTER
        </div>
        <h1 style={{ fontSize: '2.4rem', margin: 0 }}>Instant SOS Activation Hub</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px', margin: '0.5rem auto 0 auto' }}>
          Tap the red SOS button below to broadcast your live GPS coordinates immediately to your trusted contacts via SMS and email alerts.
        </p>
      </div>

      {/* Main Activation Area */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
      >
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <SOSButton onSOSTriggered={fetchHistory} />
        </div>

        <LocationCard />
      </div>

      {/* Direct Emergency Call Strip */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.15), rgba(15, 23, 42, 0.7))',
          border: '1px solid rgba(225, 29, 72, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Need Immediate Police or Medical Dispatch?</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Portal SOS broadcasts to your contacts. For immediate state law enforcement, dial directly.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a href="tel:112" className="btn btn-primary">
            <FiPhone /> Call 112
          </a>
          <a href="tel:1091" className="btn btn-secondary" style={{ color: '#fb7185' }}>
            <FiPhone /> Call 1091
          </a>
        </div>
      </div>

      {/* Past SOS Events Log */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your Past SOS Alert History</h3>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem' }}>
            No past emergency SOS alerts on record. Stay safe!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {history.map((item) => (
              <div
                key={item._id}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      SOS Triggered ({item.triggerType})
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: item.status === 'Active' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: item.status === 'Active' ? '#ef4444' : '#10b981'
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                    <FiMapPin style={{ display: 'inline', marginRight: '4px' }} />
                    {item.address} (GPS ~{Math.round(item.accuracy || 0)}m)
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <FiClock style={{ display: 'inline', marginRight: '4px' }} />
                  {formatDate(item.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSPage;
