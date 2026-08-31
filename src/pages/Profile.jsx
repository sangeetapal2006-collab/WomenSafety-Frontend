import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiSave,
  FiShield,
  FiActivity,
  FiMapPin,
  FiCheckCircle
} from 'react-icons/fi';
import { useAuth, useToast } from '../hooks';
import { authService } from '../services/authService';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodGroup: 'Unknown',
    emergencyMedicalNotes: '',
    address: ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bloodGroup: user.bloodGroup || 'Unknown',
        emergencyMedicalNotes: user.emergencyMedicalNotes || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authService.updateProfile(formData);
      if (res.success && res.data) {
        updateUser(res.data.user);
        success('Profile updated successfully.');
      }
    } catch (err) {
      toastError(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toastError('New passwords do not match.');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toastError('New password must be at least 6 characters.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      if (res.success) {
        success('Password updated successfully.');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toastError(err.message || 'Failed to change password. Verify your current password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '850px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 4px 0' }}>Profile & Security Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Manage your personal details, emergency medical information, and account security.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Basic & Medical Info Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', padding: '10px', borderRadius: '10px', display: 'flex' }}>
                <FiUser size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Personal & Medical Details</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Email: {user?.email} • Role: {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Mobile Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-select"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  <option value="Unknown">Unknown</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Residence / Area</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sector 45, Green Valley"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Medical Notes / Allergies</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="e.g. Mild asthma (inhaler in purse), allergic to penicillin, diabetes type 1"
                value={formData.emergencyMedicalNotes}
                onChange={(e) => setFormData({ ...formData, emergencyMedicalNotes: e.target.value })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Helps medical responders provide safe emergency treatment if dispatched.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                <FiSave /> {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '10px', borderRadius: '10px', display: 'flex' }}>
              <FiLock size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Change Security Password</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Keep your credentials protected with strong passwords
              </span>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter existing password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">New Password (Min 6 chars)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter new password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Re-enter new password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-secondary" disabled={savingPassword}>
                <FiLock /> {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
