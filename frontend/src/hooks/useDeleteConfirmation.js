import { useState } from 'react';

export const useDeleteConfirmation = ({ deleteRequest, onDeleted }) => {
  const [item, setItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const open = (target) => {
    setError('');
    setItem(target);
  };

  const cancel = () => setItem(null);

  const confirm = async () => {
    setIsDeleting(true);
    setError('');

    try {
      await deleteRequest(item.id);
      onDeleted(item);
      setItem(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    item,
    open,
    dialogProps: {
      open: Boolean(item),
      error,
      isDeleting,
      onCancel: cancel,
      onConfirm: confirm,
    },
  };
};
