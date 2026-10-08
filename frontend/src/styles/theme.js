import { createTheme } from '@mui/material/styles';

export const COLORS = {
  ink: '#18212f',
  muted: '#5f6b7a',
  border: '#e1e5eb',
  borderStrong: '#c5ccd6',
  page: '#f3f5f8',
  surfaceMuted: '#f8f9fb',
  sidebar: '#16202e',
  sidebarHover: '#222e3f',
  sidebarText: '#c3cad5',
  sidebarMuted: '#7c8796',
  sidebarAccent: '#7aa7ff',
  primary: '#2457d6',
  primaryDark: '#1b45ad',
  success: '#1e8a4c',
  successSoft: '#e2f3e8',
  warning: '#b86e00',
  warningSoft: '#fbefd9',
  danger: '#c4372b',
  dangerSoft: '#fae3e0',
  neutral: '#5f6b7a',
  neutralSoft: '#eef0f3',
  pending: '#a3acb9',
};

export const STATUS_CHART_COLORS = {
  completed: COLORS.success,
  in_progress: COLORS.warning,
  pending: COLORS.pending,
};

const CHIP_TONES = {
  success: { color: COLORS.success, backgroundColor: COLORS.successSoft },
  warning: { color: COLORS.warning, backgroundColor: COLORS.warningSoft },
  error: { color: COLORS.danger, backgroundColor: COLORS.dangerSoft },
  default: { color: COLORS.neutral, backgroundColor: COLORS.neutralSoft },
};

const theme = createTheme({
  palette: {
    primary: { main: COLORS.primary, dark: COLORS.primaryDark },
    success: { main: COLORS.success },
    warning: { main: COLORS.warning },
    error: { main: COLORS.danger },
    text: { primary: COLORS.ink, secondary: COLORS.muted },
    divider: COLORS.border,
    background: { default: COLORS.page, paper: '#ffffff' },
  },
  typography: {
    fontFamily: "'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
    h4: { fontWeight: 600, fontSize: 28, fontVariantNumeric: 'tabular-nums' },
    h6: { fontWeight: 600, fontSize: 18 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: { backgroundColor: '#ffffff', borderBottom: `1px solid ${COLORS.border}` },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: COLORS.sidebar, color: COLORS.sidebarText, borderRight: 'none' },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          color: COLORS.sidebarMuted,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          lineHeight: '32px',
          paddingLeft: 24,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          margin: '2px 12px',
          padding: '8px 12px',
          borderRadius: 6,
          color: COLORS.sidebarText,
          '&:hover': { backgroundColor: COLORS.sidebarHover, color: '#ffffff' },
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: COLORS.sidebarHover,
            color: '#ffffff',
          },
          '&.Mui-selected .MuiListItemIcon-root': { color: COLORS.sidebarAccent },
        },
      },
    },
    MuiListItemIcon: { styleOverrides: { root: { color: 'inherit', minWidth: 36 } } },
    MuiListItemText: { styleOverrides: { primary: { fontSize: 14, fontWeight: 500 } } },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { borderColor: COLORS.border, borderRadius: 10 } },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: { paddingBottom: 0 },
        title: { fontSize: 15, fontWeight: 600 },
        subheader: { fontSize: 12 },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 6, paddingInline: 14 } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 6,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.border },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.borderStrong },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: COLORS.border },
        head: {
          backgroundColor: COLORS.surfaceMuted,
          color: COLORS.muted,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { '&.MuiTableRow-hover:hover': { backgroundColor: COLORS.surfaceMuted } },
      },
    },
    MuiTablePagination: {
      styleOverrides: { root: { borderTop: `1px solid ${COLORS.border}`, color: COLORS.muted } },
    },
    MuiChip: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(CHIP_TONES[ownerState.color] ?? CHIP_TONES.default),
          height: 24,
          borderRadius: 999,
          fontWeight: 500,
          '&::before': {
            content: '""',
            width: 6,
            height: 6,
            marginLeft: 10,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          },
        }),
        label: { paddingLeft: 6, paddingRight: 10 },
      },
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 12 } } },
    MuiDialogTitle: { styleOverrides: { root: { fontSize: 17, fontWeight: 600 } } },
    MuiTooltip: { styleOverrides: { tooltip: { backgroundColor: COLORS.ink, fontSize: 12 } } },
  },
});

export default theme;
