// pages/aluno/HistoricoAluno/index.jsx
import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import withAuthorization from "@/utils/withAuthorization";
import withAuth from "@/utils/auth";
import { useUser } from "@/contexts/UserContext";
import useFetchPresencasAluno from "@/hooks/useFetchPresencasAluno";
import useFetchFaltasPresencas from "@/hooks/useFetchFaltasPresencas";
import styles from "./style.module.css";

function HistoricoAluno() {
  const { user } = useUser();
  const id_aluno = user?.sub?.id_aluno;
  const jwt = user?.sub?.JWT;

  const { historico, loading: loadingHistorico, error: errorHistorico } = useFetchPresencasAluno(id_aluno, jwt);
  const { faltasPresencas, loading: loadingFaltas, error: errorFaltas } = useFetchFaltasPresencas(id_aluno, jwt);

  const [searchTerm, setSearchTerm] = useState("");

  // Reverte apenas quando "historico" mudar
  const reversedHistorico = useMemo(() => {
    return [...historico].reverse();
  }, [historico]);

  // Filtra de acordo com searchTerm
  const historicoFiltrado = useMemo(() => {
    return reversedHistorico.filter(item =>
      item.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reversedHistorico, searchTerm]);

  if (loadingHistorico || loadingFaltas) {
    return <p>Carregando...</p>;
  }
  if (errorHistorico || errorFaltas) {
    return <p>Ocorreu um erro ao carregar dados do histórico.</p>;
  }

  return (
    <div>
      <Cabecalho />
      <Navbar />
      <section className={styles.page_content}>
        <section className={styles.inner_content}>
          <div className={styles.div_content}>
            <div>
              {faltasPresencas?.nome ? (
                <div className={styles.dados}>
                  <div>
                    <h1>{faltasPresencas.presencas}</h1>
                    <p>Presenças</p>
                  </div>
                  <div>
                    <h1>{faltasPresencas.faltas}</h1>
                    <p>Faltas</p>
                  </div>
                </div>
              ) : (
                <p>Carregando faltas/presenças...</p>
              )}
            </div>
            <div className={styles.search_input}>
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.div_table}>
            <table className={styles.tabela}>
              <thead className={styles.tableHeader}>
                <tr className={styles.row}>
                  <th className={styles.headerCell}>Nome</th>
                  <th className={styles.headerCell}>Data</th>
                  <th className={styles.headerCell}>Status</th>
                  <th className={styles.headerCell}>Tipo de Presença</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {historicoFiltrado.map((item) => (
                  <tr key={item.id_presenca} className={styles.row}>
                    <td className={styles.cell}>{item.nome}</td>
                    <td className={styles.cell}>{item.horario}</td>
                    <td className={styles.cell}>{item.status ? "ativo" : "inativo"}</td>
                    <td className={styles.cell}>{item.tipo_presenca}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  );
}

export default withAuth(
  withAuthorization(HistoricoAluno, ["Aluno"]),
  ["Aluno"]
);
