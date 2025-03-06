// src/hooks/secretaria/useMarkPresence.js
import { useState } from 'react';
import api from '@/client/api';

export default function useMarkPresence(jwt) {
  const [serverResponse, setServerResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const markPresence = async (body) => {
    try {
      setLoading(true);
      setError(null);
      setServerResponse(null);

      const res = await api.professor.presenca(body, jwt);
      setServerResponse(res.data);
      return res.data;
    } catch (err) {
      setError(err);
      setServerResponse(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { markPresence, serverResponse, loading, error };
}
