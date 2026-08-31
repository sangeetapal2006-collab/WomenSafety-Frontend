export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatAccuracy = (accuracy) => {
  if (accuracy === undefined || accuracy === null || accuracy === 0) {
    return { text: 'GPS Lock Acquired', level: 'medium' };
  }
  const acc = Math.round(accuracy);
  if (acc <= 20) {
    return { text: `High Accuracy (~${acc}m)`, level: 'high' };
  }
  if (acc <= 100) {
    return { text: `Moderate Accuracy (~${acc}m)`, level: 'medium' };
  }
  return { text: `Poor Accuracy (~${acc}m - Move Outdoors)`, level: 'low' };
};

export const formatDistance = (meters) => {
  if (meters === undefined || meters === null) return 'N/A';
  if (meters < 1000) {
    return `${Math.round(meters)} meters`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};
