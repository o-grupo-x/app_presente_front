// src/pages/secretaria/cadastrar/index.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import withAuth from "@/utils/auth";
import withAuthorization from "@/utils/withAuthorization";

// HOOKS
import useFetchTurmas from "@/hooks/useTurmasRealTime";
import useMateriasRealTime from "@/hooks/useMateriasRealTime";
import useCreateMateria from "@/hooks/useCreateMateria";
import useCreateTurma from "@/hooks/useCreateTurma";
import useCreateUsuario from "@/hooks/useCreateUsuario";

function Cadastrar() {
  const { user } = useUser();
  const jwt = user?.sub?.JWT;

  const [activeForm, setActiveForm] = useState(null);

  // Estados do form que influenciam o refetch das turmas
  const [cargo, setCargo] = useState("");
  
  // Outros estados do form...
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [ra, setRa] = useState("");
  const [selectedTurma, setSelectedTurma] = useState("");
  const [nomeMateria, setNomeMateria] = useState("");
  const [nomeTurma, setNomeTurma] = useState("");
  const [ano, setAno] = useState("");
  const [curso, setCurso] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [turno, setTurno] = useState("");
  const [semestre, setSemestre] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("");
  const [serverResponse, setServerResponse] = useState(null);

  // Sempre que o activeForm mudar, limpamos os estados
  useEffect(() => {
    setCargo("");
    setNome("");
    setLogin("");
    setSenha("");
    setRa("");
    setSelectedTurma("");
    setNomeMateria("");
    setNomeTurma("");
    setAno("");
    setCurso("");
    setModalidade("");
    setTurno("");
    setSemestre("");
    setSelectedMateria("");
    setServerResponse(null);
  }, [activeForm]);

  // Aqui usamos o hook de turmas com refetch automático se estiver no formulário de usuário com cargo "Professor"
  const { data: turmas = [] } = useFetchTurmas(jwt, { realTime: activeForm === "usuario" && cargo === "Professor" });
  
  // Atualização das matérias em tempo real permanece inalterada
  const { data: materias } = useMateriasRealTime(jwt);

  // Hooks de criação
  const { createMateria, serverResponse: matResp } = useCreateMateria(jwt);
  const { createTurma, serverResponse: turmaResp } = useCreateTurma(jwt);
  const { createUsuario, addUsuarioTurma, serverResponse: usuResp } = useCreateUsuario(jwt);

  // Unir as respostas do servidor para exibição
  const finalResponse = serverResponse || usuResp || matResp || turmaResp;

  // Handlers de criação
  const handleCreateUsuario = async () => {
    if ((cargo === "Professor" || cargo === "Aluno") && !selectedTurma) {
      setServerResponse("Por favor, selecione uma turma antes de continuar.");
      return;
    }
    try {
      const payload = {
        nome,
        login,
        senha,
        cargo,
        ra: cargo === "Aluno" ? parseInt(ra, 10) : null,
      };
      const resData = await createUsuario(payload);

      if (cargo === "Professor" && resData.id_professor) {
        await addUsuarioTurma({
          cargo: "Professor",
          turmaId: selectedTurma,
          userId: resData.id_professor,
        });
      } else if (cargo === "Aluno" && resData.id_aluno) {
        await addUsuarioTurma({
          cargo: "Aluno",
          turmaId: selectedTurma,
          userId: resData.id_aluno,
        });
      } else if (cargo === "Secretaria") {
        setServerResponse("Secretaria cadastrada");
      }
    } catch (err) {
      console.error("Erro ao criar usuario/turma:", err);
    }
  };

  const handleCreateMateria = async () => {
    try {
      await createMateria({ nome: nomeMateria });
      setNomeMateria("");
      setServerResponse("Matéria Cadastrada");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTurma = async () => {
    const payload = {
      ano: parseInt(ano, 10),
      semestre,
      curso,
      modalidade,
      nome: nomeTurma,
      turno,
      id_materia: selectedMateria,
    };
    try {
      await createTurma(payload);
      setServerResponse("Turma cadastrada com sucesso");
      setNomeTurma("");
    } catch (err) {
      console.error(err);
    }
  };

  const renderForm = () => {
    switch (activeForm) {
      case "usuario":
        return (
          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Usuário</h2>
              <label className={styles.label}>Cargo:</label>
              <select
                className={styles.input}
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="Professor">Professor</option>
                <option value="Aluno">Aluno</option>
                <option value="Secretaria">Secretaria</option>
              </select>
              {cargo === "Aluno" && (
                <>
                  <label className={styles.label}>RA:</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={ra}
                    onChange={(e) => setRa(e.target.value)}
                  />
                </>
              )}
              <label className={styles.label}>Nome:</label>
              <input
                className={styles.input}
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              {(cargo === "Professor" || cargo === "Aluno") && (
                <>
                  <label className={styles.label}>Turma:</label>
                  <select
                    className={styles.input}
                    value={selectedTurma}
                    onChange={(e) => setSelectedTurma(e.target.value)}
                  >
                    <option value="">Selecione uma turma</option>
                    {turmas?.map((turma) => (
                      <option key={turma.id_turma} value={turma.Id}>
                       {turma.Nome}
                    </option>
                    ))}
                  </select>
                </>
              )}
              <label className={styles.label}>Login:</label>
              <input
                className={styles.input}
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
              <label className={styles.label}>Senha:</label>
              <input
                className={styles.input}
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button onClick={handleCreateUsuario} className={styles.botao}>
                Salvar
              </button>
            </div>
          </div>
        );
      case "materia":
        return (
          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Matéria</h2>
              <label className={styles.label}>Nome da Matéria:</label>
              <input
                className={styles.input}
                type="text"
                value={nomeMateria}
                onChange={(e) => setNomeMateria(e.target.value)}
              />
              <button onClick={handleCreateMateria} className={styles.botao}>
                Salvar
              </button>
            </div>
          </div>
        );
      case "turma":
        return (
          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Turma</h2>
              <label className={styles.label}>Nome da Turma:</label>
              <input
                className={styles.input}
                type="text"
                value={nomeTurma}
                onChange={(e) => setNomeTurma(e.target.value)}
              />
              <label className={styles.label}>Semestre:</label>
              <input
                className={styles.input}
                type="text"
                value={semestre}
                onChange={(e) => setSemestre(e.target.value)}
              />
              <label className={styles.label}>Ano:</label>
              <input
                className={styles.input}
                type="text"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
              <label className={styles.label}>Matéria:</label>
              <select
                className={styles.input}
                value={selectedMateria}
                onChange={(e) => setSelectedMateria(e.target.value)}
              >
                <option value="">Selecione uma matéria</option>
                {materias &&
                  materias.map((m) => (
                    <option key={m.id_materia} value={m.Id}>
                      {m.Nome}
                    </option>
                  ))}
              </select>
              <label className={styles.label}>Curso:</label>
              <select
                className={styles.input}
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
              >
                <option value="">Selecione um curso</option>
                <option value="Engenharia de Software">
                  Engenharia de Software
                </option>
                <option value="Análise e Desenvolvimento de Sistemas">
                  Análise e Desenvolvimento de Sistemas
                </option>
              </select>
              <label className={styles.label}>Turno:</label>
              <select
                className={styles.input}
                value={turno}
                onChange={(e) => setTurno(e.target.value)}
              >
                <option value="">Selecione o turno</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
              </select>
              <label className={styles.label}>Modalidade:</label>
              <select
                className={styles.input}
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value)}
              >
                <option value="">Selecione a modalidade</option>
                <option value="Online">Online</option>
                <option value="Presencial">Presencial</option>
              </select>
              <button onClick={handleCreateTurma} className={styles.botao}>
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
                className={`${styles.iconItem} ${activeForm === "usuario" ? styles.selectedItem : ""}`}
                onClick={() => setActiveForm("usuario")}
              >
                <p style={{ color: "white" }}>Usuário</p>
              </div>
            </div>
            <div className={styles.back}>
              <div
                className={`${styles.iconItem} ${activeForm === "materia" ? styles.selectedItem : ""}`}
                onClick={() => setActiveForm("materia")}
              >
                <p style={{ color: "white" }}>Matéria</p>
              </div>
            </div>
            <div className={styles.back}>
              <div
                className={`${styles.iconItem} ${activeForm === "turma" ? styles.selectedItem : ""}`}
                onClick={() => setActiveForm("turma")}
              >
                <p style={{ color: "white" }}>Turma</p>
              </div>
            </div>
          </div>
        </div>
      </Fundo>
      <Fundo>
        <div className={styles.serverResponse}>
          {finalResponse && (
            <p>
              {typeof finalResponse === "object"
                ? JSON.stringify(finalResponse)
                : finalResponse}
            </p>
          )}
        </div>
        {renderForm()}
      </Fundo>
    </>
  );
}

export default withAuth(withAuthorization(Cadastrar, ["Secretaria"]), ["Secretaria"]);
