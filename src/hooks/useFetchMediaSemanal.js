import { useState, useEffect } from 'react';
import api from '@/client/api';
<<<<<<< HEAD
// import sendLog from '@/utils/logHelper';
=======
// // import sendLog from '@/utils/logHelper';
>>>>>>> eac969d016b495466511c17b90ed455ded935464

export default function useFetchMediaSemanal(idTurma, jwt) {
  const [mediaSemanal, setMediaSemanal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idTurma || !jwt) return;
    setLoading(true);
    setError(null);

    api.professor.mediaSemanal(idTurma, jwt)
      .then(response => {
        setMediaSemanal(response.data || []);
        // //sendLog(`Média semanal: ${JSON.stringify(response.data)}`, 'info');
      })
      .catch(err => {
        setError(err);
        // //sendLog(`Erro ao buscar média semanal: ${err.message}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idTurma, jwt]);

  return { mediaSemanal, loading, error };
}
