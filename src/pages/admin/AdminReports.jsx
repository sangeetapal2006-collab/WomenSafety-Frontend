import React, { useState, useEffect } from 'react';
import {
  FiFileText,
  FiFilter,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiMapPin,
  FiClock,
  FiUser,
  FiEye,
  FiShield,
  FiPaperclip
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks';
import { formatDate } from '../../utils/formatters';
import { INCIDENT_TYPES, REPORT_STATUSES } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isDuplicateFilter, setIsDuplicateFilter] = useState('');
  const [search, setSearch] = useState('');

  // Status Change Form Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('Verified');
  const [reviewReason, setReviewReason] = useState('');
  const [publicOnMap, setPublicOnMap] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchReports();
  }, [statusFilter, typeFilter, isDuplicateFilter, search]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (typeFilter !== 'All') params.incidentType = typeFilter;
      if (isDuplicateFilter) params.isDuplicate = isDuplicateFilter;
      if (search) params.search = search;

      const res = await adminService.getAllReports(params);
      if (res.success && res.data) {
        setReports(res.data.reports || []);
      }
    } catch (err) {
      toastError(err.message || 'Failed to fetch incident reports.');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (report) => {
    setSelectedReport(report);
    setNewStatus(report.status === 'Pending' ? 'Verified' : report.status);
    setReviewReason('');
    setPublicOnMap(report.isPublicOnSafetyMap || true);
    setIsReviewModalOpen(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!reviewReason || reviewReason.trim().length < 3) {
      toastError('Please provide a specific audit reason for updating the report status.');
      return;
    }

    setSavingStatus(true);
    try {
      const res = await adminService.updateReportStatus(selectedReport._id, {
        status: newStatus,
        reason: reviewReason.trim(),
        isPublicOnSafetyMap: publicOnMap
      });

      if (res.success) {
        success(`Report #${selectedReport._id.slice(-6)} updated to "${newStatus}". Audit log recorded.`);
        setIsReviewModalOpen(false);
        fetchReports();
      }
    } catch (err) {
      toastError(err.message || 'Failed to update report status.');
    } finally {
      setSavingStatus(false);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', margin: '0 0 4px 0' }}>Incident Moderation Queue</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Verify public hazards, inspect potential duplicates detected by the geospatial engine, and maintain community safety.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          background: 'var(--bg-card)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Search Keywords</label>
          <input
            type="text"
            className="form-input"
            placeholder="Search title, desc, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {REPORT_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {INCIDENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Duplicate Flags</label>
          <select
            className="form-select"
            value={isDuplicateFilter}
            onChange={(e) => setIsDuplicateFilter(e.target.value)}
          >
            <option value="">All Submissions</option>
            <option value="true">Duplicate/Suspicious Only</option>
          </select>
        </div>
      </div>

      {/* Reports Table / Card List */}
      {loading ? (
        <LoadingSpinner text="Loading incident moderation queue..." />
      ) : reports.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <FiFileText size={42} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: 0 }}>No Reports Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No incident reports matching the selected filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reports.map((report) => (
            <div
              key={report._id}
              className="card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      {report.incidentType}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{report.title}</h3>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiUser size={13} /> {report.reporter?.name || 'Anonymous User'} ({report.reporter?.email})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiMapPin size={13} /> {report.address} (GPS ~{Math.round(report.gpsAccuracy || 0)}m)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiClock size={13} /> {formatDate(report.incidentDate)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge ${getBadgeClass(report.status)}`}>{report.status}</span>
                  {report.isPotentialDuplicate && (
                    <span className="badge badge-duplicate" title="Geospatial Duplicate Match">
                      ⚠️ {report.duplicateConfidence}% Match
                    </span>
                  )}
                  <button className="btn btn-primary btn-sm" onClick={() => openReviewModal(report)}>
                    Review & Verify
                  </button>
                </div>
              </div>

              {/* Description */}
              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                {report.description}
              </p>

              {/* Duplicate Reason Alert if flagged */}
              {report.isPotentialDuplicate && (
                <div
                  style={{
                    background: 'rgba(217, 119, 6, 0.12)',
                    border: '1px solid rgba(217, 119, 6, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.85rem',
                    color: '#fbbf24'
                  }}
                >
                  <FiAlertTriangle style={{ display: 'inline', marginRight: '6px' }} />
                  <strong>Automated Duplicate Engine:</strong> {report.duplicateCheckReason}
                  {report.duplicateOf && (
                    <span style={{ display: 'block', marginTop: '4px', fontSize: '0.8rem', color: '#fef08a' }}>
                      Matching Target: "{report.duplicateOf.title}" ({report.duplicateOf.incidentType} - {report.duplicateOf.address})
                    </span>
                  )}
                </div>
              )}

              {/* Attached Evidence Files */}
              {report.evidenceFiles && report.evidenceFiles.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <FiPaperclip size={14} />
                  <span>
                    {report.evidenceFiles.length} attached evidence file{report.evidenceFiles.length > 1 ? 's' : ''}:
                  </span>
                  {report.evidenceFiles.map((ev, i) => (
                    <span key={i} style={{ background: 'var(--bg-input)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      {ev.fileName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review & Status Modal */}
      {isReviewModalOpen && selectedReport && (
        <div className="modal-backdrop" onClick={() => setIsReviewModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3 style={{ margin: '0 0 1.25rem 0' }}>
              Moderation Review: #{selectedReport._id.slice(-6)}
            </h3>

            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>{selectedReport.title}</h5>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>
                {selectedReport.description}
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                📍 {selectedReport.address} • Reporter: {selectedReport.reporter?.name}
              </div>
            </div>

            <form onSubmit={handleStatusSubmit}>
              <div className="form-group">
                <label className="form-label">Update Verification Status</label>
                <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Verified">Verified (Confirmed genuine - Display on Safety Map)</option>
                  <option value="Under Review">Under Review (Under investigation)</option>
                  <option value="Duplicate">Duplicate (Matched existing incident)</option>
                  <option value="Suspicious">Suspicious (Questionable authenticity)</option>
                  <option value="Rejected">Rejected (Fabricated or invalid submission)</option>
                  <option value="Resolved">Resolved (Hazard rectified by authorities)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Review Reason / Audit Log Note *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Explain why this status was chosen (e.g. Verified by local police blotter, municipal lights repaired, etc.)"
                  value={reviewReason}
                  onChange={(e) => setReviewReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '1rem 0 1.5rem 0' }}>
                <input
                  type="checkbox"
                  id="publicMapToggle"
                  checked={publicOnMap}
                  onChange={(e) => setPublicOnMap(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#e11d48' }}
                />
                <label htmlFor="publicMapToggle" style={{ fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  Show on Public Community Heatmap (Only recommended for Verified items)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsReviewModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingStatus}>
                  {savingStatus ? 'Saving Audit Record...' : 'Confirm Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
