import { Alert, Button } from '@mui/material';
import { ChatConversationList } from '@mui/x-chat';
import AddIcon from '@mui/icons-material/Add';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import ChatRowMenu from './ChatRowMenu';

const ChatHistoryPanel = ({
  onNewChat,
  onRename,
  onDelete,
  onClearAll,
  hasChats,
  isAnswering,
  loadError,
  ...listProps
}) => (
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
      slots={{ itemActions: ChatRowMenu }}
      slotProps={{ itemActions: { onRename, onDelete, isDisabled: isAnswering } }}
    />
    <Button
      color="error"
      startIcon={<DeleteSweepOutlinedIcon />}
      onClick={onClearAll}
      disabled={!hasChats || isAnswering}
      className="chat-history-clear"
    >
      Clear all chats
    </Button>
  </div>
);

export default ChatHistoryPanel;
