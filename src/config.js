// ngrok or local
const mode = 'ngrok'

const config = {
    local: {
        baseURL: 'http://127.0.0.1:8000/api/',
        headers: {
            'accept': 'application/json',
        },
    },
    ngrok: {
        baseURL: 'https://26cd-140-213-1-226.ngrok-free.app/api/',
        headers: {
            'ngrok-skip-browser-warning': 'true',
            'accept': 'application/json',
        },
    },
}

export default config[mode]
