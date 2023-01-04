
import styles from '../styles/css/home/main.module.css';
import avatar from '../styles/memojis/memo3.png';
import likeWhite from '../styles/icon/heartwhite.png';




function Comment({comment}) {
    
    return (
        <div className={styles.commentDisplay}>
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
                <div className={styles.commentLikeButton}>
                    <img src={likeWhite} className={styles.iconBg}/>
                    <p className={styles.likeCount}>{comment.likes.length}</p>
                </div>
                
            </div>

            
            

            
        </div>
    );
}

export default Comment;
