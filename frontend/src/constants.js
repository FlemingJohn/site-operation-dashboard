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

export const EQUIPMENT_TYPES = [
  { value: 'blade_yoke', label: 'Blade Yoke' },
  { value: 'tower_gripper', label: 'Tower Gripper' },
  { value: 'tagline_system', label: 'Tagline System' },
  { value: 'mobile_robot', label: 'Mobile Robot' },
];

export const EQUIPMENT_STATUSES = [
  { value: 'deployed', label: 'Deployed' },
  { value: 'in_service', label: 'In service' },
  { value: 'in_stock', label: 'In stock' },
];

export const PART_REQUEST_STATUSES = [
  { value: 'requested', label: 'Requested' },
  { value: 'ordered', label: 'Ordered' },
  { value: 'delivered', label: 'Delivered' },
];

export const STOCK_LEVELS = [
  { value: 'out', label: 'Out of stock' },
  { value: 'low', label: 'Running low' },
  { value: 'stocked', label: 'Enough in stock' },
];

export const SERVICE_STATES = [
  { value: 'late', label: 'Needs service now' },
  { value: 'this_week', label: 'Coming up this week' },
  { value: 'later', label: 'Later' },
];

export const STATUS_LABELS = Object.fromEntries(
  [
    ...SITE_STATUSES,
    ...INSTALLATION_STATUSES,
    ...EQUIPMENT_STATUSES,
    ...PART_REQUEST_STATUSES,
    ...STOCK_LEVELS,
  ].map(({ value, label }) => [value, label])
);

export const EQUIPMENT_TYPE_LABELS = Object.fromEntries(
  EQUIPMENT_TYPES.map(({ value, label }) => [value, label])
);

export const STATUS_COLORS = {
  active: 'success',
  inactive: 'error',
  completed: 'success',
  in_progress: 'warning',
  pending: 'default',
  deployed: 'success',
  in_service: 'warning',
  in_stock: 'default',
  requested: 'default',
  ordered: 'warning',
  delivered: 'success',
  out: 'error',
  low: 'warning',
  stocked: 'success',
};

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const LIST_PAGE_SIZE_OPTIONS = [12, 24, 48];

export const LIST_VIEWS = { cards: 'cards', table: 'table' };

export const CARD_VIEW_LIMIT = 50;

export const ASSISTANT_MAX_CARDS = 5;

export const ASSISTANT_DEFAULT_SIZE = { width: 400, height: 620 };

export const ASSISTANT_MIN_SIZE = { width: 360, height: 480 };

export const ASSISTANT_MAX_SHARE = 0.9;

export const ASSISTANT_RESIZE_STEP = 20;

export const SEARCH_DELAY_MS = 300;

export const MAX_SELECT_OPTIONS = 100;

export const SITE_DEFAULT_SORT = { sortBy: 'name', order: 'asc' };

export const INSTALLATION_DEFAULT_SORT = { sortBy: 'installedOn', order: 'desc' };

export const USER_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'technician', label: 'Technician' },
];

export const ROLE_LABELS = Object.fromEntries(USER_ROLES.map(({ value, label }) => [value, label]));

export const USER_DEFAULT_SORT = { sortBy: 'fullName', order: 'asc' };

export const ALL_STATUSES_TAB = 'all';

export const INSTALLATION_STATUS_TABS = [
  { value: ALL_STATUSES_TAB, label: 'All' },
  ...INSTALLATION_STATUSES,
];

export const SERVICE_INTERVAL_DAYS = 90;

export const SERVICE_SOON_DAYS = 7;

export const EQUIPMENT_DEFAULT_SORT = { sortBy: 'nextServiceOn', order: 'asc' };

export const ACTIVITY_DEFAULT_SORT = { sortBy: 'occurredAt', order: 'desc' };

export const ACTIVITY_KINDS = [
  { value: 'installation', label: 'Installations' },
  { value: 'service', label: 'Service' },
  { value: 'part', label: 'Spare parts' },
  { value: 'site', label: 'Sites' },
  { value: 'user', label: 'Users' },
];

export const ACTIVITY_PERIODS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
];

export const ASSISTANT_STOPPED_TEXT = 'The answer stopped before it finished. Please ask again.';

export const ASSISTANT_SUGGESTIONS = [
  'Which machines need a check-up this week?',
  'Which spare parts are running low?',
  'Which sites are inactive?',
  'Which technician has the most open work?',
];

export const ASSISTANT_MEMBERS = [
  { id: 'assistant', displayName: 'Ask SiteOps', role: 'assistant' },
  { id: 'user', displayName: 'You', role: 'user' },
];

export const ASSISTANT_CHAT_TEXT = {
  composerInputPlaceholder: 'Ask about sites, machines or parts',
  composerInputAriaLabel: 'Your question',
  threadNoMessagesLabel: 'What would you like to know?',
  threadNoMessagesHelperText: 'Ask about sites, machines, check-ups or spare parts.',
  conversationListNoConversationsLabel: 'No chats yet. Ask a question and it will be saved here.',
  messageAuthorAssistantLabel: 'Ask SiteOps',
  messageAuthorUserLabel: 'You',
  conversationHeaderMenuLabel: 'Your chats',
};
