import { useEffect, useState } from 'react';
import { Routes, Route, Switch } from 'react-router-dom';
import { getPosts } from '../api';

import { Home, Login } from '../pages';
import { Loader, Navbar } from './';


const Page404 = () => {
  return <div style={{color: 'white'}}>404</div>
}

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getPosts();
      console.log('response', response);

      if (response.success) {
        setPosts(response.data.posts);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="App">
      <Navbar />
      <Routes>

        <Route path='/' element={<Home posts={posts} />}/>
        <Route path='/login' element={<Login posts={posts} />}/>
        <Route element={<Login />} />

      </Routes>
      
    </div>
  );
}

export default App;
