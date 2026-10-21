import { PART_REQUEST_STATUSES } from '../constants';
import RequestColumn from './RequestColumn';

const RequestBoard = ({ requests, movingId, onMove }) => (
  <div className="request-board">
    {PART_REQUEST_STATUSES.map(({ value, label }) => (
      <RequestColumn
        key={value}
        label={label}
        requests={requests.filter((request) => request.status === value)}
        movingId={movingId}
        onMove={onMove}
      />
    ))}
  </div>
);

export default RequestBoard;
