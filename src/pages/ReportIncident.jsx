import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiFileText,
  FiMapPin,
  FiUploadCloud,
  FiAlertTriangle,
  FiCheckCircle,
  FiCalendar,
  FiUserPlus,
  FiTrash2,
  FiInfo,
  FiShield
} from 'react-icons/fi';
import { INCIDENT_TYPES } from '../utils/constants';
import { useGeolocation, useToast } from '../hooks';
import { reportService } from '../services/reportService';
import IncidentMap from '../components/map/IncidentMap';

const ReportIncident = () => {
  const { location, accuracy, fetchCurrentLocation } = useGeolocation();
  const { success, error: toastError, warning } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    incidentType: 'Harassment',
    title: '',
    description: '',
    incidentDate: new Date().toISOString().slice(0, 16),
    latitude: 28.6139,
    longitude: 77.209,
    address: '',
    gpsAccuracy: 0
  });

  const [files, setFiles] = useState([]);
  const [witnesses, setWitnesses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  // Initialize with user GPS if available
  useEffect(() => {
    if (location) {
      setFormData((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
        gpsAccuracy: accuracy || 0
      }));
    } else {
      fetchCurrentLocation()
        .then((pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: pos.latitude,
            longitude: pos.longitude,
            gpsAccuracy: pos.accuracy || 0
          }));
        })
        .catch(() => {});
    }
  }, [location, accuracy, fetchCurrentLocation]);

  const handleLocationPick = (coords) => {
    setFormData((prev) => ({
      ...prev,
      latitude: coords.latitude,
      longitude: coords.longitude
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Validate max 5 files and 10MB each
    if (selectedFiles.length + files.length > 5) {
      toastError('Maximum 5 evidence files allowed.');
      return;
    }

    const validFiles = selectedFiles.filter((f) => f.size <= 10 * 1024 * 1024);
    if (validFiles.length < selectedFiles.length) {
      toastError('Some files exceeded the 10MB size limit and were skipped.');
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addWitness = () => {
    setWitnesses((prev) => [...prev, { name: '', contact: '', statement: '' }]);
  };

  const updateWitness = (index, field, value) => {
    setWitnesses((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const removeWitness = (index) => {
    setWitnesses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.address) {
      toastError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('incidentType', formData.incidentType);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('incidentDate', formData.incidentDate);
      data.append('latitude', formData.latitude);
      data.append('longitude', formData.longitude);
      data.append('address', formData.address);
      data.append('gpsAccuracy', formData.gpsAccuracy);

      if (witnesses.length > 0) {
        data.append('witnesses', JSON.stringify(witnesses));
      }

      files.forEach((file) => {
        data.append('evidence', file);
      });

      const res = await reportService.submitReport(data);
      if (res.success) {
        if (res.data.isFlaggedForReview) {
          warning(
            `Notice: Your report was flagged for moderation: ${res.data.flagReason}. It will be reviewed by admin moderators.`
          );
        } else {
          success('Incident report submitted successfully! Status: Pending Moderator Review.');
        }
        navigate('/my-reports');
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit report. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(244, 63, 94, 0.15)',
            color: '#f43f5e',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}
        >
          <FiFileText size={16} /> SAFE COMMUNITY REPORTING
        </div>
        <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Report Unsafe Incident / Zone</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '620px', margin: '0.5rem auto 0 auto' }}>
          Document incidents, harassment, or infrastructure hazards. Submissions undergo automated duplicate detection & moderation before publishing.
        </p>
      </div>

      <div className="card" style={{ padding: '2.25rem' }}>
        <form onSubmit={handleSubmit}>
          {/* Incident Type & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Incident Category *</label>
              <select
                className="form-select"
                value={formData.incidentType}
                onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                required
              >
                {INCIDENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date & Time of Occurrence *</label>
              <input
                type="datetime-local"
                className="form-input"
                value={formData.incidentDate}
                onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Incident Summary / Headline *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Stalking & aggressive catcalling near North Gate Bus Stop"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Description * (Provide clear context)</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Describe what happened, individuals involved, clothing/vehicle descriptions, lighting conditions, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Location Picker Map */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Location on Map (Click map to adjust incident coordinates)</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                Lat: {formData.latitude.toFixed(4)}, Lng: {formData.longitude.toFixed(4)}
              </span>
            </label>

            <div style={{ height: '260px', borderRadius: 'var(--radius-md)', overflow: 'hidden', margin: '0.4rem 0' }}>
              <IncidentMap
                userLocation={location}
                selectedLocation={{ latitude: formData.latitude, longitude: formData.longitude }}
                onLocationSelect={handleLocationPick}
                height="260px"
                zoom={14}
              />
            </div>
          </div>

          {/* Address / Landmark */}
          <div className="form-group">
            <label className="form-label">Address or Notable Landmark *</label>
            <div style={{ position: 'relative' }}>
              <FiMapPin
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)'
                }}
                size={18}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="e.g. Metro Gate 3, Sector 42 pedestrian walkway"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Evidence Upload */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Evidence Files (Optional: Photos, Audio, Docs - Max 5 files, 10MB each)</label>
            <div
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('evidenceFileInput').click()}
            >
              <FiUploadCloud size={36} color="var(--primary-500)" style={{ marginBottom: '0.5rem' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Click to upload images, voice recordings or documents
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Accepted: JPG, PNG, PDF, DOCX, MP3, WAV
              </span>
              <input
                type="file"
                id="evidenceFileInput"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.mp3,.wav,.mp4"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {/* Attached Files List */}
            {files.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem'
                    }}
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Witnesses Section */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Witness Information (Optional)</label>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addWitness}>
                <FiUserPlus size={14} /> Add Witness
              </button>
            </div>

            {witnesses.map((w, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Witness #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeWitness(idx)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <FiTrash2 size={14} /> Remove
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Witness Name"
                    value={w.name}
                    onChange={(e) => updateWitness(idx, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contact Number / Email"
                    value={w.contact}
                    onChange={(e) => updateWitness(idx, 'contact', e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Brief statement / observation"
                  value={w.statement}
                  onChange={(e) => updateWitness(idx, 'statement', e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Safeguard Notice */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              margin: '1.75rem 0',
              fontSize: '0.825rem',
              color: 'var(--text-muted)'
            }}
          >
            <FiShield style={{ color: '#10b981', display: 'inline', marginRight: '6px' }} />
            <strong>False Report Safeguard Notice:</strong> All submissions pass through automated duplicate matching and are reviewed by safety administrators before becoming public safety points. Submitting false reports compromises emergency readiness.
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={submitting}
          >
            <FiCheckCircle size={18} /> {submitting ? 'Verifying & Submitting...' : 'Submit Incident Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIncident;
