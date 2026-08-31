import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { DEFAULT_MAP_CENTER } from '../../utils/constants';

// Fix Leaflet default icon asset URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

// Custom User Location Icon
const userIcon = new L.DivIcon({
  className: 'custom-user-marker',
  html: `<div style="
    background: #e11d48;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid #ffffff;
    box-shadow: 0 0 14px #e11d48;
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Custom Incident Alert Marker
const incidentIcon = new L.DivIcon({
  className: 'custom-incident-marker',
  html: `<div style="
    background: #f59e0b;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 11px;
    font-weight: 800;
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.6);
  ">!</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Helper component to center map on coordinates change
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 14, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

// Map click listener for coordinate picking
const LocationPickerHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        });
      }
    }
  });
  return null;
};

const IncidentMap = ({
  center = DEFAULT_MAP_CENTER,
  zoom = 14,
  userLocation = null,
  accuracy = 0,
  reports = [],
  onLocationSelect = null,
  selectedLocation = null,
  height = '380px'
}) => {
  const mapCenter = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : selectedLocation
    ? [selectedLocation.latitude, selectedLocation.longitude]
    : center;

  return (
    <div style={{ height, width: '100%', position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#0b0f19' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={mapCenter} zoom={zoom} />

        {onLocationSelect && <LocationPickerHandler onLocationSelect={onLocationSelect} />}

        {/* User Current Location Marker & Accuracy Radius */}
        {userLocation && (
          <>
            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
              <Popup>
                <div style={{ color: '#0f172a', fontWeight: 600 }}>
                  📍 You Are Here
                  <br />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Lat: {userLocation.latitude.toFixed(5)}, Lng: {userLocation.longitude.toFixed(5)}
                    {accuracy > 0 && ` (~${Math.round(accuracy)}m accuracy)`}
                  </span>
                </div>
              </Popup>
            </Marker>
            {accuracy > 0 && accuracy < 5000 && (
              <Circle
                center={[userLocation.latitude, userLocation.longitude]}
                radius={accuracy}
                pathOptions={{
                  fillColor: '#f43f5e',
                  fillOpacity: 0.15,
                  color: '#e11d48',
                  weight: 1.5
                }}
              />
            )}
          </>
        )}

        {/* Selected Location for reporting */}
        {selectedLocation && (
          <Marker position={[selectedLocation.latitude, selectedLocation.longitude]}>
            <Popup>
              <div style={{ color: '#0f172a' }}>
                📌 Selected Incident Location
                <br />
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {selectedLocation.latitude.toFixed(5)}, {selectedLocation.longitude.toFixed(5)}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Reports markers */}
        {reports.map((report) => {
          if (!report.latitude || !report.longitude) return null;
          return (
            <Marker
              key={report._id}
              position={[report.latitude, report.longitude]}
              icon={incidentIcon}
            >
              <Popup>
                <div style={{ color: '#0f172a', maxWidth: '200px' }}>
                  <span
                    style={{
                      background: '#e0e7ff',
                      color: '#4338ca',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}
                  >
                    {report.incidentType}
                  </span>
                  <h5 style={{ margin: '6px 0 2px 0', fontSize: '0.9rem' }}>{report.title}</h5>
                  <p style={{ fontSize: '0.75rem', color: '#475569', margin: '2px 0 4px 0' }}>
                    {report.address}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default IncidentMap;
