import { CircularProgress, Typography } from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const STATES = {
  waiting: { text: 'Waiting', icon: <RadioButtonUncheckedIcon fontSize="small" /> },
  waking: {
    text: 'Waking up',
    icon: <CircularProgress size={18} thickness={5} color="inherit" />,
  },
  ready: { text: 'Ready', icon: <CheckCircleOutlineOutlinedIcon fontSize="small" /> },
  failed: { text: 'No answer', icon: <HighlightOffOutlinedIcon fontSize="small" /> },
  off: { text: 'Not set up', icon: <RadioButtonUncheckedIcon fontSize="small" /> },
};

const StartupStatusRow = ({ label, state, note }) => (
  <li className={`startup-row startup-row-${state}`}>
    <span className="startup-row-icon">{STATES[state].icon}</span>
    <Typography variant="body2" component="span" className="startup-row-label">
      {label}
    </Typography>
    <Typography variant="body2" component="span" className="startup-row-state">
      {note ?? STATES[state].text}
    </Typography>
  </li>
);

export default StartupStatusRow;
