import React, { useState, useEffect } from 'react';
import {
  FiAlertTriangle,
  FiMapPin,
  FiClock,
  FiUser,
  FiPhone,
  FiCheckCircle,
  FiActivity,
  FiExternalLink
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { sosService } from '../../services/sosService';
import { useToast } from '../../hooks';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSOS = () => {
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchSOS();
  }, [statusFilter]);

  const fetchSOS = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await adminService.getAllSOSEvents(params);
      if (res.success && res.data) {
        setSosList(res.data.sosEvents || []);
      }
    } catch (err) {
      toastError(err.message || 'Failed to fetch SOS emergency events.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      const res = await sosService.resolveSOS(id, {
        status: 'Resolved',
        notes: 'Admin operations team verified user safety & resolved event.'
      });
      if (res.success) {
        success('SOS Event marked as Resolved.');
        fetchSOS();
      }
    } catch (err) {
      toastError('Failed to resolve SOS.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: '0 0 4px 0' }}>Emergency SOS Event Monitor</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Live log of all emergency SOS button activations, coordinates, accuracy radii, and notified contacts.
          </p>
        </div>

        <select
          className="form-select"
          style={{ width: '180px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Events</option>
          <option value="Active">Active Emergency</option>
          <option value="Resolved">Resolved</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving live SOS emergency logs..." />
      ) : sosList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <FiCheckCircle size={42} color="#10b981" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: 0 }}>No Active Emergency Events</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            All clear. No SOS alerts found matching current filter.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sosList.map((sos) => (
            <div
              key={sos._id}
              className="card"
              style={{
                padding: '1.5rem',
                border:
                  sos.status === 'Active'
                    ? '2px solid #ef4444'
                    : '1px solid var(--border-color)',
                background:
                  sos.status === 'Active'
                    ? 'linear-gradient(135deg, rgba(153, 27, 27, 0.25), rgba(15, 23, 42, 0.8))'
                    : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                      Emergency SOS #{sos._id.slice(-6)}
                    </h3>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background:
                          sos.status === 'Active' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.2)',
                        color: sos.status === 'Active' ? '#f87171' : '#10b981',
                        border: sos.status === 'Active' ? '1px solid #ef4444' : 'none'
                      }}
                    >
                      {sos.status}
                    </span>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      Mode: {sos.triggerType}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap', marginTop: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiUser size={14} /> {sos.user?.name || 'User'} ({sos.user?.phone})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiMapPin size={14} /> {sos.address} (Lat: {sos.latitude?.toFixed(4)}, Lng: {sos.longitude?.toFixed(4)})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiClock size={14} /> Triggered: {formatDate(sos.createdAt)}
                    </span>
                  </div>

                  {sos.user?.emergencyMedicalNotes && (
                    <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#fca5a5' }}>
                      <strong>Medical Alert Notes:</strong> {sos.user.emergencyMedicalNotes} (Blood: {sos.user.bloodGroup})
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <a
                    href={`https://maps.google.com/?q=${sos.latitude},${sos.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <FiExternalLink size={14} /> Open Map
                  </a>

                  {sos.status === 'Active' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleResolve(sos._id)}>
                      <FiCheckCircle size={14} /> Mark Safe & Resolve
                    </button>
                  )}
                </div>
              </div>

              {/* Notified Contacts Breakdown */}
              {sos.contactsNotified && sos.contactsNotified.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    Notified Emergency Contacts ({sos.contactsNotified.length}):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {sos.contactsNotified.map((c, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'var(--bg-input)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        {c.name} ({c.phone}) - {c.status}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSOS;
