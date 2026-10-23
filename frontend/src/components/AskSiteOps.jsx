import { Suspense, lazy, useCallback, useRef, useState } from 'react';
import { Badge, Fab, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useAssistantStatus } from '../hooks/useAssistantStatus';
import { useChatSessions } from '../hooks/useChatSessions';

const AssistantWindow = lazy(() => import('./AssistantWindow'));

const BUTTON_LABELS = {
  unread: 'Ask SiteOps, new answer',
  waking: 'Ask SiteOps is starting up',
};

const describeButton = (dot) => BUTTON_LABELS[dot] ?? 'Ask SiteOps';

const AskSiteOps = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const isOpenRef = useRef(isOpen);
  const chat = useChatSessions();
  const assistant = useAssistantStatus();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
  const dot = hasUnread ? 'unread' : assistant.status === 'waking' ? 'waking' : null;

  const changeOpen = (nextIsOpen) => {
    isOpenRef.current = nextIsOpen;
    setIsOpen(nextIsOpen);
    if (nextIsOpen) {
      setHasOpened(true);
      setHasUnread(false);
      assistant.recheck();
    }
  };

  const handleAnswerFinished = useCallback(() => {
    if (!isOpenRef.current) setHasUnread(true);
  }, []);

  const handleOpenRecord = useCallback(() => {
    if (isPhone) changeOpen(false);
  }, [isPhone]);

  return (
    <>
      {hasOpened && (
        <div hidden={!isOpen}>
          <Suspense fallback={null}>
            <AssistantWindow
              chat={chat}
              isPhone={isPhone}
              onClose={() => changeOpen(false)}
              onOpenRecord={handleOpenRecord}
              onAnswerFinished={handleAnswerFinished}
            />
          </Suspense>
        </div>
      )}
      {!isOpen && (
        <Tooltip title={describeButton(dot)} placement="left">
          <Fab
            color="primary"
            className="assistant-fab"
            aria-label={describeButton(dot)}
            onClick={() => changeOpen(true)}
          >
            <Badge variant="dot" invisible={!dot} className={`assistant-fab-dot-${dot}`}>
              <AutoAwesomeOutlinedIcon />
            </Badge>
          </Fab>
        </Tooltip>
      )}
    </>
  );
};

export default AskSiteOps;
