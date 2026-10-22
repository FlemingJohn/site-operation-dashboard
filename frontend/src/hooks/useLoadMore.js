import { useEffect, useState } from 'react';

export const useLoadMore = (fetchList, params, pageSize) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    setItems([]);
    setPage(1);
  }, [paramsKey]);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    fetchList({ ...JSON.parse(paramsKey), page, limit: pageSize })
      .then((result) => {
        if (!isCurrent) return;
        setItems((current) => (page === 1 ? result.data : [...current, ...result.data]));
        setTotal(result.pagination.total);
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
  }, [fetchList, paramsKey, page, pageSize]);

  return {
    items,
    total,
    isLoading,
    error,
    hasMore: items.length < total,
    loadMore: () => setPage((current) => current + 1),
  };
};
