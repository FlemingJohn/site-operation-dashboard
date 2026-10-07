import { useCallback, useEffect, useState } from 'react';
import { PAGE_SIZE_OPTIONS, SEARCH_DELAY_MS } from '../constants';

export const usePaginatedList = (fetchList, initialFilters) => {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ search: '', ...initialFilters });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_OPTIONS[0]);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const updateFilter = useCallback((name, value) => {
    setFilters((current) => (current[name] === value ? current : { ...current, [name]: value }));
    setPage(0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => updateFilter('search', searchInput.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [searchInput, updateFilter]);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    fetchList({ ...filters, page: page + 1, limit: rowsPerPage })
      .then((result) => {
        if (!isCurrent) return;
        setRows(result.data);
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
  }, [fetchList, filters, page, rowsPerPage, reloadKey]);

  const reload = () => setReloadKey((key) => key + 1);

  const refreshAfterDelete = () => {
    if (rows.length === 1 && page > 0) {
      setPage(page - 1);
    } else {
      reload();
    }
  };

  const paginationProps = {
    count: total,
    page,
    rowsPerPage,
    rowsPerPageOptions: PAGE_SIZE_OPTIONS,
    onPageChange: (event, newPage) => setPage(newPage),
    onRowsPerPageChange: (event) => {
      setRowsPerPage(Number(event.target.value));
      setPage(0);
    },
  };

  return {
    rows,
    isLoading,
    error,
    filters,
    searchInput,
    setSearchInput,
    updateFilter,
    paginationProps,
    reload,
    refreshAfterDelete,
  };
};
