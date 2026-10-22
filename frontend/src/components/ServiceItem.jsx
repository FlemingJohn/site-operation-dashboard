import { Button, Typography } from '@mui/material';
import MachineLink from './MachineLink';
import ServiceDueLine from './ServiceDueLine';

const describeLastService = (unit) =>
  unit.lastServiceBy ? `Last done by ${unit.lastServiceBy}` : 'No check-up recorded yet';

const ServiceItem = ({ unit, onMarkDone }) => (
  <li className="service-item">
    <MachineLink unit={unit}>
      <Typography variant="caption" color="text.secondary">
        {unit.siteName ?? 'In the warehouse'} · {describeLastService(unit)}
      </Typography>
      <ServiceDueLine unit={unit} />
    </MachineLink>
    <Button variant="outlined" size="small" onClick={() => onMarkDone(unit)}>
      Mark as done
    </Button>
  </li>
);

export default ServiceItem;
