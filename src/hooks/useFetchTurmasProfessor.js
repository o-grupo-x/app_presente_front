import { useState, useEffect } from 'react';
import api from '@/client/api';
<<<<<<< HEAD
// import sendLog from '@/utils/logHelper';
=======
// // import sendLog from '@/utils/logHelper';
>>>>>>> eac969d016b495466511c17b90ed455ded935464

export default function useFetchTurmasProfessor(idProfessor, jwt) {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idProfessor || !jwt) return;
    setLoading(true);
    setError(null);

    api.professor.turmas(idProfessor, jwt)
      .then(response => {
        setTurmas(response.data || []);
        // //sendLog(`Turmas do professor: ${JSON.stringify(response.data)}`, 'info');
      })
      .catch(err => {
        setError(err);
        // //sendLog(`Erro ao buscar turmas: ${err.message}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idProfessor, jwt]);

  return { turmas, loading, error };
}
