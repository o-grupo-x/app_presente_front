import React, { useState, useEffect, useCallback } from "react";
import styles from "./style.module.css";
import NavBar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { Fundo } from "@/components/Fundo/fundo";
import { Doughnut, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";
import GraficoBarra from "@/components/GraficoBarra/GraficoBarra";
import api from "@/client/api";
import { sendError } from "next/dist/server/api-utils";
import withAuth from "@/utils/auth";
import { useUser } from "@/contexts/UserContext";
import withAuthorization from '@/utils/withAuthorization';
// import //sendLog from '@/utils/logHelper';

Chart.register(ChartDataLabels);

const Dashboard = () => {
  const { user } = useUser();
  const jwt = user ? user.sub.JWT : null;
  const [selectedOption, setSelectedOption] = useState("");
  const [data, setData] = useState(new Date());
  const [labelGraf, setLabelGraf] = useState(["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]);
  const [barThick, setBarThick] = useState(100);
  const [periodType, setPeriodType] = useState("dia");
  const [turmas, setTurmas] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [mediaAlunosFrequentes, setMediaAlunosFrequentes] = useState([]);
  const [mediaAlunosPresentesAusentes, setMediaAlunosPresentesAusentes] = useState([]);
  const [turmaPresentesAusentes, setTurmaPresentesAusentes] = useState([]);
  const [turmaAtivosInativos, setTurmaAtivosInativos] = useState([]);



  useEffect(() => {
    if (user) {
      // console.log('aqui a porrrrrrrrrrrrrrrrrrrraaaaaaaaaaaaaaaaaaaaaaaaa do user',user.sub.JWT);
      const jwt = user.sub.JWT;
      // //sendLog('JWT token is available for use.', 'debug');
    }
  }, [user,jwt]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setData(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchTurmas = useCallback(() => {
    api.turma.listAll(jwt)
      .then(response => {
        setTurmas(response.data);
        // //sendLog(`Successfully fetched ${response.data.length} turmas.`, 'info');
        // console.log('turmas');
        // console.log(response.data)
      })
      .catch(error => {
        // //sendLog(`Error fetching turmas: ${error}`, 'error');
        // console.error("Erro ao buscar dados da turma:", error);
      });
  }, [jwt]);

  useEffect(() => {
    fetchTurmas(jwt);
  }, [fetchTurmas,jwt]);

  const fetchTurmaPresentesAusentes = useCallback((selectedId) => {
    api.aluno.presentesAusentes(selectedId,jwt)
      .then(response => {
        setTurmaPresentesAusentes(response.data);
        console.log('ausentes presentes');
        console.log(response.data)
      })
      .catch(error => {
        console.error("Erro ao buscar presentes ausentes da turma:", error);
      });
  }, [jwt]);

  
  useEffect(() => {
    fetchTurmaPresentesAusentes(jwt);
  }, [selectedOption,fetchTurmaPresentesAusentes,jwt]);

  const fetchTurmaAtivosInativos = useCallback((selectedId) => {
    api.aluno.ativosInativos(selectedId,jwt)
      .then(response => {
        setTurmaAtivosInativos(response.data);
        console.log('ativos inativos');
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error ao buscar ativos inativos', error)
      })
  }, [jwt]);

  useEffect(() => {
    fetchTurmaPresentesAusentes(jwt);
  }, [selectedOption,fetchTurmaPresentesAusentes,jwt]);

  const fetchMediaAtivosInativos = useCallback((selectedId) => {
    api.aluno.mediaAtivosInativos(selectedId,jwt)
      .then(response => {
        setMediaAlunosFrequentes(response.data.media_alunos_frequentes);
        console.log('media frequentes');
        console.log(response.data.media_alunos_frequentes);
      })
      .catch(error => {
        console.log("Error ao buscar ativos inativos", error);
      })
  }, [jwt]);

  useEffect(() => {
    fetchMediaAtivosInativos();
  }, [fetchMediaAtivosInativos,jwt]);

  const fetchMediaPresentesAusentes = useCallback((selectedId) => {
    api.aluno.mediaPresentesAusentes(selectedId,jwt)
      .then(response => {
        setMediaAlunosPresentesAusentes(response.data.media_alunos_ausentes);
        console.log(response.data);
      })
      .catch(error => {
        console.log("Error ao buscar ativos inativos", error);
      })
  }, [jwt]);

  // useEffect(() => {
  //   fetchMediaPresentesAusentes();
  // }, [fetchMediaPresentesAusentes,jwt]);

  const handleSelectChange = (event) => {
    const selectedId = Number(event.target.value);
    const selectedTurma = turmas.find(turma => turma.Id === selectedId);
    console.log(selectedId)
    console.log(selectedTurma)
    if (selectedTurma) {
      setSelectedOption(selectedId);
      setSelectedName(selectedTurma.Nome);
      fetchTurmaPresentesAusentes(selectedId,jwt);
      fetchTurmaAtivosInativos(selectedId,jwt);
      fetchMediaAtivosInativos(selectedId,jwt);
      fetchMediaPresentesAusentes(selectedId,jwt);
      // //sendLog(`Turma selected: ${selectedTurma.Nome}`, 'info');
    }else {
      // //sendLog('No turma found with the selected ID.', 'warn');
    }

  };


  const [labelControl, setLabelControl] = useState(true);
  const [dataForTheChart, setDataForTheChart] = useState([]);


  let GraficoCircularOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        datalabels: {
            formatter: (value, context) => {
                let sum = context.dataset.data.reduce((acc, data) => acc + data, 0);
                let percentage = ((value * 100) / sum);
                
                if (isNaN(percentage)) {
                    setLabelControl(false);
                    return "Selecione a Turma";
                } else {
                    setLabelControl(true);
                    return percentage.toFixed(2) + "%";
                }
            },
            color: "#fff",
            anchor: "center",
        },
        legend: {
            labels: {
                color: "white",
            },
            position: "right",
            display:labelControl
        },
        title: {
            display: false,
            text: "", 
        },
    },
};

useEffect(() => {
    setLabelControl(true);
}, [dataForTheChart]);

  // const GraficoCircularOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     datalabels: {
  //       formatter: (value, context) => {
  //         let sum = context.dataset.data.reduce((acc, data) => acc + data, 0);
  //         let percentage = ((value * 100) / sum);
  //         console.log(percentage)
  //         if (isNaN(percentage)) {
  //           return "Selecione a Turma";
  //           setLabelControl(false)
  //         } else {
  //           return percentage.toFixed(2) + "%";
  //         }

  //       },
  //       color: "#fff",
  //       anchor: "center",
  //     },
  //     legend: {
  //       labels: {
  //         color: "white",
  //       },
  //       position: "right"
  //     },
  //     title: {
  //       display: labelControl,
  //       text: "",
  //     },
  //   },
  // };

  const GraficoBarraOptions = {
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          if (value === 100) {
            return "";
          } else {
            return value + "%";
          }
        },
        color: "#fff",
        anchor: "end",
      },
      legend: {
        display: false,
      },
    },
  };

  const GraficoCircularDataAlunosAusentes = {
    labels: ["Presentes", "A chegar"],
    datasets: [
      {
        label: "Alunos",
        data:
          [
            turmaPresentesAusentes?.presentes,
            turmaPresentesAusentes?.ausentes
          ],
        //backgroundColor: ["rgba(255, 255, 255, 0.8)", "rgba(255, 159, 64, 0.2)"],
        backgroundColor: ["#748cab", "#1d2d44"],
      },
    ],
  };

  const GraficoCircularDataAlunosAtivos = {
    labels: ["Frequentes", "Ausentes"],
    datasets: [
      {
        label: "Alunos",
        data:
          [
            turmaAtivosInativos?.frequente,
            turmaAtivosInativos?.ausente
          ],
        // backgroundColor: ["rgba(255, 255, 255, 0.8)", "rgba(255, 159, 64, 0.2)"],
        backgroundColor: ["#748cab", "#1d2d44"],
      },
    ],
  };

  const GraficoBarraDataAtivos = {
    labels: labelGraf,
    datasets: [
      {
        label: "Frequencia",
        data: [mediaAlunosFrequentes],
        backgroundColor: "rgba(201, 203, 207, 0.2)",
        borderColor: "rgb(201, 203, 207)",
        borderWidth: 1,
        barThickness: barThick,
      },
    ],
  };

  const GraficoBarraDataAusentes = {
    labels: labelGraf,
    datasets: [
      {
        label: "Frequencia",
        data: [mediaAlunosPresentesAusentes],
        backgroundColor: "rgba(201, 203, 207, 0.2)",
        borderColor: "rgb(201, 203, 207)",
        borderWidth: 1,
        barThickness: barThick,
      },
    ],
  };

  const handlePeriodButtonClick = (period) => {
    setPeriodType(period);
    if (period === "dia") {
      setLabelGraf(["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]);
      setBarThick(100);
      // Atualize os dados do gráfico para o período "dia"
    } else if (period === "semana") {
      setLabelGraf(["1", "2", "3", "4", "5"]);
      setBarThick(100);
      // Atualize os dados do gráfico para o período "semana"
    } else if (period === "mes") {
      setLabelGraf(["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]);
      setBarThick(55);
      // Atualize os dados do gráfico para o período "mês"
    }
  };

  return (
    <>
      <NavBar />
      <Cabecalho />
      <Fundo className={styles.Fundo}>
        <section className={styles.content}>
          <div className={styles.contentHeader}>
            <div>
              {/* <div>{data.toLocaleString()}</div> */}
              <div>Turma selecionado:{selectedName}</div>
            </div>
            <div className={styles.selectCursos}>
              <select id="cursos" value={selectedOption} onChange={handleSelectChange}>
                <option value="" disabled hidden>
                  Filtrar /turma
                </option>
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
            {turmaPresentesAusentes ? (
              <div className={styles.grafico}>
                <GraficoCircular
                  data={GraficoCircularDataAlunosAusentes}
                  options={GraficoCircularOptions} //grafico ativo inativo
                  className={styles.Doughnut}
                />
              </div>
            ) : (
              <h1>N</h1>
            )}
          </div>

          <div className={styles.a}>
            {turmaPresentesAusentes ? (
              <div className={styles.grafico}>
                <GraficoCircular
                  data={GraficoCircularDataAlunosAtivos}
                  options={GraficoCircularOptions} //grafico ativo inativo
                  className={styles.Doughnut}
                />
              </div>
            ) : (
              <h1>N</h1>
            )}

          </div>

        </section>

        <section className={styles.content}>
          <div className={styles.contentHeaderBar}>
            <div className={styles.contentHeaderBarTitle}>
              <p>Media de alunos frequentes</p>
              {/* <div>
                <button type="button" onClick={() => handlePeriodButtonClick("dia")}>Dia</button>
                <button type="button" onClick={() => handlePeriodButtonClick("semana")}>Semana</button>
                <button type="button" onClick={() => handlePeriodButtonClick("mes")}>Mês</button>
              </div> */}
              <div>
                <div>Turma selecionado:{selectedName}</div>
              </div>
            </div>
            <div>
              <div className={styles.selectCursos}>
                <select id="cursos-alunos-ativos" value={selectedOption} onChange={handleSelectChange}>
                  <option value="" disabled hidden>
                    Filtrar /cursos
                  </option>
                  {turmas.map((turma) => (
                    <option key={turma.Id} value={turma.Id}>
                      {turma.Nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.graficoBarContent}>
          <div className={styles.graficoBar}>
            <GraficoBarra
              data={GraficoBarraDataAtivos}
              options={GraficoBarraOptions}
              className={styles.Bar}
            />
          </div>
        </section>
        <section className={styles.content}>
          <div className={styles.contentHeaderBar}>
            <div className={styles.contentHeaderBarTitle}>
              <p>Media de alunos ausentes</p>
              {/* <div>
                <button type="button" onClick={() => handlePeriodButtonClick("dia")}>Dia</button>
                <button type="button" onClick={() => handlePeriodButtonClick("semana")}>Semana</button>
                <button type="button" onClick={() => handlePeriodButtonClick("mes")}>Mês</button>
              </div> */}
              <div>
                <div>Turma selecionado:{selectedName}</div>
              </div>
            </div>
            <div>
              <div className={styles.selectCursos}>
                <select id="cursos-alunos-ausentes" value={selectedOption} onChange={handleSelectChange}>
                  <option value="" disabled hidden>
                    Filtrar /cursos
                  </option>
                  {turmas.map((turma) => (
                    <option key={turma.Id} value={turma.Id}>
                      {turma.Nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.graficoBarContent}>
          <div className={styles.graficoBar}>
            <GraficoBarra
              data={GraficoBarraDataAusentes}
              options={GraficoBarraOptions}
              className={styles.Bar}
            />
          </div>
        </section>
      </Fundo>
    </>
  );

}

// export default (Dashboard);
export default withAuth(withAuthorization(Dashboard,["Secretaria"]),['Secretaria']);

