import PropTypes, { object } from 'prop-types';

import styles from '../../styles/css/home/main.module.css';
import { motion } from 'framer-motion';

import { onHover } from '../../styles/js/main.js';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreatePost, Post } from '../../components';
import toast from 'react-hot-toast';
import _ from 'lodash';
import { usePosts } from '../../hooks/usePosts';
import React from 'react';
import PostUploadProgress from '../../components/PostUploadProgress.jsx';
import gsap from 'gsap';

const Main = ({ posts }) => {
  const progressContainer = useRef();
  const postsState = usePosts();
  const [isScrollable, setIsScrollable] = useState(true);
  const [showProgressContainer, setShowProgressContainer] = useState(false);
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

  useLayoutEffect(() => {
    // gsap.to(progressContainer.current, {
    //   opacity: 1,
    //   delay: 2,
    // });
    // setTimeout(() => {
    //   setShowProgressContainer(true);
    // }, 1900);
  }, []);

  return (
    <div className={styles.container}>
      <div
        ref={progressContainer}
        style={{
          opacity: 0,
          display: `${showProgressContainer ? 'flex' : 'none'}`,
        }}
      >
        <PostUploadProgress />
      </div>

      <div>
        <CreatePost />
      </div>
      {posts.map((post, index) => {
        return post.isImg || (!post.isImg && post.video) ? (
          <Post post={post} key={`post-${post._id}`} />
        ) : (
          ''
        );
      })}
    </div>
  );
};

Main.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default Main;
