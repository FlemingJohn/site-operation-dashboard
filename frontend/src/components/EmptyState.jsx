import { Button, Typography } from '@mui/material';
import EmptyIllustration from './EmptyIllustration';

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="empty-state">
    <EmptyIllustration />
    <Typography variant="body2" className="text-strong">
      {title}
    </Typography>
    {description && (
      <Typography variant="caption" color="text.secondary">
        {description}
      </Typography>
    )}
    {onAction && (
      <Button size="small" variant="outlined" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
