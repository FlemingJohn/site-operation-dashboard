import { Avatar, Card, CardContent, Typography } from '@mui/material';

const StatCard = ({ label, value, note, icon: Icon, tone, visual }) => (
  <Card className="stat-card">
    <CardContent>
      <div className="stat-header">
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Avatar variant="rounded" className={`stat-icon stat-icon-${tone}`}>
          <Icon fontSize="small" />
        </Avatar>
      </div>
      <div className="stat-value-row">
        <Typography variant="h4">{value}</Typography>
        {visual && <div className="stat-visual">{visual}</div>}
      </div>
      <Typography variant="caption" color="text.secondary">
        {note}
      </Typography>
    </CardContent>
  </Card>
);

export default StatCard;
