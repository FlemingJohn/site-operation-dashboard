import { Link as RouterLink } from 'react-router-dom';
import { Chip, Typography } from '@mui/material';
import AssistantCard from './AssistantCard';
import AssistantSources from './AssistantSources';
import AssistantSteps from './AssistantSteps';

const AssistantMessage = ({ message, onOpenRecord }) => {
  if (message.role === 'user') {
    return (
      <div className="assistant-message assistant-message-user">
        <Typography variant="body2">{message.text}</Typography>
      </div>
    );
  }

  return (
    <div className="assistant-message assistant-message-answer" aria-live="polite">
      {message.status === 'thinking' && (
        <Typography variant="caption" color="text.secondary">
          Working out what to look up…
        </Typography>
      )}
      {message.steps.length > 0 && <AssistantSteps steps={message.steps} />}
      {message.text && (
        <Typography
          variant="body2"
          className={`assistant-text${message.status === 'error' ? ' assistant-text-error' : ''}`}
        >
          {message.text}
        </Typography>
      )}
      {message.card && message.status !== 'error' && (
        <AssistantCard card={message.card} onOpenRecord={onOpenRecord} />
      )}
      {message.records.length > 0 && (
        <div className="assistant-records">
          {message.records.map((record) => (
            <Chip
              key={`${record.path}-${record.label}`}
              label={record.label}
              clickable
              component={RouterLink}
              to={record.path}
              onClick={onOpenRecord}
              className="assistant-record"
            />
          ))}
        </div>
      )}
      {message.sources.length > 0 && <AssistantSources sources={message.sources} />}
    </div>
  );
};

export default AssistantMessage;
