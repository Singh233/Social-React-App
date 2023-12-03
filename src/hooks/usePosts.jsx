import { lazy, useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { PostsContext } from '../providers';
import { getPosts, lazyLoadGetPosts } from '../api';

export const usePosts = () => {
  return useContext(PostsContext);
};

export const useProvidePosts = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVideoProcessing, setIsVideoProcessing] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      // console.log('inside fetch posts')
      const response = await getPosts();
      // console.log('response from posts', response);

      if (response.success) {
        setPosts(response.data.posts);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const addPostToState = (post) => {
    const newPosts = [post, ...posts];
    // console.log('newPosts', newPosts)
    setPosts(newPosts);
  };

  const addComment = (comment, id) => {
    const newPosts = posts.map((post) => {
      if (post._id === id) {
        return { ...post, comments: [comment, ...post.comments] };
      }
      return post;
    });
    setPosts(newPosts);
  };

  const deleteComment = (commentId, postId) => {
    const newPosts = posts.map((post) => {
      if (post._id == postId) {
        return {
          ...post,
          comments: post.comments.filter(
            (comment) => comment._id !== commentId
          ),
        };
      }
      return post;
    });
    setPosts(newPosts);
  };

  const deletePost = (id) => {
    const newPosts = posts.filter((post) => post._id !== id);
    setPosts(newPosts);
  };

  // function to handle post like
  const handlePostLike = (post, user) => {
    const newPosts = posts.map((p) => {
      if (p._id === post._id) {
        return {
          ...p,
          likes: [
            ...p.likes,
            { user: user._id, likeable: post._id, onModel: 'Post' },
          ],
        };
      }
      return p;
    });
    setPosts(newPosts);
  };

  const handlePostDislike = (post, user) => {
    const newPosts = posts.map((p) => {
      if (p._id === post._id) {
        return {
          ...p,
          likes: p.likes.filter((like) => like.user !== user._id),
        };
      }
      return p;
    });
    setPosts(newPosts);
  };

  const lazyLoadPosts = async () => {
    const offset = posts.length;
    const limit = 5;
    const response = await lazyLoadGetPosts(offset, limit);

    if (response.success) {
      const newPosts = [...posts, ...response.data.posts];
      setPosts(newPosts);
    }
  };

  return {
    posts,
    loading,
    isVideoProcessing,
    setIsVideoProcessing,
    addPostToState,
    lazyLoadPosts,
    addComment,
    deleteComment,
    handlePostLike,
    handlePostDislike,
    deletePost,
  };
};
