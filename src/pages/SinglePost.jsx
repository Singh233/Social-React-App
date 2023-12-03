import React, { useEffect, useState } from 'react';
import { Post } from '../components';
import { getSinglePost } from '../api';
import toast from 'react-hot-toast';

import styles from '../styles/css/singlePost.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import Skeleton from '@mui/joy/Skeleton';
import Typography from '@mui/joy/Typography';
import PostCardSkeleton from '../components/PostCardSkeleton';

export default function SinglePost() {
  const [post, setSinglePost] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPost = async () => {
    const url = window.location.href.split('/');
    const postId = url[url.length - 1];

    const response = await toast.promise(getSinglePost(postId), {
      loading: 'loading...',
      success: <b>Post loaded!</b>,
      error: <b>Something went wrong!</b>,
    });
    if (response) {
      setSinglePost(response.data.post);
      setLoading(false);
      return;
    }
    toast.error('Something went wrong!');
  };

  useEffect(() => {
    getPost();
  }, []);
  return (
    <div className={styles.container}>
      {loading ? (
        <PostCardSkeleton />
      ) : post ? (
        <Post
          post={post}
          setSinglePost={setSinglePost}
          key={`post-${post._id}`}
        />
      ) : (
        <p className={styles.noPost}>
          <FontAwesomeIcon icon={faBan} />
          This post has been deleted or doesn't exist!
        </p>
      )}
    </div>
  );
}
