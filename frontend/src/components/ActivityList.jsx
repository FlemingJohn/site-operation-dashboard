import Timeline from '@mui/lab/Timeline';
import { groupByDay } from '../lib/groupByDay';
import ActivityRow from './ActivityRow';

const toTimelineEntries = (events) =>
  groupByDay(events).flatMap((group) =>
    group.events.map((event, index) => ({
      event,
      dayLabel: index === 0 ? group.label : null,
    }))
  );

const ActivityList = ({ events }) => {
  const entries = toTimelineEntries(events);

  return (
    <Timeline className="activity-timeline">
      {entries.map(({ event, dayLabel }, index) => (
        <ActivityRow
          key={event.id}
          event={event}
          dayLabel={dayLabel}
          isLast={index === entries.length - 1}
        />
      ))}
    </Timeline>
  );
};

export default ActivityList;
