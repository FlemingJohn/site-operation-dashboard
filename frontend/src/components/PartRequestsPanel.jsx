import { useState } from 'react';
import { LinearProgress } from '@mui/material';
import { getPartRequests, moveRequestForward } from '../api/sparePartsApi';
import { STATUS_LABELS } from '../constants';
import { useLoader } from '../hooks/useLoader';
import { includesText } from '../lib/includesText';
import ErrorAlert from './ErrorAlert';
import RequestBoard from './RequestBoard';
import SearchField from './SearchField';

const NO_REQUESTS = [];

const PartRequestsPanel = ({ onChange }) => {
  const requests = useLoader(getPartRequests, NO_REQUESTS);
  const [search, setSearch] = useState('');
  const [movingId, setMovingId] = useState(null);
  const [moveError, setMoveError] = useState('');
  const matches = requests.data.filter((request) =>
    includesText([request.partName, request.serial, request.siteName], search.trim())
  );

  const moveForward = async (request) => {
    setMovingId(request.id);
    setMoveError('');
    try {
      const moved = await moveRequestForward(request.id);
      requests.reload();
      onChange(`${moved.partName} marked as ${STATUS_LABELS[moved.status].toLowerCase()}`);
    } catch (err) {
      setMoveError(err.message);
    } finally {
      setMovingId(null);
    }
  };

  return (
    <>
      <SearchField
        value={search}
        onChange={setSearch}
        placeholder="Search by part, serial number or site"
        label="Search part requests"
      />
      {requests.error && <ErrorAlert message={requests.error} onRetry={requests.reload} />}
      {moveError && <ErrorAlert message={moveError} />}
      {requests.isLoading && <LinearProgress />}
      <RequestBoard requests={matches} movingId={movingId} onMove={moveForward} />
    </>
  );
};

export default PartRequestsPanel;
