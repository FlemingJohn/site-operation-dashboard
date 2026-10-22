import ClearChatsDialog from './ClearChatsDialog';
import DeleteChatDialog from './DeleteChatDialog';
import RenameChatDialog from './RenameChatDialog';

const ChatHistoryDialogs = ({ actions, conversations }) => (
  <>
    {actions.renaming && (
      <RenameChatDialog
        key={actions.renaming.id}
        conversation={actions.renaming}
        onCancel={actions.cancel}
        onRename={actions.rename}
      />
    )}
    {actions.deleting && (
      <DeleteChatDialog
        conversation={actions.deleting}
        error={actions.error}
        isDeleting={actions.isBusy}
        onCancel={actions.cancel}
        onConfirm={actions.confirmDelete}
      />
    )}
    {actions.isClearing && (
      <ClearChatsDialog
        conversations={conversations}
        error={actions.error}
        isDeleting={actions.isBusy}
        onCancel={actions.cancel}
        onConfirm={actions.confirmClear}
      />
    )}
  </>
);

export default ChatHistoryDialogs;
