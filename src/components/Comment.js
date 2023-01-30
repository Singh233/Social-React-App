
import styles from '../styles/css/home/main.module.css';
import avatar from '../styles/memojis/memo3.png';
import likeWhite from '../styles/icon/heartwhite.png';
import likeFill from '../styles/icon/heartfill.png';

import { toggleLike } from '../api';
import { useState } from 'react';
import { toast } from 'react-hot-toast';



function Comment({comment}) {

    const [likes, setLikes] = useState(comment.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleCommentLikeClick = async () => {

        const response = await toggleLike(comment._id, 'Comment');

        if (response.success) {
            if (response.data.deleted) {
                toast.success("Like removed!");
                setLikes(likes - 1);
                setIsLiked(false);

            } else {
                toast.success("Like added!");
                setLikes(likes + 1);
                setIsLiked(true);

            }
            setIsActive(true);

            
        } else {
            toast.error(response.message);
        }

        setTimeout(() => {
            setIsActive(false);
        }, 1000);
    }
    
    return (
        <div key={`comment-${comment._id}`} className={styles.commentDisplay}>
            <img style={{height: 50, width: 50}} src={avatar} className={styles.commentAvatar} />
            <div className={styles.middleSection}>
                <div className={styles.upper}>
                    <p className={styles.commentUserName}> {comment.user.name} </p>
                    <p className={styles.commentUserContent}> {comment.content}  </p>
                </div>

                <div className={styles.bottom}>
                    <p >3m</p>
                    <p >reply</p>                            

                </div>
                
            </div>

            <div>
                <div onClick={handleCommentLikeClick}  className={`animate__animated animate__fadeInDown ${styles.commentLikeButton}`}>
                    <img src={`${isLiked ? likeFill : likeWhite}`} className={`animate__animated ${isActive ? 'animate__bounceIn' : ''}  ${styles.iconBg}`}/>
                    <p className={styles.likeCount}>{likes}</p>
                </div>
                
            </div>

            
            

            
        </div>
    );
}

export default Comment;
