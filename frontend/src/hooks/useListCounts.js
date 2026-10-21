import { useEffect, useState } from 'react';

export const useListCounts = (fetchList, queries, baseParams, version = 0) => {
  const [counts, setCounts] = useState({});
  const paramsKey = JSON.stringify(baseParams);

  useEffect(() => {
    let isCurrent = true;
    const params = JSON.parse(paramsKey);

    Promise.all(
      Object.entries(queries).map(([name, query]) =>
        fetchList({ ...params, ...query, limit: 1 }).then((result) => [
          name,
          result.pagination.total,
        ])
      )
    )
      .then((entries) => {
        if (isCurrent) setCounts(Object.fromEntries(entries));
      })
      .catch(() => {
        if (isCurrent) setCounts({});
      });

    return () => {
      isCurrent = false;
    };
  }, [fetchList, queries, paramsKey, version]);

  return counts;
};
