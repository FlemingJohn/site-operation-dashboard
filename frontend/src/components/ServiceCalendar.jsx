import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { EQUIPMENT_TYPE_LABELS } from '../constants';
import { getMonthDays } from '../lib/getMonthDays';
import { getToday } from '../utils';

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

const ServiceCalendar = ({ units }) => {
  const [shown, setShown] = useState(getCurrentMonth);
  const today = getToday();
  const unitsByDate = groupByDate(units);
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
      <div className="calendar-grid">
        {WEEKDAYS.map((weekday) => (
          <Typography key={weekday} variant="caption" className="calendar-weekday">
            {weekday}
          </Typography>
        ))}
        {getMonthDays(shown.year, shown.month).map(({ key, day, isCurrentMonth }) => (
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
