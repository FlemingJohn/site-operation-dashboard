import { useEffect, useState } from 'react';

export const useCounts = (fetchCounts, params, version = 0) => {
  const [counts, setCounts] = useState({});
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let isCurrent = true;

    fetchCounts(JSON.parse(paramsKey))
      .then((result) => {
        if (isCurrent) setCounts(result);
      })
      .catch(() => {
        if (isCurrent) setCounts({});
      });

    return () => {
      isCurrent = false;
    };
  }, [fetchCounts, paramsKey, version]);

  return counts;
};
