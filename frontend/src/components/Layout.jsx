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
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import { useStoredFlag } from '../hooks/useStoredFlag';
import AskSiteOps from './AskSiteOps';
import ErrorBoundary from './ErrorBoundary';
import SidebarNav from './SidebarNav';

const NAV_GROUPS = [
  {
    label: 'Operations',
    sections: [
      { path: '/', label: 'Overview', icon: DashboardOutlinedIcon },
      { path: '/sites', label: 'Sites', icon: BusinessOutlinedIcon, addLabel: 'Add site' },
      {
        path: '/installations',
        label: 'Installations',
        icon: BuildOutlinedIcon,
        addLabel: 'Add installation',
      },
      { path: '/users', label: 'Users', icon: PeopleOutlinedIcon, addLabel: 'Add user' },
    ],
  },
  {
    label: 'Assets',
    sections: [
      { path: '/service', label: 'Service', icon: HandymanOutlinedIcon },
      { path: '/equipment', label: 'Equipment', icon: PrecisionManufacturingOutlinedIcon },
      { path: '/spare-parts', label: 'Spare parts', icon: Inventory2OutlinedIcon },
      { path: '/map', label: 'Map', icon: MapOutlinedIcon },
      { path: '/activity', label: 'Activity', icon: HistoryOutlinedIcon },
    ],
  },
];

const SECTIONS = NAV_GROUPS.flatMap((group) => group.sections);

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
            groups={NAV_GROUPS}
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
            groups={NAV_GROUPS}
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

      <AskSiteOps />
    </div>
  );
};

export default Layout;
