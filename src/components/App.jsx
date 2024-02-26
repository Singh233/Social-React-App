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
import LeftNav from '../pages/home/LeftNav.jsx';
import SinglePost from '../pages/SinglePost.jsx';
import EditProfile from '../pages/EditProfile.jsx';

function PrivateRoute({ children }) {
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
        <>
          {auth.user ? (
            <>
              {' '}
              <Navbar /> <LeftNav />{' '}
            </>
          ) : (
            ''
          )}
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                  <SmBottomnNav />
                </PrivateRoute>
              }
            />
            {/* <Route path="/" element={<Home />} /> */}

            <Route path="/login" element={<SignInUp />} />

            {
              /* For small devices */
              window.innerWidth < 768 ? (
                <>
                  <Route
                    path="/messages"
                    element={
                      <PrivateRoute>
                        <Messaging />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/search"
                    element={
                      <PrivateRoute>
                        <Search />
                        <SmBottomnNav />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/upload"
                    element={
                      <PrivateRoute>
                        <SmCreatePost />
                        <SmBottomnNav />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/edit-profile"
                    element={
                      <PrivateRoute>
                        <EditProfile />
                        <SmBottomnNav />
                      </PrivateRoute>
                    }
                  />
                </>
              ) : (
                ''
              )
            }

            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                  <SmBottomnNav />
                </PrivateRoute>
              }
            />

            <Route
              path="/posts/post/:postId"
              element={
                <PrivateRoute>
                  <SinglePost />
                  <SmBottomnNav />
                </PrivateRoute>
              }
            />

            <Route
              path="/users/profile/:userId"
              element={
                <PrivateRoute>
                  <UserProfile />
                  <SmBottomnNav />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Home />
                  <SmBottomnNav />
                </PrivateRoute>
              }
            />
          </Routes>
          {/* handle 404 route */}
        </>
      )}
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
