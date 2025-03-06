// pages/aluno/PresencaAluno/index.jsx
import React, { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar/navbar';
import Cabecalho from '@/components/Cabecalho/cabecalho';
import withAuth from '@/utils/auth';
import withAuthorization from '@/utils/withAuthorization';
import styles from './style.module.css';

// HOOKS
import useFetchChamadasAbertasAluno from '@/hooks/useFetchChamadasAbertasAluno';
import useMarkPresenceAluno from '@/hooks/useMarkPresenceAluno';

function PresencaAluno() {
  const { user } = useUser();
  const id_aluno = user?.sub?.id_aluno;
  const ra = user?.sub?.RA;
  const jwt = user?.sub?.JWT;

  // Buscar chamadas abertas do aluno
  const { chamadasAbertas, loading: loadingChamadas, error: errorChamadas } =
    useFetchChamadasAbertasAluno(id_aluno, jwt);

  // Marcar presença
  const {
    markPresence,
    serverResponse,
    loading: loadingMark,
    error: errorMark,
  } = useMarkPresenceAluno(jwt);

  const handleMarcarPresenca = (id_chamada) => {
    markPresence({
      ra,
      id_aluno,
      id_chamada,
    });
  };

  return (
    <div>
      <Cabecalho />
      <Navbar />
      <section className={styles.page_content}>
        <section className={styles.inner_content}>
          <div className={styles.chamada}>
            <h1>Chamadas abertas</h1>

            {loadingChamadas && <p>Carregando chamadas...</p>}
            {errorChamadas && <p>Erro ao buscar chamadas abertas.</p>}
            {chamadasAbertas?.length > 0 ? (
              <table className={styles.tabela}>
                <tbody>
                  {chamadasAbertas.map((chamada) => (
                    <tr key={chamada.id_chamada} className={styles.row}>
                      <td className={styles.cell}>{chamada.professor_nome}</td>
                      <td className={styles.cell}>{chamada.materia_nome}</td>
                      <td className={styles.cell}>{chamada.abertura}</td>
                      <td className={styles.cell}>{chamada.encerramento || "não definido"}</td>
                      <td className={styles.cell}>
                        <button
                          className={styles.botaoRealizaChamada}
                          onClick={() => handleMarcarPresenca(chamada.id_chamada)}
                        >
                          Marcar Presença
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Não há chamadas abertas.</p>
            )}

            {/* Exibe loading e erro do markPresence */}
            {loadingMark && <p>Marcando presença...</p>}
            {errorMark && <p>Erro ao marcar presença.</p>}
            {serverResponse && <p>Resposta: {serverResponse.mensagem || serverResponse}</p>}
          </div>
        </section>
      </section>
    </div>
  );
}

export default withAuth(withAuthorization(PresencaAluno, ["Aluno"]), ["Aluno"]);
