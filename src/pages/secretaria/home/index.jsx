import React, { useState } from "react";
import styles from "./style.module.css";
import NavBar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { Fundo } from "@/components/Fundo/fundo";
import withAuth from "@/utils/auth";
import withAuthorization from '@/utils/withAuthorization';

// Components
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";
import GraficoBarra from "@/components/GraficoBarra/GraficoBarra";

// HOOKS
import { useDashboardTurmas, usePresentesAusentes, useAtivosInativos, useMediaAtivosInativos, useMediaPresentesAusentes } from "@/hooks/useDashboardData";

function Dashboard() {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [labelGraf, setLabelGraf] = useState(["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]);
  const [barThick, setBarThick] = useState(100);

  // Busca lista de turmas
  const { turmas } = useDashboardTurmas();

  // Quando selecionar uma turma, carregaremos dados
  const handleSelectChange = (e) => {
    const idTurma = parseInt(e.target.value, 10);
    const t = turmas.find((x) => x.Id === idTurma);
    setSelectedOption(idTurma.toString());
    setSelectedName(t?.Nome || "");

    // e aqui a UI re-renderiza chamando os hooks abaixo (outra abordagem: local state + pass p/ hooks)
  };

  // Hooks para a turma selecionada
  const { data: turmaPresentesAusentes } = usePresentesAusentes(null, selectedOption);
  const { data: turmaAtivosInativos } = useAtivosInativos(null, selectedOption);
  const { mediaFrequentes } = useMediaAtivosInativos(null, selectedOption);
  const { mediaAusentes } = useMediaPresentesAusentes(null, selectedOption);

  // Graficos
  const GraficoCircularOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  const GraficoBarraOptions = {
    scales: {
      y: { min: 0, max: 100 }
    },
    plugins: {
      legend: { display: false }
    }
  };

  // Montar data
  const DataCircularAusentes = {
    labels: ["Presentes", "A chegar"],
    datasets: [
      {
        data: [
          turmaPresentesAusentes?.presentes || 0,
          turmaPresentesAusentes?.ausentes || 0
        ],
        backgroundColor: ["#748cab", "#1d2d44"]
      }
    ]
  };

  const DataCircularAtivos = {
    labels: ["Frequentes", "Ausentes"],
    datasets: [
      {
        data: [
          turmaAtivosInativos?.frequente || 0,
          turmaAtivosInativos?.ausente || 0
        ],
        backgroundColor: ["#748cab", "#1d2d44"]
      }
    ]
  };

  const DataBarraFrequentes = {
    labels: labelGraf,
    datasets: [
      {
        data: [mediaFrequentes || 0], // esse array pode precisar ser maior
        backgroundColor: "rgba(201, 203, 207, 0.2)",
        borderColor: "rgb(201, 203, 207)",
        borderWidth: 1,
        barThickness: barThick
      }
    ]
  };

  const DataBarraAusentes = {
    labels: labelGraf,
    datasets: [
      {
        data: [mediaAusentes || 0],
        backgroundColor: "rgba(201, 203, 207, 0.2)",
        borderColor: "rgb(201, 203, 207)",
        borderWidth: 1,
        barThickness: barThick
      }
    ]
  };

  return (
    <>
      <NavBar />
      <Cabecalho />
      <Fundo className={styles.Fundo}>
        <section className={styles.content}>
          <div className={styles.contentHeader}>
            <div>Turma selecionada: {selectedName}</div>
            <div className={styles.selectCursos}>
              <select id="cursos" value={selectedOption} onChange={handleSelectChange}>
                <option value="" disabled hidden>Filtrar /turma</option>
                {turmas.map((turma) => (
                  <option key={turma.Id} value={turma.Id}>
                    {turma.Nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className={styles.graficosCircularContent}>
          <div className={styles.a}>
            <div className={styles.grafico}>
              <GraficoCircular data={DataCircularAusentes} options={GraficoCircularOptions} />
            </div>
          </div>
          <div className={styles.a}>
            <div className={styles.grafico}>
              <GraficoCircular data={DataCircularAtivos} options={GraficoCircularOptions} />
            </div>
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.contentHeaderBar}>
            <div className={styles.contentHeaderBarTitle}>
              <p>Média de alunos frequentes</p>
              <div>Turma selecionada: {selectedName}</div>
            </div>
          </div>
        </section>
        <section className={styles.graficoBarContent}>
          <div className={styles.graficoBar}>
            <GraficoBarra data={DataBarraFrequentes} options={GraficoBarraOptions} />
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.contentHeaderBar}>
            <div className={styles.contentHeaderBarTitle}>
              <p>Média de alunos ausentes</p>
              <div>Turma selecionada: {selectedName}</div>
            </div>
          </div>
        </section>
        <section className={styles.graficoBarContent}>
          <div className={styles.graficoBar}>
            <GraficoBarra data={DataBarraAusentes} options={GraficoBarraOptions} />
          </div>
        </section>
      </Fundo>
    </>
  );
}

export default withAuth(withAuthorization(Dashboard, ["Secretaria"]), ["Secretaria"]);
