import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, CardContent, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { FIELD_ICONS } from '../fieldIcons';
import StatusChip from './StatusChip';

const RegionIcon = FIELD_ICONS.region;

const SiteDetailHeader = ({ site, onDelete }) => (
  <Card>
    <CardContent className="detail-header">
      <Button
        component={RouterLink}
        to="/sites"
        size="small"
        startIcon={<ArrowBackIcon />}
        className="detail-back"
      >
        All sites
      </Button>
      <div className="detail-title">
        <Typography variant="h5" component="h2" className="text-strong">
          {site.name}
        </Typography>
        <StatusChip status={site.status} />
      </div>
      <Typography variant="body2" color="text.secondary" className="entity-card-meta">
        <RegionIcon fontSize="inherit" />
        {site.region} · {site.city}
      </Typography>
      <div className="detail-actions">
        <Button
          variant="outlined"
          component={RouterLink}
          to={`/sites/${site.id}/edit`}
          startIcon={<EditOutlinedIcon />}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlinedIcon />}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default SiteDetailHeader;
