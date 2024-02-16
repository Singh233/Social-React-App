import React, { useEffect, useState } from 'react';
import { Post } from '../components';
import { getSinglePost } from '../api';

import styles from '../styles/css/singlePost.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import Skeleton from '@mui/joy/Skeleton';
import Typography from '@mui/joy/Typography';
import PostCardSkeleton from '../components/PostCardSkeleton';
import { toast } from 'sonner';

export default function SinglePost() {
  const [post, setSinglePost] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPost = async () => {
    const url = window.location.href.split('/');
    const postId = url[url.length - 1];

    const toastId = toast.loading('Loading...');

    const response = await getSinglePost(postId);
    if (response) {
      setSinglePost(response.data.post);
      setLoading(false);
      toast.success('Post fetched', {
        id: toastId,
      });
      return;
    }
    toast.error('Something went wrong!', {
      id: toastId,
    });
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
