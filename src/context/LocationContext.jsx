import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const fetchCurrentLocation = useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          const errMsg = 'Geolocation is not supported by your browser.';
          setError(errMsg);
          reject(new Error(errMsg));
          return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            };
            setLocation(loc);
            setAccuracy(pos.coords.accuracy);
            setTimestamp(pos.timestamp);
            setLoading(false);
            resolve({
              ...loc,
              accuracy: pos.coords.accuracy,
              timestamp: pos.timestamp
            });
          },
          (err) => {
            setLoading(false);
            let message = 'Unable to retrieve your location.';
            if (err.code === 1) {
              message = 'Location permission was denied. Please allow location access to use emergency features.';
            } else if (err.code === 2) {
              message = 'Location position is unavailable. Please check GPS signal.';
            } else if (err.code === 3) {
              message = 'Location request timed out. Please retry.';
            }
            setError(message);
            reject(new Error(message));
          },
          {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 10000
          }
        );
      }),
    []
  );

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) return;
    if (watchId !== null) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setAccuracy(pos.coords.accuracy);
        setTimestamp(pos.timestamp);
        setError(null);
      },
      (err) => {
        setError('Error tracking live GPS coordinates.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    setWatchId(id);
    setWatching(true);
  }, [watchId]);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setWatching(false);
    }
  }, [watchId]);

  // Clean up watcher on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <LocationContext.Provider
      value={{
        location,
        accuracy,
        timestamp,
        error,
        loading,
        watching,
        fetchCurrentLocation,
        startTracking,
        stopTracking
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useGeolocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useGeolocation must be used within a LocationProvider');
  }
  return context;
};
