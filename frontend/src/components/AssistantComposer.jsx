import { useState } from 'react';
import { IconButton, TextField, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const AssistantComposer = ({ isDisabled, onSend }) => {
  const [question, setQuestion] = useState('');
  const canSend = question.trim() && !isDisabled;

  const send = (event) => {
    event.preventDefault();
    if (!canSend) return;
    onSend(question.trim());
    setQuestion('');
  };

  return (
    <form className="assistant-composer" onSubmit={send}>
      <TextField
        size="small"
        fullWidth
        autoFocus
        placeholder="Ask about sites, machines or parts"
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        slotProps={{ htmlInput: { 'aria-label': 'Your question', maxLength: 300 } }}
      />
      <Tooltip title="Send">
        <span>
          <IconButton type="submit" color="primary" disabled={!canSend} aria-label="Send">
            <SendIcon />
          </IconButton>
        </span>
      </Tooltip>
    </form>
  );
};

export default AssistantComposer;
