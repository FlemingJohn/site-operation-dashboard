export const SITE_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const INSTALLATION_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export const REGIONS = ['North', 'South', 'East', 'West'].map((region) => ({
  value: region,
  label: region,
}));

export const STATUS_LABELS = Object.fromEntries(
  [...SITE_STATUSES, ...INSTALLATION_STATUSES].map(({ value, label }) => [value, label])
);

export const STATUS_COLORS = {
  active: 'success',
  inactive: 'error',
  completed: 'success',
  in_progress: 'warning',
  pending: 'default',
};

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const SEARCH_DELAY_MS = 300;

export const MAX_SITE_OPTIONS = 100;
