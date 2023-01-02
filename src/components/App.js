import { useEffect } from 'react';
import { getPosts } from '../api';
import { Home } from '../pages';

function App() {
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getPosts();
      console.log('response', response);
    };

    fetchPosts();
  }, []);

  return (
    <div className="App">
      <header className="App-header">Hello world from React!</header>
      <Home />
    </div>
  );
}

export default App;
