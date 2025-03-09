// src/hooks/secretaria/useFetchMaterias.js
import { useState, useEffect } from 'react';
import api from '@/client/api';

export default function useFetchMaterias(jwt) {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jwt) return;
    setLoading(true);
    setError(null);

    api.materia.listAll(jwt)
      .then(res => {
        setMaterias(res.data || []);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [jwt]);

  return { materias, loading, error };
}
