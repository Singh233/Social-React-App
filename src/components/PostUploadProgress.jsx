import { Avatar, Box } from '@mui/material';
import LinearProgress from '@mui/joy/LinearProgress';

import React from 'react';
import videoIcon from '../styles/icon/video.png';

import styles from '../styles/css/postUploadProgress.module.scss';

export default function PostUploadProgress({ encodingProgress, fileName }) {
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
          <p className={styles.progressPercent}>
            {encodingProgress === 0
              ? 'In queue'
              : encodingProgress === 100
              ? 'Almost there!'
              : encodingProgress + '%'}
          </p>
          <LinearProgress
            determinate
            value={encodingProgress}
            className={styles.linearProgress}
          />
          <div className={styles.info}>
            <p>File</p>
            <span>{fileName && fileName.substring(0, 15)}</span>
            <p>is processing...</p>
          </div>
        </div>
      </Box>
    </Box>
  );
}
