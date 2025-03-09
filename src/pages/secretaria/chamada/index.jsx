import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import withAuth from "@/utils/auth";
import withAuthorization from '@/utils/withAuthorization';

// HOOKS
import useFetchChamadas from "@/hooks/useFetchChamadas";
import useChamadaActions from "@/hooks/useChamadaActions";
import useProfessores from "@/hooks/useProfessores";
import useTurmasProfessor from "@/hooks/useTurmasProfessor";

function Chamada() {
  const { user } = useUser();
  const jwt = user?.sub?.JWT;
  const id_secretaria = user?.sub?.id_secretaria;

  // Hooks
  const { chamadas, loading: loadingChamadas, error: errorChamadas, setChamadas } = useFetchChamadas(jwt);
  const { openChamada, closeChamada, serverResponse, loading: loadingAction } = useChamadaActions(jwt);
  const { professores } = useProfessores(jwt);

  // Form
  const [professorSelecionado, setProfessorSelecionado] = useState(null);
  const [selectedTurma, setSelectedTurma] = useState("");
  const [dataAbertura, setDataAbertura] = useState("");
  const [dataEncerramento, setDataEncerramento] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);

  // Carrega turmas do professor selecionado
  const { turmas, loading: turmasLoading, error: turmasError } = useTurmasProfessor(professorSelecionado?.id, jwt);

  // Ações
  const handleProfessorSelect = (e) => {
    const profId = parseInt(e.target.value, 10);
    const p = professores.find((prof) => prof.id === profId);
    setProfessorSelecionado(p || null);
  };
  const handleTurmaSelect = (e) => setSelectedTurma(e.target.value);

  const formatData = (dataString) => {
    if (!dataString) return "";
    const [date, time] = dataString.split("T");
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}-${mm}-${yyyy} ${time}`;
  };

  const abrirChamada = async () => {
    setButtonClicked(true);
    if (!professorSelecionado) {
      return;
    }
    const payload = {
      id_turma: selectedTurma,
      id_professor: professorSelecionado.id,
      encerramento: formatData(dataEncerramento) || null,
      abertura: formatData(dataAbertura) || null,
      status: true,
    };
    try {
      await openChamada(payload);
      // Atualizar lista de chamadas
      const updated = await (await import('@/client/api')).default.chamada.listAll(jwt);
      setChamadas(updated.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fecharChamada = async (idChamada) => {
    try {
      await closeChamada(idChamada);
      // recarregar
      const updated = await (await import('@/client/api')).default.chamada.listAll(jwt);
      setChamadas(updated.data);
    } catch (err) {
      console.error(err);
    }
  };

  const renderResponse = () => {
    if (!buttonClicked) return null;
    if (!serverResponse) return null;
    const successIcon = "✅";
    const errorIcon = "❌";
    if (serverResponse === "Chamada registrada" || serverResponse === "Chamada fechada com sucesso") {
      return <div>{successIcon} {serverResponse}</div>;
    } else {
      return <div>{errorIcon} {serverResponse}</div>;
    }
  };

  if (loadingChamadas || loadingAction) {
    return <p>Carregando chamadas...</p>;
  }
  if (turmasError) {
    console.error('Error loading turmas:', turmasError);
  }
  if (errorChamadas) {
    return <p>Ocorreu um erro ao carregar chamadas.</p>;
  }

  return (
    <>
      <Cabecalho />
      <Navbar />
      <Fundo>
        <div className={styles.fundoContainer}>
          <div className={styles.serverResponse}>{renderResponse()}</div>
          <section className={styles.contentChamada}>
            <div>
              <h1>ABRIR CHAMADA</h1>
            </div>
            <div className={styles.inputArea}>
              <div className={styles.selectCursos}>
                <select onChange={handleProfessorSelect}>
                  <option value="">Selecione um professor</option>
                  {professores.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.Nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.selectCursos}>
                {turmasLoading ? (
                  <p>Carregando turmas...</p>
                ) : turmasError ? (
                  <p>Erro ao carregar turmas</p>
                ) : (
                  <select onChange={handleTurmaSelect} value={selectedTurma}>
                    <option value="">Selecione uma turma</option>
                    {turmas && turmas.length > 0 ? (
                      turmas.map((turma) => (
                        <option key={turma.id_turma} value={turma.id_turma}>
                          {turma.nome}
                        </option>
                      ))
                    ) : (
                      <option value="">Nenhuma turma disponível</option>
                    )}
                  </select>
                )}
              </div>
              <div className="juntar">
                <label className={styles.label}>Insira a data de abertura:</label>
                <input
                  className={styles.input}
                  type="datetime-local"
                  value={dataAbertura}
                  onChange={(e) => setDataAbertura(e.target.value)}
                />
              </div>
              <div className="juntar">
                <label className={styles.label}>Insira a data de fechamento:</label>
                <input
                  className={styles.input}
                  type="datetime-local"
                  value={dataEncerramento}
                  onChange={(e) => setDataEncerramento(e.target.value)}
                />
              </div>
              <div className={styles.divButton}>
                <button onClick={abrirChamada}>Finalizar</button>
              </div>
            </div>
          </section>
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
              {chamadas.map((chamada) => (
                <tr key={chamada.id}>
                  <td>{chamada.nome_turma}</td>
                  <td>{chamada.nome_materia}</td>
                  <td>{chamada.nome_professor}</td>
                  <td>{chamada.abertura}</td>
                  <td>{chamada.encerramento ?? "não definido"}</td>
                  <td>
                    <button onClick={() => fecharChamada(chamada.id_chamada)}>
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

export default withAuth(withAuthorization(Chamada, ["Secretaria"]), ["Secretaria"]);
