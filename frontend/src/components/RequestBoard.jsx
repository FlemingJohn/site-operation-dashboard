import { PART_REQUEST_STATUSES } from '../constants';
import RequestColumn from './RequestColumn';

const RequestBoard = ({ search, movingId, onMove }) => (
  <div className="request-board">
    {PART_REQUEST_STATUSES.map(({ value, label }) => (
      <RequestColumn
        key={value}
        status={value}
        label={label}
        search={search}
        movingId={movingId}
        onMove={onMove}
      />
    ))}
  </div>
);

export default RequestBoard;
