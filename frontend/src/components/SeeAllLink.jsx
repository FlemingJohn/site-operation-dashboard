import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const SeeAllLink = ({ shown, total, seeAll, onOpenRecord }) => {
  if (!seeAll || total <= shown) return null;

  return (
    <div className="see-all">
      <Typography variant="caption" color="text.secondary">
        Showing {shown} of {total}
      </Typography>
      <Button
        size="small"
        variant="outlined"
        component={RouterLink}
        to={seeAll.path}
        onClick={onOpenRecord}
        endIcon={<ArrowForwardIcon />}
      >
        See all {total} on the {seeAll.label} page
      </Button>
    </div>
  );
};

export default SeeAllLink;
