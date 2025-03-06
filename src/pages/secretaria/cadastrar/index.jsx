import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@/contexts/UserContext";
import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser,faChalkboardTeacher,faBook,faPeopleGroup} from "@fortawesome/free-solid-svg-icons";
import withAuth from '@/utils/auth';
import api from "@/client/api";
import withAuthorization from '@/utils/withAuthorization';
// import //sendLog from '@/utils/logHelper';

const Cadastrar = () => {
  const { user } = useUser();
  const jwt = user ? user.sub.JWT : null;
  const [activeForm, setActiveForm] = useState(null);
  const [cargo, setCargo] = useState("");
  const [SelectedCargo, setSelectedCargo] = useState(null);
  const [nome, setNome] = useState(null);
  const [login, setLogin] = useState(null);
  const [senha, setSenha] = useState(null);
  const [ra, setRa] = useState(null);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [selectedMateria, setselectedMateria] = useState(null);
  const [nomeMateria, setNomeMateria] = useState(null);
  const [nomeTurma, setNomeTurma] = useState(null);
  const [turmas, setTurmas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [ano,setAno] = useState(null);
  const [curso,setCurso] = useState(null);
  const [modalidade,setModalidade] = useState(null);
  const [selectCurso,setSelectedCurso] = useState(null);
  const [turno,setTurno] = useState(null);
  const [selectTurno,setSelectedTurno] = useState(null);
  const [semestre,setSemestre] = useState(null);
  const [turmaId, setTurmaId] = useState("");
  const [IdProfessor, setIdProfessor] = useState();
  const [IdAluno, setIdAluno] = useState();
  const [previousCargo, setPreviousCargo] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (user) {
      const id_aluno = user.sub.id_aluno;
      const jwt = user.sub.JWT;
    }
  }, [user]);
  
  const resetFormStates = () => {
    setCargo("");
    setSelectedCargo("");
    setNome("");
    setLogin("");
    setSenha("");
    setRa("");
    setSelectedTurma("");
    setselectedMateria("");
    setNomeMateria("");
    setNomeTurma("");
    setAno("");
    setCurso("");
    setModalidade("");
    setSelectedCurso("");
    setTurno("");
    setSelectedTurno("");
    setSemestre("");
    setTurmaId("");
    setIdProfessor("");
    setIdAluno("");
  };

  useEffect(() => {
    resetFormStates();
  }, [activeForm]);

  useEffect(() => {
    if (previousCargo === 'Aluno' && (cargo === 'Professor' || cargo === 'Secretaria')) {
      setSenha("");
      setLogin("");
      setNome("");
      setRa("");
      setSelectedTurma("");
    }
    if (previousCargo === 'Professor' && (cargo === 'Aluno' || cargo === 'Secretaria')) {
      setSenha("");
      setLogin("");
      setNome("");
      setSelectedTurma("");
    }
    if (previousCargo === 'Secretaria' && (cargo === 'Aluno' || cargo === 'Professor')) {
      setSenha("");
      setLogin("");
      setNome("");
    }
    setPreviousCargo(cargo);
  }, [cargo, previousCargo]);

  const fetchTurmas = useCallback(() => {

    if (!jwt) {
      // //sendLog('JWT not available, cannot fetch turmas', 'error');
      return;
    }

    api.turma
      .listAll(jwt)
      .then((response) => {
        setServerResponse(response.data);
        setButtonClicked(true);
        setTurmas(response.data);
        // //sendLog(`Fetched ${response.data.length} turmas successfully`, 'info');
      })
      .catch((error) => {
        setServerResponse(error.response.data);
        setButtonClicked(true);
        // console.error("Erro ao buscar as chamadas abertas:", error);
        // //sendLog(`Failed to fetch turmas: ${error}`, 'error');
      });
  }, [jwt]);

  useEffect(() => {
    fetchTurmas(jwt);
  }, [jwt, fetchTurmas]);



  const CriarTurma = () => {
    const payload = {
      ano: parseInt(ano,10),
      semestre: semestre,
      curso: curso,
      modalidade: modalidade,
      nome: nomeTurma,
      turno:turno,
      id_materia: selectedMateria,
    };
  
    api.turma
      .create(payload, jwt)
      .then((response) => {
        setServerResponse("Turma cadastrada com sucesso");
        setButtonClicked(true);
        setTimeout(() => fetchTurmas(jwt), 2000);
        setNomeTurma("");
        // //sendLog('Turma created successfully', 'info');
      })
      .catch((error) => {
        setServerResponse(error.response.data);
        setButtonClicked(true);
        // console.error("Erro ao criar turma:", error);
        // //sendLog(`Failed to create turma: ${error}`, 'error');
      });
  };

  const CriarMateria = () => {
    const payload = {
      nome: nomeMateria,
    };
  
    api.materia
      .create(payload, jwt)
      .then((response) => {
        setTimeout(() => fetchMaterias(jwt), 2000);
        setNomeMateria("");
        setServerResponse("Materia Cadastrada");
        setButtonClicked(true);
      })
      .catch((error) => {
        const responseMessage = error.response ? error.response.data : "Erro ao criar matéria. Tente novamente mais tarde.";
        setServerResponse(responseMessage);
        setButtonClicked(true);
        console.error("Erro ao criar matéria:", error);
      });
  };
  
  const fetchMaterias = useCallback(() => {
    api.materia
      .listAll(jwt)
      .then((response) => {
        setServerResponse(response.data);
        setButtonClicked(true);
        setMaterias(response.data);
      })
      .catch((error) => {
        const responseMessage = error.response ? error.response.data : "Erro ao buscar as matérias. Tente novamente mais tarde.";
        setServerResponse(responseMessage);
        setButtonClicked(true);
        console.error("Erro ao buscar as matérias:", error);
      });
  }, [jwt]);
  

  useEffect(() => {
    fetchMaterias(jwt);
  }, [jwt, fetchMaterias]);

  const CriarUsuario = () => {
    const payload = {
      nome: nome,
      login: login,
      senha: senha,
      cargo: cargo,
      ra: cargo === "Aluno" ? parseInt(ra, 10) : null,
    };

    if ((cargo === "Professor" || cargo === "Aluno") && (!selectedTurma || selectedTurma === "")) {
      setServerResponse("Por favor, selecione uma turma antes de continuar.");
      setButtonClicked(true);
      return; 
    }

    api.usuario
      .create(payload, jwt)
      .then((response) => {
        setServerResponse(response.data);
        setButtonClicked(true);
        resetFormStates();

        let userId;

        if (cargo === 'Professor') {
          userId = response.data.id_professor;
          setIdProfessor(userId);
          CadastrarProfessorouAlunoNaTurma(userId, jwt);
        } else if (cargo === 'Aluno') {
          userId = response.data.id_aluno;
          setIdAluno(userId);
          CadastrarProfessorouAlunoNaTurma(userId, jwt);
        } else if (cargo === 'Secretaria') {
          setServerResponse("Secretaria cadastrada");
          setButtonClicked(true);
          resetFormStates();
        }
      })
      .catch((error) => {
        setServerResponse(error.response.data);
        setButtonClicked(true);
        resetFormStates();
        console.error("Erro ao criar usuário:", error);
      });
  };

  const CadastrarProfessorouAlunoNaTurma = (userId) => {
    if (cargo === "Professor") {
      const payload = {
        id_turma: parseInt(selectedTurma, 10),
        id_professor: userId,
      };

      api.turma
        .professorNaTurma(payload, jwt)
        .then((response) => {
          setServerResponse(response.data);
          setButtonClicked(true);
          resetFormStates();
        })
        .catch((error) => {
          setServerResponse(error.response.data);
          setButtonClicked(true);
          resetFormStates();
          console.error("Erro ao cadastrar professor na turma:", error);
        });
    }

    if (cargo === "Aluno") {
      const payload = {
        id_turma: parseInt(selectedTurma, 10),
        id_aluno: userId,
      };

      api.turma
        .alunoNaTurma(payload, jwt)
        .then((response) => {
          setServerResponse(response.data);
          setButtonClicked(true);
          resetFormStates();
        })
        .catch((error) => {
          setServerResponse(error.response.data);
          setButtonClicked(true);
          resetFormStates();
          console.error("Erro ao cadastrar aluno na turma:", error);
        });
    }
  };

  const renderResponse = () => {
    if (!buttonClicked) {
      return null;
    } else {
      // //sendLog(`Displaying server response: ${serverResponse}`, 'info');
      const successIcon = "✅";
      const errorIcon = "❌";
      let responseMessage = "";

      if (typeof serverResponse === 'object' && serverResponse.mensagem) {
        responseMessage = serverResponse.mensagem;
      } else if (typeof serverResponse === 'string') {
        responseMessage = serverResponse;
      }

      if (responseMessage.includes("cadastrada")) {
        return (
          <div>
            {successIcon} {responseMessage}
          </div>
        );
      } else if (responseMessage) {
        return (
          <div>
            {errorIcon} {responseMessage}
          </div>
        );
      }
    }
  };

  const renderForm = () => {
    switch (activeForm) {
      case "usuario":
        return (
          <div className={styles.form_center}>
            <div className={styles.serverResponse}>{renderResponse()}</div>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Usuário</h2>
              <label htmlFor="cargo" className={styles.label}>Cargo:</label>
              <select
                className={styles.input}
                id="cargo"
                value={cargo}
                onChange={(e) => {
                  setCargo(e.target.value);
                  setSelectedCargo(e.target.value);
                }}
              >
                <option value="" disabled selected>Selecione um cargo</option>
                <option value="Professor">Professor</option>
                <option value="Aluno">Aluno</option>
                <option value="Secretaria">Secretaria</option>
              </select>
              {cargo !== "Professor" && cargo !== "Secretaria" && (
                <>
                  <label htmlFor="ra" className={styles.label}>RA:</label>
                  <input
                    id="ra"
                    className={styles.input}
                    type="text"
                    placeholder="Insira o RA"
                    value={ra}
                    onChange={(e) => setRa(e.target.value)}
                  />
                </>
              )}
              <label htmlFor="nome" className={styles.label}>Nome:</label>
              <input
                id="nome"
                className={styles.input}
                type="text"
                placeholder="Insira o nome do usuário"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              {cargo === "Professor" || cargo === "Aluno" ? (
                <>
                  <label htmlFor="turma" className={styles.label}>Turma:</label>
                  <select
                    className={styles.input}
                    id="turma"
                    value={selectedTurma}
                    onChange={(e) => setSelectedTurma(e.target.value)}
                  >
                    <option value="">Selecione uma turma</option>
                    {turmas.map((turma) => (
                      <option key={turma.id_turma} value={turma.Id}>
                        {turma.Nome}
                      </option>
                    ))}
                  </select>
                </>
              ) : null}
              <label htmlFor="login" className={styles.label}>Login:</label>
              <input
                id="login"
                className={styles.input}
                type="text"
                placeholder="Informe o login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
              <label htmlFor="senha" className={styles.label}>Senha:</label>
              <input
                id="senha"
                className={styles.input}
                type="password"
                placeholder="Informe a senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button onClick={CriarUsuario} className={styles.botao} disabled={cargo !== "Secretaria" && (!selectedTurma || selectedTurma === "")}>
                Salvar
              </button>
            </div>
          </div>
        );
      case "materia":
        return (
          <div className={styles.form_center}>
            <div className={styles.serverResponse}>{renderResponse()}</div>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Matéria</h2>
              <label htmlFor="nomeMateria" className={styles.label}>Nome da Matéria:</label>
              <input
                id="nomeMateria"
                className={styles.input}
                type="text"
                placeholder="Insira o nome da matéria"
                value={nomeMateria}
                onChange={(e) => setNomeMateria(e.target.value)}
              />
              <button onClick={CriarMateria} className={styles.botao}>
                Salvar
              </button>
            </div>
          </div>
        );
      case "turma":
        return (
          <div className={styles.form_center}>
            <div className={styles.serverResponse}>{renderResponse()}</div>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Turma</h2>
              <label htmlFor="nomeTurma" className={styles.label}>Nome da Turma:</label>
              <input
                id="nomeTurma"
                className={styles.input}
                type="text"
                value={nomeTurma}
                onChange={(e) => setNomeTurma(e.target.value)}
              />
              <label htmlFor="semestre" className={styles.label}>Semestre:</label>
              <input
                id="semestre"
                className={styles.input}
                type="text"
                value={semestre}
                onChange={(e) => setSemestre(e.target.value)}
              />
              <label htmlFor="ano" className={styles.label}>Ano:</label>
              <input
                id="ano"
                className={styles.input}
                type="text"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
              <label htmlFor="materia" className={styles.label}>Matéria:</label>
              <select
                id="materia"
                className={styles.input}
                value={selectedMateria}
                onChange={(e) => setselectedMateria(e.target.value)}
              >
                <option value="">Selecione uma matéria</option>
                {materias.map((materia) => (
                  <option key={materia.id_materia} value={materia.Id}>
                    {materia.Nome}
                  </option>
                ))}
              </select>
              <label htmlFor="curso" className={styles.label}>Curso:</label>
              <select
                id="curso"
                className={styles.input}
                value={curso}
                onChange={(e) => {
                  setCurso(e.target.value);
                  setSelectedCurso(e.target.value);
                }}
              >
                <option value="" disabled selected>Selecione um curso</option>
                <option value="Engenharia de Software">Engenharia de Software</option>
                <option value="Análise e Desenvolvimento de Sistemas">Análise e Desenvolvimento de Sistemas</option>
              </select>
              <label htmlFor="turno" className={styles.label}>Turno:</label>
              <select
                id="turno"
                className={styles.input}
                value={turno}
                onChange={(e) => {
                  setTurno(e.target.value);
                }}
              >
                <option value="" disabled selected>Selecione o Turno</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
              </select>
              <label htmlFor="modalidade" className={styles.label}>Modalidade:</label>
              <select
                id="modalidade"
                className={styles.input}
                value={modalidade}
                onChange={(e) => {
                  setModalidade(e.target.value);
                }}
              >
                <option value="" disabled selected>Selecione a Modalidade</option>
                <option value="Online">Online</option>
                <option value="Presencial">Presencial</option>
              </select>
              <button onClick={CriarTurma} className={styles.botao}>
                Salvar
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <Cabecalho />
      <Fundo>
        <div className={styles.cadastroContainer}>
          <h2>Deseja Cadastrar?</h2>
          <div className={styles.iconContainer}>
            <div className={styles.back}>
              <div
                className={`${styles.iconItem} ${
                  activeForm === "usuario" ? styles.selectedItem : ""
                }`}
                onClick={() => setActiveForm("usuario")}
              >
                <FontAwesomeIcon icon={faUser} size="2x" color="white" />
                <p style={{ color: "white" }}>Usuario</p>
              </div>
            </div>
            <div className={styles.back}>
              <div
                className={`${styles.iconItem} ${
                  activeForm === "materia" ? styles.selectedItem : ""
                }`}
                onClick={() => setActiveForm("materia")}
              >
                <FontAwesomeIcon icon={faBook} size="2x" color="white" />
                <p style={{ color: "white" }}>Matéria</p>
              </div>
            </div>
            <div className={styles.back}>
              <div
                className={`${styles.iconItem} ${
                  activeForm === "turma" ? styles.selectedItem : ""
                }`}
                onClick={() => setActiveForm("turma")}
              >
                <FontAwesomeIcon icon={faPeopleGroup} size="2x" color="white" />
                <p style={{ color: "white" }}>Turma</p>
              </div>
            </div>
          </div>
        </div>
      </Fundo>
      <Fundo>{renderForm()}</Fundo>
    </>
  );
}

export default withAuth(withAuthorization(Cadastrar,["Secretaria"]),['Secretaria']);

