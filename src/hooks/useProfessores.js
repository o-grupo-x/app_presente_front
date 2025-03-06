// src/hooks/secretaria/useProfessores.js
import { useState, useEffect } from 'react';
import api from '@/client/api';

export default function useProfessores(jwt) {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jwt) return;
    setLoading(true);

    api.professor.listAll(jwt)
      .then(res => {
        setProfessores(res.data || []);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jwt]);

  return { professores, loading, error };
}
