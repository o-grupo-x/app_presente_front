import { useState, useEffect } from 'react';
import api from '@/client/api';
import //sendLog from '@/utils/logHelper';

export default function useFetchFrequencia(idProfessor, idChamada, jwt) {
  const [frequenciaData, setFrequenciaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idProfessor || !idChamada || !jwt) return;
    setLoading(true);
    setError(null);

    api.professor.frequencia(idProfessor, idChamada, jwt)
      .then(response => {
        setFrequenciaData(response.data || {});
        //sendLog(`Dados de frequência: ${JSON.stringify(response.data)}`, 'info');
      })
      .catch(err => {
        setError(err);
        // //sendLog(`Erro ao buscar dados de frequência: ${err.message}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idProfessor, idChamada, jwt]);

  return { frequenciaData, loading, error };
}
