
import axios from "axios";

const backend = "https://api.odeiojava.com.br";

const httpClient = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_BACK
  baseURL: backend,
});

const api = {
  aluno: {
    findById: (id) => httpClient.get("/api/aluno", id),
    listAll: (jwt) =>
      httpClient.get("/api/aluno/listAll", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    create: (alunoData) => httpClient.post("/api/aluno", alunoData),
    update: (id, alunoData) => httpClient.put("/api/aluno", id, alunoData),
    delete: (id) => httpClient.delete("/api/aluno", id),
    findChamadaByAluno: (id_aluno, jwt) =>
      httpClient.get(`/api/aluno/HistoricoPresenca?id_aluno=` + id_aluno, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    presencasFaltas: (id_aluno, jwt) =>
      httpClient.get(`/api/aluno/PresencaFalta?id_aluno=` + id_aluno, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    chamadasAbertas: (id_aluno, jwt) =>
      httpClient.get(`/api/chamada/aluno?id=` + id_aluno, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    presenca: (body) => httpClient.post("/api/presenca/ra", body),
    presencaAluno: (body, jwt) =>
      httpClient.post("/api/presenca", body, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    presentesAusentes: (id_turma, jwt) =>
      httpClient.get(`/api/aluno/AusentesPresentes?id_turma=` + id_turma, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    ativosInativos: (id_turma, jwt) =>
      httpClient.get(`/api/aluno/AtivoInativo?id_turma=` + id_turma, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    mediaAtivosInativos: (id_turma,jwt) =>
      httpClient.get(`/api/aluno/mediaAtivo?id_turma=` + id_turma,{
         headers: {
            Authorization: `Bearer ${jwt}`,
          },
      }),
    mediaPresentesAusentes: (id_turma, jwt) =>
      httpClient.get(`/api/aluno/mediaAusente?id_turma=` + id_turma, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    statusAluno: (idAluno, jwt) =>
      httpClient.get("/api/aluno/alunoStatus?id_aluno=" + idAluno, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    fetchLembretes: (cargo, idAluno,jwt) => httpClient.get(`/api/lembrete/findLembrete?cargo=${cargo}&id=${idAluno}`,{
      headers: { 
         'Authorization': `Bearer ${jwt}`
     }
    }),
    vizualizar: (idLembrete) => httpClient.put("/api/lembrete/visualizado?id=" + idLembrete),
  },
  lembrete:{
   listAll: (jwt) => httpClient.get('/api/lembrete/listAll',{
      headers: { 
         'Authorization': `Bearer ${jwt}`
     }
   }),
   FindById: (id,jwt) => httpClient.get('/api/lembrete?id='+ id,{
    headers: { 
       'Authorization': `Bearer ${jwt}`
   }
 }),
  },
  admin: {
    findByAusentes: (id_turma) => httpClient.get(`/api/aluno/AusentesPresentes?id_turma=` + id_turma),
    lembrete: (payload, jwt) =>httpClient.post("/api/lembrete", payload, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
  },
  chamada: {
    findById: (id) => httpClient.get("api/chamada", id),
    listAll: (jwt) =>
      httpClient.get("/api/chamada/listAll", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    create: (chamada,jwt) =>
      httpClient.post("/api/chamada", chamada, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    update: (id, chamaData) => httpClient.put("/api/chamada", id, chamaData),
    delete: (id) => httpClient.delete(`/api/chamada?id=${id}`, id),
    fecharChamada: (idChamada, jwt) =>
    httpClient.put("/api/chamada/fecharChamada?id=" + idChamada, jwt, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
   }),
    obterUltimaChamada: (idProfessor) =>
      httpClient.get("/api/chamada/ultimaChamada?id=" + idProfessor),
  },
  configuracao: {
    findById: (id) => httpClient.get("api/configuracao", id),
    listAll: () => httpClient.get("api/configuracao/listAll"),
    create: (configuracaoData) =>
      httpClient.post("/api/configuracao", configuracaoData),
    update: (id, configuracaoData) =>
      httpClient.put("/api/configuracao/", id, configuracaoData),
    delete: (id) => httpClient.delete("/api/configuracao/", id),
  },
  presenca: {
    findById: (id) => httpClient.get("api/presenca", id),
    listAll: () => httpClient.get("api/presenca/listAll"),
    create: (presencaData) => httpClient.post("/api/presenca", presencaData),
    update: (id, presencaData) =>
      httpClient.put("/api/presenca", id, presencaData),
    delete: (id) => httpClient.delete("/api/presenca", id),
    findByPresentes: () => httpClient.get("api/presenca/findByPresentes"),
  },
  professor: {
    findById: (id) => httpClient.get("api/professor", id),
    listAll: (jwt) =>
      httpClient.get("api/professor/listAll", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    create: (professorData) => httpClient.post("/api/professor", professorData),
    update: (id, professorData) =>
      httpClient.put("/api/professor", id, professorData),
    delete: (id) => httpClient.delete("/api/professor", id),
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
      httpClient.get("/api/professor/historicoSemanal?id=" + idProfessor, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    mediaSemanal: (media, jwt) =>
      httpClient.get("/api/professor/mediaSemanal?id=" + media, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    turmas: (idProfessor, jwt) =>
      httpClient.get("/api/professor/listarTurmas?id=" + idProfessor, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    chamadasAbertas: (idProfessor, jwt) =>
      httpClient.get("/api/chamada/listAllprofessor?id=" + idProfessor, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    presenca: (body, jwt) =>
      httpClient.post("/api/presenca/ra", body, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
  },
  projeto: {
    findById: (id) => httpClient.get("api/projeto", id),
    listAll: () => httpClient.get("api/projeto/listAll"),
    create: (projetoData) => httpClient.post("/api/projeto", projetoData),
    update: (id, projetoData) =>
      httpClient.put("/api/projeto", id, projetoData),
    delete: (id) => httpClient.delete("/api/projeto", id),
  },
  turma: {
    findById: (id) => httpClient.get("api/turma", id),
    listAll: (jwt) =>
      httpClient.get("api/turma/listAll", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    create: (turmaData, jwt) =>
      httpClient.post("/api/turma", turmaData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    update: (id, turmaData) => httpClient.put("/api/turma", id, turmaData),
    delete: (id) => httpClient.delete("/api/turma", id),
    professorNaTurma: (payload,jwt) =>
      httpClient.post("/api/turma/cadastrarProfessor", payload,{
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    alunoNaTurma: (payload, jwt) =>
      httpClient.post("/api/turma/cadastrarAluno",payload, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
  },
  materia: {
    create: (payload, jwt) =>
      httpClient.post("/api/materia", payload, {  
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    listAll: (jwt) =>
      httpClient.get("/api/materia/listAll", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
  },
  usuario: {
    create: (payload, jwt) =>
      httpClient.post("api/usuario", payload, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
    login: (payload) => httpClient.post("/api/login", payload , {
    }),
    sendLog: (message, level, config) => {
      return httpClient.post("/api/log", { message, level }, config);
    },
    logout: (jwt) => httpClient.post("/api/logout", {}, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }),
  },
};

export default api;
