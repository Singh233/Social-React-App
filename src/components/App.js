import { Routes, Route, Switch, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { redirect } from 'react-router-dom';

import { Home, SignInUp, Settings, UserProfile } from '../pages';
import { Loader, Navbar, SmBottomnNav } from './';
import React, { useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { getItemInLocalStorage, LOCALSTORAGE_TOKEN_KEY, removeItemInLocalStorage } from '../utils';
import Messaging from '../pages/Messaging';
import socketIo from 'socket.io-client';

function PrivateRoute({ children }) {
  const auth = useAuth();
  return getItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY) ? children : <Navigate to="/login" />;
}

const Page404 = () => {
  return <div style={{ color: 'white' }}>404</div>;
};

function App() {
  const [progress, setProgress] = useState(0);
  // removeItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY);

  const auth = useAuth();

  if (auth.user) {
    const socket = socketIo.connect('https://sanam.social')
    // console.log(socket)
  }

  // if (auth.loading) {
  //   return (
  //     <>
  //       <Navbar />
  //       <Loader/>
  //       <SmBottomnNav />
  //     </>

  //   )

  // }

  // if (!auth.loading && auth.user === null) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <div className="App">
      
      <LoadingBar color="#f11946" progress="100" />
      {auth.loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Navbar />
                <Home />
                <SmBottomnNav />
              </PrivateRoute>
            }
          />
          {/* <Route path="/" element={<Home />} /> */}

          <Route path="/login" element={<SignInUp />} />


          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Messaging />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Navbar />
                <Settings />
                <SmBottomnNav />
              </PrivateRoute>
            }
          />

          <Route
            path="/users/profile/:userId"
            element={
              <PrivateRoute>
                <Navbar />
                <UserProfile />
                <SmBottomnNav />
              </PrivateRoute>
            }
          />
        </Routes>
      )}

      {/* For Small Devices */}
      
    </div>
  );
}

export default App;
