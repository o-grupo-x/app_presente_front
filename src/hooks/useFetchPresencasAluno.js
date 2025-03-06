// hooks/useFetchPresencasAluno.js
import { useState, useEffect } from 'react';
import api from '@/client/api';
// // import sendLog from '@/utils/logHelper';

export default function useFetchPresencasAluno(id_aluno, jwt) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id_aluno || !jwt) return;
    setLoading(true);

    api.aluno.findChamadaByAluno(id_aluno, jwt)
      .then(response => {
        setHistorico(response.data || []);
        // //sendLog(`presenças: ${JSON.stringify(response.data)}`, 'info');
      })
      .catch(error => {
        setError(error);
        // //sendLog(`Erro ao buscar presenças: ${error.message}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id_aluno, jwt]);

  return { historico, loading, error };
}
