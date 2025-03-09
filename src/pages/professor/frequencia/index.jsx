// pages/professor/Frequencia/index.jsx
import React, { useState, useEffect } from "react";
import NavBar from "@/components/Navbar/navbar";
import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import GraficoBarra from "@/components/GraficoBarra/GraficoBarra";
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";
import LoadingBar from "@/components/Loading";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import withAuthorization from '@/utils/withAuthorization';
import withAuth from "@/utils/auth";
import { useUser } from "@/contexts/UserContext";
// // import sendLog from '@/utils/logHelper';

// HOOKS
import useFetchChamadasAbertasProfessor from '@/hooks/useFetchChamadasAbertasProfessor';
import useFetchFrequencia from '@/hooks/useFetchFrequencia';
import useFetchHistoricoSemanal from '@/hooks/useFetchHistoricoSemanal';
import useFetchMediaSemanal from '@/hooks/useFetchMediaSemanal';

import Chart from 'chart.js/auto';
Chart.register(ChartDataLabels);

function Frequencia() {
  const { user } = useUser();
  const jwt = user?.sub?.JWT;
  const idProfessor = user?.sub?.id_professor;

  // Estados para ID da chamada/turma selecionada
  const [idChamada, setIdChamada] = useState(null);
  const [turma, setTurmaId] = useState(null);

  // Estado para a progress bar
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 1) Chamadas abertas
  const {
    chamadasAbertas,
    loading: loadingCA,
    error: errorCA
  } = useFetchChamadasAbertasProfessor(idProfessor, jwt);

  // 2) Frequencia de uma chamada
  const {
    frequenciaData,
    loading: loadingFreq,
    error: errorFreq
  } = useFetchFrequencia(idProfessor, idChamada, jwt);

  // 3) Histórico semanal
  const {
    historicoSemanal,
    loading: loadingHist,
    error: errorHist
  } = useFetchHistoricoSemanal(turma, jwt);

  // 4) Média semanal
  const {
    mediaSemanal,
    loading: loadingMed,
    error: errorMed
  } = useFetchMediaSemanal(turma, jwt);

  // Ao carregar chamadas abertas, pega a primeira para exibir
  useEffect(() => {
    if (chamadasAbertas && chamadasAbertas.length > 0) {
      setIdChamada(chamadasAbertas[0].id_chamada);
      setTurmaId(chamadasAbertas[0].id_novo); // ou id_turma, conforme o back retorne
    }
  }, [chamadasAbertas]);

  // Exemplo de "loading progress" a cada X tempo (opcional)
  useEffect(() => {
    let progress = 0;
    const interval = 1000;
    const totalSteps = 10;

    const progressInterval = setInterval(() => {
      if (progress < 100) {
        progress += 100 / totalSteps;
        setLoadingProgress(progress);
      } else {
        clearInterval(progressInterval);
        setLoadingProgress(0);
        // se quiser recarregar alguma coisa a cada 10 seg, faça aqui
      }
    }, interval);

    return () => clearInterval(progressInterval);
  }, []);

  // Extrair dados de frequencia
  const presentes = frequenciaData?.["Alunos presentes"] || 0;
  const ausentes = frequenciaData?.["Faltam a chegar"] || 0;
  const totalAlunos = frequenciaData?.["Total de Alunos"] || 0;

  // Extrair porcentagem do historicoSemanal
  let porcentagemPresenca = null;
  if (historicoSemanal && historicoSemanal.porcentagem_presenca) {
    porcentagemPresenca = parseFloat(historicoSemanal.porcentagem_presenca).toFixed(2);
  }

  // Construir dados do gráfico circular
  const GraficoCircularData = {
    labels: ["Presença", "Ausência"],
    datasets: [
      {
        label: "Presença / Ausência",
        data: [presentes, ausentes],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"]
      }
    ]
  };
  const GraficoCircularOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          let sum = 0;
          let dataArr = context.chart.data.datasets[0].data;
          dataArr.forEach((data) => (sum += data));
          let percentage = (value * 100) / sum;
          return isNaN(percentage) ? "" : percentage.toFixed(2) + "%";
        },
        color: "#fff",
        anchor: "center"
      },
      legend: {
        position: "left"
      },
      title: {
        display: true,
        text: ""
      }
    }
  };

  // Dias da semana p/ gráfico de barras
  const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const labels = mediaSemanal?.map((item) => diasDaSemana[item.dia_semana]) || [];
  const dataValues = mediaSemanal?.map((item) => parseFloat(item.porcentagem_presenca)) || [];

  // Construir dados do gráfico de barras
  const GraficoBarraData = {
    labels,
    datasets: [
      {
        label: "Frequência",
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2
      }
    ]
  };
  const GraficoBarraOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value + "%"
        }
      }
    },
    plugins: {
      datalabels: {
        formatter: (value) => (value === 100 ? "" : value + "%"),
        color: "#fff",
        anchor: "end"
      },
      legend: {
        display: false
      }
    }
  };

  // Checando erro ou loading
  if (loadingCA || loadingFreq || loadingHist || loadingMed) {
    return <p>Carregando...</p>;
  }
  if (errorCA || errorFreq || errorHist || errorMed) {
    return <p>Ocorreu um erro ao carregar os dados.</p>;
  }

  return (
    <>
      <NavBar />
      <Cabecalho />
      <Fundo>
        <LoadingBar progress={loadingProgress} />
        <div className={styles.container_center}>
          <div className={styles.tituloGrafico}>
            <div className={styles.info_center}>
              <h2>Presenças Marcadas</h2>
              <h3>
                {totalAlunos > 0
                  ? `${presentes}/${totalAlunos}`
                  : "Sem chamada Aberta."}
              </h3>
            </div>
            <div className={styles.graficoCircular}>
              {totalAlunos > 0 && (
                <GraficoCircular
                  data={GraficoCircularData}
                  options={GraficoCircularOptions}
                />
              )}
            </div>
          </div>
        </div>
      </Fundo>

      <Fundo className={styles.Fundo}>
        <div className={styles.container_center}>
          <div className={styles.tituloGrafico}>
            <div className={styles.graficoBar}>
              <GraficoBarra
                data={GraficoBarraData}
                options={GraficoBarraOptions}
              />
            </div>
            <h2>
              Frequência Semanal: <br />
              {porcentagemPresenca ? porcentagemPresenca + "%" : "Sem dados"}
            </h2>
          </div>
        </div>
      </Fundo>
    </>
  );
}

export default withAuth(
  withAuthorization(Frequencia, ["Professor"]),
  ["Professor"]
);
