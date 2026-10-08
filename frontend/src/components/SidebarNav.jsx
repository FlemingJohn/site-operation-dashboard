import { Link } from 'react-router-dom';
import {
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const NavItem = ({ label, icon: Icon, isCollapsed, ...buttonProps }) => (
  <Tooltip title={isCollapsed ? label : ''} placement="right">
    <ListItemButton aria-label={isCollapsed ? label : undefined} {...buttonProps}>
      <ListItemIcon>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  </Tooltip>
);

const SidebarNav = ({ sections, activePath, isCollapsed = false, onToggle, onNavigate }) => (
  <>
    <Toolbar>
      <Stack direction="row" className="app-brand">
        <Avatar variant="rounded" className="app-brand-mark">
          <BusinessOutlinedIcon fontSize="small" />
        </Avatar>
        <Typography variant="h6" className="app-brand-name">
          SiteOps
        </Typography>
      </Stack>
    </Toolbar>
    <List subheader={<ListSubheader>Operations</ListSubheader>}>
      {sections.map(({ path, label, icon }) => (
        <NavItem
          key={path}
          label={label}
          icon={icon}
          isCollapsed={isCollapsed}
          component={Link}
          to={path}
          selected={activePath === path}
          onClick={onNavigate}
        />
      ))}
    </List>
    {onToggle && (
      <List className="app-nav-footer">
        <NavItem
          label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          icon={isCollapsed ? KeyboardDoubleArrowRightIcon : KeyboardDoubleArrowLeftIcon}
          isCollapsed={isCollapsed}
          aria-expanded={!isCollapsed}
          onClick={onToggle}
        />
      </List>
    )}
  </>
);

export default SidebarNav;
