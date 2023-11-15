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
import { useAuth } from '../../hooks/useAuth.jsx';

const Main = ({ posts }) => {
  const { socket, updateUserPosts } = useAuth();
  const { addPostToState, isVideoProcessing, setIsVideoProcessing } =
    usePosts();
  const progressContainer = useRef();
  const postsState = usePosts();
  const [isScrollable, setIsScrollable] = useState(true);
  const [showProgressContainer, setShowProgressContainer] = useState(false);
  const [encodingProgress, setEncodingProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const isVideoEncoding = useRef(false);

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

  useEffect(() => {
    socket.off('video-progress');
    socket.on('video-progress', function (data) {
      if (!isVideoProcessing) {
        setIsVideoProcessing(true);
      }
      if (!showProgressContainer) {
        setShowProgressContainer(true);
      }
      const { title } = JSON.parse(
        localStorage.getItem('video_encoding_progress')
      );
      setEncodingProgress(data.progress);
      setFileName(title);
      const lsData = {
        title: title,
        progress: data.progress,
      };
      localStorage.setItem('video_encoding_progress', JSON.stringify(lsData));
    });

    socket.off('video-encoding-failed');
    socket.on('video-encoding-failed', function (data) {
      setIsVideoProcessing(false);
      localStorage.removeItem('video_encoding_progress');
      toast.error('Video encoding failed!');

      gsap.to(progressContainer.current, {
        opacity: 0,
        onComplete: () => {
          setShowProgressContainer(false);
        },
      });
    });

    socket.off('video-encoding-complete');
    socket.on('video-encoding-complete', function (data) {
      localStorage.removeItem('video_encoding_progress');
      setIsVideoProcessing(false);

      toast.success('Video is processed!');
      gsap.to(progressContainer.current, {
        opacity: 0,
        onComplete: () => {
          setShowProgressContainer(false);
          updateUserPosts(true, data.post);
          setTimeout(() => {
            addPostToState(data.post);
          }, 500);
        },
      });
    });
  }, [socket, socket.connected]);

  useEffect(() => {
    if (isVideoEncoding.current) {
      setShowProgressContainer(true);
      updateEncodingInfo();
    }
  }, [isVideoEncoding.current]);

  useLayoutEffect(() => {
    if (showProgressContainer) {
      updateEncodingInfo();
      gsap.to(progressContainer.current, {
        opacity: 1,
      });
    }
    if (isVideoProcessing) {
      setShowProgressContainer(true);
    }
  }, [showProgressContainer]);

  const updateEncodingInfo = () => {
    if (!localStorage.getItem('video_encoding_progress')) return;
    const { title, progress } = JSON.parse(
      localStorage.getItem('video_encoding_progress')
    );
    setEncodingProgress(progress);
    setFileName(title);
  };

  return (
    <div className={styles.container}>
      <div
        ref={progressContainer}
        style={{
          opacity: 0,
          display: `${showProgressContainer ? 'flex' : 'none'}`,
        }}
      >
        <PostUploadProgress
          encodingProgress={encodingProgress}
          fileName={fileName}
        />
      </div>

      <div>
        <CreatePost
          setShowProgressContainer={setShowProgressContainer}
          showProgressContainer={showProgressContainer}
        />
      </div>
      {posts.map((post, index) => {
        if (
          !post.isImg &&
          !post.video &&
          post.user._id === useAuth().user._id
        ) {
          isVideoEncoding.current = true;
        }
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
