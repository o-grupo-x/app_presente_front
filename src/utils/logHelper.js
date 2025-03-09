import api from "@/client/api";

// Remove the extra "function" keyword and uncomment the function name
function sendLog(message, level) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Remove extra slashes from function call
    api.usuario.sendLog(message, level, config)
        .then(response => {
            console.log('Log sent: ', response.data);
        })
        .catch(error => {
            console.error('Error sending log:', error);
        });
}

export default sendLog;