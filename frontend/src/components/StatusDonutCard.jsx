import { Card, CardContent, CardHeader, LinearProgress, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { INSTALLATION_STATUSES } from '../constants';
import { STATUS_CHART_COLORS } from '../styles/theme';
import { getPercentage } from '../utils';

const DONUT_SIZE = 220;

const StatusDonutCard = ({ statusBreakdown, total }) => {
  const data = INSTALLATION_STATUSES.map(({ value, label }) => ({
    id: value,
    label,
    value: statusBreakdown.find((item) => item.status === value)?.count ?? 0,
    color: STATUS_CHART_COLORS[value],
  }));

  return (
    <Card className="chart-card">
      <CardHeader title="Installations by status" subheader="All time" />
      <CardContent className="chart-card-content">
        <div className="donut-layout">
          <div className="donut-chart">
            <PieChart
              width={DONUT_SIZE}
              height={DONUT_SIZE}
              margin={0}
              hideLegend
              series={[
                { data, innerRadius: 82, outerRadius: 108, paddingAngle: 1, cornerRadius: 2 },
              ]}
            />
            <div className="donut-total">
              <Typography variant="h4">{total}</Typography>
              <Typography variant="caption" color="text.secondary">
                installations
              </Typography>
            </div>
          </div>
          <div className="donut-legend">
            {data.map((item) => {
              const percentage = getPercentage(item.value, total);
              return (
                <div key={item.id} className="donut-legend-item">
                  <div className="donut-legend-row">
                    <span className={`donut-legend-dot donut-legend-dot-${item.id}`} />
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography variant="body2" className="text-strong">
                      {item.value}{' '}
                      <Typography component="span" variant="caption" color="text.secondary">
                        {percentage}%
                      </Typography>
                    </Typography>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    className={`donut-legend-bar donut-legend-bar-${item.id}`}
                    aria-label={`${item.label} ${percentage}%`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDonutCard;
