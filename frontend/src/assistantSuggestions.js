import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

export const ASSISTANT_SUGGESTIONS = [
  {
    question: 'Which machines need a check-up this week?',
    icon: HandymanOutlinedIcon,
    tone: 'warning',
  },
  { question: 'Which spare parts are running low?', icon: Inventory2OutlinedIcon, tone: 'danger' },
  { question: 'Which sites are inactive?', icon: BusinessOutlinedIcon, tone: 'primary' },
  {
    question: 'Which technician has the most open work?',
    icon: EngineeringOutlinedIcon,
    tone: 'success',
  },
];
