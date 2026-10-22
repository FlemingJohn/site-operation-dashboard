import { CircularProgress, Typography } from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

const AssistantSteps = ({ steps }) => (
  <ul className="assistant-steps">
    {steps.map((step) => (
      <li key={step.label} className="assistant-step">
        {step.isDone ? (
          <CheckCircleOutlineOutlinedIcon fontSize="inherit" className="assistant-step-done" />
        ) : (
          <CircularProgress size={12} />
        )}
        <Typography variant="caption" color="text.secondary">
          {step.label}
        </Typography>
      </li>
    ))}
  </ul>
);

export default AssistantSteps;
