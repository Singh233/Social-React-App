import styles from '../styles/css/home/main.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { addComment, toggleLike } from '../api';
import toast from 'react-hot-toast';

import explore from '../styles/icon/explore.png';
import save from '../styles/icon/bookmark.png';
import like from '../styles/icon/heartblack.png';
import send from '../styles/icon/send2.png';
import likeWhite from '../styles/icon/heartwhite.png';
import likeFill from '../styles/icon/heartfill.png';
import comment from '../styles/icon/document.png';

import dummyImg from '../styles/img/dummy.jpeg';
import avatar from '../styles/memojis/memo3.png';
import 'animate.css';


import Comment from './Comment'
import { useAuth, usePosts } from '../hooks';


const Post = ({post}) => {

    const [isLiked, setIsLiked] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [likes, setLikes] = useState(post.likes.length);
    const [commentContent, setCommentContent] = useState('');
    const [loading, setLoading] = useState(false);
    const posts = usePosts();
    const auth = useAuth();

    useEffect(() => {
        // console.log(post.likes);
        // for (let like of post.likes) {
        //     console.log(like, '****', auth.user);
        //     if (like == auth.user._id) {
        //         setIsLiked(true);
        //     }
        // }
    }, []);


    const handleCreateCommentClick = async () => {
        setLoading(true);
        console.log('inside comment')

        const response = await addComment(commentContent, post._id);

        if (response.success) {
            setCommentContent('');
            posts.addComment(response.data.comment, post._id);
            toast.success("Comment added successfully!");
        } else {
            toast.error(response.message);
        }



        setLoading(false);
    }


    const handlePostLikeClick = async () => {
        

        const response = await toggleLike(post._id, 'Post');

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
        <div className={styles.displayPosts} key={`post-${post._id}`}>

            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <img style={{height: 50, width: 50}} src={avatar} />
                    <Link to={{
                        pathname: `/user/${post.user._id}`,
                    }} state={{user: post.user}}>
                        {post.user.name}
                    </Link>
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
                    <div onClick={handlePostLikeClick} className={` ${styles.likeButton}`}>
                        <img src={`${isLiked ? likeFill : like}`} className={`animate__animated ${isActive ? 'animate__bounceIn' : ''}  ${styles.iconBg}`}/>
                        <p className={styles.likeCount}>{likes}</p>
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

            <div className={styles.postContent}>
                <p className={styles.userName}>{post.user.name}</p>
                <p className={styles.text}>{post.content}</p>
                {/* <div className={styles.bottom}>
                    <p >3m</p>
                    <p >reply</p>                            

                </div> */}
            </div>


            <div className={styles.comments}>
                <div className={styles.postComment}>
                    <input 
                        onChange={(e) => setCommentContent(e.target.value)}
                        value={commentContent}
                        placeholder='Add a comment'
                    />
                    <img onClick={handleCreateCommentClick} src={send} className={styles.sendIcon} /> 
                </div>
                
                {post.comments.map((comment, index) => (

                    <Comment comment={comment}/>

                ))}
            </div>
        </div>
    )
}

export default Post;