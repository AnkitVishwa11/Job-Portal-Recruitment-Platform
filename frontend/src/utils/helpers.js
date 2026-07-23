/**
 * Format a date to a readable string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get time ago string
 */
export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
};

/**
 * Format salary range
 */
export const formatSalary = (min, max) => {
  if (!min && !max) return 'Not specified';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
  if (min) return `From ${formatter.format(min)}`;
  return `Up to ${formatter.format(max)}`;
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get status badge class
 */
export const getStatusBadgeClass = (status) => {
  const classes = {
    open: 'badge bg-success',
    closed: 'badge bg-secondary',
    filled: 'badge bg-info',
    draft: 'badge bg-warning text-dark',
    pending: 'badge bg-warning text-dark',
    reviewing: 'badge bg-info',
    shortlisted: 'badge bg-primary',
    rejected: 'badge bg-danger',
    hired: 'badge bg-success',
    withdrawn: 'badge bg-secondary',
    active: 'badge bg-success',
    inactive: 'badge bg-danger',
  };
  return classes[status] || 'badge bg-secondary';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Build query string from params object
 */
export const buildQueryString = (params) => {
  const filtered = Object.entries(params).filter(
    ([, value]) => value !== '' && value !== null && value !== undefined
  );
  if (filtered.length === 0) return '';
  return '?' + new URLSearchParams(filtered).toString();
};

/**
 * Get initials from name
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

/**
 * Download file from blob
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};


