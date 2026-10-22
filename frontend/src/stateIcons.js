import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import BladeYokeDrawing from './components/BladeYokeDrawing';
import MobileRobotDrawing from './components/MobileRobotDrawing';
import TaglineSystemDrawing from './components/TaglineSystemDrawing';
import TowerGripperDrawing from './components/TowerGripperDrawing';

export const STATE_ICONS = {
  sites: {
    '': { icon: BusinessOutlinedIcon, tone: 'primary' },
    active: { icon: CheckCircleOutlinedIcon, tone: 'success' },
    inactive: { icon: PauseCircleOutlinedIcon, tone: 'neutral' },
  },
  users: {
    '': { icon: PeopleOutlinedIcon, tone: 'primary' },
    technician: { icon: EngineeringOutlinedIcon, tone: 'success' },
    admin: { icon: AdminPanelSettingsOutlinedIcon, tone: 'neutral' },
  },
  installations: {
    all: { icon: BuildOutlinedIcon, tone: 'primary' },
    pending: { icon: ScheduleOutlinedIcon, tone: 'neutral' },
    in_progress: { icon: AutorenewOutlinedIcon, tone: 'warning' },
    completed: { icon: TaskAltOutlinedIcon, tone: 'success' },
  },
  equipment: {
    '': { icon: PrecisionManufacturingOutlinedIcon, tone: 'primary' },
    blade_yoke: { icon: BladeYokeDrawing, tone: 'neutral' },
    tower_gripper: { icon: TowerGripperDrawing, tone: 'neutral' },
    tagline_system: { icon: TaglineSystemDrawing, tone: 'neutral' },
    mobile_robot: { icon: MobileRobotDrawing, tone: 'neutral' },
  },
  service: {
    late: { icon: ReportProblemOutlinedIcon, tone: 'danger' },
    this_week: { icon: EventOutlinedIcon, tone: 'warning' },
    later: { icon: ScheduleOutlinedIcon, tone: 'neutral' },
  },
  stock: {
    '': { icon: Inventory2OutlinedIcon, tone: 'primary' },
    out: { icon: RemoveShoppingCartOutlinedIcon, tone: 'danger' },
    low: { icon: TrendingDownOutlinedIcon, tone: 'warning' },
    stocked: { icon: CheckCircleOutlinedIcon, tone: 'success' },
  },
};
