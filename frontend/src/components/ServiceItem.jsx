import { Link as RouterLink } from 'react-router-dom';
import { Button, Link, Typography } from '@mui/material';
import { EQUIPMENT_TYPE_LABELS } from '../constants';
import EquipmentDrawing from './EquipmentDrawing';
import ServiceDueLine from './ServiceDueLine';

const describeLastService = (unit) =>
  unit.lastServiceBy ? `Last done by ${unit.lastServiceBy}` : 'No check-up recorded yet';

const ServiceItem = ({ unit, onMarkDone }) => (
  <li className="service-item">
    <EquipmentDrawing type={unit.type} size="small" />
    <div className="service-item-text">
      <Link component={RouterLink} to={`/equipment/${unit.id}`} className="text-strong">
        {EQUIPMENT_TYPE_LABELS[unit.type]} {unit.serial}
      </Link>
      <Typography variant="caption" color="text.secondary">
        {unit.siteName ?? 'In the warehouse'} · {describeLastService(unit)}
      </Typography>
      <ServiceDueLine unit={unit} />
    </div>
    <Button variant="outlined" size="small" onClick={() => onMarkDone(unit)}>
      Mark as done
    </Button>
  </li>
);

export default ServiceItem;
