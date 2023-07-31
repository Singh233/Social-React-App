import styles from '../styles/css/home/main.module.css';
import avatar from '../styles/memojis/memo3.png';
import likeWhite from '../styles/icon/heartwhite.png';
import likeFill from '../styles/icon/heartfill.png';

import { deleteComment, toggleLike } from '../api';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import moment from 'moment';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';

function Comment({ comment, postId }) {
  const posts = usePosts();
  const auth = useAuth();

  const [likes, setLikes] = useState(comment.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [isActive, setIsActive] = useState(false);


  useEffect(() => {
    // check if the comment is liked by the user
    for (let like of comment.likes) {
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

    const response = await toggleLike(comment._id, 'Comment');

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
    const response = await deleteComment(comment._id);

    if (response.success) {
      posts.deleteComment(comment._id, postId);
      toast.success('Comment deleted successfully!');
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className={styles.commentDisplay}>
      <Link to={`/users/profile/${comment.user._id}`}>
        <img
          style={{ height: 50, width: 50 }}
          src={avatar}
          className={styles.commentAvatar}
        />
      </Link>
      <div className={styles.middleSection}>
        <div className={styles.upper}>
          <p className={styles.commentUserName}> {comment.user.name} </p>
          <p className={styles.commentUserContent}> {comment.content} </p>
        </div>

        <div className={styles.bottom}>
          <p className={styles.time}>{moment(comment.createdAt).fromNow()}</p>
          {/* <p >reply</p>    */}
          {comment.user._id == auth.user._id && (
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
  );
}

export default Comment;
