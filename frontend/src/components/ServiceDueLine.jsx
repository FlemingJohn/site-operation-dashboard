import { Typography } from '@mui/material';
import { describeServiceDue } from '../lib/describeServiceDue';
import HealthRing from './HealthRing';

const ServiceDueLine = ({ unit, variant = 'body2' }) => (
  <Typography variant={variant} component="span" className="health-line">
    <HealthRing state={unit.serviceState} />
    {describeServiceDue(unit.nextServiceOn)}
  </Typography>
);

export default ServiceDueLine;
