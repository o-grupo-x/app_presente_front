import { useState, useEffect } from 'react';
import api from '@/client/api';
import //sendLog from '@/utils/logHelper';

export default function useFetchChamadasAbertasAluno(id_aluno, jwt) {
  const [chamadasAbertas, setChamadasAbertas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id_aluno || !jwt) return;
    setLoading(true);
    setError(null);

    api.aluno.chamadasAbertas(id_aluno, jwt)
      .then(response => {
        setChamadasAbertas(response.data || []);
        //sendLog(`Chamadas abertas (Aluno): ${JSON.stringify(response.data)}`, 'info');
      })
      .catch(err => {
        setError(err);
        //sendLog(`Erro ao buscar chamadas abertas do aluno: ${err.message}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id_aluno, jwt]);

  return { chamadasAbertas, loading, error };
}
