import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/client/api";
import { useUser } from "@/contexts/UserContext";
import withAuth from "@/utils/auth";
import withAuthorization from '@/utils/withAuthorization';
// import //sendLog from '@/utils/logHelper';

const Chamada = () => {
  const { user } = useUser();
  const IdProfessor = user && user.id_professor;
  const jwt = user ? user.sub.JWT : null;
  const [id, setId] = useState();
  const [turmas, setTurmas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [dataEncerramento, setDataEncerramento] = useState(null);
  const [selectedTurma, setSelectedTurma] = useState("");
  const [selectedProjeto, setSelectedProjeto] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [dataAbertura, setDataAbertura] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [chamadaStatus, setChamadaStatus] = useState();
  const [professores, setProfessores] = useState([]);
  const [chamadas, setChamadas] = useState([]);
  const [professorSelecionado, setProfessorSelecionado] = useState(null);

  useEffect(() => {
    if (user) {
      console.log("User:", user);
      setId(user.sub.id_secretaria);
    }
  }, [user]);

  const handleTurmaSelect = (event) => {
    setSelectedTurma(event.target.value);
  };

  const validarDatas = () => {
    const inicio = new Date(dataAbertura);
    const fim = new Date(dataEncerramento);

    if (inicio >= fim) {
      alert("A data de abertura deve ser anterior à data de encerramento.");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (jwt) {
      api.professor
        .listAll(jwt)
        .then((response) => {
          setProfessores(response.data);
          // //sendLog(`Successfully fetched ${response.data.length} professors`, 'info');
          // console.log(response.data);
        })
        .catch((error) => {
          // console.error("Erro ao buscar professores:", error);
          // //sendLog(`Failed to fetch professors: ${error}`, 'error');
        });
    }
  }, [jwt]);

  const buscarTurmas = useCallback(() => {
    if (professorSelecionado && professorSelecionado.id) {
      api.professor
        .turmas(professorSelecionado.id, jwt)
        .then((response) => {
          setTurmas(response.data);
          // //sendLog(`Successfully fetched ${response.data.length} turmas`, 'info');
        })
        .catch((error) => {
          // console.error("Erro ao buscar turmas:", error);
          // //sendLog(`Failed to fetch turmas: ${error}`, 'error');
        });
    }
  }, [professorSelecionado, jwt]);

  useEffect(() => {
    buscarTurmas();
  }, [professorSelecionado, jwt, buscarTurmas]);

  const handleProfessorSelect = (event) => {
    const professorId = event.target.value;
    if (professorId) {
      const selecionado = professores.find(
        (p) => p.id === parseInt(professorId)
      );
      setProfessorSelecionado(selecionado);
    } else {
      setProfessorSelecionado(null);
      buscarTurmas();
    }
  };

  const listarTodasChamadas = useCallback(() => {
    if (jwt) {
      api.chamada
        .listAll(jwt)
        .then((response) => {
          setChamadas(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar chamadas:", error);
        });
    }
  }, [jwt]);

  useEffect(() => {
    listarTodasChamadas();
  }, [listarTodasChamadas]);

  const ListarTurmas = useCallback(() => {
    const fetchData = async () => {
      try {
        const turmaResponse = await api.professor.turmas(IdProfessor, jwt);
        setTurmas(turmaResponse.data);

        const projetosData = turmaResponse.data.map((turma) => ({
          id_projeto: turma.id_materia,
          nome_projeto: turma.nome_materia,
        }));
        setProjetos(projetosData);

        const chamadasResponse = await api.chamada.listAll(jwt);
        setChamadas(chamadasResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    if (IdProfessor && jwt) {
      fetchData();
    }
  }, [IdProfessor, jwt]);

  useEffect(() => {
    ListarTurmas();
  }, [IdProfessor, jwt, ListarTurmas]);

  const listarTurmasProfessor = useCallback(() => {
    if (professorSelecionado) {
      api.professor
        .turmas(IdProfessor, jwt)
        .then((response) => {
          console.log(response.data);
          setTurmas(response.data);

          const projetosData = response.data.map((turma) => ({
            id_projeto: turma.id_materia,
            nome_projeto: turma.nome_materia,
          }));

          setProjetos(projetosData);
        })
        .catch((error) => {
          console.error("Erro ao buscar as turmas:", error);
        });
    }
  }, [professorSelecionado, IdProfessor, jwt]);

  useEffect(() => {
    listarTurmasProfessor();
  }, [professorSelecionado, IdProfessor, jwt, listarTurmasProfessor]);

  const formatData = (dataString) => {
    if (!dataString) return "";
    const [date, time] = dataString.split("T");
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}-${mm}-${yyyy} ${time}`;
  };

  const abrirChamada = () => {
    if (!professorSelecionado) {
      setServerResponse("Por favor, selecione um professor.");
      setButtonClicked(true);
      return;
    }
    const payload = {
      id_turma: selectedTurma,
      id_professor: professorSelecionado?.id,
      encerramento: formatData(dataEncerramento) || null,
      abertura: formatData(dataAbertura) || null,
      status: true,
    };

    console.log("Enviando payload:", payload);

    api.chamada.create(payload, jwt)
      .then((response) => {
        // console.log("Resposta da chamada:", response.data);
        setServerResponse(response.data);
        setButtonClicked(true);
        // //sendLog('Chamada opened successfully', 'info');
        return api.chamada.listAll(jwt);
      })
      .then((response) => {
        setChamadas(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        // console.error("Erro ao abrir a chamada:", error);
        // //sendLog(`Failed to open chamada: ${error}`, 'error');
        setServerResponse(error.response.data);
        setButtonClicked(true);
        if (error.response) {
          console.error("Detalhes do erro:", error.response.data);
        }
      });
  };

  const fecharChamada = (idChamada) => {
    api.chamada
      .fecharChamada(idChamada, jwt, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        // //sendLog('Chamada closed successfully', 'info');
        // console.log("Chamada encerrada com sucesso:", response.data);
        setServerResponse(response.data);
        return api.chamada.listAll(jwt);
      })
      .then((response) => {
        setChamadas(response.data);
      })
      .catch((error) => {
        // console.error("Erro:", error);
        // //sendLog(`Failed to close chamada: ${error}`, 'error');
        if (error.response) {
          setServerResponse(error.response.data);
          // //sendLog(`Details to close chamada: ${error.response.data}`, 'error');
          // console.error("Detalhes do erro:", error.response.data);
        }
      });
  };

  const renderResponse = () => {
    if (!buttonClicked) {
      return null;
    } else {
      const successIcon = "✅";
      const errorIcon = "❌";
      let responseMessage = "";

      if (typeof serverResponse === "object" && serverResponse.mensagem) {
        responseMessage = serverResponse.mensagem;
      } else if (typeof serverResponse === "string") {
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
    }
  };

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
                <select onChange={handleTurmaSelect}>
                  <option value="">Selecione uma turma</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id_turma}>
                      {turma.nome}
                    </option>
                  ))}
                </select>
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
                <label className={styles.label}>
                  Insira a data de fechamento:
                </label>
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
                  <td>
                    {chamada.encerramento !== null
                      ? formatData(chamada.encerramento, true)
                      : "não definido"}
                  </td>
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
};

export default withAuth(withAuthorization(Chamada, ["Secretaria"]), ["Secretaria"]);
