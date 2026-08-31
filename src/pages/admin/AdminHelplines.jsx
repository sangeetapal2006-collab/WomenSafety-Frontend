import React, { useState, useEffect } from 'react';
import {
  FiPhone,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiCheckCircle,
  FiAlertTriangle
} from 'react-icons/fi';
import { helplineService } from '../../services/helplineService';
import { HELPLINE_CATEGORIES } from '../../utils/constants';
import { useToast } from '../../hooks';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';

const AdminHelplines = () => {
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Police',
    phoneNumber: '',
    alternateNumber: '',
    description: '',
    availability: '24/7',
    tollFree: true,
    isNational: true,
    region: 'National (India)',
    website: ''
  });

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchHelplines();
  }, [search]);

  const fetchHelplines = async () => {
    try {
      setLoading(true);
      const res = await helplineService.getHelplines({ search });
      if (res.success && res.data) {
        setHelplines(res.data.helplines || []);
      }
    } catch (err) {
      toastError(err.message || 'Failed to fetch helplines.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Police',
      phoneNumber: '',
      alternateNumber: '',
      description: '',
      availability: '24/7',
      tollFree: true,
      isNational: true,
      region: 'National (India)',
      website: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      phoneNumber: item.phoneNumber,
      alternateNumber: item.alternateNumber || '',
      description: item.description,
      availability: item.availability || '24/7',
      tollFree: item.tollFree ?? true,
      isNational: item.isNational ?? true,
      region: item.region || 'National (India)',
      website: item.website || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await helplineService.updateHelpline(editingItem._id, formData);
        success('Emergency Helpline updated successfully.');
      } else {
        await helplineService.createHelpline(formData);
        success('Emergency Helpline added to public directory.');
      }
      setIsModalOpen(false);
      fetchHelplines();
    } catch (err) {
      toastError(err.message || 'Failed to save helpline.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await helplineService.deleteHelpline(deleteId);
      success('Helpline removed.');
      setDeleteId(null);
      fetchHelplines();
    } catch (err) {
      toastError('Failed to delete helpline.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: '0 0 4px 0' }}>Emergency Helplines Manager</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Configure and maintain vetted public emergency telephone numbers for women across all categories.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <FiPlus /> Add Emergency Helpline
        </button>
      </div>

      {/* Directory Table */}
      {loading ? (
        <LoadingSpinner text="Loading helplines repository..." />
      ) : helplines.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <FiPhone size={40} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: 0 }}>No Helplines Listed</h3>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Organization / Service</th>
                <th style={{ padding: '1rem 1.25rem' }}>Category</th>
                <th style={{ padding: '1rem 1.25rem' }}>Primary Phone</th>
                <th style={{ padding: '1rem 1.25rem' }}>Availability</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {helplines.map((h) => (
                <tr key={h._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <strong style={{ display: 'block', color: '#ffffff' }}>{h.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{h.description}</span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                    >
                      {h.category}
                    </span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <strong style={{ color: '#10b981' }}>{h.phoneNumber}</strong>
                    {h.alternateNumber && (
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Alt: {h.alternateNumber}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.availability}</span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(h)}>
                        <FiEdit2 size={13} />
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setDeleteId(h._id)} style={{ color: '#ef4444' }}>
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Helpline Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>
              {editingItem ? 'Edit Emergency Helpline' : 'Add New Emergency Helpline'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Service / Agency Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. National Commission for Women (NCW)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {HELPLINE_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Dial Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 1091 or 7827170170"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Alternate Number (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 011-26942369"
                    value={formData.alternateNumber}
                    onChange={(e) => setFormData({ ...formData, alternateNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Availability</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 24/7 or 9am-6pm"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description & Scope of Assistance *</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="e.g. 24/7 national women distress crisis response and legal counsel"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingItem ? 'Update Helpline' : 'Add Helpline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Emergency Helpline"
        message="Are you sure you want to remove this helpline from the public portal directory?"
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminHelplines;
