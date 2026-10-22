import { Suspense, lazy, useCallback, useRef, useState } from 'react';
import { Badge, Fab, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useChatSessions } from '../hooks/useChatSessions';

const AssistantWindow = lazy(() => import('./AssistantWindow'));

const AskSiteOps = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const isOpenRef = useRef(isOpen);
  const chat = useChatSessions();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));

  const changeOpen = (nextIsOpen) => {
    isOpenRef.current = nextIsOpen;
    setIsOpen(nextIsOpen);
    if (nextIsOpen) {
      setHasOpened(true);
      setHasUnread(false);
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
        <Tooltip title="Ask SiteOps" placement="left">
          <Fab
            color="primary"
            className="assistant-fab"
            aria-label={hasUnread ? 'Ask SiteOps, new answer' : 'Ask SiteOps'}
            onClick={() => changeOpen(true)}
          >
            <Badge variant="dot" color="warning" invisible={!hasUnread}>
              <AutoAwesomeOutlinedIcon />
            </Badge>
          </Fab>
        </Tooltip>
      )}
    </>
  );
};

export default AskSiteOps;
