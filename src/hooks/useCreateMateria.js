// src/hooks/secretaria/useCreateMateria.js
import { useState } from 'react';
import api from '@/client/api';

export default function useCreateMateria(jwt) {
  const [serverResponse, setServerResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMateria = async (payload) => {
    try {
      setLoading(true);
      setServerResponse(null);
      setError(null);
      const res = await api.materia.create(payload, jwt);
      setServerResponse("Matéria Cadastrada");
      return res.data;
    } catch (err) {
      setError(err);
      setServerResponse(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createMateria, serverResponse, loading, error };
}
