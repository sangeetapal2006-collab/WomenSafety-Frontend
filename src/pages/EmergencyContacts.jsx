import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiPhone,
  FiMail,
  FiShield,
  FiAlertCircle
} from 'react-icons/fi';
import { contactService } from '../services/contactService';
import { useToast } from '../hooks';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: 'Parent / Guardian',
    email: '',
    isPrimary: false,
    priority: 1
  });

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await contactService.getContacts();
      if (res.success && res.data) {
        setContacts(res.data.contacts || []);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load emergency contacts.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
      relationship: 'Parent / Guardian',
      email: '',
      isPrimary: contacts.length === 0,
      priority: 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      email: contact.email || '',
      isPrimary: contact.isPrimary,
      priority: contact.priority || 1
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingContact) {
        await contactService.updateContact(editingContact._id, formData);
        success('Emergency contact updated successfully.');
      } else {
        await contactService.createContact(formData);
        success('Emergency contact added successfully.');
      }
      setIsModalOpen(false);
      fetchContacts();
    } catch (err) {
      toastError(err.message || 'Failed to save contact.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await contactService.deleteContact(deleteId);
      success('Contact removed from emergency registry.');
      setDeleteId(null);
      fetchContacts();
    } catch (err) {
      toastError(err.message || 'Failed to delete contact.');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '850px' }}>
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
          <h1 style={{ fontSize: '2rem', margin: '0 0 4px 0' }}>Emergency Contacts Registry</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            These trusted individuals will receive instant SMS & email notifications when you trigger SOS.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal} disabled={contacts.length >= 10}>
          <FiPlus /> Add Contact
        </button>
      </div>

      {/* Safety Info Note */}
      <div
        style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.875rem'
        }}
      >
        <FiShield size={22} color="#818cf8" style={{ flexShrink: 0 }} />
        <span>
          <strong>Privacy Guarantee:</strong> Your emergency contacts are strictly private to your account. We recommend adding at least 2 family members or trusted friends.
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving registered emergency contacts..." />
      ) : contacts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <FiAlertCircle size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0' }}>No Contacts Registered Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            Without emergency contacts, the automated SOS broadcast cannot notify your family or guardians during an incident.
          </p>
          <button className="btn btn-primary" onClick={openAddModal}>
            <FiPlus /> Add Your First Trusted Contact
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1.25rem 1.5rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{contact.name}</h3>
                  {contact.isPrimary && (
                    <span
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: '#fbbf24',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FiStar size={12} /> Primary Responder
                    </span>
                  )}
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Priority {contact.priority}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                  <span>
                    <strong>Relationship:</strong> {contact.relationship}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiPhone size={14} /> {contact.phone}
                  </span>
                  {contact.email && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiMail size={14} /> {contact.email}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <a href={`tel:${contact.phone}`} className="btn btn-secondary btn-sm" style={{ color: '#10b981' }} title="Call Contact">
                  <FiPhone size={14} /> Call
                </a>
                <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(contact)} title="Edit Contact">
                  <FiEdit2 size={14} /> Edit
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setDeleteId(contact._id)} style={{ color: '#ef4444' }} title="Delete Contact">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>
              {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (with Country Code if outside)</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Relationship</label>
                  <select
                    className="form-select"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  >
                    <option value="Parent / Father">Parent / Father</option>
                    <option value="Parent / Mother">Parent / Mother</option>
                    <option value="Sibling / Sister">Sibling / Sister</option>
                    <option value="Sibling / Brother">Sibling / Brother</option>
                    <option value="Spouse / Partner">Spouse / Partner</option>
                    <option value="Close Friend">Close Friend</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Colleague / Neighbor">Colleague / Neighbor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority Order (1 = Top)</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                  >
                    <option value={1}>1 (Highest Priority)</option>
                    <option value={2}>2 (High)</option>
                    <option value={3}>3 (Medium)</option>
                    <option value={4}>4 (Secondary)</option>
                    <option value={5}>5 (Lowest)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Optional for Email SOS Alerts)</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. contact@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '1rem 0 1.5rem 0' }}>
                <input
                  type="checkbox"
                  id="isPrimaryCheck"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#e11d48' }}
                />
                <label htmlFor="isPrimaryCheck" style={{ fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  Mark as Primary Emergency Contact (Contacted first)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Remove Emergency Contact"
        message="Are you sure you want to remove this contact? They will no longer receive automated emergency SOS broadcasts from your account."
        confirmText="Remove"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default EmergencyContacts;
