//
const development = {
  API_URL: 'http://localhost:8000/api/v1/',
  google_client_id: process.env.VITE_GOOGLE_CLIENT_ID,
  file_url: 'http://localhost:8000',
  socket_url: 'https://localhost:4000',
  peer: {
    config: {
      iceServers: [
        {
          urls: import.meta.env.VITE_STUN_URLS,
        },
        {
          urls: import.meta.env.VITE_TURN1_URLS,
          username: import.meta.env.VITE_TURN1_USERNAME,
          credential: import.meta.env.VITE_TURN1_CREDENTIAL,
        },
        {
          urls: import.meta.env.VITE_TURN2_URLS,
          username: import.meta.env.VITE_TURN2_USERNAME,
          credential: import.meta.env.VITE_TURN2_CREDENTIAL,
        },
        {
          urls: import.meta.env.VITE_TURN3_URLS,
          username: import.meta.env.VITE_TURN3_USERNAME,
          credential: import.meta.env.VITE_TURN3_CREDENTIAL,
        },
        {
          urls: import.meta.env.VITE_TURN4_URLS,
          username: import.meta.env.VITE_TURN4_USERNAME,
          credential: import.meta.env.VITE_TURN4_CREDENTIAL,
        },
      ],
    },
  },
};

const production = {
  API_URL: 'https://sanam.social/api/v1',
  google_client_id: process.env.VITE_GOOGLE_CLIENT_ID,
  file_url: 'https://sanam.social',
  socket_url: 'https://sanam.social',
  peer: {
    config: {
      iceServers: [
        {
          urls: import.meta.env.VITE_STUN_URLS,
        },
        {
          urls: import.meta.env.VITE_TURN1_URLS,
          username: import.meta.env.VITE_TURN1_USERNAME,
          credential: import.meta.env.VITE_TURN1_CREDENTIAL,
        },
        {
          urls: import.meta.env.VITE_TURN2_URLS,
          username: import.meta.env.VITE_TURN2_USERNAME,
          credential: import.meta.env.VITE_TURN2_CREDENTIAL,
        },
        {
          urls: import.meta.env.VITE_TURN3_URLS,
          username: import.meta.env.VITE_TURN3_USERNAME,
          credential: import.meta.env.VITE_TURN3_CREDENTIAL,
        },
        {
          urls: import.meta.env.VITE_TURN4_URLS,
          username: import.meta.env.VITE_TURN4_USERNAME,
          credential: import.meta.env.VITE_TURN4_CREDENTIAL,
        },
      ],
    },
  },
};

export default production;
