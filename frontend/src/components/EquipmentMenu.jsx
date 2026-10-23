import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';

const EquipmentMenu = ({ unit, onMoveToStock, onDelete, className }) => {
  const [anchor, setAnchor] = useState(null);

  const choose = (action) => () => {
    setAnchor(null);
    action(unit);
  };

  return (
    <div className={className}>
      <IconButton
        size="small"
        aria-label={`Options for ${unit.serial}`}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem component={RouterLink} to={`/equipment/${unit.id}/edit`}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {unit.status !== 'in_stock' && (
          <MenuItem onClick={choose(onMoveToStock)}>
            <ListItemIcon>
              <WarehouseOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Move to In stock</ListItemText>
          </MenuItem>
        )}
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

export default EquipmentMenu;
