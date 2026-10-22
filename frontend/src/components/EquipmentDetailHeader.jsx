import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, CardContent, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { EQUIPMENT_TYPE_LABELS } from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import EquipmentDrawing from './EquipmentDrawing';
import RecordChip from './RecordChip';
import ServiceDueLine from './ServiceDueLine';
import StatusChip from './StatusChip';

const SiteIcon = FIELD_ICONS.site;

const EquipmentDetailHeader = ({ unit, action }) => (
  <Card>
    <CardContent className="equipment-detail-header">
      <EquipmentDrawing type={unit.type} size="large" />
      <div className="detail-header">
        <Button
          component={RouterLink}
          to="/equipment"
          size="small"
          startIcon={<ArrowBackIcon />}
          className="detail-back"
        >
          All equipment
        </Button>
        <div className="detail-title">
          <Typography variant="h5" component="h2" className="text-strong">
            {EQUIPMENT_TYPE_LABELS[unit.type]} {unit.serial}
          </Typography>
          <StatusChip status={unit.status} />
        </div>
        {unit.siteId ? (
          <RecordChip label={unit.siteName} path={`/sites/${unit.siteId}`} icon={SiteIcon} />
        ) : (
          <Typography variant="body2" color="text.secondary" className="entity-card-meta">
            <SiteIcon fontSize="inherit" />
            In the warehouse
          </Typography>
        )}
        <ServiceDueLine unit={unit} />
        {action && <div className="detail-actions">{action}</div>}
      </div>
    </CardContent>
  </Card>
);

export default EquipmentDetailHeader;
