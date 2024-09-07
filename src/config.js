// ngrok or local
const mode = 'ngrok',
    backendUrl = 'https://api.antekhub.com'

const config = {
    local: {
        baseURL: 'http://127.0.0.1:8000/api/',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Controll-Allow-Credentials': 'true',
            // 'accept': 'application/json',
        },
    },
    ngrok: {
        baseURL: `${backendUrl}/api/`,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Controll-Allow-Credentials': 'true',
            'ngrok-skip-browser-warning': 'true',
            // 'accept': 'application/json',
        },
    },
}

export default config[mode]
