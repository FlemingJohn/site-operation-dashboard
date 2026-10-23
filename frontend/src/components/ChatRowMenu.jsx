import { useState } from 'react';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { isDraftChatId } from '../assistant/draftChatId';

const ChatRowMenu = ({ conversation, onRename, onDelete, isDisabled }) => {
  const [anchor, setAnchor] = useState(null);
  if (isDraftChatId(conversation.id)) return null;

  const stopRowClick = (event) => event.stopPropagation();

  const choose = (action) => (event) => {
    event.stopPropagation();
    setAnchor(null);
    action(conversation);
  };

  return (
    <div className="chat-row-menu" onClick={stopRowClick} onKeyDown={stopRowClick}>
      <IconButton
        size="small"
        aria-label={`Options for ${conversation.title}`}
        disabled={isDisabled}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        <MoreHorizIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem onClick={choose(onRename)}>
          <ListItemIcon>
            <DriveFileRenameOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={choose(onDelete)} className="menu-item-danger">
          <ListItemIcon>
            <DeleteOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ChatRowMenu;
