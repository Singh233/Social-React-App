import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/css/index.css';
import App from './components/App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider, PostsProvider } from './providers';
import { GoogleOAuthProvider } from '@react-oauth/google';

import env from './utils/env';
import { VideoProvider } from './providers/VideoProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PostsProvider>
            <VideoProvider>
              <GoogleOAuthProvider
                clientId={env.google_client_id}
                scope="https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
              >
                <App />
              </GoogleOAuthProvider>
            </VideoProvider>
          </PostsProvider>
        </AuthProvider>
      </QueryClientProvider>
      <Toaster
        position="top-center"
        richColors={true}
        theme={'dark'}
        toastOptions={{
          closeButton: true,
        }}
      />

      {/* <Toaster
        toastOptions={{
          className: 'toast',
          // position: 'bottom-center',
          style: {
            border: '1px solid rgba( 255, 255, 255, 0.18 )',
            backgroundColor: 'rgba(185, 185, 185, 0.202)',
            color: 'white',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          },
        }}
      /> */}
    </Router>
  </React.StrictMode>
);
