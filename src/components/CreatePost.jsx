import styles from '../styles/css/home/createpost.module.css';
import { useRef, useState } from 'react';
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
import FilePondPluginMediaPreview from 'filepond-plugin-media-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';
import { Box } from '@mui/material';
import Button from '@mui/joy/Button';

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginMediaPreview
);

const CreatePost = ({ setShowProgressContainer, showProgressContainer }) => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState([]);
  const [showFileUpload, setShowFileUpload] = useState(true);
  const [addingPost, setAddingPost] = useState(false);
  const posts = usePosts();
  const auth = useAuth();
  const fileName = useRef('');
  const [fileType, setFileType] = useState('');

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

  const handleAddPost = async () => {
    // validate the post
    if (caption.length < 1) {
      toast.error('Caption cannot be empty');
      return;
    }
    // validate the file
    if (file.length < 1) {
      toast.error('Please select a file');
      return;
    }

    if (showProgressContainer) {
      toast.error('Only one file upload at a time is allowed!');
      return;
    }

    setAddingPost(true);

    const response = await toast.promise(addPost(caption, file), {
      loading: 'Uploading post...',
      success: 'Post uploaded successfully',
      error: 'Please try again later!',
    });

    setCaption('');
    if (fileType === 'image' && response.success) {
      auth.updateUserPosts(true, response.data.post);
      setTimeout(() => {
        posts.addPostToState(response.data.post);
      }, 700);
    } else {
      const data = {
        title: fileName.current,
        progress: 0,
      };
      localStorage.setItem('video_encoding_progress', JSON.stringify(data));
      setShowProgressContainer(true);
    }

    setAddingPost(false);

    // clear the file input
    setFile([]);
  };

  const handleAddPostClick = throttle(handleAddPost, 1000);

  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
  };

  return (
    <div id="new-post-form" className={styles.container}>
      <img className={styles.avatar} src={avatar} />
      <textarea
        placeholder="What's happening?"
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
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
              fileItems.map((fileItem) => {
                fileName.current = fileItem.file.name;
                if (fileItem.file.type.includes('video')) {
                  setFileType('video');
                } else {
                  setFileType('image');
                }
              });
              if (fileItems.length === 0) {
                setFileType('');
              }
            }}
            allowMultiple={false}
            maxFiles={1}
            allowFileTypeValidation={true}
            acceptedFileTypes={['image/*', 'video/*']}
            allowFileSizeValidation={true}
            maxFileSize={'100MB'}
            name="filepond" /* sets the file input name, it's filepond by default */
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
        </div>
      }

      <div className={styles.buttons}>
        <button
          className={`${styles.photoButton} ${
            fileType === 'image' && styles.active
          }`}
          onClick={toggleFileUpload}
          disabled={addingPost}
        >
          <img className={styles.icon} src={photoIcon} />
          <p>Photo</p>
        </button>
        {/* <p className={styles.info}>or</p>     */}
        <button
          className={`${styles.videoButton}
          ${fileType === 'video' && styles.active}`}
          onClick={toggleFileUpload}
          disabled={addingPost}
        >
          <img className={styles.icon} src={videoIcon} />
          <p>Video</p>
        </button>

        {/* <button
          className={styles.postButton}
          onClick={handleAddPostClick}
          disabled={addingPost}
        >
          <p>{addingPost ? 'Adding' : 'Post'}</p>

          <FontAwesomeIcon className={styles.arrowIcon} icon={faArrowRight} />
        </button> */}
        <Button
          onClick={handleAddPostClick}
          loading={addingPost ? true : false}
          variant="solid"
          className={styles.postButtonNew}
        >
          Post
          <FontAwesomeIcon className={styles.arrowIcon} icon={faArrowRight} />
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
