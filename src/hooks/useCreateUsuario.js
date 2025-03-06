// src/hooks/secretaria/useCreateUsuario.js
import { useState } from 'react';
import api from '@/client/api';

export default function useCreateUsuario(jwt) {
  const [serverResponse, setServerResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // "createUsuario" cria o usuário e retorna o ID gerado.
  const createUsuario = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      setServerResponse(null);

      const res = await api.usuario.create(payload, jwt);
      setServerResponse(res.data); // a API retorna strings? ou obj?
      return res.data;            // { id_aluno, id_professor, ... }
    } catch (err) {
      setError(err);
      setServerResponse(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar professor/aluno na turma
  const addUsuarioTurma = async ({ cargo, turmaId, userId }) => {
    try {
      if (!cargo || !turmaId || !userId) {
        throw new Error("Parâmetros ausentes para addUsuarioTurma");
      }
      setLoading(true);
      setError(null);

      if (cargo === "Professor") {
        const body = { id_turma: parseInt(turmaId, 10), id_professor: userId };
        const res = await api.turma.professorNaTurma(body, jwt);
        setServerResponse(res.data);
      } else if (cargo === "Aluno") {
        const body = { id_turma: parseInt(turmaId, 10), id_aluno: userId };
        const res = await api.turma.alunoNaTurma(body, jwt);
        setServerResponse(res.data);
      }
      // Se "Secretaria", não faz nada

    } catch (err) {
      setError(err);
      setServerResponse(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUsuario,
    addUsuarioTurma,
    serverResponse,
    loading,
    error
  };
}
