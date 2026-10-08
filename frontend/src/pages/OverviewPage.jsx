import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, Grid, LinearProgress } from '@mui/material';
import { Gauge } from '@mui/x-charts/Gauge';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getSummary } from '../api/summaryApi';
import CardIcon from '../components/CardIcon';
import ErrorAlert from '../components/ErrorAlert';
import InstallationBreakdownCard from '../components/InstallationBreakdownCard';
import InstallationTable from '../components/InstallationTable';
import StatCard from '../components/StatCard';
import StatusDonutCard from '../components/StatusDonutCard';
import { COLORS } from '../styles/theme';
import { getPercentage } from '../utils';

const getStatCards = ({ totals, monthlyInstallations }) => {
  const completionRate = getPercentage(totals.completedInstallations, totals.installations);

  return [
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
      visual: (
        <SparkLineChart
          className="stat-sparkline"
          data={monthlyInstallations.map((month) => month.count)}
          yAxis={{ min: 0 }}
          width={110}
          height={40}
          area
          color={COLORS.primary}
        />
      ),
    },
    {
      label: 'Completion rate',
      value: `${completionRate}%`,
      note: `${totals.completedInstallations} of ${totals.installations} completed`,
      icon: TrendingUpIcon,
      tone: 'success',
      visual: (
        <Gauge
          className="stat-gauge"
          value={completionRate}
          width={84}
          height={46}
          startAngle={-90}
          endAngle={90}
          innerRadius="75%"
          cornerRadius="50%"
          text={() => null}
        />
      ),
    },
  ];
};

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

  return (
    <>
      <Grid container spacing={2}>
        {getStatCards(summary).map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <StatusDonutCard
            statusBreakdown={summary.statusBreakdown}
            total={summary.totals.installations}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <InstallationBreakdownCard summary={summary} />
        </Grid>
      </Grid>

      <Card>
        <CardHeader
          avatar={<CardIcon icon={ListAltOutlinedIcon} />}
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
