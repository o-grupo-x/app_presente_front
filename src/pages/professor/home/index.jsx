// pages/professor/Chamada/index.jsx
import React, { useState } from "react";
import Navbar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import styles from "./style.module.css";
import { Fundo } from "@/components/Fundo/fundo";
import { useUser } from "@/contexts/UserContext";
import withAuth from "@/utils/auth";
import withAuthorization from '@/utils/withAuthorization';

// HOOKS
import useFetchTurmasProfessor from '@/hooks/useFetchTurmasProfessor';
import useFetchChamadasAbertasProfessor from '@/hooks/useFetchChamadasAbertasProfessor';
import useChamadaActions from '@/hooks/useChamadaActions';

function Chamada() {
  const { user } = useUser();
  const jwt = user?.sub?.JWT;
  const idProfessor = user?.sub?.id_professor;

  // Hooks para carregar turmas e chamadas abertas
  const { turmas, loading: loadingTurmas, error: errorTurmas } = 
    useFetchTurmasProfessor(idProfessor, jwt);

  const { chamadasAbertas, loading: loadingChamadas, error: errorChamadas } = 
    useFetchChamadasAbertasProfessor(idProfessor, jwt);

  // Hook de ações (abrir/fechar chamada)
  const {
    openChamada,
    closeChamada,
    serverResponse,
    loading: loadingAction,
    error: errorAction
  } = useChamadaActions(jwt, idProfessor);

  // Estados para o formulário
  const [selectedTurma, setSelectedTurma] = useState("");
  const [dataAbertura, setDataAbertura] = useState(null);
  const [dataEncerramento, setDataEncerramento] = useState(null);

  // Formatar data local p/ dd-mm-yyyy hh:mm
  const formatData = (dataString) => {
    if (!dataString) return "";
    const [date, time] = dataString.split("T");
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}-${mm}-${yyyy} ${time}`;
  };

  // Abrir chamada
  const handleAbrirChamada = () => {
    const payload = {
      status: true,
      abertura: formatData(dataAbertura) || null,
      encerramento: formatData(dataEncerramento) || null,
      id_turma: selectedTurma,
      id_professor: idProfessor
    };
    openChamada(payload);
  };

  // Fechar chamada
  const handleFecharChamada = (idChamada) => {
    closeChamada(idChamada);
  };

  // Renderizar feedback de servidor
  const renderResponse = () => {
    if (!serverResponse) return null;

    const successIcon = "✅";
    const errorIcon = "❌";
    let responseMessage = "";

    if (typeof serverResponse === 'object' && serverResponse.mensagem) {
      responseMessage = serverResponse.mensagem;
    } else if (typeof serverResponse === 'string') {
      responseMessage = serverResponse;
    }

    if (
      responseMessage === "Chamada registrada" ||
      responseMessage === "Chamada fechada com sucesso"
    ) {
      return (
        <div>
          {successIcon} {responseMessage}
        </div>
      );
    } else {
      return (
        <div>
          {errorIcon} {responseMessage}
        </div>
      );
    }
  };

  if (loadingTurmas || loadingChamadas || loadingAction) {
    return <p>Carregando...</p>;
  }
  if (errorTurmas || errorChamadas || errorAction) {
    return <p>Ocorreu um erro ao carregar dados ou executar a ação.</p>;
  }

  return (
    <>
      <Navbar />
      <Cabecalho />
      <Fundo>
        <div className={styles.fundoContainer}>
          <div className={styles.serverResponse}>{renderResponse()}</div>
          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Abrir Chamada</h2>

              <select
                className={styles.input}
                id="turma"
                value={selectedTurma}
                onChange={(e) => setSelectedTurma(e.target.value)}
              >
                <option value="">Selecione uma Turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id_turma} value={turma.id_turma}>
                    {turma.nome}
                  </option>
                ))}
              </select>

              <label className={styles.label}>Data de abertura:</label>
              <input
                className={styles.input}
                type="datetime-local"
                value={dataAbertura || ""}
                onChange={(e) => setDataAbertura(e.target.value)}
              />

              <label className={styles.label}>Data de encerramento:</label>
              <input
                className={styles.input}
                type="datetime-local"
                value={dataEncerramento || ""}
                onChange={(e) => setDataEncerramento(e.target.value)}
              />
            </div>
            <br />
            <button className={styles.botao} onClick={handleAbrirChamada}>
              ABRIR
            </button>
          </div>
        </div>
      </Fundo>

      <Fundo>
        <div className={styles.container_chamadas}>
          <h2>Chamadas Abertas</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Turma</th>
                <th>Projeto</th>
                <th>Professor</th>
                <th>Data Abertura</th>
                <th>Data Encerramento</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {chamadasAbertas.map((chamada) => (
                <tr key={chamada.id_chamada}>
                  <td>{chamada.id_turma}</td>
                  <td>{chamada.nome_materia}</td>
                  <td>{chamada.id_professor}</td>
                  <td>{chamada.abertura}</td>
                  <td>{chamada.encerramento || "não definido"}</td>
                  <td>
                    <button onClick={() => handleFecharChamada(chamada.id_chamada)}>
                      Encerrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fundo>
    </>
  );
}

export default withAuth(withAuthorization(Chamada, ["Professor"]), ["Professor"]);
