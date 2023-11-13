import { Avatar, Box, LinearProgress } from '@mui/material';
import React from 'react';
import videoIcon from '../styles/icon/video.png';

import styles from '../styles/css/postUploadProgress.module.scss';

export default function PostUploadProgress() {
  return (
    <Box className={styles.container}>
      <div className={styles.heading}>
        <Avatar alt="S S" src={videoIcon} />
        <p>Your video is being processed</p>
      </div>
      <p className={styles.subHeading}>
        You can scroll the feed or close the tab.
      </p>
      <Box className={styles.progressCard}>
        <div className={styles.progress}>
          <div className={styles.info}>
            <p>File</p>
            <span>example123.mp4</span>
            <p>is processing...</p>
          </div>
          <LinearProgress
            variant="determinate"
            value={70}
            className={styles.linearProgress}
          />
        </div>
      </Box>
    </Box>
  );
}
