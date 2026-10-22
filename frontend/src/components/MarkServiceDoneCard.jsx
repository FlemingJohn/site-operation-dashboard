import { useState } from 'react';
import { Typography } from '@mui/material';
import { EQUIPMENT_TYPE_LABELS } from '../constants';
import { formatDate } from '../utils';
import ChatSavedNote from './ChatSavedNote';
import MarkDoneForm from './MarkDoneForm';

const MarkServiceDoneCard = ({ machine, doneOn, technicianId, notes, onOpenRecord }) => {
  const [outcome, setOutcome] = useState(null);

  if (outcome === 'cancelled') {
    return (
      <Typography variant="caption" color="text.secondary">
        Not saved. Ask again whenever you are ready.
      </Typography>
    );
  }
  if (outcome) {
    return (
      <ChatSavedNote
        text={`Check-up for ${machine.serial} saved. Next check-up ${formatDate(outcome.nextServiceOn)}.`}
        link={{ label: machine.serial, path: `/equipment/${machine.id}` }}
        onOpenRecord={onOpenRecord}
      />
    );
  }

  return (
    <div className="chat-action-card">
      <div className="chat-action-title">
        <Typography variant="subtitle2" component="h3">
          Mark check-up as done
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {EQUIPMENT_TYPE_LABELS[machine.type]} {machine.serial}
          {machine.siteName ? ` · ${machine.siteName}` : ''}
        </Typography>
      </div>
      <MarkDoneForm
        unit={machine}
        defaults={{ doneOn, technicianId, notes }}
        onSaved={setOutcome}
        onCancel={() => setOutcome('cancelled')}
      />
    </div>
  );
};

export default MarkServiceDoneCard;
