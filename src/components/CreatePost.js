
import styles from '../styles/css/home/createpost.module.css';
import { useState } from 'react';
import { addPost } from '../api';
import { toast } from 'react-hot-toast';
import { usePosts } from '../hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import avatar from '../styles/memojis/memo2.png';
import photoIcon from '../styles/icon/photo.png';
import videoIcon from '../styles/icon/video.png';
import postIcon from '../styles/icon/send2.png';


const CreatePost = () => {
    const [post, setPost] = useState('');
    const [addingPost, setAddingPost] = useState(false);
    const posts = usePosts();

    const handleAddPostClick = async () => {
        setAddingPost(true);


        const response = await addPost(post);

        if (response.success) {
            setPost('');
            posts.addPostToState(response.data.post);
            toast.success("Post created successfully");
        } else {
            toast.error(response.message);
        }


        setAddingPost(false);
    }


    return (
        <div className={styles.container}>
            <img  className={styles.avatar} src={avatar} />
            <textarea 
                placeholder="What's happening?"
                onChange={(e) => setPost(e.target.value)}
                value={post}
                rows='1'
            />

            <div className={styles.buttons}>
                <button className={styles.photoButton} onClick={handleAddPostClick} disabled={addingPost}>
                    <img  className={styles.icon} src={photoIcon} />
                    <p>Photo</p>
                    
                </button>    
                <button className={styles.videoButton} onClick={handleAddPostClick} disabled={addingPost}>
                    <img  className={styles.icon} src={videoIcon} />
                    <p>Video</p>
                </button>            
                <button className={styles.postButton} onClick={handleAddPostClick} disabled={addingPost}>
                    <p>{addingPost ? 'Adding' : 'Post'}</p>
                    
                    <FontAwesomeIcon className={styles.arrowIcon}  icon={faArrowRight} />
                </button>
            </div>
        </div>
    )
}


export default CreatePost;