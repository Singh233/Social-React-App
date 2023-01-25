import { Routes, Route, Switch, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { redirect } from "react-router-dom";

import { Home, SignInUp, Settings, UserProfile} from '../pages';
import { Loader, Navbar, SmBottomnNav } from './';
import React from 'react';


function PrivateRoute({ children }) {
  const auth = useAuth();
  return auth ? children : <Navigate to="/login" />;
}

const Page404 = () => {
  return <div style={{color: 'white'}}>404</div>
}

function App() {
  

  
  const auth = useAuth();


  // if (auth.loading) {
  //   return (
  //     <>
  //       <Navbar />
  //       <Loader/>
  //       <SmBottomnNav />
  //     </>
      
  //   )
    
  // }

  if (!auth.loading && auth.user === null) {
    return <SignInUp />;
  }


  return (
    <div className="App">
      <Navbar />
      {auth.loading ?
        <Loader/> :
        <Routes>

        <Route path='/' element={<Home />}/>
        {/* <Route path='/login' element={<SignInUp />}/> */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/:userId"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />


        </Routes>
      }
      
      
      {/* For Small Devices */}
      <SmBottomnNav />
      
    </div>
  );
}

export default App;
