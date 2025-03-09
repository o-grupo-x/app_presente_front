// src/hooks/secretaria/useTurmasProfessor.js
import { useState, useEffect } from 'react';
import api from '@/client/api';

export default function useTurmasProfessor(idProfessor, jwt) {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jwt || !idProfessor) return; // Only fetch if both are present
    setLoading(true);

    api.turma.listAll(jwt)
      .then(res => {
        console.log('Raw turmas response:', res.data); // Debug raw data
        const mappedTurmas = (res.data || []).map(turma => ({
          id_turma: turma.Id,  // Matches Postman "Id"
          nome: turma.Nome,    // Matches Postman "Nome"
        }));
        console.log('Mapped turmas:', mappedTurmas); // Debug mapped data
        setTurmas(mappedTurmas);
      })
      .catch(err => {
        console.error('Error fetching turmas:', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [idProfessor, jwt]);

  return { turmas, loading, error };
}