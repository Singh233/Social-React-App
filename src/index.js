import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/css/index.css';
import App from './components/App';
import { BrowserRouter as Router } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import { AuthProvider, PostsProvider } from './providers';
import { GoogleOAuthProvider } from '@react-oauth/google';

import env from './utils/env'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <PostsProvider>
          <GoogleOAuthProvider 
            clientId={env.google_client_id}
            scope="https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
            redirectUri="http://localhost:3000"
            >
            <App />
          </GoogleOAuthProvider>
          
        </PostsProvider>
        
      </AuthProvider>
        
      <Toaster toastOptions={{
        className: 'toast',
        // position: 'bottom-center',
        style: {
          border: '1px solid rgba( 255, 255, 255, 0.18 )',
          backgroundColor: 'rgba(185, 185, 185, 0.202)',
          color: 'white',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',

        },
      }}/>
      
    </Router>
  </React.StrictMode>
);


 