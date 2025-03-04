import React, { useState, useEffect, useCallback } from "react";
import api from "@/client/api";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
// import Footer from "@/components/Footer/Footer";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { text } from "@fortawesome/fontawesome-svg-core";
import { useUser } from "@/contexts/UserContext";
import withAuthorization from '@/utils/withAuthorization';
import sendLog from '@/utils/logHelper';

import withAuth from '@/utils/auth';

const HistoricoAluno = () => {

    const { user } = useUser();
    const id_aluno = user ? user.sub.id_aluno : null;
    const jwt = user ? user.sub.JWT : null;
    const [historico, setHistorico] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [historicoFiltrada, setHistoricoFiltrada] = useState([]);
    const [faltasPresencas, setFaltasPresencas] = useState();
    const [ServerResponse, setServerResponse] = useState("");
    const [setJwt] = useState("");
    

    historico.reverse();
    
    useEffect(() => {
        if (user) {
          const id_aluno = user.sub.id_aluno;
          const jwt = user.sub.JWT;
          const userInfo = `Carregando dados do usuário: ${JSON.stringify(user.sub)}`;
          sendLog(userInfo, 'info');
        }
      }, [user]);


    const fetchPresencasAluno = useCallback(() => {
        api.aluno.findChamadaByAluno(id_aluno,jwt)
            .then(response => {
                setHistorico(response.data);
                setHistoricoFiltrada(response.data);
                //console.log(response.data);
                sendLog(`presenças: ${response.data}`, 'info');
            })
            .catch(error => {
                //console.log("Error ao buscar a lista de presencas", error);
                sendLog(`Erro ao buscar presenças: ${error.message}`, 'error'); 
            });
    }, [id_aluno, jwt]);

    const fetchFaltasPresencas = useCallback(() => {
        api.aluno.presencasFaltas(id_aluno,jwt)
            .then(response => {
                setFaltasPresencas(response.data);
                //console.log(`presencas faltas ` + response.data);
                sendLog(`presenças e faltas: ${response.data}`, 'info');
            })
            .catch(error => {
                //console.log("Error ao buscar a lista de presencas", error);
                sendLog(`Erro ao buscar presenças e faltas: ${error.message}`, 'error');
            });
    }, [id_aluno, jwt]);

    useEffect(() => {
        if (id_aluno && jwt) {
            fetchFaltasPresencas();
        }
    }, [id_aluno, jwt,fetchFaltasPresencas]);
    
    useEffect(() => {
        if (id_aluno && jwt) {
            fetchPresencasAluno();
        }
    }, [id_aluno, jwt,fetchPresencasAluno]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        const filteredList = historico.filter(item =>
            item.nome.toLowerCase().includes(value.toLowerCase())
        );

        setHistoricoFiltrada(filteredList);
        sendLog(`Pesquisa realizada: ${value}`, 'info');
    };

    return (
        <div>
            <Cabecalho />
            <Navbar />
            <section className={styles.page_content}>
                <section className={styles.inner_content}>
                    <div className={styles.div_content}>
                        <div>
                            {faltasPresencas && faltasPresencas.nome ? (
                                <div className={styles.dados}>
                                    <div>
                                        <h1>{faltasPresencas.presencas}</h1>
                                        <p>Presencas</p>
                                    </div>
                                    <div>
                                        <h1>{faltasPresencas.faltas}</h1>
                                        <p>Faltas</p>
                                    </div>
                                </div>
                            ) : (
                                <p>Carregando...</p>
                            )}
                        </div>
                        <div className={styles.search_input}>
                            <div>
                                <input type="text" placeholder="Pesquisar..."
                                    value={searchTerm}
                                    onChange={handleSearch}></input>
                            </div>
                        </div>
                    </div>
                    <div className={styles.div_table}>
                        <table className={styles.tabela}>
                            <thead className={styles.tableHeader}>
                                <tr className={styles.row}>
                                    <th className={styles.headerCell}>Nome</th>
                                    <th className={styles.headerCell}>Data</th>
                                    <th className={styles.headerCell}>Status</th>
                                    <th className={styles.headerCell}>Tipo de Presenca</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {historicoFiltrada.map((item) => (
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

export default withAuth(withAuthorization(HistoricoAluno, ["Aluno"]), ["Aluno"]);