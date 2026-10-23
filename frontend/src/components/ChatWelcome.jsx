import { ButtonBase, Typography } from '@mui/material';
import { useChatActions } from '@mui/x-chat-headless';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { ASSISTANT_SUGGESTIONS } from '../assistantSuggestions';
import CardIcon from './CardIcon';

const ChatWelcome = () => {
  const { sendMessage } = useChatActions();

  const ask = (question) => sendMessage({ parts: [{ type: 'text', text: question }] });

  return (
    <div className="chat-welcome">
      <span className="chat-welcome-mark" aria-hidden="true">
        <AutoAwesomeOutlinedIcon />
      </span>
      <Typography variant="h6" component="h3" className="chat-welcome-title">
        What would you like to know?
      </Typography>
      <Typography variant="body2" color="text.secondary" className="chat-welcome-hint">
        Ask about sites, machines, check-ups or spare parts.
      </Typography>
      <div className="chat-welcome-cards">
        {ASSISTANT_SUGGESTIONS.map(({ question, icon, tone }) => (
          <ButtonBase key={question} className="chat-welcome-card" onClick={() => ask(question)}>
            <CardIcon icon={icon} tone={tone} />
            <Typography variant="body2" component="span">
              {question}
            </Typography>
          </ButtonBase>
        ))}
      </div>
    </div>
  );
};

export default ChatWelcome;
