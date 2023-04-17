
const development = {
    API_URL: 'http://localhost:8000/api/v1/',
    google_client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    file_url: 'http://localhost:8000',
}

const production = {
    API_URL: 'https://sanam.social/api/v1/',
    google_client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    file_url: 'https://sanam.social',
}


export default development;