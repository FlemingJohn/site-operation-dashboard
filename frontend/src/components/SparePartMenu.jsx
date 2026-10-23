import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

const SparePartMenu = ({ part, onAdjust, onDelete }) => {
  const [anchor, setAnchor] = useState(null);

  const choose = (action) => () => {
    setAnchor(null);
    action(part);
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label={`Options for ${part.name}`}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem onClick={choose(onAdjust)}>
          <ListItemIcon>
            <TuneOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Adjust stock</ListItemText>
        </MenuItem>
        <MenuItem component={RouterLink} to={`/spare-parts/${part.id}/edit`}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={choose(onDelete)} className="menu-item-danger">
          <ListItemIcon>
            <DeleteOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default SparePartMenu;
