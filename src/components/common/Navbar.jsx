import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiShield,
  FiAlertTriangle,
  FiMapPin,
  FiPhone,
  FiFileText,
  FiUsers,
  FiUser,
  FiBell,
  FiLogOut,
  FiMenu,
  FiX,
  FiCheckCircle,
  FiLock
} from 'react-icons/fi';
import { useAuth, useToast } from '../../hooks';
import { notificationService } from '../../services/notificationService';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000); // 30s polling
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      // Quiet fail for notification polling
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    success('Logged out securely.');
    navigate('/login');
  };

  return (
    <header
      style={{
        background: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 900
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              color: '#ffffff',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.4)'
            }}
          >
            <FiShield size={24} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.1
              }}
            >
              Safe<span style={{ color: 'var(--primary-500)' }}>Woman</span>
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontWeight: 700
              }}
            >
              Emergency Safety Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.5rem'
          }}
          className="desktop-nav"
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? 'var(--primary-500)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.925rem'
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/sos"
            style={({ isActive }) => ({
              color: isActive ? '#f43f5e' : '#f87171',
              fontWeight: 700,
              fontSize: '0.925rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            })}
          >
            <FiAlertTriangle /> SOS Hub
          </NavLink>

          <NavLink
            to="/helplines"
            style={({ isActive }) => ({
              color: isActive ? 'var(--primary-500)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.925rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            })}
          >
            <FiPhone /> Helplines
          </NavLink>

          <NavLink
            to="/report-incident"
            style={({ isActive }) => ({
              color: isActive ? 'var(--primary-500)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.925rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            })}
          >
            <FiFileText /> Report Incident
          </NavLink>

          <NavLink
            to="/safety-resources"
            style={({ isActive }) => ({
              color: isActive ? 'var(--primary-500)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.925rem'
            })}
          >
            Safety Tips
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary-500)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.925rem'
              })}
            >
              Dashboard
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '0.35rem 0.8rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              })}
            >
              <FiLock size={14} /> Admin Portal
            </NavLink>
          )}
        </nav>

        {/* Right Section Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    borderRadius: '10px',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  aria-label="Notifications"
                >
                  <FiBell size={18} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        background: '#ef4444',
                        color: 'white',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '48px',
                      width: '320px',
                      background: '#111827',
                      border: '1px solid var(--border-color)',
                      borderRadius: '14px',
                      boxShadow: 'var(--shadow-xl)',
                      padding: '1rem',
                      zIndex: 1000
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                        borderBottom: '1px solid var(--border-color)',
                        paddingBottom: '0.5rem'
                      }}
                    >
                      <h5 style={{ margin: 0 }}>Alerts & Updates</h5>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--primary-500)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                          No notifications yet.
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            style={{
                              padding: '0.6rem 0.5rem',
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                              background: n.isRead ? 'transparent' : 'rgba(244, 63, 94, 0.08)',
                              borderRadius: '6px',
                              marginBottom: '4px'
                            }}
                          >
                            <p style={{ fontWeight: 600, fontSize: '0.825rem', margin: '0 0 2px 0' }}>
                              {n.title}
                            </p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile & Logout */}
              <Link to="/profile" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                <FiUser size={14} />
                <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Logout"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <FiLogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              padding: '6px'
            }}
            className="mobile-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div
          style={{
            background: '#0b0f19',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.25rem'
          }}
          className="mobile-nav"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              style={{ color: 'var(--text-main)', fontWeight: 600 }}
            >
              Home
            </NavLink>
            <NavLink
              to="/sos"
              onClick={() => setMenuOpen(false)}
              style={{ color: '#f87171', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FiAlertTriangle /> SOS Hub
            </NavLink>
            <NavLink
              to="/helplines"
              onClick={() => setMenuOpen(false)}
              style={{ color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FiPhone /> Emergency Helplines
            </NavLink>
            <NavLink
              to="/report-incident"
              onClick={() => setMenuOpen(false)}
              style={{ color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FiFileText /> Report Incident
            </NavLink>
            <NavLink
              to="/safety-resources"
              onClick={() => setMenuOpen(false)}
              style={{ color: 'var(--text-main)', fontWeight: 600 }}
            >
              Safety Guides & Legal Rights
            </NavLink>

            {isAuthenticated ? (
              <>
                <hr style={{ borderColor: 'var(--border-color)', margin: '0.25rem 0' }} />
                <NavLink
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  style={{ color: 'var(--text-main)', fontWeight: 600 }}
                >
                  User Dashboard
                </NavLink>
                <NavLink
                  to="/emergency-contacts"
                  onClick={() => setMenuOpen(false)}
                  style={{ color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiUsers /> Emergency Contacts
                </NavLink>
                <NavLink
                  to="/my-reports"
                  onClick={() => setMenuOpen(false)}
                  style={{ color: 'var(--text-main)', fontWeight: 600 }}
                >
                  My Submitted Reports
                </NavLink>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    style={{ color: '#818cf8', fontWeight: 700 }}
                  >
                    Admin Operations Portal
                  </NavLink>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
