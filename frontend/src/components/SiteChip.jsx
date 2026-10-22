import { Link as RouterLink } from 'react-router-dom';
import { Chip } from '@mui/material';
import { FIELD_ICONS } from '../fieldIcons';

const SiteIcon = FIELD_ICONS.site;

const SiteChip = ({ siteId, siteName }) => (
  <Chip
    size="small"
    variant="outlined"
    clickable
    component={RouterLink}
    to={`/sites/${siteId}`}
    icon={<SiteIcon />}
    label={siteName}
    className="site-chip"
  />
);

export default SiteChip;
