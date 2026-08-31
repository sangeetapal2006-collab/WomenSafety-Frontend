import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiSearch,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiMail,
  FiPhone,
  FiClock,
  FiFilter
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [toggleUser, setToggleUser] = useState(null);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (roleFilter !== 'All') params.role = roleFilter;

      const res = await adminService.getAllUsers(params);
      if (res.success && res.data) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      toastError(err.message || 'Failed to fetch user accounts.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleConfirm = async () => {
    if (!toggleUser) return;
    try {
      const res = await adminService.toggleUserStatus(toggleUser._id);
      if (res.success) {
        success(`User ${toggleUser.name} status updated.`);
        setToggleUser(null);
        fetchUsers();
      }
    } catch (err) {
      toastError(err.message || 'Failed to update user status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', margin: '0 0 4px 0' }}>User Accounts Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Inspect registered user profiles, monitor account states, and manage safety administration roles.
        </p>
      </div>

      {/* Filter & Search */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          background: 'var(--bg-card)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <FiSearch
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
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: '180px' }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="user">Users Only</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* User Table */}
      {loading ? (
        <LoadingSpinner text="Retrieving registered user database..." />
      ) : users.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <FiUsers size={40} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: 0 }}>No Users Found</h3>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>User Profile</th>
                <th style={{ padding: '1rem 1.25rem' }}>Contact Info</th>
                <th style={{ padding: '1rem 1.25rem' }}>Medical / Blood</th>
                <th style={{ padding: '1rem 1.25rem' }}>Role</th>
                <th style={{ padding: '1rem 1.25rem' }}>Account Status</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <strong style={{ display: 'block', color: '#ffffff' }}>{u.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Joined: {formatDate(u.createdAt)}
                    </span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div>{u.email}</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{u.phone}</span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ background: 'var(--bg-input)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      {u.bloodGroup || 'Unknown'}
                    </span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: u.role === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        color: u.role === 'admin' ? '#818cf8' : 'var(--text-muted)'
                      }}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: u.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: u.isActive ? '#10b981' : '#ef4444'
                      }}
                    >
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button
                      className={`btn btn-sm ${u.isActive ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => setToggleUser(u)}
                    >
                      {u.isActive ? <FiUserX size={14} /> : <FiUserCheck size={14} />}
                      <span>{u.isActive ? 'Suspend' : 'Activate'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm User Toggle Modal */}
      <ConfirmModal
        isOpen={!!toggleUser}
        title={toggleUser?.isActive ? 'Suspend User Account' : 'Activate User Account'}
        message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'reactivate'} ${toggleUser?.name}'s account?`}
        confirmText={toggleUser?.isActive ? 'Suspend' : 'Activate'}
        confirmVariant={toggleUser?.isActive ? 'danger' : 'primary'}
        onConfirm={handleToggleConfirm}
        onCancel={() => setToggleUser(null)}
      />
    </div>
  );
};

export default AdminUsers;
