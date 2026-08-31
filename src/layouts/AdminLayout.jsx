import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  FiGrid,
  FiFileText,
  FiUsers,
  FiAlertTriangle,
  FiPhone,
  FiActivity,
  FiShield,
  FiArrowLeft,
  FiLock
} from 'react-icons/fi';

const AdminLayout = () => {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="grid-admin">
        {/* Admin Sidebar Navigation */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '8px', borderRadius: '8px', display: 'flex' }}>
                <FiLock size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Admin Control</h4>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>● Safety Ops Team</span>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <NavLink
                to="/admin"
                end
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                })}
              >
                <FiGrid size={16} /> Overview Stats
              </NavLink>

              <NavLink
                to="/admin/reports"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                })}
              >
                <FiFileText size={16} /> Moderation & Reports
              </NavLink>

              <NavLink
                to="/admin/users"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                })}
              >
                <FiUsers size={16} /> Users Management
              </NavLink>

              <NavLink
                to="/admin/sos"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                })}
              >
                <FiAlertTriangle size={16} /> SOS Event Monitor
              </NavLink>

              <NavLink
                to="/admin/helplines"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                })}
              >
                <FiPhone size={16} /> Helplines Manager
              </NavLink>

              <NavLink
                to="/admin/audit-logs"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                })}
              >
                <FiActivity size={16} /> Audit Trail Logs
              </NavLink>
            </nav>

            <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />

            <Link
              to="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-dim)',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.4rem'
              }}
            >
              <FiArrowLeft size={14} /> Back to User Portal
            </Link>
          </div>
        </aside>

        {/* Admin Dynamic Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
