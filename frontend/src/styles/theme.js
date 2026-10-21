import { createTheme } from '@mui/material/styles';
import { COLORS, FONT_BODY } from './colors';

const CHIP_TONES = {
  success: { color: COLORS.successText, backgroundColor: COLORS.successSoft },
  warning: { color: COLORS.warningText, backgroundColor: COLORS.warningSoft },
  error: { color: COLORS.danger, backgroundColor: COLORS.dangerSoft },
  default: { color: COLORS.neutralText, backgroundColor: COLORS.neutralSoft },
};

const theme = createTheme({
  palette: {
    primary: { main: COLORS.primary, dark: COLORS.primaryDark },
    success: { main: COLORS.success },
    warning: { main: COLORS.warning },
    error: { main: COLORS.danger },
    text: { primary: COLORS.ink, secondary: COLORS.muted },
    divider: COLORS.border,
    background: { default: COLORS.page, paper: COLORS.surface },
  },
  typography: {
    fontFamily: FONT_BODY,
    h4: { fontWeight: 600, fontSize: 28, fontVariantNumeric: 'tabular-nums' },
    h6: { fontWeight: 600, fontSize: 18 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: { backgroundColor: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` },
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
          '&:hover': { backgroundColor: COLORS.sidebarHover, color: COLORS.white },
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: COLORS.sidebarHover,
            color: COLORS.white,
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
          backgroundColor: COLORS.surface,
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
