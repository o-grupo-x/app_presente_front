// src/hooks/useFetchTurmas.js
import { useQuery } from '@tanstack/react-query';
import api from '@/client/api';

export default function useTurmasRealTime(jwt, options = {}) {
  return useQuery({
    queryKey: ['turmas', jwt],
    queryFn: async () => {
      const response = await api.turma.listAll(jwt);
      return response.data;
    },
    // Se options.realTime for true, atualiza a cada 5 segundos
    refetchInterval: options.realTime ? 5000 : false,
    refetchOnWindowFocus: options.realTime ? true : false,
  });
}
