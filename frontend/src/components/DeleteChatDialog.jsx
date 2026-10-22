import { pluralize } from '../lib/pluralize';
import DeleteDialog from './DeleteDialog';

const DeleteChatDialog = ({ conversation, ...dialogProps }) => (
  <DeleteDialog
    {...dialogProps}
    open
    title="Delete this chat?"
    message={`"${conversation.title}" and its ${pluralize(
      conversation.metadata?.messageCount ?? 0,
      'message'
    )} will be deleted. The assistant will forget it. This can't be undone.`}
  />
);

export default DeleteChatDialog;
