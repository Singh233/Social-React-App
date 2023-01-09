import PropTypes from 'prop-types';
import Comment from '../../components/Comment';

import styles from '../../styles/css/home/main.module.css';
import explore from '../../styles/icon/explore.png';
import save from '../../styles/icon/bookmark.png';
import like from '../../styles/icon/heartblack.png';
import likeWhite from '../../styles/icon/heartwhite.png';
import likeFill from '../../styles/icon/heartfill.png';
import comment from '../../styles/icon/document.png';

import dummyImg from '../../styles/img/dummy.jpeg';
import avatar from '../../styles/memojis/memo3.png';

import { onHover } from '../../styles/js/main.js';
import { useEffect } from 'react';





const Main = ({posts}) => {

    // useEffect(() => {
    //     return () => {
    //         onHover();
    //     }
        
    // }, []);


    return (


        <div className={styles.container}>

        {posts.map((post, index) => (
            <div className={styles.displayPosts} key={post._id}>

            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <img style={{height: 50, width: 50}} src={avatar} />
                    <p>{post.user.name}</p>
                </div>

                <div className={styles.menuButton}>
                    <img src={explore} className={`${styles.iconBg} ${styles.blurBg}`}/>
                </div>
            </div>

            <div className={styles.post}>
                <img src={dummyImg} />
            </div>

            <div className={styles.actions}>
                <div className={styles.leftIcons}>
                    <div className={styles.likeButton}>
                        <img src={like} className={styles.iconBg}/>
                        <p className={styles.likeCount}>{post.likes.length}</p>
                    </div>

                    <div className={styles.commentButton}>
                        <img src={comment} className={styles.iconBg}/>
                        <p className={styles.likeCount}>{post.comments.length}</p>
                    </div>
                </div>

                <div className={styles.rightIcons}>
                    <div className={styles.saveButton}>
                        <img src={save} className={styles.iconBg}/>
                    </div>
                </div>
                

                
            </div>
            <div className={styles.comments}>
                <p className={styles.text}>Comments</p>
                {post.comments.map((comment, index) => (

                    <Comment comment={comment}/>

                ))}
            </div>
        </div>
        ))}
            
            
        </div>
    );
};

Main.propTypes = {
    posts: PropTypes.array.isRequired,
}



export default Main;