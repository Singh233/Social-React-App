import styles from '../styles/css/home/createpost.module.css';
import { useState } from 'react';
import { addPost } from '../api';
import { toast } from 'react-hot-toast';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import avatar from '../styles/memojis/memo2.png';
import photoIcon from '../styles/icon/photo.png';
import videoIcon from '../styles/icon/video.png';
import postIcon from '../styles/icon/send2.png';
import 'animate.css';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';
// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import '../styles/css/home/filepond.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';
// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

const CreatePost = () => {
  const [post, setPost] = useState('');
  const [file, setFile] = useState([]);
  const [showFileUpload, setShowFileUpload] = useState(true);
  const [addingPost, setAddingPost] = useState(false);
  const posts = usePosts();
  const auth = useAuth();

  // Throttling the add post function
  const throttle = (func, limit) => {
    let inThrottle = false;

    return function () {
      if (inThrottle) return;
      inThrottle = true;
      func(...arguments);
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    };
  };

  const addPostFunction = async () => {
    // validate the post
    if (post.length < 1) {
      toast.error('Caption cannot be empty');
      return;
    }
    // validate the file
    if (file.length < 1) {
      toast.error('Please select a file');
      return;
    }

    setAddingPost(true);

    const response = await toast.promise(addPost(post, file), {
      loading: 'Uploading post...',
      success: 'Post created successfully',
      error: 'Please try again later!',
    });

    if (response.success) {
      setPost('');
      auth.updateUserPosts(true, response.data.post);
      setTimeout(() => {
        posts.addPostToState(response.data.post);
      }, 700);
    }

    setAddingPost(false);

    // clear the file input
    setFile([]);
  };

  const handleAddPostClick = throttle(addPostFunction, 1000);

  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
  };

  return (
    <div id="new-post-form" className={styles.container}>
      <img className={styles.avatar} src={avatar} />
      <textarea
        placeholder="What's happening?"
        onChange={(e) => setPost(e.target.value)}
        value={post}
        rows="1"
        name="content"
      />

      {/* Take file input */}
      {/* <input 
                type="file" 
                id="myfile" 
                name='filepond'
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files[0])} 
                required /> */}

      {/* FilePond */}
      {
        <div
          className={`${
            showFileUpload && styles.hide
          } animate__animated animate__fadeIn`}
        >
          <FilePond
            files={file}
            onupdatefiles={(fileItems) => {
              // Set currently active file objects to this.state
              setFile(fileItems.map((fileItem) => fileItem.file));
            }}
            allowMultiple={false}
            maxFiles={1}
            allowFileTypeValidation={true}
            acceptedFileTypes={['image/*']}
            allowFileSizeValidation={true}
            maxFileSize={'5MB'}
            name="filepond" /* sets the file input name, it's filepond by default */
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
        </div>
      }

      <div className={styles.buttons}>
        <button
          className={`${styles.photoButton} ${
            !showFileUpload && styles.active
          }`}
          onClick={toggleFileUpload}
          disabled={addingPost}
        >
          <img className={styles.icon} src={photoIcon} />
          <p>Photo</p>
        </button>
        {/* <p className={styles.info}>or</p>     */}
        <button
          className={styles.videoButton}
          onClick={() => {
            toast.success('Video upload is coming soon!');
            toggleFileUpload();
          }}
          disabled={addingPost}
        >
          <img className={styles.icon} src={videoIcon} />
          <p>Video</p>
        </button>

        <button
          className={styles.postButton}
          onClick={handleAddPostClick}
          disabled={addingPost}
        >
          <p>{addingPost ? 'Adding' : 'Post'}</p>

          <FontAwesomeIcon className={styles.arrowIcon} icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
