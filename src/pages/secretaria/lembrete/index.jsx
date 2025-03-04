import React, { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faFile, faChartPie,faEye  } from "@fortawesome/free-solid-svg-icons";
import { Fundo } from "@/components/Fundo/fundo";
import api from "@/client/api";
import { useUser } from "@/contexts/UserContext";
import withAuth from "@/utils/auth";
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";
import withAuthorization from '@/utils/withAuthorization';
import sendLog from '@/utils/logHelper';

function Modal({ isOpen, onClose, title, content }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.ajuste}>          
            <h2 className={styles.modalTitle}>Titulo:</h2><h1>{title}</h1>
            </div>
          <button onClick={onClose} className={styles.modalCloseButton}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.modalText}>Mensagem: {content}</p>
        </div>
      </div>
    </div>
  );
}

const Lembrete = () => {
  const [lembretes, setLembretes] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLembrete, setSelectedLembrete] = useState(null);
  const [nome_user,setNomeUser] = useState("");
  const [nome_secretaria,setNome_Secretaria] = useState("");
  const { user } = useUser();
  const IdSecretaria = user && user.id_secretaria;
  const [id, setId] = useState();
  const jwt = user ? user.sub.JWT : null;

  useEffect(() => {
    if (user) {
      setId(user.sub.id_secretaria);
      const jwt = user.sub.JWT;
      sendLog(`User data loaded for user ${user.sub.id}`, 'info');
    }
  }, [user]);

  const handleFileIconClick = (lembreteId) => {
    api.lembrete
      .FindById(lembreteId, jwt)
      .then((response) => {
        setSelectedLembrete(response.data);
        sendLog(`Lembrete details loaded for ID ${lembreteId}`, 'info');
      })
      .catch((error) => {
        // console.error("Erro ao buscar lembrete:", error);
        sendLog(`Failed to fetch lembrete details for ID ${lembreteId}: ${error}`, 'error');
      });
  };
  const listarTodosLembretes = useCallback(() => {
    api.lembrete
      .listAll(jwt)
      .then((response) => {
        setLembretes(response.data);
        // console.log(response.data);
        sendLog(`Successfully fetched lembretes: ${response.data.length} items`, 'info');
      })
      .catch((error) => {
        // console.error("Erro ao buscar lembretes:", error);
        sendLog(`Failed to fetch lembretes: ${error}`, 'error');
      });
  }, [jwt]);

  useEffect(() => {
    listarTodosLembretes();
  }, [listarTodosLembretes]);

  return (
    <>
      <Navbar />
      <Cabecalho />
      <section className={styles.page_content}>
        <section className={styles.inner_content}>
          <div className={styles.search_input}></div>
          <div className={styles.div_table}>
            <table className={styles.tabela}>
              <thead className={styles.tableHeader}>
                <tr className={styles.row}>
                  <th className={styles.headerCell}>Nome</th>
                  <th className={styles.headerCell}>Titulo</th>
                  <th className={styles.headerCell}>Data do Envio</th>
                  <th className={styles.headerCell}>Vizualizado</th>
                  <th className={styles.headerCell}>Enviado por</th>
                  <th className={styles.headerCell}></th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {lembretes.map((lembrete) => (
                  <tr key={lembrete.id}>
                    <td>{lembrete.nome_aluno}</td>
                    <td>{lembrete.Titulo}</td>
                    <td>{lembrete.Criacao}</td>
                    <td>{lembrete.visualizacao || 'Não visualizado'}</td>
                    <td>{lembrete.nome_secretaria}</td>
                    <td className={styles.iconCell}>
                      <FontAwesomeIcon
                        icon={faEye}
                        className={styles.faIcon}
                        onClick={() =>
                          handleFileIconClick(lembrete.id_lembrete)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <Fundo>
        {selectedLembrete && (
          <div className={styles.lembreteContainer}>
            <h1 className={styles.lembreteTitle}>LEMBRETE</h1>
            <div className={styles.lembreteContent}>
              <h2>Titulo: {selectedLembrete.titulo}</h2>
              <p>Mensagem: {selectedLembrete.mensagem}</p>
            </div>
            <div className={styles.lembreteFooter}>
              <span>Enviado em: {selectedLembrete.criacao}</span>
              <span>Visualizado em: {selectedLembrete.visualizacao || 'Não visualizado'}</span>
            </div>
          </div>
        )}
      </Fundo>
    </>
  );
};

// export default Aluno;
export default withAuth(withAuthorization(Lembrete,["Secretaria"]),['Secretaria']);

