// hooks/useFetchPresencasAluno.js
import { useState, useEffect } from 'react';
import api from '@/client/api';
<<<<<<< HEAD
// import sendLog from '@/utils/logHelper';
=======
// // import sendLog from '@/utils/logHelper';
>>>>>>> eac969d016b495466511c17b90ed455ded935464

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
