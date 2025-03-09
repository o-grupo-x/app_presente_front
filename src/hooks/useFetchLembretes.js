// src/hooks/secretaria/useFetchLembretes.js
import { useState, useEffect } from 'react';
import api from '@/client/api';

export default function useFetchLembretes(jwt) {
  const [lembretes, setLembretes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega todos os lembretes
  useEffect(() => {
    if (!jwt) return;
    setLoading(true);
    setError(null);

    api.lembrete.listAll(jwt)
      .then(res => {
        setLembretes(res.data || []);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [jwt]);

  // Busca detalhe de um lembrete específico
  const findLembreteById = async (idLembrete) => {
    try {
      const res = await api.lembrete.FindById(idLembrete, jwt);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  return { lembretes, loading, error, findLembreteById };
}
