import React, { useState } from "react";
import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Fundo } from "@/components/Fundo/fundo";
import { useUser } from "@/contexts/UserContext";
import withAuth from "@/utils/auth";
import withAuthorization from '@/utils/withAuthorization';

// HOOK
import useFetchLembretes from "@/hooks/useFetchLembretes";

function Lembrete() {
  const { user } = useUser();
  const jwt = user?.sub?.JWT;

  // Carrega lembretes
  const { lembretes, loading, error, findLembreteById } = useFetchLembretes(jwt);

  const [selectedLembrete, setSelectedLembrete] = useState(null);

  const handleFileIconClick = async (idLembrete) => {
    try {
      const data = await findLembreteById(idLembrete);
      setSelectedLembrete(data);
    } catch (err) {
      console.error("Erro ao buscar lembrete:", err);
    }
  };

  if (loading) return <p>Carregando lembretes...</p>;
  if (error) return <p>Erro ao carregar lembretes.</p>;

  return (
    <>
      <Navbar />
      <Cabecalho />
      <section className={styles.page_content}>
        <section className={styles.inner_content}>
          <div className={styles.div_table}>
            <table className={styles.tabela}>
              <thead className={styles.tableHeader}>
                <tr className={styles.row}>
                  <th className={styles.headerCell}>Nome</th>
                  <th className={styles.headerCell}>Titulo</th>
                  <th className={styles.headerCell}>Data do Envio</th>
                  <th className={styles.headerCell}>Visualizado</th>
                  <th className={styles.headerCell}>Enviado por</th>
                  <th className={styles.headerCell}></th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {lembretes.map((lem) => (
                  <tr key={lem.id_lembrete}>
                    <td>{lem.nome_aluno}</td>
                    <td>{lem.Titulo}</td>
                    <td>{lem.Criacao}</td>
                    <td>{lem.visualizacao || "Não visualizado"}</td>
                    <td>{lem.nome_secretaria}</td>
                    <td className={styles.iconCell}>
                      <FontAwesomeIcon
                        icon={faEye}
                        className={styles.faIcon}
                        onClick={() => handleFileIconClick(lem.id_lembrete)}
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
              <span>Visualizado em: {selectedLembrete.visualizacao || "Não visualizado"}</span>
            </div>
          </div>
        )}
      </Fundo>
    </>
  );
}

export default withAuth(withAuthorization(Lembrete, ["Secretaria"]), ["Secretaria"]);
