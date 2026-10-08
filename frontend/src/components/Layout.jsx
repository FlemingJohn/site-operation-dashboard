import { Suspense, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { useStoredFlag } from '../hooks/useStoredFlag';
import ErrorBoundary from './ErrorBoundary';
import SidebarNav from './SidebarNav';

const SECTIONS = [
  { path: '/', label: 'Overview', icon: DashboardOutlinedIcon },
  { path: '/sites', label: 'Sites', icon: BusinessOutlinedIcon, addLabel: 'Add site' },
  {
    path: '/installations',
    label: 'Installations',
    icon: BuildOutlinedIcon,
    addLabel: 'Add installation',
  },
  { path: '/users', label: 'Users', icon: PeopleOutlinedIcon, addLabel: 'Add user' },
];

const SIDEBAR_COLLAPSED_KEY = 'siteops.sidebarCollapsed';

const getActiveSection = (pathname) =>
  SECTIONS.find((section) => section.path !== '/' && pathname.startsWith(section.path)) ??
  SECTIONS[0];

const Layout = () => {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, toggleCollapsed] = useStoredFlag(SIDEBAR_COLLAPSED_KEY);
  const activeSection = getActiveSection(pathname);
  const showAddButton = activeSection.addLabel && pathname === activeSection.path;

  return (
    <div className="app">
      <nav
        className={`app-nav${isCollapsed ? ' app-nav-collapsed' : ''}`}
        aria-label="Main navigation"
      >
        <Drawer
          variant="temporary"
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          className="app-drawer-mobile"
          classes={{ paper: 'app-drawer-paper' }}
        >
          <SidebarNav
            sections={SECTIONS}
            activePath={activeSection.path}
            onNavigate={() => setIsMenuOpen(false)}
          />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          className="app-drawer-desktop"
          classes={{ paper: 'app-drawer-paper' }}
        >
          <SidebarNav
            sections={SECTIONS}
            activePath={activeSection.path}
            isCollapsed={isCollapsed}
            onToggle={toggleCollapsed}
          />
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
            <Typography variant="h6" component="h1" className="app-page-title">
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
