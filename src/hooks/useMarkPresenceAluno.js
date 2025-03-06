// hooks/useMarkPresenceAluno.js
import { useState } from 'react';
import api from '@/client/api';
<<<<<<< HEAD
// import sendLog from '@/utils/logHelper';
=======
// // import sendLog from '@/utils/logHelper';
>>>>>>> eac969d016b495466511c17b90ed455ded935464

export default function useMarkPresenceAluno(jwt) {
  const [serverResponse, setServerResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const markPresence = async ({ ra, id_aluno, id_chamada }) => {
    try {
      setLoading(true);
      setError(null);
      setServerResponse(null);
      const body = {
        ra: parseInt(ra, 10),
        id_aluno,
        id_chamada,
        tipo_presenca: "Regular",
        horario: null,
      };
      const response = await api.aluno.presencaAluno(body, jwt);
      setServerResponse(response.data);
      // //sendLog(`Presença marcada: ${JSON.stringify(response.data)}`, 'info');
    } catch (err) {
      setError(err);
      setServerResponse(err.response?.data || null);
      // //sendLog(`Erro ao marcar presença: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return { markPresence, serverResponse, loading, error };
}
