import { useEffect, useState } from 'react';
import { getTechnicians } from '../api/userApi';

const TECHNICIANS_ERROR = "Couldn't load the technicians.";

export const useTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getTechnicians()
      .then(setTechnicians)
      .catch(() => setError(TECHNICIANS_ERROR));
  }, []);

  return { technicians, error };
};
