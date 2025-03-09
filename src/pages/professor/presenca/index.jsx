// pages/professor/Presenca/index.jsx
import React, { useState } from "react";
import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import { Fundo } from "@/components/Fundo/fundo";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { useUser } from "@/contexts/UserContext";
import withAuthorization from '@/utils/withAuthorization';
import withAuth from "@/utils/auth";
import useMarkPresenceProfessor from '@/hooks/useMarkPresenceProfessor';

function Presenca() {
  const { user } = useUser();
  const jwt = user?.sub?.JWT;
  const cargo = user?.sub?.cargo;
  const id_professor = user?.sub?.id_professor;
  const [ra, setRa] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);

  // Hook p/ marcar presença
  const { markPresence, serverResponse, loading, error } = useMarkPresenceProfessor(jwt);

  const handlePresenca = () => {
    setButtonClicked(true);
    markPresence({
      ra,
      cargo_manual: cargo,
      id_manual: id_professor,
    });
  };

  const renderResponse = () => {
    if (!buttonClicked) return null;

    if (loading) {
      return <p>Carregando...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>Erro ao marcar presença!</p>;
    }
    if (serverResponse) {
      const successIcon = "✅";
      const errorIcon = "❌";
      const responseMessage = serverResponse.mensagem || serverResponse;
      if (responseMessage === "presenca registrada") {
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
    return null;
  };

  return (
    <>
      <Navbar />
      <Cabecalho />
      <Fundo>
        <div className={styles.fundoContainer}>
          <div className={styles.serverResponse}>{renderResponse()}</div>
          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Realizar Presença</h2>
              <input
                className={styles.input}
                type="text"
                placeholder="Informe o RA"
                value={ra}
                onChange={(e) => setRa(e.target.value)}
              />
            </div>
            <button className={styles.botao} onClick={handlePresenca}>
              Confirmar Presença
            </button>
          </div>
        </div>
      </Fundo>
    </>
  );
}

export default withAuth(withAuthorization(Presenca, ["Professor"]), ["Professor"]);
