import styles from '../styles/css/home/main.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { addComment, deletePost, toggleLike } from '../api';
import toast from 'react-hot-toast';

import env from '../utils/env';

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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';



const Post = ({post}) => {
    
    const [expandMenu, setExpandMenu] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [likes, setLikes] = useState(post.likes.length);
    const [commentContent, setCommentContent] = useState('');
    const [loading, setLoading] = useState(false);
    const posts = usePosts();
    const auth = useAuth();

    useEffect(() => {
        // check if the post is liked by the user
        for (let like of post.likes) {
            if (like.user == auth.user._id) {
                setIsLiked(true);
            }
        }

    }, []);


    const handleCreateCommentClick = async () => {
        setLoading(true);
        // console.log('inside comment')

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
        
        if (isLiked) {
            setLikes(likes - 1);
            setIsLiked(false);
        } else {
            setLikes(likes + 1);
            setIsLiked(true);
        }
        setIsActive(true);

        const response = await toggleLike(post._id, 'Post');

        if (response.success) {
            if (response.data.deleted) {
                // toast.success("Like removed!");
            } else {
                // toast.success("Like added!");
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
        

    }

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
        } else {
            toast.error(response.message);
        }

        auth.updateUserPosts(false, response.data.post);
    }


    return (
        <div className={`${styles.displayPosts} animate__animated animate__fadeIn`} key={`post-${post._id}`}>

            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <img style={{height: 50, width: 50}} src={avatar} />
                    {
                        post.user._id === auth.user._id ? (
                            <Link to='/settings'>{post.user.name}</Link>
                        ) : (
                            <Link to={{
                                pathname: `/users/profile/${post.user._id}`,
                            }} state={{user: post.user}}>
                                {post.user.name}
                            </Link>
                        )
                    }
                    
                </div>

                <div className={styles.menuButton}>
                    <img onClick={() => setExpandMenu(!expandMenu)} src={explore} className={`${styles.iconBg} ${styles.blurBg}`}/>
                </div>

                
            </div>

            

            <div className={styles.post}>
                <img onDoubleClick={handlePostLikeClick} src={post.myfile ? env.file_url + post.myfile : dummyImg} />

                
            </div>

            <div className={styles.actions}>

                <div className={`${expandMenu ? styles.menuExpand + ' animate__animated animate__faster animate__fadeInUp' : styles.hide}`}>
                    <FontAwesomeIcon icon={faXmark} className={styles.closeIcon} onClick={() => setExpandMenu(!expandMenu)} />
                    <div className={styles.menuItem}> 
                        {
                            post.user._id == auth.user._id && (
                                <p onClick={handleDeletePostClick} className={styles.delete}> <FontAwesomeIcon icon={faTrash} className={`${styles.icon} `} /> Delete Post</p>
                            )
                        }
                        <p>
                            {
                                post.user._id === auth.user._id ? (
                                    <Link to='/settings'>
                                        <FontAwesomeIcon icon={faUser} className={`${styles.icon} `} />Go to Profile
                                    </Link>
                                ) : (
                                    <Link to={`/users/profile/${post.user._id}`}>
                                        <FontAwesomeIcon icon={faUser} className={`${styles.icon} `} />Go to Profile
                                    </Link>
                                )
                            }
                        </p>
                        
                    </div>
                </div>


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
                    <div onClick={() => toast.success('Coming soon!')} className={styles.saveButton}>
                        <img src={save} className={styles.iconBg}/>
                    </div>
                </div>
                

                
            </div>

            <div className={styles.postContent}>
                <p className={styles.nameAndContent}>{post.user.name}&nbsp; -<span>{post.content}</span></p>
                {/* <p className={styles.text}>{post.content}</p> */}
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
                        placeholder='Add a comment'
                    />
                    <img onClick={handleCreateCommentClick} src={send} className={styles.sendIcon} /> 
                </div>
                
                {post.comments.map((comment, index) => (

                    <Comment postId={post._id} comment={comment} key={`comment-${comment._id}`}/>

                ))}
            </div>
        </div>
    )
}

export default Post;