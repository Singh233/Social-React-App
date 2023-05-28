import PropTypes from 'prop-types';

import styles from '../../styles/css/home/main.module.css';

import { onHover } from '../../styles/js/main.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreatePost, Post } from '../../components';
import toast from 'react-hot-toast';
import { usePosts } from '../../hooks';
import _ from 'lodash';

const Main = ({ posts }) => {
  const postsState = usePosts();
  const [isScrollable, setIsScrollable] = useState(true);

  window.onscroll = async (event) => {
    if (!isScrollable) return;
    // Check if the user is 200 pixels away from the bottom of the page
    if (
      window.innerHeight + window.pageYOffset >=
        document.body.scrollHeight - 200 ||
      (window.innerWidth <= 480 &&
        window.innerHeight + window.pageYOffset >=
          document.body.scrollHeight - 900)
    ) {
      setIsScrollable(false);
      const offset = postsState.posts.length;
      const throttle = _.throttle(async () => {
        await postsState.lazyLoadPosts();
        setIsScrollable(true);
      }, 500);
      throttle();
    }
  };

  return (
    <div className={styles.container}>
      <CreatePost />
      {posts.map((post, index) => (
        <Post post={post} key={`post-${post._id}`} />
      ))}
    </div>
  );
};

Main.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default Main;
