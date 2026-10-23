import { useMemo, useState } from 'react';
import { Paper } from '@mui/material';
import { ChatBox } from '@mui/x-chat';
import { buildPartRenderers } from '../assistant/buildPartRenderers';
import { createAssistantAdapter } from '../assistant/createAssistantAdapter';
import { ASSISTANT_CHAT_TEXT, ASSISTANT_MEMBERS } from '../constants';
import { useChatHistoryActions } from '../hooks/useChatHistoryActions';
import AssistantShell from './AssistantShell';
import ChatAvatar from './ChatAvatar';
import ChatComposerHint from './ChatComposerHint';
import ChatComposerInput from './ChatComposerInput';
import ChatHeader from './ChatHeader';
import ChatHeaderActions from './ChatHeaderActions';
import ChatHeaderSubtitle from './ChatHeaderSubtitle';
import ChatHistoryDialogs from './ChatHistoryDialogs';
import ChatHistoryPanel from './ChatHistoryPanel';
import ChatSendButton from './ChatSendButton';
import ChatWelcome from './ChatWelcome';
import SuccessSnackbar from './SuccessSnackbar';

const CHAT_FEATURES = {
  conversationList: true,
  dateDivider: true,
  attachments: false,
  suggestions: false,
};
const LAYOUT_BREAKPOINTS = { overlay: 720, split: 380 };
const CHAT_SLOTS = {
  conversationList: ChatHistoryPanel,
  conversationHeader: ChatHeader,
  conversationSubtitle: ChatHeaderSubtitle,
  conversationHeaderActions: ChatHeaderActions,
  messageAvatar: ChatAvatar,
  emptyState: ChatWelcome,
  composerInput: ChatComposerInput,
  composerSendButton: ChatSendButton,
  composerHelperText: ChatComposerHint,
};

const getAuthorId = (message) => message.role;

const AssistantWindow = ({ chat, isPhone, onClose, onOpenRecord, onAnswerFinished }) => {
  const [isFull, setIsFull] = useState(false);
  const [notice, setNotice] = useState('');
  const actions = useChatHistoryActions(chat, setNotice);
  const layout = isPhone ? 'phone' : isFull ? 'full' : 'window';
  const { rememberSession } = chat;

  const adapter = useMemo(
    () => createAssistantAdapter({ onSession: rememberSession }),
    [rememberSession]
  );
  const partRenderers = useMemo(() => buildPartRenderers(onOpenRecord), [onOpenRecord]);

  const handleFinish = async () => {
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
          localeText={ASSISTANT_CHAT_TEXT}
          onFinish={handleFinish}
          layoutModeBreakpoints={LAYOUT_BREAKPOINTS}
          slots={CHAT_SLOTS}
          slotProps={{
            conversationList: {
              onNewChat: chat.startNewChat,
              onRename: actions.startRename,
              onDelete: actions.startDelete,
              onClearAll: actions.startClear,
              hasChats: chat.savedConversations.length > 0,
              loadError: chat.loadError,
            },
            conversationHeaderActions: {
              onNewChat: chat.startNewChat,
              canFullScreen: !isPhone,
              isFull,
              onToggleFull: () => setIsFull(!isFull),
              onClose,
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
