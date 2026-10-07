import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useFlashMessage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState(location.state?.message ?? '');

  useEffect(() => {
    if (location.state?.message) navigate(location.pathname, { replace: true });
  }, [location, navigate]);

  return {
    message,
    showMessage: setMessage,
    clearMessage: () => setMessage(''),
  };
};
