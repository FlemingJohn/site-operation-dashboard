import { useMemo, useState } from 'react';
import { IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { ChatBox } from '@mui/x-chat';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { buildPartRenderers } from '../assistant/buildPartRenderers';
import { createAssistantAdapter } from '../assistant/createAssistantAdapter';
import { ASSISTANT_CHAT_TEXT, ASSISTANT_MEMBERS, ASSISTANT_SUGGESTIONS } from '../constants';
import { useChatHistoryActions } from '../hooks/useChatHistoryActions';
import AssistantShell from './AssistantShell';
import ChatAvatar from './ChatAvatar';
import ChatHistoryDialogs from './ChatHistoryDialogs';
import ChatHistoryPanel from './ChatHistoryPanel';
import SuccessSnackbar from './SuccessSnackbar';

const CHAT_FEATURES = { conversationList: true, dateDivider: true, attachments: false };
const LAYOUT_BREAKPOINTS = { overlay: 720, split: 380 };

const getAuthorId = (message) => message.role;

const AssistantWindow = ({ chat, isPhone, onClose, onOpenRecord, onAnswerFinished }) => {
  const [isFull, setIsFull] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [notice, setNotice] = useState('');
  const actions = useChatHistoryActions(chat, setNotice);
  const layout = isPhone ? 'phone' : isFull ? 'full' : 'window';
  const { rememberSession } = chat;

  const adapter = useMemo(
    () =>
      createAssistantAdapter({ onSession: rememberSession, onStart: () => setIsAnswering(true) }),
    [rememberSession]
  );
  const partRenderers = useMemo(() => buildPartRenderers(onOpenRecord), [onOpenRecord]);

  const handleFinish = async () => {
    setIsAnswering(false);
    await chat.handleAnswerFinished();
    onAnswerFinished();
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    if (isFull) setIsFull(false);
    else onClose();
  };

  return (
    <AssistantShell layout={layout}>
      <Paper
        elevation={8}
        className="assistant-window"
        role="dialog"
        aria-label="Ask SiteOps"
        onKeyDown={handleKeyDown}
      >
        <div className="assistant-header">
          <span className="assistant-mark">
            <AutoAwesomeOutlinedIcon fontSize="small" />
          </span>
          <span className="assistant-heading">
            <Typography variant="subtitle2" component="h2" className="assistant-title">
              Ask SiteOps
            </Typography>
            <Typography variant="caption" className="assistant-status">
              Answers from your dashboard
            </Typography>
          </span>
          {!isPhone && (
            <Tooltip title={isFull ? 'Exit full screen (Esc)' : 'Full screen'}>
              <IconButton
                size="small"
                aria-label={isFull ? 'Exit full screen' : 'Full screen'}
                onClick={() => setIsFull(!isFull)}
              >
                {isFull ? (
                  <FullscreenExitIcon fontSize="small" />
                ) : (
                  <FullscreenIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Close">
            <IconButton size="small" aria-label="Close" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>

        <ChatBox
          className="assistant-chat"
          adapter={adapter}
          conversations={chat.conversations}
          activeConversationId={chat.activeId}
          onActiveConversationChange={chat.selectChat}
          members={ASSISTANT_MEMBERS}
          getMessageAuthorId={getAuthorId}
          partRenderers={partRenderers}
          features={CHAT_FEATURES}
          suggestions={ASSISTANT_SUGGESTIONS}
          suggestionsAutoSubmit
          localeText={ASSISTANT_CHAT_TEXT}
          onFinish={handleFinish}
          layoutModeBreakpoints={LAYOUT_BREAKPOINTS}
          slots={{ conversationList: ChatHistoryPanel, messageAvatar: ChatAvatar }}
          slotProps={{
            conversationList: {
              onNewChat: chat.startNewChat,
              onRename: actions.startRename,
              onDelete: actions.startDelete,
              onClearAll: actions.startClear,
              hasChats: chat.savedConversations.length > 0,
              isAnswering,
              loadError: chat.loadError,
            },
          }}
        />
      </Paper>
      <ChatHistoryDialogs actions={actions} conversations={chat.savedConversations} />
      <SuccessSnackbar message={notice} onClose={() => setNotice('')} />
    </AssistantShell>
  );
};

export default AssistantWindow;
