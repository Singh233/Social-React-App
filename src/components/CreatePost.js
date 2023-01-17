

import { useState } from 'react';
import { addPost } from '../api';
import styles from '../styles/css/home/home.module.css'
import { toast } from 'react-hot-toast';
import { usePosts } from '../hooks';


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
        <div>
            CreatePost
            <textarea 
                onChange={(e) => setPost(e.target.value)}
                value={post}
            />

            <div>
                <button onClick={handleAddPostClick} disabled={addingPost}>
                    {addingPost ? 'Adding post' : 'Add post'}
                </button>
            </div>
        </div>
    )
}


export default CreatePost;