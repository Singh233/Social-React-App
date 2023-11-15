import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import CreatePost from '../components/CreatePost';
import styles from '../styles/css/smCreatePost.module.scss';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import gsap from 'gsap';
import PostUploadProgress from '../components/PostUploadProgress';
import toast from 'react-hot-toast';

export default function SmCreatePost() {
  const { user, socket, updateUserPosts } = useAuth();
  const { posts, addPostToState, isVideoProcessing, setIsVideoProcessing } =
    usePosts();
  const progressContainer = useRef();
  const postsState = usePosts();
  const [isScrollable, setIsScrollable] = useState(true);
  const [showProgressContainer, setShowProgressContainer] = useState(false);
  const [encodingProgress, setEncodingProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const isVideoEncoding = useRef(false);

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
      setIsVideoProcessing(false);
      localStorage.removeItem('video_encoding_progress');
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
        onInterrupt: () => {
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

  useEffect(() => {
    posts.map((post, index) => {
      if (!post.isImg && !post.video && post.user._id === user._id) {
        isVideoEncoding.current = true;
      }
    });
  }, []);

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

      <div className={styles.footer}>
        <p>🎉 Post something to share with your friends and family</p>
      </div>
    </div>
  );
}
