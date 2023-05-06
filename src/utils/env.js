// 
const development = {
    API_URL: 'http://localhost:8000/api/v1/',
    google_client_id: process.env.VITE_GOOGLE_CLIENT_ID,
    file_url: 'http://localhost:8000',
    socket_url: 'http://localhost:4000',
}

const production = {
    // API_URL: 'https://social-api-taxhp.ondigitalocean.app/api/v1',
    API_URL: 'https://sanam.social/api/v1',
    google_client_id: process.env.VITE_GOOGLE_CLIENT_ID,
    file_url: 'https://sanam.social',
    socket_url: 'https://sanam.social',
}


export default production;