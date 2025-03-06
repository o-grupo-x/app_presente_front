import { useQuery } from '@tanstack/react-query';
import api from '@/client/api';

export default function useMateriasRealTime(jwt) {
  return useQuery({
    queryKey: ['materias', jwt],
    queryFn: async () => {
      const res = await api.materia.listAll(jwt);
      return res.data;
    },
    refetchInterval: 5000,           // refetch a cada 5 segundos
    refetchOnWindowFocus: true,
  });
}