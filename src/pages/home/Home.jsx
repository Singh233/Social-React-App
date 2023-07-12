import PropTypes from 'prop-types';

import { Loader } from '../../components';

import styles from '../../styles/css/home/home.module.css';
import LeftNav from './LeftNav';
import RightNav from './RightNav';
import Main from './Main';
import { useAuth, usePosts } from '../../hooks';
import LoadingBar from 'react-top-loading-bar';
import Chat from '../../components/Chat';

import socketIo from 'socket.io-client';

import env from '../../utils/env';

const Home = () => {
  const auth = useAuth();
  const posts = usePosts();

  if (posts.loading) {
    return <Loader />;
  }

  return (
    <div className={styles.homeContainer}>
      {auth.loading ? '' : <LoadingBar color="#f11946" progress="100" />}

      <LeftNav />

      <Main posts={posts.posts} />

      <RightNav />
    </div>
  );
};

export default Home;
