// hooks/useFetchFaltasPresencas.js
import { useState, useEffect } from 'react';
import api from '@/client/api';
import //sendLog from '@/utils/logHelper';

export default function useFetchFaltasPresencas(id_aluno, jwt) {
  const [faltasPresencas, setFaltasPresencas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Evita fazer a chamada se id_aluno ou jwt estiverem ausentes
    if (!id_aluno || !jwt) return;

    setLoading(true);
    setError(null);

    api.aluno
      .presencasFaltas(id_aluno, jwt)
      .then((response) => {
        setFaltasPresencas(response.data);
        //sendLog(`presenças e faltas: ${JSON.stringify(response.data)}`, 'info');
      })
      .catch((err) => {
        setError(err);
        //sendLog(`Erro ao buscar presenças e faltas: ${err.message}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id_aluno, jwt]);

  return { faltasPresencas, loading, error };
}
