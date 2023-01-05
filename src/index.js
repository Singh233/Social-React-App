import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/css/index.css';
import App from './components/App';
import { BrowserRouter as Router } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>

        <App />
        <Toaster toastOptions={{
          className: '',
          style: {
            border: '1px solid rgba( 255, 255, 255, 0.18 )',
            backgroundColor: 'rgba(185, 185, 185, 0.202)',
            color: 'white',
            backdropFilter: 'blur(12px)'
          },
        }}/>
      
    </Router>
  </React.StrictMode>
);


 