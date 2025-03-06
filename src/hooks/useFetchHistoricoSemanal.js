import { useState, useEffect } from 'react';
import api from '@/client/api';
<<<<<<< HEAD
// import sendLog from '@/utils/logHelper';
=======
// // import sendLog from '@/utils/logHelper';
>>>>>>> eac969d016b495466511c17b90ed455ded935464

export default function useFetchHistoricoSemanal(idTurma, jwt) {
  const [historicoSemanal, setHistoricoSemanal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idTurma || !jwt) return;
    setLoading(true);
    setError(null);

    api.professor.historicoSemanal(idTurma, jwt)
      .then(response => {
        setHistoricoSemanal(response.data || {});
        // //sendLog(`Histórico semanal: ${JSON.stringify(response.data)}`, 'info');
      })
      .catch(err => {
        setError(err);
        // //sendLog(`Erro ao buscar histórico semanal: ${err.message}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idTurma, jwt]);

  return { historicoSemanal, loading, error };
}
