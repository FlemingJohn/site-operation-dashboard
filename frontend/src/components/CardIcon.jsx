import { Avatar } from '@mui/material';

const CardIcon = ({ icon: Icon, tone = 'primary' }) => (
  <Avatar variant="rounded" className={`stat-icon stat-icon-${tone}`}>
    <Icon fontSize="small" />
  </Avatar>
);

export default CardIcon;
