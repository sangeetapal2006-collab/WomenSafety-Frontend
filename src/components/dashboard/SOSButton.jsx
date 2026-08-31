import React, { useState, useEffect, useRef } from 'react';
import {
  FiAlertTriangle,
  FiBell,
  FiVolume2,
  FiVolumeX,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiShield
} from 'react-icons/fi';
import { useGeolocation, useToast } from '../../hooks';
import { sosService } from '../../services/sosService';

const SOSButton = ({ onSOSTriggered }) => {
  const { location, accuracy, fetchCurrentLocation } = useGeolocation();
  const { success, error: toastError, warning } = useToast();

  const [triggerMode, setTriggerMode] = useState('confirmed'); // 'confirmed' or 'instant'
  const [countdown, setCountdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSOS, setActiveSOS] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [lastSOSResult, setLastSOSResult] = useState(null);
  const [sirenPlaying, setSirenPlaying] = useState(false);

  const countdownTimerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Check active SOS on mount
  useEffect(() => {
    checkActiveSOS();
  }, []);

  const checkActiveSOS = async () => {
    try {
      const res = await sosService.getActiveSOS();
      if (res.success && res.data.activeSOS) {
        setActiveSOS(res.data.activeSOS);
      }
    } catch (err) {
      // Quiet fail
    }
  };

  // Web Audio Synthesized Siren
  const toggleSiren = () => {
    if (sirenPlaying) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const startSiren = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      // Modulate frequency to create emergency siren wail
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.4);
      osc.frequency.linearRampToValueAtTime(600, now + 0.8);

      // Loop frequency modulation
      setInterval(() => {
        if (oscillatorRef.current && audioCtxRef.current) {
          const t = audioCtxRef.current.currentTime;
          oscillatorRef.current.frequency.setValueAtTime(600, t);
          oscillatorRef.current.frequency.linearRampToValueAtTime(1200, t + 0.4);
          oscillatorRef.current.frequency.linearRampToValueAtTime(600, t + 0.8);
        }
      }, 800);

      gain.gain.setValueAtTime(0.3, now);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setSirenPlaying(true);
      warning('Emergency loud siren siren activated!');
    } catch (err) {
      console.warn('Audio synthesis error:', err);
    }
  };

  const stopSiren = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
    }
    setSirenPlaying(false);
  };

  const handleSOSClick = () => {
    if (triggerMode === 'instant') {
      // Start 5-second cancelable countdown
      setCountdown(5);
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            dispatchSOS('instant');
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Confirmed mode trigger
      dispatchSOS('confirmed');
    }
  };

  const cancelCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      setCountdown(null);
      warning('SOS activation canceled.');
    }
  };

  const dispatchSOS = async (mode) => {
    setCountdown(null);
    setLoading(true);

    try {
      let coords = location;
      let acc = accuracy;

      // Always try fresh coordinates if missing
      if (!coords) {
        try {
          const fresh = await fetchCurrentLocation();
          coords = { latitude: fresh.latitude, longitude: fresh.longitude };
          acc = fresh.accuracy;
        } catch (err) {
          // If Geolocation fails, prompt fallback
          coords = { latitude: 28.6139, longitude: 77.209 }; // fallback center
          acc = 1000;
        }
      }

      // Read battery level if supported
      let batteryLevel = null;
      if (navigator.getBattery) {
        try {
          const battery = await navigator.getBattery();
          batteryLevel = Math.round(battery.level * 100);
        } catch (e) {}
      }

      const res = await sosService.triggerSOS({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: acc,
        triggerType: mode,
        batteryLevel
      });

      if (res.success) {
        setActiveSOS(res.data.sosEvent);
        setLastSOSResult(res.data);
        setShowResultModal(true);
        success('Emergency SOS broadcast dispatched successfully!');
        if (onSOSTriggered) onSOSTriggered(res.data.sosEvent);
      }
    } catch (err) {
      toastError(err.message || 'Failed to dispatch SOS alert. Call 112 directly!');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveSOS = async () => {
    if (!activeSOS) return;
    try {
      await sosService.resolveSOS(activeSOS._id, {
        status: 'Resolved',
        notes: 'Marked resolved by user from safety dashboard.'
      });
      setActiveSOS(null);
      stopSiren();
      success('Active SOS event marked as resolved.');
    } catch (err) {
      toastError('Failed to resolve SOS event.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1rem 0'
      }}
    >
      {/* Active SOS Alert Banner if in emergency */}
      {activeSOS && (
        <div
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #991b1b, #be123c)',
            border: '2px solid #ef4444',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
            <div style={{ background: '#ffffff', color: '#be123c', padding: '8px', borderRadius: '50%', display: 'flex' }}>
              <FiAlertTriangle size={24} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', margin: 0 }}>ACTIVE EMERGENCY ALERT IN PROGRESS</h4>
              <p style={{ color: '#fecdd3', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                SOS dispatched at {new Date(activeSOS.createdAt).toLocaleTimeString()}. Emergency contacts alerted.
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleResolveSOS} style={{ background: '#ffffff', color: '#881337', fontWeight: 700 }}>
            <FiCheckCircle size={16} /> Mark Safe & Resolve
          </button>
        </div>
      )}

      {/* Pulsing SOS Button */}
      <div style={{ position: 'relative', margin: '1.5rem 0' }}>
        <button
          className="sos-pulsing-btn"
          onClick={handleSOSClick}
          disabled={loading || countdown !== null}
          aria-label="Emergency SOS Action Button"
        >
          <FiAlertTriangle size={40} style={{ marginBottom: '4px' }} />
          <span style={{ fontSize: '1.6rem', letterSpacing: '0.05em', lineHeight: 1 }}>SOS</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.9, marginTop: '2px' }}>
            {loading ? 'DISPATCHING...' : 'TAP FOR HELP'}
          </span>
        </button>
      </div>

      {/* 5-Second Countdown Modal if instant mode triggered */}
      {countdown !== null && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ color: '#f43f5e', fontSize: '2rem', margin: 0 }}>
              Dispatching SOS in {countdown}s
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '1rem 0 1.5rem 0' }}>
              Emergency notification will be broadcast to your trusted contacts with live GPS coordinates.
            </p>
            <button className="btn btn-secondary btn-lg" onClick={cancelCountdown} style={{ width: '100%' }}>
              <FiXCircle size={20} /> Cancel (False Alarm)
            </button>
          </div>
        </div>
      )}

      {/* SOS Modes and Siren Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
        <button
          className={`btn btn-sm ${sirenPlaying ? 'btn-danger' : 'btn-secondary'}`}
          onClick={toggleSiren}
          title="Play loud distress alarm sound"
        >
          {sirenPlaying ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
          <span>{sirenPlaying ? 'Stop Siren' : 'Alarm Siren'}</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setTriggerMode(triggerMode === 'confirmed' ? 'instant' : 'confirmed')}
          title="Toggle instant countdown vs direct trigger"
        >
          <span>Mode: {triggerMode === 'instant' ? '5s Countdown' : 'Direct Confirm'}</span>
        </button>
      </div>

      <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', maxWidth: '480px', marginTop: '1.25rem', lineHeight: '1.4' }}>
        <FiShield style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
        Notice: Alerts your registered emergency contacts with your live location. In critical emergencies, always contact police (112) immediately.
      </p>

      {/* SOS Result & Broadcast Confirmation Modal */}
      {showResultModal && lastSOSResult && (
        <div className="modal-backdrop" onClick={() => setShowResultModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '50%', display: 'flex' }}>
                <FiCheckCircle size={26} color="#10b981" />
              </div>
              <h3 style={{ margin: 0 }}>Emergency SOS Dispatched</h3>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Your emergency alert has been recorded and broadcast notifications were queued.
            </p>

            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Contacts Notified:</span>
                <strong style={{ color: '#10b981' }}>{lastSOSResult.totalContactsNotified} contacts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>GPS Accuracy:</span>
                <span>~{Math.round(lastSOSResult.sosEvent.accuracy || 0)} meters</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Event Timestamp:</span>
                <span>{new Date(lastSOSResult.sosEvent.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <a href="tel:112" className="btn btn-primary">
                <FiPhone /> Call 112 Police
              </a>
              <button className="btn btn-secondary" onClick={() => setShowResultModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSButton;
