import React, { useState, useEffect, useCallback } from "react";
import api from "@/client/api";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
// import Footer from '@/components/Footer/Footer';
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { BsFillCheckCircleFill } from "react-icons/bs";
import withAuth from "@/utils/auth";
import { useUser } from "@/contexts/UserContext";
import sendLog from '../../../utils/logHelper';
import withAuthorization from '@/utils/withAuthorization';

function PresencaAluno() {
  const { user } = useUser();
  const [chamadasAbertas, setChamadasAbertas] = useState([]);
  const [historico, setHistorico] = useState([]);
  const id_aluno = user ? user.sub.id_aluno : null;
  const ra = user ? user.sub.RA : null;
  const jwt = user ? user.sub.JWT : null;
  const [ServerResponse, setServerResponse] = useState("");

  historico.reverse();

  useEffect(() => {
    if (user) {
      const userInfo = `Carregando os dados do Usuario: ${JSON.stringify(user.sub)}`;
      sendLog(userInfo, 'warn');
    }
  }, [user]);

  const fetchChamadasAbertas = useCallback(() => {
    api.aluno.chamadasAbertas(id_aluno, jwt)
      .then(response => {
        const message = `Buscando chamadas abertas: ${JSON.stringify(response.data)}`;
        sendLog(message, 'info');
        setChamadasAbertas(response.data);
        setServerResponse(response.data);
      })
      .catch(error => {
        const errorMessage = `Erro ao buscar as chamadas abertas: ${error.message}`;
        sendLog(errorMessage, 'error');
        setServerResponse(error.response.data);
      });
  }, [id_aluno, jwt]);

  const fazerChamada = (id_chamada) => {
    const body = {
      ra: parseInt(ra, 10),
      id_aluno: id_aluno,
      id_chamada: id_chamada,
      tipo_presenca: "Regular",
      horario: null
    };
    const callMessage = `Fazendo chamada: ${JSON.stringify(body)}`;
    sendLog(callMessage, 'info');

    api.aluno.presencaAluno(body, jwt)
      .then(response => {
        const successMessage = `Chamada marcada com sucesso: ${JSON.stringify(response.data)}`;
        sendLog(successMessage, 'info');
        setServerResponse(response.data);
        fetchChamadasAbertas(id_aluno, jwt);
        fetchPresencasAluno();
      })
      .catch(error => {
        const errorDetails = `Erro ao marcar chamada: ${JSON.stringify(error.response.data)}`;
        sendLog(errorDetails, 'error');
        setServerResponse(error.response.data);
      });
  };

  const fetchPresencasAluno = useCallback(() => {
    api.aluno.findChamadaByAluno(id_aluno, jwt)
      .then(response => {
        setHistorico(response.data);
        const historyMessage = `Buscando Historico de Presenças: ${JSON.stringify(response.data)}`;
        sendLog(historyMessage, 'info');
      })
      .catch(error => {
        const errorLog = `Erro ao buscar a lista de presenças: ${error}`;
        sendLog(errorLog, 'error');
      });
  }, [id_aluno, jwt]);

  useEffect(() => {
    fetchChamadasAbertas(id_aluno, jwt);
    fetchPresencasAluno(id_aluno, jwt);
  }, [id_aluno, jwt, fetchChamadasAbertas, fetchPresencasAluno]);

  return (
    <div>
      <Cabecalho />
      <Navbar />
      <section className={styles.page_content}>
        <section className={styles.inner_content}>
          <div className={styles.chamada}>
            <h1>Chamadas abertas</h1>
            <table className={styles.tabela}>
              <thead className={styles.tableHeader}></thead>
              {chamadasAbertas && chamadasAbertas.length > 0 ? (
                <tbody className={styles.tableBody}>
                  {chamadasAbertas.map(chamada => (
                    <tr key={chamada.id} className={styles.row}>
                      <td className={styles.cell}>{chamada.professor_nome}</td>
                      <td className={styles.cell}>{chamada.materia_nome}</td>
                      <td className={styles.cell}>{chamada.abertura}</td>
                      <td className={styles.cell}>{chamada.encerramento || "não definido"}</td>
                      <td className={styles.cell}>
                        <button className={styles.botaoRealizaChamada} onClick={() => fazerChamada(chamada.id_chamada, jwt)}>
                          Marcar Presença
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody className={styles.tableBody}>
                  <tr className={styles.row}>
                    <td colSpan="5" className={styles.cell}>Não há chamadas</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          <div className={styles.historico}>
            <h1>Últimas Chamadas</h1>
            <table className={styles.tabela}>
              {historico && historico.length > 0 ? (
                <tbody className={styles.tableBody}>
                  {historico.slice(0, 4).map(item => (
                    <tr key={item.id_presenca} className={styles.row}>
                      <td className={styles.cell}>{item.nome}</td>
                      <td className={styles.cell}>{item.horario}</td>
                      <td className={styles.cell}>{item.status ? "ativo" : "inativo"}</td>
                      <td className={styles.cell}>{item.tipo_presenca}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody className={styles.tableBody}>
                  <tr className={styles.row}>
                    <td colSpan="4" className={styles.cell}>Sem Histórico</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </section>
      </section>
    </div>
  );
}

export default withAuth(withAuthorization(PresencaAluno, ["Aluno"]), ["Aluno"]);
