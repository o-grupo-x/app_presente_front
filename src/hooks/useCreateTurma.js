// src/hooks/secretaria/useCreateTurma.js
import { useState } from 'react';
import api from '@/client/api';

export default function useCreateTurma(jwt) {
  const [serverResponse, setServerResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTurma = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      setServerResponse(null);
      const res = await api.turma.create(payload, jwt);
      setServerResponse("Turma cadastrada com sucesso");
      return res.data;
    } catch (err) {
      setError(err);
      setServerResponse(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTurma, serverResponse, loading, error };
}
