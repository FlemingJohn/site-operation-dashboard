import { Alert, Button } from '@mui/material';
import { ChatConversationList } from '@mui/x-chat';
import { useChatStatus } from '@mui/x-chat-headless';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ChatRowIcon from './ChatRowIcon';
import ChatRowMenu from './ChatRowMenu';
import ChatRowTitle from './ChatRowTitle';

const ROW_SLOTS = { itemActions: ChatRowMenu, unreadBadge: ChatRowIcon, title: ChatRowTitle };

const ChatHistoryPanel = ({
  onNewChat,
  onRename,
  onDelete,
  onClearAll,
  hasChats,
  loadError,
  ...listProps
}) => {
  const { isStreaming } = useChatStatus();

  return (
    <div className="chat-history">
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onNewChat}
        className="chat-history-new"
      >
        New chat
      </Button>
      {loadError && <Alert severity="error">{loadError}</Alert>}
      <ChatConversationList
        {...listProps}
        variant="compact"
        className="chat-history-list"
        slots={ROW_SLOTS}
        slotProps={{ itemActions: { onRename, onDelete, isDisabled: isStreaming } }}
      />
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteOutlinedIcon />}
        onClick={onClearAll}
        disabled={!hasChats || isStreaming}
        className="chat-history-clear"
      >
        Clear all chats
      </Button>
    </div>
  );
};

export default ChatHistoryPanel;
