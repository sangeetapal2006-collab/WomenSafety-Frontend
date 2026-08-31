import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText,
  FiPlus,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiAlertTriangle,
  FiFilter,
  FiShield,
  FiChevronRight
} from 'react-icons/fi';
import { reportService } from '../services/reportService';
import { useToast } from '../hooks';
import { formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const { error: toastError } = useToast();

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getMyReports({ status: statusFilter || undefined });
      if (res.success && res.data) {
        setReports(res.data.reports || []);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load your submitted reports.');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '950px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 4px 0' }}>My Incident Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Track moderation verification status, duplicate check results, and administrative review notes.
          </p>
        </div>

        <Link to="/report-incident" className="btn btn-primary">
          <FiPlus /> New Report
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'var(--bg-card)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.5rem'
        }}
      >
        <FiFilter size={18} color="var(--text-dim)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status Filter:</span>
        <select
          className="form-select"
          style={{ maxWidth: '200px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Verified">Verified</option>
          <option value="Duplicate">Duplicate Flagged</option>
          <option value="Suspicious">Suspicious Flagged</option>
          <option value="Rejected">Rejected</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your report submissions..." />
      ) : reports.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <FiFileText size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0' }}>No Reports Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            {statusFilter
              ? `No reports found matching status "${statusFilter}".`
              : 'You have not submitted any incident reports yet.'}
          </p>
          <Link to="/report-incident" className="btn btn-primary">
            <FiPlus /> Report an Incident
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reports.map((report) => (
            <div
              key={report._id}
              className="card"
              style={{
                cursor: 'pointer',
                padding: '1.25rem 1.5rem',
                border: selectedReport?._id === report._id ? '1px solid var(--primary-500)' : '1px solid var(--border-color)'
              }}
              onClick={() => setSelectedReport(selectedReport?._id === report._id ? null : report)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)'
                      }}
                    >
                      {report.incidentType}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{report.title}</h3>
                  </div>

                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', flexWrap: 'wrap', marginTop: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiMapPin size={13} /> {report.address}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiClock size={13} /> Incident Date: {formatDate(report.incidentDate)}
                    </span>
                    <span>Submitted: {formatDate(report.createdAt)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge ${getBadgeClass(report.status)}`}>{report.status}</span>
                  {report.isPotentialDuplicate && (
                    <span className="badge badge-duplicate" title="Flagged by duplicate detection algorithm">
                      {report.duplicateConfidence}% Match
                    </span>
                  )}
                  <FiChevronRight size={18} color="var(--text-dim)" />
                </div>
              </div>

              {/* Expanded Details on Click */}
              {selectedReport?._id === report._id && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <h5 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>
                      Full Incident Description
                    </h5>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)', margin: 0 }}>
                      {report.description}
                    </p>
                  </div>

                  {/* Duplicate Detection Explanation */}
                  {report.isPotentialDuplicate && (
                    <div
                      style={{
                        background: 'rgba(217, 119, 6, 0.12)',
                        border: '1px solid rgba(217, 119, 6, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.85rem 1rem',
                        fontSize: '0.85rem',
                        color: '#fbbf24'
                      }}
                    >
                      <FiAlertTriangle style={{ display: 'inline', marginRight: '6px' }} />
                      <strong>Automated Duplicate Guard:</strong> {report.duplicateCheckReason}
                    </div>
                  )}

                  {/* Admin Reviews / Timeline */}
                  {report.reviews && report.reviews.length > 0 && (
                    <div>
                      <h5 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>
                        Safety Moderator Review Trail
                      </h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {report.reviews.map((rev, i) => (
                          <div
                            key={i}
                            style={{
                              background: 'var(--bg-input)',
                              padding: '0.75rem 1rem',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.85rem'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                              <strong>Moderator Review ({rev.newStatus})</strong>
                              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                                {formatDate(rev.reviewDate)}
                              </span>
                            </div>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>{rev.reviewReason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
