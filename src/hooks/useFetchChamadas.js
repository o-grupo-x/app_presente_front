// src/hooks/secretaria/useFetchChamadas.js
import { useState, useEffect } from 'react';
import api from '@/client/api';

export default function useFetchChamadas(jwt) {
  const [chamadas, setChamadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jwt) return;
    setLoading(true);
    setError(null);

    api.chamada.listAll(jwt)
      .then(res => {
        setChamadas(res.data || []);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [jwt]);

  return { chamadas, loading, error, setChamadas };
}
