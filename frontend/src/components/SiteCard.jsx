import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { FIELD_ICONS } from '../fieldIcons';
import { pluralize } from '../lib/pluralize';
import StatusChip from './StatusChip';

const RegionIcon = FIELD_ICONS.region;
const InstallationIcon = FIELD_ICONS.equipment;

const SiteCard = ({ site }) => (
  <Card className="entity-card">
    <CardActionArea component={RouterLink} to={`/sites/${site.id}`} className="entity-card-action">
      <CardContent className="entity-card-content">
        <div className="entity-card-title">
          <Typography variant="subtitle1" component="h3" className="text-strong">
            {site.name}
          </Typography>
          <StatusChip status={site.status} />
        </div>
        <Typography variant="body2" color="text.secondary" className="entity-card-meta">
          <RegionIcon fontSize="inherit" />
          {site.region} · {site.city}
        </Typography>
        <Typography variant="body2" className="entity-card-footer">
          <span className="entity-card-meta">
            <InstallationIcon fontSize="inherit" />
            {pluralize(site.installationCount, 'installation')}
          </span>
          <span aria-hidden="true">→</span>
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default SiteCard;
