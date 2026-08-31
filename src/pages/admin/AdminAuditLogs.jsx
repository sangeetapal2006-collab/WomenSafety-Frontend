import React, { useState, useEffect } from 'react';
import {
  FiActivity,
  FiShield,
  FiUser,
  FiClock,
  FiFilter,
  FiCheckCircle
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('All');

  const { error: toastError } = useToast();

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (actionFilter !== 'All') params.action = actionFilter;

      const res = await adminService.getAuditLogs(params);
      if (res.success && res.data) {
        setLogs(res.data.logs || []);
      }
    } catch (err) {
      toastError(err.message || 'Failed to retrieve administrative audit trail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: '0 0 4px 0' }}>Security Audit Trail Logs</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Immutable administrative action logs ensuring accountability for incident verification, account updates, and helpline changes.
          </p>
        </div>

        <select
          className="form-select"
          style={{ width: '220px' }}
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="All">All Actions</option>
          <option value="REPORT_STATUS_UPDATE">Report Status Updates</option>
          <option value="USER_STATUS_TOGGLED">User Status Changes</option>
          <option value="HELPLINE_CREATED">Helpline Created</option>
          <option value="HELPLINE_UPDATED">Helpline Updated</option>
          <option value="HELPLINE_DELETED">Helpline Deleted</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving administrative audit trail..." />
      ) : logs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <FiActivity size={40} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: 0 }}>No Audit Records Found</h3>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Action</th>
                <th style={{ padding: '1rem 1.25rem' }}>Admin User</th>
                <th style={{ padding: '1rem 1.25rem' }}>Target & Details</th>
                <th style={{ padding: '1rem 1.25rem' }}>IP Address</th>
                <th style={{ padding: '1rem 1.25rem' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#818cf8'
                      }}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <strong>{log.admin?.name || 'Admin'}</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {log.adminEmail}
                    </span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', maxWidth: '300px' }}>
                    <span style={{ fontWeight: 600, color: '#ffffff' }}>
                      {log.targetModel} #{log.targetId ? log.targetId.slice(-6) : 'N/A'}
                    </span>
                    <pre
                      style={{
                        margin: '4px 0 0 0',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit'
                      }}
                    >
                      {JSON.stringify(log.details)}
                    </pre>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                    {log.ipAddress || '127.0.0.1'}
                  </td>

                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                    {formatDate(log.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;
