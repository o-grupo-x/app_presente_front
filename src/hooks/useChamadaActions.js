import { useState } from 'react';
import api from '@/client/api';
import //sendLog from '@/utils/logHelper';

export default function useChamadaActions(jwt, idProfessor) {
  const [serverResponse, setServerResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Abrir chamada
  const openChamada = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      setServerResponse(null);

      const response = await api.chamada.create(payload, jwt);
      setServerResponse(response.data);
      //sendLog('Chamada aberta com sucesso.', 'info');
    } catch (err) {
      setError(err);
      setServerResponse(err.response?.data || null);
      //sendLog(`Erro ao abrir chamada: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fechar chamada
  const closeChamada = async (idChamada) => {
    try {
      setLoading(true);
      setError(null);
      setServerResponse(null);

      const response = await api.chamada.fecharChamada(idChamada, jwt);
      setServerResponse(response.data);
      //sendLog('Chamada fechada com sucesso.', 'info');
    } catch (err) {
      setError(err);
      setServerResponse(err.response?.data || null);
      //sendLog(`Erro ao fechar chamada: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    openChamada,
    closeChamada,
    serverResponse, // caso queira exibir mensagem de sucesso/erro
    loading,
    error
  };
}
