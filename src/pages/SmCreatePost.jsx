import React from 'react';

import CreatePost from '../components/CreatePost';
import styles from '../styles/css/smCreatePost.module.scss';

export default function SmCreatePost() {
  return (
    <div className={styles.container}>

      <CreatePost />

      <div className={styles.footer}>
        <p>🎉 Post something to share with your friends and family</p>
      </div>
    </div>
  );
}
