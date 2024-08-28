// ngrok or local
const mode = 'local',
    backendUrl = 'https://10c5-125-162-212-218.ngrok-free.app'

const config = {
    local: {
        baseURL: 'http://127.0.0.1:8000/api/',
        headers: {
            'Access-Control-Allow-Origin': '*',
            // 'accept': 'application/json',
        },
    },
    ngrok: {
        baseURL: `${backendUrl}/api/`,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
            // 'accept': 'application/json',
        },
    },
}

export default config[mode]
