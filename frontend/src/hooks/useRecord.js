import { useEffect, useState } from 'react';

export const useRecord = (load, id) => {
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');

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
  }, [load, id]);

  return { record, error, isLoading: !record && !error };
};
