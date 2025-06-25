
import axios from "axios";

// const backend = "https://api.odeiojava.com.br";
const backend = "http://app-presente-back-service.app-chamada-production.svc.cluster.local:8000/api";

const httpClient = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_BACK
  baseURL: "/api",
});

const api = {
  aluno: {
    findById: (id) => httpClient.get("/aluno", id),
    listAll: (jwt) =>
      httpClient.get("/aluno/listAll", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    create: (alunoData) => httpClient.post("/aluno", alunoData),
    update: (id, alunoData) => httpClient.put("/aluno", id, alunoData),
    delete: (id) => httpClient.delete("/aluno", id),
    findChamadaByAluno: (id_aluno, jwt) =>
      httpClient.get(`/aluno/HistoricoPresenca?id_aluno=` + id_aluno, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    presencasFaltas: (id_aluno, jwt) =>
      httpClient.get(`/aluno/PresencaFalta?id_aluno=` + id_aluno, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    chamadasAbertas: (id_aluno, jwt) =>
      httpClient.get(`/chamada/aluno?id=` + id_aluno, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    presenca: (body) => httpClient.post("/presenca/ra", body),
    presencaAluno: (body, jwt) =>
      httpClient.post("/presenca", body, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    presentesAusentes: (id_turma, jwt) =>
      httpClient.get(`/aluno/AusentesPresentes?id_turma=` + id_turma, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    ativosInativos: (id_turma, jwt) =>
      httpClient.get(`/aluno/AtivoInativo?id_turma=` + id_turma, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    mediaAtivosInativos: (id_turma,jwt) =>
      httpClient.get(`/aluno/mediaAtivo?id_turma=` + id_turma,{
         headers: {
            Authorization: `Bearer ${jwt}`,
          },
      }),
    mediaPresentesAusentes: (id_turma, jwt) =>
      httpClient.get(`/aluno/mediaAusente?id_turma=` + id_turma, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    statusAluno: (idAluno, jwt) =>
      httpClient.get("/aluno/alunoStatus?id_aluno=" + idAluno, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    fetchLembretes: (cargo, idAluno,jwt) => httpClient.get(`/lembrete/findLembrete?cargo=${cargo}&id=${idAluno}`,{
      headers: { 
         'Authorization': `Bearer ${jwt}`
     }
    }),
    vizualizar: (idLembrete) => httpClient.put("/lembrete/visualizado?id=" + idLembrete),
  },
  lembrete:{
   listAll: (jwt) => httpClient.get('/lembrete/listAll',{
      headers: { 
         'Authorization': `Bearer ${jwt}`
     }
   }),
   FindById: (id,jwt) => httpClient.get('/lembrete?id='+ id,{
    headers: { 
       'Authorization': `Bearer ${jwt}`
   }
 }),
  },
  admin: {
    findByAusentes: (id_turma) => httpClient.get(`/aluno/AusentesPresentes?id_turma=` + id_turma),
    lembrete: (payload, jwt) =>httpClient.post("/lembrete", payload, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
  },
  chamada: {
    findById: (id) => httpClient.get("/chamada", id),
    listAll: (jwt) =>
      httpClient.get("/chamada/listAll", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    create: (chamada,jwt) =>
      httpClient.post("/chamada", chamada, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    update: (id, chamaData) => httpClient.put("/chamada", id, chamaData),
    delete: (id) => httpClient.delete(`/chamada?id=${id}`, id),
    fecharChamada: (idChamada, jwt) =>
    httpClient.put("/chamada/fecharChamada?id=" + idChamada, jwt, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
   }),
    obterUltimaChamada: (idProfessor) =>
      httpClient.get("/chamada/ultimaChamada?id=" + idProfessor),
  },
  configuracao: {
    findById: (id) => httpClient.get("/configuracao", id),
    listAll: () => httpClient.get("/configuracao/listAll"),
    create: (configuracaoData) =>
      httpClient.post("/configuracao", configuracaoData),
    update: (id, configuracaoData) =>
      httpClient.put("/configuracao/", id, configuracaoData),
    delete: (id) => httpClient.delete("/configuracao/", id),
  },
  presenca: {
    findById: (id) => httpClient.get("/presenca", id),
    listAll: () => httpClient.get("/presenca/listAll"),
    create: (presencaData) => httpClient.post("/presenca", presencaData),
    update: (id, presencaData) =>
      httpClient.put("/presenca", id, presencaData),
    delete: (id) => httpClient.delete("/presenca", id),
    findByPresentes: () => httpClient.get("/presenca/findByPresentes"),
  },
  professor: {
    findById: (id) => httpClient.get("/professor", id),
    listAll: (jwt) =>
      httpClient.get("/professor/listAll", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    create: (professorData) => httpClient.post("/professor", professorData),
    update: (id, professorData) =>
      httpClient.put("/professor", id, professorData),
    delete: (id) => httpClient.delete("/professor", id),
    frequencia: (idProfessor, idChamada, jwt) =>
      httpClient.get(
        `api/professor/numAlunos?id_professor=${idProfessor}&id_chamada=${idChamada}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      ),
    historicoSemanal: (idProfessor, jwt) =>
      httpClient.get("/professor/historicoSemanal?id=" + idProfessor, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    mediaSemanal: (media, jwt) =>
      httpClient.get("/professor/mediaSemanal?id=" + media, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    turmas: (idProfessor, jwt) =>
      httpClient.get("/professor/listarTurmas?id=" + idProfessor, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    chamadasAbertas: (idProfessor, jwt) =>
      httpClient.get("/chamada/listAllprofessor?id=" + idProfessor, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    presenca: (body, jwt) =>
      httpClient.post("/presenca/ra", body, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
  },
  projeto: {
    findById: (id) => httpClient.get("/projeto", id),
    listAll: () => httpClient.get("/projeto/listAll"),
    create: (projetoData) => httpClient.post("/projeto", projetoData),
    update: (id, projetoData) =>
      httpClient.put("/projeto", id, projetoData),
    delete: (id) => httpClient.delete("/projeto", id),
  },
  turma: {
    findById: (id) => httpClient.get("/turma", id),
    listAll: (jwt) =>
      httpClient.get("/turma/listAll", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    create: (turmaData, jwt) =>
      httpClient.post("/turma", turmaData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    update: (id, turmaData) => httpClient.put("/turma", id, turmaData),
    delete: (id) => httpClient.delete("/turma", id),
    professorNaTurma: (payload,jwt) =>
      httpClient.post("/turma/cadastrarProfessor", payload,{
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    alunoNaTurma: (payload, jwt) =>
      httpClient.post("/turma/cadastrarAluno",payload, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
  },
  materia: {
    create: (payload, jwt) =>
      httpClient.post("/materia", payload, {  
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    listAll: (jwt) =>
      httpClient.get("/materia/listAll", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
  },
  usuario: {
    create: (payload, jwt) =>
      httpClient.post("/usuario", payload, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    login: (payload) => httpClient.post("/login", payload , {
    }),
    sendLog: (message, level, config) => {
      return httpClient.post("/log", { message, level }, config);
    },
    logout: (jwt) => httpClient.post("/logout", {}, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }),
  },
  health: () =>
    httpClient.get("/health").then((response) => {
      if (response.status === 200) {
        return { status: "healthy" };
      }
      throw new Error("Backend unhealthy");
    }).catch((error) => {
      throw new Error(`Health check failed: ${error.message}`);
    }),
};

export default api;
