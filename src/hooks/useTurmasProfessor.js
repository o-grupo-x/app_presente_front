// src/hooks/secretaria/useTurmasProfessor.js
import { useState, useEffect } from 'react';
import api from '@/client/api';

export default function useTurmasProfessor(idProfessor, jwt) {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jwt || !idProfessor) return;
    setLoading(true);

    api.professor.turmas(idProfessor, jwt)
      .then(res => {
        setTurmas(res.data || []);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [idProfessor, jwt]);

  return { turmas, loading, error };
}
