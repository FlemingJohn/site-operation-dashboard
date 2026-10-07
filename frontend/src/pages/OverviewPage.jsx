import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getSummary } from '../api/summaryApi';
import ErrorAlert from '../components/ErrorAlert';
import InstallationTable from '../components/InstallationTable';
import { INSTALLATION_STATUSES } from '../constants';
import { COLORS } from '../styles/theme';

const STATUS_CHART_COLORS = {
  completed: COLORS.success,
  in_progress: COLORS.warning,
  pending: COLORS.pending,
};

const getPercentage = (part, total) => (total === 0 ? 0 : Math.round((part / total) * 100));

const getStatCards = (totals) => [
  {
    label: 'Total sites',
    value: totals.sites,
    note: `${totals.sites - totals.activeSites} inactive`,
    icon: BusinessOutlinedIcon,
    tone: 'primary',
  },
  {
    label: 'Active sites',
    value: totals.activeSites,
    note: `${getPercentage(totals.activeSites, totals.sites)}% of all sites`,
    icon: CheckCircleOutlinedIcon,
    tone: 'success',
  },
  {
    label: 'Installations',
    value: totals.installations,
    note: `${totals.inProgressInstallations} in progress`,
    icon: BuildOutlinedIcon,
    tone: 'neutral',
  },
  {
    label: 'Completion rate',
    value: `${getPercentage(totals.completedInstallations, totals.installations)}%`,
    note: `${totals.completedInstallations} of ${totals.installations} completed`,
    icon: TrendingUpIcon,
    tone: 'success',
  },
];

const OverviewPage = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setError('');

    getSummary()
      .then((data) => {
        if (isCurrent) setSummary(data);
      })
      .catch((err) => {
        if (isCurrent) setError(err.message);
      });

    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  if (error) {
    return <ErrorAlert message={error} onRetry={() => setReloadKey((key) => key + 1)} />;
  }

  if (!summary) return <LinearProgress />;

  const statusData = INSTALLATION_STATUSES.map(({ value, label }) => ({
    id: value,
    label,
    value: summary.statusBreakdown.find((item) => item.status === value)?.count ?? 0,
    color: STATUS_CHART_COLORS[value],
  }));
  const totalInstallations = summary.totals.installations;

  return (
    <>
      <Grid container spacing={2}>
        {getStatCards(summary.totals).map(({ label, value, note, icon: Icon, tone }) => (
          <Grid key={label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card>
              <CardContent>
                <div className="stat-header">
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="h4">{value}</Typography>
                  </div>
                  <Avatar variant="rounded" className={`stat-icon stat-icon-${tone}`}>
                    <Icon fontSize="small" />
                  </Avatar>
                </div>
                <Typography variant="caption" color="text.secondary">
                  {note}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card className="chart-card">
            <CardHeader title="Installations by status" subheader="All time" />
            <CardContent className="chart-card-content">
              <div className="donut-layout">
                <div className="donut-chart">
                  <PieChart
                    width={170}
                    height={170}
                    margin={0}
                    hideLegend
                    series={[
                      {
                        data: statusData,
                        innerRadius: 64,
                        outerRadius: 84,
                        paddingAngle: 1,
                        cornerRadius: 2,
                      },
                    ]}
                  />
                  <div className="donut-total">
                    <Typography variant="h4">{totalInstallations}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      installations
                    </Typography>
                  </div>
                </div>
                <div className="donut-legend">
                  {statusData.map((item) => (
                    <div key={item.id} className="donut-legend-row">
                      <span className={`donut-legend-dot donut-legend-dot-${item.id}`} />
                      <Typography variant="body2">{item.label}</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {item.value}{' '}
                        <Typography component="span" variant="caption" color="text.secondary">
                          {getPercentage(item.value, totalInstallations)}%
                        </Typography>
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Card className="chart-card">
            <CardHeader title="Installations per month" subheader="Last 6 months" />
            <CardContent className="chart-card-content">
              <div className="bar-chart">
                <BarChart
                  height={240}
                  dataset={summary.monthlyInstallations}
                  xAxis={[{ scaleType: 'band', dataKey: 'label', categoryGapRatio: 0.7 }]}
                  yAxis={[{ tickMinStep: 1 }]}
                  series={[
                    {
                      dataKey: 'count',
                      label: 'Installations',
                      color: COLORS.primary,
                      barLabel: 'value',
                      barLabelPlacement: 'outside',
                    },
                  ]}
                  grid={{ horizontal: true }}
                  borderRadius={4}
                  hideLegend
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardHeader
          title="Recent installations"
          subheader="Latest five records"
          action={
            <Button component={Link} to="/installations" variant="outlined">
              View all
            </Button>
          }
        />
        <CardContent />
        <InstallationTable
          installations={summary.recentInstallations}
          emptyMessage="No installations yet."
        />
      </Card>
    </>
  );
};

export default OverviewPage;
