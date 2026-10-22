import { useState } from 'react';
import { moveRequest } from '../api/sparePartsApi';
import { STATUS_LABELS } from '../constants';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { getErrorText } from '../lib/getErrorText';
import ErrorAlert from './ErrorAlert';
import RequestBoard from './RequestBoard';
import SearchField from './SearchField';

const NEXT_STATUS = { requested: 'ordered', ordered: 'delivered' };

const PartRequestsPanel = ({ onChange }) => {
  const [searchInput, setSearchInput] = useState('');
  const search = useDebouncedValue(searchInput.trim());
  const [version, setVersion] = useState(0);
  const [movingId, setMovingId] = useState(null);
  const [moveError, setMoveError] = useState('');

  const moveForward = async (request) => {
    setMovingId(request.id);
    setMoveError('');
    try {
      const moved = await moveRequest(request.id, NEXT_STATUS[request.status]);
      onChange(`${moved.partName} marked as ${STATUS_LABELS[moved.status].toLowerCase()}`);
    } catch (err) {
      setMoveError(getErrorText(err));
    } finally {
      setMovingId(null);
      setVersion((current) => current + 1);
    }
  };

  return (
    <>
      <SearchField
        value={searchInput}
        onChange={setSearchInput}
        placeholder="Search by part, serial number or site"
        label="Search part requests"
      />
      {moveError && <ErrorAlert message={moveError} />}
      <RequestBoard key={version} search={search} movingId={movingId} onMove={moveForward} />
    </>
  );
};

export default PartRequestsPanel;
