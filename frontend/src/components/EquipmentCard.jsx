import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { EQUIPMENT_TYPE_LABELS } from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import EquipmentDrawing from './EquipmentDrawing';
import ServiceDueLine from './ServiceDueLine';
import StatusChip from './StatusChip';

const SiteIcon = FIELD_ICONS.site;

const EquipmentCard = ({ unit }) => (
  <Card className="entity-card">
    <CardActionArea
      component={RouterLink}
      to={`/equipment/${unit.id}`}
      className="entity-card-action"
    >
      <CardContent className="entity-card-content">
        <EquipmentDrawing type={unit.type} />
        <div className="entity-card-title">
          <div>
            <Typography variant="subtitle1" component="h3" className="text-strong">
              {unit.serial}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {EQUIPMENT_TYPE_LABELS[unit.type]}
            </Typography>
          </div>
          <StatusChip status={unit.status} />
        </div>
        <Typography variant="body2" color="text.secondary" className="entity-card-meta">
          <SiteIcon fontSize="inherit" />
          {unit.siteName ?? 'In the warehouse'}
        </Typography>
        <div className="entity-card-footer">
          <ServiceDueLine unit={unit} />
        </div>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default EquipmentCard;
