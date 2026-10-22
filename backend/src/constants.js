export const REGIONS = ['North', 'South', 'East', 'West'];

export const SITE_STATUSES = ['active', 'inactive'];

export const INSTALLATION_STATUSES = ['pending', 'in_progress', 'completed'];

export const USER_ROLES = ['admin', 'technician'];

export const EQUIPMENT_TYPES = ['blade_yoke', 'tower_gripper', 'tagline_system', 'mobile_robot'];

export const EQUIPMENT_STATUSES = ['deployed', 'in_service', 'in_stock'];

export const SERVICE_STATES = ['late', 'this_week', 'later'];

export const STOCK_LEVELS = ['out', 'low', 'stocked'];

export const PART_REQUEST_STATUSES = ['requested', 'ordered', 'delivered'];

export const NEXT_REQUEST_STATUSES = ['ordered', 'delivered'];

export const PREVIOUS_REQUEST_STATUS = { ordered: 'requested', delivered: 'ordered' };

export const ACTIVITY_KINDS = ['installation', 'service', 'part', 'site', 'user'];

export const ACTIVITY_PERIODS = ['7', '30'];

export const SERVICE_INTERVAL_DAYS = 90;

export const SERVICE_SOON_DAYS = 7;

export const EQUIPMENT_TYPE_LABELS = {
  blade_yoke: 'Blade Yoke',
  tower_gripper: 'Tower Gripper',
  tagline_system: 'Tagline System',
  mobile_robot: 'Mobile Robot',
};

export const STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  requested: 'Requested',
  ordered: 'Ordered',
  delivered: 'Delivered',
};

export const CHAT_ROLES = ['user', 'assistant'];

export const CHAT_MESSAGE_STATUSES = ['done', 'error', 'stopped'];

export const MAX_CHATS_PER_VISITOR = 50;

export const CHAT_MEMORY_MESSAGES = 12;

export const CHAT_TITLE_LENGTH = 60;

export const DEFAULT_PAGE_SIZE = 10;

export const MAX_PAGE_SIZE = 100;

export const RECENT_INSTALLATIONS_LIMIT = 5;

export const BREAKDOWN_LIMIT = 8;

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

export const EQUIPMENT_SORT_COLUMNS = {
  serial: 'e.serial',
  type: 'e.type',
  siteName: 's.name',
  status: 'e.status',
  nextServiceOn: 'e.next_service_on',
};

export const MESSAGES = {
  fieldErrors: 'Please fix the highlighted fields.',
  invalidId: 'Invalid id.',
  invalidJson: 'The request body is not valid JSON.',
  siteNotFound: 'This site no longer exists.',
  installationNotFound: 'This installation no longer exists.',
  equipmentNotFound: 'This machine no longer exists.',
  partNotFound: 'This part no longer exists.',
  partRequestNotFound: 'This request no longer exists.',
  requestAlreadyMoved: 'Someone else already moved this request. The board has been refreshed.',
  duplicateSerial: 'A machine with this serial number already exists.',
  duplicatePart: 'A part with this name already exists.',
  missingPerson: 'The selected person no longer exists.',
  machineHasHistory: "This machine has check-up history, so it can't be deleted.",
  partHasRequests: "This part has requests, so it can't be deleted.",
  stockBelowZero: "Stock can't go below zero.",
  valueOutOfRange: 'One of the numbers is out of range.',
  routeNotFound: 'Route not found.',
  duplicateSite: 'A site with this name already exists.',
  duplicateEmail: 'A user with this email already exists.',
  missingReference: 'The selected site or technician no longer exists.',
  invalidIdempotencyKey: 'Idempotency-Key must be a UUID.',
  requestInProgress: 'This request is still being processed. Please wait a moment.',
  requestMismatch: 'This request was already submitted with different details.',
  unavailable: 'The service is temporarily unavailable. Please try again shortly.',
  unexpected: 'Something went wrong. Please try again.',
  badRequest: 'The request could not be read.',
  requestTooLarge: 'The request is too large.',
  notJson: 'Send the request as JSON.',
  busy: 'The server is busy. Please try again.',
  tookTooLong: 'The request took too long. Please try again.',
  tooManyRequests: 'Too many requests. Please wait a minute and try again.',
  assistantOff: 'Ask SiteOps is not set up on this server yet.',
  assistantUnreachable: 'Ask SiteOps is not reachable right now. Please try again shortly.',
  assistantFailed: "Sorry, I couldn't get an answer just now. Please try again.",
  visitorMissing: 'X-Visitor-Id must be a UUID.',
  chatNotFound: 'Chat not found.',
};
