import React, { useState } from "react";
import style from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import api from "@/client/api";

const LembretesModal = ({ lembretes, onClose }) => {
  const [visualizado, setVisualizado] = useState({});

  const handleVisualizar = (idLembrete) => {
    // Aqui você chama o endpoint para marcar o lembrete como visualizado
    api.aluno
      .vizualizar(idLembrete)
      .then((response) => {
        setVisualizado((prevVisualizado) => {
          const novoEstado = { ...prevVisualizado };
          novoEstado[idLembrete] = !novoEstado[idLembrete];
          return novoEstado;
        });
      })
      .catch((error) => {
        console.error("Erro ao visualizar o lembrete", error);
      });
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <button onClick={onClose}>FECHAR</button>
        <h2>Lembretes</h2>
        <ul>
          {lembretes.map((lembrete) => (
            <li key={lembrete.id}>
              <h3>Título: {lembrete.Titulo}</h3>
              <p>{lembrete.mensagem}</p>
              <FontAwesomeIcon
                icon={visualizado[lembrete.id] ? faEyeSlash : faEye}
                className={style.visualizadoIcon}
                onClick={() => handleVisualizar(lembrete.id)}
                data-testid={`eye-icon-${lembrete.id}`}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LembretesModal;
