import { Typography } from '@mui/material';
import { isDraftChatId } from '../assistant/draftChatId';
import { formatChatTime } from '../lib/formatChatTime';
import { pluralize } from '../lib/pluralize';

const describeChat = (conversation) => {
  if (isDraftChatId(conversation.id)) return 'Not saved yet';
  const count = pluralize(conversation.metadata?.messageCount ?? 0, 'message');
  return `${formatChatTime(conversation.lastMessageAt)} · ${count}`;
};

const ChatRowTitle = ({ conversation }) => (
  <span className="chat-row-title">
    <Typography variant="body2" component="span" className="chat-row-name" noWrap>
      {conversation.title}
    </Typography>
    <Typography variant="caption" component="span" color="text.secondary" noWrap>
      {describeChat(conversation)}
    </Typography>
  </span>
);

export default ChatRowTitle;
