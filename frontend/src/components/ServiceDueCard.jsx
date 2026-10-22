import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, CardHeader, LinearProgress, List, ListItem } from '@mui/material';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import { getServiceDue } from '../api/serviceApi';
import { useLoader } from '../hooks/useLoader';
import CardIcon from './CardIcon';
import EmptyState from './EmptyState';
import ErrorAlert from './ErrorAlert';
import MachineLink from './MachineLink';
import ServiceDueLine from './ServiceDueLine';

const SHOWN_COUNT = 4;
const NO_UNITS = { data: [] };

const loadUrgent = () => getServiceDue({ limit: SHOWN_COUNT });

const ServiceDueCard = () => {
  const service = useLoader(loadUrgent, NO_UNITS);
  const urgent = service.data.data.filter((unit) => unit.serviceState !== 'later');

  return (
    <Card className="overview-list-card">
      <CardHeader
        avatar={<CardIcon icon={HandymanOutlinedIcon} tone="warning" />}
        title="Check-ups due"
        subheader="Most urgent first"
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
        {urgent.map((unit) => (
          <ListItem key={unit.id} divider disablePadding>
            <MachineLink unit={unit}>
              <ServiceDueLine unit={unit} />
            </MachineLink>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default ServiceDueCard;
