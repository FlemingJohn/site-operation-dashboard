import { Typography } from '@mui/material';
import { groupByDay } from '../lib/groupByDay';
import ActivityRow from './ActivityRow';

const ActivityList = ({ events }) => (
  <div className="activity-list">
    {groupByDay(events).map((group) => (
      <section key={group.day} aria-label={group.label}>
        <Typography variant="overline" component="h3" className="activity-day">
          {group.label}
        </Typography>
        <ul className="activity-rows">
          {group.events.map((event) => (
            <ActivityRow key={event.id} event={event} />
          ))}
        </ul>
      </section>
    ))}
  </div>
);

export default ActivityList;
