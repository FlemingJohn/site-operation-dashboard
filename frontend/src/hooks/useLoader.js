import { useEffect, useState } from 'react';

export const useLoader = (load, initialData) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    load()
      .then((result) => {
        if (!isCurrent) return;
        setData(result);
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
  }, [load, reloadKey]);

  return { data, isLoading, error, reload: () => setReloadKey((key) => key + 1) };
};
