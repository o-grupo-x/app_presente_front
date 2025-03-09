// src/hooks/secretaria/useSendLembrete.js
import { useState } from 'react';
import api from '@/client/api';

export default function useSendLembrete(jwt) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendLembrete = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      await api.admin.lembrete(payload, jwt);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendLembrete, loading, error };
}
