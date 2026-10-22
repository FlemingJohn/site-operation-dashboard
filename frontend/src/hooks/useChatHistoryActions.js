import { useState } from 'react';
import { pluralize } from '../lib/pluralize';

export const useChatHistoryActions = (chat, showMessage) => {
  const [renaming, setRenaming] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState(null);

  const run = async (action, onDone) => {
    setIsBusy(true);
    setError(null);
    try {
      onDone(await action());
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setIsBusy(false);
    }
  };

  const close = () => {
    setDeleting(null);
    setIsClearing(false);
    setError(null);
  };

  return {
    renaming,
    deleting,
    isClearing,
    isBusy,
    error,
    startRename: setRenaming,
    startDelete: setDeleting,
    startClear: () => setIsClearing(true),
    cancel: () => {
      setRenaming(null);
      close();
    },
    rename: async (conversation, title) => {
      await chat.renameChat(conversation.id, title);
      setRenaming(null);
      showMessage('Chat renamed');
    },
    confirmDelete: () =>
      run(
        () => chat.deleteChat(deleting.id),
        () => {
          close();
          showMessage('Chat deleted');
        }
      ),
    confirmClear: () =>
      run(chat.clearAllChats, (deleted) => {
        close();
        showMessage(`${pluralize(deleted, 'chat')} deleted`);
      }),
  };
};
