import api from "@/client/api";

function //sendLog(message, level) {
    // Construa a configuração de headers diretamente aqui, se necessário
    const config = {
      headers: {
        'Content-Type': 'application/json'  // Isto é redundante se já configurado globalmente no axios
      }
    };

    // Passa a configuração como argumento para a função //sendLog
    api.usuario.//sendLog(message, level, config)
      .then(response => {
          console.log('Log sent: ', response.data);
      })
      .catch(error => {
          console.error('Error sending log:', error);
      });
}

export default //sendLog;
