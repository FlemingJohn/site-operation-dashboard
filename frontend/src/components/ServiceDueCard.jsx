import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, CardHeader, LinearProgress, Link, List, ListItem } from '@mui/material';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import { getServiceDue } from '../api/serviceApi';
import { EQUIPMENT_TYPE_LABELS } from '../constants';
import { useLoader } from '../hooks/useLoader';
import CardIcon from './CardIcon';
import EmptyState from './EmptyState';
import ErrorAlert from './ErrorAlert';
import ServiceDueLine from './ServiceDueLine';

const SHOWN_COUNT = 4;
const NO_UNITS = [];

const ServiceDueCard = () => {
  const service = useLoader(getServiceDue, NO_UNITS);
  const urgent = service.data.filter((unit) => unit.serviceState !== 'later');

  return (
    <Card className="overview-list-card">
      <CardHeader
        avatar={<CardIcon icon={HandymanOutlinedIcon} tone="warning" />}
        title="Check-ups due"
        subheader="Sample data · most urgent first"
        action={
          <Button component={RouterLink} to="/service" variant="outlined">
            Open service
          </Button>
        }
      />
      {service.isLoading && <LinearProgress />}
      {service.error && <ErrorAlert message={service.error} onRetry={service.reload} />}
      {!service.isLoading && urgent.length === 0 && (
        <EmptyState title="No check-ups due in the next 7 days." />
      )}
      <List dense>
        {urgent.slice(0, SHOWN_COUNT).map((unit) => (
          <ListItem key={unit.id} divider className="overview-list-item">
            <Link component={RouterLink} to={`/equipment/${unit.id}`} className="text-strong">
              {EQUIPMENT_TYPE_LABELS[unit.type]} {unit.serial}
            </Link>
            <ServiceDueLine unit={unit} />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default ServiceDueCard;
