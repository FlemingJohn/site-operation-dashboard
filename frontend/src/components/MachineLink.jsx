import { Link as RouterLink } from 'react-router-dom';
import { ButtonBase, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { EQUIPMENT_TYPE_LABELS } from '../constants';
import EquipmentDrawing from './EquipmentDrawing';

const MachineLink = ({ unit, onOpen, children }) => (
  <ButtonBase
    component={RouterLink}
    to={`/equipment/${unit.id}`}
    onClick={onOpen}
    className="machine-link"
  >
    <EquipmentDrawing type={unit.type} size="small" />
    <span className="machine-link-text">
      <Typography variant="body2" component="span" className="text-strong">
        {EQUIPMENT_TYPE_LABELS[unit.type]} {unit.serial}
      </Typography>
      {children}
    </span>
    <ChevronRightIcon fontSize="small" className="machine-link-arrow" />
  </ButtonBase>
);

export default MachineLink;
