// src/hooks/secretaria/useDashboardData.js
import { useState, useEffect } from 'react';
import api from '@/client/api';

export function useDashboardTurmas(jwt) {
  const [turmas, setTurmas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jwt) return;
    api.turma.listAll(jwt)
      .then(res => setTurmas(res.data || []))
      .catch(err => setError(err));
  }, [jwt]);

  return { turmas, error };
}

export function usePresentesAusentes(jwt, idTurma) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jwt || !idTurma) return;
    api.aluno.presentesAusentes(idTurma, jwt)
      .then(res => setData(res.data))
      .catch(err => setError(err));
  }, [jwt, idTurma]);

  return { data, error };
}

export function useAtivosInativos(jwt, idTurma) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jwt || !idTurma) return;
    api.aluno.ativosInativos(idTurma, jwt)
      .then(res => setData(res.data))
      .catch(err => setError(err));
  }, [jwt, idTurma]);

  return { data, error };
}

export function useMediaAtivosInativos(jwt, idTurma) {
  const [mediaFrequentes, setMediaFrequentes] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jwt || !idTurma) return;
    api.aluno.mediaAtivosInativos(idTurma, jwt)
      .then(res => {
        setMediaFrequentes(res.data.media_alunos_frequentes);
      })
      .catch(err => setError(err));
  }, [jwt, idTurma]);

  return { mediaFrequentes, error };
}

export function useMediaPresentesAusentes(jwt, idTurma) {
  const [mediaAusentes, setMediaAusentes] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jwt || !idTurma) return;
    api.aluno.mediaPresentesAusentes(idTurma, jwt)
      .then(res => {
        setMediaAusentes(res.data.media_alunos_ausentes);
      })
      .catch(err => setError(err));
  }, [jwt, idTurma]);

  return { mediaAusentes, error };
}
