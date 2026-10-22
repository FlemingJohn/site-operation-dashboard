import { useState } from 'react';
import { Button, Collapse, Typography } from '@mui/material';

const AssistantSources = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button
        size="small"
        className="assistant-sources-toggle"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Hide how I found this' : 'How I found this'}
      </Button>
      <Collapse in={isOpen} unmountOnExit>
        <ul className="assistant-sources">
          {sources.map((source) => (
            <li key={source.tool}>
              <Typography variant="caption" color="text.secondary">
                <code>{source.tool}</code> · {source.summary}
              </Typography>
            </li>
          ))}
        </ul>
      </Collapse>
    </div>
  );
};

export default AssistantSources;
