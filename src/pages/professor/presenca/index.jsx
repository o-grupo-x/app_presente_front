
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import { Fundo } from "@/components/Fundo/fundo";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { useUser } from "@/contexts/UserContext";
import withAuthorization from '@/utils/withAuthorization';
import api from "@/client/api";
import withAuth from "@/utils/auth";
import sendLog from '@/utils/logHelper';

const Presenca = () => {
  const { user } = useUser();
  const jwt = user ? user.sub.JWT : null;
  const cargo = user ? user.sub.cargo : null;
  const id_professor = user ? user.sub.id_professor : null;
  const [ra, setRa] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);


  useEffect(() => {
    if (user) {
      // console.log(user.sub);
      const jwt = user.sub.JWT;
      const cargo = user.sub.cargo
      const id_professor = user.sub.id_professor
      sendLog(`User data loaded: ${JSON.stringify(user.sub)}`, 'debug');
    }
  }, [user]);


  const MarcarPresenca = () => {
    const body = {
      ra: parseInt(ra, 10),
      cargo_manual: cargo,
      id_manual:id_professor,
    };

    sendLog(`Attempting to mark presence for RA: ${ra}`, 'info');

    api.professor
      .presenca(body,jwt)
      .then((response) => {
        console.log("Chamada marcada com sucesso:", response.data);
        setServerResponse(response.data);
        setButtonClicked(true);
        sendLog(`Presence marked successfully for RA: ${ra}`, 'success');
      })
      .catch((error) => {
        console.error("Erro:", error);
        sendLog(`Error marking presence for RA: ${ra} - ${error.message}`, 'error');
        if (error.response) {
          console.error("Detalhes do erro:", error.response.data);
          setServerResponse(error.response.data);
          setButtonClicked(true);
        }
      });
  };

  const renderResponse = () => {
    if (!buttonClicked) {
      return null;
    } else {
      const successIcon = "✅";
      const errorIcon = "❌";
  
      const responseMessage = serverResponse.mensagem ? serverResponse.mensagem : serverResponse;
  
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
                value={ra || ""}
                onChange={(e) => setRa(e.target.value)}
              ></input>
            </div>
            <button className={styles.botao} onClick={MarcarPresenca}>
              Confirmar Presença
            </button>
          </div>
        </div>
      </Fundo>
    </>
  );
}

export default withAuth(withAuthorization(Presenca,["Professor"]),['Professor']);
