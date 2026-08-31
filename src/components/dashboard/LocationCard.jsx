import React, { useEffect } from 'react';
import { FiMapPin, FiRefreshCw, FiNavigation, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { useGeolocation, useToast } from '../../hooks';
import { formatAccuracy } from '../../utils/formatters';
import IncidentMap from '../map/IncidentMap';

const LocationCard = () => {
  const { location, accuracy, timestamp, error, loading, fetchCurrentLocation, watching, startTracking, stopTracking } =
    useGeolocation();
  const { error: toastError, info } = useToast();

  useEffect(() => {
    if (!location && !error && !loading) {
      fetchCurrentLocation().catch((err) => {
        // Handled in context
      });
    }
  }, [location, error, loading, fetchCurrentLocation]);

  const handleRefresh = async () => {
    try {
      await fetchCurrentLocation();
      info('Location updated with latest GPS reading.');
    } catch (err) {
      toastError(err.message || 'Failed to update GPS location.');
    }
  };

  const accuracyData = formatAccuracy(accuracy);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#f43f5e',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex'
            }}
          >
            <FiMapPin size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem' }}>Current Location Status</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {timestamp ? `Acquired: ${new Date(timestamp).toLocaleTimeString()}` : 'Waiting for GPS fix'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh GPS"
          >
            <FiRefreshCw className={loading ? 'spinning' : ''} size={14} />
            <span>{loading ? 'Locating...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Accuracy Badge */}
      {location && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className={`accuracy-badge accuracy-${accuracyData.level}`}>
            {accuracyData.level === 'high' && <FiCheck size={14} />}
            {accuracyData.level === 'medium' && <FiNavigation size={14} />}
            {accuracyData.level === 'low' && <FiAlertTriangle size={14} />}
            <span>{accuracyData.text}</span>
          </div>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Coords: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </span>
        </div>
      )}

      {/* Poor accuracy warning */}
      {accuracy && accuracy > 100 && (
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.825rem',
            color: '#fbbf24'
          }}
        >
          <FiAlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>
            GPS accuracy is low (~{Math.round(accuracy)}m). If indoors or underground, step towards a window or outdoors for better satellite accuracy before relying on SOS dispatch.
          </span>
        </div>
      )}

      {/* Geolocation Error Alert */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.825rem',
            color: '#f87171'
          }}
        >
          <FiAlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Mini Map Preview */}
      <div style={{ height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <IncidentMap
          userLocation={location}
          accuracy={accuracy || 0}
          height="200px"
          zoom={15}
        />
      </div>

      <style>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LocationCard;
