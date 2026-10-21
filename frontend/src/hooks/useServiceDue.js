import { useEffect, useState } from 'react';
import { getServiceDue } from '../api/serviceApi';

export const useServiceDue = () => {
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    getServiceDue()
      .then((result) => {
        if (!isCurrent) return;
        setUnits(result);
        setError('');
      })
      .catch((err) => {
        if (isCurrent) setError(err.message);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  return { units, isLoading, error, reload: () => setReloadKey((key) => key + 1) };
};
