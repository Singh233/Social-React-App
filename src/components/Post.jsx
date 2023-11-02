import styles from '../styles/css/home/main.module.css';
import { Link } from 'react-router-dom';
import { lazy, useEffect, useRef, useState } from 'react';
import {
  addComment,
  deletePost,
  savePost,
  toggleLike,
  unsavePost,
} from '../api';
import toast from 'react-hot-toast';

import env from '../utils/env';

import explore from '../styles/icon/explore.png';
import save from '../styles/icon/bookmark.png';
import saveFill from '../styles/icon/bookmarkfill.png';
import like from '../styles/icon/heartblack.png';
import send from '../styles/icon/send2.png';
import likeWhite from '../styles/icon/heartwhite.png';
import likeFill from '../styles/icon/heartfill.png';
import comment from '../styles/icon/document.png';

import dummyImg from '../styles/img/dummy.jpeg';
import avatar from '../styles/memojis/memo3.png';
import 'animate.css';

import Comment from './Comment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';
import VideoJS, { ReactPlayerWrapper } from './ReactPlayerWrapper';
import ReactPlayer from 'react-player';

const Post = ({ post }) => {
  const [expandMenu, setExpandMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [likes, setLikes] = useState(post.likes.length);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false); // State to track if the image is loaded or not

  const posts = usePosts();
  const auth = useAuth();
  const playerRef = useRef(null);

  const videoOptions = {
    autoplay: true,
    controls: true,
    responsive: false,
    fluid: true,
    sources: [
      {
        src:
          !post.isImg && post.video
            ? `https://storage.googleapis.com/users_videos_bucket/${
                post.video.qualities[
                  post.video.qualities.findIndex(
                    (ele) => ele.quality === 'high'
                  )
                ].videoPath
              }/high.m3u8`
            : '',
        type: 'application/x-mpegURL',
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  useEffect(() => {
    // check if the post is liked by the user
    for (let like of post.likes) {
      if (like.user == auth.user._id) {
        setIsLiked(true);
      }
    }

    // check if the post is saved by the user
    for (let savedPost of auth.user.savedPosts) {
      if (savedPost !== null && savedPost._id === post._id) {
        setIsSaved(true);
      }
    }

    const img = document.querySelector(`.${styles.blurLoad} img`);

    // Function to handle the image load event
    const handleLoaded = () => {
      setImgLoaded(true);
    };

    if (img && img.complete) {
      handleLoaded();
    } else if (img) {
      img.addEventListener('load', handleLoaded);
    }

    return () => {
      if (img) img.removeEventListener('load', handleLoaded);
    };
  }, []);

  const handleCreateCommentClick = async () => {
    if (commentContent.length < 1) {
      toast.error('Comment cannot be empty');
      return;
    }

    setLoading(true);
    // console.log('inside comment')

    const response = await addComment(commentContent, post._id);

    if (response.success) {
      setCommentContent('');
      posts.addComment(response.data.comment, post._id);
      toast.success('Comment added successfully!');
    } else {
      toast.error(response.message);
    }

    setLoading(false);
  };

  const handlePostLikeClick = async () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
      posts.handlePostDislike(post, auth.user);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
      posts.handlePostLike(post, auth.user);
    }
    setIsActive(true);

    const response = await toggleLike(post._id, 'Post');

    if (response.success) {
      if (response.data.deleted) {
        // toast.success("Like removed!");
        // posts.handlePostDislike(post, auth.user);
      } else {
        // toast.success("Like added!");
        // posts.handlePostLike(post, auth.user);
      }
    } else {
      toast.error(response.message);

      if (isLiked) {
        setLikes(likes - 1);
        setIsLiked(false);
      } else {
        setLikes(likes + 1);
        setIsLiked(true);
      }
    }
    setTimeout(() => {
      setIsActive(false);
    }, 500);
  };

  // handle delete post click
  const handleDeletePostClick = async () => {
    // const response = await deletePost(post._id);

    const response = await toast.promise(deletePost(post._id), {
      loading: 'Deleting post...',
      success: <b>Post deleted successfully!</b>,
      error: <b>Failed to delete post!</b>,
    });

    if (response.success) {
      posts.deletePost(post._id);
      auth.updateUserPosts(false, response.data.post);
    } else {
      toast.error(response.message);
    }
  };

  // handle post save click
  const handlePostSaveClick = async () => {
    if (isSaved) {
      setIsSaved(false);
      toast.success('Post removed from saved posts!');
    } else {
      setIsSaved(true);
      toast.success('Post saved successfully!');
    }

    const response = isSaved
      ? await auth.handleUnsavePost(post._id)
      : await auth.handleSavePost(post._id);

    if (!response && !response.success) {
      setIsSaved(isSaved ? true : false);
      toast.error('Something went wrong!');
    }
  };

  return (
    <div
      id={post._id}
      className={`${styles.displayPosts} animate__animated animate__fadeIn`}
      key={`post-${post._id}`}
    >
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img style={{ height: 50, width: 50 }} src={avatar} />
          {post.user._id === auth.user._id ? (
            <Link to="/settings">{post.user.name}</Link>
          ) : (
            <Link
              to={{
                pathname: `/users/profile/${post.user._id}`,
              }}
              state={{ user: post.user }}
            >
              {post.user.name}
            </Link>
          )}
        </div>

        <div className={styles.menuButton}>
          <img
            onClick={() => setExpandMenu(!expandMenu)}
            src={explore}
            className={`${styles.iconBg} ${styles.blurBg}`}
          />
        </div>
      </div>

      <div className={styles.post}>
        {post.isImg ? (
          <div
            className={`${styles.blurLoad} ${imgLoaded ? styles.loaded : ''}`}
            style={{ backgroundImage: `url(${post.thumbnail})` }}
          >
            <img
              loading="lazy"
              onDoubleClick={handlePostLikeClick}
              src={post.imgPath ? post.imgPath : dummyImg}
            />
          </div>
        ) : (
          // <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          <ReactPlayerWrapper src={videoOptions.sources[0].src} />
        )}
      </div>

      <div className={styles.actions}>
        <div
          className={`${
            expandMenu
              ? styles.menuExpand +
                ' animate__animated animate__faster animate__fadeInUp'
              : styles.hide
          }`}
        >
          <FontAwesomeIcon
            icon={faXmark}
            className={styles.closeIcon}
            onClick={() => setExpandMenu(!expandMenu)}
          />
          <div className={styles.menuItem}>
            {post.user._id == auth.user._id && (
              <p onClick={handleDeletePostClick} className={styles.delete}>
                {' '}
                <FontAwesomeIcon
                  icon={faTrash}
                  className={`${styles.icon} `}
                />{' '}
                Delete Post
              </p>
            )}
            <p>
              {post.user._id === auth.user._id ? (
                <Link to="/settings">
                  <FontAwesomeIcon
                    icon={faUser}
                    className={`${styles.icon} `}
                  />
                  Go to Profile
                </Link>
              ) : (
                <Link to={`/users/profile/${post.user._id}`}>
                  <FontAwesomeIcon
                    icon={faUser}
                    className={`${styles.icon} `}
                  />
                  Go to Profile
                </Link>
              )}
            </p>
          </div>
        </div>

        <div className={styles.leftIcons}>
          <div
            onClick={handlePostLikeClick}
            className={` ${styles.likeButton}`}
          >
            <img
              src={`${isLiked ? likeFill : like}`}
              className={`animate__animated ${
                isActive ? 'animate__bounceIn' : ''
              }  ${styles.iconBg}`}
            />
            <p className={styles.likeCount}>{likes}</p>
          </div>

          <div className={styles.commentButton}>
            <img src={comment} className={styles.iconBg} />
            <p className={styles.likeCount}>{post.comments.length}</p>
          </div>
        </div>

        <div className={styles.rightIcons}>
          <div onClick={handlePostSaveClick} className={styles.saveButton}>
            <img
              src={`${isSaved ? saveFill : save}`}
              className={styles.iconBg}
            />
          </div>
        </div>
      </div>

      <div className={styles.postContent}>
        <p className={styles.nameAndContent}>
          {post.user.name}&nbsp; -<span>{post.caption}</span>
        </p>
        {/* <p className={styles.text}>{post.caption}</p> */}
        {/* <div className={styles.bottom}>
                    <p >3m</p>
                    <p >reply</p>                            

                </div> */}
        <p className={styles.time}>{moment(post.createdAt).fromNow()}</p>
      </div>

      <div className={styles.comments}>
        <div className={styles.postComment}>
          <input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateCommentClick();
              }
            }}
            onChange={(e) => setCommentContent(e.target.value)}
            value={commentContent}
            placeholder="Add a comment"
          />
          <img
            onClick={handleCreateCommentClick}
            src={send}
            className={styles.sendIcon}
          />
        </div>

        {post.comments.map((comment, index) => (
          <Comment
            postId={post._id}
            comment={comment}
            key={`comment-${comment._id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Post;
