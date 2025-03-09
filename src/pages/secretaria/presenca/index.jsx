import React, { useState } from "react";
import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import { Fundo } from "@/components/Fundo/fundo";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { useUser } from "@/contexts/UserContext";
import withAuthorization from '@/utils/withAuthorization';
import withAuth from "@/utils/auth";

// HOOK
import useMarkPresence from "@/hooks/useMarkPresence";

function Presenca() {
  const { user } = useUser();
  const jwt = user?.sub?.JWT;
  const id_secretaria = user?.sub?.id_secretaria;
  const cargo = user?.sub?.cargo;

  const [ra, setRa] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);

  // Hook p/ marcar presença
  const { markPresence, serverResponse, loading, error } = useMarkPresence(jwt);

  const handleMarcarPresenca = async () => {
    setButtonClicked(true);
    try {
      await markPresence({
        ra: parseInt(ra, 10),
        cargo_manual: cargo,
        id_manual: id_secretaria
      });
    } catch (err) {
      console.error("Erro ao marcar presença:", err);
    }
  };

  const renderResponse = () => {
    if (!buttonClicked) return null;
    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao marcar presença!</p>;
    if (serverResponse) {
      if (serverResponse.mensagem === "presenca registrada") {
        return <div>✅ {serverResponse.mensagem}</div>;
      } else {
        return <div>❌ {serverResponse.mensagem || serverResponse}</div>;
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
            <button className={styles.botao} onClick={handleMarcarPresenca}>
              Confirmar Presença
            </button>
          </div>
        </div>
      </Fundo>
    </>
  );
}

export default withAuth(withAuthorization(Presenca, ["Secretaria"]), ["Secretaria"]);
