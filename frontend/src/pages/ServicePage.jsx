import { useState } from 'react';
import { LinearProgress } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import MarkDoneDialog from '../components/MarkDoneDialog';
import PageIntro from '../components/PageIntro';
import SampleDataTag from '../components/SampleDataTag';
import SearchField from '../components/SearchField';
import ServiceCalendar from '../components/ServiceCalendar';
import ServiceGroup from '../components/ServiceGroup';
import SuccessSnackbar from '../components/SuccessSnackbar';
import SummaryStrip from '../components/SummaryStrip';
import ViewToggle from '../components/ViewToggle';
import { EQUIPMENT_TYPE_LABELS, SERVICE_STATES } from '../constants';
import { getServiceDue } from '../api/serviceApi';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { useLoader } from '../hooks/useLoader';
import { useStoredChoice } from '../hooks/useStoredChoice';
import { includesText } from '../lib/includesText';

const SERVICE_VIEWS = [
  { value: 'list', label: 'List', icon: ViewListOutlinedIcon },
  { value: 'calendar', label: 'Calendar', icon: CalendarMonthOutlinedIcon },
];

const NO_UNITS = [];

const GROUP_EMPTY_MESSAGES = {
  late: 'Nothing is overdue.',
  this_week: 'Nothing due in the next 7 days.',
  later: 'Nothing planned further ahead.',
};

const ServicePage = () => {
  const service = useLoader(getServiceDue, NO_UNITS);
  const flash = useFlashMessage();
  const [view, setView] = useStoredChoice('siteops.serviceView');
  const [search, setSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const units = service.data.filter((unit) =>
    includesText([unit.serial, unit.siteName, EQUIPMENT_TYPE_LABELS[unit.type]], search.trim())
  );
  const unitsInState = (state) => units.filter((unit) => unit.serviceState === state);

  const handleSaved = (unit) => {
    setSelectedUnit(null);
    flash.showMessage(`Check-up for ${unit.serial} saved`);
    service.reload();
  };

  return (
    <>
      <div className="page-header">
        <PageIntro>
          Machines that need a check-up, most urgent first. When a check-up is finished, mark it as
          done and the next date is set for you.
        </PageIntro>
        <div className="page-header-actions">
          <SampleDataTag />
          <ViewToggle value={view ?? 'list'} onChange={setView} options={SERVICE_VIEWS} />
        </div>
      </div>

      <SummaryStrip
        items={SERVICE_STATES.map(({ value, label }) => ({
          key: value,
          label,
          count: service.isLoading ? undefined : unitsInState(value).length,
        }))}
      />

      <SearchField
        value={search}
        onChange={setSearch}
        placeholder="Search by machine, serial number or site"
        label="Search check-ups"
      />

      {service.error && <ErrorAlert message={service.error} onRetry={service.reload} />}
      {service.isLoading && <LinearProgress />}

      {!service.isLoading && units.length === 0 && (
        <EmptyState
          title="No machines match this search."
          actionLabel="Clear search"
          onAction={() => setSearch('')}
        />
      )}

      {!service.isLoading && units.length > 0 && view === 'calendar' && (
        <ServiceCalendar units={units} />
      )}

      {!service.isLoading &&
        units.length > 0 &&
        view !== 'calendar' &&
        SERVICE_STATES.map(({ value, label }) => (
          <ServiceGroup
            key={value}
            title={label}
            units={unitsInState(value)}
            emptyMessage={GROUP_EMPTY_MESSAGES[value]}
            isOpenByDefault={value !== 'later'}
            onMarkDone={setSelectedUnit}
          />
        ))}

      {selectedUnit && (
        <MarkDoneDialog
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onSaved={handleSaved}
        />
      )}

      <SuccessSnackbar message={flash.message} onClose={flash.clearMessage} />
    </>
  );
};

export default ServicePage;
