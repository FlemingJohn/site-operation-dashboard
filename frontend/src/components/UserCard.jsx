import { Card, CardContent, Typography } from '@mui/material';
import { ROLE_LABELS } from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import PersonAvatar from './PersonAvatar';

const EmailIcon = FIELD_ICONS.email;
const PhoneIcon = FIELD_ICONS.phone;

const UserCard = ({ user }) => (
  <Card className="entity-card">
    <CardContent className="entity-card-content">
      <div className="entity-card-person">
        <PersonAvatar name={user.fullName} />
        <div>
          <Typography variant="subtitle1" component="h3" className="text-strong">
            {user.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {ROLE_LABELS[user.role] ?? user.role}
          </Typography>
        </div>
      </div>
      <Typography variant="body2" color="text.secondary" className="entity-card-meta">
        <EmailIcon fontSize="inherit" />
        {user.email}
      </Typography>
      <Typography variant="body2" color="text.secondary" className="entity-card-meta">
        <PhoneIcon fontSize="inherit" />
        {user.phone ?? 'No phone number'}
      </Typography>
    </CardContent>
  </Card>
);

export default UserCard;
