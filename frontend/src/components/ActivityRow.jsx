import { useState } from 'react';
import { Button, Collapse, Typography } from '@mui/material';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { ACTIVITY_KIND_ICONS } from '../activityKindIcons';
import { formatTime } from '../lib/formatTime';
import ActivityChange from './ActivityChange';
import PersonAvatar from './PersonAvatar';
import RecordChip from './RecordChip';

const ActivityRow = ({ event, dayLabel, isLast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const KindIcon = ACTIVITY_KIND_ICONS[event.kind];
  const hasDetails = Boolean(event.change?.length || event.note);
  const actorName = event.actorName ?? 'Someone';

  return (
    <TimelineItem className="activity-row">
      <TimelineOppositeContent className="activity-time">
        {dayLabel && (
          <Typography variant="overline" component="h3" className="activity-day">
            {dayLabel}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          {formatTime(event.occurredAt)}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot className={`activity-dot activity-dot-${event.kind}`}>
          <KindIcon fontSize="small" />
        </TimelineDot>
        {!isLast && <TimelineConnector className="activity-connector" />}
      </TimelineSeparator>
      <TimelineContent className="activity-content">
        <div className="activity-line">
          <PersonAvatar name={actorName} />
          <Typography variant="body2" className="activity-text">
            <span className="text-strong">{actorName}</span> {event.verb}{' '}
            <RecordChip label={event.target.label} path={event.target.path} icon={KindIcon} />{' '}
            {event.after}
          </Typography>
        </div>
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
      </TimelineContent>
    </TimelineItem>
  );
};

export default ActivityRow;
