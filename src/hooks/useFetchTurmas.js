// src/hooks/secretaria/useFetchTurmas.js
import { useState, useEffect } from 'react';
import api from '@/client/api';

export default function useFetchTurmas(jwt) {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jwt) return;
    setLoading(true);
    setError(null);

    api.turma.listAll(jwt)
      .then(res => {
        setTurmas(res.data || []);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [jwt]);

  return { turmas, loading, error };
}
