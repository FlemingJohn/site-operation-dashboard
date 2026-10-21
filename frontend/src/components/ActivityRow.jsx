import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Badge, Button, Collapse, Link, Typography } from '@mui/material';
import { ACTIVITY_KIND_ICONS } from '../activityKindIcons';
import { formatTime } from '../lib/formatTime';
import ActivityChange from './ActivityChange';
import PersonAvatar from './PersonAvatar';

const ActivityRow = ({ event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const KindIcon = ACTIVITY_KIND_ICONS[event.kind];
  const hasDetails = Boolean(event.change?.length || event.note);
  const actorName = event.actorName ?? 'Someone';

  return (
    <li className="activity-row">
      <Typography variant="caption" color="text.secondary" className="activity-time">
        {formatTime(event.occurredAt)}
      </Typography>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Avatar className="activity-kind">
            <KindIcon fontSize="inherit" />
          </Avatar>
        }
      >
        <PersonAvatar name={actorName} />
      </Badge>
      <div className="activity-text">
        <Typography variant="body2">
          <span className="text-strong">{actorName}</span> {event.verb}{' '}
          <Link component={RouterLink} to={event.target.path}>
            {event.target.label}
          </Link>{' '}
          {event.after}
        </Typography>
        {hasDetails && (
          <Button
            size="small"
            className="activity-toggle"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Hide details' : 'Show details'}
          </Button>
        )}
        <Collapse in={isOpen} unmountOnExit>
          <div className="activity-details">
            {event.change?.length > 0 && <ActivityChange change={event.change} />}
            {event.note && (
              <Typography variant="body2" color="text.secondary" className="activity-note">
                {event.note}
              </Typography>
            )}
          </div>
        </Collapse>
      </div>
    </li>
  );
};

export default ActivityRow;
