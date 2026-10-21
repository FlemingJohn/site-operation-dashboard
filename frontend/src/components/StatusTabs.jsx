import { Tab, Tabs } from '@mui/material';

const StatusTabs = ({ tabs, value, onChange, label }) => (
  <Tabs
    value={value}
    onChange={(event, nextValue) => onChange(nextValue)}
    aria-label={label}
    variant="scrollable"
    allowScrollButtonsMobile
    className="status-tabs"
  >
    {tabs.map((tab) => (
      <Tab
        key={tab.value}
        value={tab.value}
        label={
          <span className="status-tab-label">
            {tab.label}
            <span className="status-tab-count">{tab.count ?? '–'}</span>
          </span>
        }
      />
    ))}
  </Tabs>
);

export default StatusTabs;
