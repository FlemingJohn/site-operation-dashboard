import { Suspense, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Button,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ErrorBoundary from './ErrorBoundary';

const SECTIONS = [
  { path: '/', label: 'Overview', icon: DashboardOutlinedIcon },
  { path: '/sites', label: 'Sites', icon: BusinessOutlinedIcon, addLabel: 'Add site' },
  {
    path: '/installations',
    label: 'Installations',
    icon: BuildOutlinedIcon,
    addLabel: 'Add installation',
  },
];

const getActiveSection = (pathname) =>
  SECTIONS.find((section) => section.path !== '/' && pathname.startsWith(section.path)) ??
  SECTIONS[0];

const Layout = () => {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeSection = getActiveSection(pathname);
  const showAddButton = activeSection.addLabel && pathname === activeSection.path;

  const navigation = (
    <>
      <Toolbar>
        <Stack direction="row" alignItems="center" className="app-brand">
          <Avatar variant="rounded" className="app-brand-mark">
            <BusinessOutlinedIcon fontSize="small" />
          </Avatar>
          <Typography variant="h6" className="app-brand-name">
            SiteOps
          </Typography>
        </Stack>
      </Toolbar>
      <List subheader={<ListSubheader>Operations</ListSubheader>}>
        {SECTIONS.map(({ path, label, icon: Icon }) => (
          <ListItemButton
            key={path}
            component={Link}
            to={path}
            selected={activeSection.path === path}
            onClick={() => setIsMenuOpen(false)}
          >
            <ListItemIcon>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <div className="app">
      <nav className="app-nav" aria-label="Main navigation">
        <Drawer
          variant="temporary"
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          className="app-drawer-mobile"
          classes={{ paper: 'app-drawer-paper' }}
        >
          {navigation}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          className="app-drawer-desktop"
          classes={{ paper: 'app-drawer-paper' }}
        >
          {navigation}
        </Drawer>
      </nav>

      <main className="app-main">
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              edge="start"
              className="app-menu-button"
              aria-label="Open menu"
              onClick={() => setIsMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="h1" flexGrow={1}>
              {activeSection.label}
            </Typography>
            {showAddButton && (
              <Button
                component={Link}
                to={`${activeSection.path}/new`}
                variant="contained"
                startIcon={<AddIcon />}
              >
                {activeSection.addLabel}
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <div className="app-content">
          <ErrorBoundary key={pathname}>
            <Suspense fallback={<LinearProgress />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default Layout;
