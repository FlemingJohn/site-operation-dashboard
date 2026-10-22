import { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';

const MAX_TITLE_LENGTH = 60;

const RenameChatDialog = ({ conversation, onCancel, onRename }) => {
  const [title, setTitle] = useState(conversation.title ?? '');
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onRename(conversation, title.trim());
    } catch (saveError) {
      setError(saveError.message);
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onClose={isSaving ? undefined : onCancel} maxWidth="xs" fullWidth>
      <form onSubmit={save}>
        <DialogTitle>Rename chat</DialogTitle>
        <DialogContent>
          <Stack spacing={2} className="dialog-fields">
            <TextField
              id="rename-chat-title"
              label="Chat name"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              slotProps={{ htmlInput: { maxLength: MAX_TITLE_LENGTH } }}
              autoFocus
              fullWidth
            />
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSaving || !title.trim()}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RenameChatDialog;
