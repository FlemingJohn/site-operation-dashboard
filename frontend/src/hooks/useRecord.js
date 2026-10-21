import { useEffect, useState } from 'react';

export const useRecord = (load, id) => {
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setRecord(null);
    setError('');

    load(id)
      .then((result) => {
        if (isCurrent) setRecord(result);
      })
      .catch((err) => {
        if (isCurrent) setError(err.message);
      });

    return () => {
      isCurrent = false;
    };
  }, [load, id, reloadKey]);

  return {
    record,
    error,
    isLoading: !record && !error,
    reload: () => setReloadKey((key) => key + 1),
  };
};
