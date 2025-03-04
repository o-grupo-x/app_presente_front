import React, { useCallback, useEffect, useState } from "react";
import NavBar from "@/components/Navbar/navbar";
import Chart from 'chart.js/auto';
import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import GraficoBarra from "@/components/GraficoBarra/GraficoBarra";
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";
import LoadingBar from "@/components/Loading";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import api from "@/client/api";
import withAuthorization from '@/utils/withAuthorization';
import { useUser } from "@/contexts/UserContext";
import withAuth from "@/utils/auth";
import sendLog from '@/utils/logHelper';

Chart.register(ChartDataLabels);

const Frequencia = () => {
  const { user } = useUser();
  const jwt = user ? user.sub.JWT : null;
  const [idProfessor, setIdProfessor] = useState(user ? user.sub.id_professor : null);
  const [numAlunosData, setNumAlunosData] = useState(null);
  const [idChamada, setIdChamada] = useState();
  const [presentes, setPresentes] = useState();
  const [ausentes, setAusentes] = useState();
  const [totalAlunos, setTotalAlunos] = useState();
  const [porcentagemPresenca, setPorcentagemPresenca] = useState(null);
  const [mediaSemanalData, setMediaSemanalData] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [chamadasAbertas, setChamadasAbertas] = useState([]);
  const [turma, setTurmaId] = useState();

  useEffect(() => {
    if (user) {
      setIdProfessor(user.sub.id_professor);
      sendLog('Usuário detectado e ID do professor atualizado.', 'info');
    }
  }, [user]);

  const fetchChamadasAbertas = useCallback(() => {
    api.professor
      .chamadasAbertas(idProfessor, jwt)
      .then((response) => {
        console.log("Chamadas abertas:", response.data);
        setChamadasAbertas(response.data);
        setIdChamada(response.data[0]?.id_chamada);
        setTurmaId(response.data[0]?.id_novo);
        sendLog('Chamadas abertas recebidas com sucesso.', 'success');
      })
      .catch((error) => {
        // console.error("Erro ao buscar as chamadas abertas:", error);
        sendLog(`Erro ao buscar chamadas abertas: ${error.message}`, 'error');
      });
  }, [idProfessor, jwt]);

  useEffect(() => {
    fetchChamadasAbertas();
  }, [fetchChamadasAbertas]);

  const startLoadingProgress = useCallback(() => {
    let progress = 0;
    const interval = 1000;
    const totalSteps = 10;

    const progressInterval = setInterval(() => {
      if (progress < 100) {
        progress += 100 / totalSteps;
        setLoadingProgress(progress);
        sendLog(`Progresso de carregamento atualizado: ${progress}%`, 'info');
      } else {
        clearInterval(progressInterval);
        setLoadingProgress(0);
        sendLog('Progresso de carregamento concluído e reiniciado.', 'info');
        setTimeout(() => {
          startLoadingProgress();
        }, 10000);
      }
    }, interval);

    return progressInterval;
  }, []);

  useEffect(() => {
    startLoadingProgress();
  }, [startLoadingProgress]);

  useEffect(() => {
    if (loadingProgress === 100) {
      fetchChamadasAbertas();
      // fetchDados();
    }
  }, [loadingProgress, fetchChamadasAbertas]);

  const fetchDados = useCallback(() => {
    return new Promise((resolve, reject) => {
      api.professor
        .frequencia(idProfessor, idChamada, jwt)
        .then((response) => {
          console.log("Dados recebidos para a frequência:", response.data);
          setNumAlunosData(response.data);
          sendLog('Dados de frequência recebidos com sucesso.', 'success');
          resolve();
        })
        .catch((error) => {
          console.error("Erro ao buscar os dados:", error);
          sendLog(`Erro ao buscar dados de frequência: ${error.message}`, 'error');
          reject();
        });
    });
  }, [idProfessor, idChamada, jwt]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  useEffect(() => {
    if (numAlunosData) {
      setAusentes(numAlunosData["Faltam a chegar"]);
      setPresentes(numAlunosData["Alunos presentes"]);
      setTotalAlunos(numAlunosData["Total de Alunos"]);
      sendLog(`Dados de presença atualizados: Presentes ${presentes}, Ausentes ${ausentes}, Total ${totalAlunos}`, 'info');
    }
  }, [numAlunosData]);

  const GraficoCircularData = {
    labels: ["Presença", "Ausência"],
    datasets: [
      {
        label: "Presença / Ausência",
        data: [presentes, ausentes],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
      },
    ],
  };

  const GraficoCircularOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          let sum = 0;
          let dataArr = context.chart.data.datasets[0].data;
          dataArr.forEach((data) => {
            sum += data;
          });
          let percentage = ((value * 100) / sum);
          return isNaN(percentage) ? "" : percentage.toFixed(2) + "%";
        },
        color: "#fff",
        anchor: "center",
      },
      legend: {
        position: "left",
      },
      title: {
        display: true,
        text: "",
      },
    },
  };

  const fetchPorcentagemPresenca = useCallback(() => {
    api.professor
      .historicoSemanal(turma, jwt)
      .then((response) => {
        if (response.data && response.data.porcentagem_presenca) {
          setPorcentagemPresenca(parseFloat(response.data.porcentagem_presenca).toFixed(2));
        } else {
          console.error("Não foi possível encontrar 'porcentagem_presenca' nos dados:", response.data);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar a porcentagem de presença:", error);
      });
  }, [turma, jwt]);

  useEffect(() => {
    fetchPorcentagemPresenca();
  }, [fetchPorcentagemPresenca]);

  const diasDaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  const fetchMediaSemanal = useCallback(() => {
    api.professor
      .mediaSemanal(turma, jwt)
      .then((response) => {
        setMediaSemanalData(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar a média semanal:", error);
      });
  }, [turma, jwt]);

  useEffect(() => {
    fetchMediaSemanal();
  }, [fetchMediaSemanal]);

  const GraficoBarraOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          min: 0,
          max: 100,
          stepSize: 10,
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
    plugins: {
      datalabels: {
        formatter: (value) => (value === 100 ? "" : value + "%"),
        color: "#fff",
        anchor: "end",
      },
      legend: {
        display: false,
      },
    },
  };

  const labels = mediaSemanalData.map(item => diasDaSemana[item.dia_semana]);
  const dataValues = mediaSemanalData.map(item => parseFloat(item.porcentagem_presenca));

  const GraficoBarraData = {
    labels: labels,
    datasets: [
      {
        label: "Frequencia",
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

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
                {numAlunosData
                  ? `${presentes || 0}/${totalAlunos}`
                  : "Sem chamada Aberta."}
              </h3>
            </div>
            <div className={styles.graficoCircular}>
              {numAlunosData && (
                <GraficoCircular
                  data={GraficoCircularData}
                  options={GraficoCircularOptions}
                  className={styles.Doughnut}
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
                className={styles.Bar}
              />
            </div>
            <h2>
              Frequencia Semanal: <br />
              {porcentagemPresenca
                ? porcentagemPresenca + "%"
                : "Sem chamada Aberta."}
            </h2>
          </div>
        </div>
      </Fundo>
    </>
  );
}

export default withAuth(withAuthorization(Frequencia, ["Professor"]), ["Professor"]);
