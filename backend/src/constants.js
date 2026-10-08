export const REGIONS = ['North', 'South', 'East', 'West'];

export const SITE_STATUSES = ['active', 'inactive'];

export const INSTALLATION_STATUSES = ['pending', 'in_progress', 'completed'];

export const USER_ROLES = ['admin', 'technician'];

export const DEFAULT_PAGE_SIZE = 10;

export const MAX_PAGE_SIZE = 100;

export const RECENT_INSTALLATIONS_LIMIT = 5;

export const SORT_ORDERS = ['asc', 'desc'];

export const SITE_SORT_COLUMNS = {
  name: 's.name',
  region: 's.region',
  status: 's.status',
  installationCount: '"installationCount"',
};

export const INSTALLATION_SORT_COLUMNS = {
  equipment: 'i.equipment',
  siteName: 's.name',
  technicianName: 'u.full_name',
  installedOn: 'i.installed_on',
  status: 'i.status',
};

export const USER_SORT_COLUMNS = {
  fullName: 'u.full_name',
  email: 'u.email',
  role: 'u.role',
};

export const MESSAGES = {
  fieldErrors: 'Please fix the highlighted fields.',
  invalidId: 'Invalid id.',
  invalidJson: 'The request body is not valid JSON.',
  siteNotFound: 'This site no longer exists.',
  installationNotFound: 'This installation no longer exists.',
  routeNotFound: 'Route not found.',
  duplicateSite: 'A site with this name already exists.',
  duplicateEmail: 'A user with this email already exists.',
  missingReference: 'The selected site or technician no longer exists.',
  invalidIdempotencyKey: 'Idempotency-Key must be a UUID.',
  requestInProgress: 'This request is still being processed. Please wait a moment.',
  requestMismatch: 'This request was already submitted with different details.',
  unavailable: 'The service is temporarily unavailable. Please try again shortly.',
  unexpected: 'Something went wrong. Please try again.',
};
