import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCirclePause,
  faCirclePlay,
  faVolumeHigh,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion'; // Import Framer Motion

import styles from '../styles/css/reactPlayer.module.scss';
import { BounceLoader } from 'react-spinners';
import { useAuth } from '../hooks/useAuth';

export const ReactPlayerWrapper = ({ src, expandMenu, isAuthUser }) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showIcons, setShowIcons] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const { clicked, isTabVisible } = useAuth();

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setShowIcons(!showIcons);
  };
  const toggleSound = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };
  useEffect(() => {
    // ... (your existing code)

    // Create an Intersection Observer to track Post components
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Play the video when it enters the viewport
            if (clicked) {
              setIsPlaying(true);
              setShowIcons(false);
            }
          } else {
            // Pause the video when it exits the viewport
            if (clicked) {
              setIsPlaying(false);
              setShowIcons(true);
            }
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.5 } // Adjust the threshold as needed
    );

    observer.observe(playerRef.current);
    return () => {
      // Cleanup the observer when the component unmounts
      observer.disconnect();
    };
  }, [clicked]);

  useEffect(() => {
    if (!isTabVisible) {
      setIsPlaying(false);
      setShowIcons(true);
    }
  }, [isTabVisible]);

  return (
    <div
      ref={playerRef}
      className={styles.reactPlayerWrapper}
      onClick={togglePlay}
    >
      {isBuffering ? (
        <BounceLoader color="#ffffff" className={styles.loader} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showIcons ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FontAwesomeIcon icon={faCirclePlay} />
        </motion.div>
      )}

      <motion.div
        animate={{
          y: expandMenu && isAuthUser ? 150 : expandMenu ? 90 : 0,
        }}
        layout
        transition={{ duration: 0.2 }}
        className={styles.muteUnmuteButton}
        onClick={toggleSound}
      >
        <FontAwesomeIcon icon={isMuted ? faVolumeXmark : faVolumeHigh} />
      </motion.div>

      <ReactPlayer
        url={src}
        playsinline
        width={window.innerWidth < 600 ? 370 : 400}
        style={{ minHeight: 500, maxHeight: 700 }}
        height="100%"
        controls={false} // Disable default controls
        muted={isMuted}
        playing={isPlaying}
        loop={true}
        onReady={(player) => {
          setIsBuffering(false);
        }}
        onStart={() => {}}
        onBuffer={() => {
          setIsBuffering(true);
        }}
        onBufferEnd={() => {
          setIsBuffering(false);
        }}
      />
    </div>
  );
};

export default ReactPlayerWrapper;
