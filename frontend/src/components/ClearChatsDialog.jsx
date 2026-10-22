import { Alert } from '@mui/material';
import { pluralize } from '../lib/pluralize';
import DeleteDialog from './DeleteDialog';

const CONFIRM_WORD = 'DELETE';

const countMessages = (conversations) =>
  conversations.reduce((total, chat) => total + (chat.metadata?.messageCount ?? 0), 0);

const ClearChatsDialog = ({ conversations, ...dialogProps }) => (
  <DeleteDialog
    {...dialogProps}
    open
    title={
      conversations.length === 1
        ? 'Delete your only chat?'
        : `Delete all ${pluralize(conversations.length, 'chat')}?`
    }
    message="You are about to delete every saved chat on this browser."
    confirmText={CONFIRM_WORD}
    confirmLabel="Delete all chats"
  >
    <Alert severity="error">
      All {pluralize(countMessages(conversations), 'message')} will be deleted and the assistant
      will forget them. This can&apos;t be undone.
    </Alert>
  </DeleteDialog>
);

export default ClearChatsDialog;
