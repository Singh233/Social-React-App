import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { redirect } from 'react-router-dom';

import { Home, SignInUp, Settings, UserProfile } from '../pages';
import { Loader, Navbar, SmBottomnNav } from './';
import React, { useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import {
  getItemInLocalStorage,
  LOCALSTORAGE_TOKEN_KEY,
  removeItemInLocalStorage,
} from '../utils';
import Messaging from '../pages/Messaging';
import socketIo from 'socket.io-client';
import env from '../utils/env';
import Search from '../pages/Search';
import SmCreatePost from '../pages/SmCreatePost';

function PrivateRoute({ children }) {
  const auth = useAuth();
  return getItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY) ? (
    children
  ) : (
    <Navigate to="/login" />
  );
}

const Page404 = () => {
  return <div style={{ color: 'white' }}>404</div>;
};

function App() {
  const [progress, setProgress] = useState(0);
  // removeItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY);

  const auth = useAuth();
  let socket = null;

  if (auth.user) {
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

          {/* For small devices */}
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Search />
                <SmBottomnNav />
              </PrivateRoute>
            }
          />

          {/* For small devices */}
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <Navbar />
                <SmCreatePost />
                <SmBottomnNav />
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

// console the developer info
console.log(
  "%c Hey! it's Sanambir Singh,",
  'color : #00000; font-size : 1rem; font-weight : bold;'
);
console.log(
  '%c Passionate Software engineer from India.',
  'color : #00000; font-size : 0.8rem; font-weight : bold;'
);
console.log(
  '%c React me at sanambir123@gmail.com',
  'color : #00000; font-size : 0.8rem;'
);