import { useEffect, useState } from 'react';
import { getSites } from '../api/siteApi';
import { MAX_SELECT_OPTIONS } from '../constants';
import { toOptions } from '../utils';

const SITE_OPTIONS_ERROR = "Couldn't load sites for filtering.";

export const useSiteOptions = () => {
  const [options, setOptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getSites({ limit: MAX_SELECT_OPTIONS })
      .then((result) => setOptions(toOptions(result.data, 'name')))
      .catch(() => setError(SITE_OPTIONS_ERROR));
  }, []);

  return { options, error };
};
