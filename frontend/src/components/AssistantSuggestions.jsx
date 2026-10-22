import { Chip, Typography } from '@mui/material';

const SUGGESTED_QUESTIONS = [
  'Which machines need a check-up this week?',
  'Which spare parts are running low?',
  'Which sites are inactive?',
  'Which technician has the most open work?',
];

const AssistantSuggestions = ({ onPick }) => (
  <div className="assistant-welcome">
    <Typography variant="body2">
      Ask me about your sites, machines, check-ups and spare parts. I look up the answer and show
      you where I found it.
    </Typography>
    <div className="assistant-suggestions">
      {SUGGESTED_QUESTIONS.map((question) => (
        <Chip
          key={question}
          label={question}
          variant="outlined"
          clickable
          onClick={() => onPick(question)}
          className="assistant-suggestion"
        />
      ))}
    </div>
  </div>
);

export default AssistantSuggestions;
