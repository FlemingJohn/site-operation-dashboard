import { useRef, useState } from 'react';
import { Badge, Fab, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useAssistantChat } from '../hooks/useAssistantChat';
import AssistantWindow from './AssistantWindow';

const AskSiteOps = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(isOpen);
  const chat = useAssistantChat({ isOpen: isOpenRef });
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));

  const changeOpen = (nextIsOpen) => {
    isOpenRef.current = nextIsOpen;
    setIsOpen(nextIsOpen);
    if (nextIsOpen) chat.markRead();
  };

  const close = () => {
    chat.clear();
    changeOpen(false);
  };

  if (isOpen) {
    return (
      <AssistantWindow
        chat={chat}
        isPhone={isPhone}
        onMinimise={() => changeOpen(false)}
        onClose={close}
        onOpenRecord={() => isPhone && changeOpen(false)}
      />
    );
  }

  return (
    <Tooltip title="Ask SiteOps" placement="left">
      <Fab
        color="primary"
        className="assistant-fab"
        aria-label={chat.hasUnread ? 'Ask SiteOps, new answer' : 'Ask SiteOps'}
        onClick={() => changeOpen(true)}
      >
        <Badge variant="dot" color="warning" invisible={!chat.hasUnread}>
          <AutoAwesomeOutlinedIcon />
        </Badge>
      </Fab>
    </Tooltip>
  );
};

export default AskSiteOps;
