import { Link as RouterLink } from 'react-router-dom';
import { ButtonBase, Typography } from '@mui/material';

const RowTitle = ({ title, subtitle, path }) => (
  <ButtonBase component={RouterLink} to={path} className="row-title">
    <Typography variant="body2" component="span" className="text-strong">
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="caption" component="span" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </ButtonBase>
);

export default RowTitle;
