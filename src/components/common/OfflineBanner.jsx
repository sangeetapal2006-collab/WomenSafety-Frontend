import React from 'react';
import { FiWifiOff } from 'react-icons/fi';
import { useNetworkStatus } from '../../hooks';

const OfflineBanner = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="offline-banner">
      <FiWifiOff size={18} />
      <span>
        You are currently offline. Live backend sync and SOS dispatch are unavailable. Dial 112 directly if in immediate danger!
      </span>
    </div>
  );
};

export default OfflineBanner;
