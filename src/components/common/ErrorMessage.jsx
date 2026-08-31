import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const ErrorMessage = ({ message = 'An unexpected error occurred.', onRetry }) => {
  return (
    <div
      style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '0.75rem',
        maxWidth: '500px',
        margin: '1.5rem auto'
      }}
    >
      <FiAlertCircle size={36} color="#ef4444" />
      <h4 style={{ color: '#f87171', margin: 0 }}>Something Went Wrong</h4>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{message}</p>
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry} style={{ marginTop: '0.5rem' }}>
          <FiRefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
