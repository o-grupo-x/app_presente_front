// hooks/useMarkPresenceProfessor.js
import { useState } from 'react';
import api from '@/client/api';
// // import sendLog from '@/utils/logHelper';

export default function useMarkPresenceProfessor(jwt) {
  const [serverResponse, setServerResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const markPresence = async ({ ra, cargo_manual, id_manual }) => {
    try {
      setLoading(true);
      setError(null);
      setServerResponse(null);

      const body = {
        ra: parseInt(ra, 10),
        cargo_manual,
        id_manual,
      };

      const response = await api.professor.presenca(body, jwt);
      setServerResponse(response.data);
      // //sendLog(`Presença professor: ${JSON.stringify(response.data)}`, 'info');
    } catch (err) {
      setError(err);
      setServerResponse(err.response?.data || null);
      // //sendLog(`Erro ao marcar presença (professor): ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return { markPresence, serverResponse, loading, error };
}
