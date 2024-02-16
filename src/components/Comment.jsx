import styles from '../styles/css/home/main.module.css';
import avatar from '../styles/memojis/memo3.png';
import likeWhite from '../styles/icon/heartwhite.png';
import likeFill from '../styles/icon/heartfill.png';

import { deleteComment, toggleLike } from '../api';
import { useEffect, useRef, useState } from 'react';

import moment from 'moment';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

function Comment({ comment, postId }) {
  const posts = usePosts();
  const auth = useAuth();

  const [commentState, setCommentState] = useState(comment);
  const [likes, setLikes] = useState(commentState && commentState.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const isRequestProcessing = useRef(false);
  const timeoutId = useRef(null);
  const toastId = useRef(null);

  useEffect(() => {
    if (!commentState) return;
    // check if the comment is liked by the user
    for (let like of commentState.likes) {
      if (like.user == auth.user._id) {
        setIsLiked(true);
      }
    }
  }, []);

  const handleCommentLikeClick = async () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }

    setIsActive(true);

    const response = await toggleLike(commentState._id, 'Comment');

    if (response.success) {
      if (response.data.deleted) {
        // toast.success('Like removed!');
      } else {
        // toast.success('Like added!');
      }
    } else {
      toast.error(response.message);
      if (isLiked) {
        setLikes(likes + 1);
        setIsLiked(true);
      } else {
        setLikes(likes - 1);
        setIsLiked(false);
      }
    }

    setTimeout(() => {
      setIsActive(false);
    }, 500);
  };

  // handle comment deleq click
  const handleCommentDeleteClick = async () => {
    if (isRequestProcessing.current) {
      toast.loading('Please wait...', {
        id: toastId.current,
      });
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      timeoutId.current = setTimeout(() => {
        if (isRequestProcessing.current)
          toast.loading('Deleting comment...', {
            id: toastId.current,
          });
      }, 1000);

      return;
    }
    isRequestProcessing.current = true;
    toastId.current = toastId.current
      ? toast.loading('Deleting comment...', {
          id: toastId.current,
        })
      : toast.loading('Deleting comment...');

    const response = await deleteComment(commentState._id);
    if (response.success) {
      posts.deleteComment(commentState._id, postId);
      deleteCommentFromState(commentState._id, postId);
      toast.success('Comment deleted!', {
        id: toastId.current,
      });
    } else {
      toast.error(response.message, {
        id: toastId.current,
      });
    }
    isRequestProcessing.current = false;
    clearTimeout(timeoutId.current);
  };

  const deleteCommentFromState = (commentId, postId) => {
    setCommentState(null);
  };

  return (
    commentState && (
      <div className={styles.commentDisplay}>
        <Link to={`/users/profile/${commentState.user._id}`}>
          <img
            style={{ height: 50, width: 50 }}
            src={avatar}
            className={styles.commentAvatar}
          />
        </Link>
        <div className={styles.middleSection}>
          <div className={styles.upper}>
            <p className={styles.commentUserName}> {commentState.user.name} </p>
            <p className={styles.commentUserContent}>
              {' '}
              {commentState.content}{' '}
            </p>
          </div>

          <div className={styles.bottom}>
            <p className={styles.time}>
              {moment(commentState.createdAt).fromNow()}
            </p>
            {/* <p >reply</p>    */}
            {commentState.user._id == auth.user._id && (
              <p
                className={styles.deleteButton}
                onClick={handleCommentDeleteClick}
              >
                delete
              </p>
            )}
          </div>
        </div>

        <div>
          <div
            onClick={handleCommentLikeClick}
            className={`animate__animated animate__fadeInDown ${styles.commentLikeButton}`}
          >
            <img
              src={`${isLiked ? likeFill : likeWhite}`}
              className={`animate__animated ${
                isActive ? 'animate__bounceIn' : ''
              }  ${styles.iconBg}`}
            />
            <p className={styles.likeCount}>{likes}</p>
          </div>
        </div>
      </div>
    )
  );
}

export default Comment;
