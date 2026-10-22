import { useCallback, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, Chip, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getServiceDue } from '../api/serviceApi';
import { EQUIPMENT_TYPE_LABELS, MAX_SELECT_OPTIONS } from '../constants';
import { useLoader } from '../hooks/useLoader';
import { getMonthDays } from '../lib/getMonthDays';
import { getToday } from '../utils';
import ErrorAlert from './ErrorAlert';

const NO_UNITS = { data: [] };

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getCurrentMonth = () => {
  const today = new Date();
  return { year: today.getFullYear(), month: today.getMonth() };
};

const moveMonth = ({ year, month }, step) => {
  const date = new Date(year, month + step, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
};

const groupByDate = (units) =>
  units.reduce((groups, unit) => {
    groups[unit.nextServiceOn] = [...(groups[unit.nextServiceOn] ?? []), unit];
    return groups;
  }, {});

const ServiceCalendar = ({ search }) => {
  const [shown, setShown] = useState(getCurrentMonth);
  const days = getMonthDays(shown.year, shown.month);
  const dueFrom = days[0].key;
  const dueTo = days[days.length - 1].key;
  const loadMonth = useCallback(
    () => getServiceDue({ dueFrom, dueTo, search, limit: MAX_SELECT_OPTIONS }),
    [dueFrom, dueTo, search]
  );
  const units = useLoader(loadMonth, NO_UNITS);
  const today = getToday();
  const unitsByDate = groupByDate(units.data.data);
  const monthLabel = new Date(shown.year, shown.month, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card className="calendar">
      <div className="calendar-header">
        <Tooltip title="Previous month">
          <IconButton aria-label="Previous month" onClick={() => setShown(moveMonth(shown, -1))}>
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="subtitle1" component="h3" className="calendar-title">
          {monthLabel}
        </Typography>
        <Tooltip title="Next month">
          <IconButton aria-label="Next month" onClick={() => setShown(moveMonth(shown, 1))}>
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>
        <Button size="small" onClick={() => setShown(getCurrentMonth())}>
          This month
        </Button>
      </div>
      {units.isLoading && <LinearProgress />}
      {units.error && <ErrorAlert message={units.error} onRetry={units.reload} />}
      <div className="calendar-grid">
        {WEEKDAYS.map((weekday) => (
          <Typography key={weekday} variant="caption" className="calendar-weekday">
            {weekday}
          </Typography>
        ))}
        {days.map(({ key, day, isCurrentMonth }) => (
          <div
            key={key}
            className={`calendar-day${isCurrentMonth ? '' : ' calendar-day-outside'}${
              key === today ? ' calendar-day-today' : ''
            }`}
          >
            <Typography variant="caption" className="calendar-day-number">
              {day}
            </Typography>
            {(unitsByDate[key] ?? []).map((unit) => (
              <Tooltip key={unit.id} title={`${EQUIPMENT_TYPE_LABELS[unit.type]} ${unit.serial}`}>
                <Chip
                  size="small"
                  clickable
                  component={RouterLink}
                  to={`/equipment/${unit.id}`}
                  label={unit.serial}
                  className={`calendar-chip calendar-chip-${unit.serviceState}`}
                />
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ServiceCalendar;
