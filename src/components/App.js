import { Routes, Route, Switch } from 'react-router-dom';
import { useAuth } from '../hooks';

import { Home, Login, Register } from '../pages';
import { Loader, Navbar } from './';


const Page404 = () => {
  return <div style={{color: 'white'}}>404</div>
}

function App() {
  
  const auth = useAuth();


  if (auth.loading) {
    return <Loader/>
  }

  return (
    <div className="App">
      <Navbar />
      <Routes>

        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login  />}/>
        <Route path='/register' element={<Register  />}/>
        <Route element={<Login />} />

      </Routes>
      
    </div>
  );
}

export default App;
