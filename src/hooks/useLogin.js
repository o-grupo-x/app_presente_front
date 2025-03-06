// hooks/useLogin.js
import { useState } from 'react';
import api from '@/client/api';
<<<<<<< HEAD
// import sendLog from '@/utils/logHelper';
=======
// // import sendLog from '@/utils/logHelper';
>>>>>>> eac969d016b495466511c17b90ed455ded935464
import { jwtDecode } from 'jwt-decode';

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Faz o login e retorna um objeto com { decoded, rawData }:
   * - decoded: conteúdo decodificado do JWT
   * - rawData: o objeto retornado pela API (contendo JWT e outros dados)
   */
  const loginRequest = async ({ login, senha }) => {
    try {
      setLoading(true);
      setError(null);

      const payload = { login, senha };
      // //sendLog(`Tentativa de login: ${JSON.stringify(payload)}`, 'info');

      const response = await api.usuario.login(payload);
      if (response.status === 200) {
        const { JWT, ...userData } = response.data;
        const decoded = jwtDecode(JWT);

        // //sendLog(`Login bem-sucedido: ${JSON.stringify(decoded)}`, 'success');
        return { decoded, rawData: response.data };
      } else {
        throw new Error('Resposta inesperada do servidor');
      }
    } catch (err) {
      setError(err);
      // //sendLog(`Erro de login: ${err.message}`, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loginRequest, loading, error };
}
