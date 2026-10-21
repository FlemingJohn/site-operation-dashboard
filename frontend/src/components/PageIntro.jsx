import { Typography } from '@mui/material';

const PageIntro = ({ children }) => (
  <Typography variant="body2" color="text.secondary" className="page-intro">
    {children}
  </Typography>
);

export default PageIntro;
