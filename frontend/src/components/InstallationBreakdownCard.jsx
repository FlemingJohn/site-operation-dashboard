import { useState } from 'react';
import { Card, CardContent, CardHeader, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { STATUS_CHART_COLORS } from '../styles/theme';

const CHART_HEIGHT = 240;
const MIN_AXIS_MAX = 3;
const NAME_AXIS_WIDTH = 150;

const STATUS_SERIES = [
  { dataKey: 'completed', label: 'Completed', color: STATUS_CHART_COLORS.completed },
  { dataKey: 'inProgress', label: 'In progress', color: STATUS_CHART_COLORS.in_progress },
  { dataKey: 'pending', label: 'Pending', color: STATUS_CHART_COLORS.pending },
].map((series) => ({ ...series, stack: 'status' }));

const VIEWS = {
  month: {
    label: 'By month',
    subheader: 'Last 6 months, split by status',
    dataKey: 'monthlyInstallations',
    isHorizontal: false,
  },
  site: {
    label: 'By site',
    subheader: 'Per site, busiest first',
    dataKey: 'installationsBySite',
    isHorizontal: true,
  },
  technician: {
    label: 'By technician',
    subheader: 'Per technician, busiest first',
    dataKey: 'installationsByTechnician',
    isHorizontal: true,
  },
};

const getAxisMax = (rows) => Math.max(MIN_AXIS_MAX, ...rows.map((row) => row.count));

const getAxes = (rows, isHorizontal) => {
  const categoryAxis = {
    scaleType: 'band',
    dataKey: 'label',
    categoryGapRatio: isHorizontal ? 0.45 : 0.7,
    ...(isHorizontal && { width: NAME_AXIS_WIDTH }),
  };
  const valueAxis = { min: 0, max: getAxisMax(rows), tickMinStep: 1 };

  return isHorizontal
    ? { xAxis: [valueAxis], yAxis: [categoryAxis] }
    : { xAxis: [categoryAxis], yAxis: [valueAxis] };
};

const InstallationBreakdownCard = ({ summary }) => {
  const [view, setView] = useState('month');
  const { subheader, dataKey, isHorizontal } = VIEWS[view];
  const rows = summary[dataKey];

  return (
    <Card className="chart-card">
      <CardHeader
        title="Installations"
        subheader={subheader}
        action={
          <ToggleButtonGroup
            exclusive
            size="small"
            value={view}
            onChange={(event, nextView) => nextView && setView(nextView)}
            aria-label="Group installations by"
          >
            {Object.entries(VIEWS).map(([key, { label }]) => (
              <ToggleButton key={key} value={key}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        <BarChart
          height={CHART_HEIGHT}
          dataset={rows}
          layout={isHorizontal ? 'horizontal' : 'vertical'}
          series={STATUS_SERIES}
          grid={isHorizontal ? { vertical: true } : { horizontal: true }}
          borderRadius={4}
          slotProps={{ legend: { position: { vertical: 'bottom', horizontal: 'center' } } }}
          {...getAxes(rows, isHorizontal)}
        />
      </CardContent>
    </Card>
  );
};

export default InstallationBreakdownCard;
