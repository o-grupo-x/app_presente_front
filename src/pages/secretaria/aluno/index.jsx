import React, { useState } from "react";
import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faFile, faChartPie } from "@fortawesome/free-solid-svg-icons";
import { Fundo } from "@/components/Fundo/fundo";
import { useUser } from "@/contexts/UserContext";
import withAuth from "@/utils/auth";
import withAuthorization from '@/utils/withAuthorization';
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";

// HOOKS
import useAlunosSecretaria from "@/hooks/useAlunosSecretaria";
import useSendLembrete from "@/hooks/useSendLembrete";

function Modal({ isOpen, onClose, alunoId, title, setTitle, content, setContent, cargo, onSend }) {
  if (!isOpen) return null;

  const handleSend = () => {
    onSend(alunoId, title, content, cargo);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <input
            type="text"
            className={styles.modalTitleInput}
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={onClose} className={styles.modalCloseButton}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <textarea
            className={styles.modalTextArea}
            placeholder="Lembrete"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalSubmitButton} onClick={handleSend}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

function Aluno() {
  const { user } = useUser();
  const jwt = user?.sub?.JWT;
  const id_secretaria = user?.sub?.id_secretaria;

  // Hooks
  const { alunos, loading: loadingAlunos, error: errorAlunos, fetchStatusAluno } = useAlunosSecretaria(jwt);
  const { sendLembrete } = useSendLembrete(jwt);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState(null);
  const [selectedCargo, setSelectedCargo] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [studentStats, setStudentStats] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Filtra alunos sempre que "alunos" ou "searchTerm" mudar
  React.useEffect(() => {
    if (searchTerm === "") {
      setFilteredAlunos(alunos);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = alunos.filter((a) => {
        const nomeMatch = a.nome?.toLowerCase().includes(lower);
        const raMatch = a.ra?.toString().toLowerCase().includes(lower);
        return nomeMatch || raMatch;
      });
      setFilteredAlunos(filtered);
    }
  }, [alunos, searchTerm]);

  // Buscar estatísticas
  const handleShowStats = async (idAluno) => {
    try {
      const data = await fetchStatusAluno(idAluno);
      if (data && data.frequencia !== undefined) {
        setStudentStats({
          ...data,
          presencas: 100 - data.faltas,
        });
        setErrorMessage("");
      } else {
        setErrorMessage(data?.mensagem || "Não foi possível obter estatísticas.");
        setStudentStats(null);
      }
    } catch (err) {
      setStudentStats(null);
      setErrorMessage(err.response?.data?.mensagem || err.message);
    }
  };

  // Enviar lembrete
  const handleSend = async (destinatario_id, titulo, mensagem, destinatario_cargo) => {
    try {
      await sendLembrete({
        destinatario_id,
        titulo,
        mensagem,
        destinatario_cargo,
        id_secretaria
      });
    } catch (err) {
      console.error("Erro ao enviar lembrete:", err);
    }
  };

  // Modal
  const openModal = (alunoId, cargo) => {
    setSelectedAlunoId(alunoId);
    setSelectedCargo(cargo);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setContent("");
  };

  if (loadingAlunos) return <p>Carregando alunos...</p>;
  if (errorAlunos) return <p>Erro ao carregar alunos.</p>;

  return (
    <>
      <Navbar />
      <Cabecalho />
      <section className={styles.page_content}>
        <section className={styles.inner_content}>
          <div className={styles.search_input}>
            <input
              type="text"
              placeholder="Pesquisar por nome ou RA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.div_table}>
            <table className={styles.tabela}>
              <thead className={styles.tableHeader}>
                <tr className={styles.row}>
                  <th className={styles.headerCell}>Nome</th>
                  <th className={styles.headerCell}>RA</th>
                  <th className={styles.headerCell}>PROJETO</th>
                  <th className={styles.headerCell}>SEMESTRE</th>
                  <th className={styles.headerCell}>
                    <FontAwesomeIcon icon={faBell} />
                  </th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {filteredAlunos.map((aluno) => (
                  <tr key={aluno.id_aluno}>
                    <td>{aluno.nome}</td>
                    <td>{aluno.ra}</td>
                    <td>{aluno.nome_materia}</td>
                    <td>{aluno.semestre}</td>
                    <td className={styles.iconCell}>
                      <FontAwesomeIcon
                        icon={faFile}
                        className={styles.faIcon}
                        onClick={() => openModal(aluno.id_aluno, aluno.cargo)}
                      />
                      <FontAwesomeIcon
                        icon={faChartPie}
                        className={styles.faIcon}
                        onClick={() => handleShowStats(aluno.id_aluno)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            alunoId={selectedAlunoId}
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            cargo={selectedCargo}
            onSend={handleSend}
          />
        </section>
      </section>
      <Fundo>
        {errorMessage && <h1 className={styles.errorMessage}>{errorMessage}</h1>}
        {studentStats && (
          <div className={styles.fundoContainer}>
            <div className={styles.cardContainer}>
              <div className={styles.chartSection}>
                <GraficoCircular
                  className={styles.chartContainer}
                  data={{
                    labels: ["Presenças", "Faltas"],
                    datasets: [
                      {
                        data: [studentStats.presencas, studentStats.faltas],
                        backgroundColor: [
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 99, 132, 0.2)",
                        ],
                      },
                    ],
                  }}
                  options={{ responsive: true }}
                />
                <p>{studentStats.faltas} Faltas</p>
              </div>
              <div className={styles.infoSection}>
                <h2>{studentStats.nome}</h2>
                <p>Curso: {studentStats.curso}</p>
                <p>RA: {studentStats.ra}</p>
                <p>Status: {studentStats.status ? "Ativo" : "Inativo"}</p>
                <p>Frequência Média: {studentStats.frequencia}%</p>
              </div>
            </div>
          </div>
        )}
      </Fundo>
    </>
  );
}

export default withAuth(withAuthorization(Aluno, ["Secretaria"]), ["Secretaria"]);
