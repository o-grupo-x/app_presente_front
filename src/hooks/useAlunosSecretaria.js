// src/hooks/secretaria/useAlunosSecretaria.js
import { useState, useEffect } from 'react';
import api from '@/client/api';

export default function useAlunosSecretaria(jwt) {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lista geral de alunos
  useEffect(() => {
    if (!jwt) return;
    setLoading(true);
    setError(null);

    api.aluno.listAll(jwt)
      .then((res) => {
        setAlunos(res.data || []);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jwt]);

  // Função para buscar status/estatísticas de um aluno
  const fetchStatusAluno = async (idAluno) => {
    try {
      const response = await api.aluno.statusAluno(idAluno, jwt);
      return response.data; // retorne os dados ao componente
    } catch (err) {
      throw err;
    }
  };

  return {
    alunos,
    loading,
    error,
    fetchStatusAluno
  };
}
