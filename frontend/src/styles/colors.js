import { getCssToken } from '../lib/getCssToken';

const TOKEN_NAMES = {
  white: '--color-white',
  ink: '--color-ink',
  muted: '--color-muted',
  page: '--color-page',
  surface: '--color-surface',
  surfaceMuted: '--color-surface-muted',
  border: '--color-border',
  borderStrong: '--color-border-strong',
  sidebar: '--color-sidebar',
  sidebarHover: '--color-sidebar-hover',
  sidebarText: '--color-sidebar-text',
  sidebarMuted: '--color-sidebar-muted',
  sidebarAccent: '--color-sidebar-accent',
  primary: '--color-primary',
  primaryDark: '--color-primary-dark',
  success: '--color-success',
  successSoft: '--color-success-soft',
  successText: '--color-success-text',
  warning: '--color-warning',
  warningSoft: '--color-warning-soft',
  warningText: '--color-warning-text',
  pending: '--color-pending',
  neutralSoft: '--color-neutral-soft',
  neutralText: '--color-neutral-text',
  danger: '--color-danger',
  dangerSoft: '--color-danger-soft',
};

export const COLORS = Object.fromEntries(
  Object.entries(TOKEN_NAMES).map(([name, token]) => [name, getCssToken(token)])
);

export const FONT_BODY = getCssToken('--font-body');

export const STATUS_CHART_COLORS = {
  completed: COLORS.success,
  in_progress: COLORS.warning,
  pending: COLORS.pending,
};
