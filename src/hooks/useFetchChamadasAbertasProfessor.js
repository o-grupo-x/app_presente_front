import { useState, useEffect } from 'react';
import api from '@/client/api';
//import sendLog from '@/utils/logHelper';
 
export default function useFetchChamadasAbertasProfessor(idProfessor, jwt) {
  const [chamadasAbertas, setChamadasAbertas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idProfessor || !jwt) return;
    setLoading(true);
    setError(null);

    api.professor.chamadasAbertas(idProfessor, jwt)
      .then(response => {
        setChamadasAbertas(response.data || []);
        //sendLog(`Chamadas abertas (Professor): ${JSON.stringify(response.data)}`, 'info');
      })
      .catch(err => {
        setError(err);
        //sendLog(`Erro ao buscar chamadas abertas do professor: ${err.message}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idProfessor, jwt]);

  return { chamadasAbertas, loading, error };
}
