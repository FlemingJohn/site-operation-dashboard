import { useState } from 'react';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import { getEquipmentCounts } from '../api/equipmentApi';
import MarkDoneDialog from '../components/MarkDoneDialog';
import PageIntro from '../components/PageIntro';
import SearchField from '../components/SearchField';
import ServiceCalendar from '../components/ServiceCalendar';
import ServiceGroup from '../components/ServiceGroup';
import SuccessSnackbar from '../components/SuccessSnackbar';
import SummaryStrip from '../components/SummaryStrip';
import ViewToggle from '../components/ViewToggle';
import { SERVICE_STATES } from '../constants';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { useCounts } from '../hooks/useCounts';
import { useStoredChoice } from '../hooks/useStoredChoice';

const SERVICE_VIEWS = [
  { value: 'list', label: 'List', icon: ViewListOutlinedIcon },
  { value: 'calendar', label: 'Calendar', icon: CalendarMonthOutlinedIcon },
];

const GROUP_EMPTY_MESSAGES = {
  late: 'Nothing is overdue.',
  this_week: 'Nothing due in the next 7 days.',
  later: 'Nothing planned further ahead.',
};

const ServicePage = () => {
  const flash = useFlashMessage();
  const [view, setView] = useStoredChoice('siteops.serviceView');
  const [searchInput, setSearchInput] = useState('');
  const search = useDebouncedValue(searchInput.trim());
  const [version, setVersion] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const counts = useCounts(getEquipmentCounts, { search }, version);

  const handleSaved = (unit) => {
    setSelectedUnit(null);
    flash.showMessage(`Check-up for ${unit.serial} saved`);
    setVersion(version + 1);
  };

  return (
    <>
      <div className="page-header">
        <PageIntro>
          Machines that need a check-up, most urgent first. When a check-up is finished, mark it as
          done and the next date is set for you.
        </PageIntro>
        <ViewToggle value={view ?? 'list'} onChange={setView} options={SERVICE_VIEWS} />
      </div>

      <SummaryStrip
        items={SERVICE_STATES.map(({ value, label }) => ({
          key: value,
          label,
          count: counts[value],
        }))}
      />

      <SearchField
        value={searchInput}
        onChange={setSearchInput}
        placeholder="Search by serial number or site"
        label="Search check-ups"
      />

      {view === 'calendar' ? (
        <ServiceCalendar key={version} search={search} />
      ) : (
        SERVICE_STATES.map(({ value, label }) => (
          <ServiceGroup
            key={`${value}-${version}`}
            state={value}
            title={label}
            search={search}
            emptyMessage={search ? 'No machines match this search.' : GROUP_EMPTY_MESSAGES[value]}
            isOpenByDefault={value !== 'later'}
            onMarkDone={setSelectedUnit}
          />
        ))
      )}

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
