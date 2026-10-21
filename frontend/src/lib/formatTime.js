export const formatTime = (isoDateTime) =>
  new Date(isoDateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
