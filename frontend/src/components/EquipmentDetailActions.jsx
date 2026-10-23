import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const EquipmentDetailActions = ({ unit, onMarkDone, onDelete }) => (
  <>
    <Button variant="contained" startIcon={<TaskAltIcon />} onClick={onMarkDone}>
      Mark check-up as done
    </Button>
    <Button
      variant="outlined"
      component={RouterLink}
      to={`/equipment/${unit.id}/edit`}
      startIcon={<EditOutlinedIcon />}
    >
      Edit
    </Button>
    <Button variant="outlined" color="error" startIcon={<DeleteOutlinedIcon />} onClick={onDelete}>
      Delete
    </Button>
  </>
);

export default EquipmentDetailActions;
