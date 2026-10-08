import { useState } from 'react';
import { Card, CardContent, CardHeader, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import { FIELD_ICONS } from '../fieldIcons';
import { STATUS_CHART_COLORS } from '../styles/theme';
import CardIcon from './CardIcon';

const CHART_HEIGHT = 260;
const MIN_AXIS_MAX = 3;
const VALUE_AXIS_LABEL = 'Installations';

const STATUS_SERIES = [
  { dataKey: 'completed', label: 'Completed', color: STATUS_CHART_COLORS.completed },
  { dataKey: 'inProgress', label: 'In progress', color: STATUS_CHART_COLORS.in_progress },
  { dataKey: 'pending', label: 'Pending', color: STATUS_CHART_COLORS.pending },
].map((series) => ({ ...series, stack: 'status' }));

const VIEWS = {
  month: {
    label: 'By month',
    icon: FIELD_ICONS.date,
    axisLabel: 'Month',
    subheader: 'Last 6 months, split by status',
    dataKey: 'monthlyInstallations',
    isHorizontal: false,
  },
  site: {
    label: 'By site',
    icon: FIELD_ICONS.site,
    axisLabel: 'Site',
    subheader: 'Per site, busiest first',
    dataKey: 'installationsBySite',
    isHorizontal: true,
  },
  technician: {
    label: 'By technician',
    icon: FIELD_ICONS.person,
    axisLabel: 'Technician',
    subheader: 'Per technician, busiest first',
    dataKey: 'installationsByTechnician',
    isHorizontal: true,
  },
};

const getAxisMax = (rows) => Math.max(MIN_AXIS_MAX, ...rows.map((row) => row.count));

const getAxes = (rows, { axisLabel, isHorizontal }) => {
  const size = isHorizontal ? { width: 'auto' } : { height: 'auto' };
  const valueSize = isHorizontal ? { height: 'auto' } : { width: 'auto' };
  const categoryAxis = {
    scaleType: 'band',
    dataKey: 'label',
    label: axisLabel,
    categoryGapRatio: isHorizontal ? 0.45 : 0.7,
    ...size,
  };
  const valueAxis = {
    label: VALUE_AXIS_LABEL,
    min: 0,
    max: getAxisMax(rows),
    tickMinStep: 1,
    ...valueSize,
  };

  return isHorizontal
    ? { xAxis: [valueAxis], yAxis: [categoryAxis] }
    : { xAxis: [categoryAxis], yAxis: [valueAxis] };
};

const InstallationBreakdownCard = ({ summary }) => {
  const [view, setView] = useState('month');
  const currentView = VIEWS[view];
  const rows = summary[currentView.dataKey];

  return (
    <Card className="chart-card">
      <CardHeader
        avatar={<CardIcon icon={BarChartOutlinedIcon} />}
        title="Installations"
        subheader={currentView.subheader}
        action={
          <ToggleButtonGroup
            exclusive
            size="small"
            className="chart-toggle"
            value={view}
            onChange={(event, nextView) => nextView && setView(nextView)}
            aria-label="Group installations by"
          >
            {Object.entries(VIEWS).map(([key, { label, icon: Icon }]) => (
              <ToggleButton key={key} value={key} aria-label={label} title={label}>
                <Icon fontSize="small" />
                <span className="chart-toggle-label">{label}</span>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        <BarChart
          height={CHART_HEIGHT}
          dataset={rows}
          layout={currentView.isHorizontal ? 'horizontal' : 'vertical'}
          series={STATUS_SERIES}
          grid={currentView.isHorizontal ? { vertical: true } : { horizontal: true }}
          borderRadius={4}
          slotProps={{ legend: { position: { vertical: 'bottom', horizontal: 'center' } } }}
          {...getAxes(rows, currentView)}
        />
      </CardContent>
    </Card>
  );
};

export default InstallationBreakdownCard;
