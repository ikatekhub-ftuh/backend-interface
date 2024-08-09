// ngrok or local
const mode = 'ngrok',
    backendUrl = 'https://10c5-125-162-212-218.ngrok-free.app'

const config = {
    local: {
        baseURL: 'http://127.0.0.1:8000/api/',
        headers: {
            // 'accept': 'application/json',
        },
    },
    ngrok: {
        baseURL: `${backendUrl}/api/`,
        headers: {  
            'ngrok-skip-browser-warning': 'true',
            // 'accept': 'application/json',
        },
    },
}

export default config[mode]
