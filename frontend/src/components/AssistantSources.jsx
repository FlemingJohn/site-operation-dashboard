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
        {isOpen ? 'Hide where this came from' : 'Where this came from'}
      </Button>
      <Collapse in={isOpen} unmountOnExit>
        <ul className="assistant-sources">
          {sources.map((source) => (
            <li key={`${source.label}-${source.summary}`}>
              <Typography variant="caption" color="text.secondary">
                {source.label} · {source.summary}
              </Typography>
            </li>
          ))}
        </ul>
      </Collapse>
    </div>
  );
};

export default AssistantSources;
