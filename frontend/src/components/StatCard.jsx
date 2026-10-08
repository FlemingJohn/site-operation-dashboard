import { Card, CardContent, Typography } from '@mui/material';
import CardIcon from './CardIcon';

const StatCard = ({ label, value, note, icon, tone, visual }) => (
  <Card className="stat-card">
    <CardContent>
      <div className="stat-header">
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <CardIcon icon={icon} tone={tone} />
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
